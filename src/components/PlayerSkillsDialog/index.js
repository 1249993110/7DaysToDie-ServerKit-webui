import Dialog from './index.vue';
import { createVNode, render } from 'vue';

export const showPlayerSkills = async (playerId, playerName) => {
    const container = document.createElement('div');
    const vNode = createVNode(Dialog, {
        modelValue: true,
        title: `玩家: ${playerName} (${playerId}) 的技能`,
        playerId: playerId,
        onClosed: () => {
            document.body.removeChild(container);
        },
    });
    render(vNode, container);
    document.body.appendChild(container);
};
