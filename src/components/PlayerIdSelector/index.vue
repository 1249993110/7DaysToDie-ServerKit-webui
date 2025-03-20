<template>
    <div style="display: flex; align-items: center; width: 100%">
        <Dialog v-model="dialogVisible" @select="handleSelect" />
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
        <el-button @click="dialogVisible = true" style="margin-left: 8px">{{ t('global.button.select') }}</el-button>
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

const handleSelect = (id) => {
    modelValue.value = id;
    dialogVisible.value = false;
};
</script>
