/**
 * Get localization
 */
export const getLocalization = (lang) => {
    return http.get('/Localization', { params: { language: lang } });
};

/**
 * Get localization by key
 */
export const getLocalizationByKey = (key, lang, caseInsensitive = false) => {
    return http.get('/Localization/' + key, { params: { language: lang, caseInsensitive } });
};
