<template>
    <el-input
        v-model="modelValue"
        clearable
        :placeholder="t('global.message.inputText')"
        @blur="
            () => {
                modelValue = modelValue.trim();
            }
        "
    />
    <div style="display: flex; align-items: center; margin-top: 4px">
        <Dialog v-model="dialogVisible" @select="handleSelect" />
        <el-button @click="dialogVisible = true">{{ t('global.button.select') }}</el-button>
    </div>
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

const emit = defineEmits(['select']);

const handleSelect = (row) => {
    modelValue.value = row.fullPath;
    emit('select', row);
    dialogVisible.value = false;
};
</script>
