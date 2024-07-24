<template>
    <div>
        <el-input-number v-model="x"></el-input-number>
        <el-input-number v-model="y" style="margin-left: 8px"></el-input-number>
        <el-input-number v-model="z" style="margin-left: 8px"></el-input-number>
    </div>
</template>

<script setup>
const modelValue = defineModel({
    type: String,
    default: '',
});

const x = ref(undefined);
const y = ref(undefined);
const z = ref(undefined);

watch(
    () => modelValue.value,
    (val) => {
        if (!val) {
            x.value = undefined;
            y.value = undefined;
            z.value = undefined;
            return;
        }

        const split = val.split(' ');
        x.value = parseInt(split[0]);
        y.value = parseInt(split[1]);
        z.value = parseInt(split[2]);
    },
    { immediate: true }
);

watch(
    () => [x.value, y.value, z.value],
    (newVal, oldVal) => {
        if (newVal.some((i) => i == undefined)) {
            return;
        }
        modelValue.value = `${newVal[0]} ${newVal[1]} ${newVal[2]}`;
    }
);
</script>
