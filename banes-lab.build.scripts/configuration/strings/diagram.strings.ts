export const noEndpoint = function noEndpoint(binary: string, profile: string, exitCode: number | null): string {
    const state = exitCode === null ? "was still running" : `had exited with code ${String(exitCode)}`;
    return `diagram: ${binary} wrote no DevTools endpoint into ${profile} in time, and the browser ${state}. Check that the binary starts headless on this machine.`;
};

export const stageThrew = function stageThrew(detail: string): string {
    return `diagram: the stage threw: ${detail}`;
};

export const STAGE_NOT_READY =
    "diagram: the stage never became ready. Check the stage page in the browser for a script error.";

export const diagramFailed = function diagramFailed(index: number, head: string, reason: string): string {
    return `diagram ${String(index)} (${head}): ${reason}`;
};

export const diagramStalled = function diagramStalled(index: number, head: string, attempts: number): string {
    return `diagram ${String(index)} (${head}): the browser stopped answering on each of ${String(attempts)} launches. Render that source on its own in the stage page to find what hangs it.`;
};

export const diagramRelaunch = function diagramRelaunch(index: number, reason: string): string {
    return `diagrams: the browser stopped answering at diagram ${String(index)} (${reason}), relaunching it to resume there\n`;
};

export const noMarkup = function noMarkup(index: number): string {
    return `diagram: the stage returned no markup for diagram ${String(index)}.`;
};

export const NO_BROWSER =
    "diagram: no Chrome or Edge binary was found to render the diagrams. Install one, or pass its path to the renderer.";

export const NO_STAGE_PORT = "diagram stage: the server reported no port.";

export const undeclaredToken = function undeclaredToken(token: string): string {
    return `diagram stage: the token ${token} is not declared in the base tokens. Declare it there, or stop reading it.`;
};

export const diagramsLine = function diagramsLine(count: number, folder: string): string {
    return `diagrams: rendered ${String(count)} diagram(s) into ${folder}\n`;
};
