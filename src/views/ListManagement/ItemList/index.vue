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
            :add-or-edit-component="AddOrEditItemList"
        >
            <template #searchFormItems>
                <el-form-item :label="t('global.keyworld')" prop="keyword">
                    <el-input v-model="searchFormModel.keyword" style="width: 400px" :placeholder="t('global.message.inputText')" clearable autofocus></el-input>
                </el-form-item>
            </template>
            <template #columns>
                <el-table-column prop="id" :label="t('views.listManagement.tableHeader.id')" sortable width="80px"></el-table-column>
                <el-table-column :label="t('views.listManagement.tableHeader.icon')" width="120px" class-name="table-icon-col">
                    <template #default="{ row }">
                        <GameIcon :name="row.itemName" :size="40"/>
                    </template>
                </el-table-column>
                <el-table-column prop="itemName" :label="t('views.listManagement.tableHeader.itemName')" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="count" :label="t('views.listManagement.tableHeader.count')" sortable></el-table-column>
                <el-table-column prop="quality" :label="t('views.listManagement.tableHeader.quality')" sortable></el-table-column>
                <el-table-column prop="durability" :label="t('views.listManagement.tableHeader.durability')" sortable width="120px"></el-table-column>
                <el-table-column prop="description" :label="t('views.listManagement.tableHeader.description')" sortable how-overflow-tooltip></el-table-column>
                <el-table-column prop="createdAt" :label="t('views.listManagement.tableHeader.createdAt')" sortable></el-table-column>
            </template>
        </MyTableEx>
    </div>
</template>

<script>
export default {
    name: 'listManagement.itemList',
};
</script>

<script setup>
import * as api from '~/api/item-list.js';
import AddOrEditItemList from '~/components/AddOrEditItemList/index.vue';

const {t} = useI18n();
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
