import Dialog from './index.vue';
import { createVNode, render } from 'vue';

export const showPlayerDetails = async (data) => {
    const container = document.createElement('div');
    const vNode = createVNode(Dialog, {
        modelValue: true,
        data: data,
        onClosed: () => {
            document.body.removeChild(container);
        },
    });
    render(vNode, container);
    document.body.appendChild(container);
};
