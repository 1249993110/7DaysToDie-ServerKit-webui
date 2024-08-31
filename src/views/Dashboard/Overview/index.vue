<template>
    <el-scrollbar class="overview">
        <el-descriptions :column="3" class="description" direction="vertical">
            <el-descriptions-item class-name="content" label-class-name="label" min-width="150px">
                <template #label>
                    <span class="label">{{ t('views.dashboard.overview.serverName') }}</span>
                </template>
                {{ data.serverName }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label" min-width="150px">
                <template #label>
                    <span class="label">{{ t('views.dashboard.overview.region') }}</span>
                </template>
                {{ data.region }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label">
                <template #label>
                    <span class="label">{{ t('views.dashboard.overview.language') }}</span>
                </template>
                {{ data.language }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label" min-width="150px">
                <template #label>
                    <span class="label">{{ t('views.dashboard.overview.serverIp') }}</span>
                </template>
                {{ data.serverIp }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label" min-width="150px">
                <template #label>
                    <span class="label">{{ t('views.dashboard.overview.uptime') }}</span>
                </template>
                {{ formatDuration(data.uptime) }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label">
                <template #label>
                    <span class="label">{{ t('views.dashboard.overview.gameTime') }}</span>
                </template>
                {{ formatGameTime(data.gameTime) }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label">
                <template #label>
                    <span class="label">{{ t('views.dashboard.overview.serverPort') }}</span>
                </template>
                {{ data.serverPort }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label">
                <template #label>
                    <span class="label">{{ t('views.dashboard.overview.gameName') }}</span>
                </template>
                {{ data.gameName }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label">
                <template #label>
                    <span class="label">{{ t('views.dashboard.overview.gameMode') }}</span>
                </template>
                {{ data.gameMode }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label">
                <template #label>
                    <span class="label">{{ t('views.dashboard.overview.serverVersion') }}</span>
                </template>
                {{ data.serverVersion }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label">
                <template #label>
                    <span class="label">{{ t('views.dashboard.overview.gameWorld') }}</span>
                </template>
                {{ data.gameWorld }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label">
                <template #label>
                    <span class="label">{{ t('views.dashboard.overview.gameDifficulty') }}</span>
                </template>
                {{ formatGameDifficulty(data.gameDifficulty) }}
            </el-descriptions-item>
        </el-descriptions>
    </el-scrollbar>
</template>

<script setup>
const props = defineProps({
    data: Object,
});

const { t } = useI18n();

const formatDuration = (time) => {
    const dur = dayjs.duration(time, 'seconds');

    const days = Math.floor(dur.asDays());
    const hours = dur.hours().toString().padStart(2, '0');
    const minutes = dur.minutes().toString().padStart(2, '0');
    const seconds = dur.seconds().toString().padStart(2, '0');
    return t('views.dashboard.overview.formatDuration', [days, hours, minutes, seconds]);
};

const formatGameTime = (time) => {
    if (!time) {
        return '';
    }
    const days = time.days;
    const hours = time.hours.toString().padStart(2, '0');
    const minutes = time.minutes.toString().padStart(2, '0');
    return t('views.dashboard.overview.formatGameTime', [days, hours, minutes]);
};

const formatGameDifficulty = (gameDifficulty) => {
    if (!gameDifficulty) {
        return '';
    }
    return t('views.dashboard.overview.gameDifficultys.' + gameDifficulty);
};
</script>

<style scoped lang="scss">
.overview {
    :deep(.description) {
        margin-left: 18px;
        height: 280px;
        // min-width: 460px;
        .label {
            font-weight: 400 !important;
            font-size: 15px !important;
            color: #1f2329;
            padding-bottom: 2px;
        }

        .content {
            font-size: 13px;
            padding-bottom: 20px;
            color: $primary-color;
            font-weight: 600;
        }
    }
}
</style>
