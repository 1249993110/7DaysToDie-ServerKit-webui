

export const getWhitelist = () => {
    return http.get('/Whitelist');
};

export const addWhitelist = (data) => {
    return http.post('/Whitelist/', data);
};

export const deleteWhitelist = (playerIds) => {
    return http.delete('/Whitelist/', { params: { playerIds: playerIds } });
};
