<template>
    <el-scrollbar class="system-info">
        <el-descriptions :column="1" class="description">
            <el-descriptions-item class-name="content">
                <template #label>
                    <span class="label">{{ t('views.dashboard.systemInfo.deviceName') }}</span>
                </template>
                {{ systemInfo.deviceName }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content">
                <template #label>
                    <span class="label">{{ t('views.dashboard.systemInfo.deviceModel') }}</span>
                </template>
                {{ systemInfo.deviceModel }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content">
                <template #label>
                    <span class="label">{{ t('views.dashboard.systemInfo.deviceType') }}</span>
                </template>
                {{ systemInfo.deviceType }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content">
                <template #label>
                    <span class="label">{{ t('views.dashboard.systemInfo.deviceUniqueIdentifier') }}</span>
                </template>
                {{ systemInfo.deviceUniqueIdentifier }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content">
                <template #label>
                    <span class="label">{{ t('views.dashboard.systemInfo.operatingSystem') }}</span>
                </template>
                {{ systemInfo.operatingSystem }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content">
                <template #label>
                    <span class="label">{{ t('views.dashboard.systemInfo.processorType') }}</span>
                </template>
                {{ systemInfo.processorType }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content">
                <template #label>
                    <span class="label">{{ t('views.dashboard.systemInfo.processorCount') }}</span>
                </template>
                {{ systemInfo.processorCount }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content">
                <template #label>
                    <span class="label">{{ t('views.dashboard.systemInfo.systemMemorySize') }}</span>
                </template>
                {{ Math.round(systemInfo.systemMemorySize / 1024) }} GB
            </el-descriptions-item>
        </el-descriptions>
    </el-scrollbar>
</template>

<script setup>
import { getSystemInfo } from '~/api/server';

const { t } = useI18n();
const systemInfo = ref({
    deviceModel: '',
    deviceName: '',
    deviceType: '',
    deviceUniqueIdentifier: '',
    operatingSystem: '',
    operatingSystemFamily: '',
    processorCount: 0,
    processorFrequency: 0,
    processorType: '',
    systemMemorySize: 0,
});
getSystemInfo()
    .then((data) => {
        systemInfo.value = data;
    })
    .catch((error) => {});
</script>

<style scoped lang="scss">
.system-info {
    :deep(.description) {
        margin-left: 18px;
        height: 290px;
        min-width: 460px;
        .label {
            font-weight: 400 !important;
            font-size: 14px !important;
        }

        .content {
            font-size: 13px;
        }
    }
}
</style>
