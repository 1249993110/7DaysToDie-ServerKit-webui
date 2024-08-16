<template>
    <el-image :src="src" :style="style" lazy>
        <template #error>
            <el-icon :size="size"><IconPicture /></el-icon>
        </template>
    </el-image>
</template>

<script setup>
import { getItemIconUrl } from '~/utils/image-helper';
import { Picture as IconPicture } from '@element-plus/icons-vue';

const props = defineProps({
    name: {
        type: String,
        default: '',
    },
    size: {
        type: Number,
        default: 80,
    },
});

const src = computed(() => getItemIconUrl(props.name));
const style = computed(() => {
    return {
        width: props.size + 'px',
        height: props.size + 'px',
    };
});
</script>
