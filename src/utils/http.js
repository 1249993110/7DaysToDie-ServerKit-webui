import axios from 'axios';
import nProgress from '~/plugins/nprogress';
import qs from 'qs';
import { useUserInfoStore } from '~/store/user-info';
import { loginUrl } from '~/api/account';

const service = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL,
    timeout: import.meta.env.VITE_APP_API_TIMEOUT,
    paramsSerializer: {
        serialize: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
        },
    },
});

service.interceptors.request.use(
    async (config) => {
        nProgress.start();

        if (config.url != loginUrl) {
            const token = await useUserInfoStore().getToken();
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response) => {
        nProgress.done();
        return response.data;
    },
    (error) => {
        nProgress.done();
        if (!error.response) {
            ElMessage.error(error.message);
            return Promise.reject(error);
        }

        switch (error.response.status) {
            case 401:
                sessionStorage.clear();
                location.reload();
                break;
            case 403:
                break;
            case 404:
                ElMessage.error('The requested resource does not found');
                break;
            case 400:
                ElMessage.error(error.response.data.error_description || error.response.data.error || 'Bad Request');
                console.error(error.response.data);
                break;
            case 500:
                ElMessage.error(error.response.data.message || 'Internal Server Error');
                break;
            default:
                ElMessage.error(error.message);
                console.error(error);
                break;
        }

        return Promise.reject(error);
    }
);

export default service;
