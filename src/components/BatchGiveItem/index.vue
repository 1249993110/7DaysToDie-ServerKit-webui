<template>
    <MyDialogForm :formModel="formModel" :rules="rules" :request="request" successMessage="发送成功" confirmBtnText="发送">
        <template #default="{ isAdd }">
            <el-form-item label="物品名称" prop="itemName">
                <ItemBlockSelector v-model="itemBlockSelectorVisible" @on-select="handleSelect" />
                <div style="display: flex; align-items: center">
                    <GameIcon :name="formModel.itemName" />
                    <el-button @click="itemBlockSelectorVisible = true" style="margin-left: 8px">选择物品</el-button>
                </div>
                <el-input v-model="formModel.itemName"></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="count">
                <el-input-number v-model="formModel.count" :min="1" :max="1000000" />
            </el-form-item>
            <el-form-item label="品质" prop="quality">
                <el-input-number v-model="formModel.quality" :min="0" :max="7" />
            </el-form-item>
            <el-form-item label="耐久度%" prop="durability">
                <el-input-number v-model="formModel.durability" :min="0" :max="100" />
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import { giveItem } from '~/api/sdtd-console';

const props = defineProps({
    playerIds: Array,
});

const itemBlockSelectorVisible = ref(false);
const formModel = reactive({
    itemName: '',
    count: 1,
    quality: 1,
    durability: 100,
    iconColor: '',
});

const rules = {
    itemName: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    count: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
};

const request = async () => {
    for (let i = 0; i < props.playerIds.length; i++) {
        const playerId = props.playerIds[i];
        await giveItem(playerId, formModel.itemName, formModel.count, formModel.quality, formModel.durability);
    }
};

const handleSelect = (item) => {
    formModel.name = item.localizationName;
    formModel.itemName = item.itemName;
    formModel.iconColor = item.iconColor;
    itemBlockSelectorVisible.value = false;
};
</script>
