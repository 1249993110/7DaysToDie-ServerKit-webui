<template>
    <div class="online-players">
        <RouterButton
            :buttons="[
                {
                    value: '在线玩家',
                    path: '/playerlist/online-players',
                },
                {
                    value: '历史玩家',
                    path: '/playerlist/history-players',
                },
            ]"
        >
        </RouterButton>
        <el-card class="table-card" shadow="always" v-loading="loading">
            <div class="toolbar">
                <el-dropdown :disabled="batchBtnDisabled" @command="handleCommand">
                    <el-button type="success" :disabled="batchBtnDisabled">
                        批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="banPlayer">封禁玩家</el-dropdown-item>
                            <el-dropdown-item command="setSuperAdmin">设置为超级管理员</el-dropdown-item>
                            <el-dropdown-item command="cancelAdmin">取消管理员</el-dropdown-item>
                            <el-dropdown-item command="removeLandClaims">移除领地石</el-dropdown-item>
                            <el-dropdown-item command="resetPlayer">删除玩家存档</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-form class="search-form" ref="searchFormRef" :model="searchFormModel" label-position="right" :inline="true">
                    <el-form-item label="关键词" prop="keyword">
                        <el-input v-model="searchFormModel.keyword" style="width: 400px" placeholder="请输入玩家Id或昵称" clearable autofocus @keyup.enter="getData"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :icon="Search" @click="getData" type="primary">查 询</el-button>
                        <el-button :icon="Refresh" @click="handleReset">重 置</el-button>
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
                <el-table-column type="index" label="序号" width="60" fixed> </el-table-column>
                <el-table-column label="玩家昵称" min-width="115" sortable="custom" fixed show-overflow-tooltip prop="playerName">
                    <template #default="{ row }">
                        <span style="display: flex">
                            {{ row.playerName }}
                            <img v-if="row.playerDetails.isAdmin" src="../../assets/images/server_favorite_1.png" width="20" height="20" title="超级管理员" />
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="等级" min-width="80" sortable="custom" prop="level">
                    <template #default="{ row }">
                        {{ row.playerDetails.level }}
                    </template>
                </el-table-column>
                <el-table-column label="是否在线" min-width="105" sortable="custom" prop="isOffline">
                    <template #default="{ row }">
                        {{ row.isOffline ? '否' : '是' }}
                    </template>
                </el-table-column>
                <el-table-column label="击杀敌人" min-width="105" sortable="custom" prop="zombieKills">
                    <template #default="{ row }">
                        {{ row.playerDetails.zombieKills }}
                    </template>
                </el-table-column>
                <el-table-column label="击杀玩家" min-width="105" sortable="custom" prop="playerKills">
                    <template #default="{ row }">
                        {{ row.playerDetails.playerKills }}
                    </template>
                </el-table-column>
                <el-table-column label="死亡次数" min-width="105" sortable="custom" prop="deaths">
                    <template #default="{ row }">
                        {{ row.playerDetails.deaths }}
                    </template>
                </el-table-column>
                <el-table-column label="技能点" min-width="90" sortable="custom" prop="skillPoints">
                    <template #default="{ row }">
                        {{ row.playerDetails.skillPoints }}
                    </template>
                </el-table-column>
                <el-table-column label="积分" min-width="90" sortable="custom" prop="pointsCount" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ row.playerDetails.pointsCount }}
                    </template>
                </el-table-column>
                <el-table-column label="当前位置" min-width="100" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatHelper.formatPosition(row.playerDetails.position) }}
                    </template>
                </el-table-column>
                <el-table-column label="上次在线" min-width="165" sortable="custom" prop="lastLogin" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ row.playerDetails.lastLogin }}
                    </template>
                </el-table-column>
                <el-table-column label="总游戏时长" min-width="120" sortable="custom" prop="totalTimePlayed" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatHelper.formatMinute(row.playerDetails.totalTimePlayed) }}
                    </template>
                </el-table-column>
                <el-table-column label="最长生存时长" min-width="135" sortable="custom" prop="longestLife" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatHelper.formatMinute(row.playerDetails.longestLife) }}
                    </template>
                </el-table-column>
                <el-table-column prop="entityId" label="实体Id" min-width="90" sortable="custom"> </el-table-column>
                <el-table-column prop="playerId" label="玩家Id" min-width="280" show-overflow-tooltip> </el-table-column>
                <el-table-column prop="platformId" label="平台Id" min-width="200" show-overflow-tooltip> </el-table-column>
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
                                    <el-dropdown-item command="showInventory">查看背包</el-dropdown-item>
                                    <el-dropdown-item command="showDetails">查看详细信息</el-dropdown-item>
                                    <el-dropdown-item command="banPlayer" divided>封禁玩家</el-dropdown-item>
                                    <el-dropdown-item command="setSuperAdmin">设置为超级管理员</el-dropdown-item>
                                    <el-dropdown-item command="cancelAdmin">取消管理员</el-dropdown-item>
                                    <el-dropdown-item command="removeLandClaims">移除领地石</el-dropdown-item>
                                    <el-dropdown-item command="resetPlayer">删除玩家存档</el-dropdown-item>
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
    name: 'HistoryPlayers',
};
</script>

