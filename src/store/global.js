import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
    state: () => {
        const windowSize = useWindowSize();
        return {
            tableSize: 'default',
            isLoading: false, // no use
            isRouterAlive: true,
            isSmallScreen: computed(() => windowSize.width.value < 1200),
        };
    },
    getters: {},
    actions: {},
});
