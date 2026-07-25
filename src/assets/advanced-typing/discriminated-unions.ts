import type { AdvancedTypingExample } from "./types";

export default {
  title: "Discriminated Unions + Exhaustiveness Checking",
  description:
    "A 'discriminated union' is a union of object types that all share a common literal " +
    "property (the 'discriminant', often called 'kind' or 'type'). Switching on that property " +
    "narrows the whole object, and combining it with a 'never' catch-all makes the compiler " +
    "force you to handle every case.",
  code: () => {
    // Each variant has its own "kind" literal plus its own extra fields.
    type Shape =
      | { kind: "circle"; radius: number }
      | { kind: "square"; side: number }
      | { kind: "rectangle"; width: number; height: number };

    function area(shape: Shape): number {
      switch (shape.kind) {
        case "circle":
          // Inside this branch, TS narrows "shape" down to { kind: "circle"; radius: number }
          return Math.PI * shape.radius ** 2;
        case "square":
          return shape.side ** 2;
        case "rectangle":
          return shape.width * shape.height;
        default:
          // If a new Shape variant is ever added and NOT handled above, "shape" here
          // would no longer be typed "never", and this line would fail to compile --
          // that's how exhaustiveness checking catches missed cases at compile time.
          const _exhaustive: never = shape;
          throw new Error(`Unhandled shape kind: ${JSON.stringify(_exhaustive)}`);
      }
    }

    console.log(area({ kind: "circle", radius: 2 }));
    console.log(area({ kind: "rectangle", width: 3, height: 4 }));

    // Try adding a new variant, e.g. `{ kind: "triangle"; base: number; height: number }`,
    // to the Shape union above without adding a matching case -- the `never` assignment
    // in "default" will fail to compile until every kind is handled.
  },
} satisfies AdvancedTypingExample;
