<template>
    <div class="autobackup-management">
        <RouterButton :names="['playerList.onlinePlayers', 'playerList.historyPlayers']">
            <template #routeButton>
                <div class="route-button">
                    <span>{{ t('views.playerList.autoRefresh') }}</span>
                    <el-switch v-model="autoRefrensh" />
                </div>
            </template>
        </RouterButton>
        <MyTable
            row-key="playerId"
            :columns="columns"
            :toolbar="toolbar"
            :search="search"
            :request-get="requestGet"
            :default-sort="{ prop: 'lastLogin', order: 'descending' }"
            @batch-operation-command="handleBatchOperationCommand"
            @row-contextmenu="onContextmenu"
            highlight-current-row
            ref="myTableRef"
            @data-loaded="handleDataLoaded"
        >
            <template #playerNameCell="{ row }">
                <span style="display: flex">
                    {{ row.playerName }}
                    <img v-if="row.playerDetails.isAdmin" :src="serverFavoriteImgUrl" width="20" height="20" :title="t('views.playerList.tableHeader.admin')" />
                </span>
            </template>
            <template #operation="{ row }">
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
        </MyTable>
    </div>
</template>

<script>
export default {
    name: 'playerList.historyPlayers',
};
</script>

<script setup>
import * as api from '~/api/players';
import ContextMenu from '@imengyu/vue3-context-menu';
import Operations from '~icons/carbon/operations-record';
import serverFavoriteImgUrl from '~/assets/images/server_favorite_1.png';
import axios from 'axios';

const { t, locale } = useI18n();

const columns = computed(() => [
    {
        type: 'selection',
    },
    {
        type: 'index',
    },
    {
        prop: 'playerName',
        label: t('views.playerList.tableHeader.playerName'),
        sortable: 'custom',
        minWidth: 150,
        fixed: true,
    },
    {
        prop: 'gameStage',
        label: t('views.playerList.tableHeader.gameStage'),
        minWidth: 130,
        sortable: 'custom',
    },
    {
        prop: 'level',
        label: t('views.playerList.tableHeader.level'),
        formatter: (row) => row.playerDetails.level,
        sortable: 'custom',
        minWidth: 85,
    },
    {
        prop: 'zombieKills',
        label: t('views.playerList.tableHeader.zombieKills'),
        formatter: (row) => row.playerDetails.zombieKills,
        sortable: 'custom',
        minWidth: 135,
    },
    {
        prop: 'playerKills',
        label: t('views.playerList.tableHeader.playerKills'),
        formatter: (row) => row.playerDetails.playerKills,
        sortable: 'custom',
        minWidth: 130,
    },
    {
        prop: 'deaths',
        label: t('views.playerList.tableHeader.deaths'),
        formatter: (row) => row.playerDetails.deaths,
        sortable: 'custom',
        minWidth: 100,
    },
    {
        prop: 'skillPoints',
        label: t('views.playerList.tableHeader.skillPoints'),
        formatter: (row) => row.playerDetails.skillPoints,
        sortable: 'custom',
        minWidth: 125,
    },
    {
        prop: 'pointsCount',
        label: t('views.playerList.tableHeader.pointsCount'),
        formatter: (row) => row.playerDetails.pointsCount,
        sortable: 'custom',
        minWidth: 140,
    },
    {
        prop: 'position',
        label: t('views.playerList.tableHeader.currentPosition'),
        formatter: (row) => formatPosition(row.playerDetails.position),
        minWidth: 135,
    },
    {
        prop: 'ip',
        label: t('views.playerList.tableHeader.ip'),
        minWidth: 135,
    },
    {
        prop: 'ipAttribution',
        label: t('views.playerList.tableHeader.ipAttribution'),
        minWidth: 140,
    },
    {
        prop: 'ping',
        label: t('views.playerList.tableHeader.ping'),
        sortable: 'custom',
        minWidth: 80,
    },
    {
        prop: 'entityId',
        label: t('views.playerList.tableHeader.entityId'),
        sortable: 'custom',
        //visible: false,
        minWidth: 110,
    },
    {
        prop: 'playerId',
        label: t('views.playerList.tableHeader.playerId'),
        //visible: false,
        minWidth: 320,
    },
    {
        prop: 'platformId',
        label: t('views.playerList.tableHeader.platformId'),
        //visible: false,
        minWidth: 220,
    },
    {
        type: 'operation',
    },
]);

