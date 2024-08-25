<template>
    <MyDialogForm :titleSuffix="t('views.pointsSystem.tableHeader.points')" :formModel="formModel" :rules="rules" :request="request">
        <template #default="{ isAdd }">
            <el-form-item :label="t('views.pointsSystem.tableHeader.playerName')" prop="playerName">
                <el-input :disabled="!isAdd" v-model="formModel.playerName"></el-input>
            </el-form-item>
            <el-form-item :label="t('views.pointsSystem.tableHeader.playerId')" prop="id">
                <el-input :disabled="!isAdd" v-model="formModel.id"></el-input>
            </el-form-item>
            <el-form-item :label="t('views.pointsSystem.tableHeader.points')" prop="points">
                <el-input-number v-model="formModel.points"></el-input-number>
            </el-form-item>
            <el-form-item :label="t('views.pointsSystem.tableHeader.lastSignInAt')" prop="lastSignInAt">
                <el-date-picker v-model="formModel.lastSignInAt" type="datetime" :placeholder="t('global.message.datePickerPlaceholder')" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm:00" />
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import * as api from '~/api/points-info';

const { t } = useI18n();
const formModel = reactive({
    playerName: '',
    id: '',
    points: 0,
    lastSignInAt: '',
});

const rules = {
    id: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    points: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    lastSignInAt: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
};

const request = async (isAdd) => {
    if (isAdd) {
        await api.addPointsInfo(formModel);
    } else {
        await api.updatePointsInfo(formModel.id, formModel);
    }
};
</script>

