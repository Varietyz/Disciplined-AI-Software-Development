import {
    ARCHITECTS_GROUP,
    CONSULTANTS_GROUP,
    ENGINEERS_GROUP,
    EVERY_RECORD_GROUP,
    TECH_LEADS_GROUP,
} from "#configuration/strings/rate.strings";
import type { PeerGroup } from "#types/rate.types";

export const RATE_SOURCE = "https://dailyrate.be/en/";

export const RECORD_MARKER = '{"source":';

export const COUNT_MARKER = 'id="stat-count"';

export const UPDATE_MARKER = 'id="last-update"';

export const SECONDS_PER_MONTH = 2_629_800;

export const MS_PER_SECOND = 1000;

export const DATE_LENGTH = 10;

export const PERCENT = 100;

export const QUARTER = 0.25;

export const HALF = 0.5;

export const THREE_QUARTERS = 0.75;

export const NINE_TENTHS = 0.9;

export const DEFAULT_MONTHS = 24;

export const REPORT_NAME = "day-rates.generated.md";

const SENIOR_LEVELS: readonly string[] = ["Senior", "Lead"];

export const PEER_GROUPS: readonly PeerGroup[] = [
    {
        label: ARCHITECTS_GROUP,
        seniorities: SENIOR_LEVELS,
        titles: ["Solution Architect", "IT Architect", "Cloud Architect"],
    },
    { label: TECH_LEADS_GROUP, seniorities: SENIOR_LEVELS, titles: ["Tech Lead"] },
    { label: CONSULTANTS_GROUP, seniorities: SENIOR_LEVELS, titles: ["IT Consultant"] },
    { label: ENGINEERS_GROUP, seniorities: SENIOR_LEVELS, titles: ["Software Engineer"] },
    { label: EVERY_RECORD_GROUP, seniorities: [], titles: [] },
];
