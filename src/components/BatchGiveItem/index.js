import Dialog from './index.vue';
import { createVNode, render, getCurrentInstance } from 'vue';
import { i18n } from '~/plugins/i18n';

export const batchGiveItem = async (playerIds, displayNames) => {
    const container = document.createElement('div');

    let target = '';
    if (playerIds.length > 1) {
        target = displayNames.join(', ');
    } else {
        target = `${displayNames[0]} (${playerIds[0]})`;
    }

    const vNode = createVNode(Dialog, {
        title: i18n.global.t('components.batchGiveItem.title', [target]),
        playerIds: playerIds,
        onClosed: () => {
            document.body.removeChild(container);
        },
    });
    //vNode.appContext = getCurrentInstance().appContext;
    render(vNode, container);
    document.body.appendChild(container);
};
