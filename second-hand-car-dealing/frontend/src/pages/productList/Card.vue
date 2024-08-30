<template>
	<a-card hoverable style="width: 360px; overflow: hidden;">
		<template #cover>
			<a-carousel arrows>
				<template #prevArrow>
					<div class="custom-slick-arrow" style="left: 10px; z-index: 1">
						<LeftCircleOutlined />
					</div>
				</template>
				<template #nextArrow>
					<div class="custom-slick-arrow" style="right: 10px">
						<RightCircleOutlined />
					</div>
				</template>
				<img v-for="url in card.images" :src="url" alt="" height="160px">
			</a-carousel>
		</template>
		<template #actions>
			<a-button style="width: 126px;" @click="contactSeller(card)">Contact seller</a-button>
			<a-button type="primary" ghost style="width: 126px;">Buy</a-button>
		</template>
		<a-card-meta>

			<template #avatar>
				<img alt="example" :src="card.avatar" style="width: 50px; border-radius: 50%; overflow: hidden;" />
			</template>
			<template #title>
				{{ card?.brand }} {{ card?.model }}
			</template>

			<template #description>
				<a-flex style="color: #666;">
					<p>Purchase date : &nbsp;</p>
					<p>{{ card?.year }}</p>
				</a-flex>
			</template>

		</a-card-meta>
	</a-card>

</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Modal } from 'ant-design-vue';
import { useUserStore } from '@/stores/user';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';

const userStore = useUserStore();
const router = useRouter();
const props = defineProps({
	card: Object,
	isLogin: Boolean
});
const emit = defineEmits(['openChat']);




const contactSeller = (record) => {
	if (!props.isLogin) {
		return Modal.confirm({
			title: 'Do you Want to login?',
			onOk: () => {
				router.push('/login');
			}
		})
	}
	if (userStore.userID === record.userID) {
		return Modal.error({
			title: '不能和自己聊天'
		});
	}

	emit('openChat', record)
}

</script>


<style lang="less" scoped>
:deep(.slick-slide) {
	height: 160px;
	line-height: 160px;
	background: #9c9c9c;
	overflow: hidden;
}

:deep(.slick-arrow.custom-slick-arrow) {
	width: 25px;
	height: 25px;
	font-size: 25px;
	color: #fff;
	background-color: rgba(31, 45, 61, 0.11);
	transition: ease all 0.3s;
	opacity: 0.3;
	z-index: 1;
}

:deep(.slick-arrow.custom-slick-arrow:before) {
	display: none;
}

:deep(.slick-arrow.custom-slick-arrow:hover) {
	color: #fff;
	opacity: 0.5;
}

:deep(.slick-slide h3) {
	color: #fff;
}
</style>