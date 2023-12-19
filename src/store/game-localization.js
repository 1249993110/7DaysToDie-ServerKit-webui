import { defineStore } from 'pinia';
import { getLocalization } from '~/api/localization';

export const useGameLocalizationStore = defineStore('game-localization', {
    state: () => {
        return {
            dict: {},
        };
    },
    getters: {},
    actions: {
        async init() {
            this.dict = await getLocalization('schinese');
        },
    },
});
