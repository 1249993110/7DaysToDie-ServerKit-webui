/**
 * getColoredChat
 * @returns
 */
export const getColoredChat = () => {
    return http.get('/ColoredChat');
};

/**
 * getColoredChatById
 * @returns
 */
export const getColoredChatById = (id) => {
    return http.get('/ColoredChat/' + id);
};

/**
 * addColoredChat
 * @returns
 */
export const addColoredChat = (data) => {
    return http.post('/ColoredChat', data);
};

/**
 * deleteColoredChatById
 * @returns
 */
export const deleteColoredChatById = (id) => {
    return http.delete('/ColoredChat/' + id);
};

/**
 * deleteColoredChatByIds
 * @returns
 */
export const deleteColoredChatByIds = (ids) => {
    return http.delete('/ColoredChat', { params: { ids } });
};

/**
 * updateColoredChat
 * @returns
 */
export const updateColoredChat = (id, data) => {
    return http.put('/ColoredChat/' + id, data);
};
