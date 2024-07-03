<template>
    <el-dialog title="选择物品或方块" draggable append-to-body align-center :close-on-click-modal="false" width="1000px">
        <el-table :data="tableData" border height="calc(64vh)" highlight-current-row ref="tableRef" v-loading="loading">
            <el-table-column prop="id" label="Id" width="60px"> </el-table-column>
            <el-table-column prop="itemIcon" label="图标" width="120px" class-name="table-icon-col">
                <template #default="scope">
                    <el-image :src="getIconUrl(scope.row)" style="width: 80px; height: 80px" lazy></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="itemName" label="物品名称" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="localizationName" label="本地化名称" show-overflow-tooltip> </el-table-column>
            <!-- <el-table-column prop="iconColor" label="图标颜色" sortable> </el-table-column> -->
            <el-table-column prop="maxStackAllowed" label="最大堆叠数量" width="120px"> </el-table-column>
            <el-table-column align="center" width="200px">
                <template #header> 
                    <el-input v-model="searchModel.keyword" placeholder="搜索" clearable style="width: calc(100% - 32px)" @keyup.enter="getData" :validate-event="false" />
                    <el-button :icon="Search" circle @click="getData" /> </template>
                <template #default="scope">
                    <el-button type="primary" @click="handleSelect(scope.row)">选择</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 10px"
            background
            @size-change="getData"
            @current-change="getData"
            :page-sizes="[5, 10, 20, 50, 100]"
            v-model:current-page="searchModel.pageNumber"
            v-model:page-size="searchModel.pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
    </el-dialog>
</template>

<script setup>
import { getItemBlocks } from '~/api/item-blocks';
import { getIconUrl } from '~/utils/image-helper';
import { Search } from '@element-plus/icons-vue';

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);

const searchModel = reactive({
    pageNumber: 1,
    pageSize: 20,
    keyword: '',
    itemBlockKind: 0,
    showUserHidden: true,
});

const getData = async () => {
    try {
        loading.value = true;
        const data = await getItemBlocks(searchModel);
        tableData.value = data.items;
        total.value = data.total;
    } finally {
        loading.value = false;
    }
};

getData();

const emit = defineEmits(['onSelect']);
const handleSelect = (row) => {
    emit('onSelect', row);
};
</script>

<style scoped lang="scss"></style>
