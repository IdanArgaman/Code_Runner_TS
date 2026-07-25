import type { AdvancedTypingExample } from "./types";

export default {
  title: "Reading Rest + Destructuring Params (...[x]) — plain JS, no types",
  description:
    "The '...[params]' pattern used in recursive-template-literals.ts's navigate() method is " +
    "plain JavaScript, not a TypeScript feature -- it's a rest parameter immediately destructured. " +
    "This example strips away all typing so you can read the syntax on its own, one layer at a time.",
  code: () => {
    // Step 1: a normal rest parameter collects every remaining argument into an array.
    // (":any[]" here is only to satisfy this project's strict TS config -- ignore it,
    // the shape being explained is 100% plain JavaScript.)
    function logAll(...args: any[]) {
      console.log(args); // args is always an array, e.g. [1, 2, 3]
    }
    logAll(1, 2, 3);

    // Step 2: array destructuring pulls values out of an array by position.
    // "const [a] = [10, 20]" reads as "take the array, and name its first slot a".
    const [first] = [10, 20];
    console.log(first); // 10

    // Step 3: combine them. Instead of naming the rest array and indexing into it...
    function example1(...rest: any[]) {
      const first = rest[0];
      console.log("example1:", first);
    }

    // ...you can destructure the rest array directly in the parameter list.
    // Read "...[first]" from the outside in:
    //   "...x"    -> gather the remaining arguments into an array named x
    //   "[first]" -> ...but instead of keeping that array as "x", immediately
    //                destructure it and only keep its first element, named "first"
    function example2(...[first]: any[]) {
      console.log("example2:", first);
    }

    example1("a", "b", "c"); // first = "a" (via rest[0])
    example2("a", "b", "c"); // first = "a" (same value, no intermediate array name)

    // The remaining arguments ("b" and "c") are simply discarded -- destructuring
    // never requires you to consume every element.

    // This reads the same with an object rest+destructure, e.g. a single params object:
    function openDoor(...[{ id, force }]: any[]) {
      console.log(`Opening door ${id}, force=${force}`);
    }
    openDoor({ id: "front", force: false });

    // Why bother, instead of just declaring "function f(first) { ... }" directly?
    // Because "...[first]" still marks the parameter as a REST parameter under the hood --
    // in TypeScript this lets you attach a tuple TYPE to it (see recursive-template-literals.ts),
    // which can make that parameter conditionally optional/required based on a generic.
    // In plain JS, as shown here, it's just a slightly indirect way to name "the first
    // of the remaining arguments" without a separate array variable.
  },
} satisfies AdvancedTypingExample;
