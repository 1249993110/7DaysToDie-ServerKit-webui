<template>
    <div>
        <RouterButton
            :buttons="[
                {
                    value: '历史玩家',
                    path: '/history-players',
                },
            ]"
        >
        </RouterButton>
        <MyTableEx
            @on-export="handleExport"
            @on-contextmenu="handleContextmenu"
            :search-form-model="searchFormModel"
            :get-data="getData"
            :table-data="tableData"
            :total="total"
            :show-add-btn="false"
            :show-edit-btn="false"
            :operation-column-width="120"
            :delete="deleteRequest"
            :batch-delete="batchDeleteRequest"
            deleteLabel="重置玩家"
            batchDeleteLabel="批量重置玩家"
            style="margin-top: 20px"
        >
            <template #searchFormItems>
                <el-form-item label="关键词" prop="keyword">
                    <el-input v-model="searchFormModel.keyword" style="width: 400px" placeholder="请输入玩家Id或名称" clearable autofocus></el-input>
                </el-form-item>
            </template>
            <template #columns>
                <el-table-column prop="playerName" label="玩家昵称" min-width="120" sortable> </el-table-column>
                <el-table-column prop="platformId" label="平台Id" min-width="215" sortable> </el-table-column>
                <el-table-column prop="crossplatformId" label="EOS" min-width="320" sortable> </el-table-column>
                <el-table-column prop="lastLogin" label="上次在线" min-width="170" sortable :formatter="formatLastLogin"> </el-table-column>
                <el-table-column prop="position" label="玩家坐标" min-width="130" :formatter="formatPosition"> </el-table-column>
            </template>
        </MyTableEx>
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
    name: 'HistoryPlayers',
};
</script>

<script setup>
import ContextMenu from '@imengyu/vue3-context-menu';
import * as sdtdConsole from '~/api/sdtd-console';
import { resetPlayer } from '~/api/server';
import { getHistoryPlayers, getHistoryPlayerDetails } from '~/api/players';
import { showInventory } from '~/components/InventoryDialog/index.js';
import myprompt from '~/utils/myprompt';
import myconfirm from '~/utils/myconfirm';
import * as fileHelper from '~/utils/file-helper';
import { showBanWindow } from '~/components/AddBlacklist/index';

const detailsDialogVisible = ref(false);
const dialogTitle = ref('');
const details = ref([]);

const searchFormModel = reactive({
    keyword: '',
});

const tableData = ref([]);
const total = ref(0);

const getData = async (pagination) => {
    const data = await getHistoryPlayers({ ...pagination, ...searchFormModel });
    tableData.value = data.items;
    total.value = data.total;
};

const { copy } = useClipboard();

const formatPosition = (row) => {
    const value = row.position;
    return `${value.x} ${value.y} ${value.z}`;
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
const getDetails = async (playerId) => {
    const data = await getHistoryPlayerDetails(playerId);
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

const format_position = (row) => {
    const value = row.position;
    return `${value.x} ${value.y} ${value.z}`;
};

const handleContextmenu = (row, column, event) => {
    const crossplatformId = row.crossplatformId;
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
                        label: '复制玩家EOS',
                        onClick: async () => {
                            await copy(crossplatformId);
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
                label: '封禁玩家',
                onClick: () => {
                    showBanWindow(crossplatformId, playerName);
                },
                divided: true,
            },
            {
                label: '设置为超级管理员',
                onClick: async () => {
                    if(await myconfirm('此操作将把选定玩家设置为超级管理员, 是否继续?', '提示', 'warning')){
                        sdtdConsole.addAdmin(crossplatformId, 0, '超级管理员-' + playerName).then(() => {
                            ElMessage.success('发送命令成功');
                        });
                    }
                },
            },
        ],
    });
};

const handleExport = (command) => {
    switch (command) {
        case 'csv':
            fileHelper.exportCsv(tableData.value, '历史玩家', {
                playerName: '玩家昵称',
                platformId: '平台Id',
                crossplatformId: 'EOS',
                lastLogin: '上次在线',
                position: '玩家坐标',
            });
            break;
        case 'json':
            fileHelper.exportJson(tableData.value, '历史玩家');
            break;
    }
};

const deleteRequest = async (row) => {
    return await resetPlayer(row.crossplatformId);
};

const batchDeleteRequest = async (rows) => {
    for (const row of rows) {
        await resetPlayer(row.crossplatformId);
    }
};

const formatLastLogin = (row) => {
    return row.lastLogin;
};
</script>
