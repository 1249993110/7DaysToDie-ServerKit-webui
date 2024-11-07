/**
 *
 * @returns
 */
export const getPermissions = () => {
    return http.get('/Permissions');
};

/**
 *
 * @returns
 */
export const addPermissions = (data) => {
    return http.post('/Permissions', data);
};

/**
 *
 * @returns
 */
export const deletePermissions = (cmds) => {
    return http.delete('/Permissions', { params: { cmds } });
};
