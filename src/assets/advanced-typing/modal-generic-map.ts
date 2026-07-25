import type { AdvancedTypingExample } from "./types";

export default {
  title: "Modal Params Locked by Enum (Generic Map Lookup)",
  description:
    "A generic indexed by a lookup type (T extends keyof typeof map) can pull the exact shape " +
    "for a second parameter (J) out of a map object, so callers only ever see the params valid for " +
    "the modal type they passed in.",
  code: () => {
    enum MODAL_TYPE {
      ONE = "ONE",
      TWO = "TWO",
    }

    // The map is the single source of truth: each key's value shape becomes
    // the allowed "params" shape for that key.
    const modalParmasMap = {
      [MODAL_TYPE.ONE]: {
        onOk: () => {
          return 1;
        },
      },
      [MODAL_TYPE.TWO]: {
        onCancel: () => {
          return "2";
        },
      },
    };

    // T is inferred from the first argument (the enum value passed in).
    // J is then constrained to (typeof modalParmasMap)[T] — i.e. "whatever
    // shape the map declares for that specific key" — so TS ties params to type.
    function openModal<
      T extends MODAL_TYPE,
      J extends (typeof modalParmasMap)[T]
    >(type: T, params: J) {
      console.log(type);
      console.log(params);
    }

    openModal(MODAL_TYPE.ONE, {
      onOk() {
        return 1;
      },
    });

    openModal(MODAL_TYPE.TWO, {
      onCancel() {
        return "2";
      },
    });

    // openModal(MODAL_TYPE.ONE, { onCancel: () => "2" }); // Error: onCancel isn't valid for ONE
  },
} satisfies AdvancedTypingExample;
