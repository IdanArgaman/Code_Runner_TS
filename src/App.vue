<script setup lang="ts">
</script>

<template>
  <div class="p-2">
    <nav>
      <router-link :to="{ name: 'code', params: { codeBase: 'code' } }">
        TS Learn
      </router-link>
      <!-- <router-link :to="{ path: '/code/algorithms/?showCategories=false' }">
        Algorithms
      </router-link> -->
    </nav>
    <router-view></router-view>
  </div>
</template>

<style scoped>
#app {
}

nav {
  display: flex;
  flex-wrap: wrap;
  width: 75%;
}

nav a {
  flex-basis: 150px;
  display: block;

}

nav a:link,
nav a:visited {
  white-space: nowrap;
  background-color: DarkSalmon;
  border: none;
  color: #ffffff;
  padding: 10px 40px;
  text-align: center;
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  text-decoration: none;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  display: inline-block;
  border-left: 1px solid white;
  border-top: 1px solid white;
}
nav a:hover,
nav a:active,
nav a.router-link-active {
  background-color: DarkRed;
}
</style>
