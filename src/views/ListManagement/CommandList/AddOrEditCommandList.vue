<template>
    <MyDialogForm titleSuffix="命令" :formModel="formModel" :rules="rules" :request="request">
        <template #default="{ isAdd }">
            <el-form-item label="自定义命令" prop="command">
                <el-input v-model="formModel.command"></el-input>
            </el-form-item>
            <el-form-item label="在主线程执行" prop="inMainThread">
                <el-switch v-model="formModel.inMainThread" />
            </el-form-item>
            <el-form-item label="说明" prop="description">
                <el-input v-model="formModel.description" />
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import * as api from '~/api/command-list.js';


const formModel = reactive({
    inMainThread: true
});

const rules = {
    command: [{ required: true, message: '必填项', trigger: 'blur' }],
};

const request = async (isAdd) => {
    if (isAdd) {
        await api.addCommand(formModel);
    } else {
        await api.updateCommand(formModel.id, formModel);
    }
};

const itemBlockSelectorVisible = ref(false);
const handleSelect = (item) => {
    formModel.itemName = item.itemName;
    formModel.description = item.localizationName;
    itemBlockSelectorVisible.value = false;
};
</script>

