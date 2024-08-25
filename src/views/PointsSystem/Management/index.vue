<template>
    <div class="points-management">
        <RouterButton :names="['pointsSystem.settings', 'pointsSystem.management']"></RouterButton>
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
            :add-or-edit-component="AddOrEditPointsInfo"
        >
            <template #searchFormItems>
                <el-form-item :label="t('global.keyworld')" prop="keyword">
                    <el-input v-model="searchFormModel.keyword" style="width: 400px" :placeholder="t('global.message.inputText')" clearable autofocus></el-input>
                </el-form-item>
            </template>
            <template #toolbarPost>
                <el-button @click="handleResetPoints" type="danger">{{ t('views.pointsSystem.resetPoints') }}</el-button>
                <el-button @click="handleResetSignIn" type="danger">{{ t('views.pointsSystem.resetSignIn') }}</el-button>
            </template>
            <template #columns>
                <el-table-column prop="playerName" :label="t('views.pointsSystem.tableHeader.playerName')" sortable> </el-table-column>
                <el-table-column prop="id" :label="t('views.pointsSystem.tableHeader.playerId')" sortable> </el-table-column>
                <el-table-column prop="points" :label="t('views.pointsSystem.tableHeader.points')" sortable> </el-table-column>
                <el-table-column prop="lastSignInAt" :label="t('views.pointsSystem.tableHeader.lastSignInAt')" sortable> </el-table-column>
            </template>
        </MyTableEx>
    </div>
</template>

<script>
export default {
    name: 'pointsSystem.management',
};
</script>

<script setup>
import * as api from '~/api/points-info.js';
import AddOrEditPointsInfo from './AddOrEditPointsInfo.vue';

const { t } = useI18n();
const searchFormModel = reactive({
    keyword: '',
});

const tableData = ref([]);
const total = ref(0);

const getData = async (pagination) => {
    const data = await api.getPointsInfoPaged({ ...pagination, ...searchFormModel });
    tableData.value = data.items;
    total.value = data.total;
};

const deleteRequest = async (row) => {
    return await api.deletePointsInfoByIds({ ids: [row.id] });
};

const batchDeleteRequest = async (rows) => {
    return await api.deletePointsInfoByIds({ ids: rows.map((i) => i.id) });
};

const handleResetPoints = async () => {
    try {
        if (await myconfirm(t('views.pointsSystem.resetPointsConfirm'))) {
            await api.deletePointsInfoByIds({ resetPoints: true });
            await getData();
        }
    } catch {}
};

const handleResetSignIn = async () => {
    try {
        if (await myconfirm(t('views.pointsSystem.resetSignInConfirm'))) {
            await api.deletePointsInfoByIds({ resetSignIn: true });
            await getData();
        }
    } catch {}
};
</script>

<style scoped lang="scss"></style>
