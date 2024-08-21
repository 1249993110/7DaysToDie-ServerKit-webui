

/**
 * 获取位置
 * @returns
 */
export const getLocations = (entityType) => {
    return http.get('/Locations', { params: { entityType } });
};
