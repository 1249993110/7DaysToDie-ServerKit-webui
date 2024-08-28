<template>
    <div class="container" @contextmenu.prevent="handleContextMenu" @mouseover="handleMouseover">
        <GameIcon :name="itemName" :size="size" :backgroundColor="backgroundColor"></GameIcon>
        <span v-if="quality < 0" class="count">{{ count }}</span>
        <span v-if="quality > 0" :style="style"></span>
        <span v-if="quality > 0" class="quality">{{ quality }}</span>
    </div>
</template>

<script setup>
import { showTooltip } from '~/components/SingletonTooltip/index.js';
import ContextMenu from '@imengyu/vue3-context-menu';
import { useZIndex } from 'element-plus';
import { removePlayerItems } from '~/api/inventories';
import { i18n } from '~/plugins/i18n';

const props = defineProps({
    size: {
        type: Number,
        default: 80,
    },
    itemName: {
        type: String,
    },
    localizationName: {
        type: String,
    },
    count: {
        type: Number,
        default: 0,
    },
    maxStackAllowed: {
        type: Number,
        default: 0,
    },
    quality: {
        type: Number,
        default: -1,
    },
    qualityColor: {
        type: String,
    },
    useTimes: {
        type: Number,
    },
    maxUseTimes: {
        type: Number,
    },
    isMod: {
        type: Boolean,
    },
    playerId: {
        type: String,
    },
    backgroundColor: {
        type: String,
    },
});

const style = computed(() => {
    const size = props.size;
    const durability = (1 - props.useTimes / props.maxUseTimes) * size;
    return {
        backgroundColor: `#${props.qualityColor}C8`,
        width: (durability > size ? size : durability) + 'px',
        height: (size * 2) / 10 + 'px',
        position: 'absolute',
        bottom: 0,
        left: 0,
    };
});

const sizePx = computed(() => {
    return props.size + 'px';
});

const { t } = i18n.global;
const handleMouseover = (event) => {
    const content = `
        ${t('components.gameIconEx.itemName')}: ${props.itemName}<br />
        ${t('components.gameIconEx.localizationName')}: ${props.localizationName}<br />
        ${t('components.gameIconEx.count')}: ${props.count}<br />
        ${t('components.gameIconEx.maxStackAllowed')}: ${props.maxStackAllowed}<br />
        ${t('components.gameIconEx.quality')}: ${props.quality}<br />
        ${t('components.gameIconEx.useTimes')}: ${props.useTimes}<br />
        ${t('components.gameIconEx.maxUseTimes')}: ${props.maxUseTimes}<br />
        ${t('components.gameIconEx.isMod')}: ${props.isMod ? t('global.true') : t('global.false')}<br />`;

    showTooltip({ trigger: event.target, content: content, rawContent: true });
};

const { copy } = useClipboard();
const handleContextMenu = (event) => {
    ContextMenu.showContextMenu({
        zIndex: useZIndex().nextZIndex(),
        x: event.x,
        y: event.y,
        theme: 'mac dark',
        items: [
            {
                label: t('components.gameIconEx.copyItemName'),
                onClick: async () => {
                    await copy(props.itemName);
                    ElMessage.success(t('global.message.copySuccess'));
                },
            },
            {
                label: t('components.gameIconEx.copyLocalizationName'),
                onClick: async () => {
                    await copy(props.localizationName);
                    ElMessage.success(t('global.message.copySuccess'));
                },
            },
            {
                label: t('components.gameIconEx.removeItem'),
                onClick: async () => {
                    if (await myconfirm(t('components.gameIconEx.removeItemConfirm', [ props.itemName ]))) {
                        const result = await removePlayerItems(props.playerId, props.itemName);
                        ElNotification({
                            title: t('global.message.cmdExecResult'),
                            type: 'info',
                            message: h('i', { style: 'color: teal' }, result[0]),
                        });
                    }
                },
                disabled: !props.playerId,
            },
        ],
    });
};
</script>

<style scoped lang="scss">
.container {
    position: relative;
    height: v-bind(sizePx);
    width: v-bind(sizePx);
    display: inline-block;
    margin: 1px;

    /*& + & {
        margin-left: 2px;
    }*/

    .count {
        color: white;
        font-size: 28px;
        line-height: 23px;
        position: absolute;
        right: 1px;
        bottom: 1px;
        text-shadow: 0 0 4px #32003c, 0 0 4px #32003c;
    }

    .quality {
        color: white;
        font-size: 28px;
        line-height: 23px;
        position: absolute;
        left: calc(50% - 7px);
        bottom: 1px;
        text-shadow: 0 0 4px #32003c, 0 0 4px #32003c;
    }
}
</style>
