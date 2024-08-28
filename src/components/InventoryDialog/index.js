import Dialog from './index.vue';
import { createVNode, render } from 'vue';
import { i18n } from '~/plugins/i18n';

export const showPlayerInventory = async (playerId, playerName) => {
    const container = document.createElement('div');
    const vNode = createVNode(Dialog, {
        title: i18n.global.t('components.inventoryDialog.title', [`${playerName} (${playerId})`]),
        playerId: playerId,
        modelValue: true,
        onClosed: () => {
            document.body.removeChild(container);
        },
    });
    render(vNode, container);
    document.body.appendChild(container);
};
