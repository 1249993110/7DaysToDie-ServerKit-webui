<template>
    <div class="points-management">
        <div class="operate-container">
            <el-button type="primary" :icon="Plus" @click="handleAdd">新建</el-button>
            <div class="search-container">
                <el-input class="input" v-model="queryParams.keyword" placeholder clearable @keyup.enter.native="getData"></el-input>
                <el-button class="button" type="primary" @click="getData">
                    <template #icon><Icon name="search" /></template>
                    查 询
                </el-button>
            </div>
        </div>
        <div class="table-container">
            <el-table :data="tableData" border height="100%" highlight-current-row ref="tableRef">
                <el-table-column type="index" label="序号" width="60"> </el-table-column>
                <el-table-column prop="playerName" label="玩家名称" sortable> </el-table-column>
                <el-table-column prop="playerId" label="玩家Id" sortable> </el-table-column>
                <el-table-column prop="points" label="积分数量" sortable> </el-table-column>
                <el-table-column prop="lastSignInDays" label="上次签到日期" sortable> </el-table-column>
                <el-table-column label="操作" width="200" header-align="center" show-overflow-tooltip>
                    <template #default="scope">
                        <el-button size="small" type="primary" :icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" :icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
            style="margin-top: 8px"
            background
            @size-change="getData"
            @current-change="getData"
            :page-sizes="[5, 10, 20, 50, 100]"
            v-model:current-page="queryParams.pageNumber"
            v-model:page-size="queryParams.pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
        <AddOrUpdatePointsInfo ref="addOrUpdatePointsInfoRef" @onSubmit="getData" />
    </div>
</template>

<script>
export default {
    name: 'PointsSystem.Mmanagement',
};
</script>

<script setup>
import * as api from '~/api/points-info.js';
import { Edit, Plus, Delete, Search, Refresh, FolderAdd } from '@element-plus/icons-vue';
import myconfirm from '~/utils/myconfirm';
import AddOrUpdatePointsInfo from './AddOrUpdatePointsInfo.vue';

const tableData = ref([]);
const queryParams = reactive({
    pageNumber: 1,
    pageSize: 20,
    desc: true,
    keyword: '',
});
const total = ref(0);

const getData = () => {
    api.getPointsInfoPaged(queryParams).then((data) => {
        tableData.value = data.items;
        total.value = data.total;
    });
};

getData();

const tableRef = ref();
const addOrUpdatePointsInfoRef = ref();

const handleAdd = () => {
    addOrUpdatePointsInfoRef.value.show();
};

const handleUpdate = (row) => {
    addOrUpdatePointsInfoRef.value.show(row);
};

const handleDelete = async (row) => {
    try {
        await myconfirm('确定删除选中内容吗?');
        await api.deletePointsInfoById(row.playerId);
        getData();
    } catch {}
};
</script>

<style scoped lang="scss">
.points-management {
    height: 100%;
    .operate-container {
        display: flex;
        padding: 0 8px;
        .search-container {
            margin-left: auto;
            display: flex;
            .input {
                width: 400px;
            }
            .button {
                margin-left: 8px;
            }
        }
    }

    .table-container {
        margin-top: 8px;
        height: calc(100% - 84px);
    }
}
</style>
