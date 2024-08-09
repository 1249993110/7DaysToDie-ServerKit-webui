import Dialog from './index.vue';
import { createVNode, render } from 'vue';

export const batchBan = async (playerIds, displayNames) => {
    const container = document.createElement('div');

    let title = '';
    if (playerIds.length > 1) {
        title = `封禁: ${displayNames.join(', ')}`;
    } else {
        title = `封禁: ${playerIds[0]} (${displayNames[0]})`;
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
