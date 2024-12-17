<template>
    <el-input v-model="modelValue" :placeholder="t('global.message.cronPickerPlaceholder')">
        <template #append>
                <Dialog v-model:cron-value="modelValue" max-height="50vh" v-model="dialogVisible" @save="handleSave" />
                <el-button @click="dialogVisible = true">{{ t('global.button.select') }}</el-button>
        </template>
    </el-input>
</template>

<script setup>
import Dialog from './Dialog.vue';
import { i18n } from '~/plugins/i18n';

const { t } = i18n.global;

const modelValue = defineModel({
    type: String,
    default: '',
});

const dialogVisible = ref(false);

const handleSave = (val) => {
    modelValue.value = val;
    dialogVisible.value = false;
};
</script>
