import { createI18n } from 'vue-i18n';
/*
 * All i18n resources specified in the plugin `include` option can be loaded
 * at once using the import syntax
 */
import messages from '@intlify/unplugin-vue-i18n/messages';

export const supportedLanguages = ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pl', 'pt', 'ru', 'tr', 'zh', 'tw'];

function getLanguageCode(lang) {
    const langCode = lang.substring(0, 2);
    if (supportedLanguages.includes(langCode)) {
        return langCode;
    } else {
        console.error('Unsupported language: ' + lang + ', fallback to en.');
        return 'en';
    }
}

const preferredLocale = () => {
    let lang = localStorage.getItem('lang');
    if(lang){
        return lang;
    }

    lang = navigator.language.toLowerCase();
    console.log('Navigator lang:', lang);

    if(lang === 'zh-tw' || lang === 'zh-hk'){
        return 'tw';
    }

    return getLanguageCode(lang);
};

export const i18n = createI18n({
    locale: preferredLocale(),
    fallbackLocale: 'en',
    legacy: false,
    messages,
    globalInjection: false, // In <template> can use $t
});

export default (app) => {
    app.use(i18n);
};
