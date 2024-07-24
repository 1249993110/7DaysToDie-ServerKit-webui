<template>
    <MyDialogForm titleSuffix="城镇" :formModel="formModel" :rules="rules" :request="request">
        <template #default="{ isAdd }">
            <el-form-item label="城镇Id" prop="id">
                <el-input-number :disabled="!isAdd" v-model="formModel.id" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="城镇名称" prop="cityName">
                <el-input v-model="formModel.cityName"></el-input>
            </el-form-item>
            <el-form-item label="传送需要积分" prop="pointsRequired">
                <el-input-number v-model="formModel.pointsRequired"></el-input-number>
            </el-form-item>
            <el-form-item label="坐标 (X, Y, Z)" prop="position">
                <Coordinate v-model="formModel.position"></Coordinate>
            </el-form-item>
            <el-form-item label="视角方向" prop="viewDirection">
                <el-select-v2 v-model="formModel.viewDirection" :options="viewDirectionOptions" placeholder="选择" style="width: 150px" clearable scrollbar-always-on>
                </el-select-v2>
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import * as api from '~/api/city-location.js';
import { viewDirectionOptions } from '~/utils/view-direction-options.js';

const formModel = reactive({
    id: 0,
    cityName: '',
    pointsRequired: 0,
    position: '',
    viewDirection: '',
});

const rules = {
    id: [{ required: true, message: '必填项', trigger: 'blur' }],
    cityName: [{ required: true, message: '必填项', trigger: 'blur' }],
    pointsRequired: [{ required: true, message: '必填项', trigger: 'blur' }],
    position: [{ required: true, message: '必填项', trigger: 'blur' }],
};

const request = async (isAdd) => {
    if (isAdd) {
        await api.addCityLocation(formModel);
    } else {
        await api.updateCityLocation(formModel.id, formModel);
    }
};
</script>
