<template>
    <el-dialog :title="t('components.itemBlockSelector.title')" draggable append-to-body align-center :close-on-click-modal="false" width="1000px">
        <el-table :data="tableData" border height="calc(64vh)" highlight-current-row v-loading="loading">
            <el-table-column prop="id" :label="t('components.itemBlockSelector.id')" width="80px"> </el-table-column>
            <el-table-column :label="t('components.itemBlockSelector.icon')" width="120px" class-name="table-icon-col">
                <template #default="{ row }">
                    <GameIcon :name="row.itemName" />
                </template>
            </el-table-column>
            <el-table-column prop="itemName" :label="t('components.itemBlockSelector.itemName')" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="localizationName" :label="t('components.itemBlockSelector.localizationName')" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="maxStackAllowed" :label="t('components.itemBlockSelector.maxStackAllowed')" width="120px"> </el-table-column>
            <el-table-column align="center" width="200px">
                <template #header>
                    <el-input
                        v-model="searchModel.keyword"
                        :placeholder="t('global.button.search')"
                        clearable
                        style="width: calc(100% - 32px)"
                        @keyup.enter="getData"
                        :validate-event="false"
                    />
                    <el-button :icon="Search" circle @click="getData" />
                </template>
                <template #default="{ row }">
                    <el-button type="primary" @click="handleSelect(row)">{{ t('global.button.select') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 10px"
            background
            @size-change="getData"
            @current-change="getData"
            :page-sizes="[5, 10, 20, 50, 100]"
            v-model:current-page="searchModel.pageNumber"
            v-model:page-size="searchModel.pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
    </el-dialog>
</template>

<script setup>
import { getItemBlocks } from '~/api/item-blocks';
import { Search } from '@element-plus/icons-vue';
import { i18n } from '~/plugins/i18n';
const { t } = i18n.global;

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);

const searchModel = reactive({
    pageNumber: 1,
    pageSize: 20,
    keyword: '',
    itemBlockKind: 0,
    showUserHidden: true,
});

const getData = async () => {
    try {
        loading.value = true;
        const data = await getItemBlocks(searchModel);
        tableData.value = data.items;
        total.value = data.total;
    } finally {
        loading.value = false;
    }
};

getData();

const emit = defineEmits(['onSelect']);
const handleSelect = (row) => {
    emit('onSelect', row);
};
</script>

<style scoped lang="scss"></style>
