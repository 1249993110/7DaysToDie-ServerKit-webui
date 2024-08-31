<template>
    <el-button class="icon-btn" plain>
        <el-icon :size="iconSize">
            <slot>Undefined Icon</slot>
        </el-icon>
    </el-button>
</template>

<script setup>
const props = defineProps({
    color: {
        type: String,
        default: '#303133',
    },
    backgroundColor: {
        type: String,
        default: 'unset',
    },
    hoverColor: {
        type: String,
        default: 'var(--el-color-primary)',
    },
    activeColor: {
        type: String,
        default: 'var(--el-color-primary)',
    },
    hoverBackgroundColor: {
        type: String,
        default: 'unset',
    },
    activeBackgroundColor: {
        type: String,
        default: 'unset',
    },
    iconSize: {
        type: [Number, String],
        default: 24,
    },
    btnSize: {
        type: [Number, String],
        default: 32,
    },
});

const btnSize = computed(() => addUnit(props.btnSize));
</script>

<style scoped lang="scss">
.icon-btn {
    border: none;
    padding: 0;
    color: v-bind(color);
    background-color: v-bind(backgroundColor);
    height: v-bind(btnSize);
    width: v-bind(btnSize);
    &:hover {
        background-color: v-bind(hoverBackgroundColor);
        color: v-bind(hoverColor);
    }
    &:active {
        background-color: v-bind(activeBackgroundColor);
        color: v-bind(activeColor);
    }
    .el-icon {
        &:focus {
            outline: none;
        }
    }
}
</style>
