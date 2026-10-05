import type { Discovery, SitePhase, SiteState, SiteStep } from "#types/site.types";
import type { Plugin, ResolvedConfig } from "vite";
import { catalogMiddleware, payloadMiddleware } from "#core/coordinators/payload.coordinator";
import { discoverSteps, runPhase } from "#core/pipelines/site.pipeline";
import type { DevState } from "#types/page.types";
import type { DiagramWalk } from "#types/diagram.types";
import { buildCatalog } from "#core/coordinators/catalog.coordinator";
import { composeOntology } from "#core/coordinators/ontology.coordinator";
import { createRelinker } from "#core/coordinators/link.coordinator";
import { discover } from "#core/converters/site.converter";
import { loadFrom } from "#core/loaders/site.loader";
import process from "node:process";

const BUILD_COMMAND = "build";

const initialState = function initialState(config: ResolvedConfig, diagrams: DiagramWalk): SiteState {
    return {
        diagrams,
        mode: config.command === BUILD_COMMAND ? "build" : "serve",
        ontology: null,
        outDir: config.build.outDir,
        root: config.root,
    };
};

const write = function write(line: string): void {
    process.stdout.write(line);
};

interface Held {
    config: ResolvedConfig | null;
    state: SiteState | null;
    steps: readonly SiteStep[];
}

export const sitePlugin = function sitePlugin(diagrams: DiagramWalk): Plugin {
    const held: Held = { config: null, state: null, steps: [] };
    const phase = async function phase(name: SitePhase, state: SiteState): Promise<void> {
        await runPhase(held.steps, name, state, write).then((next) => {
            held.state = next;
        });
    };
    return {
        buildStart: {
            async handler() {
                if (held.config !== null) {
                    await phase("start", initialState(held.config, diagrams));
                }
            },
            order: "pre",
            sequential: true,
        },
        closeBundle: {
            async handler() {
                if (held.state !== null) {
                    await phase("close", held.state);
                }
            },
            sequential: true,
        },
        async configResolved(config) {
            held.config = config;
            held.steps = await discoverSteps();
        },
        configureServer(server) {
            let state: Promise<DevState> | null = null;
            let catalog: Promise<ReadonlyMap<string, string>> | null = null;
            const relink = createRelinker(server.config.root, (error) => {
                server.config.logger.error(String(error));
            });
            server.watcher.on("change", (file) => {
                state = null;
                catalog = null;
                relink(file);
            });
            const current = async (): Promise<DevState> => {
                state ??= loadFrom(server).then((loaded) => ({ discovery: discover(loaded), loaded }));
                return state;
            };
            const discovery = async (): Promise<Discovery> => (await current()).discovery;
            server.middlewares.use(
                catalogMiddleware(discovery, async () => {
                    catalog ??= current().then(
                        async (loaded) =>
                            (
                                await buildCatalog(
                                    loaded.loaded.runner,
                                    loaded.discovery,
                                    loaded.loaded.exportSections,
                                    composeOntology(),
                                )
                            ).files,
                    );
                    return catalog;
                }),
            );
            server.middlewares.use(payloadMiddleware(discovery));
        },
        name: "site",
    };
};
