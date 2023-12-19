<template>
    <el-scrollbar class="system-info">
        <el-descriptions :column="1" class="description">
            <el-descriptions-item class-name="content">
                <template #label>
                    <span class="label">主机名称</span>
                </template>
                {{ systemInfo.deviceName }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content">
                <template #label>
                    <span class="label">设备平台</span>
                </template>
                {{ systemInfo.deviceModel }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content">
                <template #label>
                    <span class="label">设备类型</span>
                </template>
                {{ systemInfo.deviceType }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content">
                <template #label>
                    <span class="label">设备唯一标识</span>
                </template>
                {{ systemInfo.deviceUniqueIdentifier }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content">
                <template #label>
                    <span class="label">系统版本</span>
                </template>
                {{ systemInfo.operatingSystem }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content">
                <template #label>
                    <span class="label">处理器类型</span>
                </template>
                {{ systemInfo.processorType }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content">
                <template #label>
                    <span class="label">处理器个数</span>
                </template>
                {{ systemInfo.processorCount }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content">
                <template #label>
                    <span class="label">内存大小</span>
                </template>
                {{ systemInfo.systemMemorySize }} MB
            </el-descriptions-item>
        </el-descriptions>
    </el-scrollbar>
</template>

<script setup>
import { getSystemInfo } from '~/api/server';

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
            color: #1f2329;
        }

        .content {
            font-size: 13px;
        }
    }
}
</style>
