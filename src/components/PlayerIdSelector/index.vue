<template>
    <div style="display: flex; align-items: center; width: 100%">
        <Dialog v-model="dialogVisible" @select="handleDialogSelect" />
        <el-autocomplete
            v-model="modelValue"
            :fetch-suggestions="querySearch"
            :placeholder="t('global.message.inputText')"
            clearable
            value-key="playerId"
            :debounce="300"
            style="width: 100%"
            @select="handleAutocompleteSelect"
            @clear="handleClear"
            @blur="() => { modelValue = modelValue.trim(); }"
            v-bind="$attrs"
        >
            <template #default="{ item }">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="flex: 1; overflow: hidden; text-overflow: ellipsis;">{{ item.playerId }}</span>
                    <span style="margin-left: 12px; color: #999; font-size: 12px;">{{ item.playerName }}</span>
                </div>
            </template>
        </el-autocomplete>
        <el-button v-if="showSelectButton" @click="dialogVisible = true" style="margin-left: 8px" v-bind="$attrs">{{ t('global.button.select') }}</el-button>
    </div>
</template>

<script setup>
import Dialog from './Dialog.vue';
import { getHistoryPlayerIds } from '~/api/players';
import { i18n } from '~/plugins/i18n';

const { t } = i18n.global;

const props = defineProps({
    onPlayerSelect: {
        type: Function,
        default: null,
    },
    showSelectButton: {
        type: Boolean,
        default: true,
    },
});

const modelValue = defineModel({
    type: String,
    default: '',
});

const dialogVisible = ref(false);
const playerList = ref([]);
const loaded = ref(false);

const loadPlayerList = async () => {
    if (loaded.value) return;
    try {
        playerList.value = await getHistoryPlayerIds();
        loaded.value = true;
    } catch {
        playerList.value = [];
    }
};

const querySearch = async (queryString, cb) => {
    await loadPlayerList();
    if (!queryString) {
        cb(playerList.value);
        return;
    }
    const keyword = queryString.toLowerCase();
    const results = playerList.value.filter((item) => {
        return (
            item.playerId.toLowerCase().includes(keyword) ||
            item.playerName.toLowerCase().includes(keyword) ||
            item.platformId.toLowerCase().includes(keyword)
        );
    });
    cb(results);
};

const handleAutocompleteSelect = (item) => {
    modelValue.value = item.playerId;
    if (props.onPlayerSelect) {
        props.onPlayerSelect(item);
    }
};

const handleDialogSelect = (id, row) => {
    modelValue.value = id;
    dialogVisible.value = false;
    if (props.onPlayerSelect && row) {
        props.onPlayerSelect(row);
    }
};

const handleClear = () => {
    if (props.onPlayerSelect) {
        props.onPlayerSelect(null);
    }
};
</script>
