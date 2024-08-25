<template>
    <MyDialogForm titleSuffix="Home" :formModel="formModel" :rules="rules" :request="request">
        <template #default="{ isAdd }">
            <el-form-item label="玩家Id" prop="playerId">
                <el-input :disabled="!isAdd" v-model="formModel.playerId"></el-input>
            </el-form-item>
            <el-form-item label="玩家名称">
                <el-input v-model="formModel.playerName"></el-input>
            </el-form-item>
            <el-form-item label="Home名称" prop="homeName">
                <el-input v-model="formModel.homeName"></el-input>
            </el-form-item>
            <el-form-item label="坐标 (X, Y, Z)" prop="position">
                <Coordinate v-model="formModel.position"></Coordinate>
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import * as api from '~/api/home-location';

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
