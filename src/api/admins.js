/**
 *
 * @returns
 */
export const getAdmins = () => {
    return http.get('/Admins');
};

/**
 *
 * @returns
 */
export const addAdmins = (data) => {
    return http.post('/Admins', data);
};

/**
 *
 * @returns
 */
export const deleteAdmins = (playerIds) => {
    return http.delete('/Admins', { params: { playerIds } });
};
