<template>
    <el-input v-model="textareaValue" type="textarea" :rows="5"></el-input>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Array,
        default: [],
    },
});

const { modelValue } = useVModels(props);

const textareaValue = computed({
    get() {
        return modelValue.value.join('\n');
    },
    set(val) {
        modelValue.value = val.split('\n');
    },
});
</script>
