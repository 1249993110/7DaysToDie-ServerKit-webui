import Dialog from './index.vue';
import { createVNode, render } from 'vue';
import { i18n } from '~/plugins/i18n';

export const showPlayerDetails = async (data) => {
    const container = document.createElement('div');
    const vNode = createVNode(Dialog, {
        title: i18n.global.t('components.playerDetailsDialog.title', [`${data.playerName} (${data.playerId})`]),
        modelValue: true,
        data: data,
        onClosed: () => {
            document.body.removeChild(container);
        },
    });
    render(vNode, container);
    document.body.appendChild(container);
};
