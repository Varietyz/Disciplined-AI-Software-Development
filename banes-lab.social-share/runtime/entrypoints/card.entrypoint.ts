import {
    CARDS_VALID,
    CARD_FLAG,
    CURRENT_PREFIX,
    EXPORT_DONE,
    FORCE_FLAG,
    GPU_FLAG,
    PRUNED_PREFIX,
    RENDERED_PREFIX,
    SOCIAL_SUMMARY,
} from "#configuration/strings/card.strings";
import { CARD_OPTION, FORCE_OPTION, GPU_OPTION, SOCIAL_COMMAND } from "#configuration/constants/card.constants";
import { conclude, say } from "#core/reporters/card.reporter";
import { flagValue, hasFlag, resolveArgv } from "@govlab/argv";
import { PROFILES } from "#configuration/configs/card.config";
import { absolutePath } from "@ssot/paths";
import { animationFindings } from "#core/probes/image.probe";
import { exportCards } from "#core/coordinators/export.coordinator";
import { openStage } from "#core/adapters/stage.adapter";
import { validateCards } from "#core/validators/card.validator";

const argv = resolveArgv({
    command: SOCIAL_COMMAND,
    flags: [
        { describe: CARD_FLAG, name: CARD_OPTION, takesValue: true },
        { describe: GPU_FLAG, name: GPU_OPTION, takesValue: false },
        { describe: FORCE_FLAG, name: FORCE_OPTION, takesValue: false },
    ],
    summary: SOCIAL_SUMMARY,
});

const stage = await openStage(true);
try {
    const loaded = await stage.cards();
    const specs = loaded.cards.map((card) => card.spec);
    const findings = [
        ...validateCards(loaded.cards, loaded.plugins, {
            brand: loaded.brand,
            pages: loaded.pages,
            profiles: PROFILES,
            repeated: loaded.repeated,
        }),
        ...(await animationFindings(specs, absolutePath("app.public"))),
    ];
    if (conclude(findings, CARDS_VALID)) {
        const result = await exportCards(
            {
                force: hasFlag(argv, FORCE_OPTION),
                gpu: hasFlag(argv, GPU_OPTION),
                only: flagValue(argv, CARD_OPTION) ?? null,
                url: stage.url,
            },
            specs,
        );
        for (const key of result.rendered) {
            say(RENDERED_PREFIX + key);
        }
        for (const key of result.current) {
            say(CURRENT_PREFIX + key);
        }
        for (const file of result.pruned) {
            say(PRUNED_PREFIX + file);
        }
        say(EXPORT_DONE);
    }
} finally {
    await stage.close();
}
