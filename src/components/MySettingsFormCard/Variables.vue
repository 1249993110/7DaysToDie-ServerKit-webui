<template>
    <div class="variables">
        <el-tag v-for="item in values" :key="item">{{ '{' + item + '}' }}</el-tag>
    </div>
</template>

<script setup>
const props = defineProps({
    values: {
        type: Array,
        required: true,
    },
});
</script>

<style scoped lang="scss">
.variables {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}
</style>
