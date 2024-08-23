import { i18n } from '~/plugins/i18n';
import { setLocale as setDayjsLocale } from '~/plugins/dayjs';
console.log(i18n.global.availableLocales);
export const useLocaleStore = defineStore({
    id: 'locale',
    state: () => ({
        locale: i18n.global.locale,
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
        getLanguage() {
            switch (this.locale) {
                case 'en':
                    return 'English';
                case 'zh':
                    return 'Schinese';
                case 'tw':
                    return 'Tchinese';
            }
        },
        getAvailableLocales() {
            const array = [];
            for (const locale of i18n.global.availableLocales) {
                array.push({
                    label: i18n.global.t('global.language', 1, { locale }),
                    value: locale,
                });
            }
            return array;
        },
    },
});
