import type { AdvancedTypingExample } from "./types";

// Every sibling file (except this index and the shared type module) is a
// single self-contained example. Adding a new example is just "add a file" —
// this glob picks it up and the UI nav is generated from it automatically.
const modules = import.meta.glob<{ default: AdvancedTypingExample }>(
  ["./*.ts", "!./index.ts", "!./types.ts"],
  { eager: true }
);

const examples: (AdvancedTypingExample & { slug: string })[] = Object.keys(
  modules
)
  .sort()
  .map((path) => {
    const slug = path.replace("./", "").replace(/\.ts$/, "");
    return { ...modules[path].default, slug };
  });

export default examples;
