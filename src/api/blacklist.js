

export const getBlacklist = () => {
    return http.get('/Blacklist');
};

export const addBlacklist = (data) => {
    return http.post('/Blacklist/', data);
};

export const deleteBlacklist = (playerIds) => {
    return http.delete('/Blacklist/', { params: { playerIds: playerIds } });
};
