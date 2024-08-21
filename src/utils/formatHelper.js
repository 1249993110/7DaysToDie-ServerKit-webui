export const formatMinute = (totalMinute) => {
    if (totalMinute < 1) {
        return '小于 1 分钟';
    }

    const day = parseInt(totalMinute / 60 / 24);
    const hour = parseInt((totalMinute / 60) % 24);
    const minute = parseInt(totalMinute % 60);
    let result = '';
    if (day > 0) {
        result = day + ' 天 ';
    }
    if (hour > 0) {
        result += hour + ' 小时 ';
    }
    if (minute > 0) {
        result += minute + ' 分钟 ';
    }
    return result;
};

export const formatPosition = (pos) => {
    return `${pos.x} ${pos.y} ${pos.z}`;
};

export const formatLandProtectionActive = (row) => {
    const value = row.landProtectionActive;
    return value ? '激活' : '未激活';
};
