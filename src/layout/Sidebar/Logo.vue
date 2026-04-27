<template>
    <div class="logo">
        <span v-if="!sidebarStore.isCollapse" class="logo-text">TianYi</span>
        <span v-else class="logo-text logo-text--mini">T</span>
    </div>
</template>

<script setup>
import { useSidebarStore } from '~/store/sidebar';
const sidebarStore = useSidebarStore();
</script>

<style scoped lang="scss">
.logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    overflow: hidden;
    border-bottom: 1px solid var(--ty-sidebar-border);

    .logo-text {
        font-family: 'Pacifico', cursive;
        font-size: 26px;
        color: var(--ty-color-primary);
        user-select: none;
        letter-spacing: 1px;
        background: linear-gradient(135deg, #38bdf8, #0ea5e9, #7dd3fc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;

        &--mini {
            font-size: 28px;
        }
    }
}
</style>
