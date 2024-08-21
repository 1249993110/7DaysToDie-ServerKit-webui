import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear'; // import plugin
import duration from 'dayjs/plugin/duration'; // import plugin
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import { i18n } from './i18n';

dayjs.extend(isLeapYear); // use plugin
dayjs.extend(duration); // use plugin

const defaultFormat = 'YYYY-MM-DD HH:mm:ss';
dayjs.extend((option, dayjsClass, dayjsFactory) => {
    const oldFormat = dayjsClass.prototype.format;
    dayjsClass.prototype.format = function (formatString) {
        return oldFormat.bind(this)(formatString ?? defaultFormat);
    };
});

export const setLocale = (locale) => {
    dayjs.locale(locale === 'en' ? 'en' : 'zh-cn');
};
setLocale(i18n.global.locale); // use locale

export default dayjs;