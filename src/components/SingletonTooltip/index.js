import { ElTooltip } from 'element-plus';
import { createVNode, render } from 'vue';
import { promiseTimeout, useDebounceFn } from '@vueuse/core';

const container = document.createElement('div');
document.body.appendChild(container);
let trigger;
let mouseInTrigger;
let mouseInPopper;

const dispose = () => {
    if (mouseInTrigger) {
        mouseInTrigger.stop();
        mouseInTrigger = null;
    }
    if (mouseInPopper) {
        mouseInPopper.stop();
        mouseInPopper = null;
    }
    render(null, container);
    trigger = null;
};

const checkTouch = useDebounceFn(async () => {
    //await promiseTimeout(100);

    if (!trigger) {
        return;
    }

    if (!trigger.checkVisibility()) {
        dispose();
        return;
    }

    if (!mouseInTrigger.isOutside.value || !mouseInPopper.isOutside.value) {
        checkTouch();
        return;
    }

    dispose();
}, 100);

export const showTooltip = useDebounceFn(async (props) => {
    trigger = props.trigger;
    if (!trigger.checkVisibility()) {
        return;
    }

    const vNode = createVNode(ElTooltip, {
        appendTo: container,
        virtualTriggering: true,
        virtualRef: trigger,
        visible: true,
        effect: props.effect,
        content: props.content,
        placement: props.placement || 'right-end',
        showArrow: props.showArrow,
        rawContent: props.rawContent,
        offset: 0,
    });

    if (props.showAfter) {
        await promiseTimeout(props.showAfter);
    }

    render(vNode, container);
    await nextTick();
    mouseInTrigger = useMouseInElement(trigger);
    mouseInPopper = useMouseInElement(container.firstElementChild);

    checkTouch(); // do not await
}, 100);
