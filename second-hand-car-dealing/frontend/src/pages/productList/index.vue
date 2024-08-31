<template>
	<a-layout class="product-list">
		<a-layout-header class="header">
			<a-flex justify="space-between" align="center" style="height: 100%;">
				<img src="../../assets/logo.png" width="50px" class="logo"></img>
				<a-button v-if="isLogin" type="primary" @click="goto('/management')">Manage List</a-button>
				<a-button v-else :icon="h(LoginOutlined)" type="primary" @click="goto('/login')">Log in</a-button>
			</a-flex>

		</a-layout-header>
		<a-layout-content class="content">
			<a-flex wrap="wrap" gap="16" v-if="cardData?.length">
				<Card v-for="card in cardData" :card="card" :isLogin="isLogin" @openChat="changeChatModal" />
			</a-flex>
			<a-empty style="margin-top: 100px;" v-else />
		</a-layout-content>
	</a-layout>
	<ChatRoom :chatInfo="chatInfo" @send="sendMessageList" @getMessage="getMessageList" @closeChat="changeChatModal" />
</template>

<script setup>
import { h, reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { LoginOutlined } from '@ant-design/icons-vue';
import Card from './Card.vue';
import ChatRoom from '@/components/ChatRoom.vue';
import { allCarsService } from '@/services/cars';
import { userInfoService } from '@/services/user';
import { messagesService, sendMessageService } from '@/services/message';
import { handleImgPathToUrl, toDateStr } from '@/utils/tool';
import { useUserStore } from '@/stores/user';
import defaultAvatar from '@/assets/avatar.jpeg'

const userStore = useUserStore();
const router = useRouter();
const chatInfo = reactive({
	open: false,
	messages: []
})
const cardData = ref([]);
const isLogin = ref(false);
const currentCardInfo = ref({});

const getMessageList = async (record) => {
	if(!record) {
		record = currentCardInfo.value;
	}
	try {
		const data = await messagesService(record.carID);
		if (data && typeof data === 'object') {
			chatInfo.messages = data;
		}
	} catch (error) {

	}
}

const sendMessageList = async (content) => {
	try {
		if (!currentCardInfo.value?.carID) return;
		await sendMessageService(currentCardInfo.value?.carID, {
			content
		});
		if (currentCardInfo.value) {
			getMessageList(currentCardInfo.value)
		}
	} catch (error) {
	}
}


const changeChatModal = (record = null) => {
	chatInfo.open = !!record;

	if (record?.carID) {
		getMessageList(record);
		currentCardInfo.value = record;
	} else {
		chatInfo.messages = [];
		currentCardInfo.value = null;
	}
}

const getAllCars = async () => {
	try {
		const res = await allCarsService();
		if (res?.length) {
			cardData.value = res?.map(item => ({
				...item,
				images: handleImgPathToUrl(item.imageURLs),
				avatar: item.avatar ? `${import.meta.env.VITE_STATIC_HOST}${item.avatar}` : defaultAvatar,
				year: toDateStr(item.year)
			}));
		}
	} catch (error) {

	}
}

const checkLogin = () => {
	try {
		const token = localStorage.getItem('token');
		isLogin.value = !!token;
		getUserInfo();
	} catch (error) {

	}
}

const goto = (path) => {
	router.push(path)
}


const getUserInfo = async () => {
	try {
		const data = await userInfoService();
		if (data) {
			userStore.setUserDetails(data);
		}
	} catch (error) {
	}
}

onMounted(() => {
	getAllCars();
	checkLogin();
})

</script>

<style lang="less" scoped>
.product-list {
	width: 100vw;
	height: 100vh;

	.header {
		color: #fff;
		height: 64px;
		line-height: 64px;
		padding-inline: 24px;
		background-color: #fff;
		box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.1);
		background-color: #dcdcdc;

		.logo {
			width: 50px;
			border-radius: 50%;
		}
	}

	.content {
		margin-top: 10px;
		padding: 16px 24px;
		overflow-y: scroll;
	}
}
</style>
