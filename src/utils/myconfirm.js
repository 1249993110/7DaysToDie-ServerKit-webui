/**
 * 信息确定提示框
 */
export default function myconfirm(message, title = '系统提示', type = '') {
    return new Promise((resolve) => {
        ElMessageBox.confirm(message, title, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: type,
        })
            .then(() => {
                resolve(true);
            })
            .catch(() => {
                resolve(false);
            });
    });
}
