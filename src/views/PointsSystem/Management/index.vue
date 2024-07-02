<template>
    <div class="points-management">
        <RouterButton
            :buttons="[
                {
                    value: '签到配置',
                    path: '/points-system/settings',
                },
                {
                    value: '积分管理',
                    path: '/points-system/management',
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
            :delete="deleteRequest"
            :batch-delete="batchDeleteRequest"
            :add-or-update-component="AddOrEditPointsInfo"
        >
            <template #searchFormItems>
                <el-form-item label="关键词" prop="keyword">
                    <el-input v-model="searchFormModel.keyword" style="width: 400px" placeholder="请输入内容" clearable autofocus></el-input>
                </el-form-item>
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
    name: 'PointsSystem.Management',
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
    return await api.deletePointsInfoByIds([row.id]);
};

const batchDeleteRequest = async (rows) => {
    return await api.deletePointsInfoByIds(rows.map((i) => i.id));
};
</script>

<style scoped lang="scss">

</style>
