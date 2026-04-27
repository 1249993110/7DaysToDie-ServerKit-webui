

/**
 * 获取统计信息
 * @returns 
 */
export const getStats = () => {
    return http.get('/Server/Stats');
};

/**
 * 获取系统信息
 * @returns 
 */
export const getSystemInfo = () => {
    return http.get('/Server/SystemInfo');
};

/**
 * Restart server
 * @returns 
 */
export const restart = () => {
    return http.post('/Server/Restart');
};

/**
 * Shutdown server
 * @returns 
 */
export const shutdown = () => {
    return http.delete('/Server/Shutdown');
};

/**
 * Send global message
 * @returns
 */
export const sendGlobalMessage = (message, senderName) => {
    return http.post('/Server/SendGlobalMessage', { message, senderName });
};

/**
 * Send private message
 * @returns
 */
export const sendPrivateMessage = (playerIdOrName, message, senderName) => {
    return http.post('/Server/SendPrivateMessage', { targetPlayerIdOrName: playerIdOrName, message, senderName });
};

/**
* Reset player
* @returns
*/
export const resetPlayer = (playerId) => {
   return http.delete('/Server/ResetPlayer?playerId=' + playerId);
};

/**
 * Execute console command
 * @returns
 */
export const executeConsoleCommand = (command, inMainThread = true) => {
    return http.post('/Server/ExecuteConsoleCommand', null, {
        params: {
            command,
            inMainThread,
        },
    });
};

/**
 * 获取服务器设置
 * @returns 
 */
export const getSettings = (lang) => {
    return http.get('/Server/Settings', { params: { language: lang } });
};

/**
 * 修改服务器设置
 * @returns 
 */
export const putSettings = (data) => {
    return http.put('/Server/Settings', data);
};

export const getAllowedCommands = () => {
    return http.get('/Server/AllowedCommands');
}

/**
 * 获取所有实体名称
 * @returns {Promise<{entityClassName: string, localizationName: string|null}[]>}
 */
export const getZombieEntityClasses = (language) => {
    return http.get('/Server/ZombieEntityClasses', { params: { language } });
};
