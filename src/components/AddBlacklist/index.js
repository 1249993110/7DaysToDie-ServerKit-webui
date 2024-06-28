import Dialog from './index.vue';
import { createVNode, render } from 'vue';

export const showBanWindow = async (playerId, displayName) => {
    const container = document.createElement('div');
    const vNode = createVNode(Dialog, {
        modelValue: true,
        title: `封禁: ${displayName} (${playerId})`,
        playerId: playerId,
        displayName: displayName,
        onClosed: () => {
            document.body.removeChild(container);
        },
    });
    render(vNode, container);
    document.body.appendChild(container);
};
