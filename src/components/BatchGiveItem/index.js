import Dialog from './index.vue';
import { createVNode, render } from 'vue';

export const batchGiveItem = async (playerIds, displayNames) => {
    const container = document.createElement('div');

    let title = '';
    if (playerIds.length > 1) {
        title = `给予: ${displayNames.join(', ')} 物品`;
    } else {
        title = `给予 ${displayNames[0]} (${playerIds[0]}) 物品`;
    }

    const vNode = createVNode(Dialog, {
        modelValue: true,
        title: title,
        playerIds: playerIds,
        onClosed: () => {
            document.body.removeChild(container);
        },
    });
    render(vNode, container);
    document.body.appendChild(container);
};
