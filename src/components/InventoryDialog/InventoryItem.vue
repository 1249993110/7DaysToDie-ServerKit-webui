<template>
    <div class="image-container" v-if="item" @contextmenu.prevent="handleContextMenu" @mouseover="handleMouseover(item, $event)" @mouseleave="handleMouseleave">
        <el-image :src="getIconUrl(item.itemName)" class="image" lazy></el-image>
        <span v-if="item.quality === -1" class="inventory-item-count">{{ item.count }}</span>
        <span v-else :style="getQualityStyle(item)" class="inventory-item-quality"></span>
    </div>
</template>

<script setup>
import ContextMenu from '@imengyu/vue3-context-menu';
import { useZIndex } from 'element-plus';
import { showTooltip, closeTooltip } from '~/components/SingletonTooltip/index.js';
import { useGameLocalizationStore } from '~/store/game-localization';
import { removePlayerItems } from '~/api/inventories';
import myconfirm from '~/utils/myconfirm';
import { getIconUrl } from '~/utils/image-helper';

const props = defineProps({
    item: {
        type: Object,
    },
    playerId: {
        type: String,
    },
    removeItemsDisabled: {
        type: Boolean,
        default: false,
    },
});

const gameLocalizationStore = useGameLocalizationStore();

const getQualityStyle = (item) => {
    const durability = (1 - item.useTimes / item.maxUseTimes) * 80;
    return { backgroundColor: `#${item.qualityColor}C8`, width: (durability > 80 ? 80 : durability) + 'px' };
};

const { copy } = useClipboard();
const handleContextMenu = (event) => {
    const item = props.item;
    ContextMenu.showContextMenu({
        zIndex: useZIndex().currentZIndex.value,
        x: event.x,
        y: event.y,
        theme: 'default dark',
        items: [
            {
                label: '复制物品名称',
                onClick: async () => {
                    await copy(item.itemName);
                    ElMessage.success('复制成功');
                },
            },
            {
                label: '复制物品图标',
                onClick: async () => {
                    await copy(item.iconName);
                    ElMessage.success('复制成功');
                },
            },
            {
                label: '复制物品图标颜色',
                onClick: async () => {
                    await copy(item.iconColor);
                    ElMessage.success('复制成功');
                },
            },
            {
                label: '移除选中物品',
                onClick: async () => {
                    if (await myconfirm(`确定从玩家的背包和腰带中移除所有的'${gameLocalizationStore.dict[item.itemName]}'吗?`)) {
                        const result = await removePlayerItems(props.playerId, item.itemName);
                        ElNotification({
                            title: '命令执行结果',
                            type: 'info',
                            message: h('i', { style: 'color: teal' }, result[0]),
                        });
                    }
                },
                disabled: props.removeItemsDisabled,
            },
        ],
    });
};

const handleMouseover = (item, event) => {
    const content = `
        名称: ${item.itemName}<br />
        本地化名称: ${gameLocalizationStore.dict[item.itemName]}<br />
        数量: ${item.count}<br />
        质量: ${item.quality}<br />
        图标: ${item.iconName}<br />
        图标颜色: ${item.iconColor}<br />
        最大使用时长: ${item.maxUseTimes}<br />
        使用时长: ${item.useTimes}<br />`;

    showTooltip({ virtualRef: event.target, content: content });
};
const handleMouseleave = () => {
    closeTooltip();
};

onUnmounted(closeTooltip);
</script>

<style scoped lang="scss">
.image-container {
    margin: 1px;
    position: relative;
    height: 80px;
    width: 80px;

    .image {
        display: block;
        height: 100%;
        width: 100%;
        background-color: rgba(96, 96, 96, 0.5);
        border-radius: 2px;
    }

    .inventory-item-count {
        color: lightgreen;
        font-size: 20px;
        position: absolute;
        right: 1px;
        bottom: 1px;
    }

    .inventory-item-quality {
        height: 16px;
        position: absolute;
        bottom: 0;
    }
}
</style>
