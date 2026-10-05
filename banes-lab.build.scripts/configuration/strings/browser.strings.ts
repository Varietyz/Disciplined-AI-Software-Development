export const SOCKET_FAILED =
    "browser adapter: the devtools socket failed to open. Check that the browser is still running.";

export const NOT_TEXT_MESSAGE = "browser adapter: the devtools socket sent a message that is not text.";

export const protocolFailed = function protocolFailed(method: string, detail: string): string {
    return `browser adapter: ${method} failed: ${detail}`;
};

export const socketClosed = function socketClosed(method: string): string {
    return `browser adapter: the devtools socket closed while ${method} was pending.`;
};

export const notObjectMessage = function notObjectMessage(data: string): string {
    return `browser adapter: the devtools socket sent a message that is not an object: ${data}`;
};

export const noReply = function noReply(method: string, milliseconds: number): string {
    return `browser adapter: ${method} got no reply within ${String(milliseconds)} ms.`;
};

export const browserStartFailed = function browserStartFailed(binary: string, reason: string): string {
    return `browser factory: ${binary} did not start: ${reason}\n`;
};

export const consoleEcho = function consoleEcho(text: string): string {
    return `  · ${text}\n`;
};
