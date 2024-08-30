<template>
    <div class="wrap">
        <Login v-if="isLogin" @changeModel="changeModel"/>
        <Register v-else @changeModel="changeModel"/>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Login from './Login.vue'
import Register from './Register.vue'

const isLogin = ref(true);


function changeModel(model) {
    isLogin.value = model;
}

</script>

<style lang="less" scoped>
.wrap {
    width: 100%;
    height: 100vh;
    background: url(../../assets/login_bg.webp);
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
