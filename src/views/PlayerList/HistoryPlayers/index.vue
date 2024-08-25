<template>
    <div class="online-players">
        <RouterButton :names="['playerList.onlinePlayers', 'playerList.historyPlayers']"> </RouterButton>
        <el-card class="table-card" shadow="always" v-loading="loading">
            <div class="toolbar">
                <el-dropdown :disabled="batchBtnDisabled" @command="handleCommand">
                    <el-button type="success" :disabled="batchBtnDisabled">
                        {{ t('global.button.batchOperation') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="ban">{{ t('playerOperation.ban') }}</el-dropdown-item>
                            <el-dropdown-item command="setSuperAdmin">{{ t('playerOperation.setSuperAdmin') }}</el-dropdown-item>
                            <el-dropdown-item command="cancelAdmin">{{ t('playerOperation.cancelAdmin') }}</el-dropdown-item>
                            <el-dropdown-item command="removeLandClaims">{{ t('playerOperation.removeLandClaims') }}</el-dropdown-item>
                            <el-dropdown-item command="resetPlayer">{{ t('playerOperation.resetPlayer') }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-form class="search-form" ref="searchFormRef" :model="searchFormModel" label-position="right" :inline="true">
                    <el-form-item :label="t('global.keyworld')" prop="keyword">
                        <el-input
                            v-model="searchFormModel.keyword"
                            style="width: 400px"
                            :placeholder="t('views.playerList.searchPlaceholder')"
                            clearable
                            autofocus
                            @keyup.enter="getData"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :icon="Search" @click="getData" type="primary">{{ t('global.button.search') }}</el-button>
                        <el-button :icon="Refresh" @click="handleReset">{{ t('global.button.reset') }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
                ref="tableRef"
                :data="tableData"
                stripe
                height="calc(100vh - 270px)"
                highlight-current-row
                @row-contextmenu="onContextmenu"
                @selection-change="handleSelectionChange"
                @sort-change="handleSortChange"
                :default-sort="{ prop: 'lastLogin', order: 'descending' }"
            >
                <el-table-column type="selection" width="42" />
                <el-table-column type="index" :label="t('views.playerList.tableHeader.index')" width="61" fixed> </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.playerName')" min-width="133" sortable="custom" fixed show-overflow-tooltip prop="playerName">
                    <template #default="{ row }">
                        <span style="display: flex">
                            {{ row.playerName }}
                            <img v-if="row.playerDetails.isAdmin" :src="serverFavoriteImgUrl" width="20" height="20" :title="t('views.playerList.tableHeader.admin')" />
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.level')" min-width="84" sortable="custom" prop="level">
                    <template #default="{ row }">
                        {{ row.playerDetails.level }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.isOnline')" min-width="105" sortable="custom" prop="isOffline">
                    <template #default="{ row }">
                        {{ row.isOffline ? t('global.false') : t('global.true') }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.zombieKills')" min-width="132" sortable="custom" prop="zombieKills">
                    <template #default="{ row }">
                        {{ row.playerDetails.zombieKills }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.playerKills')" min-width="124" sortable="custom" prop="playerKills">
                    <template #default="{ row }">
                        {{ row.playerDetails.playerKills }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.deaths')" min-width="105" sortable="custom" prop="deaths">
                    <template #default="{ row }">
                        {{ row.playerDetails.deaths }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.skillPoints')" min-width="124" sortable="custom" prop="skillPoints">
                    <template #default="{ row }">
                        {{ row.playerDetails.skillPoints }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.pointsCount')" min-width="136" sortable="custom" prop="pointsCount" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ row.playerDetails.pointsCount }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.currentPosition')" min-width="134" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatPosition(row.playerDetails.position) }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.lastLogin')" min-width="165" sortable="custom" prop="lastLogin" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ row.playerDetails.lastLogin }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.totalTimePlayed')" min-width="166" sortable="custom" prop="totalTimePlayed" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatMinute(row.playerDetails.totalTimePlayed) }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.longestLife')" min-width="198" sortable="custom" prop="longestLife" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatMinute(row.playerDetails.longestLife) }}
                    </template>
                </el-table-column>
                <el-table-column prop="entityId" :label="t('views.playerList.tableHeader.entityId')" min-width="105" sortable="custom"> </el-table-column>
                <el-table-column prop="playerId" :label="t('views.playerList.tableHeader.playerId')" min-width="280" show-overflow-tooltip> </el-table-column>
                <el-table-column prop="platformId" :label="t('views.playerList.tableHeader.platformId')" min-width="200" show-overflow-tooltip> </el-table-column>
                <el-table-column label="操作" width="65" fixed="right">
                    <template #default="{ row }">
                        <el-dropdown
                            @command="handleCommand"
                            @visible-change="
                                (val) => {
                                    if (val) handleDropdownVisible(row);
                                }
                            "
                        >
                            <el-button size="small" plain>
                                <el-icon size="16">
                                    <Operations />
                                </el-icon>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="showInventory">{{ t('playerOperation.showInventory') }}</el-dropdown-item>
                                    <el-dropdown-item command="showSkills">{{ t('playerOperation.showSkills') }}</el-dropdown-item>
                                    <el-dropdown-item command="showDetails">{{ t('playerOperation.showDetails') }}</el-dropdown-item>
                                    <el-dropdown-item command="ban" divided>{{ t('playerOperation.ban') }}</el-dropdown-item>
                                    <el-dropdown-item command="setSuperAdmin">{{ t('playerOperation.setSuperAdmin') }}</el-dropdown-item>
                                    <el-dropdown-item command="cancelAdmin">{{ t('playerOperation.cancelAdmin') }}</el-dropdown-item>
                                    <el-dropdown-item command="removeLandClaims">{{ t('playerOperation.removeLandClaims') }}</el-dropdown-item>
                                    <el-dropdown-item command="resetPlayer">{{ t('playerOperation.resetPlayer') }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pager">
                <el-pagination
                    style="margin: 20px"
                    background
                    @size-change="getData"
                    @current-change="getData"
                    :page-sizes="[5, 10, 20, 50, 100]"
                    v-model:current-page="searchFormModel.pageNumber"
                    v-model:page-size="searchFormModel.pageSize"
                    :total="total"
                    layout="total, sizes, prev, pager, next, jumper"
                >
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'playerList.historyPlayers',
};
</script>

<script setup>
import ContextMenu from '@imengyu/vue3-context-menu';
import { getHistoryPlayers } from '~/api/players';
import { ArrowDown, Refresh, Search } from '@element-plus/icons-vue';
import Operations from '~icons/carbon/operations-record';
import serverFavoriteImgUrl from '~/assets/images/server_favorite_1.png';
import { formatMinute, formatPosition } from '~/utils/formatHelper';

const { t } = useI18n();

const loading = ref(false);
const tableData = ref([]);
const total = ref(0);

const searchFormModel = reactive({
    pageNumber: 1,
    pageSize: 20,
    keyword: '',
    order: 'lastLogin',
    desc: true,
});

const searchFormRef = ref();
const handleReset = () => {
    searchFormRef.value.resetFields();
};

const getData = async () => {
    loading.value = true;
    try {
        const data = await getHistoryPlayers(searchFormModel);
        tableData.value = data.items;
        total.value = data.total;
    } finally {
        loading.value = false;
    }
};
getData();

const handleSortChange = async ({ prop, order }) => {
    console.log(prop, order);
    
    searchFormModel.order = prop;
    searchFormModel.desc = order === 'descending';
    await getData();
};

const tableRef = ref();
const { copy } = useClipboard();

const onContextmenu = (row, column, event) => {
    event.preventDefault();
    tableRef.value.setCurrentRow(row);

    const playerId = row.playerId;
    const playerName = row.playerName;
    ContextMenu.showContextMenu({
        x: event.x,
        y: event.y,
        theme: 'mac dark',
        items: [
        {
                label: t('playerOperation.showInventory'),
                onClick: () => {
                    showPlayerInventory(playerId, playerName);
                },
            },
            {
                label: t('playerOperation.showSkills'),
                onClick: () => {
                    showPlayerSkills(playerId, playerName);
                },
            },
            {
                label: t('playerOperation.showDetails'),
                onClick: () => {
                    showPlayerDetails(row);
                },
                divided: true,
            },
            {
                label: t('playerOperation.ban'),
                onClick: () => {
                    banPlayers([playerId], [playerName]);
                },
            },
            {
                label: t('playerOperation.setSuperAdmin'),
                onClick: () => {
                    setSuperAdmins([playerId], [playerName]);
                },
            },
            {
                label: t('playerOperation.cancelAdmin'),
                onClick: () => {
                    cancelAdmins([playerId]);
                },
            },
            {
                label: t('playerOperation.removeLandClaims'),
                onClick: () => {
                    removePlayerLandClaims([playerId]);
                },
            },
            {
                label: t('playerOperation.resetPlayer'),
                onClick: () => {
                    resetPlayers([playerId]);
                },
                divided: true,
            },
            {
                label: t('copy'),
                children: [
                    {
                        label: t('playerOperation.copyPlayerId'),
                        onClick: async () => {
                            await copy(playerId);
                            ElMessage.success(t('global.message.copySuccess'));
                        },
                    },
                    {
                        label: t('playerOperation.copyPlayerName'),
                        onClick: async () => {
                            await copy(playerName);
                            ElMessage.success(t('global.message.copySuccess'));
                        },
                    },
                    {
                        label: t('playerOperation.copyPlayerPos'),
                        onClick: async () => {
                            await copy(formatPosition(row.playerDetails.position));
                            ElMessage.success(t('global.message.copySuccess'));
                        },
                    },
                ],
            },
        ],
    });
};

const batchBtnDisabled = ref(true);
let multipleSelection = [];
const handleSelectionChange = (val) => {
    multipleSelection = val;
    batchBtnDisabled.value = multipleSelection.length === 0;
};
const handleDropdownVisible = (row) => {
    multipleSelection = [row];
};
const handleCommand = (command) => {
    const playerIds = multipleSelection.map((i) => i.playerId);
    const playerNames = multipleSelection.map((i) => i.playerName);
    switch (command) {
        case 'showInventory':
            showPlayerInventory(playerIds[0], playerNames[0]);
            break;
        case 'showSkills':
            showPlayerSkills(playerIds[0], playerNames[0]);
            break;
        case 'showDetails':
            showPlayerDetails(multipleSelection[0]);
            break;
        case 'sendMessage':
            sendMessageToPlayers(playerIds);
            break;
        case 'giveItem':
            giveItemToPlayers(playerIds, playerNames);
            break;
        case 'changePoints':
            changePlayerPoints(playerIds);
            break;
        case 'spawnEntity':
            spawnEntityToPlayers(multipleSelection.map((i) => i.entityId));
            break;
        case 'teleport':
            telePlayers(playerIds);
            break;
        case 'kick':
            kickPlayers(playerIds);
            break;
        case 'ban':
            banPlayers(playerIds, playerNames);
            break;
        case 'setSuperAdmin':
            setSuperAdmins(playerIds, playerNames);
            break;
        case 'cancelAdmin':
            cancelAdmins(playerIds);
            break;
        case 'removeLandClaims':
            removePlayerLandClaims(playerIds);
            break;
        case 'resetPlayer':
            resetPlayers(playerIds);
            break;
        default:
            console.error(`Unknown command: ${command}`);
    }
};
</script>

<style scoped lang="scss">
.online-players {
    height: 100%;
    .route-button {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20px;
        :deep(.el-button) {
            --el-button-text-color: #005eeb;
        }
        :deep(button:nth-child(3)) {
            --el-button-text-color: #f56c6c;
        }
    }
    .table-card {
        height: 100%;
        background-color: #ffffffaf;
        margin-top: 20px;
        :deep(.el-card__body) {
            height: 100%;
            padding: 0;
        }
        :deep(.el-table) {
            background-color: transparent;
        }
        .toolbar {
            display: flex;
            padding: 4px;
            .search-form {
                margin-left: 32px;
                .el-form-item {
                    margin-bottom: 2px;
                }
            }
        }
        .pager {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
