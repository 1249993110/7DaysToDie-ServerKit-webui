<template>
    <el-dialog draggable :close-on-click-modal="false" width="80%">
        <el-scrollbar max-height="63vh" always>
            <el-tabs type="border-card" v-loading="loading">
                <el-tab-pane v-for="(item, index) in skills" :key="index" :label="(item.localizationName || item.name) + ' (等级:' + item.level + ')'" lazy>
                    <Table :skills="item.children"></Table>
                </el-tab-pane>
            </el-tabs>
        </el-scrollbar>
    </el-dialog>
</template>

<script setup>
import { getPlayerSkills } from '~/api/player-skills';
import Table from './Table.vue';

const props = defineProps({
    playerId: String,
});

const loading = ref(true);
const skills = ref([]);
getPlayerSkills(props.playerId)
    .then((data) => {
        skills.value = data;
    })
    .finally(() => {
        loading.value = false;
    });
</script>
