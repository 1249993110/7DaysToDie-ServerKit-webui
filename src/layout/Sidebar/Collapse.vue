<template>
    <div class="collapse">
        <el-icon class="collapse-icon" :size="25" @click="sidebarStore.setCollapse">
            <icon-ep-expand v-if="sidebarStore.isCollapse" />
            <icon-ep-fold v-else />
        </el-icon>
        <div v-if="!sidebarStore.isCollapse" class="username">
            <span>{{ userInfoStore.username }}</span>
        </div>
    </div>
</template>

<script setup>
import { useSidebarStore } from '~/store/sidebar';
import { useUserInfoStore } from '~/store/user-info';

const sidebarStore = useSidebarStore();
const userInfoStore = useUserInfoStore();
</script>

<style scoped lang="scss">
.collapse {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-top: 1px solid #d4d7de;
    height: 48px;
    overflow: hidden;

    .collapse-icon {
        margin-left: 25px;
        &:hover {
            color: $primary-color;
            cursor: pointer;
        }
    }

    .username {
        flex: 1;
        padding-right: 24px;
        text-align: center;

        span {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-family: ABC Oracle Plus Variable, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            font-weight: 700;
            font-size: 16px;
        }
    }
}
</style>
