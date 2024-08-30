import axios from 'axios';
import { signOut } from '@/utils/tool';


// 创建一个 axios 实例，设置默认配置
const apiClient = axios.create({
	baseURL: '/api', // 使用代理后的前缀
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

apiClient.interceptors.request.use(
	config => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.token = token;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

apiClient.interceptors.response.use(
	response => response,
	error => {
		if (error.response && error.response.status === 403) {
			// clear token in localStorage
			signOut()
		}
		return Promise.reject(error);
	}
);

// handle get request
export const get = async (url, params = {}) => {
	try {
		const response = await apiClient.get(url, { params });
		return response.data;
	} catch (error) {
		console.error('GET request failed', error);
		throw error?.response?.data;
	}
};

// handle POST request
export const post = async (url, data = {}) => {
	try {
		const response = await apiClient.post(url, data);
		return response.data;
	} catch (error) {
		console.error('POST request failed', error);
		throw error?.response?.data;
	}
};

// handle PUT request
export const put = async (url, data = {}) => {
	try {
		const response = await apiClient.put(url, data);
		return response.data;
	} catch (error) {
		console.error('PUT request failed', error);
		throw error?.response?.data;
	}
};

// handle DELETE request
export const del = async (url, params = {}) => {
	try {
		const response = await apiClient.delete(url, { params });
		return response.data;
	} catch (error) {
		console.error('DELETE request failed', error);
		throw error;
	}
};
