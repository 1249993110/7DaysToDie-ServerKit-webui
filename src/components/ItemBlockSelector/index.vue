<template>
    <div style="display: flex; align-items: center; gap: 8px">
        <GameIcon v-if="showIcon" :name="modelValue" />
        <el-autocomplete
            v-model="modelValue"
            :fetch-suggestions="fetchSuggestions"
            :placeholder="t('global.message.inputText')"
            clearable
            style="flex: 1"
            value-key="itemName"
            @select="handleSelect"
            @clear="handleClear"
            :debounce="300"
            popper-class="item-block-autocomplete-popper"
        >
            <template #default="{ item }">
                <div style="display: flex; align-items: center; gap: 8px; padding: 2px 0">
                    <GameIcon :name="item.itemName" :size="32" />
                    <div>
                        <div style="font-size: 13px; line-height: 1.3">{{ item.itemName }}</div>
                        <div v-if="item.localizationName" style="font-size: 11px; color: #999; line-height: 1.3">{{ item.localizationName }}</div>
                    </div>
                </div>
            </template>
        </el-autocomplete>
        <Dialog v-if="showSelectButton" v-model="dialogVisible" @select="handleDialogSelect" />
        <el-button v-if="showSelectButton" @click="dialogVisible = true">{{ t('global.button.select') }}</el-button>
    </div>
</template>

<script setup>
import Dialog from './Dialog.vue';
import { getItemBlocks } from '~/api/item-blocks';
import { i18n } from '~/plugins/i18n';

const { t } = i18n.global;
const localeStore = useLocaleStore();

const modelValue = defineModel({
    type: String,
    default: '',
});

const props = defineProps({
    showIcon: {
        type: Boolean,
        default: true,
    },
    showSelectButton: {
        type: Boolean,
        default: true,
    },
});

const dialogVisible = ref(false);
const emit = defineEmits(['select']);

const fetchSuggestions = async (queryString, callback) => {
    if (!queryString || !queryString.trim()) {
        callback([]);
        return;
    }
    try {
        const data = await getItemBlocks({
            keyword: queryString.trim(),
            pageNumber: 1,
            pageSize: 20,
            itemBlockKind: 0,
            showUserHidden: true,
            language: localeStore.getLanguage(),
        });
        callback(data.items || []);
    } catch {
        callback([]);
    }
};

const handleSelect = (item) => {
    modelValue.value = item.itemName;
    emit('select', item);
};

const handleClear = () => {
    emit('select', null);
};

const handleDialogSelect = (row) => {
    modelValue.value = row.itemName;
    emit('select', row);
    dialogVisible.value = false;
};
</script>

<style>
.item-block-autocomplete-popper .el-autocomplete-suggestion__list li {
    height: auto;
    line-height: normal;
    padding: 6px 12px;
}
</style>
