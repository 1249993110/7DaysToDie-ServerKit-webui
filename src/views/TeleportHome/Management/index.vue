<template>
    <div class="teleport-home-management">
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
                <el-table-column prop="createdAt" label="创建日期" sortable> </el-table-column>
                <el-table-column prop="homeName" label="Home名称" sortable> </el-table-column>
                <el-table-column prop="position" label="三维坐标" sortable> </el-table-column>
                <el-table-column label="操作" width="200" header-align="center" show-overflow-tooltip>
                    <template #default="scope">
                        <el-button size="small" type="primary" :icon="Edit" @click="handleEdit(scope.row)">编辑</el-button>
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
        <AddOrUpdateHomeLocation ref="addOrUpdateHomeLocationRef" @onSubmit="getData" />
    </div>
</template>

<script>
export default {
    name: 'TeleportHome.Management',
};
</script>

<script setup>
import * as api from '~/api/home-location.js';
import { Edit, Plus, Delete, Search, Refresh, FolderAdd } from '@element-plus/icons-vue';
import myconfirm from '~/utils/myconfirm';
import AddOrUpdateHomeLocation from './AddOrUpdateHomeLocation.vue';

const tableData = ref([]);
const queryParams = reactive({
    pageNumber: 1,
    pageSize: 20,
    desc: true,
    keyword: '',
});
const total = ref(0);

const getData = () => {
    api.getHomeLocationPaged(queryParams).then((data) => {
        tableData.value = data.items;
        total.value = data.total;
    });
};

getData();

const tableRef = ref();
const addOrUpdateHomeLocationRef = ref();

const handleAdd = () => {
    addOrUpdateHomeLocationRef.value.show();
};

const handleEdit = (row) => {
    addOrUpdateHomeLocationRef.value.show(row);
};

const handleDelete = async (row) => {
    try {
        await myconfirm('确定删除选中内容吗?');
        await api.deleteHomeLocationById(row.id);
        getData();
    } catch {}
};
</script>

<style scoped lang="scss">
.teleport-home-management {
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
