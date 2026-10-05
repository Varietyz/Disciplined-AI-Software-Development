const HTTP_OK = 200;

export const remoteText = async function remoteText(url: string): Promise<string | null> {
    const response = await fetch(url);
    return response.status === HTTP_OK ? response.text() : null;
};

export const firstRemoteText = async function firstRemoteText(urls: readonly string[]): Promise<string | null> {
    const [url, ...rest] = urls;
    if (url === undefined) {
        return null;
    }
    return (await remoteText(url)) ?? firstRemoteText(rest);
};
