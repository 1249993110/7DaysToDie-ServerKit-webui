<template>
    <MyDialogForm :titleSuffix="t('views.listManagement.tableHeader.command')" :formModel="formModel" :rules="rules" :request="request">
        <template #default="{ isAdd }">
            <el-form-item :label="t('views.listManagement.tableHeader.command')" prop="command">
                <el-input v-model="formModel.command"></el-input>
            </el-form-item>
            <el-form-item :label="t('views.listManagement.tableHeader.inMainThread')" prop="inMainThread">
                <el-switch v-model="formModel.inMainThread" />
            </el-form-item>
            <el-form-item :label="t('views.listManagement.tableHeader.description')" prop="description">
                <el-input v-model="formModel.description" />
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import * as api from '~/api/command-list.js';
import { i18n } from '~/plugins/i18n';

const { t } = i18n.global;
const formModel = reactive({
    inMainThread: true
});

const rules = {
    command: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
};

const request = async (isAdd) => {
    if (isAdd) {
        return await api.addCommand(formModel);
    } else {
        return await api.updateCommand(formModel.id, formModel);
    }
};
</script>

