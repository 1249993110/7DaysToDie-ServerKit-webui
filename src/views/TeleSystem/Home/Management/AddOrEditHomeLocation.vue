<template>
    <MyDialogForm :titleSuffix="t('views.teleSystem.home.titleSuffix')" :formModel="formModel" :rules="rules" :request="request">
        <template #default="{ isAdd }">
            <el-form-item :label="t('views.teleSystem.home.tableHeader.playerId')" prop="playerId">
                <el-input :disabled="!isAdd" v-model="formModel.playerId"></el-input>
            </el-form-item>
            <el-form-item :label="t('views.teleSystem.home.tableHeader.playerName')" prop="playerName">
                <el-input v-model="formModel.playerName"></el-input>
            </el-form-item>
            <el-form-item :label="t('views.teleSystem.home.tableHeader.homeName')" prop="homeName">
                <el-input v-model="formModel.homeName"></el-input>
            </el-form-item>
            <el-form-item :label="t('views.teleSystem.home.tableHeader.position')" prop="position">
                <Coordinate v-model="formModel.position"></Coordinate>
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import * as api from '~/api/home-location';

const { t } = useI18n();
const formModel = reactive({});

const rules = {
    playerId: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    homeName: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    position: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
};

const request = async (isAdd) => {
    if (isAdd) {
        await api.addHomeLocation(formModel);
    } else {
        await api.updateHomeLocation(formModel.id, formModel);
    }
};
</script>
