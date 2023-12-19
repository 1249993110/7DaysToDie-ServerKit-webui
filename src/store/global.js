import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
    state: () => {
        return {
            tableSize: 'small',
            isLoading: false,
            isFullScreen: false,
            isRouterAlive: true,
        };
    },
    getters: {},
    actions: {},
});
