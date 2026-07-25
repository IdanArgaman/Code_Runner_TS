import type { AdvancedTypingExample } from "./types";

export default {
  title: "Variadic Tuple Types",
  description:
    "The spread (...) syntax works INSIDE tuple type positions, not just in function calls. " +
    "This lets a generic tuple type grow, shrink, or be concatenated with another tuple while " +
    "TypeScript keeps track of every element's exact type and position -- used heavily by " +
    "libraries typing things like curry(), concat(), or Redux middleware chains.",
  code: () => {
    // Concatenate two tuples into one, preserving each element's own type.
    type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U];

    type Head = [name: string, age: number];
    type Tail = [isAdmin: boolean];
    type Combined = Concat<Head, Tail>; // [string, number, boolean]

    // A "prepend an argument" helper -- commonly used to type currying / partial application.
    type PrependArg<Arg, Fn extends (...args: any[]) => any> = (
      arg: Arg,
      ...rest: Parameters<Fn>
    ) => ReturnType<Fn>;

    function greet(name: string, punctuation: string): string {
      return `Hello, ${name}${punctuation}`;
    }

    // withLogging takes any function and returns a new function requiring one extra
    // leading "label" argument, while preserving the original params + return type.
    function withLogging<Fn extends (...args: any[]) => any>(
      fn: Fn
    ): PrependArg<string, Fn> {
      return ((label: string, ...args: Parameters<Fn>) => {
        console.log(`[${label}] calling with`, args);
        return fn(...args);
      }) as PrependArg<string, Fn>;
    }

    const loggedGreet = withLogging(greet);
    console.log(loggedGreet("greet-call", "World", "!"));

    // Variadic tuples also support a fixed prefix/suffix around a spread of unknown length,
    // e.g. modelling "first item, then any number of items, then a last item":
    type FirstAndRest<T extends unknown[]> = T extends [infer First, ...infer Rest]
      ? { first: First; rest: Rest }
      : never;

    type Parsed = FirstAndRest<[string, number, boolean]>;
    // Parsed = { first: string; rest: [number, boolean] }
  },
} satisfies AdvancedTypingExample;
