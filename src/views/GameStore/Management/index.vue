<template>
    <div class="store-management">
        <RouterButton
            :buttons="[
                {
                    value: '商店配置',
                    path: '/game-store/settings',
                },
                {
                    value: '商品管理',
                    path: '/game-store/management',
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
                <el-table-column prop="name" label="图标" width="120px" class-name="table-icon-col">
                    <template #default="scope">
                        <el-image :src="getIconUrl(scope.row)" style="width: 40px; height: 40px" lazy></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称" sortable show-overflow-tooltip> </el-table-column>
                <el-table-column prop="price" label="售价" width="120px" sortable> </el-table-column>
                <el-table-column prop="itemName" label="物品名称" sortable show-overflow-tooltip> </el-table-column>
                <el-table-column prop="count" label="数量" width="120px" sortable> </el-table-column>
                <el-table-column prop="quality" label="品质" width="120px" sortable> </el-table-column>
                <el-table-column prop="durability" label="耐久度" width="120px" sortable> </el-table-column>
            </template>
        </MyTableEx>
    </div>
</template>

<script>
export default {
    name: 'GameStore.Management',
};
</script>

<script setup>
import * as api from '~/api/goods.js';
import AddOrEditGoods from './AddOrEditGoods.vue';
import { getIconUrl } from '~/utils/image-helper';

const tableData = ref([]);

const addOrEditComponentProps = ref({});

const getData = async () => {
    const data = await api.getGoods();

    const array = [];
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        const item = JSON.parse(element.content);
        array.push({
            id: element.id,
            name: element.name,
            price: element.price,
            itemName: item.itemName,
            count: item.count,
            quality: item.quality,
            durability: item.durability,
            itemIcon: item.itemIcon,
            iconColor: item.iconColor,
        });
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

<style lang="scss">

</style>
