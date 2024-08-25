<template>
    <div>
        <RouterButton :names="['teleSystem.home.settings', 'teleSystem.home.management']"></RouterButton>
        <MyTableEx
            style="margin-top: 20px"
            :show-export-btn="false"
            :search-form-model="searchFormModel"
            :get-data="getData"
            :table-data="tableData"
            :total="total"
            :show-add-btn="true"
            :show-edit-btn="true"
            :delete="deleteRequest"
            :batch-delete="batchDeleteRequest"
            :add-or-edit-component="AddOrEditHomeLocation"
        >
            <template #searchFormItems>
                <el-form-item :label="t('global.keyworld')" prop="keyword">
                    <el-input v-model="searchFormModel.keyword" style="width: 400px" :placeholder="t('global.message.inputText')" clearable autofocus></el-input>
                </el-form-item>
            </template>
            <template #toolbarPost>
                <el-button @click="handleDeleteAll" type="danger">删除所有记录</el-button>
            </template>
            <template #columns>
                <el-table-column prop="playerName" label="玩家名称" sortable> </el-table-column>
                <el-table-column prop="playerId" label="玩家Id" sortable> </el-table-column>
                <el-table-column prop="createdAt" label="创建日期" sortable> </el-table-column>
                <el-table-column prop="homeName" label="Home名称" sortable> </el-table-column>
                <el-table-column prop="position" label="三维坐标" sortable> </el-table-column>
            </template>
        </MyTableEx>
    </div>
</template>

<script>
export default {
    name: 'teleSystem.home.management',
};
</script>

<script setup>
import * as api from '~/api/home-location.js';
import AddOrEditHomeLocation from './AddOrEditHomeLocation.vue';


const searchFormModel = reactive({
    keyword: '',
});

const tableData = ref([]);
const total = ref(0);

const getData = async (pagination) => {
    const data = await api.getHomeLocationPaged({ ...pagination, ...searchFormModel });
    tableData.value = data.items;
    total.value = data.total;
};

const deleteRequest = async (row) => {
    return await api.deleteHomeLocationByIds({ ids: [row.id] });
};

const batchDeleteRequest = async (rows) => {
    return await api.deleteHomeLocationByIds({ ids: rows.map((i) => i.id) });
};

const handleDeleteAll = async () => {
    try {
        if (await myconfirm('确定删除所有记录吗?')) {
            await api.deleteHomeLocationByIds({ deleteAll: true });
            await getData();
        }
    } catch {}
};
</script>
