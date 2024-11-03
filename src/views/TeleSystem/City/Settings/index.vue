<template>
    <div>
        <RouterButton :names="['teleSystem.city.settings', 'teleSystem.city.management']" />
        <MySettingsFormCard settings-name="TeleportCity" :fields="fields" locale-key-prefix="views.teleSystem.city" />
    </div>
</template>

<script>
export default {
    name: 'teleSystem.city.settings',
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
            values: ['CityId', 'CityName', 'TeleInterval', 'PointsRequired', 'CooldownSeconds', 'EntityId', 'PlayerId', 'PlayerName'],
        },
    },
    {
        type: 'input',
        name: 'queryListCmd',
        required: true,
    },
    {
        type: 'input',
        name: 'teleCmdPrefix',
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
        name: 'locationItemTip',
        required: true,
    },
    {
        type: 'input',
        name: 'teleSuccessTip',
        required: true,
    },
    {
        type: 'input',
        name: 'pointsNotEnoughTip',
        required: true,
    },
    {
        type: 'input',
        name: 'coolingTip',
        required: true,
    },
    {
        type: 'input',
        name: 'noLocation',
        required: true,
    },
    
];
</script>

