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
            <template #route-button>
                <div class="route-button">
                    <span style="font-size: 14px; margin-right: 4px">自动刷新</span>
                    <el-switch v-model="autoRefrensh" />
                </div>
            </template>
        </RouterButton>
        <el-card class="table-card" shadow="always" v-loading="loading">
            <el-table ref="tableRef" :data="tableData" stripe height="100%" highlight-current-row @row-contextmenu="onContextmenu">
                <el-table-column type="index" label="序号" width="60"> </el-table-column>
                <el-table-column prop="entityId" label="实体Id" min-width="95" sortable> </el-table-column>
                <el-table-column prop="playerName" label="玩家昵称" min-width="115" sortable> </el-table-column>
                <el-table-column prop="platformId" label="平台Id" min-width="215" sortable> </el-table-column>
                <el-table-column prop="crossplatformId" label="EOS" min-width="315" sortable> </el-table-column>
                <el-table-column prop="ip" label="IP地址" min-width="135" sortable> </el-table-column>
                <el-table-column prop="ipAttribution" label="IP归属地" min-width="135" sortable> </el-table-column>
                <el-table-column prop="ping" label="延迟" min-width="80" sortable> </el-table-column>
            </el-table>
        </el-card>
        <el-dialog v-model="detailsDialogVisible" :title="dialogTitle" draggable :close-on-click-modal="false">
            <el-scrollbar max-height="60vh" always>
                <el-descriptions :column="2" border>
                    <el-descriptions-item v-for="(item, index) in details" :key="index" :label="item.label">{{ item.value }}</el-descriptions-item>
                </el-descriptions>
            </el-scrollbar>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'OnlinePlayers',
};
</script>

<script setup>
import ContextMenu from '@imengyu/vue3-context-menu';
import * as sdtdConsole from '~/api/sdtd-console';
import { getOnlinePlayers, getOnlinePlayerDetails } from '~/api/players';
import { showInventory } from '~/components/InventoryDialog/index.js';
import myprompt from '~/utils/myprompt';
import myconfirm from '~/utils/myconfirm';
import axios from 'axios';
import { showBanWindow } from '~/components/AddBlacklist/index';

const detailsDialogVisible = ref(false);
const dialogTitle = ref('');
const details = ref([]);

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

const formatPosition = (row) => {
    const value = row.position;
    return `${value.x} ${value.y} ${value.z}`;
};

const getDetails = async (playerId) => {
    const data = await getOnlinePlayerDetails(playerId);
    // for (const key in data) {
    //     result.push({ label: key, value: data[key] });
    // }
    return [
        {
            label: 'EOS',
            value: data.crossplatformId,
        },
        {
            label: '平台ID',
            value: data.platformId,
        },
        {
            label: '玩家昵称',
            value: data.playerName,
        },
        {
            label: '实体ID',
            value: data.entityId,
        },
        {
            label: 'IP地址',
            value: data.ip,
        },
        {
            label: '延迟',
            value: data.ping,
        },
        {
            label: '坐标',
            value: formatPosition(data),
        },
        {
            label: '上次在线',
            value: data.lastLogin,
        },
        {
            label: '击杀玩家',
            value: data.playerKills,
        },
        {
            label: '击杀僵尸',
            value: data.zombieKills,
        },
        {
            label: '死亡次数',
            value: data.deaths,
        },
        {
            label: '分数',
            value: data.score,
        },
        {
            label: '生命值',
            value: data.health.toFixed(1),
        },
        {
            label: '体力值',
            value: data.stamina.toFixed(1),
        },
        {
            label: '温度',
            value: data.coreTemp.toFixed(1),
        },
        {
            label: '食物',
            value: data.food.toFixed(2),
        },
        {
            label: '水',
            value: data.water.toFixed(2),
        },
        {
            label: '等级',
            value: data.level,
        },
        {
            label: '至下一级的经验',
            value: data.expToNextLevel,
        },
        {
            label: '技能点',
            value: data.skillPoints,
        },
        {
            label: '领地石保护状态',
            value: data.landProtectionActive ? '激活' : '未激活',
        },
        {
            label: '领地石保护倍数',
            value: data.landProtectionMultiplier,
        },
        {
            label: '行走距离',
            value: data.distanceWalked.toFixed(2),
        },
        {
            label: '制作项目总数',
            value: data.totalItemsCrafted,
        },
        {
            label: '最长生存时长',
            value: formatMinute(data.longestLife),
        },
        {
            label: '当前存活时长',
            value: formatMinute(data.currentLife),
        },
        {
            label: '总游戏时长',
            value: formatMinute(data.totalTimePlayed),
        },
        {
            label: '游戏阶段出生在世界时间',
            value: data.gameStageBornAtWorldTime.toFixed(2),
        },
        {
            label: '租赁结束日期',
            value: data.rentalEndDay + ' 天 ' + data.rentalEndTime + ' 小时',
        },
    ];
};

