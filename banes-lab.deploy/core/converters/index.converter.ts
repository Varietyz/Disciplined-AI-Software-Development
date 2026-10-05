import {
    CONFIGURED_STATUS,
    NGINX_PACKAGE,
    PACKAGE_STATUS_FIELD,
    PACKAGE_VERSION_FIELD,
} from "#configuration/constants/nginx.constants";
import type { InstalledPackage, PackageSource, PackageStanza, Relation } from "#types/deployment.types";
import { LINE_BREAK } from "#configuration/constants/deployment.constants";

const FIELD_MARK = ": ";
const CONTINUATION = " ";
const CARRIAGE = "\r";
const LIST_MARK = ",";
const CHOICE_MARK = "|";
const CONSTRAINT_OPEN = "(";
const CONSTRAINT_CLOSE = ")";
const EXACT_MARK = "=";
const REVISION_MARK = "-";
const CODENAME_MARK = "~";
const PATH_MARK = "/";
const DIGITS = "0123456789";
const BLOCK_MARK = LINE_BREAK + LINE_BREAK;

export const indexUrl = function indexUrl(source: PackageSource, codename: string, architecture: string): string {
    return `${source.base}dists/${codename}/${source.component}/binary-${architecture}/Packages`;
};

const fieldsOf = function fieldsOf(block: string): ReadonlyMap<string, string> {
    const fields = new Map<string, string>();
    for (const line of block.split(LINE_BREAK)) {
        const at = line.indexOf(FIELD_MARK);
        if (!line.startsWith(CONTINUATION) && at > 0) {
            fields.set(line.slice(0, at), line.slice(at + FIELD_MARK.length).trim());
        }
    }
    return fields;
};

const relationOf = function relationOf(text: string): Relation {
    const trimmed = text.trim();
    const open = trimmed.indexOf(CONSTRAINT_OPEN);
    if (open === -1) {
        return { exact: null, name: trimmed };
    }
    const close = trimmed.indexOf(CONSTRAINT_CLOSE, open);
    const constraint = trimmed.slice(open + 1, close === -1 ? trimmed.length : close).trim();
    return {
        exact: constraint.startsWith(EXACT_MARK) ? constraint.slice(EXACT_MARK.length).trim() : null,
        name: trimmed.slice(0, open).trim(),
    };
};

const relationsOf = function relationsOf(value: string | undefined): readonly Relation[] {
    return (value ?? "")
        .split(LIST_MARK)
        .flatMap((clause) => clause.split(CHOICE_MARK))
        .map(relationOf)
        .filter((relation) => relation.name.length > 0);
};

export const stanzasOf = function stanzasOf(text: string, source: PackageSource): readonly PackageStanza[] {
    return text
        .split(CARRIAGE)
        .join("")
        .split(BLOCK_MARK)
        .map(fieldsOf)
        .flatMap((fields) => {
            const name = fields.get("Package");
            const version = fields.get(PACKAGE_VERSION_FIELD);
            const filename = fields.get("Filename");
            const sha256 = fields.get("SHA256");
            if (name === undefined || version === undefined || filename === undefined || sha256 === undefined) {
                return [];
            }
            const provides = relationsOf(fields.get("Provides")).map((relation) => relation.name);
            return [
                {
                    depends: relationsOf(fields.get("Depends")),
                    name,
                    provides,
                    sha256,
                    url: source.base + filename,
                    version,
                },
            ];
        });
};

const numbersOf = function numbersOf(version: string): readonly number[] {
    const runs: string[] = [""];
    for (const character of version) {
        const last = runs.length - 1;
        if (DIGITS.includes(character)) {
            runs[last] = (runs[last] ?? "") + character;
        } else {
            runs.push("");
        }
    }
    return runs.filter((run) => run.length > 0).map(Number);
};

export const compareVersions = function compareVersions(left: string, right: string): number {
    const [leftNumbers, rightNumbers] = [numbersOf(left), numbersOf(right)];
    for (let at = 0; at < Math.max(leftNumbers.length, rightNumbers.length); at += 1) {
        const difference = (leftNumbers[at] ?? 0) - (rightNumbers[at] ?? 0);
        if (difference !== 0) {
            return difference;
        }
    }
    return 0;
};

const newest = function newest(stanzas: readonly PackageStanza[]): PackageStanza | null {
    return stanzas.toSorted((left, right) => compareVersions(right.version, left.version)).at(0) ?? null;
};

export const upstreamOf = function upstreamOf(version: string): string {
    const at = version.lastIndexOf(REVISION_MARK);
    return at === -1 ? version : version.slice(0, at);
};

export const codenameOf = function codenameOf(version: string): string {
    const at = version.lastIndexOf(CODENAME_MARK);
    return at === -1 ? "" : version.slice(at + CODENAME_MARK.length);
};

export const fileOf = function fileOf(stanza: PackageStanza): string {
    return stanza.url.slice(stanza.url.lastIndexOf(PATH_MARK) + 1);
};

export const serverTarget = function serverTarget(
    stanzas: readonly PackageStanza[],
    upstream: string,
): PackageStanza | null {
    return newest(stanzas.filter((stanza) => stanza.name === NGINX_PACKAGE && upstreamOf(stanza.version) === upstream));
};

export const dependsOn = function dependsOn(stanza: PackageStanza, target: PackageStanza): boolean {
    return stanza.depends.some((relation) =>
        relation.exact === null
            ? relation.name !== target.name && target.provides.includes(relation.name)
            : relation.name === target.name && relation.exact === target.version,
    );
};

export const companionOf = function companionOf(
    stanzas: readonly PackageStanza[],
    name: string,
    target: PackageStanza,
): PackageStanza | null {
    return newest(stanzas.filter((stanza) => stanza.name === name && dependsOn(stanza, target)));
};

export const stanzaAt = function stanzaAt(
    stanzas: readonly PackageStanza[],
    name: string,
    version: string,
): PackageStanza | null {
    return stanzas.find((stanza) => stanza.name === name && stanza.version === version) ?? null;
};

export const installedOf = function installedOf(name: string, status: string): InstalledPackage {
    const fields = fieldsOf(status);
    return {
        configured: fields.get(PACKAGE_STATUS_FIELD) === CONFIGURED_STATUS,
        name,
        version: fields.get(PACKAGE_VERSION_FIELD) ?? null,
    };
};

export const isCurrent = function isCurrent(installed: InstalledPackage, stanza: PackageStanza): boolean {
    return installed.configured && installed.version === stanza.version;
};
