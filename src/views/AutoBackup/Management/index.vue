<template>
    <div class="autobackup-management">
        <RouterButton
            :buttons="[
                {
                    value: '备份配置',
                    path: '/autobackup/settings',
                },
                {
                    value: '备份管理',
                    path: '/autobackup/management',
                },
            ]"
        >
        </RouterButton>
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
                <!-- <el-table-column prop="name" label="名称" sortable show-overflow-tooltip> </el-table-column> -->
                <el-table-column prop="serverVersion" label="服务端版本" sortable show-overflow-tooltip> </el-table-column>
                <el-table-column prop="gameWorld" label="游戏世界" sortable show-overflow-tooltip> </el-table-column>
                <el-table-column prop="gameName" label="游戏名称" sortable show-overflow-tooltip> </el-table-column>
                <el-table-column prop="gameName" label="游戏时间" show-overflow-tooltip>
                    <template #default="{row}">
                        {{ `${row.days} 天 ${row.hours}小时` }}
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建日期" width="150px" sortable> </el-table-column>
                <el-table-column prop="size" label="大小" width="120px" sortable>
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
    name: 'AutoBackup.Management',
};
</script>

<script setup>
import * as api from '~/api/autobackup.js';

const tableData = ref([]);

const addOrEditComponentProps = ref({});

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
