import http from '../utils/request';

/**
 * 获取文件浏览器访问Token
 * @returns 
 */
export const getToken = () => {
    return http.get('/FileBrowser/Token');
};