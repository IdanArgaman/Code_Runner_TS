import type { AdvancedTypingExample } from "./types";

export default {
  title: "unknown, never & Other Special Types",
  description:
    "TypeScript has a handful of types that aren't 'normal' data shapes but instead describe " +
    "special states in the type system: 'unknown' (a safe any), 'never' (a value that can't " +
    "exist), 'void' (a function's return is ignored), 'undefined'/'null' (absence, under " +
    "strictNullChecks), and 'any' (opt out of checking entirely). Knowing what each one actually " +
    "means -- and when the compiler assigns it to you -- avoids both false confidence and " +
    "needless friction.",
  code: () => {
    // ── unknown: the type-safe counterpart to `any` ──────────────────────────
    // Anything is assignable TO unknown, but unknown isn't assignable to anything
    // else without a narrowing check first. Use it for values whose shape you
    // don't control yet (JSON.parse results, catch clause errors, external input).
    let value: unknown = 42;
    value = "now a string";
    value = { anything: "goes in" };

    // value.toUpperCase(); // Error: Object is of type 'unknown'
    if (typeof value === "string") {
      // Narrowed to string inside this block -- now it's safe to use.
      console.log(value.toUpperCase());
    }

    function describe(x: unknown): string {
      if (typeof x === "number") return `number: ${x}`;
      if (typeof x === "string") return `string: ${x}`;
      if (Array.isArray(x)) return `array of ${x.length}`;
      return "unknown shape";
    }
    console.log(describe(123), describe("hi"), describe([1, 2, 3]));

    // ── any: escape hatch, use sparingly ──────────────────────────────────
    // Unlike unknown, `any` disables checking on the value entirely -- it will
    // let you call methods, access properties, or reassign to anything with no
    // compile-time complaints, silently reintroducing plain-JS behavior.
    let anything: any = "start as string";
    anything = anything.toFixed(2); // "compiles" even though strings have no toFixed
    console.log(typeof anything, anything);

    // ── never: a type with no possible values ────────────────────────────
    // `never` shows up in two places: functions that never return normally,
    // and the "impossible" branch left over after exhaustively narrowing a union.
    function fail(message: string): never {
      throw new Error(message);
    }

    function infiniteLoop(): never {
      while (true) {
        /* never returns */
      }
    }
    void infiniteLoop; // referenced only to show its type; not called (would hang)

    type Status = "idle" | "loading" | "done";
    function handle(status: Status) {
      switch (status) {
        case "idle":
          return "waiting to start";
        case "loading":
          return "in progress";
        case "done":
          return "finished";
        default:
          // If every Status member is handled above, `status` here has been
          // narrowed all the way down to `never` -- assigning it to a `never`
          // variable is what makes an unhandled case a compile error, not just
          // a runtime surprise. See discriminated-unions.ts for the full pattern.
          const exhaustive: never = status;
          return fail(`Unhandled status: ${exhaustive}`);
      }
    }
    console.log(handle("loading"));

    // never also naturally appears as the element type of an empty array literal
    // when TS can't infer anything more specific, and as the result of intersecting
    // incompatible primitives:
    type Impossible = string & number; // never -- nothing is both a string and a number

    // ── void: "the return value doesn't matter" ──────────────────────────
    // void is specifically for function return positions. A void-returning
    // function can still internally `return;` with no value, but callers are
    // told not to rely on what comes back.
    function logMessage(message: string): void {
      console.log(message);
    }
    const result: void = logMessage("hello"); // legal, but `result` is useless by design

    // Contrast with undefined: `() => undefined` promises callers a real
    // undefined value they can check for; `() => void` makes no such promise
    // and callback signatures typed `void` may safely ignore whatever a caller
    // actually returns (handy for array callbacks like forEach).
    const callback: () => void = () => 42; // OK -- return value is intentionally discarded

    // ── undefined & null under strictNullChecks ──────────────────────────
    // With strictNullChecks on, `undefined` and `null` are their own distinct
    // types and must be explicitly included in a union to be allowed.
    function findUser(id: number): { id: number; name: string } | undefined {
      const users = [{ id: 1, name: "Ada" }];
      return users.find((u) => u.id === id);
    }
    const user = findUser(2);
    // console.log(user.name); // Error: user is possibly 'undefined'
    console.log(user?.name ?? "not found");
  },
} satisfies AdvancedTypingExample;
