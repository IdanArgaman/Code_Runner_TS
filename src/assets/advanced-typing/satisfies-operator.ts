import type { AdvancedTypingExample } from "./types";

export default {
  title: "satisfies (TS 4.9)",
  description:
    "satisfies checks a literal against a type WITHOUT widening it to that type, unlike a type " +
    "annotation (:) or 'as'. You keep the narrow/literal type for inference while still getting " +
    "an error if the value doesn't conform.",
  code: () => {
    type Colors = "red" | "green" | "blue";

    // With a normal annotation, palette is widened to Record<Colors, string> --
    // TS forgets which literal keys exist, so palette.red below wouldn't be safe to index.
    const paletteAnnotated: Record<Colors, string> = {
      red: "#f00",
      green: "#0f0",
      blue: "#00f",
    };
    // paletteAnnotated.red is technically fine here, but the *inferred type* of each
    // value is just "string" -- TS can't tell "#f00" apart from any other string.

    // With "satisfies", TS still checks every key/value against Record<Colors, string>,
    // but the variable's inferred type stays the literal object type.
    const palette = {
      red: "#f00",
      green: "#0f0",
      blue: "#00f",
    } satisfies Record<Colors, string>;

    // Because palette kept its literal shape, TS knows .red exists and is exactly "#f00".
    console.log(palette.red.toUpperCase()); // OK -- "#f00" is known to be a string literal

    // If we used ": Record<Colors, string>" instead, palette.red's type would just be
    // "string", so autocomplete/narrowing on the specific value would be lost.

    // satisfies still catches mistakes at the definition site:
    // const bad = { red: "#f00", green: "#0f0" } satisfies Record<Colors, string>;
    // Error: Property 'blue' is missing

    // const bad2 = { red: 1, green: "#0f0", blue: "#00f" } satisfies Record<Colors, string>;
    // Error: Type 'number' is not assignable to type 'string'
  },
} satisfies AdvancedTypingExample;
