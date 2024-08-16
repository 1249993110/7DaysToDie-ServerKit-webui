<template>
    <el-dialog :title="`玩家: ${data.playerName} (${data.playerId}) 的数据`" draggable :close-on-click-modal="false">
        <el-scrollbar max-height="63vh" always>
            <el-descriptions :column="2" border>
                <el-descriptions-item v-for="(item, index) in details" :key="index" :label="item.label">
                    <template v-if="Array.isArray(item.value)">
                        <el-select :model-value="item.value" multiple collapse-tags collapse-tags-tooltip style="width: 240px" placeholder="空">
                            <el-option v-for="(subItem, subIndex) in item.value" :key="subIndex" :label="subItem" :value="subItem" />
                        </el-select>
                    </template>
                    <template v-else>{{ item.value }}</template>
                </el-descriptions-item>
            </el-descriptions>
        </el-scrollbar>
    </el-dialog>
</template>

<script setup>
import * as formatHelper from '~/utils/format-helper';

const props = defineProps({
    data: Object,
});

const details = computed(() => {
    const data = props.data;
    const playerDetails = data.playerDetails;
    const result = [
        {
            label: '玩家昵称',
            value: data.playerName,
        },
        {
            label: '实体Id',
            value: data.entityId,
        },
        {
            label: '玩家Id',
            value: data.playerId,
        },
        {
            label: '平台Id',
            value: data.platformId,
        },
        {
            label: '是否为管理员',
            value: playerDetails.isAdmin ? '是' : '否',
        },
        {
            label: '是否在线',
            value: data.isOffline ? '否' : '是',
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
            label: '当前位置',
            value: formatHelper.formatPosition(playerDetails.position),
        },
        {
            label: '上次重生位置',
            value: formatHelper.formatPosition(playerDetails.lastSpawnPosition.position),
        },
        {
            label: '游戏阶段',
            value: data.gameStage,
        },
        {
            label: '上次在线',
            value: playerDetails.lastLogin,
        },
        {
            label: '击杀玩家',
            value: playerDetails.playerKills,
        },
        {
            label: '击杀僵尸',
            value: playerDetails.zombieKills,
        },
        {
            label: '死亡次数',
            value: playerDetails.deaths,
        },
        {
            label: '分数',
            value: playerDetails.score,
        },
        {
            label: '生命值',
            value: playerDetails.stats.health.toFixed(1),
        },
        {
            label: '体力值',
            value: playerDetails.stats.stamina.toFixed(1),
        },
        {
            label: '温度',
            value: playerDetails.stats.coreTemp.toFixed(1),
        },
        {
            label: '食物',
            value: playerDetails.stats.food.toFixed(1),
        },
        {
            label: '水',
            value: playerDetails.stats.water.toFixed(1),
        },
        {
            label: '积分',
            value: playerDetails.pointsCount,
        },
        {
            label: '等级',
            value: playerDetails.level,
        },
        {
            label: '至下一级的经验',
            value: playerDetails.expToNextLevel,
        },
        {
            label: '技能点',
            value: playerDetails.skillPoints,
        },
        {
            label: '领地石保护状态',
            value: playerDetails.landProtectionActive ? '激活' : '未激活',
        },
        {
            label: '行走距离',
            value: playerDetails.distanceWalked.toFixed(1),
        },
        {
            label: '制作项目总数',
            value: playerDetails.totalItemsCrafted,
        },
        {
            label: '总游戏时长',
            value: formatHelper.formatMinute(playerDetails.totalTimePlayed),
        },
        {
            label: '当前存活时长',
            value: formatHelper.formatMinute(playerDetails.currentLife),
        },
        {
            label: '最长生存时长',
            value: formatHelper.formatMinute(playerDetails.longestLife),
        },
        {
            label: '已制作物品列表',
            value: playerDetails.alreadyCraftedList,
        },
        {
            label: '已解锁配方列表',
            value: playerDetails.unlockedRecipeList,
        },
        {
            label: '租赁坐标',
            value: formatHelper.formatPosition(playerDetails.rentedVMPosition),
        },
        {
            label: '租赁结束日期',
            value: playerDetails.rentalEndDay + ' 天 ' + playerDetails.rentalEndTime + ' 小时',
        },
    ];

    return result.filter((i) => i.value !== undefined);
});
</script>
