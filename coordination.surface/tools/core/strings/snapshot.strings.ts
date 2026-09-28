export const unreadItems = function unreadItems(
    agents: readonly string[],
    target: string,
    seconds: number,
    keys: readonly string[],
): string {
    return (
        `WRITTEN AGAINST AN OLDER READ  ${String(keys.length)} item(s) from ${agents.join(", ")} landed on ` +
        `${target} between your last read and this write, over ${String(seconds)}s: ${keys.join(", ")}\n` +
        "  Read them before relying on anything you stated about this surface; your statements were based on the " +
        "earlier read.\n"
    );
};
