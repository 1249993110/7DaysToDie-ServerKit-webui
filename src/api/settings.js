import http from '../utils/request';

export const getSettings = (name) => {
    return http.get('/Settings/' + name);
};

export const updateSettings = (name, data) => {
    return http.put('/Settings/' + name, data);
};

export const resetSettings = (name) => {
    return http.delete('/Settings/' + name);
};
