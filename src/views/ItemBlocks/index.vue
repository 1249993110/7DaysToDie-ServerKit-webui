<template>
    <div class="item-blocks">
        <el-card shadow="always">
            <div class="search-container">
                <el-checkbox v-model="itemsChecked" label="物品" />
                <el-checkbox v-model="blocksChecked" label="方块" />
                <el-checkbox v-model="devItemsChecked" label="开发(对用户隐藏的类型)" />
                <el-input class="input" v-model="queryParams.keyword" placeholder clearable @keyup.enter.native="search"></el-input>
                <el-button class="button" type="primary" @click="search">
                    搜 索
                </el-button>
            </div>
            <div class="items-container">
                <el-scrollbar always>
                    <div class="scroll-area" v-infinite-scroll="load">
                        <el-image
                            class="image"
                            v-for="(item, index) in items"
                            :key="index"
                            :src="item.url"
                            lazy
                            @mouseover="handleMouseover(item, $event)"
                            @mouseleave="handleMouseleave"
                        />
                        <el-empty :image-size="200" v-if="items.length === 0" style="width: 100%" />
                    </div>
                </el-scrollbar>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'ItemBlocks',
};
</script>

<script setup>
import { getItemBlocks } from '~/api/item-blocks';
import { showTooltip, closeTooltip } from '~/components/SingletonTooltip/index.js';

const items = reactive([]);
const itemsChecked = ref(true);
const blocksChecked = ref(true);
const devItemsChecked = ref(false);

const getIconUrl = (item) => {
    let itemName = item.itemIcon;
    if (item.iconColor !== 'FFFFFF') {
        itemName += '__' + item.iconColor;
    }

    return import.meta.env.VITE_APP_API_BASE_URL + 'ItemIcons/' + itemName + '.png';
};

const queryParams = reactive({
    pageNumber: 0,
    pageSize: 50,
    keyword: '',
    itemBlockKind: 0,
    showUserHidden: false,
});

const getData = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    });

    try {
        if (itemsChecked.value && blocksChecked.value) {
            queryParams.itemBlockKind = 0;
        } else if (itemsChecked.value && !blocksChecked.value) {
            queryParams.itemBlockKind = 1;
        } else if (!itemsChecked.value && blocksChecked.value) {
            queryParams.itemBlockKind = 2;
        } else {
            ElMessage.info('您必须至少选中一个种类');
            return;
        }

        queryParams.showUserHidden = devItemsChecked.value;

        const data = (await getItemBlocks(queryParams)).items;
        const len = data.length;
        if (len === 0) {
            ElMessage.success('没有更多数据了');
            return;
        }

        for (let i = 0; i < len; i++) {
            const item = data[i];
            item.url = getIconUrl(item);
            items.push(item);
        }
    } finally {
        loading.close();
    }
};

const search = () => {
    items.length = 0;
    queryParams.pageNumber = 1;
    getData();
};

watch([itemsChecked, blocksChecked, devItemsChecked], search);

const load = async () => {
    queryParams.pageNumber += 1;
    await getData();
};

const handleMouseover = (item, event) => {
    const content = `
        ${item.isBlock ? '方块' : '物品'}ID: ${item.id}<br />
        名称: ${item.itemName}<br />
        本地化名称: ${item.localizationName}<br />
        图标: ${item.itemIcon}<br />
        图标颜色: ${item.iconColor}<br />
        最大堆叠数量: ${item.maxStackAllowed}<br />`;

    showTooltip({ virtualRef: event.target, content: content, placement: 'right-end' });
};
const handleMouseleave = () => {
    closeTooltip();
};
</script>

<style scoped lang="scss">
.item-blocks {
    height: calc(100vh - 90px);
    .el-card {
        background-color: #ffffffaf;
        height: 100%;
        :deep(.el-card__body) {
            height: calc(100% - 40px);
        }
    }

    .search-container {
        margin-left: auto;
        display: flex;
        .input {
            margin-left: 8px;
            width: 400px;
        }
        .button {
            margin-left: 8px;
        }
    }

    .items-container {
        height: calc(100% - 48px);
        margin-top: 8px;

        .scroll-area {
            display: flex;
            flex-wrap: wrap;

            .image {
                margin: 1px;
                display: block;
                height: 160px;
                width: 160px;
                background-color: rgba(96, 96, 96, 0.5);
                border-radius: 2px;
            }
        }
    }
}
</style>
