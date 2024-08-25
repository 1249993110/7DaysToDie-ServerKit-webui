<template>
    <div class="autobackup-management">
        <RouterButton :names="['autobackup.settings', 'autobackup.management']"></RouterButton>
        <MyTableEx
            style="margin-top: 20px"
            :show-export-btn="false"
            :show-searcher="false"
            :show-table-index="true"
            :show-pager="false"
            :get-data="getData"
            :table-data="tableData"
            :show-add-btn="false"
            :show-edit-btn="false"
            :delete="deleteRequest"
            :batch-delete="batchDeleteRequest"
            :operationColumnWidth="90"
        >
            <template #columns>
                <el-table-column prop="serverVersion" :label="t('views.autoBackup.tableHeader.serverVersion')" sortable show-overflow-tooltip> </el-table-column>
                <el-table-column prop="gameWorld" :label="t('views.autoBackup.tableHeader.gameWorld')" sortable show-overflow-tooltip> </el-table-column>
                <el-table-column prop="gameName" :label="t('views.autoBackup.tableHeader.gameName')" sortable show-overflow-tooltip> </el-table-column>
                <el-table-column :label="t('views.autoBackup.tableHeader.gameTime')" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ t('views.autoBackup.tableHeader.formatGameTime', { days: row.days, hours: row.hours }) }}
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" :label="t('views.autoBackup.tableHeader.createdAt')" min-width="80px" sortable> </el-table-column>
                <el-table-column prop="size" :label="t('views.autoBackup.tableHeader.size')" width="120px" sortable>
                    <template #default="{ row }">
                        {{ `${Math.round(row.size / 1024 / 1024)} MB` }}
                    </template>
                </el-table-column>
            </template>
        </MyTableEx>
    </div>
</template>

<script>
export default {
    name: 'autobackup.management',
};
</script>

<script setup>
import * as api from '~/api/autobackup.js';

const { t } = useI18n();
const tableData = ref([]);

const getData = async () => {
    const data = await api.getBackupFiles();
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    tableData.value = data;
};

const deleteRequest = async (row) => {
    return await api.deletetBackupFiles([row.name]);
};

const batchDeleteRequest = async (rows) => {
    return await api.deletetBackupFiles(rows.map((i) => i.name));
};
</script>

<style lang="scss"></style>