const toolbar = computed(() => ({
    addBtnVisible: false,
    batchDeleteBtnVisible: false,
    batchOperationItems: [
        {
            command: 'sendMessage',
            label: t('playerOperation.sendMessage'),
            disabledIfNoSelection: true,
        },
        {
            command: 'giveItem',
            label: t('playerOperation.giveItem'),
            disabledIfNoSelection: true,
        },
        {
            command: 'changePoints',
            label: t('playerOperation.changePoints'),
            disabledIfNoSelection: true,
        },
        {
            command: 'spawnEntity',
            label: t('playerOperation.spawnEntity'),
            disabledIfNoSelection: true,
        },
        {
            command: 'teleport',
            label: t('playerOperation.teleport'),
            disabledIfNoSelection: true,
        },
        {
            command: 'kick',
            label: t('playerOperation.kick'),
            disabledIfNoSelection: true,
            divided: true,
        },
        {
            command: 'ban',
            label: t('playerOperation.ban'),
            disabledIfNoSelection: true,
        },
        {
            command: 'setSuperAdmin',
            label: t('playerOperation.setSuperAdmin'),
            disabledIfNoSelection: true,
        },
        {
            command: 'cancelAdmin',
            label: t('playerOperation.cancelAdmin'),
            disabledIfNoSelection: true,
        },
        {
            command: 'removeLandClaims',
            label: t('playerOperation.removeLandClaims'),
            disabledIfNoSelection: true,
        },
        {
            command: 'resetPlayer',
            label: t('playerOperation.resetPlayer'),
            disabledIfNoSelection: true,
        },
        {
            type: 'export',
            fileName: t('menus.playerList.onlinePlayers'),
            divided: true,
        },
    ],
}));

const search = computed(() => ({
    fields: [
        {
            type: 'input',
            name: 'keyword',
            label: t('global.keyword'),
        },
    ],
    visible: false,
}));

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

const requestGet = async (params) => {
    let data = await api.getOnlinePlayers();
    data = searchByKeyword(data, params.keyword, ['entityId', 'playerId', 'platformId', 'playerName']);

    if (params.sortOrder) {
        const desc = params.sortOrder === 'descending';
        const sortPorp = params.sortPorp;
        data = data.sort((a, b) => {
            if (desc) {
                return a[sortPorp] < b[sortPorp] ? 1 : -1;
            }

            return a[sortPorp] > b[sortPorp] ? 1 : -1;
        });
    }

    if (params.pageSize < 0) {
        return {
            items: data,
            total: data.length,
        };
    }
    return {
        items: data.slice((params.pageNumber - 1) * params.pageSize, params.pageNumber * params.pageSize),
        total: data.length,
    };
};

const handleDataLoaded = (tableData) => {
    if (!tableData.length) {
        return;
    }
    tableData.forEach((i) => {
        i.ipAttribution = t('global.loading');
    });
    axios
        .post(
            `http://ip-api.com/batch?lang=${getIpApiLangParam()}&fields=status,country,regionName,city`,
            tableData.map((i) => i.ip)
        )
        .then((response) => {
            const data = response.data;
            const len = data.length > 100 ? 100 : data.length;
            for (let i = 0; i < len; i++) {
                const item = data[i];
                if (item.status === 'fail') {
                    tableData[i].ipAttribution = t('global.unknown');
                } else {
                    tableData[i].ipAttribution = `${item.country} ${item.regionName} ${item.city}`;
                }
            }
        });
};

let multipleSelection = [];
const handleDropdownVisible = (row) => {
    multipleSelection = [row];
};
const handleBatchOperationCommand = (command, selectedIds, selectedRows) => {
    multipleSelection = selectedRows;
    handleCommand(command);
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

const { copy } = useClipboard();
const myTableRef = ref(null);
const onContextmenu = (row, column, event) => {
    event.preventDefault();
    myTableRef.value.getTableRef().setCurrentRow(row);

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

const { pause, resume, isActive } = useIntervalFn(() => myTableRef.value.refresh(), 10000, { immediate: true, immediateCallback: false });

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
</script>

<style scoped lang="scss">
.route-button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    span {
        font-size: 14px;
        margin-right: 4px;
    }
    :deep(.el-button) {
        --el-button-text-color: #005eeb;
    }
    :deep(button:nth-child(3)) {
        --el-button-text-color: #f56c6c;
    }
}
</style>
