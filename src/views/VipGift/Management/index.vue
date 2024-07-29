<template>
    <div>
        <RouterButton
            :buttons="[
                {
                    value: 'VIP礼包配置',
                    path: '/vip-gift/settings',
                },
                {
                    value: 'VIP礼包管理',
                    path: '/vip-gift/management',
                },
            ]"
        >
        </RouterButton>
        <MyTableEx
            style="margin-top: 20px"
            :show-export-btn="false"
            :show-searcher="false"
            :show-table-index="false"
            :show-pager="false"
            :get-data="getData"
            :table-data="tableData"
            :show-add-btn="true"
            :show-edit-btn="true"
            :delete="deleteRequest"
            :batch-delete="batchDeleteRequest"
            :add-or-edit-component="AddOrEditVipGift"
        >
            <template #toolbarPost>
                <el-button @click="handleResetAll" type="danger">重置所有领取状态</el-button>
            </template>
            <template #columns>
                <el-table-column prop="id" label="玩家Id" sortable> </el-table-column>
                <el-table-column prop="name" label="礼包名称" sortable show-overflow-tooltip> </el-table-column>
                <el-table-column label="领取状态" width="140px" sortable>
                    <template #default="{ row }">
                        {{ `${row.claimState ? '已领取' : '未领取'}` }}
                    </template>
                </el-table-column>
                <el-table-column prop="totalClaimCount" label="总领取次数" width="120px" sortable> </el-table-column>
                <el-table-column prop="lastClaimAt" label="上次领取日期" sortable> </el-table-column>
                <el-table-column prop="description" label="说明" show-overflow-tooltip> </el-table-column>
                <el-table-column label="绑定" :width="200" header-align="center" show-overflow-tooltip>
                    <template #default="{ row }">
                        <el-button size="small" color="#40e0d0" @click="handleAssociatedItem(row)">绑定物品</el-button>
                        <el-button size="small" color="#8a2be2" @click="handleAssociatedCommand(row)">绑定命令</el-button>
                    </template>
                </el-table-column>
            </template>
        </MyTableEx>
        <AssociatedItems v-model="associatedItemsVisible" v-model:table-data="associatedData" :loading="associatedLoading" @on-edit="handleItemsEdit" />
        <AssociatedCommands v-model="associatedCommandsVisible" v-model:table-data="associatedData" :loading="associatedLoading" @on-edit="handleCommandsEdit" />
    </div>
</template>

<script>
export default {
    name: 'GameStore.Management',
};
</script>

<script setup>
import * as api from '~/api/vip-gift.js';
import AddOrEditVipGift from './AddOrEditVipGift.vue';
import myconfirm from '~/utils/myconfirm';

const tableData = ref([]);

const getData = async () => {
    const data = await api.getVipGift();
    tableData.value = data;
};

const deleteRequest = async (row) => {
    return await api.deleteVipGiftByIds({ ids: [row.id] });
};

const batchDeleteRequest = async (rows) => {
    return await api.deleteVipGiftByIds({ ids: rows.map((i) => i.id) });
};

const handleResetAll = async () => {
    try {
        if (await myconfirm('确定重置所有玩家的领取状态为未领取吗?')) {
            await api.deleteVipGiftByIds({ resetAll: true });
            await getData();
        }
    } catch {}
};

const lastClickId = ref(0);

const associatedItemsVisible = ref(false);
const associatedCommandsVisible = ref(false);
const associatedData = ref([]);
const associatedLoading = ref(false);

const handleAssociatedItem = async (row) => {
    associatedItemsVisible.value = true;
    lastClickId.value = row.id;
    try {
        associatedLoading.value = true;
        const data = await api.getItemList(row.id);
        associatedData.value = data;
    } finally {
        associatedLoading.value = false;
    }
};

const handleItemsEdit = async (ids) => {
    await api.updateItemList(lastClickId.value, ids);
};

const handleAssociatedCommand = async (row) => {
    associatedCommandsVisible.value = true;
    lastClickId.value = row.id;
    try {
        associatedLoading.value = true;
        const data = await api.getCommandList(row.id);
        associatedData.value = data;
    } finally {
        associatedLoading.value = false;
    }
};

const handleCommandsEdit = async (ids) => {
    await api.updateCommandList(lastClickId.value, ids);
};
</script>

<style lang="scss"></style>
