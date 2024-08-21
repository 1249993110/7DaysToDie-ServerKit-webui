

/**
 * 通过分页参数获取私人位置
 * @returns
 */
 export const getHomeLocationPaged = (params) => {
    return http.get('/HomeLocation', { params: params });
};

/**
 * 通过Id获取私人位置
 * @returns
 */
export const getHomeLocationById = (id) => {
    return http.get('/HomeLocation/' + id);
};

/**
 * 新增私人位置
 * @returns
 */
export const addHomeLocation = (data) => {
    return http.post('/HomeLocation', data);
};

/**
 * 通过Id删除私人位置
 * @returns
 */
export const deleteHomeLocationById = (id) => {
    return http.delete('/HomeLocation/' + id);
};

/**
 * 通过Id集合删除私人位置
 * @returns
 */
export const deleteHomeLocationByIds = (params) => {
    return http.delete('/HomeLocation', { params: params });
};

/**
 * 更新私人位置
 * @returns
 */
 export const updateHomeLocation = (id, data) => {
    return http.put('/HomeLocation/' + id, data);
};