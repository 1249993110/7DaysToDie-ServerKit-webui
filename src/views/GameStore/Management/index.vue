<template>
    <div class="goods-management">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新建</el-button>
        <div class="table-container">
            <el-table :data="tableData" border height="100%" highlight-current-row ref="tableRef">
                <el-table-column type="index" label="序号" width="60"> </el-table-column>
                <el-table-column prop="name" label="商品名称" sortable width="200"> </el-table-column>
                <el-table-column prop="executeCommands" label="执行命令" sortable> </el-table-column>
                <el-table-column prop="inMainThread" label="是否在主线程执行命令" width="200" sortable>
                    <template #default="scope">
                        <el-tag v-if="scope.row.inMainThread" type="danger">是</el-tag>
                        <el-tag v-else type="success">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="售价" width="100" sortable> </el-table-column>
                <el-table-column label="操作" width="200" header-align="center" show-overflow-tooltip>
                    <template #default="scope">
                        <el-button size="small" type="primary" :icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" :icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <AddOrUpdateGoods ref="addOrUpdateGoodsRef" @onSubmit="getData" />
    </div>
</template>

<script>
export default {
    name: 'GameStore.GoodsManagement',
};
</script>

<script setup>
import * as api from '~/api/goods.js';
import { Edit, Plus, Delete } from '@element-plus/icons-vue';
import myconfirm from '~/utils/myconfirm';
import AddOrUpdateGoods from './AddOrUpdateGoods.vue';

const tableData = ref([]);
const total = ref(0);

const getData = () => {
    api.getGoods().then((data) => {
        tableData.value = data;
    });
};

getData();

const tableRef = ref();
const addOrUpdateGoodsRef = ref();

const handleAdd = () => {
    addOrUpdateGoodsRef.value.show();
};

const handleUpdate = (row) => {
    addOrUpdateGoodsRef.value.show(row);
};

const handleDelete = async (row) => {
    try {
        await myconfirm('确定删除选中内容吗?');
        await api.deleteGoodsById(row.id);
        getData();
    } catch {}
};
</script>

<style scoped lang="scss">
.goods-management {
    height: 100%;
    .table-container {
        margin-top: 8px;
        height: calc(100% - 84px);
    }
}
</style>
