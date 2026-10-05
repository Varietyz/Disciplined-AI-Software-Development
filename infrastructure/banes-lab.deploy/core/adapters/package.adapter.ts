import { INDEX_FETCH_FAILED } from "#configuration/strings/nginx.strings";

export const fetchIndex = async function fetchIndex(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`${INDEX_FETCH_FAILED}${url} ${String(response.status)}`);
    }
    return response.text();
};
