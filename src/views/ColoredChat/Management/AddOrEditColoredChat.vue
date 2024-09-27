<template>
    <MyDialogForm :titleSuffix="t('views.coloredChat.titleSuffix')" :formModel="formModel" :rules="rules" :request="request" :labelWidth="150">
        <template #default="{ isAdd }">
            <el-form-item :label="t('views.coloredChat.tableHeader.playerId')" prop="id">
                <el-input :disabled="!isAdd" v-model="formModel.id"></el-input>
            </el-form-item>
            <el-form-item :label="t('views.coloredChat.tableHeader.customName')" prop="customName">
                <el-input v-model="formModel.customName"></el-input>
            </el-form-item>
            <el-form-item :label="t('views.coloredChat.tableHeader.nameColor')" prop="nameColor">
                <MyColorPicker v-model="formModel.nameColor"></MyColorPicker>
            </el-form-item>
            <el-form-item :label="t('views.coloredChat.tableHeader.textColor')" prop="textColor">
                <MyColorPicker v-model="formModel.textColor"></MyColorPicker>
            </el-form-item>
            <el-form-item :label="t('views.coloredChat.tableHeader.description')" prop="description">
                <el-input v-model="formModel.description"></el-input>
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import * as api from '~/api/coloredChat.js';

const { t } = useI18n();
const formModel = reactive({
    id: '',
    nameColor: '',
    textColor: '',
    description: '',
});

const rules = {
    id: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    nameColor: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    textColor: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
};

const request = async (isAdd) => {
    if (isAdd) {
        await api.addColoredChat(formModel);
    } else {
        await api.updateColoredChat(formModel.id, formModel);
    }
};
</script>
