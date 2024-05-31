const CodeTypesEnum = {
  GENERAL: "GENERAL",
  UTILITY: "UTILITY",
  SNIPPET: "SNIPPET",
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

      // Define enum as key in an object!
      let obj: { [key in MyEnum]?: any };

      obj = {
        [MyEnum.First]: 1,
        x: 1, // Causes an error!
      };
    },
  },
  {
    categoryId: CodeTypesEnum.GENERAL,
    title: "Generic Functions Explained",
    description: `More details: 
      https://www.typescriptlang.org/docs/handbook/2/functions.html#inference
      https://dmitripavlutin.com/typescript-function-type`,
    code: () => {
      // By declaring:
      // We say: we want a function that get 'x' of type T and return result of type U
      // So we have a freedom to accept functions that gets any input and return any output

      // When defining a type the return value is defined by =>
      type fn0 = <T, U>(x: T) => U;

      // No typing!
      const fn1 = (f, z) => {
        return f(z);
      };

      // With Typing! Note how we designate return value when typing a function, we use ":",
      // in contrast when designating return value when defining a type, we use "=>".
      const fn2 = <T, U>(
        f: (x: T) => U /* type definition, return value "=>" */,
        z: T
      ): U /* function definition, return value ":" */ => {
        f("1"); // We cannot send specific type for f, we need to support any type!
        // because f accepts T which can be any type!

        return f(z);
      };

      fn2((x) => x.toString(), "1"); // Defining z = '1', infer the type of x to be string
      fn2((y) => y * 2, 1); // Defining z = 1, infer the type of x to be number

      /////////////////////////
      // Typing map function //
      /////////////////////////

      // with no types:
      const mapX = (f, arr) => arr.map((x) => f(x));

      // with types, note the difference when defining a type in contrast to function type decoration:
      type myMap = <T, U>(f: (x: T) => U, arr: T[]) => U[];
      const map = <T, U>(f: (x: T) => U, arr: T[]): U[] => arr.map((x) => f(x));

      // Type script infer T and U types by usage, so we don't need to explicitly define them.
      const result0 = map((x) => x.toString(), [1, 2, 3]);
      const result1 = map((x) => x.toString(), [1, "2", 3]);
      const result2 = map((x) => parseInt(x), ["1", "2", "3"]);

      // We should note that typescript infer the parameters for f
      // by examing the array of passed as the second parameter, this is
      // why some f functions are not allowed for certain arrays
      const result2X = map((x) => parseInt(x), [1]);

      const result3 = map((x) => x % 2 === 0, [1, 2, 3]);
      const result4 = map((x) => (x ? 0 : 1), [false, true, false]);
      const result5 = map((x) => x.length, [["a", "b"], [1, 2, 3], []]);

      parseInt(result1[0]); // result1[0] is string, typescript correctly inferred it!
      result1[0].toUpperCase();
    },
  },
  {
    categoryId: CodeTypesEnum.GENERAL,
    title: "Types VS interface",
    description: `Difference between type and interface`,
    code: () => {
      // Reference: https://blog.logrocket.com/types-vs-interfaces-typescript/

      /*
        Types VS interface: The major differnce is "Declaration Merging". This is why interfaces 
        are more applicable for libraries. Interfaces should generally be used when declaration
        merging is necessary, such as extending an existing library or authoring a new one!
      */

      // Types can be used for Union and functions
      type Transport = "Bus" | "Car" | "Bike" | "Walk";
      type AddFn = (num1: number, num2: number) => number;

      /* 
        Type aliases in TypeScript mean "a name for any type." They provide a way of creating new
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

      ////////////////////////////////////////
      // Conditional types and mapped types //
      ////////////////////////////////////////

      type Car = "ICE" | "EV";

      type ChargeEV = (kws: number) => void;
      type FillPetrol = (type: string, liters: number) => void;

      // Note the constraint on the generic
      // Then note the checks agains a Type in the ternary

      type RefillHandler<A extends Car> = A extends "ICE" /* Type mapping */
        ? FillPetrol
        : A extends "EV"
        ? ChargeEV
        : never;

      // The types for chargeTesla and refillToyota are determined by the computed generic

      const chargeTesla: RefillHandler<"EV"> = (power) => {};
      const refillToyota: RefillHandler<"ICE"> = (fuelType, amount) => {
        // Implementation for refilling internal combustion engine cars (ICE)
      };

      /////////////////////////
      // Declaration merging //
      /////////////////////////

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

      // Note the & which combines the two types
      // now we can call getPermission with a string or string[]
      type StaffW = PersonW & {
        getPermission: (id: string[]) => string[];
      };

      const AdminStaff: StaffW = {
        getPermission: (id: string | string[]) => {
          return (typeof id === "string" ? "admin" : ["admin"]) as string[] &
            string;
        },
      };

      ////////////////////
      // Typing Classes //
      ////////////////////

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

      //////////////////////
      // Typing functions //
      //////////////////////

      interface SearchFunc {
        (source: string, subString: string): boolean;
      }

      let mySearch: SearchFunc = function (
        source: string,
        subString: string
      ): boolean {
        let result = source.search(subString);
        return result > -1;
      };

      // Typing function without interface
      type myAddeType = (baseValue: number, increment: number) => number;

      let myAdd: (baseValue: number, increment: number) => number = function (
        x: number,
        y: number
      ): number {
        return x + y;
      };

      /////////////////////
      // Indexable types //
      /////////////////////

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

      //////////////////////////////
      // More playing with types: //
      //////////////////////////////

      type NullableString = string | null | undefined;
      type NonNullable<T> = T extends null | undefined ? never : T;
      type x = NonNullable<null>;
      type y = NonNullable<String>;
    },
  },
  {
    categoryId: CodeTypesEnum.GENERAL,
    title: "Tuples",
    description: `Using TS Tuples`,
    code: () => {
      // Tuples allow us to define BOTH fixed types and order in an array
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
      // Note the syntax: by typing it, we make sure person object contains these types
      const person = { name: "Alice", age: 25, hobby: "reading" };
      let { name, age }: { name: string; age: number } = person;

      const person2 = {
        name2: "11",
        age2: "25" /* ERROR */,
        hobby2: "reading",
      };
      const { name2, age2 }: { name2: string; age2: number } = person2;

      const { a, b }: { a: string; b: number } = { a: 1 /* ERROR */, b: 2 };
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
    title: "Generic classes and generic constraints",
    description: ``,
    code: () => {
      // Generic constraints
      interface Lengthwise {
        length: number;
      }

      function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
        console.log(arg.length); // Thanks to the constraint, we know for sure arg has a "length" property!
        return arg;
      }

      // Generic class
      declare class GenericNumber<T> {
        zeroValue: T;
        add: (x: T, y: T) => T;
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
        // This constructor makes: createInstance(Lion).keeper.nametag; to fail check
        // becasue parameter type c is expected to be a class which its constructor
        // takes no arugments

        // constructor(name: string) {
        //   super();
        // };

        keeper: ZooKeeper = new ZooKeeper();
      }

      // c is a class that has consturctor with no params and returns a instance derived from Animal
      function createInstance<A extends Animal>(c: new () => A): A {
        return new c();
      }

      createInstance(Lion).keeper.nametag;
      createInstance(Bee).keeper.hasMask;

      //// MORE ////

      // We are using the "new" keyword to check if T is a class that contains a consturctor that takes params
      // We also infer its args into a type P
      type Args<T> = T extends new (...args: infer P) => any ? P : never;

      class MyClass {
        constructor(name: string, age: number) {}
      }

      type MyClassArgs = Args<typeof MyClass>; // [string, number]
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
      fn(input);
      fn(inputR);

      //////////////////////////////////////////////////////////////////////////

      type VariantAX = {
        a: string;
        b?: never; // NOTE!
      };

      type VariantBX = {
        b: number;
        a?: never; // NOTE!
      };

      interface Y {
        (arg: VariantAX | VariantBX): void;
      }

      const inputX = { a: "foo", b: 123 };
      const inputY = { a: "foo" };
      const inputZ = { b: 123 };
      const inputZ1 = { c: 123 };
      const inputZ2 = { b: 123, c: 123 };

      let fnX: Y = (input) => {};

      fnX(inputX);
      fnX(inputY);
      fnX(inputZ);
      fnX(inputZ1);
      fnX(inputZ2);

      //////////////////////////////////////////////////////////////////////////

      // Block method that uses generics:

      type Read = {};
      type Write = {};
      const toWrite: Write = {};

      class MyCache<T, R> {
        cache: { [index: number]: T } = {};

        // We can block this method if T is never
        put(val: T): boolean {
          this.cache[0] = val;
          return true;
        }
        get(): R {
          return "1" as R;
        }
      }

      const cache = new MyCache<Write, Read>();
      cache.put(toWrite); // ✅ allowed

      const cache2 = new MyCache<never, Read>();
      cache2.get();
      cache2.put(1);

      // We can type the argument of the put method as never
      // to have a read-only cache only allowing for reading dataS
      class ReadOnlyCache<R> extends MyCache</* ⚠️ */ never, number> {}
      const readOnlyCache = new ReadOnlyCache();
      readOnlyCache.get();
      readOnlyCache.put(1); // We cannot invoke put since it accepts never!
    },
  },
  {
    categoryId: CodeTypesEnum.GENERAL,
    title: "Type Guard",
    description: ``,
    code: () => {
      // More on type guards: https://www.geeksforgeeks.org/how-to-use-type-guards-in-typescript/

      interface Cat {
        meow(): void;
      }
      interface Dog {
        bark(): void;
      }

      // To define a user-defined type guard, we simply need to define a function whose
      // return type is a "type predicate". "pet is Cat" is our type predicate in this example.

      function isCat(pet: Dog | Cat): pet is Cat {
        // The function returns boolean, but we cast the result using the "is" operator
        // in the function's return type
        return (pet as Cat).meow !== undefined;

        // Less safe but we can
        // return 'meow' in pet;
      }

      let pet: Dog | Cat = { bark: () => {} };

      // Using the 'is' keyword
      if (isCat(pet)) {
        pet.meow();
      } else {
        pet.bark();
      }

      ///////////////////////////////////////

      function getValues(a: number | string, b: string) {
        // Not safe - a can be a number too
        a.substring(3);

        // We can:
        typeof a === "string" && a.substring(3);

        // Or:
        if (a === b) {
          // This makes type narrowing!
          // It is safe to call string methods, because here we sure a is a string
          a.substring(3);
        } else {
          // if there is no narrowing, type remains unknown
          console.log(typeof a); // number or string
        }
      }

      ///////////////////////////////////////

      interface Car {
        brand: string;
        model: string;
        year: number;
      }

      function isCar(vehicle: any): vehicle is Car {
        return (
          typeof vehicle === "object" &&
          vehicle !== null &&
          "brand" in vehicle &&
          "model" in vehicle &&
          "year" in vehicle
        );
      }

      function inspectVehicle(vehicle: any) {
        if (isCar(vehicle)) {
          // Inside this block, TypeScript knows that 'vehicle' is of type 'Car'
          console.log("Brand:", vehicle.brand);
          console.log("Model:", vehicle.model);
          console.log("Year:", vehicle.year);
        } else {
          console.log("Not a valid car object.");
        }
      }
    },
  },
  {
    categoryId: CodeTypesEnum.GENERAL,
    title: "Mapped Types",
    description: ``,
    code: () => {
      // Source: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html

      // Mapped types used the "in" keyword which takes an iteratee

      // We create a new type, containing the properties of Type
      // and returning a boolean value for each property
      // Here, the iteratee is created using "keyof"

      // 👍👍👍 We should note that type can take generics!
      type OptionsFlags<Type> = {
        [key in keyof Type]: boolean;
      };

      type Features = {
        darkMode: () => void;
        newUserProfile: () => void;
      };

      type FeatureOptions = OptionsFlags<Features>;

      ///////////////////////////////////////////////////////////////////////////////////

      // We can remove or add modifiers by prefixing with - or +
      // If we don’t add a prefix, then + is assumed.

      // Remove readyonly from type
      type CreateMutable<Type> = {
        -readonly [Property in keyof Type]: Type[Property];
      };

      type LockedAccount = {
        readonly id: string;
        readonly name: string;
      };

      type UnlockedAccount = CreateMutable<LockedAccount>;

      ///////////////////////////////////////////////////////////////////////////////////

      // Remove optional from Type
      type Concrete<Type> = {
        [Property in keyof Type]-?: Type[Property];
      };

      type MaybeUser = {
        id: string;
        name?: string;
        age?: number;
      };

      type User = Concrete<MaybeUser>;

      ///////////////////////////////////////////////////////////////////////////////////

      // Great functionality using the "as" that let as create new names

      type Getters<Type> = {
        [Property in keyof Type as `get${Capitalize<
          // Note that we must intersect string and Property in order to use
          // the Property in string literal
          string & Property
        >}`]: () => Type[Property];
      };

      interface Person {
        name: string;
        age: number;
        location: string;
      }

      /*
        type LazyPerson = {
          getName: () => string;
          getAge: () => number;
          getLocation: () => string;
        }
      */

      type LazyPerson = Getters<Person>;

      ///////////////////////////////////////////////////////////////////////////////////

      type EventConfig<Events extends { kind: string }> = {
        // We iterate the generic parameter
        // we construct property name from the 'kind' property
        // the value of the property is function that takes event and returns void

        // Here we use the "in" keyword and the "as" keyword
        // no need for the "keyof" keyword because we don't iterate keys
        [E in Events as E["kind"]]: (event: E) => void;
      };

      type SquareEvent = { kind: "square"; x: number; y: number };
      type CircleEvent = { kind: "circle"; radius: number };

      // We pass a union as the generic param, so we get 2 generic parameters
      type Config = EventConfig<SquareEvent | CircleEvent>;
    },
  },
  {
    categoryId: CodeTypesEnum.GENERAL,
    title: "Template Literal Types",
    description: ``,
    code: () => {
      // Source: https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#inference-with-template-literals

      // The function takes a object and returns its Type intersected with the Type created
      // by PropEventSource!
      // ❗❗❗ Note we don't implement it, we just declare it to and make Typescript assuming the
      // function exist somewhere so we can use it!

      declare function makeWatchedObject<Type>(
        obj: Type
      ): Type & PropEventSource<Type>; // ❗❗❗ Augmenting - return the type + advanced features! ❗❗❗

      // Creating type that takes generic parameter!
      type PropEventSource<Type> = {
        // Interating the type properties, coercing them to string
        // Key - the property name, Type[key] the property type!

        on<Key extends string & keyof Type>(
          // The event name is a string combining key and the 'Changed' keyword
          eventName: `${Key}Changed`,
          // Type[key] is the type of the property
          callback: (newValue: Type[Key]) => void
        ): void;
      };

      // For this call the Type is: { firstName: string, lastName: string, age: number }
      // So Key is: firstName | lastName | age
      // and Type[key] is: string | stirng | number

      const person = makeWatchedObject({
        firstName: "Saoirse",
        lastName: "Ronan",
        age: 26,
      });

      // (parameter) newName: string is correctly inferred
      person.on("firstNameChanged", (newName) => {
        console.log(`new name is ${newName.toUpperCase()}`);
      });

      // (parameter) newAge: number correctly inferred
      person.on("ageChanged", (newAge) => {
        if (newAge < 0) {
          console.warn("warning! negative age");
        }
      });
    },
  },
  {
    categoryId: CodeTypesEnum.GENERAL,
    title: "Generic Interface",
    description: ``,
    code: () => {
      // Interfaces can also be declated as generic
      interface GenericIdentityFn<Type> {
        (arg: Type): Type;
      }

      // Generic function, accepts any type
      function identity<Type>(arg: Type): Type {
        return arg;
      }

      identity("1");
      identity(1);

      // But here we're locking the type!
      let myIdentity: GenericIdentityFn<number> = identity;
      myIdentity("1"); // Type was locked
      myIdentity(1);
    },
  },
  {
    categoryId: CodeTypesEnum.GENERAL,
    title: "Intersection",
    description: `Using the & intersection operator.
      This allows you to combine many types to create a single type with all of the properties that
      you require. An object of this type will have members from all of the types given. The "&"
      operator is used to create the intersection type.
      Info: https://www.geeksforgeeks.org/what-are-intersection-types-in-typescript/`,
    code: () => {
      interface A {
        feauA: string;
        feauB: string;
      }

      interface B {
        feauA: number;
        feauB: string;
      }

      // We try to intersect two interfaces that contain
      // the same property but with different types
      type AB = A & B;

      let obj1: AB = {} as AB;
      let obj2: AB = {} as AB;

      // Error, Type '20' is not assignable to type 'string & number'
      obj1.feauA = 20;
      console.log(obj1.feauA);

      obj2.feauB = "c";
      console.log(obj2.feauB);

      ///////////////////////////////////////////////////////////////////////////////////////////////

      // Same here - trying to intersect two interfaces with "type" property contains different type!

      interface C {
        type: "T";
        feauB: string;
      }

      interface D {
        type: "Y";
        feauB: string;
      }

      type E = C & D;

      let obj3: E = {} as E;
      obj3.type; // type is never, cause its value on the intersected object conflicts!

      // Solution - omit the problematic property

      type F = Omit<C, "type"> & Omit<D, "type"> & { type: "Z" };
      let obj4: F = {} as F;
      obj4.type;
    },
  },
  {
    categoryId: CodeTypesEnum.SNIPPET,
    title: "Object Maniuplator Class with Types",
    description:
      "In this example awe want to extend/delete new object with properties",
    code: () => {
      // We want to add a new property named K to type T with the value of V
      // Note the [NK in K] expression, we iterate over the K which is a string (property name)
      // in order to extract that new and create a new object definition
      // Good reference: https://github.com/Microsoft/TypeScript/pull/12114,
      // type T2 = { [P in "x" | "y"]: P };  // { x: "x", y: "y" }

      // Note the intersect of the existing type T with new type we created
      type ObjectWithNewProp<T, K extends string, V> = T & { [NK in K]: V };

      class ObjectManipulator<T> {
        // The class gets a type to work with
        constructor(protected obj: T) {}

        public set<K extends string, V>(
          key: K,
          value: V
        ): ObjectManipulator<ObjectWithNewProp<T, K, V>> {
          // Note the new type the returned here
          return new ObjectManipulator({
            ...this.obj,
            [key]: value,
          } as ObjectWithNewProp<T, K, V>);
        }

        public get<K extends keyof T>(key: K): T[K] {
          return this.obj[key];
        }

        public delete<K extends keyof T>(
          key: K
        ): ObjectManipulator<Omit<T, K>> {
          const newObj = { ...this.obj };
          delete newObj[key];
          return new ObjectManipulator(newObj);
        }

        public getObject(): T {
          return this.obj;
        }
      }
    },
  },
  {
    categoryId: CodeTypesEnum.SNIPPET,
    title: "Promisify",
    description:
      "Object that works with callback and we want to convert to promise",
    code: () => {
      type ApiResponse<T> =
        | {
            status: "success";
            data: T;
          }
        | {
            status: "error";
            data: string;
          };

      type PromisifyFunctionParam<T> = (
        callback: PromsifiyFunctionCallback<T>
      ) => void;
      type PromsifiyFunctionCallback<T> = (response: ApiResponse<T>) => void;
      type PromisifyResult<T> = () => Promise<T>;

      // fn - a function that gets a callback as param
      // callback - a function that gets response as param
      function promisify<T>(fn: PromisifyFunctionParam<T>): PromisifyResult<T> {
        return () => {
          return new Promise((resolve) => {
            fn((response) => {
              if (response.status === "success") resolve(response.data);
            });
          });
        };
      }
    },
  },
];
