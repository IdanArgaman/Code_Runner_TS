import type { AdvancedTypingExample } from "./types";

export default {
  title: "satisfies (TS 4.9)",
  description:
    "satisfies checks a literal against a type WITHOUT widening it to that type, unlike a type " +
    "annotation (:) or 'as'. You keep the narrow/literal type for inference while still getting " +
    "an error if the value doesn't conform.",
  code: () => {
    // ---------------------------------------------------------------------
    // 1. Basic concept: satisfies validates structure but keeps the
    //    narrow/literal type, instead of widening to the annotated type.
    // ---------------------------------------------------------------------
    type ObjectType = {
      value: string | number;
    };

    // With a normal annotation, "a.value" widens to "string | number" --
    // TS forgets it was specifically a string, so string-only methods break.
    // const a: ObjectType = { value: "hello" };
    // a.value.toUpperCase(); // Error -- 'toUpperCase' does not exist on type 'string | number'

    // With "satisfies", TS still checks the value against ObjectType, but
    // "a.value" keeps its inferred literal type: string.
    const a = {
      value: "hello",
    } satisfies ObjectType;

    console.log(a.value.toUpperCase()); // OK -- a.value is known to be a string

    // ---------------------------------------------------------------------
    // 2. Complex / optional options object: prevents widening and keeps
    //    autocomplete on the extracted variable without forcing "as const".
    // ---------------------------------------------------------------------
    type ComplexOptions = {
      mode: "simple" | "advanced";
      format?: "json" | "csv";
      level?: number;
      retryCount?: number;
    };

    function processOptions(options: ComplexOptions) {
      console.log(`processing in ${options.mode} mode (level ${options.level ?? "default"})`);
    }

    // Without "satisfies", extracting this into its own variable first would
    // widen "mode" to "string", so passing it to processOptions would fail
    // unless the parameter type also widened -- and any typo in "mode" would
    // only be caught where the variable is used, not where it's defined.
    const option = {
      mode: "advanced",
      level: 5,
    } satisfies ComplexOptions;

    // option.mode is still the literal "advanced" (not "string"), so this
    // passes type validation AND keeps precise autocomplete on "option".
    processOptions(option);

    // ---------------------------------------------------------------------
    // 3. Record & dictionary narrowing: validates every key/value against a
    //    Record constraint while retaining each value's exact, specific type.
    // ---------------------------------------------------------------------
    type RGB = `#${string}` | [number, number, number];
    type PrimaryColor = "red" | "green" | "blue";

    const colors = {
      red: "#ff0000",
      green: [0, 255, 0],
      blue: [0, 0, 255],
    } satisfies Record<PrimaryColor, RGB>;

    // Retains the knowledge that colors.red is specifically a string...
    console.log(colors.red.toUpperCase());
    // ...and that colors.green is specifically a tuple/array, not "RGB" in general.
    console.log(colors.green.map((val) => val * 2));

    // With a plain ": Record<PrimaryColor, RGB>" annotation instead, both
    // colors.red and colors.green would widen to the union type RGB, so
    // neither .toUpperCase() nor .map() would type-check.

    // ---------------------------------------------------------------------
    // 4. Exhaustiveness checking with "satisfies never": makes TS raise a
    //    compile error if a switch stops covering every case of a union.
    //
    //    How it works, step by step:
    //    a) TS narrows the type of "grade" as it flows through the switch.
    //       Each "case" branch removes one literal from the union, because
    //       control flow analysis knows that literal was just handled.
    //    b) By the time execution reaches "default", every member of Grade
    //       ("A" | "B" | "C" | "D" | "F") has been eliminated -- so inside
    //       "default", the narrowed type of "grade" is the EMPTY union,
    //       which TS calls "never". This only happens because all 5 cases
    //       above are present; it's not something we wrote, it's inferred.
    //    c) "grade satisfies never" then checks: is this narrowed type
    //       assignable to "never"? Since it already IS never, the check
    //       trivially passes -- satisfies doesn't change the value or its
    //       type, it just validates it (unlike ": never", which would also
    //       widen/change the declared type of the variable it's on).
    //    d) Now suppose Grade gains a new member, e.g. "A+", but nobody
    //       updates this switch. Inside "default", "grade" would then be
    //       narrowed to "A+" (the one case control flow couldn't rule out)
    //       instead of "never". "A+" is NOT assignable to "never", so
    //       "grade satisfies never" fails to compile right there --
    //       pointing at the exact spot the switch forgot to handle, at
    //       compile time, before the code ever runs.
    // ---------------------------------------------------------------------
    type Grade = "A" | "B" | "C" | "D" | "F";
    // type Grade = "A" | "B" | "C" | "D" | "F" | "A+"; // uncomment to see the
    // "grade satisfies never" line below fail to compile with:
    // "Type 'A+' is not assignable to type 'never'."

    function getGradeDescription(grade: Grade): string {
      switch (grade) {
        case "A":
          return "Excellent";
        case "B":
          return "Good";
        case "C":
          return "Average";
        case "D":
          return "Below Average";
        case "F":
          return "Failing";
        default: {
          // "grade" is narrowed to "never" here -- see the explanation
          // above for why. The "satisfies" check is what turns a silent,
          // easy-to-miss gap into a build-breaking compile error.
          const _exhaustiveCheck: never = grade satisfies never;
          throw new Error(`Invalid grade: ${_exhaustiveCheck}`);
        }
      }
    }

    console.log(getGradeDescription("A"));
  },
} satisfies AdvancedTypingExample;
