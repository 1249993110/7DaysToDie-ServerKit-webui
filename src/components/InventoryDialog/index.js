import InventoryDialog from './index.vue';
import { createVNode, render } from 'vue';

export const showInventory = async (playerId, playerName) => {
    const container = document.createElement('div');
    const vNode = createVNode(InventoryDialog, {
        title: `玩家: ${playerName} (${playerId}) 的背包`,
        playerId: playerId,
        visible: true,
        onClosed: () => {
            document.body.removeChild(container);
        },
    });
    render(vNode, container);
    document.body.appendChild(container);
};
