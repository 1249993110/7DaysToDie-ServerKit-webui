<template>
    <router-view v-slot="{ Component, route }" v-if="globalStore.isRouterAlive">
        <transition appear name="fade-transform" mode="out-in">
            <keep-alive :include="keepAlives">
                <component :is="Component" :key="route.path"></component>
            </keep-alive>
        </transition>
    </router-view>
</template>

<script setup>
import { keepAlives } from '~/router';

const globalStore = useGlobalStore();
</script>
