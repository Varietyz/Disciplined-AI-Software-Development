import { PROBE_TIMEOUT_MS } from "#configuration/constants/deployment.constants";
import type { ProbeResponse } from "#types/deployment.types";

const BODY_METHOD = "GET";
const TYPE_HEADER = "content-type";

export const fetchProbe = async function fetchProbe(url: string, method: string): Promise<ProbeResponse> {
    const response = await fetch(url, { method, redirect: "manual", signal: AbortSignal.timeout(PROBE_TIMEOUT_MS) });
    const body = method === BODY_METHOD ? await response.text() : "";
    return { body, status: response.status, type: response.headers.get(TYPE_HEADER) ?? "" };
};
