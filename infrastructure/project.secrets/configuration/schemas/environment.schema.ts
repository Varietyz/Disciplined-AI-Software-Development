export const ENVIRONMENT_ENTRIES = [
    { key: "SITE_DEV_PORT", kind: "port", required: true, scope: "Runtime" },
    { key: "SOCIAL_DEV_PORT", kind: "port", required: true, scope: "Runtime" },
    { key: "DEPLOY_HOST", kind: "host", required: true, scope: "Runtime" },
    { key: "DEPLOY_USER", kind: "user", required: true, scope: "Runtime" },
    { key: "DEPLOY_KEY_FILE", kind: "path", required: true, scope: "Runtime" },
    { key: "SSH_PASSPHRASE", kind: "secret", required: false, scope: "Runtime" },
    { key: "DEPLOY_DISCORD_WEBHOOK_URL", kind: "url", required: true, scope: "Runtime" },
    { key: "NGINX_DISCORD_WEBHOOK_URL", kind: "url", required: true, scope: "Runtime" },
] as const;
