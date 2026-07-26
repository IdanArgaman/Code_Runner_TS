import type { AdvancedTypingExample } from "./types";

export default {
  title: "as const",
  description:
    "'as const' tells TypeScript to infer the NARROWEST possible (literal) type for a value " +
    "instead of the general type it would normally widen to, and makes the whole structure " +
    "deeply readonly. It's a compile-time-only annotation -- no runtime effect.",
  code: () => {
    // Without "as const", string literals widen to "string" and arrays widen to a
    // mutable, general element type.
    const modeWidened = "dark"; // type: string
    const dirsWidened = ["up", "down"]; // type: string[]

    // With "as const", the literal type is preserved exactly, and the array becomes
    // a readonly tuple instead of a mutable string[].
    const modeNarrow = "dark" as const; // type: "dark"
    const dirsNarrow = ["up", "down"] as const; // type: readonly ["up", "down"]

    console.log(modeWidened, dirsWidened, modeNarrow, dirsNarrow);

    // dirsNarrow.push("left"); // Error -- readonly tuples have no push/pop/etc.
    // dirsNarrow[0] = "left"; // Error -- Cannot assign to '0' because it is a read only property

    // Objects work the same way: every property becomes readonly and keeps its
    // literal value instead of widening to the property's general type.
    const configWidened = { status: "active", retries: 3 };
    // configWidened.status is "string", configWidened.retries is "number" -- either
    // could be reassigned to any other string/number and TS wouldn't complain.

    const configNarrow = {
      status: "active",
      retries: 3,
    } as const;
    // configNarrow.status is the literal type "active", configNarrow.retries is the
    // literal type 3, and both properties are readonly.

    // configNarrow.status = "inactive"; // Error -- Cannot assign to 'status' because it is a read only property

    // A common, practical use: deriving a union type FROM a runtime array, so the
    // list of values and its type can never drift apart.
    const THEMES = ["light", "dark", "system"] as const;
    type Theme = (typeof THEMES)[number]; // "light" | "dark" | "system"

    function setTheme(theme: Theme) {
      console.log(`theme set to ${theme}`);
    }

    setTheme("dark"); // OK
    // setTheme("blue"); // Error -- "blue" is not assignable to type 'Theme'

    // Without "as const", THEMES would be string[], and (typeof THEMES)[number]
    // would just be "string" -- setTheme would accept any string, silently.
  },
} satisfies AdvancedTypingExample;
