<template>
    <div class="dashboard">
        <RouterButton
            :buttons="[
                {
                    value: '服务器设置',
                    path: '/server-settings',
                },
            ]"
        >
            <template #route-button>
                <div class="route-button">
                    <el-button link type="primary" @click="handleRestart"> 重启服务器 </el-button>
                    <el-divider direction="vertical" />
                    <el-button link type="danger" @click="handleShutdown"> 关闭服务器 </el-button>
                </div>
            </template>
        </RouterButton>
        <div style="margin-top: 20px"></div>
        <template v-for="(item, index) in tableData" :key="index">
            <el-table :data="item" border stripe style="width: 100%" :show-header="false" :span-method="objectSpanMethod">
                <el-table-column prop="group" width="110">
                    <template #default="scope">
                        {{ scope.row.group }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" width="230">
                    <template #default="scope">
                        <el-tag>{{ scope.row.name }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="desc" show-overflow-tooltip />
                <el-table-column prop="value" width="160" show-overflow-tooltip />
                <el-table-column width="90" fixed="right">
                    <template #default="scope">
                        <el-button size="small" type="primary" :icon="Edit" @click="handleEdit(scope)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
export default {
    name: 'ServerSettings',
};
</script>

<script setup>
import { getSettings, putSettings, restart, shutdown } from '~/api/server';
import { Edit } from '@element-plus/icons-vue';
import myconfirm from '~/utils/myconfirm';
import myprompt from '~/utils/myprompt';

const handleRestart = async () => {
    if (await myconfirm('您确定要重启服务器吗? 这可能需要几分钟的时间')) {
        await restart();
        ElMessage.success('重启成功');
    }
};

const handleShutdown = async () => {
    if (await myconfirm('您确定要关闭服务器吗?')) {
        await shutdown();
        ElMessage.success('关闭成功');
    }
};

const tableData = ref([]);
const getData = async () => {
    const data = await getSettings();
    const group = Object.groupBy(data, (item) => {
        return item.group;
    });
    const array = [];
    for (const key in group) {
        array.push(group[key]);
    }
    tableData.value = array;
};
getData();

const objectSpanMethod = ({ rowIndex, columnIndex }) => {
    if (columnIndex === 0) {
        if (rowIndex === 0) {
            return {
                rowspan: tableData.value.length,
                colspan: 1,
            };
        } else {
            return {
                rowspan: 0,
                colspan: 0,
            };
        }
    }
};

const handleEdit = async ({ row }) => {
    const value = await myprompt(row.name, '请输入新的值', row.value);
    const dict = {};
    dict[row.name] = value;
    await putSettings(dict);
    await getData();
};
</script>

<style scoped lang="scss">
.route-button {
    margin-right: 20px;
    :deep(.el-button) {
        --el-button-text-color: #005eeb;
    }
    :deep(button:nth-child(3)) {
        --el-button-text-color: #f56c6c;
    }
}
</style>
