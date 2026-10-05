import {
    FALLBACK_MEDIA_TYPE,
    HOME_PAGE,
    HOME_ROUTE,
    MEDIA_TYPES,
    PAGE_EXTENSION,
} from "#configuration/constants/viewport.constants";
import type { IncomingMessage, ServerResponse } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import type { BuiltSite } from "#types/viewport.types";
import { NO_SERVER_PORT } from "#configuration/strings/viewport.strings";
import { createServer } from "node:https";
import { devCertificate } from "@banes-lab/build-scripts/core/factories/certificate.factory.ts";
import { once } from "node:events";

const LOOPBACK = "127.0.0.1";
const NOT_FOUND = 404;
const OK = 200;

const isFile = function isFile(path: string): boolean {
    return existsSync(path) && statSync(path).isFile();
};

const fileFor = function fileFor(root: string, url: string): string | null {
    const path = decodeURIComponent(new URL(url, `https://${LOOPBACK}`).pathname);
    const direct = normalize(join(root, path));
    if (!direct.startsWith(root)) {
        return null;
    }
    if (isFile(direct)) {
        return direct;
    }
    const page = path === HOME_ROUTE ? join(root, HOME_PAGE) : direct + PAGE_EXTENSION;
    return isFile(page) ? page : null;
};

const respondFrom = function respondFrom(root: string) {
    return function respond(request: IncomingMessage, response: ServerResponse): void {
        const file = fileFor(root, request.url ?? HOME_ROUTE);
        if (file === null) {
            response.statusCode = NOT_FOUND;
            response.end();
            return;
        }
        response.statusCode = OK;
        response.setHeader("Content-Type", MEDIA_TYPES.get(extname(file)) ?? FALLBACK_MEDIA_TYPE);
        response.end(readFileSync(file));
    };
};

export const serveBuiltSite = async function serveBuiltSite(root: string): Promise<BuiltSite> {
    const server = createServer(await devCertificate(), respondFrom(normalize(root)));
    const bound = server.listen(0, LOOPBACK);
    await once(bound, "listening");
    const address = bound.address();
    if (address === null || typeof address === "string") {
        server.close();
        throw new Error(NO_SERVER_PORT);
    }
    return {
        close: (): void => {
            server.close();
        },
        origin: `https://${LOOPBACK}:${String(address.port)}`,
    };
};
