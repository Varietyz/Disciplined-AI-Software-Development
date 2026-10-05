import { optionalTextOf, textOf } from "@ssot/secrets";
import type { Secrets } from "#types/deployment.types";

export const loadSecrets = function loadSecrets(): Secrets {
    return {
        deployWebhook: textOf("DEPLOY_DISCORD_WEBHOOK_URL"),
        host: textOf("DEPLOY_HOST"),
        keyFile: textOf("DEPLOY_KEY_FILE"),
        nginxWebhook: textOf("NGINX_DISCORD_WEBHOOK_URL"),
        passphrase: optionalTextOf("SSH_PASSPHRASE"),
        user: textOf("DEPLOY_USER"),
    };
};
