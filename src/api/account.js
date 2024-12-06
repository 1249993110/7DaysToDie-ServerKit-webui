export const loginUrl = '/oauth/token';

/**
 * 登录
 * @returns
 */
export const login = (username, password) => {
    return http.post(loginUrl, { grant_type: 'password', username, password }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
};

/**
 * 登录
 * @returns
 */
export const refreshToken = (refreshToken) => {
    return http.post(loginUrl, { grant_type: 'refresh_token', refresh_token:refreshToken }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
};

// /**
//  * 注销
//  * @returns
//  */
// export const logout = () => {
//     return http.delete('/Account/Logout');
// };
