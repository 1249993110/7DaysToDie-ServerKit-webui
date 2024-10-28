<template>
    <div>
        <RouterButton :names="['pointsSystem.settings', 'pointsSystem.management']" />
        <MySettingsFormCard settings-name="PointsSystem" :fields="fields" locale-key-prefix="views.pointsSystem" />
    </div>
</template>

<script>
export default {
    name: 'pointsSystem.settings',
};
</script>

<script setup>
const fields = [
    {
        type: 'switch',
        name: 'isEnabled',
    },
    {
        type: 'variables',
        name: 'variables',
        props: {
            values: ['SignInRewardPoints', 'PlayerTotalPoints', 'CurrencyAmount', 'EntityId', 'PlayerId', 'PlayerName'],
        },
    },
    {
        type: 'input',
        name: 'signInCmd',
        required: true,
    },
    {
        type: 'input-number',
        name: 'signInInterval',
        required: true,
        props: {
            min: 1,
        }
    },
    {
        type: 'input-number',
        name: 'signInRewardPoints',
        required: true,
    },
    {
        type: 'input',
        name: 'signInSuccessTip',
        required: true,
    },
    {
        type: 'input',
        name: 'signInFailureTip',
        required: true,
    },
    {
        type: 'input',
        name: 'queryPointsCmd',
        required: true,
    },
    {
        type: 'input',
        name: 'queryPointsTip',
        required: true,
    },
    {
        type: 'switch',
        name: 'isCurrencyExchangeEnabled',
    },
    {
        type: 'input-number',
        name: 'currencyToPointsExchangeRate',
        required: true,
        props: {
            min: 0,
            precision: 3,
        }
    },
    {
        type: 'input',
        name: 'currencyExchangeCmd',
        required: true,
    },
    {
        type: 'input',
        name: 'exchangeSuccessTip',
        required: true,
    },
    {
        type: 'input',
        name: 'exchangeFailureTip',
        required: true,
    }
];
</script>
