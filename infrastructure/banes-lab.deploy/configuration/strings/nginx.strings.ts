export const PULL_START = "Syncing the nginx site configuration from the remote to a local backup.";

export const PULL_FULL_START = "Downloading the full nginx directory from the remote.";

export const PUSH_START = "Syncing the nginx configuration from local to the remote.";

export const RESTORING = "Restoring every managed nginx file from its local backup.";

export const RESTORED = "Every managed nginx file is restored, and nginx reloaded.";

export const RESTORE_TEST_FAILED = "The restored nginx configuration failed its test: ";

export const CONFIG_DOWNLOADING = "Downloading the current remote configuration.";

export const CONFIG_SAVED = "Remote configuration saved to: ";

export const FULL_ARCHIVE_CREATED = "Created the nginx archive on the remote.";

export const FULL_ARCHIVE_SAVED = "Downloaded the archive to: ";

export const FULL_ARCHIVE_CLEANED = "Removed the remote archive.";

export const UPLOADING_CONFIGS = "Uploading the managed nginx configurations.";

export const CONFIG_UPLOADED = "Uploaded: ";

export const LOCAL_NGINX_MISSING = "Local nginx directory not found: ";

export const TESTING = "Testing the nginx configuration.";

export const TEST_PASSED = "Nginx configuration test passed.";

export const TEST_FAILED = "Nginx configuration test failed: ";

export const RELOADING = "Reloading nginx.";

export const RELOADED = "Nginx reloaded.";

export const RELOAD_FAILED = "Failed to reload nginx: ";

export const VERIFYING = "Verifying that nginx is running.";

export const RUNNING = "Nginx is running.";

export const NOT_RUNNING = "Nginx is not running after the reload.";

export const SYNC_DONE = "Nginx sync complete.";

export const SYNC_FAILED = "Nginx sync failed: ";

export const LOCAL_BACKUP_LABEL = "Local backup: ";

export const SERVER_CHECKING = "Checking that nginx and its modules are installed and built for this server's release.";

export const SERVER_CURRENT = "Nginx and its modules are already installed and current.";

export const SERVER_READY = "Nginx and its modules are installed and enabled.";

export const PACKAGES_INSTALLING = "Installing packages: ";

export const PACKAGE_UNAVAILABLE = "No package in the configured repositories matches: ";

export const PACKAGE_INSTALL_FAILED = "Installing the nginx packages failed: ";

export const PACKAGE_REVERT_UNAVAILABLE =
    "The installed package could not be restored if the change failed, because its build is no longer published: ";

export const PACKAGES_REVERTING = "Restoring the previous nginx packages and modules.";

export const PACKAGES_REVERTED = "The previous nginx packages and modules are restored.";

export const PACKAGE_REVERT_FAILED = "Restoring the previous nginx packages failed: ";

export const MODULE_BUILDING = "Building nginx modules from source: ";

export const MODULE_BUILD_FAILED = "Building the nginx modules from source failed: ";

export const INDEX_FETCH_FAILED = "A package index could not be fetched: ";

export const USAGE = "Usage: node runtime/entrypoints/nginx.entrypoint.ts [push | pull | pull-full]";
