

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
export const renderFullMap = () => {
    return http.post('/Map/RenderFullMap');
};

/**
 * 查询全图渲染进度
 * @returns
 */
export const getRenderFullMapStatus = () => {
    return http.get('/Map/RenderFullMapStatus');
};

/**
 * 停止全图渲染
 * @returns
 */
export const stopRenderFullMap = () => {
    return http.post('/Map/StopRenderFullMap');
};

/**
 * 渲染已探索区域
 * @returns
 */
export const renderExploredArea = () => {
    return http.post('/Map/RenderExploredArea');
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
