import Dialog from './index.vue';
import { createVNode, render } from 'vue';
import { i18n } from '~/plugins/i18n';

export const showPlayerSkills = async (playerId, playerName) => {
    const container = document.createElement('div');
    const vNode = createVNode(Dialog, {
        title: i18n.global.t('components.playerSkillsDialog.title', [`${playerName} (${playerId})`]),
        modelValue: true,
        playerId: playerId,
        onClosed: () => {
            document.body.removeChild(container);
        },
    });
    render(vNode, container);
    document.body.appendChild(container);
};
