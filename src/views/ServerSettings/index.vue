<template>
    <div class="server-settings">
        <RouterButton :names="['serverSettings']">
            <template #routeButton>
                <ServerToolBar />
            </template>
        </RouterButton>
        <el-scrollbar class="settings-scroll">
            <div class="settings-groups">
                <div v-for="(group, gIndex) in tableData" :key="gIndex" class="settings-group">
                    <div class="group-header">
                        <span class="group-title">{{ group[0]?.group }}</span>
                        <span class="group-count">{{ group.length }}</span>
                    </div>
                    <div class="group-items">
                        <div v-for="(item, index) in group" :key="index" class="setting-item">
                            <div class="setting-info">
                                <div class="setting-name">
                                    <code>{{ item.name }}</code>
                                </div>
                                <div class="setting-desc" :title="item.desc">{{ item.desc }}</div>
                            </div>
                            <div class="setting-action">
                                <span class="setting-value" :title="item.value">{{ item.value }}</span>
                                <el-button size="small" type="primary" plain :icon="Edit" @click="handleEdit(item)">
                                    {{ t('global.button.edit') }}
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-scrollbar>
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
    const group = Object.groupBy(data, (item) => item.group);
    const array = [];
    for (const key in group) {
        array.push(group[key]);
    }
    tableData.value = array;
};
getData();

const { t } = useI18n();
const handleEdit = async (row) => {
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
    .settings-scroll {
        margin-top: 16px;
        height: calc(100vh - 150px);
    }

    .settings-groups {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-bottom: 16px;
    }

    .settings-group {
        background: var(--ty-card-bg);
        border: 1px solid var(--el-card-border-color);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }

    .group-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 20px;
        background: var(--el-fill-color-light);
        border-bottom: 1px solid var(--el-border-color-lighter);

        .group-title {
            font-size: 15px;
            font-weight: 700;
            color: var(--ty-text-primary);
        }

        .group-count {
            font-size: 11px;
            font-weight: 600;
            color: var(--ty-color-primary);
            background: var(--el-color-primary-light-9);
            padding: 2px 8px;
            border-radius: 10px;
        }
    }

    .group-items {
        .setting-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 12px 20px;
            border-bottom: 1px solid var(--el-border-color-lighter);
            transition: background-color 0.1s ease;

            &:last-child {
                border-bottom: none;
            }

            &:hover {
                background: var(--el-fill-color-light);
            }
        }
    }

    .setting-info {
        flex: 1;
        min-width: 0;

        .setting-name {
            margin-bottom: 4px;

            code {
                font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
                font-size: 13px;
                font-weight: 600;
                color: var(--ty-color-primary);
                background: var(--el-color-primary-light-9);
                padding: 2px 8px;
                border-radius: 4px;
            }
        }

        .setting-desc {
            font-size: 12px;
            color: var(--ty-text-muted);
            line-height: 1.4;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .setting-action {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;

        .setting-value {
            font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
            font-size: 13px;
            font-weight: 600;
            color: var(--ty-text-primary);
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: right;
        }

        .el-button {
            box-shadow: none;
            &:hover {
                transform: none;
            }
        }
    }
}
</style>
