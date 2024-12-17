/**
 * 
 * @returns
 */
export const getTaskSchedule = () => {
    return http.get('/TaskSchedule');
};

/**
 * 
 * @returns
 */
export const addTaskSchedule = (data) => {
    return http.post('/TaskSchedule', data);
};

/**
 * 
 * @returns
 */
export const deleteTaskScheduleById = (id) => {
    return http.delete('/TaskSchedule/' + id);
};

/**
 * 
 * @returns
 */
export const deleteTaskScheduleByIds = (ids) => {
    return http.delete('/TaskSchedule', { params: { ids } });
};

/**
 * 
 * @returns
 */
export const updateTaskSchedule = (id, data) => {
    return http.put('/TaskSchedule/' + id, data);
};


/**
 * 
 * @returns
 */
export const getCommandList = (id) => {
    return http.get('/TaskSchedule/' + id + '/Commands');
};

/**
 * 
 * @returns
 */
export const updateCommandList = (id, data) => {
    return http.put('/TaskSchedule/' + id + '/Commands', data);
};
