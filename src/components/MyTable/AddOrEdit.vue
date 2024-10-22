<template>
    <MyFormDialog ref="formRef" :title="title" :fields="addOrEditFields" :form-model="formModel" :request="request"></MyFormDialog>
</template>

<script setup>
const props = defineProps({
    titleSuffix: {
        type: String,
        default: '',
    },
    addOrEditFields: {
        type: Array,
        required: true,
    },
    requestAdd: {
        type: Function,
        requied: true,
    },
    requestEdit: {
        type: Function,
        requied: true,
    },
});

const { t } = useI18n();
const formRef = ref(null);

const isAdd = ref(true);
const formModel = reactive({});
const title = computed(() => (isAdd.value ? t('global.button.add') : t('global.button.edit')) + props.titleSuffix);

const request = async () => {
    isAdd.value ? await props.requestAdd(formModel) : await props.requestEdit(formModel);
};

const open = (initData) => {
    if (initData) {
        Object.assign(formModel, initData);
        isAdd.value = false;
    } else {
        isAdd.value = true;
    }
    formRef.value.open();
};

defineExpose({
    open,
});
</script>
