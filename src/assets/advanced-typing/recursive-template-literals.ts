import type { AdvancedTypingExample } from "./types";

export default {
  title: "Recursive Template Literal Types (Route Param Extraction)",
  description:
    "Template literal types can pattern-match on a string type using 'infer', and a conditional " +
    "type is allowed to reference itself -- so you can walk a string type segment by segment at " +
    "compile time. Here we parse an Express-style route path (e.g. '/users/:id') into an object " +
    "type of its ':param' names, entirely in the type system, no runtime parsing involved.",
  code: () => {
    // ExtractParams<Path> recursively strips one ":param/" segment at a time.
    type ExtractParams<Path extends string> =
      Path extends `${infer _Start}:${infer Param}/${infer Rest}`
        ? // Found a param with more path segments remaining after it --
          // intersect this param with whatever the rest of the path yields.
          { [K in Param]: string } & ExtractParams<`/${Rest}`>
        : Path extends `${infer _Start}:${infer Param}`
        ? // Found a param as the trailing segment (nothing left to recurse into).
          { [K in Param]: string }
        : // No ":" left in this segment -- base case, contributes no params.
          {};

    /*
      Step-by-step for ExtractParams<"/users/:userId/posts/:postId">:

      1. First branch matches: _Start = "/users/", Param = "userId", Rest = "posts/:postId"
         -> { userId: string } & ExtractParams<"/posts/:postId">

      2. Recurse into ExtractParams<"/posts/:postId">:
         - First branch fails (no "/" after ":postId").
         - Second branch matches: _Start = "/posts/", Param = "postId"
           -> { postId: string }

      3. The intersections roll up into { userId: string } & { postId: string }.
    */

    class Router {
      // "Path extends string" forces TS to infer the literal string type of whatever
      // is passed in (e.g. "/users/:userId"), not the general "string" type --
      // without it, ExtractParams could never pattern-match on the literal segments.
      navigate<Path extends string>(
        path: Path,
        // The params argument is required ONLY when ExtractParams<Path> has keys.
        // A tuple type that's conditionally [] vs [params: ...] makes the argument
        // itself optional/required based on that condition.
        ...[params]: keyof ExtractParams<Path> extends never
          ? []
          : [params: ExtractParams<Path>]
      ) {
        console.log(`Navigating to ${path}`, params);
      }
    }

    const router = new Router();

    // Works without params -- ExtractParams<"/home"> resolves to {}, so the rest
    // parameter's tuple type collapses to [], making "params" optional.
    router.navigate("/home");

    // Requires params matching { userId: string; postId: string } -- try removing
    // "postId" below and TS will report it as a missing property.
    router.navigate("/users/:userId/posts/:postId", {
      userId: "usr_123",
      postId: "post_999",
    });

    // router.navigate("/users/:userId/posts/:postId", {
    //   postId: "post_999",
    // }); // Error: Property 'userId' is missing
  },
} satisfies AdvancedTypingExample;
