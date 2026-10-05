import type { ListenerSurfaces } from "#types/server.types";
import { loadConfigFromFile } from "vite";
import { notABuildConfig } from "#configuration/strings/server.strings";

export const listenerSurfacesOf = async function listenerSurfacesOf(file: string): Promise<ListenerSurfaces> {
    const loaded = await loadConfigFromFile({ command: "serve", mode: "development" }, file, undefined, "silent");
    if (loaded === null) {
        throw new Error(notABuildConfig(file));
    }
    const { preview, server } = loaded.config;
    return { ...(preview === undefined ? {} : { preview }), ...(server === undefined ? {} : { server }) };
};
