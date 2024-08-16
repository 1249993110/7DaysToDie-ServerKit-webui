<template>
    <el-dialog class="inventory-dialog" v-model="visible" width="890px" draggable :close-on-click-modal="false" @closed="handleClosed" :show-close="false">
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                <h1 :id="titleId" :class="titleClass">{{ title }}</h1>
                <span style="margin-left: auto">
                    <el-text style="margin: 0 4px" type="success">网格</el-text>
                    <el-switch v-model="showList" style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66"></el-switch>
                    <el-text style="margin: 0 4px" type="danger">列表</el-text>
                </span>
                <el-button style="margin-left: auto" type="danger" @click="close">
                    <el-icon><CircleCloseFilled /></el-icon>
                </el-button>
            </div>
        </template>
        <div v-loading="loading" v-show="!showList">
            <Grid :bag="inventory.bag" :belt="inventory.belt" :equipment="inventory.equipment" :playerId="playerId" />
        </div>
        <el-tabs type="border-card" v-if="loadedList" v-show="showList" v-loading="loading">
            <el-tab-pane label="背包" lazy>
                <Table :tableData="inventory.bag" :playerId="playerId"></Table>
            </el-tab-pane>
            <el-tab-pane label="腰带" lazy>
                <Table :tableData="inventory.belt" :playerId="playerId"></Table>
            </el-tab-pane>
            <el-tab-pane label="装备" lazy>
                <Table :tableData="inventory.equipment"></Table>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script setup>
import Grid from './Grid.vue';
import Table from './Table.vue';
import { getPlayerInventory } from '~/api/inventories';
import { CircleCloseFilled } from '@element-plus/icons-vue';

const props = defineProps({
    title: {
        type: String,
    },
    visible: {
        type: Boolean,
        default: false,
    },
    playerId: {
        type: String,
    },
});

const loading = ref(true);
const showList = ref(false);
const loadedList = ref(false);
watchOnce(showList, (val) => {
    if (val) {
        loadedList.value = true;
    }
});

const inventory = reactive({
    bag: [],
    belt: [],
    equipment: [],
});

getPlayerInventory(props.playerId)
    .then((data) => {
        inventory.bag = data.bag;
        inventory.belt = data.belt;
        inventory.equipment = data.equipment;

        loading.value = false;
    })
    .catch((error) => {});

const emit = defineEmits(['onClosed']);
const visible = ref(props.visible);

const handleClosed = () => {
    emit('onClosed');
};
</script>

<style lang="scss">
.inventory-dialog {
    //background-image: linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5)), url('../../assets/images/background.png');
    .el-dialog__header {
        padding: 0;
    }
    .my-header {
        display: flex;
        flex-direction: row;
        justify-items: center;
        gap: 16px;
    }
}
</style>
