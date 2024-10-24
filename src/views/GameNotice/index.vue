<template>
    <div>
        <RouterButton :names="['gameNotice']" />
        <MySettingsFormCard settings-name="GameNotice" :fields="fields" locale-key-prefix="views.gameNotice" :label-width="250" />
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
        type: 'variables',
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
            rows: 2,
        },
    },
    {
        type: 'my-textarea',
        name: 'rotatingNotices',
        props: {
            type: 'textarea',
            rows: 2,
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
            rows: 2,
        },
    },
    {
        type: 'input',
        name: 'bloodMoonNotice2',
        props: {
            type: 'textarea',
            rows: 2,
        },
    },
    {
        type: 'input',
        name: 'bloodMoonNotice3',
        props: {
            type: 'textarea',
            rows: 2,
        },
    },
];
</script>
