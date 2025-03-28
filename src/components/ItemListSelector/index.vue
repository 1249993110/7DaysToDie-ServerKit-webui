<template>
    <el-dialog :title="t('components.itemListSelector.title')" draggable append-to-body align-center :close-on-click-modal="false" width="800px" @open="handleOpen">
        <div style="margin-bottom: 8px;">
            <el-input v-model="searchModel.keyword" :placeholder="t('global.message.inputText')" clearable autofocus style="width: 200px"></el-input>
            <el-button :icon="Search" @click="getTableData" type="primary" style="margin-left: 8px">{{ t('global.button.search') }}</el-button>
            <el-button @click="handleBatchSelect" color="#40e0d0" :disabled="batchSelectDisabled">{{ t('global.button.batchSelect') }}</el-button>
        </div>
        <el-table :data="tableData" border height="calc(50vh)" highlight-current-row v-loading="loading" @selection-change="handleSelectionChange" size="small">
            <el-table-column type="selection" width="42" :selectable="checkSelectable" align="center" />
            <el-table-column prop="id" :label="t('views.listManagement.tableHeader.id')" width="60px" align="center" />
            <el-table-column :label="t('views.listManagement.tableHeader.icon')" width="60px" class-name="table-icon-col">
                <template #default="{ row }">
                    <GameIcon :name="row.itemName" :size="40" />
                </template>
            </el-table-column>
            <el-table-column prop="itemName" :label="t('views.listManagement.tableHeader.itemName')" show-overflow-tooltip />
            <el-table-column prop="count" :label="t('views.listManagement.tableHeader.count')" width="60px" />
            <el-table-column prop="quality" :label="t('views.listManagement.tableHeader.quality')" width="60px" />
            <el-table-column prop="durability" :label="t('views.listManagement.tableHeader.durability')" width="75px" />
            <el-table-column prop="description" :label="t('views.listManagement.tableHeader.description')" show-overflow-tooltip />
            <el-table-column :label="t('global.button.select')" align="center" width="100px">
                <template #default="{ row }">
                    <el-button color="#40e0d0" @click="handleSelect(row)" :disabled="checkDisabled(row.id)">{{t('global.button.select')}}</el-button>
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
        >
        </el-pagination>
    </el-dialog>
</template>

<script setup>
import { getItemListPaged } from '~/api/item-list';
import { Search } from '@element-plus/icons-vue';
import { i18n } from '~/plugins/i18n';
const { t } = i18n.global;
const props = defineProps({
    disabledIds: {
        type: Array,
    },
});

const checkDisabled = (id) => {
    return props.disabledIds.some((_id) => id === _id);
};
const checkSelectable = (row) => {
    return !checkDisabled(row.id);
};

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);

const searchModel = reactive({
    pageNumber: 1,
    pageSize: 20,
    keyword: '',
});

const getTableData = async () => {
    loading.value = true;
    try {
        const data = await getItemListPaged(searchModel);
        tableData.value = data.items;
        total.value = data.total;
    } finally {
        loading.value = false;
    }
};

const handleOpen = async () => {
    await getTableData();
};

const emit = defineEmits(['select']);
const handleSelect = (row) => {
    emit('select', [row]);
};

const batchSelectDisabled = ref(true);
let multipleSelection = [];
const handleSelectionChange = (val) => {
    multipleSelection = val;
    batchSelectDisabled.value = multipleSelection.length === 0;
};

const handleBatchSelect = () => {
    emit('select', multipleSelection);
};
</script>

