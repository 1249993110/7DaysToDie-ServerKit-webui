import { createI18n } from 'vue-i18n';
/*
 * All i18n resources specified in the plugin `include` option can be loaded
 * at once using the import syntax
 */
import messages from '@intlify/unplugin-vue-i18n/messages';

const preferredLocale = () => {
    let lang = localStorage.getItem('lang');
    if(lang){
        return lang;
    }

    lang = navigator.language;
    switch (lang.toLowerCase()) {
        case 'en':
        case 'en-us':
        case 'en-gb':
            return 'en';
        case 'zh':
        case 'zh-cn':
            return 'zh';
        case 'zh-tw':
            return 'tw';
        default:
            console.error('Unsupported language:', lang);
    }
};

export const i18n = createI18n({
    locale: preferredLocale(),
    fallbackLocale: 'en',
    legacy: false,
    messages,
    globalInjection: true, // In <template> can use $t
});

export default (app) => {
    app.use(i18n);
};
