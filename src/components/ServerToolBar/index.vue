<template>
    <div class="route-button">
        <el-button link type="primary" @click="handleRestart">{{ t('components.serverToolBar.restart') }}</el-button>
        <el-divider direction="vertical" />
        <el-button link type="danger" @click="handleShutdown">{{ t('components.serverToolBar.shutdown') }}</el-button>
    </div>
</template>

<script setup>
import { restart, shutdown } from '~/api/server';

const { t } = useI18n();

const handleRestart = async () => {
    if (await myconfirm(t('components.serverToolBar.restartConfirm'))) {
        await restart();
        ElMessage.success(t('components.serverToolBar.restartSuccess'));
    }
};

const handleShutdown = async () => {
    if (await myconfirm(t('components.serverToolBar.shutdownConfirm'))) {
        await shutdown();
        ElMessage.success(t('components.serverToolBar.shutdownSuccess'));
    }
};
</script>

<style scoped lang="scss">
.route-button {
    margin-right: 20px;
    :deep(.el-button) {
        --el-button-text-color: #005eeb;
    }
    :deep(button:nth-child(3)) {
        --el-button-text-color: #f56c6c;
    }
}
</style>
