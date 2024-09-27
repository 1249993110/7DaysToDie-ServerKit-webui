<template>
    <el-color-picker v-model="innerModel" :predefine="predefineColors" color-format="hex" />
</template>

<script setup>
const modelValue = defineModel({
    type: String,
});

const innerModel = computed({
    get() {
        if (!modelValue.value) {
            return '';
        }
        return '#' + modelValue.value;
    },
    set(val) {
        if (!val) {
            modelValue.value = '';
            return;
        }
        modelValue.value = val.substring(1);
    },
});

const predefineColors = ref(['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585']);
</script>
