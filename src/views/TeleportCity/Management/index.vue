<template>
    <div class="teleport-city-management">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新建</el-button>
        <div class="table-container">
            <el-table :data="tableData" border height="100%" highlight-current-row ref="tableRef">
                <el-table-column type="index" label="序号" width="60"> </el-table-column>
                <el-table-column prop="cityName" label="城镇名称" sortable> </el-table-column>
                <el-table-column prop="createdAt" label="创建日期" sortable> </el-table-column>
                <el-table-column prop="pointsRequired" label="传送需要积分" sortable> </el-table-column>
                <el-table-column prop="position" label="三维坐标" sortable> </el-table-column>
                <el-table-column label="操作" width="200" header-align="center" show-overflow-tooltip>
                    <template #default="scope">
                        <el-button size="small" type="primary" :icon="Edit" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" :icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <AddOrUpdateCityLocation ref="addOrUpdateCityLocationRef" @onSubmit="getData" />
    </div>
</template>

<script>
export default {
    name: 'TeleportCity.Management',
};
</script>

<script setup>
import * as api from '~/api/city-location.js';
import { Edit, Plus, Delete, Search, Refresh, FolderAdd } from '@element-plus/icons-vue';
import myconfirm from '~/utils/myconfirm';
import AddOrUpdateCityLocation from './AddOrUpdateCityLocation.vue';

const tableData = ref([]);

const getData = () => {
    api.getCityLocations().then((data) => {
        tableData.value = data;
    });
};

getData();

const tableRef = ref();
const addOrUpdateCityLocationRef = ref();

const handleAdd = () => {
    addOrUpdateCityLocationRef.value.show();
};

const handleEdit = (row) => {
    addOrUpdateCityLocationRef.value.show(row);
};

const handleDelete = async (row) => {
    try {
        await myconfirm('确定删除选中内容吗?');
        await api.deleteCityLocationById(row.id);
        getData();
    } catch {}
};
</script>

<style scoped lang="scss">
.teleport-city-management {
    height: 100%;
    .table-container {
        margin-top: 8px;
        height: calc(100% - 84px);
    }
}
</style>
