import { post, get, put, del } from '@/utils/http';
import api from './api'


export const myCarsService = async (params) => {
	try {
		const res = await get(api.myCars, params);
		return res;
	} catch (error) {
		throw error;
	}
}


export const createCarService = async (params) => {
	try {
		const res = await post(api.createCar, params);
		return res;
	} catch (error) {
		throw error;
	}
}


export const updateCarService = async (carId, params) => {
	try {
		const res = await put(`${api.updateCar}/${carId}`, params);
		return res;
	} catch (error) {
		throw error;
	}
}


export const delCarService = async (carId) => {
	try {
		const res = await del(`${api.deleteCar}/${carId}`);
		return res;
	} catch (error) {
		throw error;
	}
}


export const allCarsService = async () => {
	try {
		const res = await get(api.getAllCar);
		return res;
	} catch (error) {
		throw error;
	}
}



