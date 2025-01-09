<template>
    <div>
        <RouterButton :names="['cdKeyRedeem.settings', 'cdKeyRedeem.management']" />
        <MySettingsFormCard settings-name="CdKeyRedeem" :fields="fields" locale-key-prefix="views.cdKeyRedeem" :label-width="280" />
    </div>
</template>

<script>
export default {
    name: 'cdKeyRedeem.settings',
};
</script>

<script setup>
const fields = [
    {
        type: 'switch',
        name: 'isEnabled',
    },
    {
        type: 'Variables',
        name: 'variables',
        props: {
            values: ['CdKeyDescription', 'EntityId', 'PlayerId', 'PlayerName'],
        },
    },
    {
        type: 'input',
        name: 'hasAlreadyRedeemedTip',
        required: true,
    },
    {
        type: 'input',
        name: 'hasReachedMaxRedemptionLimitTip',
        required: true,
    },
    {
        type: 'input',
        name: 'hasRedemptionCodeExpiredTip',
        required: true,
    },
    {
        type: 'input',
        name: 'redeemSuccessTip',
        required: true,
    },
];
</script>
