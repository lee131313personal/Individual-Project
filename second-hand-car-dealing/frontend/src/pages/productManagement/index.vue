<template>
	<a-button type="dashed" class="add-btn" :icon="h(PlusOutlined)" @click="() => showDrawer()">Add Record</a-button>
	<a-table :dataSource="formatSourceData" :columns="columns" :pagination="false" :loading="loading">
		<template #bodyCell="{ column, record }">
			<template v-if="column.key === 'images'">
				<a-image v-if="record.images?.length" :width="160" :src="record.images[0]" style="border-radius: 6px;" />
				<a href="#" v-if="record.images?.length > 1" style="margin-left: 10px;"
					@click.stop="() => openImagesModal(record.images)">more</a>
			</template>

			<template v-if="column.key === 'year'">
				<span>{{ record.year?.format('YYYY-MM-DD') }}</span>
			</template>

			<template v-if="column.key === 'operate'">
				<a-flex gap="16">
					<a href="#" @click.stop="() => { showDrawer(record) }">Edit</a>
					<a href="#" @click.stop="() => { delRecord(record) }">Del</a>
				</a-flex>
			</template>
		</template>
	</a-table>
	<Record :open="open" :data="editData" @onClose="onClose" />

	<a-modal v-model:open="imagesModal.open" title="All images" :footer="false" width="560px">
		<a-flex gap="middle" wrap="wrap">
			<a-image v-for="src in imagesModal.list" :width="160" :src="src" style="border-radius: 6px;" />
		</a-flex>
	</a-modal>
</template>

<script setup>
import { ref, h, computed, reactive, onMounted, watch } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import dayjs from 'dayjs';
import { handleImgPathToUrl, toDateStr } from '@/utils/tool';
import { myCarsService, delCarService } from '@/services/cars'
import Record from './Record.vue';

const open = ref(false);
const loading = ref(false);
const editData = ref(null);
const imagesModal = reactive({
	open: false,
	list: []
});

const dataSource = ref([]);

const columns = ref([
	{
		title: 'Brand',
		dataIndex: 'brand',
		key: 'brand',
	},
	{
		title: 'Model',
		dataIndex: 'model',
		key: 'model',
	},
	{
		title: 'Images',
		dataIndex: 'images',
		key: 'images',
	},
	{
		title: 'Purchase Date',
		dataIndex: 'year',
		key: 'year',
	},
	{
		title: 'Operate',
		dataIndex: 'operate',
		key: 'operate',
	}
]);

const getMyCars = async () => {
	try {
		loading.value = true;
		const data = await myCarsService();
		if (data?.length) {
			dataSource.value = data?.map(item => ({
				...item,
				images: handleImgPathToUrl(item.imageURLs),
				year: toDateStr(item.year)
			}));
		}
	} catch (error) {
	} finally {
		loading.value = false;
	}
}

const showDrawer = (data = null) => {
	open.value = true;
	data && (editData.value = data);
};

const doDel = async (record) => {
	try {
		if (!record.carID) return;
		const data = await delCarService(record.carID);
		getMyCars();
		message.success(data?.message);
	} catch (error) {
	}
}

const delRecord = (data = null) => {
	Modal.confirm({
		title: `Do you Want to delete these items? ${data.model}`,
		onOk() {
			doDel(data)
		},
	});
};



const onClose = () => {
	open.value = false;
	editData.value = null;
};

const formatSourceData = computed(() => {
	return dataSource.value?.map(item => ({
		...item,
		year: dayjs(item.year)
	}))
})

const openImagesModal = (images = []) => {
	imagesModal.open = true;
	imagesModal.list = images;
}

watch(open, (current) => {
	if (!current) {
		getMyCars();
	}
})

onMounted(() => {
	getMyCars();
})


</script>

<style lang="less" scoped>
.add-btn {
	width: 100%;
	margin-bottom: 16px;
}
</style>
