import { SURFACE_ROOT } from "../constants/path.constants.ts";
import { climbsOut, inspectManifests } from "../inspectors/manifest.inspector.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const MANIFEST = SURFACE_ROOT.length === 0 ? "package.json" : `${SURFACE_ROOT}/package.json`;

const CLAIMING = JSON.stringify({
    name: "probe",
    scripts: { generate: "node ../../a-host-framework/bin/generate.ts" },
});

const CONTAINED = JSON.stringify({
    name: "probe",
    scripts: { generate: "node tools/core/entrypoints/pipeline.entrypoint.ts" },
});

function inspecting(root: string): BranchObservation {
    const findings = inspectManifests(root, []);

    return {
        claims: findings.filter((finding) => finding.rule.endsWith("hostClaimingScriptTarget")).length,
        unresolved: findings.filter((finding) => finding.rule.endsWith("unresolvedScriptTarget")).length,
    };
}

export const MANIFEST_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "manifest.inspector",
        branch: "a script target climbing out of the package, which is a claim about a tree this package does not own",
        seed: [{ path: MANIFEST, text: CLAIMING }],
        exercise: (root) => inspecting(root),
        expect: { claims: 1, unresolved: 0 },
    },
    {
        subject: "manifest.inspector",
        branch: "a script target inside the package that does not resolve, which is the other direction of the same walk",
        seed: [{ path: MANIFEST, text: CONTAINED }],
        exercise: (root) => inspecting(root),
        expect: { claims: 0, unresolved: 1 },
    },
    {
        subject: "manifest.inspector",
        branch: "a token whose text merely contains the climb rather than taking a segment of it",
        seed: [],
        exercise: () => ({
            claims: climbsOut("tools/core/a..b/probe.ts") ? 1 : 0,
            unresolved: climbsOut("../out/probe.ts") ? 1 : 0,
        }),
        expect: { claims: 0, unresolved: 1 },
    },
];
