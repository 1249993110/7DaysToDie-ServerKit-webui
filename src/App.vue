<template>
    <MyConfigProvider>
        <router-view />
    </MyConfigProvider>
</template>

<script setup>
const localeStore = useLocaleStore();

// Monitor language changes and update titles
watch(
    () => localeStore.locale,
    () => {
        document.title = localeStore.getAppTitle();
    },
    { immediate: true }
);
</script>
