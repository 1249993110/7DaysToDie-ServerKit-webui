<template>
    <el-dialog draggable :close-on-click-modal="false">
        <el-scrollbar max-height="64vh" always>
            <el-descriptions :column="2" border>
                <el-descriptions-item v-for="(item, index) in details" :key="index" :label="item.label">
                    <template v-if="Array.isArray(item.value)">
                        <el-select :model-value="item.value" multiple collapse-tags collapse-tags-tooltip style="width: 240px" :placeholder="t('global.empty')">
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
import { i18n } from '~/plugins/i18n';
const { t } = i18n.global;

const props = defineProps({
    data: Object,
});

const formatDayTime = (days, time) => {
    return `${days} ${t('global.days')} ${time} ${t('global.hours')}`;
};

const details = computed(() => {
    const data = props.data;
    const playerDetails = data.playerDetails;
    const result = [
        {
            label: t('components.playerDetailsDialog.tableHeader.playerName'),
            value: data.playerName,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.entityId'),
            value: data.entityId,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.playerId'),
            value: data.playerId,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.platformId'),
            value: data.platformId,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.isAdmin'),
            value: playerDetails.isAdmin ? t('global.true') : t('global.false'),
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.isOnline'),
            value: data.isOffline ? t('global.false') : t('global.true'),
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.ip'),
            value: data.ip,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.ping'),
            value: data.ping,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.currentPosition'),
            value: formatPosition(playerDetails.position),
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.lastSpawnPosition'),
            value: formatPosition(playerDetails.lastSpawnPosition.position),
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.gameStage'),
            value: data.gameStage,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.lastLogin'),
            value: playerDetails.lastLogin,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.playerKills'),
            value: playerDetails.playerKills,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.zombieKills'),
            value: playerDetails.zombieKills,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.deaths'),
            value: playerDetails.deaths,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.score'),
            value: playerDetails.score,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.health'),
            value: playerDetails.stats.health.toFixed(1),
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.stamina'),
            value: playerDetails.stats.stamina.toFixed(1),
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.coreTemp'),
            value: playerDetails.stats.coreTemp.toFixed(1),
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.food'),
            value: playerDetails.stats.food.toFixed(1),
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.water'),
            value: playerDetails.stats.water.toFixed(1),
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.pointsCount'),
            value: playerDetails.pointsCount,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.level'),
            value: playerDetails.level,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.expToNextLevel'),
            value: playerDetails.expToNextLevel,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.skillPoints'),
            value: playerDetails.skillPoints,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.landProtectionActive'),
            value: playerDetails.landProtectionActive ? t('components.playerDetailsDialog.active') : t('components.playerDetailsDialog.inactive'),
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.distanceWalked'),
            value: playerDetails.distanceWalked.toFixed(1),
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.totalItemsCrafted'),
            value: playerDetails.totalItemsCrafted,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.totalTimePlayed'),
            value: formatMinute(playerDetails.totalTimePlayed),
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.currentLife'),
            value: formatMinute(playerDetails.currentLife),
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.longestLife'),
            value: formatMinute(playerDetails.longestLife),
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.alreadyCraftedList'),
            value: playerDetails.alreadyCraftedList,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.unlockedRecipeList'),
            value: playerDetails.unlockedRecipeList,
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.rentedVMPosition'),
            value: formatPosition(playerDetails.rentedVMPosition),
        },
        {
            label: t('components.playerDetailsDialog.tableHeader.rentalEndDay'),
            value: formatDayTime(playerDetails.rentalEndDay, playerDetails.rentalEndTime),
        },
    ];

    return result.filter((i) => i.value !== undefined);
});
</script>
