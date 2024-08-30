<template>
	<div class="login">
		<h1 class="title">Log in</h1>
		<a-form :model="formState" :label-col="labelCol" ref="formRef">
			<a-form-item label="Email Address" name="email"
				:rules="[{ required: true, message: 'Please input your Email Address!' }]">
				<a-input v-model:value="formState.email" autocomplete="off"></a-input>
			</a-form-item>

			<a-form-item label="Password" name="password"
				:rules="[{ required: true, message: 'Please input your password!' }]">
				<a-input-password v-model:value="formState.password" autocomplete="new-password"></a-input-password>
			</a-form-item>

			<a-form-item class="text-center">
				<a-button :disabled="disabled" type="primary" @click="login" class="login-form-button">
					Log in
				</a-button>
				<a-button type="primary" class="google-btn" :icon="h(ChromeFilled)">
					Google
				</a-button>

				<div class="register">
					<a href="#" @click.stop="toRegister">register now!</a>
				</div>
			</a-form-item>
		</a-form>
	</div>
</template>

<script setup>
import { reactive, computed, h, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { ChromeFilled } from '@ant-design/icons-vue';
import { loginService } from '@/services/auth';


const emit = defineEmits(['changeModel']);
const router = useRouter();

const formRef = ref(null);
const formState = reactive({
	email: '',
	password: '',
});

const labelCol = {
	style: {
		width: '120px',
	},
};

const disabled = computed(() => {
	return !(formState.email && formState.password);
});

const toRegister = () => {
	emit('changeModel', false);
}

const login = async () => {
	try {
		const res = await formRef.value.validateFields();
		const { token } = await loginService(res)
		if (token) {
			localStorage.setItem('token', token ?? '')
			router.push('/management');
		}
	} catch (error) {
		message.error(error.message)
	}
}

</script>

<style lang="less" scoped>
.login {
	width: 400px;
	padding: 20px;
	min-height: 200px;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 10px;
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.3);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	color: #fff;

	.title {
		font-size: 20px;
		text-align: center;
		margin-bottom: 24px;
	}

	.google-btn {
		img {
			width: 20px;
			vertical-align: baseline;
		}
	}

	.login-form-button {
		width: 60%;
		margin-right: 20px;
	}

	.register {
		margin-top: 12px;
	}
}
</style>
