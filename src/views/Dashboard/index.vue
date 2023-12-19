<template>
    <div class="dashboard">
        <RouterButton
            :buttons="[
                {
                    label: '仪表盘',
                    path: '/dashboard',
                },
            ]"
        >
            <template #route-button>
                <div class="route-button">
                    <el-button link type="primary" @click="handleRestart"> 重启服务器 </el-button>
                    <el-divider direction="vertical" />
                    <el-button link type="danger" @click="handleShutdown"> 关闭服务器 </el-button>
                </div>
            </template>
        </RouterButton>
        <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
                <CardWithHeader header="概览">
                    <template #body><Overview :data="stats" /></template>
                </CardWithHeader>
                <CardWithHeader header="状态" min-height="260px">
                    <template #body><Status :data="stats" /></template>
                </CardWithHeader>
                <el-row :gutter="20">
                    <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
                        <CardWithHeader header="FPS" height="146px" class="moniter">
                            <template #body>{{ stats.fps?.toFixed(2) }}</template>
                        </CardWithHeader>
                    </el-col>
                    <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
                        <CardWithHeader header="实体数" height="146px" class="moniter">
                            <template #body>{{ stats.entities }}</template>
                        </CardWithHeader>
                    </el-col>
                    <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
                        <CardWithHeader header="RSS" height="146px" class="moniter">
                            <template #body>{{ stats.residentSetSize?.toFixed() }} MB</template>
                        </CardWithHeader>
                    </el-col>
                    <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
                        <CardWithHeader header="Chunks" height="146px" class="moniter">
                            <template #body>{{ stats.chunks }}</template>
                        </CardWithHeader>
                    </el-col>
                    <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
                        <CardWithHeader header="CGO" height="146px" class="moniter">
                            <template #body>{{ stats.cgo }}</template>
                        </CardWithHeader>
                    </el-col>
                    <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
                        <CardWithHeader header="Items" height="146px" class="moniter">
                            <template #body>{{ stats.items }}</template>
                        </CardWithHeader>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <CardWithHeader header="系统信息">
                    <template #body>
                        <SystemInfo />
                    </template>
                </CardWithHeader>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'Dashboard',
};
</script>

<script setup>
import Overview from './Overview/index.vue';
import Status from './Status/index.vue';
import SystemInfo from './SystemInfo/index.vue';
import { getStats, restart, shutdown } from '~/api/server';
import myconfirm from '~/utils/myconfirm';

const stats = ref({});
const getData = async () => {
    stats.value = await getStats();
};
const { pause, resume, isActive } = useIntervalFn(getData, 10000, { immediate: false, immediateCallback: true });

onActivated(resume);
onDeactivated(pause);

const handleRestart = async () => {
    if (await myconfirm('您确定要重启服务器吗? 这可能需要几分钟的时间')) {
        await restart();
        ElMessage.success('重启成功');
    }
};

const handleShutdown = async () => {
    if (await myconfirm('您确定要关闭服务器吗?')) {
        await shutdown();
        ElMessage.success('关闭成功');
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

.moniter {
    margin-top: 0;
    :deep(.el-card__body) {
        div:not(.header) {
            font-size: 20px;
            margin-left: 18px;
            color: $primary-color;
            font-weight: 500;
            line-height: 32px;
            cursor: pointer;
        }
    }
}
</style>