const onContextmenu = (row, column, event) => {
    event.preventDefault();
    tableRef.value.setCurrentRow(row);

    const entityId = row.entityId;
    const playerName = row.playerName;

    ContextMenu.showContextMenu({
        x: event.x,
        y: event.y,
        theme: 'default dark',
        items: [
            {
                label: '查看详细信息',
                onClick: async () => {
                    dialogTitle.value = `玩家: ${playerName} (${row.crossplatformId}) 的数据`;
                    detailsDialogVisible.value = true;
                    details.value = await getDetails(row.crossplatformId);
                },
                divided: true,
            },
            {
                label: '查看背包',
                onClick: () => {
                    showInventory(row.crossplatformId, playerName);
                },
                svgIcon: '#icon-view',
                svgProps: {
                    fill: '#f60',
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
                        label: '复制玩家实体Id',
                        onClick: async () => {
                            await copy(entityId);
                            ElMessage.success('复制成功');
                        },
                    },
                    {
                        label: '复制玩家平台Id',
                        onClick: async () => {
                            await copy(row.platformId);
                            ElMessage.success('复制成功');
                        },
                    },
                    {
                        label: '复制玩家坐标',
                        onClick: async () => {
                            await copy(format_position(row));
                            ElMessage.success('复制成功');
                        },
                    },
                ],
            },
            {
                label: '给予物品',
                onClick: () => {
                    myprompt('{itemName} {count} {quality} {durability}', '请输入物品名称').then((value) => {
                        sdtdConsole.sendConsoleCommand(`ty-gi ${entityId} ${value}`).then(() => {
                            ElMessage.success('发送命令成功');
                        });
                    });
                },
            },
            {
                label: '生成实体',
                onClick: () => {
                    myprompt('{spawnEntityIdOrName}', '请输入实体Id或名称').then((value) => {
                        sdtdConsole.spawnEntity(entityId, value).then(() => {
                            ElMessage.success('发送命令成功');
                        });
                    });
                },
            },
            {
                label: '传送玩家',
                onClick: () => {
                    myprompt('{target}', '请输入目标, 可为Id或三维坐标').then((value) => {
                        sdtdConsole.telePlayer(entityId, value).then(() => {
                            ElMessage.success('发送命令成功');
                        });
                    });
                },
                icon: 'map-location',
                divided: true,
            },
            {
                label: '踢出玩家',
                onClick: async () => {
                    if (await myconfirm('此操作将踢出选定玩家, 是否继续?', '提示', 'warning')) {
                        sdtdConsole.kickPlayer(entityId).then(() => {
                            ElMessage.success('发送命令成功');
                        });
                    }
                },
            },
            {
                label: '封禁玩家',
                onClick: () => {
                    showBanWindow(row.crossplatformId, playerName);
                },
                divided: true,
            },
            {
                label: '发送私聊消息',
                onClick: async () => {
                    myprompt('{message}', '请输入文本').then((value) => {
                        sdtdConsole.sendMessageToPlayer(entityId, value).then(() => {
                            ElMessage.success('发送命令成功');
                        });
                    });
                },
                icon: 'message',
            },
            {
                label: '设置为超级管理员',
                onClick: async () => {
                    if (await myconfirm('此操作将把选定玩家设置为超级管理员, 是否继续?', '提示', 'warning')) {
                        sdtdConsole.addAdmin(entityId, 0, '超级管理员-' + playerName).then(() => {
                            ElMessage.success('发送命令成功');
                        });
                    }
                },
            },
        ],
    });
};

const formatMinute = (totalMinute) => {
    if (totalMinute < 1) {
        return '小于 1 分钟';
    }

    const day = parseInt(totalMinute / 60 / 24);
    const hour = parseInt((totalMinute / 60) % 24);
    const minute = parseInt(totalMinute % 60);
    let result = '';
    if (day > 0) {
        result = day + ' 天 ';
    }
    if (hour > 0) {
        result += hour + ' 小时 ';
    }
    if (minute > 0) {
        result += minute + ' 分钟 ';
    }
    return result;
};
const format_currentLife = (row) => {
    const value = row.currentLife;
    return formatMinute(value);
};
const format_totalTimePlayed = (row) => {
    const value = row.totalTimePlayed;
    return formatMinute(value);
};
const format_position = (row) => {
    const value = row.position;
    return `${value.x} ${value.y} ${value.z}`;
};
const format_landProtectionActive = (row) => {
    const value = row.landProtectionActive;
    return value ? '激活' : '未激活';
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
    }
}
</style>
