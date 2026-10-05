import { persistTreeDeclarations } from "#core/persistence/tree.persistence";
import process from "node:process";
import { relativePath } from "@ssot/paths";
import { treeDeclarations } from "#core/loaders/tree.loader";
import { treesLine } from "#configuration/strings/anatomy.strings";

const declarations = treeDeclarations();
await persistTreeDeclarations(declarations);
process.stdout.write(treesLine(declarations.length, relativePath("app.anatomyTrees")));
