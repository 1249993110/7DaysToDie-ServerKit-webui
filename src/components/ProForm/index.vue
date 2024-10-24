<template>
    <el-form :model="model" ref="formRef" status-icon class="pro-form" :rules="rules">
        <el-row :gutter="rowGutter">
            <el-col v-for="item in fields" :key="item.name" v-bind="getColSpan(item.span)">
                <el-form-item v-bind="item" :prop="item.name" v-if="item.type !== 'divided'">
                    <component v-if="item.render" :is="item.render" v-model="getProp(model, item.name).value" v-bind="item.props" />
                    <slot v-else-if="item.slot && $slots[item.slot]" :name="item.slot" />
                    <el-input
                        v-else-if="item.type === 'input'"
                        v-model="getProp(model, item.name).value"
                        clearable
                        :placeholder="t('global.message.inputText')"
                        v-bind="item.props"
                        @blur="
                            if (item.props?.trim ?? true) {
                                const computedValue = getProp(model, item.name);
                                computedValue.value = computedValue.value.trim();
                            }
                        "
                    />
                    <el-date-picker v-else-if="item.type === 'date-picker'" v-model="getProp(model, item.name).value" clearable v-bind="item.props" />
                    <el-time-select v-else-if="item.type === 'time-select'" v-model="getProp(model, item.name).value" clearable v-bind="item.props" />
                    <el-input-number v-else-if="item.type === 'input-number'" v-model="getProp(model, item.name).value" clearable v-bind="item.props" />
                    <el-switch
                        v-else-if="item.type === 'switch'"
                        v-model="getProp(model, item.name).value"
                        :active-text="t('global.on')"
                        :inactive-text="t('global.off')"
                        v-bind="item.props"
                    />
                    <component
                        v-else-if="customComponents && customComponents[item.type]"
                        :is="customComponents[item.type]"
                        v-model="getProp(model, item.name).value"
                        v-bind="item.props"
                    />
                </el-form-item>
            </el-col>
            <el-col v-if="btnGroup && btnGroup.inline" v-bind="colSpan">
                <el-form-item v-if="btnGroup" class="footer-btns">
                    <slot name="btnGroup">
                        <BtnGroup v-bind="btnGroup" @cancel="emit('cancel')" @submit="handleSubmit" @reset="resetFields" />
                    </slot>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item v-if="btnGroup && !btnGroup.inline" class="footer-btns">
            <slot name="btnGroup">
                <BtnGroup v-bind="btnGroup" @cancel="emit('cancel')" @submit="handleSubmit" @reset="resetFields" />
            </slot>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { getProp } from 'element-plus/es/utils/index';
import BtnGroup from './BtnGroup.vue';

const props = defineProps({
    customComponents: {
        type: Object,
    },
    rules: {
        type: Object,
    },
    rowGutter: {
        type: Number,
        default: 20,
    },
    colSpan: {
        type: [Number, Object],
        default: 24,
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
    preventDefaultReset: {
        type: Boolean,
        default: false,
    },
});

const { t } = useI18n();

const rules = computed(() => {
    const result = {};
    for (let i = 0, len = props.fields.length; i < len; i++) {
        const field = props.fields[i];
        if (field.name && field.required) {
            const baseRule = [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }];
            if (props.rules && Array.isArray(props.rules[field.name])) {
                result[field.name] = [...baseRule, ...props.rules[field.name]];
            } else {
                result[field.name] = baseRule;
            }
        }
    }

    return { ...props.rules, ...result };
});

const getColSpan = (itemSpan) => {
    if (itemSpan) {
        return {
            span: itemSpan,
        };
    }
    if (typeof props.colSpan === 'number') {
        return {
            span: props.colSpan,
        };
    }
    return props.colSpan;
};

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
const resetFields = () => {
    if (!props.preventDefaultReset) {
        formRef.value.resetFields();
    }

    emit('reset');
};

defineExpose({
    resetFields,
});
</script>

<style scoped lang="scss">
.pro-form {
    .footer-btns {
        margin-bottom: 0;
    }
    .el-form-item {
        :deep(.el-form-item__label) {
            white-space: pre-wrap;

            &::before {
                width: 6px;

                content: '';
                margin-right: 4px;
            }
        }
    }
}
</style>
