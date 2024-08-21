

/**
 * 获取所有城镇
 * @returns
 */
 export const getCityLocations = () => {
    return http.get('/CityLocation');
};

/**
 * 通过Id获取城镇
 * @returns
 */
export const getCityLocationById = (id) => {
    return http.get('/CityLocation/' + id);
};

/**
 * 新增城镇
 * @returns
 */
export const addCityLocation = (data) => {
    return http.post('/CityLocation', data);
};

/**
 * 通过Id删除城镇
 * @returns
 */
export const deleteCityLocationById = (id) => {
    return http.delete('/CityLocation/' + id);
};

/**
 * 通过Id集合删除城镇
 * @returns
 */
export const deleteCityLocationByIds = (ids) => {
    return http.delete('/CityLocation', { data: ids });
};

/**
 * 更新城镇
 * @returns
 */
 export const updateCityLocation = (id, data) => {
    return http.put('/CityLocation/' + id, data);
};