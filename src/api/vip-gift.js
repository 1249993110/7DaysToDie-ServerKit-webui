import http from '../utils/request';

/**
 * 获取VIP礼品
 * @returns
 */
export const getVipGift = () => {
    return http.get('/VipGift');
};

/**
 * 通过Id获取VIP礼品
 * @returns
 */
export const getVipGiftById = (id) => {
    return http.get('/VipGift/' + id);
};

/**
 * 新增VIP礼品
 * @returns
 */
export const addVipGift = (data) => {
    return http.post('/VipGift', data);
};

/**
 * 通过Id删除VIP礼品
 * @returns
 */
export const deleteVipGiftById = (id) => {
    return http.delete('/VipGift/' + id);
};

/**
 * 通过Id集合删除VIP礼品
 * @returns
 */
export const deleteVipGiftByIds = (ids) => {
    return http.delete('/VipGift', { params: { ids } });
};

/**
 * 更新VIP礼品
 * @returns
 */
export const updateVipGift = (id, data) => {
    return http.put('/VipGift/' + id, data);
};

/**
 * 获取VIP礼品关联的物品清单
 * @returns
 */
export const getItemList = (id) => {
    return http.get('/VipGift/' + id + '/Items');
};

/**
 * 修改VIP礼品关联的物品清单
 * @returns
 */
export const updateItemList = (id, data) => {
    return http.put('/VipGift/' + id + '/Items', data);
};

/**
 * 获取VIP礼品关联的命令清单
 * @returns
 */
export const getCommandList = (id) => {
    return http.get('/VipGift/' + id + '/Commands');
};

/**
 * 修改VIP礼品关联的命令清单
 * @returns
 */
export const updateCommandList = (id, data) => {
    return http.put('/VipGift/' + id + '/Commands', data);
};