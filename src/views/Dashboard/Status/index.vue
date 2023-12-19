<template>
    <el-row :gutter="10">
        <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6" align="center">
            <MyCharts height="160px" type="pie" :option="status.players" />
            <span class="input-help">玩家数</span>
        </el-col>
        <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6" align="center">
            <MyCharts height="160px" type="pie" :option="status.zombies" />
            <span class="input-help">僵尸数</span>
        </el-col>
        <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6" align="center">
            <MyCharts height="160px" type="pie" :option="status.animals" />
            <span class="input-help">动物数</span>
        </el-col>
        <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6" align="center">
            <MyCharts
                height="160px"
                type="pie"
                :option="{
                    current: Math.round((status.heap.current / status.heap.max) * 100),
                    max: 100,
                    unit: '%',
                }"
            />
            <span class="input-help">堆内存 {{ status.heap.current.toFixed() }} / {{ status.heap.max.toFixed() }} MB</span>
        </el-col>
    </el-row>
</template>

<script setup>
const props = defineProps({
    data: Object,
});

const status = ref({
    players: {
        current: 0,
        max: 0,
    },
    zombies: {
        current: 0,
        max: 0,
    },
    animals: {
        current: 0,
        max: 0,
    },
    heap: {
        current: 0,
        max: 0,
    },
});

watch(
    () => props.data,
    (val) => {
        status.value = {
            players: {
                current: val.onlinePlayers,
                max: val.maxOnlinePlayers,
            },
            zombies: {
                current: val.zombies,
                max: val.maxZombies,
            },
            animals: {
                current: val.animals,
                max: val.maxAnimals,
            },
            heap: {
                current: val.heap,
                max: val.maxHeap,
            },
        };
    }
);
</script>

<style scoped lang="scss">
.input-help {
    font-size: 13px;
    word-break: break-all;
    color: #414141;
    width: 100%;
    display: inline-block;
}
</style>
