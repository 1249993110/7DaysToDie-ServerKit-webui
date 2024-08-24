/**
 * Information confirmation prompt box
 */

import { i18n } from '~/plugins/i18n';

export default function myconfirm(message, title, type = '') {
    return new Promise((resolve) => {
        ElMessageBox.confirm(message, title ?? i18n.global.t('global.message.title'), {
            confirmButtonText: i18n.global.t('global.button.confirm'),
            cancelButtonText: i18n.global.t('global.button.cancel'),
            type: type,
        })
            .then(() => {
                resolve(true);
            })
            .catch(() => {
                resolve(false);
            });
    });
}
