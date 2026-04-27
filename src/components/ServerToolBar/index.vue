<template>
    <div class="server-toolbar">
        <el-button size="small" type="warning" plain @click="handleRestart">
            <el-icon style="margin-right: 4px"><icon-mdi-restart /></el-icon>
            {{ t('components.serverToolBar.restart') }}
        </el-button>
        <el-button size="small" type="danger" plain @click="handleShutdown">
            <el-icon style="margin-right: 4px"><icon-mdi-power /></el-icon>
            {{ t('components.serverToolBar.shutdown') }}
        </el-button>
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
.server-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-right: 16px;

    :deep(.el-button) {
        border-radius: 8px;
        font-weight: 600;
        font-size: 12px;
        padding: 6px 14px;
        box-shadow: none;

        &:hover {
            transform: none;
        }
    }
}
</style>
