<template>
	<a-drawer :title="title" :width="378" :open="open" :body-style="{ paddingBottom: '80px' }"
		:footer-style="{ textAlign: 'right' }" @close="onClose">
		<a-form :model="form" ref="formRef" :rules="rules" layout="vertical">
			<a-row :gutter="16">
				<a-col :span="24">
					<a-form-item label="Brand" name="brand">
						<a-input v-model:value="form.brand" placeholder="Please enter vehicle brand" />
					</a-form-item>
				</a-col>
				<a-col :span="24">
					<a-form-item label="Model" name="model">
						<a-input v-model:value="form.model" placeholder="Please enter vehicle model" />
					</a-form-item>
				</a-col>
				<a-col :span="24">
					<a-form-item label="Purchase Date" name="year">
						<a-date-picker v-model:value="form.year" style="width: 100%;" />
					</a-form-item>
				</a-col>
				<a-col :span="24">
					<a-form-item label="Image" name="images">
						<a-upload v-model:file-list="form.images" :action="staticHost" list-type="picture-card">
							<div v-if="form.images?.length < 9">
								<PlusOutlined />
								<div style="margin-top: 8px">Upload</div>
							</div>
						</a-upload>
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
import { ref, computed, watch } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { toUnix, filterImgUrls } from '@/utils/tool'
import { createCarService, updateCarService } from '@/services/cars';
import { message } from 'ant-design-vue';


const props = defineProps({
	open: Boolean,
	data: Object,
});

const staticHost = `${import.meta.env.VITE_STATIC_HOST}/upload`;

const defaultForm = {
	brand: '',
	model: '',
	images: [],
	year: '',
}

const emit = defineEmits(['onClose'])

const formRef = ref(null);
const form = ref(defaultForm);

const rules = {
	brand: [
		{
			required: true,
			message: 'Please enter vehicle brand',
		},
	],
	model: [
		{
			required: true,
			message: 'Please enter vehicle model',
		},
	],
	images: [
		{
			required: true,
			message: 'Please upload vehicle images',
		},
	],
	year: [
		{
			required: true,
			message: 'Please enter date of purchase',
		},
	],

};

const title = computed(() => {
	return props.data ? 'Edit' : 'Create'
});

const formatFileList = (images = []) => {
	if (!images?.length) return [];
	return images?.map(url => ({
		url,
	}))
}

const onClose = () => {
	emit('onClose')
}

const submit = async () => {
	try {

		const validateRes = await formRef.value.validateFields();
		const imageURLs = filterImgUrls(validateRes.images);
		const params = {
			brand: validateRes?.brand,
			model: validateRes?.model,
			year: toUnix(validateRes?.year),
			imageURLs
		}
		let res;
		if (props.data?.carID) {
			res = await updateCarService(props.data?.carID, params);
		} else {
			res = await createCarService(params);
		}

		message.success(res?.message);
		onClose();
	} catch (error) {
		
	}
}

watch(
	() => props.data,
	newValue => {
		if (newValue) {
			form.value = {
				...newValue,
				images: formatFileList(newValue.images)
			}
		} else {
			form.value = defaultForm;
		};
	},
);

</script>