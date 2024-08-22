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
                <el-form-item label="关键词" prop="keyword">
                    <el-input v-model="searchFormModel.keyword" style="width: 400px" placeholder="请输入内容" clearable autofocus></el-input>
                </el-form-item>
            </template>
            <template #toolbarPost>
                <el-button @click="handleResetPoints" type="danger">重置所有玩家积分</el-button>
                <el-button @click="handleResetSignIn" type="danger">重置所有签到时间</el-button>
            </template>
            <template #columns>
                <el-table-column prop="playerName" label="玩家名称" sortable> </el-table-column>
                <el-table-column prop="id" label="玩家Id" sortable> </el-table-column>
                <el-table-column prop="points" label="积分数量" sortable> </el-table-column>
                <el-table-column prop="lastSignInAt" label="上次签到日期" sortable> </el-table-column>
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
        if (await myconfirm('您确定要清空所有玩家的积分吗？这个操作不可逆!')) {
            await api.deletePointsInfoByIds({ resetPoints: true });
            await getData();
        }
    } catch {}
};

const handleResetSignIn = async () => {
    try {
        if (await myconfirm('您确定要重置所有玩家的签到时间吗?')) {
            await api.deletePointsInfoByIds({ resetSignIn: true });
            await getData();
        }
    } catch {}
};
</script>

<style scoped lang="scss"></style>
