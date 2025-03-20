<template>
    <el-dialog :title="t('components.playerIdSelector.title')" draggable append-to-body align-center :close-on-click-modal="false" width="800px" @open="handleOpen">
        <div style="margin-bottom: 8px">
            <el-input v-model="keyword" :placeholder="t('global.message.inputText')" clearable autofocus style="width: 200px" :validate-event="false"></el-input>
            <el-button :icon="Search" @click="getTableData" type="primary" style="margin-left: 8px">{{ t('global.button.search') }}</el-button>
        </div>
        <el-table :data="tableData" border height="calc(50vh)" highlight-current-row v-loading="loading" size="small">
            <el-table-column prop="playerId" :label="t('components.playerIdSelector.playerId')" width="260px" />
            <el-table-column prop="platformId" :label="t('components.playerIdSelector.platformId')" width="180px" />
            <el-table-column prop="playerName" :label="t('components.playerIdSelector.playerName')" show-overflow-tooltip />
            <el-table-column :label="t('global.button.select')" align="center" width="160px">
                <template #default="{ row }">
                    <el-dropdown @command="handleCommand" trigger="click" split-button @click="handleSelect(row.playerId)" size="small" type="primary">
                        {{ t('components.playerIdSelector.selectPlayerId') }}
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item :command="row.platformId">{{ t('components.playerIdSelector.selectPlatformId') }}</el-dropdown-item>
                                <el-dropdown-item :command="row.playerName">{{ t('components.playerIdSelector.selectPlayerName') }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script setup>
import { getHistoryPlayerIds } from '~/api/players';
import { Search } from '@element-plus/icons-vue';
import { i18n } from '~/plugins/i18n';
const { t } = i18n.global;

const tableData = ref([]);
const loading = ref(false);
const keyword = ref('');

const getTableData = async () => {
    loading.value = true;
    try {
        let data = await getHistoryPlayerIds();
        data = searchByKeyword(data, keyword.value);
        tableData.value = data;
    } finally {
        loading.value = false;
    }
};

const handleOpen = async () => {
    await getTableData();
};

const emit = defineEmits(['select']);
const handleSelect = (id) => {
    emit('select', id);
};

const handleCommand = (command) => {
    emit('select', command);
};
</script>
