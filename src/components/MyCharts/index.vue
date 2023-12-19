<template>
    <component :is="typeComponentMap[type]" :height="height" :option="option" :dataZoom="dataZoom" />
</template>
<script setup>
// import Line from './Line.vue';
import Pie from './Pie.vue';

defineProps({
    type: {
        type: String,
        default: 'line',
    },
    height: {
        type: String,
        default: '200px',
    },
    dataZoom: Boolean,
    option: {
        type: Object,
        required: true,
    }, // { title , xDatas, yDatas, formatStr  }
});

const typeComponentMap = { pie: Pie };
</script>
