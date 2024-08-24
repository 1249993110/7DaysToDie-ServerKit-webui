import { i18n } from '~/plugins/i18n';

export const formatMinute = (totalMinute) => {
    if (totalMinute < 1) {
        return `${i18n.global.t('global.lessThan')} ${i18n.global.t('global.oneMinute')}`;
    }

    const day = parseInt(totalMinute / 60 / 24);
    const hour = parseInt((totalMinute / 60) % 24);
    const minute = parseInt(totalMinute % 60);
    let result = '';
    if (day > 0) {
        result = day + ` ${i18n.global.t('global.days')} `;
    }
    if (hour > 0) {
        result += hour + ` ${i18n.global.t('global.hours')} `;
    }
    if (minute > 0) {
        result += minute + ` ${i18n.global.t('global.minutes')} `;
    }
    return result;
};

export const formatPosition = (pos) => {
    return `${pos.x} ${pos.y} ${pos.z}`;
};
