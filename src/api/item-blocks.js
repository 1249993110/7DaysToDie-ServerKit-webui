

/**
 * 获取物品方块
 * @returns
 */
export const getItemBlocks = (params) => {
    return http.get('/ItemBlocks', { params: params });
};