/**
 * 获取本地化资源
 */
export const getLocalization = (language) => {
    return http.get('/Localization', { params: { language: language } });
};