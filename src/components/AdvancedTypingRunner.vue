<template>
  <div class="advanced-typing-container flex">
    <nav class="sidebar p-3">
      <h1 class="underline py-1 font-bold text-xl">Advanced Typing</h1>
      <a
        v-for="example in examples"
        :key="example.slug"
        :href="'#example_' + example.slug"
        class="nav-link"
      >
        {{ example.title }}
      </a>
    </nav>
    <div class="examples p-3 flex-1">
      <div
        v-for="(example, idx) in examples"
        :key="example.slug"
        :id="'example_' + example.slug"
        class="code-item"
      >
        <div class="code-item-header py-1">
          <h3 class="underline py-1 font-bold text-lg">{{ example.title }}</h3>
          <p>{{ example.description }}</p>
        </div>
        <div class="code-item-body">
          <highlightjs language="js" :code="example.code.toString()" class="py-3" />
          <div class="output" v-html="results[idx]"></div>
        </div>
        <div class="py-2">
          <button @click="run(example, idx)" class="btn btn-blue">
            <font-awesome-icon icon="fa-solid fa-play" class="inline-block px-1" />Run
          </button>
          &nbsp;
          <button @click="run(example, idx, true)" class="btn btn-blue">
            <font-awesome-icon icon="fa-solid fa-bug" class="inline-block px-1" />Debug
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import examples from "../assets/advanced-typing";

export default {
  name: "AdvancedTypingRunner",
  data() {
    return {
      examples,
      results: {},
    };
  },
  methods: {
    run(example, idx, debug = false) {
      const origLog = console.log;
      const component = this;

      component.results[idx] = "";

      console.log = function (...args) {
        component.results[idx] += args.toString() + "<br/>";
        origLog(...args);
      };

      try {
        let code = example.code.toString();
        if (debug) {
          const braceIdx = code.indexOf("{");
          code =
            code.slice(0, braceIdx + 1) +
            "\n\tdebugger;\n" +
            code.slice(braceIdx + 1);
        }
        new Function(`(${code})()`)();
      } catch (e) {
        console.log(e);
      }

      console.log = origLog;
    },
  },
};
</script>

<style scoped>
.sidebar {
  flex-basis: 220px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  align-self: flex-start;
  max-height: 100vh;
  overflow-y: auto;
}

.nav-link {
  display: block;
  white-space: nowrap;
  background-color: DarkSalmon;
  border: none;
  color: #ffffff;
  padding: 8px 12px;
  margin-bottom: 4px;
  text-decoration: none;
  cursor: pointer;
  border-radius: 4px;
}

.nav-link:hover {
  background-color: DarkRed;
}

.code-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
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
