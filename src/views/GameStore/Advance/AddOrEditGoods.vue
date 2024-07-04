<template>
    <MyDialogForm titleSuffix="高级商品" :formModel="formModel" :rules="rules" :request="request">
        <template #default="{ isAdd }">
            <el-form-item label="商品Id" prop="id">
                <el-input :disabled="!isAdd" v-model="formModel.id"></el-input>
            </el-form-item>
            <el-form-item label="商品名称" prop="name">
                <el-input v-model="formModel.name"></el-input>
            </el-form-item>
            <el-form-item label="售价" prop="price">
                <el-input-number v-model="formModel.price" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="自定义命令" prop="commands">
                <MyTextarea v-model="formModel.commands"></MyTextarea>
            </el-form-item>
            <el-form-item label="在主线程执行" prop="inMainThread">
                <el-switch v-model="formModel.inMainThread" />
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import * as api from '~/api/goods.js';

const formModel = reactive({
    id: 0,
    name: '',
    price: 1,
    commands: [],
    inMainThread: true,
});

const rules = {
    id: [{ required: true, message: '必填项', trigger: 'blur' }],
    name: [{ required: true, message: '必填项', trigger: 'blur' }],
    price: [{ required: true, message: '必填项', trigger: 'blur' }],
    commands: [{ required: true, message: '必填项', trigger: 'blur' }],
};

const request = async (isAdd) => {
    const data = {
        id: formModel.id,
        name: formModel.name,
        content: JSON.stringify(formModel.commands),
        contentType: 'command',
        inMainThread: formModel.inMainThread,
        price: formModel.price,
    };
    if (isAdd) {
        await api.addGoods(data);
    } else {
        await api.updateGoods(formModel.id, data);
    }
};
</script>

<style scoped lang="scss"></style>
