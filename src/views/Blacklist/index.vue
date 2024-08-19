<template>
    <div>
        <RouterButton
            :buttons="[
                {
                    value: '黑名单',
                    path: '/blacklist',
                },
            ]"
        >
        </RouterButton>
        <MyTableEx
            @on-export="handleExport"
            :search-form-model="searchFormModel"
            :get-data="getData"
            :table-data="tableData"
            :total="total"
            :add-or-edit-component="AddBlacklist"
            :delete="deleteRequest"
            :batch-delete="batchDeleteRequest"
            style="margin-top: 20px"
        >
            <template #searchFormItems>
                <el-form-item label="玩家Id" prop="playerId">
                    <el-input v-model="searchFormModel.playerId" style="width: 340px" placeholder="请输入内容" clearable autofocus></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="displayName">
                    <el-input v-model="searchFormModel.displayName" placeholder="请输入内容" clearable></el-input>
                </el-form-item>
            </template>
            <template #columns>
                <el-table-column prop="playerId" label="玩家Id" width="320" sortable />
                <el-table-column prop="displayName" label="名称" width="150" sortable />
                <el-table-column prop="bannedUntil" label="解封日期" width="170" sortable :formatter="(row) => row.bannedUntil.substr(0, 16)" />
                <el-table-column prop="reason" label="封禁原因" min-width="170" />
            </template>
        </MyTableEx>
    </div>
</template>

<script>
export default {
    name: 'Blacklist',
};
</script>

<script setup>
import * as api from '~/api/blacklist';
import AddBlacklist from './Add.vue';


const searchFormModel = reactive({
    playerId: '',
    displayName: '',
});

const tableData = ref([]);
const total = ref(0);

const getData = async ({ pageNumber, pageSize }) => {
    let data = await api.getBlacklist();
    data.reverse();
    const filter = (propName) => {
        if (searchFormModel[propName]) {
            const regex = new RegExp(searchFormModel[propName], 'i');
            data = data.filter((i) => regex.test(i[propName]));
        }
    };

    filter('playerId');
    filter('displayName');

    tableData.value = data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    total.value = data.length;
};

const deleteRequest = async (row) => {
    return await api.deleteBlacklist([row.playerId]);
};

const batchDeleteRequest = async (rows) => {
    return await api.deleteBlacklist(rows.map((i) => i.playerId));
};

const handleExport = (command) => {
    switch (command) {
        case 'csv':
            fileHelper.exportCsv(tableData.value, '黑名单', { playerId: '玩家Id', displayName: '名称', bannedUntil: '解封日期', reason: '封禁原因' });
            break;
        case 'json':
            fileHelper.exportJson(tableData.value, '黑名单');
            break;
    }
};
</script>
