

/**
 * 获取玩家背包
 * @returns
 */
export const getPlayerInventory = (playerId, lang) => {
    return http.get('/Inventories/' + playerId, { params: { language: lang } });
};

/**
 * 删除指定玩家背包中的物品
 * @returns
 */
export const removePlayerItems = (playerId, itemName) => {
    return http.delete('/Inventories/' + playerId + '/' + itemName);
};
