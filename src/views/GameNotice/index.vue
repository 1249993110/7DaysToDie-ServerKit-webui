<template>
    <div>
        <RouterButton :names="['gameNotice']" />
        <MySettingsFormCard settings-name="GameNotice" :fields="fields" locale-key-prefix="views.gameNotice" />
    </div>
</template>

<script>
export default {
    name: 'gameNotice',
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
            values: ['BloodMoonDays', 'BloodMoonStartTime', 'BloodMoonEndTime', 'EntityId', 'PlayerId', 'PlayerName'],
        },
    },
    {
        type: 'input',
        name: 'welcomeNotice',
        props: {
            type: 'textarea',
        },
    },
    {
        type: 'MyTextarea',
        name: 'rotatingNotices',
        props: {
            type: 'textarea',
        },
    },
    {
        type: 'input-number',
        name: 'rotatingInterval',
        required: true,
        props: {
            min: 1,
        },
    },
    {
        type: 'input',
        name: 'bloodMoonNotice1',
        props: {
            type: 'textarea',
        },
    },
    {
        type: 'input',
        name: 'bloodMoonNotice2',
        props: {
            type: 'textarea',
        },
    },
    {
        type: 'input',
        name: 'bloodMoonNotice3',
        props: {
            type: 'textarea',
        },
    },
];
</script>
