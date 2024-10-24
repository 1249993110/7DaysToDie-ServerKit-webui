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
            return item[field] && regex.test(item[field].toString());
        });
    });
};
