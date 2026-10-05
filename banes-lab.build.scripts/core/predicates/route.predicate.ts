import { FILE_ROUTES } from "#configuration/constants/site.constants";

export const isFileRoute = function isFileRoute(address: string): boolean {
    return FILE_ROUTES.some((route) => address.startsWith(route));
};
