import type { AdvancedTypingExample } from "./types";

export default {
  title: "keyof, typeof, and Indexed Access Types",
  description:
    "Three small operators that combine to derive types FROM values instead of writing them by " +
    "hand: 'typeof' pulls a type from a runtime value, 'keyof' turns an object type into a union " +
    "of its keys, and Type['key'] (indexed access) pulls out the type of a single property -- " +
    "or, with a union of keys, a union of property types.",
  code: () => {
    // A plain runtime object -- note there's no separately hand-written type for it.
    const httpStatusMessages = {
      200: "OK",
      404: "Not Found",
      500: "Internal Server Error",
    };

    // "typeof" reads the TYPE of that value (not its runtime value) --
    // giving us { 200: string; 404: string; 500: string }.
    type StatusMessages = typeof httpStatusMessages;

    // "keyof" turns the object type's keys into a union type.
    // Because the keys above are numeric literals, this is: 200 | 404 | 500
    type StatusCode = keyof StatusMessages;

    // Indexed access with a single key extracts that property's type.
    type OkMessage = StatusMessages[200]; // string (specifically "OK" if declared "as const")

    // Indexed access with a union of keys extracts a union of every matching property's type.
    type AnyStatusMessage = StatusMessages[StatusCode]; // string

    function getMessage(code: StatusCode): string {
      return httpStatusMessages[code];
    }

    console.log(getMessage(404));
    // getMessage(999); // Error: 999 is not assignable to StatusCode

    // This "typeof + keyof + indexed access" trio is exactly how the modal example in
    // modal-generic-map.ts derives its generic constraint from a plain object map,
    // instead of duplicating the map's shape in a hand-written type.

    // keyof also works directly on interfaces/types, not just via typeof:
    interface Settings {
      theme: "light" | "dark";
      fontSize: number;
      notifications: boolean;
    }

    type SettingsKey = keyof Settings; // "theme" | "fontSize" | "notifications"

    function updateSetting<K extends SettingsKey>(key: K, value: Settings[K]) {
      // Settings[K] ties "value"'s allowed type to whichever key was passed in.
      console.log(`Setting ${key} to`, value);
    }

    updateSetting("theme", "dark"); // OK
    updateSetting("fontSize", 14); // OK
    // updateSetting("theme", 14); // Error: 14 is not assignable to "light" | "dark"
  },
} satisfies AdvancedTypingExample;
