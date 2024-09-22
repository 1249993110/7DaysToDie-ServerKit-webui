<template>
    <el-select-v2 :options="options" :placeholder="t('global.button.select')" style="width: 150px"> </el-select-v2>
</template>

<script setup>
const { t } = useI18n();

const options = [
    { label: '0°', value: 0 },
    { label: '90°', value: 1 },
    { label: '180°', value: 2 },
    { label: '270°', value: 3 },
];
</script>
