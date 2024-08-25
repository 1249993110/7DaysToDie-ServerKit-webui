<template>
    <MyDialogForm :titleSuffix="t('views.vipGift.gift')" :formModel="formModel" :rules="rules" :request="request" :labelWidth="150">
        <template #default="{ isAdd }">
            <el-form-item :label="t('views.vipGift.tableHeader.playerId')" prop="id">
                <el-input :disabled="!isAdd" v-model="formModel.id"></el-input>
            </el-form-item>
            <el-form-item :label="t('views.vipGift.tableHeader.name')" prop="name">
                <el-input v-model="formModel.name"></el-input>
            </el-form-item>
            <el-form-item :label="t('views.vipGift.tableHeader.claimState')" prop="claimState">
                <el-switch v-model="formModel.claimState" />
            </el-form-item>
            <el-form-item :label="t('views.vipGift.tableHeader.totalClaimCount')" prop="totalClaimCount">
                <el-input-number v-model="formModel.totalClaimCount" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item :label="t('views.vipGift.tableHeader.description')" prop="description">
                <el-input v-model="formModel.description"></el-input>
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import * as api from '~/api/vip-gift.js';

const { t } = useI18n();
const formModel = reactive({
    id: '',
    name: '',
    claimState: false,
    totalClaimCount: 0,
    description: '',
});

const rules = {
    id: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    name: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    claimState: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    totalClaimCount: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
};

const request = async (isAdd) => {
    if (isAdd) {
        await api.addVipGift(formModel);
    } else {
        await api.updateVipGift(formModel.id, formModel);
    }
};
</script>
