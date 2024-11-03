<template>
    <div>
        <RouterButton :names="['coloredChat.settings', 'coloredChat.management']" />
        <MySettingsFormCard settings-name="ColoredChat" :fields="fields" locale-key-prefix="views.coloredChat" />
    </div>
</template>

<script>
export default {
    name: 'coloredChat.settings',
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
            values: ['PlayerName'],
        },
    },
    {
        type: 'MyColorPicker',
        name: 'globalDefault',
    },
    {
        type: 'MyColorPicker',
        name: 'whisperDefault',
    },
    {
        type: 'MyColorPicker',
        name: 'friendsDefault',
    },
    {
        type: 'MyColorPicker',
        name: 'partyDefault',
    },
];
</script>