<script setup>
import ContextMenu from '@imengyu/vue3-context-menu';
import * as playerHelper from '~/utils/player-helper';
import * as formatHelper from '~/utils/format-helper';
import { getHistoryPlayers } from '~/api/players';
import { ArrowDown, Refresh, Search } from '@element-plus/icons-vue';
import Operations from '~icons/carbon/operations-record';

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
                label: '查看背包',
                onClick: () => {
                    playerHelper.showPlayerInventory(playerId, playerName);
                },
            },
            {
                label: '查看详细信息',
                onClick: () => {
                    playerHelper.showPlayerDetails(row);
                },
                divided: true,
            },
            {
                label: '封禁玩家',
                onClick: () => {
                    playerHelper.banPlayers([playerId], [playerName]);
                },
            },
            {
                label: '设置为超级管理员',
                onClick: () => {
                    playerHelper.setSuperAdmins([playerId], [playerName]);
                },
            },
            {
                label: '取消管理员',
                onClick: () => {
                    playerHelper.cancelAdmins([playerId]);
                },
            },
            {
                label: '移除领地石',
                onClick: () => {
                    playerHelper.removeLandClaims([playerId]);
                },
            },
            {
                label: '删除玩家存档',
                onClick: () => {
                    playerHelper.resetPlayers([playerId]);
                },
                divided: true,
            },
            {
                label: '复制',
                children: [
                    {
                        label: '复制玩家昵称',
                        onClick: async () => {
                            await copy(playerName);
                            ElMessage.success('复制成功');
                        },
                    },
                    {
                        label: '复制玩家Id',
                        onClick: async () => {
                            await copy(playerId);
                            ElMessage.success('复制成功');
                        },
                    },
                    {
                        label: '复制玩家坐标',
                        onClick: async () => {
                            await copy(formatHelper.formatPosition(row.playerDetails.position));
                            ElMessage.success('复制成功');
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
            playerHelper.showPlayerInventory(playerIds[0], playerNames[0]);
            break;
        case 'showDetails':
            playerHelper.showPlayerDetails(multipleSelection[0]);
            break;
        case 'sendMessage':
            playerHelper.sendMessageToPlayers(playerIds);
            break;
        case 'giveItem':
            playerHelper.giveItemToPlayers(playerIds, playerNames);
            break;
        case 'changePoints':
            playerHelper.changePlayerPoints(playerIds);
            break;
        case 'spawnEntity':
            playerHelper.spawnEntityToPlayers(playerIds);
            break;
        case 'telePlayer':
            playerHelper.telePlayers(playerIds);
            break;
        case 'kickPlayer':
            playerHelper.kickPlayers(playerIds);
            break;
        case 'banPlayer':
            playerHelper.banPlayers(playerIds, playerNames);
            break;
        case 'setSuperAdmin':
            playerHelper.setSuperAdmins(playerIds, playerNames);
            break;
        case 'cancelAdmin':
            playerHelper.cancelAdmins(playerIds);
            break;
        case 'removeLandClaims':
            playerHelper.removeLandClaims(playerIds);
            break;
        case 'resetPlayer':
            playerHelper.resetPlayers(playerIds);
            break;
        default:
            ElMessage.error(`未找到命令: ${command}`);
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
