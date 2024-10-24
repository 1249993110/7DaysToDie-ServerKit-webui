<template>
    <div>
        <RouterButton :names="['autobackup.settings', 'autobackup.management']" />
        <MySettingsFormCard settings-name="AutoBackup" :fields="fields" locale-key-prefix="views.autoBackup" />
    </div>
</template>

<script>
export default {
    name: 'autobackup.settings',
};
</script>

<script setup>
const fields = [
    {
        type: 'switch',
        name: 'isEnabled',
    },
    {
        type: 'input-number',
        name: 'interval',
        required: true,
        props: {
            min: 10,
        },
    },
    {
        type: 'input-number',
        name: 'retainedFileCountLimit',
        required: true,
        props: {
            min: 0,
        },
    },
    {
        type: 'switch',
        name: 'resetIntervalAfterManualBackup',
    },
    {
        type: 'switch',
        name: 'skipIfThereAreNoPlayers',
    },
    {
        type: 'switch',
        name: 'autoBackupOnServerStartup',
    },
    {
        type: 'input',
        name: 'archiveFolder',
        required: true,
    },
];
</script>
