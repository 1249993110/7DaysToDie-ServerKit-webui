<template>
    <el-date-picker
        type="datetimerange"
        :shortcuts="shortcuts"
        :range-separator="t('components.myDateTimeSelector.rangeSeparator')"
        :start-placeholder="t('components.myDateTimeSelector.startPlaceholder')"
        :end-placeholder="t('components.myDateTimeSelector.endPlaceholder')"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
    />
</template>

<script setup>
const props = defineProps({
    shortcuts: {
        type: Array,
    },
});

const { t } = useI18n();

const shortcuts = computed(() => {
    return props.shortcuts ?? [
        {
            text: t('components.myDateTimeSelector.today'),
            value: () => {
                const end = new Date();
                const start = new Date(end);
                start.setHours(0);
                start.setMinutes(0);
                start.setSeconds(0);
                return [start, end];
            },
        },        {
            text: t('components.myDateTimeSelector.lastWeek'),
            value: () => {
                const end = new Date();
                const start = new Date();
                start.setDate(start.getDate() - 7);
                return [start, end];
            },
        },
        {
            text: t('components.myDateTimeSelector.lastMonth'),
            value: () => {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - 1);
                return [start, end];
            },
        },
        {
            text: t('components.myDateTimeSelector.lastMonths', [3]),
            value: () => {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - 3);
                return [start, end];
            },
        },
    ];
});
</script>
