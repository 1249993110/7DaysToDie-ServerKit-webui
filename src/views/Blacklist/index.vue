<template>
    <div>
        <RouterButton :names="['blacklist']"></RouterButton>
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
                <el-form-item :label="t('views.blacklist.tableHeader.playerId')" prop="playerId">
                    <el-input v-model="searchFormModel.playerId" style="width: 340px" :placeholder="t('global.message.inputText')" clearable autofocus></el-input>
                </el-form-item>
                <el-form-item :label="t('views.blacklist.tableHeader.displayName')" prop="displayName">
                    <el-input v-model="searchFormModel.displayName" :placeholder="t('global.message.inputText')" clearable></el-input>
                </el-form-item>
            </template>
            <template #columns>
                <el-table-column prop="playerId" :label="t('views.blacklist.tableHeader.playerId')" width="320" sortable />
                <el-table-column prop="displayName" :label="t('views.blacklist.tableHeader.displayName')" width="150" sortable />
                <el-table-column
                    prop="bannedUntil"
                    :label="t('views.blacklist.tableHeader.bannedUntil')"
                    width="170"
                    sortable
                    :formatter="(row) => row.bannedUntil.substr(0, 16)"
                />
                <el-table-column prop="reason" :label="t('views.blacklist.tableHeader.reason')" min-width="170" />
            </template>
        </MyTableEx>
    </div>
</template>

<script>
export default {
    name: 'blacklist',
};
</script>

<script setup>
import * as api from '~/api/blacklist';
import AddBlacklist from './Add.vue';

const { t } = useI18n();

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
            exportCsv(tableData.value, t('menus.blacklist'), {
                playerId: t('views.blacklist.tableHeader.playerId'),
                displayName: t('views.blacklist.tableHeader.displayName'),
                bannedUntil: t('views.blacklist.tableHeader.bannedUntil'),
                reason: t('views.blacklist.tableHeader.reason'),
            });
            break;
        case 'json':
            exportJson(tableData.value, t('menus.blacklist'));
            break;
    }
};
</script>
