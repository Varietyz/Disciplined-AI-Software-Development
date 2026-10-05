import {
    codenameOf,
    companionOf,
    compareVersions,
    dependsOn,
    fileOf,
    indexUrl,
    installedOf,
    isCurrent,
    serverTarget,
    stanzaAt,
    stanzasOf,
    upstreamOf,
} from "@banes-lab/deploy/core/converters/index.converter.ts";
import { describe, expect, it } from "vitest";

const BROTLI = "libnginx-mod-brotli";
const SOURCE = { base: "https://packages.example.test/ubuntu/", component: "main" };

const INDEX = [
    "Package: nginx",
    "Version: 1.30.4-1~resolute",
    "Depends: libc6 (>= 2.34), zlib1g (>= 1:1.1.4)",
    "Provides: httpd, nginx, nginx-r1.30.4",
    "Filename: pool/n/nginx_1.30.4-1~resolute_amd64.deb",
    "SHA256: aaa",
    "Description: high performance web server",
    " nginx [engine x] is an HTTP server.",
    "",
    "Package: nginx",
    "Version: 1.30.5-1~resolute",
    "Provides: httpd, nginx, nginx-r1.30.5",
    "Filename: pool/n/nginx_1.30.5-1~resolute_amd64.deb",
    "SHA256: bbb",
    "",
    "Package: nginx-module-njs",
    "Version: 1.30.4+1.0.0-1~resolute",
    "Depends: libxml2-16 (>= 2.14.1), nginx-r1.30.4",
    "Filename: pool/n/nginx-module-njs_1.30.4+1.0.0-1~resolute_amd64.deb",
    "SHA256: ccc",
    "",
    "Package: nginx-module-njs",
    "Version: 1.30.4+1.0.1-1~resolute",
    "Depends: libxml2-16 (>= 2.14.1), nginx-r1.30.4",
    "Filename: pool/n/nginx-module-njs_1.30.4+1.0.1-1~resolute_amd64.deb",
    "SHA256: ddd",
    "",
    "Package: libnginx-mod-brotli",
    "Version: 1.1.0+nginx-1.30.4-1~resolute",
    "Depends: libbrotli1 (>= 0.6.0), nginx (= 1.30.4-1~resolute)",
    "Filename: pool/l/libnginx-mod-brotli_1.1.0+nginx-1.30.4-1~resolute_amd64.deb",
    "SHA256: eee",
    "",
    "Package: libnginx-mod-brotli",
    "Version: 1.1.0+nginx-1.30.5-1~resolute",
    "Depends: libbrotli1 (>= 0.6.0), nginx (= 1.30.5-1~resolute)",
    "Filename: pool/l/libnginx-mod-brotli_1.1.0+nginx-1.30.5-1~resolute_amd64.deb",
    "SHA256: fff",
    "",
    "Package: certbot-plugin",
    "Version: 4.0.0-3",
    "Depends: certbot, nginx",
    "Filename: pool/c/certbot-plugin_4.0.0-3_all.deb",
    "SHA256: ggg",
    "",
    "Package: broken",
    "Version: 1",
    "",
].join("\r\n");

const STANZAS = stanzasOf(INDEX, SOURCE);

describe("indexUrl and stanzasOf", () => {
    it("addresses a repository's package index and reads each complete stanza from it", () => {
        expect(indexUrl(SOURCE, "resolute", "amd64")).toBe(
            "https://packages.example.test/ubuntu/dists/resolute/main/binary-amd64/Packages",
        );
        expect(STANZAS.map((stanza) => stanza.name)).toStrictEqual([
            "nginx",
            "nginx",
            "nginx-module-njs",
            "nginx-module-njs",
            BROTLI,
            BROTLI,
            "certbot-plugin",
        ]);
        const [first] = STANZAS;
        expect(first?.url).toBe("https://packages.example.test/ubuntu/pool/n/nginx_1.30.4-1~resolute_amd64.deb");
        expect(first?.provides).toStrictEqual(["httpd", "nginx", "nginx-r1.30.4"]);
        expect(first?.depends.at(0)).toStrictEqual({ exact: null, name: "libc6" });
        expect(first === undefined ? "" : fileOf(first)).toBe("nginx_1.30.4-1~resolute_amd64.deb");
    });
});

describe("version reading", () => {
    it("orders versions by their numbers and splits upstream and codename", () => {
        expect(compareVersions("1.30.4+1.0.1-1~resolute", "1.30.4+1.0.0-1~resolute")).toBeGreaterThan(0);
        expect(compareVersions("1.30.4-1~noble", "1.30.4-1~resolute")).toBe(0);
        expect(upstreamOf("1.1.0+nginx-1.30.4-1~noble")).toBe("1.1.0+nginx-1.30.4");
        expect(upstreamOf("1.30.4-1~noble")).toBe("1.30.4");
        expect(codenameOf("1.30.4-1~noble")).toBe("noble");
        expect(codenameOf("1.30.4")).toBe("");
    });
});

describe("serverTarget, companionOf and stanzaAt", () => {
    it("pins the server to its declared upstream and picks each module built against that exact build", () => {
        const target = serverTarget(STANZAS, "1.30.4");
        expect(target?.version).toBe("1.30.4-1~resolute");
        expect(serverTarget(STANZAS, "1.29.0")).toBeNull();
        if (target === null) {
            return;
        }
        expect(companionOf(STANZAS, "nginx-module-njs", target)?.version).toBe("1.30.4+1.0.1-1~resolute");
        expect(companionOf(STANZAS, BROTLI, target)?.version).toBe("1.1.0+nginx-1.30.4-1~resolute");
        const newer = stanzaAt(STANZAS, "nginx", "1.30.5-1~resolute");
        const brotli = stanzaAt(STANZAS, BROTLI, "1.1.0+nginx-1.30.4-1~resolute");
        expect(newer?.sha256).toBe("bbb");
        expect(newer === null || brotli === null ? null : dependsOn(brotli, newer)).toBe(false);
        expect(newer === null ? null : companionOf(STANZAS, "nginx-module-njs", newer)).toBeNull();
        expect(newer === null ? null : companionOf(STANZAS, BROTLI, newer)?.sha256).toBe("fff");
        const unpinned = stanzaAt(STANZAS, "certbot-plugin", "4.0.0-3");
        expect(unpinned === null ? null : dependsOn(unpinned, target)).toBe(false);
        expect(stanzaAt(STANZAS, "nginx", "9")).toBeNull();
    });
});

describe("installedOf and isCurrent", () => {
    it("counts a package as current only when it is configured at the exact version", () => {
        const [target] = STANZAS;
        if (target === undefined) {
            return;
        }
        const configured = installedOf(
            "nginx",
            "Package: nginx\nStatus: install ok installed\nVersion: 1.30.4-1~resolute",
        );
        const unpacked = installedOf(
            "nginx",
            "Package: nginx\nStatus: install ok unpacked\nVersion: 1.30.4-1~resolute",
        );
        const older = installedOf("nginx", "Package: nginx\nStatus: install ok installed\nVersion: 1.30.4-1~noble");
        const absent = installedOf("nginx", "");
        expect(isCurrent(configured, target)).toBe(true);
        expect(isCurrent(unpacked, target)).toBe(false);
        expect(isCurrent(older, target)).toBe(false);
        expect(absent).toStrictEqual({ configured: false, name: "nginx", version: null });
    });
});
