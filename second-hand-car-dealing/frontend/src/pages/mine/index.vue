<template>
	<div class="mine">
		<a-card title="Personal Information">
			<template #extra><a href="#" @click.stop="changeDrawerStatus">edit</a></template>
			<a-flex>
				<a-avatar :src="avatarSrc" :size="64" />
				<div class="info-wrap">
					<a-flex gap="middle" class="user-info-item">
						<p>First Name</p>
						<p>{{ userInfo.firstName }}</p>
					</a-flex>
					<a-flex gap="middle" class="user-info-item">
						<p>Last Name</p>
						<p>{{ userInfo.lastName }}</p>
					</a-flex>
					<a-flex gap="middle" class="user-info-item">
						<p>Email Address</p>
						<p>{{ userInfo.email }}</p>
					</a-flex>
				</div>
			</a-flex>

		</a-card>

		<a-card title="Change Password" class="changePass">
			<a-form ref="formRef" :model="formState" autocomplete="off" :rules="rules" :colon="false" :label-col="labelCol"
				class="change-password">
				<a-form-item label="Password" name="currentPassword">
					<a-input-password v-model:value="formState.currentPassword" />
				</a-form-item>
				<a-form-item label="Password" name="newPassword">
					<a-input-password v-model:value="formState.newPassword" />
				</a-form-item>
				<a-form-item label="Confirm" name="confirmPassword">
					<a-input-password v-model:value="formState.confirmPassword" />
				</a-form-item>
			</a-form>

			<a-form-item text-align="center">
				<a-button type="primary" @click="submit">Submit</a-button>
			</a-form-item>
		</a-card>
		<EditUser :open="open" :data="userInfo" @onClose="changeDrawerStatus" />
	</div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { message } from 'ant-design-vue';
import { validatePassword, signOut } from '@/utils/tool';
import { userInfoService, changePasswordService } from '@/services/user';
import EditUser from './EditUser.vue';
import defaultAvatar from '@/assets/avatar.jpeg';
import { computed } from 'vue';

const userStore = useUserStore();
const formRef = ref();
const userInfo = ref({});
const open = ref(false);

const formState = reactive({
	currentPassword: '',
	newPassword: '',
	confirmPassword: '',
});
const labelCol = {
	style: {
		width: '86px',
	},
};

const avatarSrc = computed(() => {
	return userInfo.value.avatarURL ? import.meta.env.VITE_STATIC_HOST + userInfo.value.avatarURL : defaultAvatar;
});

const validatePass = async (_rule, value) => {
	if (!value) return Promise.reject('Please input the password');

	if (!validatePassword.test(value)) {
		return Promise.reject('Your password must consist of numbers and letters and longer than 8 characters.');
	} else {
		if (formState.confirmPassword !== '') {
			formRef.value.validateFields('confirmPassword');
		}
		return Promise.resolve();
	}
};
const validatePass2 = async (_rule, value) => {
	if (!value) return Promise.reject('Please input the password again');

	if (value !== formState.newPassword) {
		return Promise.reject("Two inputs don't match!");
	} else {
		return Promise.resolve();
	}
};


const rules = {
	pass: [
		{
			required: true,
			validator: validatePass,
		}
	],
	confirmPassword: [
		{
			required: true,
			validator: validatePass2,
		}
	],
}


const submit = () => {
	formRef.value.validateFields().then(async data => {
		try {
			const res = await changePasswordService(data);
			if (res) {
				message.success(res?.message);
				setTimeout(() => {
					signOut();
				}, 1000)
			}
		} catch (error) {
			message.error(error.message);
		}
	})
}


const getUserInfo = async () => {
	try {

		const data = await userInfoService();

		if (data) {
			userStore.setUserDetails(data);
			userInfo.value = data;
		}
	} catch (error) {
	}
}

const changeDrawerStatus = () => {
	open.value = !open.value;
}

onMounted(() => {
	if (userStore.userID) {
		userInfo.value = userStore.userDetails;
	} else {
		getUserInfo();
	}
})

</script>

<style lang="less" scoped>
.mine {
	height: 100%;

	.changePass {
		margin-top: 24px;
	}

	.info-wrap {
		padding-left: 24px;

		.user-info-item {
			margin-bottom: 16px;

			p:nth-child(1) {
				color: #333;
			}

			p:nth-child(2) {
				font-weight: 500;
			}
		}
	}

	.change-password {
		max-width: 400px;
	}

}
</style>
