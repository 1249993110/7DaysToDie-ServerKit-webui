<template>
    <div>
        <RouterButton
            :buttons="[
                {
                    value: '物品清单',
                    path: '/list-management/item-list',
                },
                {
                    value: '命令清单',
                    path: '/list-management/command-list',
                },
            ]"
        >
        </RouterButton>
        <MyTableEx
            style="margin-top: 20px"
            :show-export-btn="false"
            :search-form-model="searchFormModel"
            :get-data="getData"
            :table-data="tableData"
            :total="total"
            :show-add-btn="true"
            :show-edit-btn="true"
            :show-table-index="false"
            :delete="deleteRequest"
            :batch-delete="batchDeleteRequest"
            :add-or-edit-component="AddOrEditItemList"
        >
            <template #searchFormItems>
                <el-form-item label="关键词" prop="keyword">
                    <el-input v-model="searchFormModel.keyword" style="width: 400px" placeholder="请输入内容" clearable autofocus></el-input>
                </el-form-item>
            </template>
            <template #columns>
                <el-table-column prop="id" label="Id" sortable width="80px"></el-table-column>
                <el-table-column label="图标" width="120px" class-name="table-icon-col">
                    <template #default="{ row }">
                        <GameIcon :name="row.itemName" :size="40"/>
                    </template>
                </el-table-column>
                <el-table-column prop="itemName" label="物品名称" sortable></el-table-column>
                <el-table-column prop="count" label="数量" sortable></el-table-column>
                <el-table-column prop="quality" label="品质" sortable></el-table-column>
                <el-table-column prop="durability" label="耐久度%" sortable width="120px"></el-table-column>
                <el-table-column prop="description" label="说明" sortable></el-table-column>
                <el-table-column prop="createdAt" label="创建日期" sortable></el-table-column>
            </template>
        </MyTableEx>
    </div>
</template>

<script>
export default {
    name: 'ListManagement.ItemList',
};
</script>

<script setup>
import * as api from '~/api/item-list.js';
import AddOrEditItemList from '~/components/AddOrEditItemList/index.vue';

const searchFormModel = reactive({
    keyword: '',
});

const tableData = ref([]);
const total = ref(0);

const getData = async (pagination) => {
    const data = await api.getItemListPaged({ ...pagination, ...searchFormModel });
    tableData.value = data.items;
    total.value = data.total;
};

const deleteRequest = async (row) => {
    return await api.deleteItemByIds([row.id]);
};

const batchDeleteRequest = async (rows) => {
    return await api.deleteItemByIds(rows.map((i) => i.id));
};
</script>

<style scoped lang="scss"></style>
