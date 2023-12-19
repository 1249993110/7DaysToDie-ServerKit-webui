import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear'; // import plugin
import duration from 'dayjs/plugin/duration'; // import plugin
import 'dayjs/locale/zh-cn'; // import locale

dayjs.extend(isLeapYear); // use plugin
dayjs.extend(duration); // use plugin
dayjs.locale('zh-cn'); // use locale

export const defaultFormat = 'YYYY-MM-DD HH:mm:ss';

export default dayjs;