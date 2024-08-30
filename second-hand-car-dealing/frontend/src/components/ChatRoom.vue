<template>
	<a-modal :open="chatInfo.open" title="Chat room" :footer="false" @cancel="onClose">
		<div class="contetn">
			<div class="chat-info">
				<template v-for="info in chats">
					<a-flex align="center" :justify="info.senderUserID === userStore.userID ? 'flex-end' : 'flex-start'"
						gap="middle" style="margin-bottom: 16px;">
						<a-avatar :size="32" v-if="info.senderUserID !== userStore.userID" style="min-width: 32px;">
							<template #icon>
								<img v-if="info.avatar" :src="info.avatar" alt="">
								<UserOutlined v-else />
							</template>
						</a-avatar>

						<span>{{ info.content }}</span>

						<a-avatar :size="32" v-if="info.senderUserID === userStore.userID" style="min-width: 32px;">
							<template #icon>
								<img v-if="info.avatar" :src="info.avatar" alt="">
								<UserOutlined v-else />
							</template>
						</a-avatar>
					</a-flex>
				</template>
			</div>

			<a-flex justify="space-between" class="footer">
				<a-input style="width: 80%;" v-model:value="message"></a-input>
				<a-button type="primary" style="width: 18%;" :disabled="disabled" @click="sendMessage">Send</a-button>
			</a-flex>
		</div>
	</a-modal>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/user';

let timer = null;
const props = defineProps({
	chatInfo: Object
});

const emit = defineEmits(['closeChat', 'send', 'getMessage']);

const message = ref('');
const userStore = useUserStore();

const chats = computed(() => {
	return props.chatInfo?.messages?.map(item => {
		const avatarURL = item?.Sender?.avatarURL;
		return {
			...item,
			avatar: avatarURL ? import.meta.env.VITE_STATIC_HOST + avatarURL : ''
		}
	})
});

const disabled = computed(() => {
	return !message.value;
});

const onClose = () => {
	emit('closeChat');
}

const sendMessage = async () => {
	try {
		emit('send', message.value);
		message.value = '';
	} catch (error) {

	}
}


watch(() => props.chatInfo.open, current => {
	if (current) {
		timer = setInterval(() => {
			emit('getMessage')
		}, 3000)
	} else {
		clearInterval(timer);
		timer = null;
	}
})


</script>

<style lang="less" scoped>
.contetn {
	height: 70vh;
	background-color: #fffbf7;

	.chat-info {
		height: calc(100% - 42px);
		overflow-y: scroll;
		border-bottom: 1px solid #f2f2f2;
	}

	.footer {
		margin-top: 14px;
	}
}
</style>