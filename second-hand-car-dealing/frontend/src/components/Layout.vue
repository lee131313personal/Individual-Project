<template>
  <a-layout has-sider>
    <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }"
      width="220px">
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="productManagement">
          <ControlOutlined />
          <span class="nav-text"><router-link to="/management">Product Management</router-link></span>
        </a-menu-item>
        <a-menu-item key="mine">
          <UserOutlined />
          <span class="nav-text"><router-link to="/management/mine">Mine</router-link></span>
        </a-menu-item>
        <a-menu-item key="viewAllVehicle">
          <UserOutlined />
          <span class="nav-text"><router-link to="/">View All Vehicles</router-link></span>
        </a-menu-item>

      </a-menu>
    </a-layout-sider>
    <a-layout :style="{ marginLeft: '220px', height: '100vh' }">
      <a-layout-header
        :style="{ background: '#fff', padding: 0, display: 'flex', alignItems: 'center', width: '100%' }">
        <a-page-header style="padding: 0 0 0 16px; width: 100%;" :title="title"
          :avatar="avatarInfo">
          <template #extra>
            <a-button style="margin-right: 16px;" @click="signOut">
              <template #icon>
                <LogoutOutlined />
              </template>
              Sign out
            </a-button>
          </template>
        </a-page-header>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
        <div :style="{ padding: '24px', background: '#fff', height: 'calc(100% - 16px)' }">
          <router-view></router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { ControlOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons-vue';
import { signOut } from '@/utils/tool';
import { userInfoService } from '@/services/user';
import defaultAvatar from '@/assets/avatar.jpeg';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const userInfo = ref({});
const menus = ref({
  'management': {
    title: 'Product Management',
    menuKey: 'productManagement'
  },
  'managementmine': {
    title: 'Mine',
    menuKey: 'mine'

  }
});

const selectedKeys = ref(['productManagement']);

const title = computed(() => {
  console.log()
  return menus.value[route.fullPath?.replace(/\//g, '')]?.title ?? '';
});

const avatarSrc = computed(() => {
	return userInfo.value.avatarURL ? import.meta.env.VITE_STATIC_HOST + userInfo.value.avatarURL : defaultAvatar;
});

const avatarInfo = computed(() => {
  if(title.value === menus.value.managementmine.title) return null;
  return { src: avatarSrc.value, size: 'large', style: 'cursor: pointer', 'onclick': clickAvatar }
})

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    let path = newPath?.replace(/\//g, '');
    console.log(path)
    selectedKeys.value[0] = menus.value[path].menuKey;
  },
  { immediate: true }
);

const getUserInfo = async () => {
  try {
    if (userStore.userID) return;
    const data = await userInfoService();

    if (data) {
      userStore.setUserDetails(data);
      userInfo.value = data;
    }
  } catch (error) {
  }
}

function clickAvatar() {
  router.push('/management/mine')
}

onMounted(() => {
  getUserInfo()
})
</script>
<style scoped>
#components-layout-demo-fixed-sider .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>