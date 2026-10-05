import type { CardPage, CardSpec, Profile, RegisteredCard, ResolvedCard, ResolvedLayer } from "#types/card.types";
import type { RenderedImage } from "#types/image.types";

export interface LoadedCards {
    readonly brand: readonly string[];
    readonly cards: readonly RegisteredCard[];
    readonly pages: readonly CardPage[];
    readonly plugins: readonly string[];
    readonly repeated: readonly string[];
}

export interface ShaderFrame {
    readonly width: number;
    readonly height: number;
    readonly time: number;
    readonly progress: number;
    readonly values: readonly number[];
}

export interface ShaderPass {
    readonly draw: (frame: ShaderFrame) => Promise<void>;
}

export interface AnimationPass {
    readonly delays: readonly number[];
    readonly draw: (time: number) => void;
}

export type LayerPass = (layer: ResolvedLayer, card: ResolvedCard) => Promise<void>;

export interface MountedCard {
    readonly element: HTMLElement;
    readonly ready: () => Promise<void>;
    readonly paint: (card: ResolvedCard) => Promise<void>;
    readonly report: (failure: unknown) => string;
}

export interface CaptureJob {
    readonly spec: CardSpec;
    readonly profile: Profile;
}

export interface ExportOptions {
    readonly url: string;
    readonly gpu: boolean;
    readonly force: boolean;
    readonly only: string | null;
}

export interface ExportResult {
    readonly rendered: readonly string[];
    readonly current: readonly string[];
    readonly pruned: readonly string[];
}

export interface CaptureOptions {
    readonly url: string;
    readonly gpu: boolean;
    readonly onCaptured?: (images: readonly RenderedImage[]) => Promise<void>;
}

export interface StageServer {
    readonly url: string;
    readonly cards: () => Promise<LoadedCards>;
    readonly close: () => Promise<void>;
}
