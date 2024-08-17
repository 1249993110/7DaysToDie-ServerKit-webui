<template>
    <el-image :src="src" :style="style" lazy>
        <template #error>
            <el-icon :size="size" :color="color"><IconPicture /></el-icon>
        </template>
    </el-image>
</template>

<script setup>
import { getItemIconUrl, getUiIconUrl } from '~/utils/image-helper';
import { Picture as IconPicture } from '@element-plus/icons-vue';

const props = defineProps({
    name: {
        type: String,
        default: '',
    },
    color: {
        type: String,
    },
    backgroundColor: {
        type: String,
    },
    size: {
        type: Number,
        default: 80,
    },
    isUiIcon: {
        type: Boolean,
        default: false,
    },
});

const src = computed(() => {
    if (props.isUiIcon) {
        return getUiIconUrl(props.name);
    } else {
        return getItemIconUrl(props.name);
    }
});
const style = computed(() => {
    return {
        width: props.size + 'px',
        height: props.size + 'px',
        backgroundColor: props.backgroundColor,
    };
});
</script>
