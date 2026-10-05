import {
    ELK_PACKAGE,
    ELK_ROUTE,
    FONT_ROUTE,
    MEDIA_TYPES,
    MERMAID_PACKAGE,
    MERMAID_ROUTE,
} from "#configuration/constants/diagram.constants";
import type { IncomingMessage, ServerResponse } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { NO_STAGE_PORT } from "#configuration/strings/diagram.strings";
import type { Server } from "node:https";
import type { Stage } from "#types/diagram.types";
import { absolutePath } from "@ssot/paths";
import { createServer } from "node:https";
import { devCertificate } from "#core/factories/certificate.factory";
import { fileURLToPath } from "node:url";
import { once } from "node:events";
import { stageMarkup } from "#core/formatters/diagram.formatter";
import { tokenValues } from "#core/converters/diagram.converter";

const LOOPBACK = "127.0.0.1";
const NOT_FOUND = 404;
const OK = 200;

const packageDist = function packageDist(specifier: string): string {
    return dirname(fileURLToPath(import.meta.resolve(specifier)));
};

const serveFile = function serveFile(response: ServerResponse, file: string): void {
    const clean = normalize(file);
    if (!existsSync(clean)) {
        response.statusCode = NOT_FOUND;
        response.end();
        return;
    }
    response.statusCode = OK;
    response.setHeader("Content-Type", MEDIA_TYPES.get(extname(clean)) ?? "application/octet-stream");
    response.end(readFileSync(clean));
};

const routeOf = function routeOf(roots: ReadonlyMap<string, string>, url: string): string | null {
    for (const [route, root] of roots) {
        if (url.startsWith(route)) {
            return join(root, url.slice(route.length));
        }
    }
    return null;
};

const handler = function handler(markup: string, roots: ReadonlyMap<string, string>) {
    return function respond(request: IncomingMessage, response: ServerResponse): void {
        const url = request.url ?? "";
        if (url === "/") {
            response.statusCode = OK;
            response.setHeader("Content-Type", MEDIA_TYPES.get(".html") ?? "");
            response.end(markup);
            return;
        }
        const file = routeOf(roots, url);
        if (file === null) {
            response.statusCode = NOT_FOUND;
            response.end();
            return;
        }
        serveFile(response, file);
    };
};

const listening = async function listening(server: Server): Promise<number> {
    const bound = server.listen(0, LOOPBACK);
    await once(bound, "listening");
    const address = bound.address();
    if (address === null || typeof address === "string") {
        throw new Error(NO_STAGE_PORT);
    }
    return address.port;
};

export const openStage = async function openStage(): Promise<Stage> {
    const tokens = tokenValues(readFileSync(absolutePath("app.tokens"), "utf8"));
    const roots = new Map([
        [MERMAID_ROUTE, packageDist(MERMAID_PACKAGE)],
        [ELK_ROUTE, packageDist(ELK_PACKAGE)],
        [FONT_ROUTE, absolutePath("app.fonts")],
    ]);
    const server = createServer(await devCertificate(), handler(stageMarkup(tokens), roots));
    const port = await listening(server);
    return {
        close: (): void => {
            server.close();
        },
        url: `https://${LOOPBACK}:${String(port)}/`,
    };
};
