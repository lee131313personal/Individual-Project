import { post } from '@/utils/http';
import api from './api'


export const registeService = async (params) => {
	try {
		const res = await post(api.register, params);
		return res;
	} catch (error) {
		throw error;
	}
}


export const loginService = async (params) => {
	try {
		const res = await post(api.login, params);
		return res;
	} catch (error) {
		throw error;
	}
}