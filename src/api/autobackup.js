

/**
 * 获取备份文件列表
 * @returns
 */
export const getBackupFiles = () => {
    return http.get('/AutoBackup');
};

/**
 * 删除备份文件
 * @returns
 */
export const deletetBackupFiles = (fileNames) => {
    return http.delete('/AutoBackup', { params: { fileNames } });
};

/**
 * 手动备份
 * @returns
 */
export const manualBackup = () => {
    return http.post('/AutoBackup');
};
