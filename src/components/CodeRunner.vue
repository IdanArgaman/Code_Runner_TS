<template>
  <div class="code-container">
    <div v-if="showCategories" class="p-3">
      <h1 class="underline py-1 font-bold text-xl">Categories</h1>
      <div v-for="(codeItems, key, idx) in groupedCodeItems" :key="idx" class="py-1">
        <a :href="'#section_' + key"> {{ key }}</a
        ><br />
      </div>
    </div>
    <div
      class="code-group p-3 pt-0"
      v-for="(codeItems, key, idx) in groupedCodeItems"
      :key="idx"
    >
      <h2 :id="'section_' + key" class="font-bold text-xl">{{ key }}</h2>
      <div
        v-for="(codeItem, idx) in codeItems"
        :key="idx"
        class="code-item"
        ref="codeItems"
      >
        <div class="code-item-header py-1" >
          <h3 class="underline py-1 font-bold text-lg">{{ codeItem.title }}</h3>
          <p v-html="codeItem.description"></p>
        </div>
        <div class="code-item-body">
          <highlightjs language='js' :code="codeItem.code.toString()" class="py-3" />
          <div class="output" v-html="results[idx]"></div>
        </div>
        <div class="py-2 ">
          <button @click="run(codeItem, idx)" class="btn btn-blue">
            <font-awesome-icon icon="fa-solid fa-play" class="inline-block px-1" />Run
          </button>
          &nbsp;
          <button @click="run(codeItem, idx, true)" class="btn btn-blue">
            <font-awesome-icon icon="fa-solid fa-bug" class="inline-block px-1" />Debug
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "CodeRunner",
  props: {
    codeBase: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      codeItems: null,
      showCategories: true,
      results: {},
    };
  },
  computed: {
    groupedCodeItems() {
      return _.groupBy(this.codeItems, (codeItem) => {
        return codeItem.categoryId;
      });
    },
  },
  methods: {
    run(codeItem, idx, debug = false) {
      const origLog = console.log;
      const component = this;

      component.results[idx] = "";

      console.log = function (...args) {
        component.results[idx] += args.toString() + "<br/>";
        origLog(...args);
      };

      try {
        let code = codeItem.code.toString();
        if (debug) {
          const idx = code.indexOf("{");
          code =
            code.slice(0, idx + 1) + "\n\tdebugger;\n" + code.slice(idx + 1);
        }
        new Function(`(${code})()`)();
      } catch (e) {
        console.log(e);
      }

      console.log = origLog;
    },
    async loadCodeBase(codeBase) {
      try {
        this.codeItems = (await import(`../assets/${codeBase}.ts`)).default;
      } catch (e) {
        this.codeItems = [];
      }
    },
  },
  watch: {
    $route(to) {
      this.loadCodeBase(to.params.codeBase);
      this.showCategories = !(to.query.showCategories === "false");
    },
  },
  mounted() {
    this.loadCodeBase(this.codeBase);
  },
};
</script>

<style scoped>
.code-item {
  display: flex;
  flex-direction: column;
}

.code-item-header h3 {
  margin-bottom: 0px;
}

.code-item-body {
  display: flex;
  text-align: left;
}

.code-item-body pre {
  max-width: 75%;
  min-width: 75%;
}

.code-item-body .output {
  margin: 13px;
  border: 1px inset black;
  padding: 5px;
  flex: 1;
}

.code-group h2 {
  margin-bottom: 0px;
  text-decoration: underline;
}

.btn {
  @apply font-bold py-2 px-4 rounded;
}
.btn-blue {
  @apply bg-blue-500 text-white;
}
.btn-blue:hover {
  @apply bg-blue-700;
}

</style>
