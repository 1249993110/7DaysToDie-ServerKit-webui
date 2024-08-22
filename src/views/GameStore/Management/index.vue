<template>
    <div class="store-management">
        <RouterButton :names="['gameStore.settings', 'gameStore.management']"></RouterButton>
        <MyTableEx
            style="margin-top: 20px"
            :show-export-btn="false"
            :show-searcher="false"
            :show-table-index="false"
            :show-pager="false"
            :get-data="getData"
            :table-data="tableData"
            :show-add-btn="true"
            :show-edit-btn="true"
            :delete="deleteRequest"
            :batch-delete="batchDeleteRequest"
            :add-or-edit-component="AddOrEditGoods"
            :addOrEditComponentProps="addOrEditComponentProps"
        >
            <template #columns>
                <el-table-column prop="id" label="商品Id" width="120px" sortable> </el-table-column>
                <el-table-column prop="name" label="商品名称" sortable show-overflow-tooltip> </el-table-column>
                <el-table-column prop="price" label="售价" width="120px" sortable> </el-table-column>
                <el-table-column prop="description" label="说明" show-overflow-tooltip> </el-table-column>
                <el-table-column label="绑定" :width="200" header-align="center" show-overflow-tooltip>
                    <template #default="{ row }">
                        <el-button size="small" color="#40e0d0" @click="handleAssociatedItem(row)">绑定物品</el-button>
                        <el-button size="small" color="#8a2be2" @click="handleAssociatedCommand(row)">绑定命令</el-button>
                    </template>
                </el-table-column>
            </template>
        </MyTableEx>
        <AssociatedItems v-model="associatedItemsVisible" v-model:table-data="associatedData" :loading="associatedLoading" @on-edit="handleItemsEdit" />
        <AssociatedCommands v-model="associatedCommandsVisible" v-model:table-data="associatedData" :loading="associatedLoading" @on-edit="handleCommandsEdit" />
    </div>
</template>

<script>
export default {
    name: 'gameStore.management',
};
</script>

<script setup>
import * as api from '~/api/goods.js';
import AddOrEditGoods from './AddOrEditGoods.vue';

const tableData = ref([]);

const addOrEditComponentProps = ref({});

const getData = async () => {
    const data = await api.getGoods();
    if (data.length) {
        addOrEditComponentProps.value = { id: data[data.length - 1].id + 1 };
    }

    tableData.value = data;
};

const deleteRequest = async (row) => {
    return await api.deleteGoodsByIds([row.id]);
};

const batchDeleteRequest = async (rows) => {
    return await api.deleteGoodsByIds(rows.map((i) => i.id));
};

const lastClickId = ref(0);

const associatedItemsVisible = ref(false);
const associatedCommandsVisible = ref(false);
const associatedData = ref([]);
const associatedLoading = ref(false);

const handleAssociatedItem = async (row) => {
    associatedItemsVisible.value = true;
    lastClickId.value = row.id;
    try {
        associatedLoading.value = true;
        const data = await api.getItemList(row.id);
        associatedData.value = data;
    } finally {
        associatedLoading.value = false;
    }
};

const handleItemsEdit = async (ids) => {
    await api.updateItemList(lastClickId.value, ids);
};

const handleAssociatedCommand = async (row) => {
    associatedCommandsVisible.value = true;
    lastClickId.value = row.id;
    try {
        associatedLoading.value = true;
        const data = await api.getCommandList(row.id);
        associatedData.value = data;
    } finally {
        associatedLoading.value = false;
    }
};

const handleCommandsEdit = async (ids) => {
    await api.updateCommandList(lastClickId.value, ids);
};
</script>

<style lang="scss"></style>
