import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
    state: () => {
        return {
            isCollapse: false
        }
    },
    actions: {
        setCollapse() {
            this.isCollapse = !this.isCollapse;
        }
    }
})