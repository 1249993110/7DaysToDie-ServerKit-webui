

/**
 * 获取聊天记录
 * @returns
 */
export const getChatRecord = (params) => {
    return http.get('/ChatRecord', { params: params });
};

/**
 * 通过Id删除聊天记录
 * @returns
 */
export const deleteChatRecordById = (id) => {
    return http.delete('/ChatRecord/' + id);
};

/**
 * 通过Id集合删除聊天记录
 * @returns
 */
export const deleteChatRecordByIds = (ids, deleteAll = false) => {
    return http.delete('/ChatRecord', { params: {ids, deleteAll} });
};