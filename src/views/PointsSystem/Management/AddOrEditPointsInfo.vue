<template>
    <MyDialogForm titleSuffix="积分" :formModel="formModel" :rules="rules" :request="request">
        <template #default="{ isAdd }">
            <el-form-item label="玩家名称" prop="playerName">
                <el-input :disabled="!isAdd" v-model="formModel.playerName"></el-input>
            </el-form-item>
            <el-form-item label="玩家Id" prop="id">
                <el-input :disabled="!isAdd" v-model="formModel.id"></el-input>
            </el-form-item>
            <el-form-item label="积分数量" prop="points">
                <el-input-number v-model="formModel.points"></el-input-number>
            </el-form-item>
            <el-form-item label="上次签到日期" prop="lastSignInAt">
                <el-date-picker v-model="formModel.lastSignInAt" type="datetime" placeholder="选择日期" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm:00" />
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import * as api from '~/api/points-info';

const formModel = reactive({
    playerName: '',
    id: '',
    points: 0,
    lastSignInAt: '',
});

const rules = {
    id: [{ required: true, message: '必填项', trigger: 'blur' }],
    points: [{ required: true, message: '必填项', trigger: 'blur' }],
    lastSignInAt: [{ required: true, message: '必填项', trigger: 'blur' }],
};

const request = async (isAdd) => {
    if (isAdd) {
        await api.addPointsInfo(formModel);
    } else {
        await api.updatePointsInfo(formModel.id, formModel);
    }
};
</script>

