import type { ModuleImporter, WebModules } from "#types/loader.types";
import { RUNNER_MODULES } from "#configuration/constants/loader.constants";

const load = async function load<Key extends keyof WebModules>(
    runner: ModuleImporter,
    key: Key,
): Promise<WebModules[Key]> {
    return runner.import<WebModules[Key]>(RUNNER_MODULES[key].path);
};

export const loadWebModules = async function loadWebModules(runner: ModuleImporter): Promise<WebModules> {
    const [analyzer, anatomy, company, corpus, evidence, folder, learning, links] = await Promise.all([
        load(runner, "analyzer"),
        load(runner, "anatomy"),
        load(runner, "company"),
        load(runner, "corpus"),
        load(runner, "evidence"),
        load(runner, "folder"),
        load(runner, "learning"),
        load(runner, "links"),
    ]);
    const [markup, matcher, ontology, reference, search, searchConstants, source, vocabulary] = await Promise.all([
        load(runner, "markup"),
        load(runner, "matcher"),
        load(runner, "ontology"),
        load(runner, "reference"),
        load(runner, "search"),
        load(runner, "searchConstants"),
        load(runner, "source"),
        load(runner, "vocabulary"),
    ]);
    const [anatomyConstants, anatomyIds, definition, evidenceConstants] = await Promise.all([
        load(runner, "anatomyConstants"),
        load(runner, "anatomyIds"),
        load(runner, "definition"),
        load(runner, "evidenceConstants"),
    ]);
    return {
        analyzer,
        anatomy,
        anatomyConstants,
        anatomyIds,
        company,
        corpus,
        definition,
        evidence,
        evidenceConstants,
        folder,
        learning,
        links,
        markup,
        matcher,
        ontology,
        reference,
        search,
        searchConstants,
        source,
        vocabulary,
    };
};
