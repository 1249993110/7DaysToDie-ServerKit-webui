<template>
    <div class="collapse">
        <IconButton :color="isDark ? 'white' : '#383838'" @click="sidebarStore.setCollapse" style="min-width: 40px">
            <icon-ep-expand v-if="sidebarStore.isCollapse" />
            <icon-ep-fold v-else />
        </IconButton>
        <div class="username" v-show="!sidebarStore.isCollapse">
            <el-text truncated>{{ userInfoStore.displayName }}</el-text>
        </div>

        <el-dropdown style="margin-left: auto" trigger="click" @command="handleCommand">
            <IconButton :color="isDark ? 'white' : '#383838'" circle :btnSize="40" hoverBackgroundColor="#e9e9e9aa" activeBackgroundColor="#dcdcdcaa">
                <icon-ic-baseline-more-vert />
            </IconButton>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item :icon="Logout" command="logout">{{ t('views.login.logout') }}</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup>
import Logout from '~icons/uiw/logout';

const sidebarStore = useSidebarStore();
const userInfoStore = useUserInfoStore();
const globalStore = useGlobalStore();

watch(
    () => globalStore.isSmallScreen,
    (isSmallScreen) => {
        sidebarStore.isCollapse = isSmallScreen;
    }
);

const { t } = useI18n();
const router = useRouter();

const logout = async () => {
    if (await myconfirm(t('views.login.logoutConfirm'))) {
        ElMessage.success(t('views.login.logoutSuccess'));
        await userInfoStore.logout();
        router.push('/login');
    }
};
const handleCommand = async (command) => {
    switch (command) {
        case 'logout':
            await logout();
            break;
    }
};

const isDark = useDark();
</script>

<style scoped lang="scss">
.collapse {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-top: var(--ty-border);
    height: 48px;
    min-height: 48px;
    overflow: hidden;

    .collapse-icon {
        margin-left: 25px;
        &:hover {
            color: $primary-color;
            cursor: pointer;
        }
    }

    .username {
        flex-grow: 1;
        text-align: center;
        max-width: 108px;

        span {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-family: ABC Oracle Plus Variable, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            font-weight: 700;
            font-size: 16px;
            line-height: 24px;
            color: var(--el-text-color-regular);
        }
    }
}
</style>
