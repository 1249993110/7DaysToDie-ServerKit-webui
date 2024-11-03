<template>
    <el-form :model="model" ref="formRef" status-icon class="pro-form" :rules="rules">
        <el-row :gutter="rowGutter">
            <el-col v-for="item in fields" :key="item.name" :style="{ minWidth: addUnit(item.minWidth) }" v-bind="getColSpan(item.span)">
                <el-form-item v-bind="item" :prop="item.name" v-if="item.type !== 'divided'">
                    <component v-if="item.render" v-bind="item.props" :is="item.render" v-model="getProp(model, item.name).value" />
                    <slot v-else-if="item.slot && $slots[item.slot]" :name="item.slot" />
                    <el-input
                        v-else-if="item.type === 'input'"
                        v-model="getProp(model, item.name).value"
                        clearable
                        :placeholder="t('global.message.inputText')"
                        :autosize="{ minRows: 2, maxRows: 8 }"
                        v-bind="item.props"
                        @blur="
                            () => {
                                if (item.props?.trim ?? true) {
                                    const computedValue = getProp(model, item.name);
                                    if (computedValue.value) {
                                        computedValue.value = computedValue.value.trim();
                                    }
                                }
                            }
                        "
                    />
                    <el-date-picker v-else-if="item.type === 'date-picker'" v-model="getProp(model, item.name).value" clearable v-bind="item.props" />
                    <el-time-select v-else-if="item.type === 'time-select'" v-model="getProp(model, item.name).value" clearable v-bind="item.props" />
                    <el-input-number v-else-if="item.type === 'input-number'" v-model="getProp(model, item.name).value" clearable v-bind="item.props" />
                    <el-select-v2
                        v-else-if="item.type === 'select-v2'"
                        v-model="getProp(model, item.name).value"
                        clearable
                        scrollbar-always-on
                        :placeholder="t('global.button.select')"
                        v-bind="item.props"
                    />
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
                        v-bind="item.props"
                        v-model="getProp(model, item.name).value"
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
        <slot name="append" />
    </el-form>
</template>

<script setup>
import { getProp } from 'element-plus/es/utils/index';
import BtnGroup from './BtnGroup.vue';
import { i18n } from '~/plugins/i18n';
import { addUnit } from '~/utils/index';

const { t } = i18n.global;

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

const applyDefaultValue = () => {
    for (let i = 0; i < props.fields.length; i++) {
        const item = props.fields[i];
        if (item.default != null && item.name) {
            props.model[item.name] = item.default;
        }
    }
};

applyDefaultValue();

defineExpose({ resetFields });
</script>

<style scoped lang="scss">
.pro-form {
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
