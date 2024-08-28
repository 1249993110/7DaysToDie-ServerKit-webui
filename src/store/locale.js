import { i18n } from '~/plugins/i18n';
import { setLocale as setDayjsLocale } from '~/plugins/dayjs';

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
                case 'de':
                    return 'German';
                case 'es':
                    return 'Spanish';
                case 'fr':
                    return 'French';
                case 'it':
                    return 'Italian';
                case 'ja':
                    return 'Japanese';
                case 'ko':
                    return 'Koreana';
                case 'pl':
                    return 'Polish';
                case 'pt':
                    return 'Brazilian';
                case 'ru':
                    return 'Russian';
                case 'tr':
                    return 'Turkish';
                case 'zh':
                    return 'Schinese'; // Simplified Chinese
                case 'tw':
                    return 'Tchinese'; // Traditional Chinese
                default:
                    return 'English';
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
