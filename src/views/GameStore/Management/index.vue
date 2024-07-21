<template>
    <div class="store-management">
        <RouterButton
            :buttons="[
                {
                    value: '商店配置',
                    path: '/game-store/settings',
                },
                {
                    value: '商店管理',
                    path: '/game-store/management',
                },
                {
                    value: '高级商店',
                    path: '/game-store/advance',
                },
            ]"
        >
        </RouterButton>
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
                        <el-button size="small" color="#40E0D0" @click="handleEdit(row)">绑定物品</el-button>
                        <el-button size="small" color="#8a2be2" @click="handleDelete(row)">绑定命令</el-button>
                    </template>
                </el-table-column>
            </template>
        </MyTableEx>
        <AssociatedItems v-model="associatedItemsVisible" v-model:table-data="associatedItemsData" :loading="associatedItemsLoading" @on-edit="handleItemsEdit" />
    </div>
</template>

<script>
export default {
    name: 'GameStore.Management',
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

const associatedItemsVisible = ref(false);
const associatedItemsData = ref([]);
const associatedItemsLoading = ref(false);

const lastClickId = ref(0);
const handleEdit = async (row) => {
    associatedItemsVisible.value = true;
    lastClickId.value = row.id;
    try {
        associatedItemsLoading.value = true;
        const data = await api.getItemList(row.id);
        associatedItemsData.value = data;
    } finally {
        associatedItemsLoading.value = false;
    }
};

const handleItemsEdit = async (ids) => {
    await api.updateItemList(lastClickId.value, ids);
};
</script>

<style lang="scss"></style>
