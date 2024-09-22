export const getAvailablePrefabs = (params) => {
    return http.get('/Prefab/AvailablePrefabs', {
        params: params,
    });
};

export const placePrefab = (data) => {
    return http.post('/Prefab/PlacePrefab', data);
};

export const getUndoHistory = () => {
    return http.get('/Prefab/UndoHistory');
};

export const undoPrefab = (id) => {
    return http.put('/Prefab/UndoPrefab/' + id);
};
