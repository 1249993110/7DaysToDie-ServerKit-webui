<template>
    <MyDialogForm :titleSuffix="t('views.gameStore.goods')" :formModel="formModel" :rules="rules" :request="request">
        <template #default="{ isAdd }">
            <el-form-item :label="t('views.gameStore.goods') + ' ' + t('views.gameStore.tableHeader.id')" prop="id">
                <el-input-number :disabled="!isAdd" v-model="formModel.id" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item :label="t('views.gameStore.tableHeader.name')" prop="name">
                <el-input v-model="formModel.name"></el-input>
            </el-form-item>
            <el-form-item :label="t('views.gameStore.tableHeader.price')" prop="price">
                <el-input-number v-model="formModel.price" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item :label="t('views.gameStore.tableHeader.description')" prop="description">
                <el-input v-model="formModel.description"></el-input>
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import * as api from '~/api/goods.js';

const { t } = useI18n();
const formModel = reactive({
    id: 0,
    name: '',
    price: 1,
    description: '',
});

const rules = {
    id: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    name: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    price: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
};

const request = async (isAdd) => {
    if (isAdd) {
        await api.addGoods(formModel);
    } else {
        await api.updateGoods(formModel.id, formModel);
    }
};
</script>
