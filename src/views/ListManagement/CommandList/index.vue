<template>
    <div>
        <RouterButton :names="['listManagement.itemList', 'listManagement.commandList']"></RouterButton>
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
            :add-or-edit-component="AddOrEditCommandList"
        >
            <template #searchFormItems>
                <el-form-item label="关键词" prop="keyword">
                    <el-input v-model="searchFormModel.keyword" style="width: 400px" placeholder="请输入内容" clearable autofocus></el-input>
                </el-form-item>
            </template>
            <template #columns>
                <el-table-column prop="id" label="Id" sortable width="80px"></el-table-column>
                <el-table-column prop="command" label="命令" sortable how-overflow-tooltip></el-table-column>
                <el-table-column label="在主线程执行" width="140px" sortable>
                    <template #default="{ row }">
                        {{ `${row.inMainThread ? '是' : '否'}` }}
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="说明" sortable how-overflow-tooltip></el-table-column>
                <el-table-column prop="createdAt" label="创建日期" sortable></el-table-column>
            </template>
        </MyTableEx>
    </div>
</template>

<script>
export default {
    name: 'listManagement.commandList',
};
</script>

<script setup>
import * as api from '~/api/command-list.js';
import AddOrEditCommandList from '~/components/AddOrEditCommandList/index.vue';

const searchFormModel = reactive({
    keyword: '',
});

const tableData = ref([]);
const total = ref(0);

const getData = async (pagination) => {
    const data = await api.getCommandListPaged({ ...pagination, ...searchFormModel });
    tableData.value = data.items;
    total.value = data.total;
};

const deleteRequest = async (row) => {
    return await api.deleteCommandByIds([row.id]);
};

const batchDeleteRequest = async (rows) => {
    return await api.deleteCommandByIds(rows.map((i) => i.id));
};
</script>

<style scoped lang="scss"></style>
