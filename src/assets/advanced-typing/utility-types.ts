import type { AdvancedTypingExample } from "./types";

export default {
  title: "Built-in Utility Types (Pick, Omit, Partial, Record, Exclude, Extract)",
  description:
    "TypeScript ships a set of generic helper types that transform other types. They're just " +
    "type aliases built from mapped types + conditional types under the hood -- knowing them " +
    "saves you from re-deriving the same patterns by hand.",
  code: () => {
    interface Product {
      id: string;
      name: string;
      price: number;
      description: string;
      internalNotes: string;
    }

    // Pick<T, Keys> -- keep only the listed keys
    type ProductSummary = Pick<Product, "id" | "name" | "price">;
    const summary: ProductSummary = { id: "1", name: "Mug", price: 9.99 };

    // Omit<T, Keys> -- keep everything EXCEPT the listed keys (opposite of Pick)
    type PublicProduct = Omit<Product, "internalNotes">;
    const publicProduct: PublicProduct = {
      id: "1",
      name: "Mug",
      price: 9.99,
      description: "A mug",
    };

    // Partial<T> -- makes every property optional (handy for PATCH-style updates)
    type ProductPatch = Partial<Product>;
    const patch: ProductPatch = { price: 12.99 }; // only the fields being changed

    // Required<T> -- the opposite of Partial, forces every property to be present
    type StrictProduct = Required<ProductPatch>;

    // Readonly<T> -- makes every property readonly
    type FrozenProduct = Readonly<Product>;
    const frozen: FrozenProduct = { ...publicProduct, internalNotes: "" };
    // frozen.price = 1; // Error: Cannot assign to 'price' because it is a read-only property

    // Record<Keys, Value> -- build an object type from a union of keys to a single value type
    type ProductsById = Record<string, Product>;
    const byId: ProductsById = { "1": { ...publicProduct, internalNotes: "" } };

    // Exclude<Union, Members> -- remove members from a union
    type Status = "idle" | "loading" | "success" | "error";
    type FinishedStatus = Exclude<Status, "idle" | "loading">; // "success" | "error"

    // Extract<Union, Members> -- keep only members assignable to the second union (opposite of Exclude)
    type LoadingStatus = Extract<Status, "idle" | "loading">; // "idle" | "loading"

    // NonNullable<T> -- strips null and undefined from a type
    type MaybeName = string | null | undefined;
    type DefiniteName = NonNullable<MaybeName>; // string

    // Awaited<T> -- unwraps a Promise (recursively), mirrors what "await" does to types
    type FetchResult = Promise<{ ok: boolean }>;
    type Unwrapped = Awaited<FetchResult>; // { ok: boolean }

    console.log(summary, patch, byId);
  },
} satisfies AdvancedTypingExample;
