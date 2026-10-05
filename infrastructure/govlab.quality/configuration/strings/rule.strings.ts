export const SECRET_LABELS = {
    awsKey: "AWS access key",
    bearer: "Bearer token",
    credentialedUrl: "URL with embedded credentials",
    database: "Database connection string",
    github: "GitHub token",
    gitlab: "GitLab token",
    openai: "OpenAI API key",
    privateKey: "Private key",
    slack: "Slack token",
    sshKey: "SSH public key",
} as const;

export const notARule = function notARule(file: string, shape: string): string {
    return `govlab rules: ${file} carries a rule file name but does not export a ${shape}. Export the rule from the file, or rename the file so it no longer claims to be a rule.`;
};
