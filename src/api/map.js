import http from '../utils/request';

/**
 * 获取地图信息
 * @returns 
 */
export const getMapInfo = () => {
    return http.get('/Map/Info');
};

/**
 * 渲染整个地图
 * @returns 
 */
export const renderMap = () => {
    return http.post('/Map/Render');
};

/**
 * 获取切片
 * @param {Number} z zoom
 * @param {Number} x 
 * @param {Number} y 
 * @returns 
 */
export const getMapTile = (z, x, y) => {
    return http.get(`/Map/Tile/${z}/${x}/${y}`);
};
