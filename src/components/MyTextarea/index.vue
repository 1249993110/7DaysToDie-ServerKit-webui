<template>
    <el-input v-model="innerModel" type="textarea" :rows="5"></el-input>
</template>

<script setup>
const modelValue = defineModel({
    type: Array,
    default: [],
});

const innerModel = computed({
    get() {
        return modelValue.value.join('\n');
    },
    set(val) {
        modelValue.value = val.split('\n');
    },
});
</script>
