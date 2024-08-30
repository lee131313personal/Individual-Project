import { post, get } from '@/utils/http';
import api from './api'


export const messagesService = async (carID) => {
	try {
		const res = await get(`${api.messages}${carID}`);
		return res;
	} catch (error) {
		throw error;
	}
}

export const sendMessageService = async (carID, params) => {
	try {
		const res = await post(`${api.sendMessage}${carID}`, params);
		return res;
	} catch (error) {
		throw error;
	}
}


