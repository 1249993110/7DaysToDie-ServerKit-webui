<template>
    <template v-for="menu in menus" :key="menu.name">
        <el-sub-menu v-if="menu.children && menu.children.length" :index="menu.name" popper-class="sidebar-menu-popper">
            <template #title>
                <el-icon>
                    <component :is="menu.icon"></component>
                </el-icon>
                <span>{{ getTitle(menu.name) }}</span>
            </template>
            <MenuTree :menus="menu.children"></MenuTree>
        </el-sub-menu>
        <el-menu-item v-else :index="menu.name">
            <el-icon>
                <component :is="menu.icon"></component>
            </el-icon>
            <template #title>
                <span>{{ getTitle(menu.name) }}</span>
            </template>
        </el-menu-item>
    </template>
</template>

<script setup>
defineProps({
    menus: Array,
});

const { t, te, tm, rt } = useI18n();

const getTitle = (name) => {
    if (name === 'logout') {
        return t('views.login.logout');
    }

    const localeName = 'menus.' + name;
    if (te(localeName)) {
        return t(localeName);
    }

    const localeMessages = tm(localeName);
    if (Object.keys(localeMessages).length === 0) {
        console.warn(`Missing translation for ${localeName}`);
        return '';
    }
    return rt(localeMessages[''] ?? localeMessages);
};
</script>

<style lang="scss">
.sidebar-menu-popper {
    .el-menu {
        background-color: #d3e3fddf;
        padding: 4px 8px;
        user-select: none;
        width: 100%;

        .el-menu-item {
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
        .el-sub-menu {
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
        }
        .el-sub-menu + .el-sub-menu {
            margin-top: 6px;
        }
    }
}
</style>
