<template>
    <el-input v-model="textareaValue" type="textarea" :rows="5"></el-input>
</template>

<script setup>
const modelValue = defineModel({
    type: Array,
    default: [],
});

const textareaValue = computed({
    get() {
        return modelValue.value.join('\n');
    },
    set(val) {
        modelValue.value = val.split('\n');
    },
});
</script>
