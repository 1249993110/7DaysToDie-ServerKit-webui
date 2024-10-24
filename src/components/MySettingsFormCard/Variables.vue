<template>
    <div class="variables">
        <el-tag v-for="item in values" :key="item" class="tag">{{ '{' + item + '}' }}</el-tag>
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
    gap: 4px;
    .tag {
        margin-right: 8px;
    }
}
</style>
