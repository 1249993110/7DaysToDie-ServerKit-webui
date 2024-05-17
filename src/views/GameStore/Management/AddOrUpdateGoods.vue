<template>
    <el-dialog :title="isAdd ? '新增商品' : '编辑商品'" v-model="visible" width="650px">
        <el-form ref="formRef" :model="formModel" status-icon label-width="160px" label-position="right">
            <el-form-item v-if="!isAdd" label="商品Id" prop="id">
                <el-input :disabled="true" v-model="formModel.id"></el-input>
            </el-form-item>
            <el-form-item label="商品名称" prop="name" required>
                <el-input v-model="formModel.name"></el-input>
            </el-form-item>
            <el-form-item class="label" :label="`执行指令\n(每行一条)`" prop="executeCommands" required>
                <el-input v-model="formModel.executeCommands" type="textarea" :rows="5"></el-input>
            </el-form-item>
            <el-form-item label="是否在主线程执行命令" prop="inMainThread">
                <el-switch v-model="formModel.inMainThread" />
            </el-form-item>
            <el-form-item label="售价" prop="price" required>
                <el-input v-model="formModel.price"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="submit">保存</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import * as api from '~/api/goods.js';

const isAdd = ref(false);
const visible = ref(false);

const formModel = reactive({});

const formRef = ref();

const submit = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        await formRef.value.validate();

        if (isAdd.value) {
            await api.addGoods(formModel);
        } else {
            await api.updateGoods(formModel.id, formModel);
        }

        ElMessage.success('保存成功');
        visible.value = false;
        emit('onSubmit');
    } finally {
        loading.close();
    }
};

const show = (row) => {
    visible.value = true;

    if (!row) {
        isAdd.value = true;
        formRef.value?.resetFields();
    } else {
        isAdd.value = false;
        nextTick(() => {
            Object.assign(formModel, row);
        });
    }
};

defineExpose({
    show,
});

const emit = defineEmits(['onSubmit']);
</script>

<style scoped lang="scss">
.label {
    :deep(.el-form-item__label) {
        word-break: break-all;
        white-space: pre-wrap;
    }
}
</style>
