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

const handleMouseover = (event) => {
    const content = `
        名称: ${props.itemName}<br />
        本地化名称: ${props.localizationName}<br />
        数量: ${props.count}<br />
        最大堆叠数量: ${props.maxStackAllowed}<br />
        质量: ${props.quality}<br />
        使用时长: ${props.useTimes}<br />
        最大使用时长: ${props.maxUseTimes}<br />
        模组: ${props.isMod ? '是' : '否'}`;

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
                label: '复制物品名称',
                onClick: async () => {
                    await copy(props.itemName);
                    ElMessage.success('复制成功');
                },
            },
            {
                label: '复制本地化名称',
                onClick: async () => {
                    await copy(props.localizationName);
                    ElMessage.success('复制成功');
                },
            },
            {
                label: '移除选中物品',
                onClick: async () => {
                    if (await myconfirm(`确定从玩家的背包和腰带中移除所有的'${props.localizationName}'吗?`)) {
                        const result = await removePlayerItems(props.playerId, props.itemName);
                        ElNotification({
                            title: '命令执行结果',
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
