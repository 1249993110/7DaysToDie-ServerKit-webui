<template>
    <div>
        <RouterButton :names="['globalSettings']" />
        <MySettingsFormCard settings-name="GlobalSettings" :fields="fields" locale-key-prefix="views.globalSettings">
            <template #autoRestartTime="{ formModel }">
                <el-time-select
                    :model-value="getAutoRestartTime(formModel)"
                    @update:model-value="(val) => setAutoRestartTime(val, formModel)"
                    clearable
                    style="width: 120px"
                    start="00:00"
                    step="00:60"
                    end="23:59"
                />
            </template>
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
        name: 'autoRestart.isEnabled',
    },
    {
        name: 'autoRestart.time',
        slot: 'autoRestartTime',
    },
    {
        type: 'MyTextarea',
        name: 'autoRestart.messages',
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

const getAutoRestartTime = (formModel) => {
    if (!formModel.autoRestart) {
        return '';
    }
    return formModel.autoRestart.restartHour.toString().padStart(2, '0') + ':' + formModel.autoRestart.restartMinute.toString().padStart(2, '0');
};

const setAutoRestartTime = (val, formModel) => {
    const split = val.split(':');
    formModel.autoRestart.restartHour = parseInt(split[0]);
    formModel.autoRestart.restartMinute = parseInt(split[1]);
};
</script>
