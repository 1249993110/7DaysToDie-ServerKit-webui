<template>
    <MyDialogForm :titleSuffix="t('views.listManagement.tableHeader.item')" :formModel="formModel" :rules="rules" :request="request">
        <template #default="{ isAdd }">
            <el-form-item :label="t('views.listManagement.tableHeader.itemName')" prop="itemName">
                <ItemBlockSelector v-model="itemBlockSelectorVisible" @on-select="handleSelect" />
                <div style="display: flex; align-items: center">
                    <GameIcon :name="formModel.itemName" />
                    <el-button @click="itemBlockSelectorVisible = true" style="margin-left: 8px">{{ t('global.button.select') + ' ' + t('views.listManagement.tableHeader.item') }}</el-button>
                </div>
                <el-input v-model="formModel.itemName"></el-input>
            </el-form-item>
            <el-form-item :label="t('views.listManagement.tableHeader.count')" prop="count">
                <el-input-number v-model="formModel.count" :min="1" :max="1000000" />
            </el-form-item>
            <el-form-item :label="t('views.listManagement.tableHeader.quality')" prop="quality">
                <el-input-number v-model="formModel.quality" :min="0" />
            </el-form-item>
            <el-form-item :label="t('views.listManagement.tableHeader.durability')" prop="durability">
                <el-input-number v-model="formModel.durability" :min="0" :max="100" />
            </el-form-item>
            <el-form-item :label="t('views.listManagement.tableHeader.description')" prop="description">
                <el-input v-model="formModel.description" />
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import * as api from '~/api/item-list.js';
import { i18n } from '~/plugins/i18n';

const { t } = i18n.global;
const formModel = reactive({
    count: 1,
    quality: 7,
    durability: 100,
});

const rules = {
    itemName: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    count: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
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

