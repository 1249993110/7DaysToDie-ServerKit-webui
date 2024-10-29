<template>
    <el-dialog :title="t('components.itemBlockSelector.title')" draggable append-to-body align-center :close-on-click-modal="false" width="1000px">
        <el-table :data="tableData" border height="calc(60vh)" highlight-current-row v-loading="loading" size="small">
            <el-table-column prop="id" :label="t('components.itemBlockSelector.id')" width="80px" show-overflow-tooltip align="center" />
            <el-table-column :label="t('components.itemBlockSelector.icon')" width="100px" class-name="table-icon-col">
                <template #default="{ row }">
                    <GameIcon :name="row.itemName" :size="80" />
                </template>
            </el-table-column>
            <el-table-column prop="itemName" :label="t('components.itemBlockSelector.itemName')" show-overflow-tooltip />
            <el-table-column prop="localizationName" :label="t('components.itemBlockSelector.localizationName')" show-overflow-tooltip />
            <el-table-column prop="maxStackAllowed" :label="t('components.itemBlockSelector.maxStackAllowed')" width="130px" />
            <el-table-column align="center" width="200px">
                <template #header>
                    <el-input
                        v-model="searchModel.keyword"
                        :placeholder="t('global.button.search')"
                        clearable
                        style="width: calc(100% - 32px)"
                        @keyup.enter="getTableData"
                        @blur="
                            () => {
                                searchModel.keyword = searchModel.keyword.trim();
                            }
                        "
                        :validate-event="false"
                    />
                    <el-button :icon="Search" circle @click="getTableData" />
                </template>
                <template #default="{ row }">
                    <el-button type="primary" @click="handleSelect(row)">{{ t('global.button.select') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 10px"
            background
            @size-change="getTableData"
            @current-change="getTableData"
            :page-sizes="[5, 10, 20, 50, 100]"
            v-model:current-page="searchModel.pageNumber"
            v-model:page-size="searchModel.pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
        />
    </el-dialog>
</template>

<script setup>
import { getItemBlocks } from '~/api/item-blocks';
import { Search } from '@element-plus/icons-vue';
import { i18n } from '~/plugins/i18n';

const { t } = i18n.global;
const localeStore = useLocaleStore();

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);

const searchModel = reactive({
    pageNumber: 1,
    pageSize: 10,
    keyword: '',
    itemBlockKind: 0,
    showUserHidden: true,
});

const getTableData = async () => {
    loading.value = true;
    try {
        const data = await getItemBlocks({ ...searchModel, language: localeStore.getLanguage() });
        tableData.value = data.items;
        total.value = data.total;
    } finally {
        loading.value = false;
    }
};

getTableData();

const emit = defineEmits(['select']);
const handleSelect = (row) => {
    emit('select', row);
};
</script>
