import dayjs from 'dayjs';

export const FORMAT_DATE = 'YYYY-MM-DD';

// 长度至少8位，包含字母和数字
export const validatePassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const toUnix = t => {
	if (!t) return null;
	return dayjs(t).unix()
}

export const toDateStr = t => {
	if (!t) return null;
	return dayjs.unix(t).format(FORMAT_DATE);
}

export const filterImgUrls = (files = []) => {
	if (!files?.length) return [];
	return files?.map(item => {
		if (item.status) return item?.response?.filePath
		if (item.url?.includes(import.meta.env.VITE_STATIC_HOST)) {
			return item.url?.replace(import.meta.env.VITE_STATIC_HOST, '');
		}
		return '';
	});
}

export const handleImgPathToUrl = (list = []) => {
	return list?.map(imgPath => (`${import.meta.env.VITE_STATIC_HOST}${imgPath}`))
}

export const signOut = () => {
	try {
		try {
			localStorage.removeItem('token');
		} catch (error) {
		} finally {
			window.location.replace('/login');
		}
	} catch (error) {

	}
}