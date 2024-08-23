

export const getSettings = (name, lang) => {
    return http.get('/Settings/' + name, { params: { lang } });
};

export const updateSettings = (name, data) => {
    return http.put('/Settings/' + name, data);
};

export const resetSettings = (name, lang) => {
    return http.delete('/Settings/' + name, { params: { lang } });
};
