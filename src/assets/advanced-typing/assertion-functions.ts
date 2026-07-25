import type { AdvancedTypingExample } from "./types";

export default {
  title: "Assertion Functions (asserts / asserts x is T)",
  description:
    "A function can declare 'asserts condition' or 'asserts value is Type' as its return type " +
    "instead of returning a boolean. Calling it doesn't return anything useful -- instead, if it " +
    "returns normally (doesn't throw), TypeScript narrows the checked variable's type for the " +
    "REST of the enclosing scope, similar to Node's built-in assert().",
  code: () => {
    // "asserts condition" -- narrows based on a boolean-like check, no specific type produced.
    function assert(condition: unknown, message: string): asserts condition {
      if (!condition) {
        throw new Error(message);
      }
    }

    function getLength(value: string | null) {
      assert(value !== null, "value must not be null");
      // After this line, TS knows "value" can no longer be null in this scope --
      // no "if" statement or type guard needed, the assertion did the narrowing.
      return value.length;
    }

    console.log(getLength("hello"));

    // "asserts value is Type" -- narrows the argument to a SPECIFIC type, like a type predicate
    // (pet is Cat) but as a side effect of a void-returning function instead of an if-check.
    interface Cat {
      meow(): void;
    }

    function assertIsCat(pet: unknown): asserts pet is Cat {
      if (typeof pet !== "object" || pet === null || !("meow" in pet)) {
        throw new Error("Not a cat!");
      }
    }

    function makeItMeow(pet: unknown) {
      assertIsCat(pet);
      // From here on, "pet" is typed as Cat -- no cast, no "if (isCat(pet))" wrapper needed.
      pet.meow();
    }

    makeItMeow({
      meow: () => console.log("meow!"),
    });

    // Why not just use a regular type guard ("pet is Cat") + an "if"? Assertion functions
    // are useful when the "else" branch would just be "throw" everywhere it's called --
    // they let you write the check once and keep the rest of the function flat,
    // instead of nesting every caller in an if/else or early-return.
  },
} satisfies AdvancedTypingExample;
