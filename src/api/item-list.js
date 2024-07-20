import http from '../utils/request';

/**
 * 获取物品
 * @returns
 */
export const getItemListPaged = (params) => {
    return http.get('/ItemList', { params: params });
};

/**
 * 通过Id获取物品
 * @returns
 */
export const getItemById = (id) => {
    return http.get('/ItemList/' + id);
};

/**
 * 新增物品
 * @returns
 */
export const addItem = (data) => {
    return http.post('/ItemList', data);
};

/**
 * 通过Id删除物品
 * @returns
 */
export const deleteItemById = (id) => {
    return http.delete('/ItemList/' + id);
};

/**
 * 通过Id集合删除物品
 * @returns
 */
export const deleteItemByIds = (ids, deleteAll = false) => {
    return http.delete('/ItemList', { params: { ids, deleteAll } });
};

/**
 * 更新物品
 * @returns
 */
export const updateItem = (id, data) => {
    return http.put('/ItemList/' + id, data);
};
