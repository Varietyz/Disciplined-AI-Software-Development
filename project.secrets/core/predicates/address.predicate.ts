import { LOCAL_ADDRESSES, LOOPBACK_V4_PREFIX } from "#configuration/constants/detector.constants";
import { defineDetector } from "#core/registries/detector.registry";
import { isIP } from "node:net";

const isLocal = function isLocal(value: string): boolean {
    return LOCAL_ADDRESSES.has(value) || value.startsWith(LOOPBACK_V4_PREFIX);
};

defineDetector({ detects: (value) => isIP(value) !== 0 && !isLocal(value), kind: "address" });
