const CodeTypesEnum = {
  GENERAL: "GENERAL",
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

      let obj: { [key in MyEnum]?: any } = { 
        [MyEnum.First]: 1,
        // x: 1 - Causes an error!
      };
    },
  },
];
