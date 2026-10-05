import type { ModuleLoader, PackageSource, SourceArchive, SourceModule } from "#types/deployment.types";
import { REMOTE_STAGING } from "#configuration/constants/deployment.constants";

export const NGINX_PARENT = "/etc";

export const NGINX_FOLDER = "nginx";

export const NGINX_ROOT = `${NGINX_PARENT}/${NGINX_FOLDER}`;

export const MAIN_CONFIG = "nginx.conf";

const SITES_FOLDER = "sites-available";

export const SITE_NAME = "banes-lab";

const SCRIPTS_FOLDER = "js";

export const REMOTE_SCRIPTS = `${NGINX_ROOT}/${SCRIPTS_FOLDER}`;

export const SCRIPT_SOURCE_EXTENSION = ".ts";

export const NAME_SEPARATOR = ".";

export const SCRIPT_TARGET_EXTENSION = ".js";

export const NODE_PROTOCOL = "node:";

export const SCRIPT_STAGING_PREFIX = "banes-lab-njs-";

export const REMOTE_SITE_CONFIG = `${NGINX_ROOT}/${SITES_FOLDER}/${SITE_NAME}`;

export const SITE_LINK = `${NGINX_ROOT}/sites-enabled/${SITE_NAME}`;

const FULL_ARCHIVE = "nginx-full.tar.gz";

export const REMOTE_FULL_ARCHIVE = `${REMOTE_STAGING}/${FULL_ARCHIVE}`;

export const SETUP_STAGING = `${REMOTE_STAGING}/nginx-setup`;

export const FULL_BACKUP_PREFIX = "nginx-full-";

export const CONFIG_BACKUP_SUFFIX = ".backup.conf";

export const BACKUP_MARKER = ".backup";

export const FILE_TEST_COMMAND = "test -f";

export const REMOVE_FILE_COMMAND = "sudo rm -f";

export const PREVIEW_LENGTH = 1000;

export const TEST_COMMAND = "nginx -t";

export const ERROR_LOG_DIRECTIVE = "error_log";

export const LOG_SIZE_COMMAND = "sudo stat -c %s";

export const LOG_TAIL_COMMAND = "sudo tail -c +";

export const RELOAD_COMMAND = "systemctl reload-or-restart nginx";

export const STATUS_COMMAND = "systemctl is-active nginx";

export const SERVICE_ENABLE_COMMAND = "sudo systemctl enable nginx";

export const ACTIVE_STATUS = "active";

export const CONFIG_MODE = "644";

export const CONFIG_OWNER = "root:root";

export const NGINX_SOURCE: SourceArchive & { readonly upstream: string } = {
    archive: "https://nginx.org/download/nginx-1.30.4.tar.gz",
    folder: "nginx-1.30.4",
    sha256: "4261dc90e9e47c1c4041276e9aaa3d48ebe2e664f728e14fa95ae6c67d57a08b",
    upstream: "1.30.4",
};

export const NGINX_PACKAGE = "nginx";

export const MODULE_PACKAGES: readonly string[] = ["nginx-module-njs", "libnginx-mod-brotli"];

export const PACKAGE_SOURCES: readonly PackageSource[] = [
    { base: "https://nginx.org/packages/ubuntu/", component: "nginx" },
    { base: "https://packagecloud.io/DaryL/libnginx-mod-brotli-stable/ubuntu/", component: "main" },
];

export const SOURCE_MODULES: readonly SourceModule[] = [
    {
        archive: "https://github.com/openresty/headers-more-nginx-module/archive/refs/tags/v0.40.tar.gz",
        folder: "headers-more-nginx-module-0.40",
        object: "ngx_http_headers_more_filter_module.so",
        sha256: "c14cb5e6c998590c209efbf77bd7637ce2cab02332e4192756a8af5b26ba4284",
        version: "0.40",
    },
];

export const BUILD_PACKAGES: readonly string[] = ["build-essential", "libpcre2-dev", "zlib1g-dev"];

export const MODULES_FOLDER = "/usr/lib/nginx/modules";

export const BUILD_MARKER_SUFFIX = ".build";

export const PREVIOUS_SUFFIX = ".previous";

export const MODULE_LOADERS: readonly ModuleLoader[] = [
    { file: `${NGINX_ROOT}/modules-enabled/50-mod-http-js.conf`, object: "ngx_http_js_module.so" },
    {
        file: `${NGINX_ROOT}/modules-enabled/50-mod-http-headers-more-filter.conf`,
        object: "ngx_http_headers_more_filter_module.so",
    },
];

export const CODENAME_COMMAND = '. /etc/os-release && echo "$VERSION_CODENAME"';

export const ARCHITECTURE_COMMAND = "dpkg --print-architecture";

export const PACKAGE_STATUS_COMMAND = "dpkg -s";

export const PACKAGE_VERSION_FIELD = "Version";

export const PACKAGE_STATUS_FIELD = "Status";

export const CONFIGURED_STATUS = "install ok installed";

const PACKAGE_LOCK_SECONDS = 600;

export const PACKAGE_LOCK_WAIT = `timeout ${String(PACKAGE_LOCK_SECONDS)} sh -c 'while sudo fuser /var/lib/dpkg/lock-frontend /var/lib/dpkg/lock /var/lib/apt/lists/lock > /dev/null 2>&1; do sleep 5; done'`;

const APT = `sudo DEBIAN_FRONTEND=noninteractive apt-get -o DPkg::Lock::Timeout=${String(PACKAGE_LOCK_SECONDS)} -o Dpkg::Options::=--force-confold -y -q`;

export const PACKAGE_INDEX_COMMAND = `${APT} update`;

export const PACKAGE_INSTALL_COMMAND = `${APT} --no-remove install`;

export const PACKAGE_REVERT_COMMAND = `${APT} --no-remove --allow-downgrades install`;

export const PACKAGE_REMOVE_COMMAND = `${APT} remove`;

export const PULL_COMMANDS: readonly string[] = ["pull", "download", "from-remote"];

export const PULL_FULL_COMMANDS: readonly string[] = ["pull-full", "full", "pull-all"];

export const PUSH_COMMANDS: readonly string[] = ["push", "upload", "to-remote"];
