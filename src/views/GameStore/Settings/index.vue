<template>
    <div>
        <RouterButton :names="['gameStore.settings', 'gameStore.management']" />
        <MySettingsFormCard settings-name="GameStore" :fields="fields" locale-key-prefix="views.gameStore">
            <template #append>
                <el-text style="color: green; line-height: 50px">{{ t('views.gameStore.useTips') }}</el-text>
            </template>
        </MySettingsFormCard>
    </div>
</template>

<script>
export default {
    name: 'gameStore.settings',
};
</script>

<script setup>
const { t } = useI18n();

const fields = [
    {
        type: 'switch',
        name: 'isEnabled',
    },
    {
        type: 'Variables',
        name: 'variables',
        props: {
            values: ['GoodsId', 'GoodsName', 'Price', 'EntityId', 'PlayerId', 'PlayerName'],
        },
    },
    {
        type: 'input',
        name: 'queryListCmd',
        required: true,
    },
    {
        type: 'input',
        name: 'buyCmdPrefix',
        required: true,
    },
    {
        type: 'input',
        name: 'goodsItemTip',
        required: true,
    },
    {
        type: 'input',
        name: 'buySuccessTip',
        required: true,
    },
    {
        type: 'input',
        name: 'pointsNotEnoughTip',
        required: true,
    },
    {
        type: 'input',
        name: 'noGoods',
        required: true,
    },
];
</script>
