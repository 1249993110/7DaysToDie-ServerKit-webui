import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
    state: () => {
        const windowSize = useWindowSize();
        return {
            tableSize: 'small',
            isLoading: false, // no use
            isRouterAlive: true,
            isSmallScreen: computed(() => windowSize.width.value < 768),
        };
    },
    getters: {},
    actions: {},
});
