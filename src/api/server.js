import http from '../utils/request';

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
 * 重启服务器
 * @returns 
 */
export const restart = () => {
    return http.post('/Server/Restart');
};

/**
 * 关闭服务器
 * @returns 
 */
export const shutdown = () => {
    return http.delete('/Server/Shutdown');
};

/**
 * 发送全局消息
 * @returns
 */
export const sendGlobalMessage = (message) => {
    return http.post('/Server/SendGlobalMessage', { message, senderName: 'Server' });
};

/**
* 重置玩家
* @returns
*/
export const resetPlayer = (playerId) => {
   return http.delete('/Server/ResetPlayer?playerId=' + playerId);
};

/**
 * 执行控制台命令
 * @returns
 */
export const executeConsoleCommand = (command, inMainThread = false) => {
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
export const getSettings = () => {
    return http.get('/Server/Settings');
};

/**
 * 修改服务器设置
 * @returns 
 */
export const putSettings = (data) => {
    return http.put('/Server/Settings', data);
};