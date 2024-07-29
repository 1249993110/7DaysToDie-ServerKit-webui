<template>
    <MyDialogForm titleSuffix="物品" :formModel="formModel" :rules="rules" :request="request">
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
            <el-form-item label="说明" prop="description">
                <el-input v-model="formModel.description" />
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import * as api from '~/api/item-list.js';

const formModel = reactive({
    count: 1,
    quality: 6,
    durability: 100,
});

const rules = {
    itemName: [{ required: true, message: '必填项', trigger: 'blur' }],
    count: [{ required: true, message: '必填项', trigger: 'blur' }],
};

const request = async (isAdd) => {
    if (isAdd) {
        return await api.addItem(formModel);
    } else {
        return await api.updateItem(formModel.id, formModel);
    }
};

const itemBlockSelectorVisible = ref(false);
const handleSelect = (item) => {
    formModel.itemName = item.itemName;
    formModel.description = item.localizationName;
    itemBlockSelectorVisible.value = false;
};
</script>

