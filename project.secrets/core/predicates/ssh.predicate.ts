import { SSH_MIN_BODY, SSH_PREFIXES } from "#configuration/constants/detector.constants";
import { defineDetector } from "#core/registries/detector.registry";

const hasKeyBody = function hasKeyBody(value: string, prefix: string): boolean {
    const [body = ""] = value.slice(prefix.length).split(" ");
    return value.startsWith(prefix) && body.length >= SSH_MIN_BODY;
};

defineDetector({ detects: (value) => SSH_PREFIXES.some((prefix) => hasKeyBody(value, prefix)), kind: "ssh" });
