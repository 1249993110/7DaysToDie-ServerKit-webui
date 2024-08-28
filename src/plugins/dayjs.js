import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear'; // import plugin
import duration from 'dayjs/plugin/duration'; // import plugin
import 'dayjs/locale/en';
import 'dayjs/locale/de';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/it';
import 'dayjs/locale/ja';
import 'dayjs/locale/ko';
import 'dayjs/locale/pl';
import 'dayjs/locale/pt';
import 'dayjs/locale/ru';
import 'dayjs/locale/tr';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
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
    if (locale === 'zh') {
        dayjs.locale('zh-cn');
        return;
    }

    if (locale === 'tw') {
        dayjs.locale('zh-tw');
        return;
    }

    dayjs.locale(locale);
};
setLocale(i18n.global.locale.value); // use locale

export default dayjs;
