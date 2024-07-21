<template>
    <el-image :src="src" :style="style" lazy>
        <template #error>
            <div class="image-slot">
                <el-icon :size="size"><IconPicture /></el-icon>
            </div>
        </template>
    </el-image>
</template>

<script setup>
import { getIconUrl } from '~/utils/image-helper';
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
const src = computed(() => getIconUrl(props.name));

const style = computed(() => {
    return {
        width: props.size + 'px',
        height: props.size + 'px',
    };
});
</script>
