/**
 * @description add unit
 * @param {String | Number} value 100
 * @param {String} unit px em rem
 */
export const addUnit = (value, unit = 'px') => {
    return !Object.is(Number(value), NaN) ? `${value}${unit}` : value;
};
