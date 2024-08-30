<template>
    <div class="online-players">
        <RouterButton :names="['playerList.onlinePlayers', 'playerList.historyPlayers']">
            <template #route-button>
                <div class="route-button">
                    <span style="font-size: 14px; margin-right: 4px">{{ t('views.playerList.autoRefresh') }}</span>
                    <el-switch v-model="autoRefrensh" />
                </div>
            </template>
        </RouterButton>
        <el-card class="table-card" shadow="always" v-loading="loading">
            <div class="toolbar">
                <el-dropdown :disabled="batchBtnDisabled" @command="handleCommand">
                    <el-button type="success" :disabled="batchBtnDisabled">
                        {{ t('global.button.batchOperation') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="sendMessage">{{ t('playerOperation.sendMessage') }}</el-dropdown-item>
                            <el-dropdown-item command="giveItem">{{ t('playerOperation.giveItem') }}</el-dropdown-item>
                            <el-dropdown-item command="changePoints">{{ t('playerOperation.changePoints') }}</el-dropdown-item>
                            <el-dropdown-item command="spawnEntity">{{ t('playerOperation.spawnEntity') }}</el-dropdown-item>
                            <el-dropdown-item command="teleport">{{ t('playerOperation.teleport') }}</el-dropdown-item>
                            <el-dropdown-item command="kick" divided>{{ t('playerOperation.kick') }}</el-dropdown-item>
                            <el-dropdown-item command="ban">{{ t('playerOperation.ban') }}</el-dropdown-item>
                            <el-dropdown-item command="setSuperAdmin">{{ t('playerOperation.setSuperAdmin') }}</el-dropdown-item>
                            <el-dropdown-item command="cancelAdmin">{{ t('playerOperation.cancelAdmin') }}</el-dropdown-item>
                            <el-dropdown-item command="removeLandClaims">{{ t('playerOperation.removeLandClaims') }}</el-dropdown-item>
                            <el-dropdown-item command="resetPlayer">{{ t('playerOperation.resetPlayer') }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <el-table
                ref="tableRef"
                :data="tableData"
                stripe
                height="calc(100vh - 200px)"
                highlight-current-row
                @row-contextmenu="onContextmenu"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="42" />
                <el-table-column type="index" :label="t('views.playerList.tableHeader.index')" width="61" fixed> </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.playerName')" min-width="133" sortable fixed show-overflow-tooltip>
                    <template #default="{ row }">
                        <span style="display: flex">
                            {{ row.playerName }}
                            <img v-if="row.playerDetails.isAdmin" :src="serverFavoriteImgUrl" width="20" height="20" :title="t('views.playerList.tableHeader.admin')" />
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.level')" min-width="84" sortable>
                    <template #default="{ row }">
                        {{ row.playerDetails.level }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.gameStage')" min-width="129" sortable>
                    <template #default="{ row }">
                        {{ row.gameStage }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.zombieKills')" min-width="132" sortable>
                    <template #default="{ row }">
                        {{ row.playerDetails.zombieKills }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.playerKills')" min-width="124" sortable>
                    <template #default="{ row }">
                        {{ row.playerDetails.playerKills }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.deaths')" min-width="105" sortable>
                    <template #default="{ row }">
                        {{ row.playerDetails.deaths }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.skillPoints')" min-width="124" sortable>
                    <template #default="{ row }">
                        {{ row.playerDetails.skillPoints }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.pointsCount')" min-width="136" sortable show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ row.playerDetails.pointsCount }}
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.currentPosition')" min-width="134" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatPosition(row.playerDetails.position) }}
                    </template>
                </el-table-column>
                <el-table-column prop="ip" :label="t('views.playerList.tableHeader.ip')" min-width="130" sortable show-overflow-tooltip> </el-table-column>
                <el-table-column prop="ipAttribution" :label="t('views.playerList.tableHeader.ipAttribution')" min-width="135" show-overflow-tooltip> </el-table-column>
                <el-table-column prop="ping" :label="t('views.playerList.tableHeader.ping')" min-width="80" sortable> </el-table-column>
                <el-table-column prop="entityId" :label="t('views.playerList.tableHeader.entityId')" min-width="105" sortable> </el-table-column>
                <el-table-column prop="playerId" :label="t('views.playerList.tableHeader.playerId')" min-width="280" sortable show-overflow-tooltip> </el-table-column>
                <el-table-column prop="platformId" :label="t('views.playerList.tableHeader.platformId')" min-width="200" sortable show-overflow-tooltip> </el-table-column>
                <el-table-column :label="t('views.playerList.tableHeader.operate')" width="77" fixed="right">
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
                                    <el-dropdown-item command="sendMessage" divided>{{ t('playerOperation.sendMessage') }}</el-dropdown-item>
                                    <el-dropdown-item command="giveItem">{{ t('playerOperation.giveItem') }}</el-dropdown-item>
                                    <el-dropdown-item command="changePoints">{{ t('playerOperation.changePoints') }}</el-dropdown-item>
                                    <el-dropdown-item command="spawnEntity">{{ t('playerOperation.spawnEntity') }}</el-dropdown-item>
                                    <el-dropdown-item command="teleport">{{ t('playerOperation.teleport') }}</el-dropdown-item>
                                    <el-dropdown-item command="kick" divided>{{ t('playerOperation.kick') }}</el-dropdown-item>
                                    <el-dropdown-item command="ban">{{ t('playerOperation.ban') }}</el-dropdown-item>
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
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'playerList.onlinePlayers',
};
</script>

<script setup>
import ContextMenu from '@imengyu/vue3-context-menu';
import { getOnlinePlayers } from '~/api/players';
import axios from 'axios';
import { ArrowDown } from '@element-plus/icons-vue';
import Operations from '~icons/carbon/operations-record';
import serverFavoriteImgUrl from '~/assets/images/server_favorite_1.png';
import { formatPosition } from '~/utils/formatHelper';

const loading = ref(false);
const tableData = ref([]);
const { t, locale } = useI18n();

const getIpApiLangParam = () => {
    switch (locale.value) {
        case 'en':
            return 'en';
        case 'de':
            return 'de';
        case 'es':
            return 'es';
        case 'pt':
            return 'pt-BR';
        case 'fr':
            return 'fr';
        case 'ja':
            return 'ja';
        case 'ru':
            return 'ru';
        case 'zh':
        case 'tw':
            return 'zh-CN';
        default:
            return 'en';
    }
};

const getData = async () => {
    loading.value = true;
    try {
        const data = await getOnlinePlayers();
        tableData.value = data;
        if (data.length) {
            axios
                .post(
                    `http://ip-api.com/batch?lang=${getIpApiLangParam()}&fields=status,country,regionName,city`,
                    data.map((i) => i.ip)
                )
                .then((response) => {
                    const data = response.data;
                    const len = data.length > 100 ? 100 : data.length;
                    for (let i = 0; i < len; i++) {
                        const element = data[i];
                        if (element.status === 'fail') {
                            tableData.value[i].ipAttribution = t('global.unknown');
                        } else {
                            tableData.value[i].ipAttribution = `${element.country} ${element.regionName} ${element.city}`;
                        }
                    }
                });
        }
    } finally {
        loading.value = false;
    }
};

const { pause, resume, isActive } = useIntervalFn(getData, 10000, { immediate: false, immediateCallback: true });

onActivated(resume);
onDeactivated(pause);

const autoRefrensh = ref(true);
watch(autoRefrensh, (val) => {
    if (val) {
        resume();
    } else {
        pause();
    }
});

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
                label: t('playerOperation.sendMessage'),
                onClick: () => {
                    sendMessageToPlayers([playerId]);
                },
            },
            {
                label: t('playerOperation.giveItem'),
                onClick: () => {
                    giveItemToPlayers([playerId], [playerName]);
                },
            },
            {
                label: t('playerOperation.changePoints'),
                onClick: () => {
                    changePlayerPoints([playerId]);
                },
            },
            {
                label: t('playerOperation.spawnEntity'),
                onClick: () => {
                    spawnEntityToPlayers([row.entityId]);
                },
            },
            {
                label: t('playerOperation.teleport'),
                onClick: () => {
                    telePlayers([playerId]);
                },
                divided: true,
            },
            {
                label: t('playerOperation.kick'),
                onClick: () => {
                    kickPlayers([playerId]);
                },
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
        }
    }
}
</style>
