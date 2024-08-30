<template>
	<a-drawer title="Edit" :width="378" :open="open" :body-style="{ paddingBottom: '80px' }"
		:footer-style="{ textAlign: 'right' }" @close="onClose">
		<a-form :model="form" ref="formRef" :rules="rules" layout="vertical">
			<a-row :gutter="16">
				<a-col :span="24">
					<a-form-item label="Avatar" name="avatar">
						<a-upload v-model:file-list="fileList" :action="staticHost" list-type="picture-card" class="avatar-uploader"
							:show-upload-list="false">
							<img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width: 100%; height: 100%;" />
							<div v-else>
								<plus-outlined></plus-outlined>
								<div class="ant-upload-text">Upload</div>
							</div>
						</a-upload>
					</a-form-item>
				</a-col>
				<a-col :span="24">
					<a-form-item label="First Name" name="firstName">
						<a-input v-model:value="form.firstName" />
					</a-form-item>
				</a-col>
				<a-col :span="24">
					<a-form-item label="Last Name" name="lastName">
						<a-input v-model:value="form.lastName" />
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<template #extra>
			<a-space>
				<a-button @click="onClose">Cancel</a-button>
				<a-button type="primary" @click="submit">Submit</a-button>
			</a-space>
		</template>
	</a-drawer>
</template>
<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/user';
import { toUnix, filterImgUrls } from '@/utils/tool'
import { userUpdateService } from '@/services/user';
import { message } from 'ant-design-vue';


const props = defineProps({
	open: Boolean,
	data: Object,
});

const staticHost = `${import.meta.env.VITE_STATIC_HOST}/upload`;



const defaultForm = {
	firstName: '',
	lastName: '',
	avatarURL: '',
}

const emit = defineEmits(['onClose'])

const userStore = useUserStore();
const formRef = ref(null);
const form = ref(defaultForm);
const fileList = ref([]);

const rules = {
	firstName: [
		{
			required: true,
			message: '名称不能为空',
		},
	],
	lastName: [
		{
			required: true,
			message: '名称不能为空',
		},
	],
};

const imageUrl = computed(() => {
	if (fileList.value?.length && fileList.value?.[0]?.response?.filePath) {
		return import.meta.env.VITE_STATIC_HOST + fileList.value[0].response.filePath;
	}
	if (form.avatarURL && form.avatarURL?.includes(import.meta.env.VITE_STATIC_HOST)) return form.avatarURL?.replace(import.meta.env.VITE_STATIC_HOST, '');
	return form.avatarURL
});

const onClose = () => {
	emit('onClose')
}

const submit = async () => {
	try {

		const validateRes = await formRef.value.validateFields();


		const avatarURL = imageUrl.value?.includes(import.meta.env.VITE_STATIC_HOST) ? imageUrl.value.replace(import.meta.env.VITE_STATIC_HOST, '') : imageUrl.value;
		const params = {
			firstName: validateRes?.firstName,
			lastName: validateRes?.lastName,
			avatarURL
		}

		const res = await userUpdateService(params);
		if (res) {
			userStore.$patch({
				userDetails: res.user
			});
			message.success(res?.message);
			onClose();
		}
	
	} catch (error) {
		message.error(error?.message);
	}
}

watch(
	() => props.data,
	newValue => {
		if (newValue) {
			form.value = {
				...newValue,
				// images: formatFileList(newValue.images)
			}
		} else {
			form.value = defaultForm;
		};
	},
);


onMounted(() => {

})

</script>

<style lang="less" scoped>
.avatar-uploader>.ant-upload {
	width: 128px;
	height: 128px;
}

.ant-upload-select-picture-card i {
	font-size: 32px;
	color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
	margin-top: 8px;
	color: #666;
}
</style>