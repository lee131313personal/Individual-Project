import { get, put } from '@/utils/http';
import api from './api'


export const userInfoService = async (params) => {
    try {
        const res = await get(api.userInfo, params);
        return res;
    } catch (error) {
        throw error;
    }
}


export const changePasswordService = async (params) => {
    try {
        const res = await put(api.changePassword, params);
        return res;
    } catch (error) {
        throw error;
    }
}


export const userUpdateService = async (params) => {
    try {
        const res = await put(api.userUpdate, params);
        return res;
    } catch (error) {
        throw error;
    }
}




