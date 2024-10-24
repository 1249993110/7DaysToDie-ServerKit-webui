<template>
    <div class="autobackup-management">
        <RouterButton :names="['playerList.onlinePlayers', 'playerList.historyPlayers']" />
        <MyTable
            row-key="playerId"
            :columns="columns"
            :toolbar="toolbar"
            :search-form-fields="searchFormFields"
            :request-get="requestGet"
            :default-sort="{ prop: 'lastLogin', order: 'descending' }"
            @batch-operation-command="handleBatchOperationCommand"
            @row-contextmenu="onContextmenu"
            highlight-current-row
            ref="myTableRef"
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
                            <el-dropdown-item command="ban" divided>{{ t('playerOperation.ban') }}</el-dropdown-item>
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

const { t } = useI18n();

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
        tag: true,
        sortable: 'custom',
        minWidth: 145,
    },
    {
        prop: 'isOnline',
        label: t('views.playerList.tableHeader.isOnline'),
        formatter: (row) => (row.isOffline ? t('global.false') : t('global.true')),
        visible: false,
        minWidth: 100,
    },
    {
        prop: 'level',
        label: t('views.playerList.tableHeader.level'),
        formatter: (row) => row.playerDetails.level,
        sortable: 'custom',
        minWidth: 100,
    },
    {
        prop: 'zombieKills',
        label: t('views.playerList.tableHeader.zombieKills'),
        formatter: (row) => row.playerDetails.zombieKills,
        sortable: 'custom',
        minWidth: 145,
    },
    {
        prop: 'playerKills',
        label: t('views.playerList.tableHeader.playerKills'),
        formatter: (row) => row.playerDetails.playerKills,
        sortable: 'custom',
        minWidth: 135,
    },
    {
        prop: 'deaths',
        label: t('views.playerList.tableHeader.deaths'),
        formatter: (row) => row.playerDetails.deaths,
        sortable: 'custom',
        minWidth: 105,
    },
    {
        prop: 'skillPoints',
        label: t('views.playerList.tableHeader.skillPoints'),
        formatter: (row) => row.playerDetails.skillPoints,
        sortable: 'custom',
        minWidth: 135,
    },
    {
        prop: 'pointsCount',
        label: t('views.playerList.tableHeader.pointsCount'),
        formatter: (row) => row.playerDetails.pointsCount,
        sortable: 'custom',
        minWidth: 145,
    },
    {
        prop: 'position',
        label: t('views.playerList.tableHeader.currentPosition'),
        formatter: (row) => formatPosition(row.playerDetails.position),
        minWidth: 145,
    },
    {
        prop: 'lastLogin',
        label: t('views.playerList.tableHeader.lastLogin'),
        formatter: (row) => row.playerDetails.lastLogin,
        sortable: 'custom',
        minWidth: 165,
    },
    {
        prop: 'totalTimePlayed',
        label: t('views.playerList.tableHeader.totalTimePlayed'),
        formatter: (row) => formatMinute(row.playerDetails.totalTimePlayed),
        sortable: 'custom',
        minWidth: 175,
    },
    {
        prop: 'longestLife',
        label: t('views.playerList.tableHeader.longestLife'),
        formatter: (row) => formatMinute(row.playerDetails.longestLife),
        sortable: 'custom',
        minWidth: 210,
    },
    {
        prop: 'entityId',
        label: t('views.playerList.tableHeader.entityId'),
        sortable: 'custom',
        //visible: false,
        minWidth: 115,
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
            fileName: t('menus.playerList.historyPlayers'),
        },
    ],
}));

const searchFormFields = computed(() => [
    {
        type: 'input',
        name: 'keyword',
        label: t('global.keyword'),
    },
]);

const requestGet = async (params) => {
    const data = await api.getHistoryPlayers({
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        keyword: params.keyword,
        order: params.sortPorp,
        desc: params.sortOrder === 'descending',
    });

    return data;
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

</script>
