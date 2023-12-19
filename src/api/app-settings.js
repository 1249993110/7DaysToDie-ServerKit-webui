import http from '../utils/request';

/**
 * 获取应用设置
 * @returns 
 */
export const getAppSettings = () => {
    return http.get('/AppSettings');
};