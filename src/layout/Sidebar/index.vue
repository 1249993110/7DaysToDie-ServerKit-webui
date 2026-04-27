<template>
    <div class="sidebar">
        <Logo />
        <el-scrollbar>
            <el-menu
                :default-active="defaultActive"
                @select="handleSelectMenu"
                :collapse="sidebarStore.isCollapse"
                :collapse-transition="false"
                unique-opened
            >
                <MenuTree :menus="menusStore.tree" />
            </el-menu>
        </el-scrollbar>
        <Collapse />
    </div>
</template>

<script setup>
import MenuTree from './MenuTree.vue';
import Logo from './Logo.vue';
import Collapse from './Collapse.vue';

const route = useRoute();
const router = useRouter();
const menusStore = useMenusStore();
const sidebarStore = useSidebarStore();
const userInfoStore = useUserInfoStore();
const { t } = useI18n();

const defaultActive = ref('');

watch(
    () => route.name,
    (name) => {
        if (!menusStore.dict.hasOwnProperty(name)) {
            const index = name.lastIndexOf('.');
            if (index !== -1) {
                name = name.substring(0, index);
            }
        }
        defaultActive.value = name;
    },
    { immediate: true }
);

const logout = async () => {
    if (await myconfirm(t('views.login.logoutConfirm'))) {
        ElMessage.success(t('views.login.logoutSuccess'));
        await userInfoStore.logout();
        router.push('/login');
    }
};

const handleSelectMenu = async (name) => {
    if (name === 'logout') {
        await logout();
        return;
    }
    const menu = menusStore.dict[name];
    if (menu.isExternalLink) {
        window.open(menu.path);
    } else {
        router.push({ name: name });
    }
};
</script>

<style scoped lang="scss">
.sidebar {
    height: 100%;
    background-color: var(--ty-sidebar-bg);
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--ty-sidebar-border);
    box-shadow: 1px 0 0 rgba(255, 255, 255, 0.02) inset;

    .el-scrollbar {
        flex-grow: 1;
        .el-menu {
            overflow: auto;
            overflow-x: hidden;
            border-right: none;
            background: none;
            user-select: none;
            width: 100%;
            padding: 4px 8px;

            :deep(.el-menu-item) {
                border-radius: 6px;
                margin: 1px 0;
                height: 38px;
                font-size: 13px;
                font-weight: 500;
                color: var(--el-menu-text-color);
                transition: all 0.12s ease;
                position: relative;

                .el-icon {
                    font-size: 17px;
                }

                &.is-active {
                    background-color: var(--el-menu-item-bg-color-active);
                    color: var(--ty-color-accent);
                    font-weight: 600;

                    &::before {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 3px;
                        height: 18px;
                        background: var(--ty-color-accent);
                        border-radius: 0 2px 2px 0;
                    }

                    .el-icon {
                        color: var(--ty-color-accent);
                    }
                }

                &:not(.is-active):hover {
                    background-color: var(--el-menu-hover-bg-color);
                    color: var(--ty-color-primary);

                    .el-icon {
                        color: var(--ty-color-primary);
                    }
                }
            }

            :deep(.el-sub-menu) {
                &.is-active {
                    .el-sub-menu__title {
                        color: var(--ty-color-accent);
                        font-weight: 600;
                        .el-icon {
                            color: var(--ty-color-accent);
                        }
                    }
                }
                .el-sub-menu__title {
                    border-radius: 6px;
                    height: 38px;
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--el-menu-text-color);
                    transition: all 0.12s ease;

                    .el-icon {
                        font-size: 17px;
                    }

                    &:hover {
                        background-color: var(--el-menu-hover-bg-color);
                        color: var(--ty-color-primary);
                        .el-icon {
                            color: var(--ty-color-primary);
                        }
                    }
                }
                .el-menu {
                    background: none;
                    padding: 0;
                    .el-menu-item {
                        box-shadow: none;
                        padding-left: 44px !important;
                    }
                }
            }
            :deep(.el-sub-menu + .el-sub-menu) {
                margin-top: 1px;
            }
        }
    }
}
</style>
