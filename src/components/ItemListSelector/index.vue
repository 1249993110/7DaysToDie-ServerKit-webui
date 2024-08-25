<template>
    <el-dialog title="从清单选择物品" draggable append-to-body align-center :close-on-click-modal="false" width="800px" @open="handleOpen">
        <div style="margin-bottom: 8px;">
            <el-input v-model="searchModel.keyword" :placeholder="t('global.message.inputText')" clearable autofocus style="width: 200px"></el-input>
            <el-button :icon="Search" @click="getData" type="primary" style="margin-left: 8px">查 询</el-button>
            <el-button @click="handleBatchSelect" color="#40e0d0" :disabled="batchSelectDisabled">批量选择</el-button>
        </div>
        <el-table :data="tableData" border height="calc(50vh)" highlight-current-row v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="42" :selectable="checkSelectable" />
            <el-table-column prop="id" label="Id" width="60px"> </el-table-column>
            <el-table-column label="图标" width="65px" class-name="table-icon-col">
                <template #default="{ row }">
                    <GameIcon :name="row.itemName" :size="40" />
                </template>
            </el-table-column>
            <el-table-column prop="itemName" label="物品名称" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="count" label="数量" width="60px"> </el-table-column>
            <el-table-column prop="quality" label="品质" width="60px"> </el-table-column>
            <el-table-column prop="durability" label="耐久度%" width="85px"> </el-table-column>
            <el-table-column prop="description" label="说明"> </el-table-column>
            <el-table-column label="选择" align="center" width="100px">
                <template #default="{ row }">
                    <el-button color="#40e0d0" @click="handleSelect(row)" :disabled="checkDisabled(row.id)">选择</el-button>
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
import { getItemListPaged } from '~/api/item-list';
import { Search } from '@element-plus/icons-vue';

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

const getData = async () => {
    try {
        loading.value = true;
        const data = await getItemListPaged(searchModel);
        tableData.value = data.items;
        total.value = data.total;
    } finally {
        loading.value = false;
    }
};

const handleOpen = async () => {
    await getData();
};

const emit = defineEmits(['onSelect']);
const handleSelect = (row) => {
    emit('onSelect', [row]);
};

const batchSelectDisabled = ref(true);
let multipleSelection = [];
const handleSelectionChange = (val) => {
    multipleSelection = val;
    batchSelectDisabled.value = multipleSelection.length === 0;
};

const handleBatchSelect = () => {
    emit('onSelect', multipleSelection);
};
</script>

<style scoped lang="scss"></style>
