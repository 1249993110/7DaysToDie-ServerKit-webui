import { createI18n } from 'vue-i18n';
/*
 * All i18n resources specified in the plugin `include` option can be loaded
 * at once using the import syntax
 */
import messages from '@intlify/unplugin-vue-i18n/messages';

const preferredLocale = () => {
    return localStorage.getItem('lang') ?? usePreferredLanguages().value[0].slice(0, 2);
};

export const i18n = createI18n({
    locale: preferredLocale(),
    fallbackLocale: 'en',
    legacy: false,
    messages,
    globalInjection: true, // 在 <template> 可以使用 $t
});

export default (app) => {
    app.use(i18n);
};
