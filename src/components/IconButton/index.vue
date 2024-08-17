<template>
    <el-button class="icon-btn" plain>
        <el-icon :color="color" :size="size">
            <slot>Undefined Icon</slot>
        </el-icon>
    </el-button>
</template>

<script setup>
const props = defineProps({
    color: {
        type: String,
    },
    size: {
        type: [String, Number],
    },
});
</script>

<style scoped>
.icon-btn {
    border: none;
    .el-icon {
        &:focus {
            outline: none;
        }
    }
}
</style>
