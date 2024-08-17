<template>
    <el-dialog title="绑定物品" draggable append-to-body align-center :close-on-click-modal="false" width="1000px">
        <div style="margin-bottom: 8px">
            <el-button type="primary" @click="handleAdd">添加物品</el-button>
            <el-button color="#626aef" @click="handleAddFromList">从清单添加物品</el-button>
            <el-button type="danger" @click="handleBatchDelete" :disabled="batchDeleteDisabled">批量删除</el-button>
        </div>
        <el-table :data="tableData" border height="calc(64vh)" highlight-current-row v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="42" />
            <!-- <el-table-column prop="id" label="Id" width="80px"> </el-table-column> -->
            <el-table-column label="图标" width="65px" class-name="table-icon-col">
                <template #default="{ row }">
                    <GameIcon :name="row.itemName" :size="40" />
                </template>
            </el-table-column>
            <el-table-column prop="itemName" label="物品名称" sortable show-overflow-tooltip> </el-table-column>
            <el-table-column prop="count" label="数量" sortable> </el-table-column>
            <el-table-column prop="quality" label="品质" sortable> </el-table-column>
            <el-table-column prop="durability" label="耐久度%" sortable> </el-table-column>
            <el-table-column prop="description" label="说明" sortable> </el-table-column>
            <el-table-column label="操作" align="center" width="120px">
                <template #default="{ row }">
                    <el-button type="danger" @click="handleDelete(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <AddOrEditItemList v-model="addOrEditItemListVisible" @on-confirm="handleAddConfirm" :is-add="true" />
        <ItemListSelector v-model="itemListSelectorVisible" @on-select="handleSelectItemList" :disabled-ids="tableData.map((i) => i.id)" />
    </el-dialog>
</template>

<script setup>
import { getItemById } from '~/api/item-list';

const props = defineProps({
    tableData: {
        type: Array,
    },
    loading: {
        type: Boolean,
    },
});

const emit = defineEmits(['update:tableData', 'onEdit']);
const { tableData } = useVModels(props, emit);

const batchDeleteDisabled = ref(true);
let multipleSelection = [];
const handleSelectionChange = (val) => {
    multipleSelection = val;
    batchDeleteDisabled.value = multipleSelection.length === 0;
};

const addOrEditItemListVisible = ref(false);
const handleAdd = () => {
    addOrEditItemListVisible.value = true;
};

const handleAddConfirm = async (id) => {
    const cmd = await getItemById(id);
    tableData.value.push(cmd);
    emit(
        'onEdit',
        tableData.value.map((i) => i.id)
    );
};

const itemListSelectorVisible = ref(false);
const handleAddFromList = () => {
    itemListSelectorVisible.value = true;
};

const handleSelectItemList = (rows) => {
    itemListSelectorVisible.value = false;
    const data = [...tableData.value, ...rows];
    emit(
        'onEdit',
        data.map((i) => i.id)
    );
    tableData.value = data;
};

const handleDelete = (row) => {
    const data = tableData.value.filter((i) => i.id !== row.id);
    emit(
        'onEdit',
        data.map((i) => i.id)
    );
    tableData.value = data;
};

const handleBatchDelete = () => {
    const ids = multipleSelection.map((i) => i.id);
    const data = tableData.value.filter((i) => !ids.includes(i.id));
    emit(
        'onEdit',
        data.map((i) => i.id)
    );
    tableData.value = data;
};
</script>
