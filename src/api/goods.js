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
    return http.delete('/Goods', { data: ids });
};

/**
 * 更新商品
 * @returns
 */
 export const updateGoods = (id, data) => {
    return http.put('/Goods/' + id, data);
};