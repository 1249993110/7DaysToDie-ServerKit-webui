<template>
    <el-dialog ref="dialogRef" :title="(isAdd ? '添加' : '编辑') + titleSuffix" draggable :close-on-click-modal="false" :width="width" @open="handelOpen" @close="handelClose">
        <el-form ref="formRef" :model="formModel" :rules="rules" :label-width="labelWidth" :label-position="labelPosition" status-icon>
            <slot :isAdd="isAdd"></slot>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleConfirm">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
const props = defineProps({
    titleSuffix: {
        type: String,
    },
    width: {
        type: [String, Number],
        default: '640px',
    },
    formModel: {
        type: Object,
    },
    initData: {
        type: Object,
    },
    rules: {
        type: Object,
    },
    labelWidth: {
        type: [String, Number],
        default: '110px',
    },
    labelPosition: {
        type: String,
        default: 'right',
    },
    request: {
        type: Function,
    },
});

const dialogRef = ref();
const formRef = ref();

const isAdd = computed(() => !props.initData);

const handleCancel = () => {
    dialogRef.value.visible = false;
};

const emit = defineEmits(['onConfirm']);
const handleConfirm = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        await formRef.value.validate();
        const result = await Promise.resolve(props.request(isAdd.value));
        emit('onConfirm', result);
        dialogRef.value.visible = false;
        ElMessage.success('保存成功');
    } catch (error) {
    } finally {
        loading.close();
    }
};

const handelOpen = () => {
    if (props.initData) {
        Object.assign(props.formModel, props.initData);
    }
};

const handelClose = () => {
    formRef.value?.resetFields();
};
</script>
