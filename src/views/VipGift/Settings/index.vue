<template>
    <div>
        <RouterButton :names="['vipGift.settings', 'vipGift.management']" />
        <MySettingsFormCard settings-name="VipGift" :fields="fields" locale-key-prefix="views.vipGift" />
    </div>
</template>

<script>
export default {
    name: 'vipGift.settings',
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
            values: ['GiftName', 'TotalClaimCount', 'GiftDescription', 'EntityId', 'PlayerId', 'PlayerName'],
        },
    },
    {
        type: 'input',
        name: 'claimCmd',
        required: true,
    },
    {
        type: 'input',
        name: 'hasClaimedTip',
        required: true,
    },
    {
        type: 'input',
        name: 'nonVipTip',
        required: true,
    },
    {
        type: 'input',
        name: 'claimSuccessTip',
        required: true,
    },
];
</script>
