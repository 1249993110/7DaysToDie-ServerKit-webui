<template>
    <div class="sidebar">
        <Logo />
        <el-scrollbar always>
            <el-menu :default-active="defaultActive" @select="handleSelectMenu" :collapse="sidebarStore.isCollapse" :collapse-transition="false" unique-opened>
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
    background: url('~/assets/images/logo-title-bg.png') #e5eefdef no-repeat top;
    background-size: 100%;
    display: flex;
    flex-direction: column;

    .el-scrollbar {
        flex: 1;
        .el-menu {
            overflow: auto;
            overflow-x: hidden;
            border-right: none;
            background: none;
            user-select: none;
            width: 100%;
            padding: 0 10px;

            :deep(.el-menu-item) {
                border-radius: 4px;
                background-color: var(--el-menu-item-bg-color);
                margin: 6px 0;
                height: 46px;
                box-shadow: 0px 0px 4px rgba(0, 94, 235, 0.1);

                &:hover {
                    .el-icon {
                        color: $primary-color;
                    }

                    span {
                        color: $primary-color;
                    }
                }
                &.is-active {
                    background-color: var(--el-menu-item-bg-color-active);
                    border: 2px solid $primary-color;

                    &::before {
                        position: absolute;
                        border-radius: 4px;
                        left: 12px;
                        width: 4px;
                        height: 14px;
                        content: '';
                        background: $primary-color;
                    }
                }
            }
            :deep(.el-sub-menu) {
                &.is-active {
                    .el-sub-menu__title {
                        span {
                            color: $primary-color;
                        }

                        .el-icon {
                            color: $primary-color;
                        }
                    }
                }
                .el-sub-menu__title {
                    border-radius: 4px;
                    background-color: var(--el-menu-item-bg-color);
                    //margin: 6px 0;
                    height: 46px;
                    box-shadow: 0px 0px 4px rgba(0, 94, 235, 0.1);

                    &:hover {
                        .el-icon {
                            color: $primary-color;
                        }

                        span {
                            color: $primary-color;
                        }
                    }
                }
                .el-menu {
                    background: none;
                    padding: 0;
                    .el-menu-item {
                        box-shadow: none;
                        padding-left: 35px;
                    }
                }
            }
            :deep(.el-sub-menu + .el-sub-menu) {
                margin-top: 6px;
            }
        }
    }
}
</style>
