const DAY = 86_400;

export const NEWEST = 1_772_540_278;

const SOURCE_PREFIX = '{"source":"anonymous",';

const entry = function entry(id: string, rate: number, title: string, seniority: string, createdAt = NEWEST): string {
    const rest = JSON.stringify({
        country: "Belgium",
        createdAtUtc: createdAt,
        dailyRateEur: rate,
        externalId: id,
        jobTitle: title,
        jobTitles: [title],
        seniorities: [seniority],
        seniority,
    });
    return SOURCE_PREFIX + rest.slice(1);
};

export const PAGE = [
    '<p id="stat-count" class="x"> 4 </p><span id="last-update" class="y">23 Mar 2026</span>',
    "<script>const data = [",
    entry("a", 700, "Solution Architect", "Senior"),
    ",",
    entry("b", 900, "IT Architect", "Lead"),
    ",",
    entry("c", 600, "Software Engineer", "Senior"),
    ",",
    entry("d", 500, "Solution Architect", "Senior", NEWEST - 800 * DAY),
    ",",
    entry("a", 700, "Solution Architect", "Senior"),
    "];</script>",
].join("");
