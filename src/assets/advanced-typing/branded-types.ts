import type { AdvancedTypingExample } from "./types";

export default {
  title: "Branded / Nominal Types",
  description:
    "TypeScript uses structural typing -- any string is assignable wherever a string is expected, " +
    "regardless of 'meaning'. Branded (a.k.a. nominal) types fake nominal typing by intersecting " +
    "a primitive with a unique tag property that only exists at the type level, so two " +
    "differently-branded strings/numbers stop being interchangeable.",
  code: () => {
    // The "brand" property never actually exists at runtime -- it's a phantom marker
    // purely to make the type checker treat this as distinct from a plain string.
    type UserId = string & { readonly __brand: "UserId" };
    type OrderId = string & { readonly __brand: "OrderId" };

    // Since nothing can naturally satisfy the brand, we create branded values through
    // a constructor function that performs the (usually unchecked) cast in one place.
    function toUserId(id: string): UserId {
      return id as UserId;
    }

    function toOrderId(id: string): OrderId {
      return id as OrderId;
    }

    function getUser(id: UserId) {
      console.log("Fetching user", id);
    }

    const userId = toUserId("user_123");
    const orderId = toOrderId("order_456");

    getUser(userId); // OK
    // getUser(orderId); // Error: Type 'OrderId' is not assignable to type 'UserId'
    // getUser("user_123"); // Error: a plain string isn't a UserId either -- must go through toUserId()

    // Without branding, this mistake compiles fine because both IDs are "just strings":
    function getUserUnbranded(id: string) {
      console.log("Fetching user (unbranded)", id);
    }
    getUserUnbranded(orderId); // No error -- silently accepts the wrong kind of id

    // The same trick works for numbers too, e.g. distinguishing units:
    type Meters = number & { readonly __brand: "Meters" };
    type Seconds = number & { readonly __brand: "Seconds" };

    function toMeters(n: number): Meters {
      return n as Meters;
    }

    function speed(distance: Meters, time: Seconds): number {
      return (distance as number) / (time as number);
    }

    speed(toMeters(100), 9.58 as Seconds);
  },
} satisfies AdvancedTypingExample;
