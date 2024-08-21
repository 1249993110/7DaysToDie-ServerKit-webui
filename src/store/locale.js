import { i18n } from '~/plugins/i18n';
import { setLocale as setDayjsLocale } from '~/plugins/dayjs';

export const useLocaleStore = defineStore({
    id: 'locale',
    state: () => ({
        locale: i18n.global.locale,
        availableLocales: [
            {
                lable: 'English',
                value: 'en',
            },
            {
                lable: '简体中文',
                value: 'zh',
            },
        ],
    }),
    getters: {},
    actions: {
        setLocale(locale) {
            this.locale = locale;
            setDayjsLocale(locale);
            localStorage.setItem('lang', locale);
        },
        getAppTitle() {
            return i18n.global.t('global.appTitle') + ' ' + import.meta.env.VITE_APP_VERSION;
        },
    },
});
