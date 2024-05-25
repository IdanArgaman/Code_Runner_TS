const CodeTypesEnum = {
  GENERAL: "GENERAL",
  UTILITY: "UTILITY",
};

export default [
  {
    categoryId: CodeTypesEnum.GENERAL,
    title: "Enums",
    description: `Enum as object keys`,
    code: () => {
      enum MyEnum {
        First = "First",
        Second = "Second",
      }

      let obj: { [key in MyEnum]?: any };

      obj = {
        [MyEnum.First]: 1,
        // x: 1 - Causes an error!
      };
    },
  },
  {
    categoryId: CodeTypesEnum.GENERAL,
    title: "Types and interface",
    description: `Difference between type and interface`,
    code: () => {
      // Reference: https://blog.logrocket.com/types-vs-interfaces-typescript/

      /*
        The major differnce is "Declaration Merging". This is why interfaces are more applicable
        for libraries. Interfaces should generally be used when declaration merging is necessary,
        such as extending an existing library or authoring a new one!
      */

      // Types can be used for Union and functions
      type Transport = "Bus" | "Car" | "Bike" | "Walk";
      type AddFn = (num1: number, num2: number) => number;

      /* 
        Type aliases in TypeScript mean “a name for any type.” They provide a way of creating new
        names for existing types. Type aliases don’t define new types; instead, they provide
        an alternative name for an existing type.
      */
      type MyNumber = number;
      type ErrorCode = string | number;
      type NullOrUndefined = null | undefined;

      // An interface defines a contract that an object must adhere to
      interface Client1 {
        name: string;
        address: string;
      }

      // We can express the same Client contract definition using type annotations:
      type Client2 = {
        name: string;
        address: string;
      };

      // Conditional types and mapped types:
      type Car = "ICE" | "EV";

      type ChargeEV = (kws: number) => void;
      type FillPetrol = (type: string, liters: number) => void;

      // Note the constraint on the generic
      // Then note the checks agains a Type in the ternary
      type RefillHandler<A extends Car> = A extends "ICE"
        ? FillPetrol
        : A extends "EV"
        ? ChargeEV
        : never;

      // The types for chargeTesla and refillToyota are determined by the computed generic
      const chargeTesla: RefillHandler<"EV"> = (
        power /* cannot use extra param, x*/
      ) => {
        // Implementation for charging electric cars (EV)
      };
      const refillToyota: RefillHandler<"ICE"> = (
        fuelType,
        amount /* cannot use extra param, x*/
      ) => {
        // Implementation for refilling internal combustion engine cars (ICE)
      };

      // Declaration merging: Interface can be merged
      interface Client {
        name: string;
      }

      interface Client {
        age: number;
      }

      const harry: Client = {
        name: "Harry",
        age: 41,
      };

      // Extension is differnet between types and intefaces:
      // For interfaces we use the "extends" keyword
      interface VIPClient extends Client {
        benefits: string[];
      }

      // For type we use the intersection & operator
      type VIPClient2 = Client & { benefits: string[] }; // Client is a type

      // Extension conflict are not allowed in interfaces:

      interface Person {
        getPermission: () => string;
      }

      interface Staff extends Person {
        getPermission: () => string[];
      }

      // But we is allowed in types and TS will automatically merge all
      // properties instead of throwing errors

      type PersonW = {
        getPermission: (id: string) => string;
      };

      type StaffW = PersonW & {
        getPermission: (id: string[]) => string[];
      };

      const AdminStaff: StaffW = {
        getPermission: (id: string | string[]) => {
          return (typeof id === "string" ? "admin" : ["admin"]) as string[] &
            string;
        },
      };

      // In TypeScript, we can implement a class using either an interface or a type alias:

      interface PersonZ {
        name: string;
        greet(): void;
      }

      class StudentZ implements PersonZ {
        name: string = "";
        greet() {
          console.log("hello");
        }
      }

      type Pet = {
        name: string;
        run(): void;
      };

      class Cat implements Pet {
        name: string = "";
        run() {
          console.log("run");
        }
      }

      ////////////////////////////////////////////////////////////////////////////

      // In addition to describing an object with properties, interfaces are also
      // capable of describing function types.

      interface SearchFunc {
        (source: string, subString: string): boolean;
      }

      let mySearch: SearchFunc;

      mySearch = function (source: string, subString: string): boolean {
        let result = source.search(subString);
        return result > -1;
      };

      // And in objects:

      interface X {
        values: (r: string, l: number) => number;
      }

      const obj: X = {
        values(x: string, y: number) {
          return y;
        },
      };

      ////////////////////////////////////////////////////////////////////////////

      // Indexable types

      interface StringArray {
        [index: number]: string;
      }

      let myArray: StringArray;
      myArray = ["Bob", "Fred"];

      // string index signatures also enforce that all properties match their return type
      interface NumberDictionary {
        [index: string]: number;
        length: number; // ok, length is a number
        name: string; // error, the type of 'name' is not a subtype of the indexer
      }

      // A template string can be used to indicate that a particular pattern is allowed
      interface HeadersResponse {
        "content-type"?: string;
        date?: string;
        "content-length"?: string;
        // ⚠️ Permit any property starting with 'x-'.
        [headerName: `x-${string}`]: string;
      }

      const r: HeadersResponse = {};

      const type = r["content-type"];
      const poweredBy = r["x-powered-by"];
      const blah = r["x-blah"];
      const origin = r.origin;
    },
  },
  {
    categoryId: CodeTypesEnum.GENERAL,
    title: "Tuples",
    description: `Using TS Tuples`,
    code: () => {
      /*
        Tuples allow us to define BOTH fixed types and order in an array
      */

      type TeamMember = [name: string, role: string, age: number];

      // Creating tuples by interface
      interface ITeamMember extends Array<string | number> {
        0: string;
        1: string;
        2: number;
      }

      const x: TeamMember = ["A", "B", 1];
      const Tom: ITeamMember = ["Tom", 30, "Manager"];

      // When creating tuples using Types, TS will complain if we add more items to the tuple
      const y: TeamMember = ["A", "B", 3, 4];

      //But with interface, no complain!
      const peter: ITeamMember = ["Harry", "Dev", 24, 34];

      // Tuple usage:

      let tuple: [number, string, boolean];

      tuple = [7, "hello", true];

      let [a, b, c] = tuple; // a,b,c are strongly typed
    },
  },
  {
    categoryId: CodeTypesEnum.GENERAL,
    title: "const Assertions",
    description: `Added at TypeScript 3.4`,
    code: () => {
      /*
        The "as const" instruction makes the items readonly!
        
        no literal types in that expression should be widened (e.g. no going from "hello" to string)
        object literals get readonly properties
        array literals become readonly tuples
      */

      // Type '"hello"'
      let x = "hello" as const;
      x = "1";

      // Type 'readonly [10, 20]'
      let y = [10, 20] as const;
      y[0] = 11;

      // Type '{ readonly text: "hello" }'
      let z = { text: "hello" } as const;
      z.text = "11";
    },
  },
  {
    categoryId: CodeTypesEnum.GENERAL,
    title: "Object destructing with typing",
    description: `The syntax is a bit weird`,
    code: () => {
      const person = { name: "Alice", age: 25, hobby: "reading" };
      // Note the syntax, by typing it, we make sure person object
      // contains this types
      let { name, age }: { name: string; age: number } = person;

      const person2 = { name2: "11", age2: "25", hobby2: "reading" };
      const { name2, age2 }: { name2: string; age2: number } = person2;
      console.log(name2, age2);
    },
  },
  {
    categoryId: CodeTypesEnum.UTILITY,
    title: "ReturnType",
    description: `The ReturnType utility type, released in TypeScript version 2.8,
      lets a developer construct a new type from the return type of a function.`,
    code: () => {
      const getData = (name: string, age: number) => {
        return { age, name };
      };

      // Type is: { age, name } which is the return type of getData
      type NewType = ReturnType<typeof getData>;

      const getData2 = async (name: string, age: number) => {
        return { age, name };
      };

      // Type is: Promise<{ age, name }>
      type NewType2 = ReturnType<typeof getData2>;
    },
  },
  {
    categoryId: CodeTypesEnum.GENERAL,
    title: "Generic",
    description: ``,
    code: () => {
      // Generic constraints
      interface Lengthwise {
        length: number;
      }

      function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
        console.log(arg.length); // Now we know it has a .length property, so no more error
        return arg;
      }

      // Generic class
      class GenericNumber<T> {
        zeroValue: T;
        add: (x: T, y: T) => T = (x, y) => x;
      }

      let myGenericNumber = new GenericNumber<number>();
      myGenericNumber.zeroValue = 0;
      myGenericNumber.add = function (x, y) {
        return x + y;
      };

      // Cool example of generic function typing
      // ⚠️ Note that: TypeScript can also infer the type of the generic parameter from the function
      // parameters.
      function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
        return obj[key];
      }

      let x = { a: 1, b: 2, c: 3, d: 4 };

      getProperty(x, "a");
      getProperty(x, "m");
    },
  },
  {
    categoryId: CodeTypesEnum.GENERAL,
    title: "new()",
    description: `The new() keyword in typescript`,
    code: () => {
      /*
        new() describes a constructor signature in typescript. 
        What that means is that it describes the shape of the constructor
      */

      // c is a consturctor function that takes no params
      function create<Type>(c: new (n: number) => Type): Type {
        new c();
        new c("2");
        return new c(1);
      }

      class BeeKeeper {
        hasMask: boolean = true;
      }

      class ZooKeeper {
        nametag: string = "Mikle";
      }

      class Animal {
        numLegs: number = 4;
      }

      class Bee extends Animal {
        numLegs = 6;
        keeper: BeeKeeper = new BeeKeeper();
      }

      class Lion extends Animal {
        keeper: ZooKeeper = new ZooKeeper();
      }

      function createInstance<A extends Animal>(c: new () => A): A {
        return new c();
      }

      createInstance(Lion).keeper.nametag;
      createInstance(Bee).keeper.hasMask;
    },
  },
  {
    categoryId: CodeTypesEnum.GENERAL,
    title: "never",
    description: `Just like we have zero in our number system to denote the quantity of nothing,
      we need a type to denote impossibility in our type system.
    `,
    code: () => {
      // SOURCE: https://www.zhenghao.io/posts/ts-never

      // This function cannot be called! So if we can reach a code that calls it
      // we'll get an error.
      function unknownColor(x: never): never {
        throw new Error("unknown color");
      }

      // Note that the color can be 'blue' which is note handled by the switch
      // statement. Thus, 'unknownColor' may be called so we get an error!
      // Delete 'blue' from the possible values removes the error!
      type Color = "red" | "green" | "blue";

      function getColorName(c: Color): string {
        switch (c) {
          case "red":
            return "is red";
          case "green":
            return "is green";
          default:
            return unknownColor(c); // Argument of type 'string' is not assignable to parameter of type 'never'
        }
      }

      //////////////////////////////////////////////////////////////////////////

      // Union constraints:

      type VariantA = {
        a: string;
      };

      type VariantB = {
        b: number;
      };

      interface X {
        // Allow objects with a or b or BOTH - but we want to constraint the BOTH option
        (arg: VariantA | VariantB): void;
      }

      const input = { a: "foo", b: 123 };
      const inputR = { y: "foo" };
      let fn: X = (input) => {};
      fn(input)
      fn(inputR)

      //////////////////////////////////////////////////////////////////////////

      type VariantAX = {
        a: string
        b?: never           // NOTE!
      }
      
      type VariantBX = {
          b: number
          a?: never         // NOTE!
      }

      interface Y {
        (arg: VariantAX | VariantBX): void;
      }
      
      const inputX = {a: 'foo', b: 123 }
      const inputY = {a: 'foo' }
      const inputZ = {b: 123 }
      const inputZ1 = {c: 123 }
      const inputZ2 = {b: 123, c: 123 }

      let fnX: Y = (input) => {};

      fnX(inputX);
      fnX(inputY);
      fnX(inputZ);
      fnX(inputZ1);
      fnX(inputZ2);

      //////////////////////////////////////////////////////////////////////////

      // Block method that uses generics:

      type Read = {}
      type Write = {}
      const toWrite: Write = {}

      class MyCache<T, R> {
        cache: { [index: number]: T } = {};

        // We can block this method if T is never
        put(val: T): boolean {
          this.cache[0] = val;
          return true;
        }
        get(): R {
          return '1' as R;
        }
      }

      const cache = new MyCache<Write, Read>();
      cache.put(toWrite) // ✅ allowed

      const cache2 = new MyCache<never, Read>();
      cache2.get();
      cache2.put(1);

      // We can type the argument of the put method as never
      // to have a read-only cache only allowing for reading dataS
      class ReadOnlyCache<R> extends MyCache</* ⚠️ */ never, number> {} 
      const readOnlyCache = new ReadOnlyCache();
      readOnlyCache.get();
      readOnlyCache.put(1);   // We cannot invoke put since it accepts never!
    },
  },
];
