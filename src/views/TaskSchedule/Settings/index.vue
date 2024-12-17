<template>
    <div>
        <RouterButton :names="['taskSchedule.settings', 'taskSchedule.management']" />
        <MySettingsFormCard settings-name="TaskSchedule" :fields="fields" locale-key-prefix="views.taskSchedule" />
    </div>
</template>

<script>
export default {
    name: 'taskSchedule.settings',
};
</script>

<script setup>
const fields = [
    {
        type: 'switch',
        name: 'isEnabled',
    },
];
</script>
