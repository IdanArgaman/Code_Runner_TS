import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import './index.css'

import CodeRunner from "./components/CodeRunner.vue";
import { createMemoryHistory, createRouter } from "vue-router";

import 'highlight.js/styles/atom-one-dark.css';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import hljsVuePlugin from "@highlightjs/vue-plugin";
hljs.registerLanguage('javascript', javascript);

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);

const routes = [
  {
    name: "code",
    path: "/code/:codeBase",
    props: true,
    component: CodeRunner,
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .use(hljsVuePlugin)
  .mount("#app");
