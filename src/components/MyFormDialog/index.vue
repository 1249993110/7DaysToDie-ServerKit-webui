<template>
    <el-dialog v-model="visible" :title="title" draggable :close-on-click-modal="false" :width="width" @closed="handleClosed">
        <ProForm
            ref="formRef"
            v-bind="$attrs"
            :model="formModel"
            :label-width="labelWidth"
            :label-position="labelPosition"
            @cancel="handleCancel"
            @submit="handleConfirm"
            :btn-group="btnGroup"
            :col-span="24"
        >
            <template #[slot] v-for="slot in Object.keys($slots)">
                <slot :name="slot" />
            </template>
        </ProForm>
    </el-dialog>
</template>

<script setup>
const props = defineProps({
    formModel: {
        type: Object,
        required: true,
    },
    title: {
        type: String,
        default: '',
    },
    width: {
        type: [String, Number],
        default: 640,
    },
    labelWidth: {
        type: [String, Number],
        default: 120,
    },
    labelPosition: {
        type: String,
        default: 'left',
    },
    successMessage: {
        type: String,
    },
});

const { t } = useI18n();

const formRef = ref(null);

const btnGroup = {
    inline: false,
    position: 'right',
    gutter: 30,
    padding: 24,
    margin: '12px 4px 0 0',
    cancel: {
        label: t('global.button.cancel'),
        visible: true,
    },
    submit: {
        label: t('global.button.confirm'),
        visible: true,
    },
};

const visible = ref(false);

const open = () => {
    visible.value = true;
};

const handleCancel = () => {
    visible.value = false;
};

const handleConfirm = async () => {
    visible.value = false;
    ElMessage.success(props.successMessage ?? t('global.message.saveSuccess'));
};

const handleClosed = () => {
    formRef.value.resetFields();
};

defineExpose({
    open: open,
});
</script>
