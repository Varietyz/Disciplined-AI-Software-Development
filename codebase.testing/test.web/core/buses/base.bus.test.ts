import { ROUTE_CHANGED, ROUTE_REQUESTED } from "@banes-lab/web/core/ids/route.ids.ts";
import { describe, expect, it } from "vitest";
import { emitEvent, subscribeEvent } from "@banes-lab/web/core/buses/base.bus.ts";

const PAGE = "grammar";

describe("subscribeEvent", () => {
    it("delivers only the events carrying the subscribed name", () => {
        const seen: string[] = [];
        const dispose = subscribeEvent(ROUTE_CHANGED, (event) => {
            seen.push(event.page);
        });
        emitEvent({ name: ROUTE_REQUESTED, page: PAGE });
        emitEvent({ name: ROUTE_CHANGED, page: PAGE });
        dispose();
        expect(seen).toStrictEqual([PAGE]);
    });

    it("stops delivering after the disposer runs", () => {
        let count = 0;
        const dispose = subscribeEvent(ROUTE_CHANGED, () => {
            count += 1;
        });
        dispose();
        emitEvent({ name: ROUTE_CHANGED, page: PAGE });
        expect(count).toBe(0);
    });
});

describe("emitEvent", () => {
    it("is a no-op when nothing listens", () => {
        expect(() => {
            emitEvent({ name: ROUTE_REQUESTED, page: PAGE });
        }).not.toThrow();
    });
});
