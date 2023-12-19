<template>
    <el-dialog class="inventory-dialog" :title="title" v-model="visible" width="890px" draggable :close-on-click-modal="false" @closed="handleClosed">
        <div v-loading="loading">
            <div style="width: 855px">
                <div class="bag">
                    <div>背包</div>
                    <el-scrollbar noresize always class="split" height="410px">
                        <InventoryItem v-for="(item, index) in inventory.bag" :key="index" :item="item" :player-id="playerId"></InventoryItem>
                    </el-scrollbar>
                </div>
                <div class="equipment">
                    <div>装备</div>
                    <el-scrollbar noresize always class="split" height="410px">
                        <InventoryItem v-for="(item, index) in inventory.equipment" :key="index" :item="item" :player-id="playerId" :remove-items-disabled="true"></InventoryItem>
                    </el-scrollbar>
                </div>
            </div>
            <div style="width: 820px">
                <div>腰带</div>
                <div class="belt">
                    <InventoryItem v-for="(item, index) in inventory.belt" :key="index" :item="item" :player-id="playerId"></InventoryItem>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import InventoryItem from './InventoryItem.vue';
import { getPlayerInventory } from '~/api/inventories';

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

const inventory = ref({
    bag: [],
    equipment: [],
    belt: [],
});

getPlayerInventory(props.playerId)
    .then((data) => {
        inventory.value = data;
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
    background-image: linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5)), url('../../assets/images/background.png');
    .bag {
        display: inline-block;
        width: 668px;
        vertical-align: top;
    }
    .equipment {
        display: inline-block;
        width: 180px;
        vertical-align: top;
        margin-left: 4px;
    }
    .belt {
        display: flex;
        flex-wrap: wrap;
    }
    .split {
        .el-scrollbar__view {
            display: flex;
            flex-wrap: wrap;
        }
    }
}
</style>
