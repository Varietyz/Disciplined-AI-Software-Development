import { PEM_OPENING, PRIVATE_KEY_MARK } from "#configuration/constants/detector.constants";
import { defineDetector } from "#core/registries/detector.registry";

defineDetector({ detects: (value) => value.includes(PEM_OPENING) && value.includes(PRIVATE_KEY_MARK), kind: "key" });
