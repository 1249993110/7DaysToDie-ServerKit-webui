<template>
    <div class="logo"><img :src="getLogoUrl()" alt="logo" /></div>
</template>

<script setup>
import { useSidebarStore } from '~/store/sidebar';

const sidebarStore = useSidebarStore();

const getLogoUrl = () => {
    // const theme = globalStore.$state.themeConfig.theme || 'light';
    if (sidebarStore.isCollapse) {
        return new URL(`~/assets/images/logo-blue.png`, import.meta.url).href;
    } else {
        return new URL(`~/assets/images/logo-title.png`, import.meta.url).href;
    }
};
</script>

<style scoped lang="scss">
.logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 55px;
    overflow: hidden;
    img {
        object-fit: contain;
        height: 40px;
    }
}
</style>
