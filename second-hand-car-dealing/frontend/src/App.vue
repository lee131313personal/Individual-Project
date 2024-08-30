<template>
  <a-config-provider :theme="{
    token: {
      colorPrimary: '#283f4b',
    },
  }">
    <router-view></router-view>
  </a-config-provider>
</template>
<script setup>
</script>
<style>
html,
body,
#app {
  width: 100vw;
  height: 100vh;
}
</style>