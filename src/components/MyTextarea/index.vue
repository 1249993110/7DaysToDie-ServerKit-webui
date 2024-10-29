<template>
    <el-input v-model="innerModel" type="textarea" :rows="2" @blur="handleBlur" :autosize="{ minRows: 2, maxRows: 8 }"></el-input>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Array,
        default: [],
    },
    trim: {
        type: Boolean,
        default: true,
    },
});

const modelValue = useVModel(props, 'modelValue');

const innerModel = computed({
    get() {
        return modelValue.value.join('\n');
    },
    set(val) {
        modelValue.value = val.split('\n');
    },
});

const handleBlur = () => {
    if (!props.trim) {
        return;
    }
    for (let i = 0, len = modelValue.value.length; i < len; i++) {
        modelValue.value[i] = modelValue.value[i].trim();
    }
};
</script>
