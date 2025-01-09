<template>
    <div>
        <RouterButton :names="['globalSettings']" />
        <MySettingsFormCard settings-name="GlobalSettings" :fields="fields" locale-key-prefix="views.globalSettings">
        </MySettingsFormCard>
    </div>
</template>

<script>
export default {
    name: 'globalSettings',
};
</script>

<script setup>
const fields = [
    {
        type: 'input',
        name: 'globalServerName',
        required: true,
    },
    {
        type: 'input',
        name: 'whisperServerName',
        required: true,
    },
    {
        type: 'input',
        name: 'chatCommandPrefix',
    },
    {
        type: 'input',
        name: 'chatCommandSeparator',
        props: {
            trim: false,
        },
    },
    {
        type: 'input',
        name: 'handleChatMessageError',
        required: true,
        props: {
            type: 'textarea',
        },
    },
    {
        type: 'switch',
        name: 'teleZombieCheck',
    },

    {
        type: 'input',
        name: 'teleDisableTip',
        required: true,
        props: {
            type: 'textarea',
        },
    },
    {
        type: 'switch',
        name: 'killZombieTrigger.isEnabled',
    },
    {
        type: 'MyTextarea',
        name: 'killZombieTrigger.executeCommands',
    },
    {
        type: 'switch',
        name: 'deathTrigger.isEnabled',
    },
    {
        type: 'MyTextarea',
        name: 'deathTrigger.executeCommands',
    },
    {
        type: 'switch',
        name: 'blockFamilySharingAccount',
    },
    {
        type: 'switch',
        name: 'removeSleepingBagFromPOI',
    },
    {
        type: 'switch',
        name: 'isEnablePlayerInitialSpawnPoint',
    },
    {
        type: 'Coordinate',
        name: 'playerInitialPosition',
    },
    {
        type: 'switch',
        name: 'enableAutoZombieCleanup',
    },
    {
        type: 'input-number',
        name: 'autoZombieCleanupThreshold',
        required: true,
        props: {
            min: 1,
        },
    },
    {
        type: 'switch',
        name: 'enableXmlsSecondaryOverwrite',
    },
];
</script>
