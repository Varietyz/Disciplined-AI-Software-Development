import { surfacePath } from "../../../config/surface.config.ts";

const ENTRYPOINTS = surfacePath("entrypoints");

const CORE = surfacePath("core");

export const CONVERGENCE_ENTRYPOINT = `${ENTRYPOINTS}/converge.entrypoint.ts`;

export const CONVERGENCE_VALIDATOR = `${CORE}/validators/converge.validator.ts`;

export const CONVERGENCE_SOURCES: readonly string[] = [CONVERGENCE_ENTRYPOINT, CONVERGENCE_VALIDATOR];
