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
        padding: 4px 8px;
        user-select: none;
        width: 100%;

        .el-menu-item {
            border-radius: 6px;
            margin: 1px 0;
            height: 38px;
            font-size: 13px;
            font-weight: 500;
            background-color: var(--el-menu-item-bg-color);
            transition: all 0.12s ease;
            position: relative;

            &.is-active {
                background-color: var(--el-menu-item-bg-color-active);
                color: var(--ty-color-accent);

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
            }

            &:not(.is-active):hover {
                background-color: var(--el-menu-hover-bg-color);
                .el-icon { color: var(--ty-color-primary); }
                span { color: var(--ty-color-primary); }
            }
        }

        .el-sub-menu {
            &.is-active {
                .el-sub-menu__title {
                    span { color: var(--ty-color-accent); }
                    .el-icon { color: var(--ty-color-accent); }
                }
            }
            .el-sub-menu__title {
                border-radius: 6px;
                height: 38px;
                font-size: 13px;
                background-color: var(--el-menu-item-bg-color);
                transition: all 0.12s ease;

                &:hover {
                    background-color: var(--el-menu-hover-bg-color);
                    .el-icon { color: var(--ty-color-primary); }
                    span { color: var(--ty-color-primary); }
                }
            }
        }
        .el-sub-menu + .el-sub-menu {
            margin-top: 1px;
        }
    }
}
</style>
