<template>
    <MyFormDialog ref="addEditRef" :fields="fields" :form-model="formModel" :request="request" :successMessage="t('global.message.cmdSentSuccess')" />
</template>

<script setup>
import { giveItem } from '~/api/sdtd-console';
import { i18n } from '~/plugins/i18n';

const { t } = i18n.global;
const props = defineProps({
    playerIds: Array,
});

const addEditRef = ref(null);
const formModel = reactive({});

const fields = computed(() => [
    {
        type: 'ItemBlockSelector',
        name: 'itemName',
        label: t('components.batchGiveItem.itemName'),
        required: true,
    },
    {
        type: 'input-number',
        name: 'count',
        label: t('components.batchGiveItem.count'),
        required: true,
        default: 1,
        props: {
            min: 1,
            max: 1000000,
        },
    },
    {
        type: 'input-number',
        name: 'quality',
        label: t('components.batchGiveItem.quality'),
        default: 1,
        props: {
            min: 0,
        },
    },
    {
        type: 'input-number',
        name: 'durability',
        label: t('components.batchGiveItem.durability'),
        default: 100,
        props: {
            min: 0,
            max: 100,
        },
    },
]);

const request = async () => {
    for (let i = 0; i < props.playerIds.length; i++) {
        const playerId = props.playerIds[i];
        await giveItem(playerId, formModel.itemName, formModel.count, formModel.quality, formModel.durability);
    }
};

onMounted(() => {
    addEditRef.value.open();
});
</script>
