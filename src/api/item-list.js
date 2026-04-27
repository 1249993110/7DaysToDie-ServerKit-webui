

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

/**
 * CSV批量导入物品
 * @returns
 */
export const importItemListCsv = (formData) => {
    return http.post('/ItemList/ImportCsv', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * 下载物品CSV模板
 * @returns
 */
export const downloadItemListTemplate = () => {
    return http.get('/ItemList/CsvTemplate', {
        responseType: 'blob'
    });
};
