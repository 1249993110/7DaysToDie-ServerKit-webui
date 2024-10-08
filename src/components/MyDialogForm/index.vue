<template>
    <el-dialog ref="dialogRef" :title="title" draggable :close-on-click-modal="false" :width="width" @open="handleOpen" @closed="handleClosed">
        <el-form ref="formRef" :model="formModel" :rules="rules" :label-width="labelWidth" :label-position="labelPosition" status-icon>
            <slot :isAdd="isAdd"></slot>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancel">{{ cancelBtnText }}</el-button>
                <el-button type="primary" @click="handleConfirm">{{ confirmBtnText }}</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { i18n } from '~/plugins/i18n';
const { t } = i18n.global;

const props = defineProps({
    titleSuffix: {
        type: String,
        default: '',
    },
    width: {
        type: [String, Number],
        default: '640px',
    },
    formModel: {
        type: Object,
    },
    isAdd: {
        type: Boolean,
        default: false,
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
    successMessage: {
        type: String,
        default: i18n.global.t('global.message.saveSuccess'),
    },
    cancelBtnText: {
        type: String,
        default: i18n.global.t('global.button.cancel'),
    },
    confirmBtnText: {
        type: String,
        default: i18n.global.t('global.button.confirm'),
    },
});

const title = computed(() => (props.isAdd ? t('global.button.add') : t('global.button.edit')) + props.titleSuffix);

const dialogRef = ref();
const formRef = ref();

const handleCancel = () => {
    dialogRef.value.visible = false;
};

const emit = defineEmits(['onOpen', 'onConfirm', 'onClosed']);
const handleConfirm = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        await formRef.value.validate();
        const result = await Promise.resolve(props.request(props.isAdd));
        emit('onConfirm', result);
        dialogRef.value.visible = false;
        ElMessage.success(props.successMessage);
    } catch (error) {
        console.log(error);
    } finally {
        loading.close();
    }
};

const handleOpen = () => {
    if (props.initData) {
        Object.assign(props.formModel, props.initData);
    }
    emit('onOpen');
};

const handleClosed = () => {
    formRef.value?.resetFields();
    emit('onClosed');
};
</script>
