<template>
	<div class="register">
		<h1 class="title">Sign up</h1>
		<a-form :model="formState" :label-col="labelCol" ref="formRef">
			<a-form-item label="First Name" name="firstName"
				:rules="[{ required: true, message: 'Please input your First Name!' }]">
				<a-input v-model:value="formState.firstName" autocomplete="off">

				</a-input>
			</a-form-item>

			<a-form-item label="Last Name" name="lastName"
				:rules="[{ required: true, message: 'Please input your Last Name!' }]">
				<a-input v-model:value="formState.lastName" autocomplete="off">

				</a-input>
			</a-form-item>

			<a-form-item label="Email Address" name="email"
				:rules="[{ required: true, message: 'Please input your Email Address!' }]">
				<a-input v-model:value="formState.email" autocomplete="off">

				</a-input>
			</a-form-item>

			<a-form-item label="Preference Brand" name="preferenceBrand">
				<a-input v-model:value="formState.preferenceBrand" autocomplete="off">

				</a-input>
			</a-form-item>

			<a-form-item label="Password" name="password"
				:rules="[{ required: true, message: 'Please input your password!' }]">
				<a-input-password v-model:value="formState.password" autocomplete="new-password">

				</a-input-password>
			</a-form-item>

			<a-form-item class="text-center">
				<a-button :disabled="disabled" type="primary" @click="signUp" class="register-form-button">
					Sign up
				</a-button>
				<div class="login">
					<span>Already have an account?</span>
					<a href="#" @click.stop="toLogin">Sign in</a>
				</div>

			</a-form-item>
		</a-form>
	</div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import { registeService } from '@/services/auth';

const formState = reactive({
	firstName: '',
	lastName: '',
	email: '',
	preferenceBrand: '',
	password: '',
});
const formRef = ref(null);

const emit = defineEmits(['changeModel']);

const labelCol = {
	style: {
		width: '136px',
	},
};

const disabled = computed(() => {
	return !(formState.firstName && formState.lastName && formState.email && formState.password);
});

const toLogin = () => {
	emit('changeModel', true);
}

const signUp = async () => {
	try {
		const res = await formRef.value.validateFields();
		await registeService(res);

		message.success('注册成功~').then(() => {
			toLogin();
		})
		
	} catch (error) {
		message.error(error.message)
	}
}

</script>

<style lang="less" scoped>
.register {
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

	.register-form-button {
		width: 80%;
	}


	.login {
		margin-top: 12px;
		span {
			color: #999;
			margin-right: 4px;
		}
	}
}
</style>
