import http from '../utils/request';

/**
 * 获取商品
 * @returns
 */
export const getGoods = () => {
    return http.get('/Goods');
};

/**
 * 通过Id获取商品
 * @returns
 */
export const getGoodsById = (id) => {
    return http.get('/Goods/' + id);
};

/**
 * 新增商品
 * @returns
 */
export const addGoods = (data) => {
    return http.post('/Goods', data);
};

/**
 * 通过Id删除商品
 * @returns
 */
export const deleteGoodsById = (id) => {
    return http.delete('/Goods/' + id);
};

/**
 * 通过Id集合删除商品
 * @returns
 */
export const deleteGoodsByIds = (ids) => {
    return http.delete('/Goods', { params: { ids } });
};

/**
 * 更新商品
 * @returns
 */
export const updateGoods = (id, data) => {
    return http.put('/Goods/' + id, data);
};

/**
 * 获取商品关联的物品清单
 * @returns
 */
export const getItemList = (id) => {
    return http.get('/Goods/' + id + '/Items');
};

/**
 * 修改商品关联的物品清单
 * @returns
 */
export const updateItemList = (id, data) => {
    return http.put('/Goods/' + id + '/Items', data);
};

/**
 * 获取商品关联的命令清单
 * @returns
 */
export const getCommandList = (id) => {
    return http.get('/Goods/' + id + '/Commands');
};

/**
 * 修改商品关联的命令清单
 * @returns
 */
export const updateCommandList = (id, data) => {
    return http.put('/Goods/' + id + '/Commands', data);
};