import { detectProfiles, loadEcosystems, loadProfiles } from "@govlab/quality/core/loaders/ecosystem.loader.ts";
import { expect, test } from "vitest";

test("loadEcosystems reads the classification, and loadProfiles keeps only the detectable ecosystems", () => {
    const ecosystems = loadEcosystems();
    const profiles = loadProfiles();
    expect(Object.keys(ecosystems).length).toBeGreaterThanOrEqual(profiles.length);
    expect(profiles.every((profile) => profile.markers.length > 0)).toBe(true);
});

test("detectProfiles finds the ecosystem whose marker file sits at the root, and nothing for no files", () => {
    expect(detectProfiles([])).toHaveLength(0);
    const [first] = loadProfiles();
    const marker = first?.markers[0] ?? "";
    expect(detectProfiles([marker]).map((profile) => profile.id)).toContain(first?.id);
});
