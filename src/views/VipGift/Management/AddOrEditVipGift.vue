<template>
    <MyDialogForm titleSuffix="VIP礼包" :formModel="formModel" :rules="rules" :request="request">
        <template #default="{ isAdd }">
            <el-form-item label="玩家Id (EOS)" prop="id">
                <el-input :disabled="!isAdd" v-model="formModel.id"></el-input>
            </el-form-item>
            <el-form-item label="礼包名称" prop="name">
                <el-input v-model="formModel.name"></el-input>
            </el-form-item>
            <el-form-item label="是否已领取">
                <el-switch v-model="formModel.claimState" />
            </el-form-item>
            <el-form-item label="总领取次数" prop="totalClaimCount">
                <el-input-number v-model="formModel.totalClaimCount" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="说明" prop="description">
                <el-input v-model="formModel.description"></el-input>
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import * as api from '~/api/vip-gift.js';

const formModel = reactive({
    id: '',
    name: '',
    claimState: false,
    totalClaimCount: 0,
    description: '',
});

const rules = {
    id: [{ required: true, message: '必填项', trigger: 'blur' }],
    name: [{ required: true, message: '必填项', trigger: 'blur' }],
    claimState: [{ required: true, message: '必填项', trigger: 'blur' }],
    totalClaimCount: [{ required: true, message: '必填项', trigger: 'blur' }],
};

const request = async (isAdd) => {
    if (isAdd) {
        await api.addVipGift(formModel);
    } else {
        await api.updateVipGift(formModel.id, formModel);
    }
};
</script>
