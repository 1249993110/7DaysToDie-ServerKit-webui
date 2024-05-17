import http from '../utils/request';

/**
 * 通过分页参数获取积分
 * @returns
 */
export const getPointsInfoPaged = (params) => {
    return http.get('/PointsInfo', { params: params });
};

/**
 * 通过Id获取积分
 * @returns
 */
export const getPointsInfo = (id) => {
    return http.get('/PointsInfo/' + id);
};

/**
 * 新增积分
 * @returns
 */
export const addPointsInfo = (data) => {
    return http.post('/PointsInfo', data);
};

/**
 * 通过Id删除积分
 * @returns
 */
export const deletePointsInfoById = (id) => {
    return http.delete('/PointsInfo/' + id);
};

/**
 * 通过Id集合删除积分
 * @returns
 */
export const deletePointsInfoByIds = (ids) => {
    return http.delete('/PointsInfo', { data: ids });
};

/**
 * 更新积分
 * @returns
 */
 export const updatePointsInfo = (id, data) => {
    return http.put('/PointsInfo/' + id, data);
};