<template>
    <MyDialogForm titleSuffix="商品" :formModel="formModel" :rules="rules" :request="request">
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
            <el-form-item label="物品名称" prop="itemName">
                <ItemBlockSelector v-model="itemBlockSelectorVisible" @on-select="handleSelect" />
                <div style="display: flex; align-items: center">
                    <el-image :src="imageSrc" style="width: 80px; height: 80px"></el-image>
                    <el-button @click="itemBlockSelectorVisible = true" style="margin-left: 8px">选择物品</el-button>
                </div>
                <el-input v-model="formModel.itemName"></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="count">
                <el-input-number v-model="formModel.count" :min="1" :max="1000000" />
            </el-form-item>
            <el-form-item label="品质" prop="quality">
                <el-input-number v-model="formModel.quality" :min="0" :max="7" />
            </el-form-item>
            <el-form-item label="耐久度" prop="durability">
                <el-input-number v-model="formModel.durability" :min="0" :max="100" />
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import * as api from '~/api/goods.js';
import { getIconUrl } from '~/utils/image-helper';

const itemBlockSelectorVisible = ref(false);
const formModel = reactive({
    id: 0,
    name: '',
    price: 1,
    itemName: '',
    count: 1,
    quality: 1,
    durability: 100,
    itemIcon: '',
    iconColor: '',
});

const rules = {
    id: [{ required: true, message: '必填项', trigger: 'blur' }],
    name: [{ required: true, message: '必填项', trigger: 'blur' }],
    price: [{ required: true, message: '必填项', trigger: 'blur' }],
    itemName: [{ required: true, message: '必填项', trigger: 'blur' }],
    count: [{ required: true, message: '必填项', trigger: 'blur' }],
};

const request = async (isAdd) => {
    const data = {
        id: formModel.id,
        name: formModel.name,
        content: JSON.stringify(formModel),
        contentType: 'item',
        inMainThread: false,
        price: formModel.price,
    };
    if (isAdd) {
        await api.addGoods(data);
    } else {
        await api.updateGoods(formModel.id, data);
    }
};

const handleSelect = (item) => {
    formModel.name = item.localizationName;
    formModel.itemName = item.itemName;
    formModel.itemIcon = item.itemIcon;
    formModel.iconColor = item.iconColor;
    itemBlockSelectorVisible.value = false;
};

const imageSrc = computed(() => {
    return getIconUrl(formModel);
});
</script>
