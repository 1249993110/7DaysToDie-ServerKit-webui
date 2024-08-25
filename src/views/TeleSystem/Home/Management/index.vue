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
                <el-button @click="handleDeleteAll" type="danger">{{ t('views.teleSystem.home.deleteAll') }}</el-button>
            </template>
            <template #columns>
                <el-table-column prop="playerName" :label="t('views.teleSystem.home.tableHeader.playerName')" sortable> </el-table-column>
                <el-table-column prop="playerId" :label="t('views.teleSystem.home.tableHeader.playerId')" sortable> </el-table-column>
                <el-table-column prop="createdAt" :label="t('views.teleSystem.home.tableHeader.createdAt')" sortable> </el-table-column>
                <el-table-column prop="homeName" :label="t('views.teleSystem.home.tableHeader.homeName')" sortable> </el-table-column>
                <el-table-column prop="position" :label="t('views.teleSystem.home.tableHeader.position')" sortable> </el-table-column>
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

const { t } = useI18n();
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
        if (await myconfirm(t('views.teleSystem.home.deleteAllConfirm'))) {
            await api.deleteHomeLocationByIds({ deleteAll: true });
            await getData();
        }
    } catch {}
};
</script>
