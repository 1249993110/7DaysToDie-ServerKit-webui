<template>
    <div class="item-blocks">
        <el-card shadow="always">
            <div class="search-container">
                <el-checkbox v-model="itemsChecked" :label="t('views.itemBlocks.item')" />
                <el-checkbox v-model="blocksChecked" :label="t('views.itemBlocks.block')" />
                <el-checkbox v-model="devItemsChecked" :label="t('views.itemBlocks.devItem')" />
                <el-input class="input" v-model="searchModel.keyword" placeholder clearable @keyup.enter.native="search"></el-input>
                <el-button class="button" type="primary" @click="search">{{ t('global.button.search') }}</el-button>
            </div>
            <div class="items-container">
                <el-scrollbar always>
                    <div class="scroll-area" v-infinite-scroll="load">
                        <el-image class="image" v-for="(item, index) in items" :key="index" :src="item.url" lazy @mouseover="handleMouseover(item, $event)" />
                        <el-empty :image-size="200" v-if="items.length === 0" style="width: 100%" />
                    </div>
                </el-scrollbar>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'itemBlocks',
};
</script>

<script setup>
import { getItemBlocks } from '~/api/item-blocks';
import { showTooltip } from '~/components/SingletonTooltip/index.js';
import { getItemIconUrl } from '~/utils/imageHelper';

const { t } = useI18n();
const localeStore = useLocaleStore();

const items = reactive([]);
const itemsChecked = ref(true);
const blocksChecked = ref(false);
const devItemsChecked = ref(false);

const searchModel = reactive({
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
            searchModel.itemBlockKind = 0;
        } else if (itemsChecked.value && !blocksChecked.value) {
            searchModel.itemBlockKind = 1;
        } else if (!itemsChecked.value && blocksChecked.value) {
            searchModel.itemBlockKind = 2;
        } else {
            ElMessage.info(t('global.formRule.selectAtLeastOne'));
            return;
        }

        searchModel.showUserHidden = devItemsChecked.value;

        const data = (await getItemBlocks({ ...searchModel, language: localeStore.getLanguage() })).items;
        const len = data.length;
        if (len === 0) {
            ElMessage.success(t('global.message.noMoreData'));
            return;
        }

        for (let i = 0; i < len; i++) {
            const item = data[i];
            item.url = getItemIconUrl(item.itemName);
            items.push(item);
        }
    } finally {
        loading.close();
    }
};

const search = () => {
    items.length = 0;
    searchModel.pageNumber = 1;
    getData();
};

watch([itemsChecked, blocksChecked, devItemsChecked], search);

const load = async () => {
    searchModel.pageNumber += 1;
    await getData();
};

const handleMouseover = (item, event) => {
    const content = `
        ${item.isBlock ? t('views.itemBlocks.block') : t('views.itemBlocks.item')} ID: ${item.id}<br />
        ${t('views.itemBlocks.itemName')}: ${item.itemName}<br />
        ${t('views.itemBlocks.localizationName')}: ${item.localizationName}<br />
        ${t('views.itemBlocks.iconName')}: ${item.iconName}<br />
        ${t('views.itemBlocks.iconColor')}: ${item.iconColor}<br />
        ${t('views.itemBlocks.maxStackAllowed')}: ${item.maxStackAllowed}<br />`;

    showTooltip({ trigger: event.target, content: content, rawContent: true });
};
</script>

<style scoped lang="scss">
.item-blocks {
    height: calc(100vh - 90px);
    .el-card {
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
