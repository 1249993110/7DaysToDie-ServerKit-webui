/**
 * Get all Cd Key Redeem Records.
 * @returns
 */
export const getCdKeyRedeemRecords = () => {
    return http.get('/CdKeyRedeemRecords');
};

/**
 * Get a Cd Key Redeem Record by ID.
 * @returns
 */
export const getCdKeyRedeemRecord = (id) => {
    return http.get('/CdKeyRedeemRecords/' + id);
};

/**
 * Creates a new Cd Key Redeem Record.
 * @returns
 */
export const createCdKeyRedeemRecord = (data) => {
    return http.post('/CdKeyRedeemRecords', data);
};

/**
 * Updates an existing Cd Key Redeem Record.
 * @returns
 */
export const updateCdKeyRedeemRecord = (id, data) => {
    return http.put('/CdKeyRedeemRecords/' + id, data);
};

/**
 * Deletes a Cd Key Redeem Record by ID.
 * @returns
 */
export const deleteCdKeyRedeemRecord = (id) => {
    return http.delete('/CdKeyRedeemRecords/' + id);
};

/**
 * Deletes multiple Cd Key Redeem Record by their IDs.
 * @returns
 */
export const deleteCdKeyRedeemRecords = (ids) => {
    return http.delete('/CdKeyRedeemRecords', { params: { ids } });
};
