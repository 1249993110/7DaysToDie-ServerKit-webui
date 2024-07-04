<template>
    <div class="store-management">
        <RouterButton
            :buttons="[
                {
                    value: '商店配置',
                    path: '/game-store/settings',
                },
                {
                    value: '商店管理',
                    path: '/game-store/management',
                },
                {
                    value: '高级商店',
                    path: '/game-store/advance',
                },
            ]"
        >
        </RouterButton>
        <MyTableEx
            style="margin-top: 20px"
            :show-export-btn="false"
            :show-searcher="false"
            :show-table-index="false"
            :show-pager="false"
            :get-data="getData"
            :table-data="tableData"
            :show-add-btn="true"
            :show-edit-btn="true"
            :delete="deleteRequest"
            :batch-delete="batchDeleteRequest"
            :add-or-edit-component="AddOrEditGoods"
            :addOrEditComponentProps="addOrEditComponentProps"
        >
            <template #columns>
                <el-table-column prop="id" label="商品Id" width="120px" sortable> </el-table-column>
                <el-table-column prop="name" label="商品名称" width="180px" sortable show-overflow-tooltip> </el-table-column>
                <el-table-column prop="price" label="售价" width="120px" sortable> </el-table-column>
                <el-table-column label="自定义命令" show-overflow-tooltip>
                    <template #default="{ row }">
                        <el-tag v-for="(cmd, index) in row.commands" :key="index" style="margin-right: 5px">
                            {{ cmd }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="在主线程执行" width="140px" sortable>
                    <template #default="{ row }">
                        {{ `${row.inMainThread ? '是' : '否'}` }}
                    </template>
                </el-table-column>
            </template>
        </MyTableEx>
    </div>
</template>

<script>
export default {
    name: 'GameStore.Advance',
};
</script>

<script setup>
import * as api from '~/api/goods.js';
import AddOrEditGoods from './AddOrEditGoods.vue';

const tableData = ref([]);
const addOrEditComponentProps = ref({});

const getData = async () => {
    const data = await api.getGoods();

    const array = [];
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element.contentType === 'Command') {
            const commands = JSON.parse(element.content);
            array.push({
                id: element.id,
                name: element.name,
                price: element.price,
                commands: commands,
                inMainThread: element.inMainThread,
            });
        }
    }

    if (data.length) {
        addOrEditComponentProps.value = { id: data[data.length - 1].id + 1 };
    }

    tableData.value = array;
};

const deleteRequest = async (row) => {
    return await api.deleteGoodsByIds([row.id]);
};

const batchDeleteRequest = async (rows) => {
    return await api.deleteGoodsByIds(rows.map((i) => i.id));
};
</script>

<style lang="scss"></style>
