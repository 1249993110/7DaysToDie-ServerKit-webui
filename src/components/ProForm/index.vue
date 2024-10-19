<template>
    <el-form :model="model" ref="formRef" status-icon class="pro-form">
        <el-row :gutter="rowGutter">
            <el-col v-for="item in fields" :key="item.name" v-bind="colSpan">
                <el-form-item v-bind="item" :prop="item.name">
                    <component v-if="item.render" :is="item.render" v-model="model[item.name]" v-bind="item.props" />
                    <el-input v-else-if="item.type === 'input'" v-model.trim="model[item.name]" clearable v-bind="item.props" />
                </el-form-item>
            </el-col>
            <el-col v-if="btnGroup && btnGroup.inline" v-bind="colSpan">
                <el-form-item v-if="btnGroup" class="footer-btns">
                    <slot name="btnGroup">
                        <BtnGroup v-bind="btnGroup" @cancel="emit('cancel')" @submit="handleSubmit" @reset="resetForm" />
                    </slot>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item v-if="btnGroup && !btnGroup.inline" class="footer-btns">
            <slot name="btnGroup">
                <BtnGroup v-bind="btnGroup" @cancel="emit('cancel')" @submit="handleSubmit" @reset="resetForm" />
            </slot>
        </el-form-item>
    </el-form>
</template>

<script setup>
import BtnGroup from './BtnGroup.vue';

const props = defineProps({
    rowGutter: {
        type: Number,
        default: 20,
    },
    colSpan: {
        type: [Number, Object],
        default: 12,
    },
    fields: {
        type: Object,
        required: true,
    },
    btnGroup: {
        type: [Boolean, Object],
        default: true,
    },
    model: {
        type: Object,
        required: true,
    },
    request: {
        type: Function,
        required: true,
    },
});

const colSpan = computed(() => {
    if (typeof props.colSpan === 'number') {
        return {
            span: props.colSpan,
        };
    }
    return props.colSpan;
});

const emit = defineEmits(['cancel', 'submit', 'reset', 'error']);

const formRef = ref(null);
const handleSubmit = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        await formRef.value.validate();
        const result = await Promise.resolve(props.request());
        emit('submit', result);
    } catch (error) {
        emit('error', error);
    } finally {
        loading.close();
    }
};
const resetForm = () => {
    formRef.value.resetFields();
    emit('reset');
};
</script>

<style scoped lang="scss">
.pro-form {
    .footer-btns {
        margin-bottom: 0;
    }
}
</style>
