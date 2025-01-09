/**
 * Get all Cd Keys.
 * @returns
 */
export const getCdKeys = () => {
    return http.get('/CdKeys');
};

/**
 * Get a Cd Key by ID.
 * @returns
 */
export const getCdKey = (id) => {
    return http.get('/CdKeys/' + id);
};

/**
 * Creates a new Cd Key.
 * @returns
 */
export const createCdKey = (data) => {
    return http.post('/CdKeys', data);
};

/**
 * Updates an existing Cd Key.
 * @returns
 */
export const updateCdKey = (id, data) => {
    return http.put('/CdKeys/' + id, data);
};

/**
 * Deletes a Cd Key by ID.
 * @returns
 */
export const deleteCdKey = (id) => {
    return http.delete('/CdKeys/' + id);
};

/**
 * Deletes multiple Cd Key by their IDs.
 * @returns
 */
export const deleteCdKeys = (ids) => {
    return http.delete('/CdKeys', { params: { ids } });
};


/**
 * Get item list associated with the Cd Key ID.
 * @returns
 */
export const getItemList = (id) => {
    return http.get('/CdKeys/' + id + '/Items');
};

/**
 * Update items associated with the Cd Key ID.
 * @returns
 */
export const updateItemList = (id, data) => {
    return http.put('/CdKeys/' + id + '/Items', data);
};

/**
 * Get command list associated with the Cd Key ID.
 * @returns
 */
export const getCommandList = (id) => {
    return http.get('/CdKeys/' + id + '/Commands');
};

/**
 * Update commands associated with the Cd Key ID.
 * @returns
 */
export const updateCommandList = (id, data) => {
    return http.put('/CdKeys/' + id + '/Commands', data);
};
