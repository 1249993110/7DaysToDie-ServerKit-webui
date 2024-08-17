import Dialog from './index.vue';
import { createVNode, render } from 'vue';

export const showPlayerInventory = async (playerId, playerName) => {
    const container = document.createElement('div');
    const vNode = createVNode(Dialog, {
        title: `玩家: ${playerName} (${playerId}) 的背包`,
        playerId: playerId,
        modelValue: true,
        onClosed: () => {
            document.body.removeChild(container);
        },
    });
    render(vNode, container);
    document.body.appendChild(container);
};
