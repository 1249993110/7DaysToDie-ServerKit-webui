<template>
    <div style="display: flex; align-items: center">
        <Dialog v-model="dialogVisible" @select="handleSelect" />
        <GameIcon :name="modelValue" />
        <el-button @click="dialogVisible = true" style="margin-left: 8px">{{ t('global.button.select') }}</el-button>
    </div>
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
    modelValue.value = row.itemName;
    emit('select', row);
    dialogVisible.value = false;
};
</script>
