<template>
    <div class="online-players">
        <RouterButton :names="['playerList.onlinePlayers', 'playerList.historyPlayers']">
            <template #route-button>
                <div class="route-button">
                    <span style="font-size: 14px; margin-right: 4px">自动刷新</span>
                    <el-switch v-model="autoRefrensh" />
                </div>
            </template>
        </RouterButton>
        <el-card class="table-card" shadow="always" v-loading="loading">
            <div class="toolbar">
                <el-dropdown :disabled="batchBtnDisabled" @command="handleCommand">
                    <el-button type="success" :disabled="batchBtnDisabled">
                        批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="sendMessage">发送消息</el-dropdown-item>
                            <el-dropdown-item command="giveItem">给予物品</el-dropdown-item>
                            <el-dropdown-item command="changePoints">给予积分</el-dropdown-item>
                            <el-dropdown-item command="spawnEntity">生成实体</el-dropdown-item>
                            <el-dropdown-item command="telePlayer">传送玩家</el-dropdown-item>
                            <el-dropdown-item command="kickPlayer" divided>踢出玩家</el-dropdown-item>
                            <el-dropdown-item command="banPlayer">封禁玩家</el-dropdown-item>
                            <el-dropdown-item command="setSuperAdmin">设置为超级管理员</el-dropdown-item>
                            <el-dropdown-item command="cancelAdmin">取消管理员</el-dropdown-item>
                            <el-dropdown-item command="removeLandClaims">移除领地石</el-dropdown-item>
                            <el-dropdown-item command="resetPlayer">删除玩家存档</el-dropdown-item>
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
                <el-table-column type="index" label="序号" width="60" fixed> </el-table-column>
                <el-table-column label="玩家昵称" min-width="115" sortable fixed show-overflow-tooltip>
                    <template #default="{ row }">
                        <span style="display: flex">
                            {{ row.playerName }}
                            <img v-if="row.playerDetails.isAdmin" src="../../assets/images/server_favorite_1.png" width="20" height="20" title="超级管理员" />
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="等级" min-width="80" sortable>
                    <template #default="{ row }">
                        {{ row.playerDetails.level }}
                    </template>
                </el-table-column>
                <el-table-column label="游戏阶段" min-width="105" sortable>
                    <template #default="{ row }">
                        {{ row.gameStage }}
                    </template>
                </el-table-column>
                <el-table-column label="击杀敌人" min-width="105" sortable>
                    <template #default="{ row }">
                        {{ row.playerDetails.zombieKills }}
                    </template>
                </el-table-column>
                <el-table-column label="击杀玩家" min-width="105" sortable>
                    <template #default="{ row }">
                        {{ row.playerDetails.playerKills }}
                    </template>
                </el-table-column>
                <el-table-column label="死亡次数" min-width="105" sortable>
                    <template #default="{ row }">
                        {{ row.playerDetails.deaths }}
                    </template>
                </el-table-column>
                <el-table-column label="技能点" min-width="90" sortable>
                    <template #default="{ row }">
                        {{ row.playerDetails.skillPoints }}
                    </template>
                </el-table-column>
                <el-table-column label="积分" min-width="90" sortable show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ row.playerDetails.pointsCount }}
                    </template>
                </el-table-column>
                <el-table-column label="当前位置" min-width="100" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ formatHelper.formatPosition(row.playerDetails.position) }}
                    </template>
                </el-table-column>
                <el-table-column prop="ip" label="IP地址" min-width="130" sortable show-overflow-tooltip> </el-table-column>
                <el-table-column prop="ipAttribution" label="IP归属地" min-width="135" sortable show-overflow-tooltip> </el-table-column>
                <el-table-column prop="ping" label="延迟" min-width="80" sortable> </el-table-column>
                <el-table-column prop="entityId" label="实体Id" min-width="90" sortable> </el-table-column>
                <el-table-column prop="playerId" label="玩家Id" min-width="280" sortable show-overflow-tooltip> </el-table-column>
                <el-table-column prop="platformId" label="平台Id" min-width="200" sortable show-overflow-tooltip> </el-table-column>
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
                                    <el-dropdown-item command="showSkills">查看技能</el-dropdown-item>
                                    <el-dropdown-item command="showDetails">查看详细信息</el-dropdown-item>
                                    <el-dropdown-item command="sendMessage" divided>发送消息</el-dropdown-item>
                                    <el-dropdown-item command="giveItem">给予物品</el-dropdown-item>
                                    <el-dropdown-item command="changePoints">给予积分</el-dropdown-item>
                                    <el-dropdown-item command="spawnEntity">生成实体</el-dropdown-item>
                                    <el-dropdown-item command="telePlayer">传送玩家</el-dropdown-item>
                                    <el-dropdown-item command="kickPlayer" divided>踢出玩家</el-dropdown-item>
                                    <el-dropdown-item command="banPlayer">封禁玩家</el-dropdown-item>
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
import * as playerHelper from '~/utils/playerHelper';
import * as formatHelper from '~/utils/formatHelper';
import { getOnlinePlayers } from '~/api/players';
import axios from 'axios';
import { ArrowDown } from '@element-plus/icons-vue';
import Operations from '~icons/carbon/operations-record';

const loading = ref(false);
const tableData = ref([]);

const getData = async () => {
    loading.value = true;
    try {
        const data = await getOnlinePlayers();
        tableData.value = data;
        if (data.length) {
            axios
                .post(
                    'http://ip-api.com/batch?lang=zh-CN&fields=status,country,regionName,city',
                    data.map((i) => i.ip)
                )
                .then((response) => {
                    const data = response.data;
                    const len = data.length > 100 ? 100 : data.length;
                    for (let i = 0; i < len; i++) {
                        const element = data[i];
                        if (element.status === 'fail') {
                            tableData.value[i].ipAttribution = '未知';
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
                label: '查看背包',
                onClick: () => {
                    playerHelper.showPlayerInventory(playerId, playerName);
                },
            },
            {
                label: '查看技能',
                onClick: () => {
                    playerHelper.showPlayerSkills(playerId, playerName);
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
                label: '发送消息',
                onClick: () => {
                    playerHelper.sendMessageToPlayers([playerId]);
                },
            },
            {
                label: '给予物品',
                onClick: () => {
                    playerHelper.giveItemToPlayers([playerId], [playerName]);
                },
            },
            {
                label: '给予积分',
                onClick: () => {
                    playerHelper.changePlayerPoints([playerId]);
                },
            },
            {
                label: '生成实体',
                onClick: () => {
                    playerHelper.spawnEntityToPlayers([row.entityId]);
                },
            },
            {
                label: '传送玩家',
                onClick: () => {
                    playerHelper.telePlayers([playerId]);
                },
                divided: true,
            },
            {
                label: '踢出玩家',
                onClick: () => {
                    playerHelper.kickPlayers([playerId]);
                },
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
        case 'showSkills':
            playerHelper.showPlayerSkills(playerIds[0], playerNames[0]);
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
            playerHelper.spawnEntityToPlayers(multipleSelection.map((i) => i.entityId));
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
        }
    }
}
</style>
