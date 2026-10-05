import {
    ANIMATION_EXTENSION,
    FILE_SEPARATOR,
    GENERATED_MARK,
    HEIGHT_MARK,
    MOTION_EXTENSION,
    STILL_EXTENSION,
    VIDEO_EXTENSION,
    WIDTH_MARK,
} from "#configuration/constants/card.constants";
import type { CardSpec, Profile } from "#types/card.types";
import type { ImageSize, RenderedImage } from "#types/image.types";
import { OUTPUT_SCALES, PROFILES, SHARE_SCALE } from "#configuration/configs/card.config";
import { SUBJECT_SEPARATOR, UNKNOWN_STAGE_PROFILE } from "#configuration/strings/card.strings";

export const sizeOf = function sizeOf(profile: Profile, scale: number): ImageSize {
    return { height: Math.round(profile.height * scale), width: Math.round(profile.width * scale) };
};

export const evenSizeOf = function evenSizeOf(size: ImageSize): ImageSize {
    return { height: size.height - (size.height % 2), width: size.width - (size.width % 2) };
};

export const profileOf = function profileOf(id: string): Profile {
    const profile = PROFILES.find((candidate) => candidate.id === id);
    if (profile === undefined) {
        throw new Error(UNKNOWN_STAGE_PROFILE + SUBJECT_SEPARATOR + id);
    }
    return profile;
};

export const profilesOf = function profilesOf(spec: CardSpec): readonly Profile[] {
    return PROFILES.filter((profile) => spec.profiles.includes(profile.id));
};

const stemOf = function stemOf(card: string, profile: Profile, size: ImageSize): string {
    const dimensions = WIDTH_MARK + String(size.width) + HEIGHT_MARK + String(size.height);
    return card + dimensions + FILE_SEPARATOR + profile.id + GENERATED_MARK;
};

export const isAnimated = function isAnimated(spec: CardSpec): boolean {
    return spec.timeline.frames > 1;
};

const filesAt = function filesAt(card: string, profile: Profile, scale: number, moving: boolean): readonly string[] {
    const size = sizeOf(profile, scale);
    const stem = stemOf(card, profile, size);
    const motion = [
        stem + ANIMATION_EXTENSION,
        stem + MOTION_EXTENSION,
        stemOf(card, profile, evenSizeOf(size)) + VIDEO_EXTENSION,
    ];
    return [stem + STILL_EXTENSION, ...(moving ? motion : [])];
};

export const imageFilesOf = function imageFilesOf(spec: CardSpec, profile: Profile): readonly string[] {
    return OUTPUT_SCALES.flatMap((scale) => filesAt(spec.id, profile, scale, isAnimated(spec)));
};

export const shareCandidatesOf = function shareCandidatesOf(spec: CardSpec, profile: Profile): readonly string[] {
    if (!isAnimated(spec)) {
        return [stemOf(spec.id, profile, sizeOf(profile, SHARE_SCALE)) + STILL_EXTENSION];
    }
    return OUTPUT_SCALES.filter((scale) => scale <= SHARE_SCALE)
        .toSorted((left, right) => right - left)
        .map((scale) => stemOf(spec.id, profile, sizeOf(profile, scale)) + ANIMATION_EXTENSION);
};

export const outputsOf = function outputsOf(image: RenderedImage): readonly (readonly [string, Buffer | null])[] {
    const [still = "", animation = "", motion = "", video = ""] = filesAt(
        image.card,
        profileOf(image.profile),
        image.scale,
        true,
    );
    return [
        [still, image.still],
        [animation, image.animation],
        [motion, image.motion],
        [video, image.video],
    ];
};
