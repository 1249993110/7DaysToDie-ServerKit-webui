import Dialog from './index.vue';
import { createVNode, render } from 'vue';
import { i18n } from '~/plugins/i18n';

export const batchBan = async (playerIds, displayNames) => {
    const container = document.createElement('div');

    let title = '';
    if (playerIds.length > 1) {
        title = `${i18n.global.t('components.batchAddBlacklist.ban')}: ${displayNames.join(', ')}`;
    } else {
        title = `${i18n.global.t('components.batchAddBlacklist.ban')}: ${playerIds[0]} (${displayNames[0]})`;
    }

    const vNode = createVNode(Dialog, {
        modelValue: true,
        title: title,
        playerIds: playerIds,
        displayNames: displayNames,
        onClosed: () => {
            document.body.removeChild(container);
        },
    });
    render(vNode, container);
    document.body.appendChild(container);
};
