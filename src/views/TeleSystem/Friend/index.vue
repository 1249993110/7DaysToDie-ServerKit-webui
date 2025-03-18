<template>
    <div>
        <RouterButton :names="['teleSystem.friend']" />
        <MySettingsFormCard settings-name="TeleportFriend" :fields="fields" locale-key-prefix="views.teleSystem.friend" />
    </div>
</template>

<script>
export default {
    name: 'teleSystem.friend',
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
            values: ['TeleInterval', 'PointsRequired', 'TargetName', 'CooldownSeconds', 'EntityId', 'PlayerId', 'PlayerName'],
        },
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
        type: 'input-number',
        name: 'pointsRequired',
        required: true,
        props: {
            min: 0,
        },
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
        name: 'targetNotFoundTip',
        required: true,
    },
    {
        type: 'switch',
        name: 'isFriendBypass',
    },
    {
        type: 'input',
        name: 'teleConfirmTip',
        required: true,
    },
    {
        type: 'input',
        name: 'acceptTele',
        required: true,
    },
    {
        type: 'input',
        name: 'rejectTele',
        required: true,
    },
    {
        type: 'input',
        name: 'targetRejectTeleTip',
        required: true,
    },
    {
        type: 'input-number',
        name: 'keepDuration',
        required: true,
        props: {
            min: 1,
        },
    },
];
</script>
