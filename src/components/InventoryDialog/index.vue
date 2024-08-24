<template>
    <el-dialog class="inventory-dialog" width="890px" draggable :close-on-click-modal="false" :show-close="false">
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                <h1 :id="titleId" :class="titleClass">{{ title }}</h1>
                <span style="margin-left: auto">
                    <el-text style="margin: 0 4px" type="success">{{ t('components.inventoryDialog.grid') }}</el-text>
                    <el-switch v-model="showList" style="--el-switch-on-color: #409eff; --el-switch-off-color: #13ce66"></el-switch>
                    <el-text style="margin: 0 4px" type="primary">{{ t('components.inventoryDialog.list') }}</el-text>
                </span>
                <IconButton style="margin-left: auto" @click="close">
                    <Close />
                </IconButton>
            </div>
        </template>
        <div v-loading="loading" v-show="!showList">
            <Grid :bag="inventory.bag" :belt="inventory.belt" :equipment="inventory.equipment" :playerId="playerId" />
        </div>
        <el-tabs type="border-card" v-if="loadedList" v-show="showList" v-loading="loading">
            <el-tab-pane :label="t('components.inventoryDialog.bag')" lazy>
                <Table :tableData="inventory.bag" :playerId="playerId"></Table>
            </el-tab-pane>
            <el-tab-pane :label="t('components.inventoryDialog.belt')" lazy>
                <Table :tableData="inventory.belt" :playerId="playerId"></Table>
            </el-tab-pane>
            <el-tab-pane :label="t('components.inventoryDialog.equipment')" lazy>
                <Table :tableData="inventory.equipment"></Table>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script setup>
import Grid from './Grid.vue';
import Table from './Table.vue';
import { getPlayerInventory } from '~/api/inventories';
import { Close } from '@element-plus/icons-vue';
import { i18n } from '~/plugins/i18n';

const props = defineProps({
    title: {
        type: String,
    },
    playerId: {
        type: String,
    },
});

const { t } = i18n.global;

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
const localeStore = useLocaleStore();
getPlayerInventory(props.playerId, localeStore.getLanguage())
    .then((data) => {
        inventory.bag = data.bag;
        inventory.belt = data.belt;
        inventory.equipment = data.equipment;

        loading.value = false;
    })
    .catch((error) => {});
</script>

<style lang="scss" scoped>
.inventory-dialog {
    //background-image: linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5)), url('../../assets/images/background.png');
    .my-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;
    }
}
</style>
