<template>
    <div class="dashboard">
        <RouterButton :names="['dashboard']">
            <template #route-button>
                <ServerToolBar />
            </template>
        </RouterButton>
        <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
                <CardWithHeader :header="t('views.dashboard.header.overview')">
                    <template #body><Overview :data="stats" /></template>
                </CardWithHeader>
                <CardWithHeader :header="t('views.dashboard.header.status')" min-height="260px">
                    <template #body><Status :data="stats" /></template>
                </CardWithHeader>
                <el-row :gutter="20">
                    <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
                        <CardWithHeader :header="t('views.dashboard.header.fps')" height="146px" class="moniter">
                            <template #body>{{ stats.fps?.toFixed(2) }}</template>
                        </CardWithHeader>
                    </el-col>
                    <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
                        <CardWithHeader :header="t('views.dashboard.header.entities')" height="146px" class="moniter">
                            <template #body>{{ stats.entities }}</template>
                        </CardWithHeader>
                    </el-col>
                    <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
                        <CardWithHeader :header="t('views.dashboard.header.rss')" height="146px" class="moniter">
                            <template #body>{{ stats.residentSetSize?.toFixed() }} MB</template>
                        </CardWithHeader>
                    </el-col>
                    <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
                        <CardWithHeader :header="t('views.dashboard.header.chunks')" height="146px" class="moniter">
                            <template #body>{{ stats.chunks }}</template>
                        </CardWithHeader>
                    </el-col>
                    <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
                        <CardWithHeader :header="t('views.dashboard.header.cgo')" height="146px" class="moniter">
                            <template #body>{{ stats.cgo }}</template>
                        </CardWithHeader>
                    </el-col>
                    <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
                        <CardWithHeader :header="t('views.dashboard.header.items')" height="146px" class="moniter">
                            <template #body>{{ stats.items }}</template>
                        </CardWithHeader>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <CardWithHeader :header="t('views.dashboard.header.systemInfo')">
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
    name: 'dashboard',
};
</script>

<script setup>
import Overview from './Overview/index.vue';
import Status from './Status/index.vue';
import SystemInfo from './SystemInfo/index.vue';
import { getStats } from '~/api/server';

const { t } = useI18n();
const stats = ref({});
const getData = async () => {
    stats.value = await getStats();
};
const { pause, resume, isActive } = useIntervalFn(getData, 10000, { immediate: false, immediateCallback: true });

onActivated(resume);
onDeactivated(pause);
</script>

<style scoped lang="scss">
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
