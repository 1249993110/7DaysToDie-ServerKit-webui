<template>
    <div>
        <RouterButton :names="['teleSystem.home.settings', 'teleSystem.home.management']" />
        <MySettingsFormCard settings-name="TeleportHome" :fields="fields" locale-key-prefix="views.teleSystem.home" />
    </div>
</template>

<script>
export default {
    name: 'teleSystem.home.settings',
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
            values: ['HomeName', 'TeleInterval', 'CooldownSeconds', 'EntityId', 'PlayerId', 'PlayerName'],
        },
    },
    {
        type: 'input',
        name: 'queryListCmd',
        required: true,
    },
    {
        type: 'input-number',
        name: 'teleInterval',
        required: true,
        props: {
            min: 1,
        },
    },
    {
        type: 'input',
        name: 'setHomeCmdPrefix',
        required: true,
    },
    {
        type: 'input-number',
        name: 'setCountLimit',
        required: true,
    },
    {
        type: 'input-number',
        name: 'pointsRequiredForSet',
        required: true,
    },
    {
        type: 'input',
        name: 'deleteHomeCmdPrefix',
        required: true,
    },
    {
        type: 'input',
        name: 'teleHomeCmdPrefix',
        required: true,
    },
    {
        type: 'input-number',
        name: 'pointsRequiredForTele',
        required: true,
    },
    {
        type: 'input',
        name: 'noHomeTip',
        required: true,
    },
    {
        type: 'input',
        name: 'locationItemTip',
        required: true,
    },
    {
        type: 'input',
        name: 'overLimitTip',
        required: true,
    },
    {
        type: 'input',
        name: 'setPointsNotEnoughTip',
        required: true,
    },
    {
        type: 'input',
        name: 'setSuccessTip',
        required: true,
    },
    {
        type: 'input',
        name: 'overwriteSuccessTip',
        required: true,
    },
    {
        type: 'input',
        name: 'deleteSuccessTip',
        required: true,
    },
    {
        type: 'input',
        name: 'homeNotFoundTip',
        required: true,
    },
    {
        type: 'input',
        name: 'coolingTip',
        required: true,
    },
    {
        type: 'input',
        name: 'telePointsNotEnoughTip',
        required: true,
    },
    {
        type: 'input',
        name: 'teleSuccessTip',
        required: true,
    },
    
];
</script>

