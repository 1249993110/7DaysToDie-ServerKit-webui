

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
