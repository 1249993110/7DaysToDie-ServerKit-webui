<template>
    <el-dialog title="绑定命令" draggable append-to-body align-center :close-on-click-modal="false" width="1000px">
        <div style="margin-bottom: 8px">
            <el-button type="primary" @click="handleAdd">添加命令</el-button>
            <el-button color="#626aef" @click="handleAddFromList">从清单添加命令</el-button>
            <el-button type="danger" @click="handleBatchDelete" :disabled="batchDeleteDisabled">批量删除</el-button>
        </div>
        <el-table :data="tableData" border height="calc(64vh)" highlight-current-row v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="42" />
            <!-- <el-table-column prop="id" label="Id" width="80px"> </el-table-column> -->
            <el-table-column prop="command" label="命令" show-overflow-tooltip> </el-table-column>
            <el-table-column label="在主线程执行" width="140px" sortable>
                <template #default="{ row }">
                    {{ `${row.inMainThread ? t('global.true') : t('global.false')}` }}
                </template>
            </el-table-column>
            <el-table-column prop="description" label="说明" sortable> </el-table-column>
            <el-table-column label="操作" align="center" width="120px">
                <template #default="{ row }">
                    <el-button type="danger" @click="handleDelete(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <AddOrEditCommandList v-model="addOrEditCommandListVisible" @on-confirm="handleAddConfirm" :is-add="true" />
        <CommandListSelector v-model="commandListSelectorVisible" @on-select="handleSelectCommandList" :disabled-ids="tableData.map((i) => i.id)" />
    </el-dialog>
</template>

<script setup>
import { getCommandById } from '~/api/command-list';

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

const addOrEditCommandListVisible = ref(false);
const handleAdd = () => {
    addOrEditCommandListVisible.value = true;
};

const handleAddConfirm = async (id) => {
    const cmd = await getCommandById(id);
    tableData.value.push(cmd);
    emit(
        'onEdit',
        tableData.value.map((i) => i.id)
    );
};

const commandListSelectorVisible = ref(false);
const handleAddFromList = () => {
    commandListSelectorVisible.value = true;
};

const handleSelectCommandList = (rows) => {
    commandListSelectorVisible.value = false;
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
