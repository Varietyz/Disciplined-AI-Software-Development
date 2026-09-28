export const FILESYSTEM_REFUSALS: ReadonlySet<string> = new Set([
    "EACCES",
    "EBUSY",
    "EISDIR",
    "ELOOP",
    "ENOENT",
    "ENOTDIR",
    "EPERM",
]);

export const RMDIR_REFUSALS: ReadonlySet<string> = new Set(["EBUSY", "EEXIST", "ENOENT", "ENOTEMPTY"]);
