// export function preferredLocale(locale = 'en') {
//     if (!IN_BROWSER) return locale;

//     const languages = [].concat(window.localStorage.getItem('currentLocale') || [], navigator.languages || []);

//     return languages.find((l) => locales.some((locale) => locale.enabled && l === (locale.alternate || locale.locale))) || locale;
// }

export const useLocaleStore = defineStore({
    id: 'locale',
    state: () => ({
        locale: 'en',
    }),
});
