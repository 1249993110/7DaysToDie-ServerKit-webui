

/**
 * 获取命令
 * @returns
 */
export const getCommandListPaged = (params) => {
    return http.get('/CommandList', { params: params });
};

/**
 * 通过Id获取命令
 * @returns
 */
export const getCommandById = (id) => {
    return http.get('/CommandList/' + id);
};

/**
 * 新增命令
 * @returns
 */
export const addCommand = (data) => {
    return http.post('/CommandList', data);
};

/**
 * 通过Id删除命令
 * @returns
 */
export const deleteCommandById = (id) => {
    return http.delete('/CommandList/' + id);
};

/**
 * 通过Id集合删除命令
 * @returns
 */
export const deleteCommandByIds = (ids, deleteAll = false) => {
    return http.delete('/CommandList', { params: { ids, deleteAll } });
};

/**
 * 更新命令
 * @returns
 */
export const updateCommand = (id, data) => {
    return http.put('/CommandList/' + id, data);
};

/**
 * CSV批量导入命令
 * @returns
 */
export const importCommandListCsv = (formData) => {
    return http.post('/CommandList/ImportCsv', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * 下载命令CSV模板
 * @returns
 */
export const downloadCommandListTemplate = () => {
    return http.get('/CommandList/CsvTemplate', {
        responseType: 'blob'
    });
};
