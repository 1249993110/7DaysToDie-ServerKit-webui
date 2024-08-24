/**
 * Information input prompt box
 */

import { i18n } from '~/plugins/i18n';

export default function myprompt(message, title, inputValue = '', type = '', inputPattern = null, inputErrorMessage = '') {
    return new Promise((resolve, reject) => {
        ElMessageBox.prompt(message, title ?? i18n.global.t('global.message.title'), {
            confirmButtonText: i18n.global.t('global.button.confirm'),
            cancelButtonText: i18n.global.t('global.button.cancel'),
            inputPattern: inputPattern,
            inputErrorMessage: inputErrorMessage,
            type: type,
            inputValue: inputValue
        })
            .then(({ value }) => {
                resolve(value);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
