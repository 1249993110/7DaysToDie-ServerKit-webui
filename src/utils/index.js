import { i18n } from '~/plugins/i18n';

/**
 * @description add unit
 * @param {String | Number} value 100
 * @param {String} unit px em rem
 */
export const addUnit = (value, unit = 'px') => {
    return !Object.is(Number(value), NaN) ? `${value}${unit}` : value;
};

export const searchByKeyword = (data, keyword, fields = []) => {
    if (!keyword || !keyword.trim()) {
        return data;
    }

    const regex = new RegExp(keyword, 'i');

    return data.filter((item) => {
        const keysToSearch = fields.length ? fields : Object.keys(item);

        return keysToSearch.some((field) => {
            return item[field] != null && regex.test(item[field].toString());
        });
    });
};

export const showCmdExecResult = (result) => {
    const msg = Array.isArray(result) ? result.join('\n') : result;
    ElNotification({
        title: i18n.global.t('global.message.cmdExecResult'),
        type: 'info',
        message: h('i', { style: { color: 'teal', whiteSpace: 'pre-wrap', overflowWrap: 'break-word', width: '250px', display: 'inline-block' } }, msg),
    });
};
