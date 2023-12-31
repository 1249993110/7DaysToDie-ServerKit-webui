import http from '../utils/request';

/**
 * 获取玩家背包
 * @returns
 */
export const getPlayerInventory = (playerId) => {
    return http.get('/Inventories/' + playerId);
};

/**
 * 删除指定玩家背包中的物品
 * @returns
 */
export const removePlayerItems = (playerId, itemName) => {
    return http.delete('/Inventories/' + playerId + '/' + itemName);
};
