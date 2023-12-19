import { ElTooltip } from 'element-plus';
import { createVNode, render } from 'vue';
import { promiseTimeout } from '@vueuse/core';

const container = document.createElement('div');
document.body.appendChild(container);
let mouseInPopper;
let mouseInVirtual;

export const closeTooltip = async () => {
    await promiseTimeout(200);

    if (!mouseInVirtual.isOutside.value) {
        return;
    }

    if (!mouseInPopper.isOutside.value) {
        await closeTooltip();
        return;
    }

    render(null, container);
};

export const showTooltip = async (props) => {
    const vNode = createVNode(ElTooltip, {
        appendTo: container,
        virtualTriggering: true,
        virtualRef: props.virtualRef,
        visible: true,
        content: props.content,
        placement: props.placement || 'bottom-start',
        showArrow: props.showArrow || true,
        rawContent: props.rawContent || true,
        enterable: props.enterable || true,
        offset: props.offset || 2,
        showAfter: props.showAfter || 0,
    });

    render(vNode, container);
    await nextTick();

    mouseInPopper = useMouseInElement(container.firstElementChild);
    mouseInVirtual = useMouseInElement(props.virtualRef);
};
