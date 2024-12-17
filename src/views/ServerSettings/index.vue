<template>
    <div class="server-settings">
        <RouterButton :names="['serverSettings']">
            <template #routeButton>
                <ServerToolBar />
            </template>
        </RouterButton>
        <el-card shadow="always" class="card">
            <el-scrollbar always>
                <template v-for="(item, index) in tableData" :key="index">
                    <el-table :data="item" border stripe style="width: 100%" :show-header="false" :span-method="objectSpanMethod" size="small">
                        <el-table-column prop="group" width="110">
                            <template #default="scope">
                                <span style="font-size: 16px; font-weight: bolder">{{ scope.row.group }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" width="250" show-overflow-tooltip>
                            <template #default="scope">
                                <el-tag style="font-weight: bold; font-family: monospace">{{ scope.row.name }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="desc" show-overflow-tooltip>
                            <template #default="scope">
                                <span style="font-size: 13px">{{ scope.row.desc }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="value" width="200" show-overflow-tooltip>
                            <template #default="scope">
                                <span style="font-size: 14px; font-weight: bold; font-family: emoji; color: var(--el-text-color-regular);">{{ scope.row.value }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="90" fixed="right">
                            <template #default="scope">
                                <el-button size="small" type="primary" :icon="Edit" @click="handleEdit(scope)">{{ t('global.button.edit') }}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-scrollbar>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'serverSettings',
};
</script>

<script setup>
import { getSettings, putSettings } from '~/api/server';
import { Edit } from '@element-plus/icons-vue';

if (!Object.groupBy) {
    Object.groupBy = function (array, callback) {
        return array.reduce((acc, item) => {
            const key = callback(item);
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {});
    };
}

const tableData = ref([]);
const localeStore = useLocaleStore();
const getData = async () => {
    const data = await getSettings(localeStore.getLanguage());
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
                rowspan: Number.MAX_SAFE_INTEGER,
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

const { t } = useI18n();
const handleEdit = async ({ row }) => {
    try {
        const value = await myprompt(row.name, t('global.message.inputNewValue'), row.value);
        const dict = {};
        dict[row.name] = value;
        await putSettings(dict);
        await getData();
    } catch {}
};
</script>

<style scoped lang="scss">
.server-settings {
    .card {
        margin-top: 20px;
        :deep(.el-card__body) {
            height: calc(100vh - 160px);
            padding: 0;
            .el-scrollbar__bar {
                z-index: 2;
            }
        }
    }
}
</style>
