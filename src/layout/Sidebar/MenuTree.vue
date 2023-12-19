<template>
    <template v-for="menu in items" :key="menu.path">
        <el-sub-menu v-if="menu.children && menu.children.length" :index="menu.path" popper-class="sidebar-menu-popper">
            <template #title>
                <el-icon>
                    <component :is="menu.icon"></component>
                </el-icon>
                <span>{{ menu.title }}</span>
            </template>
            <MenuTree :items="menu.children"></MenuTree>
        </el-sub-menu>
        <el-menu-item v-else :index="menu.path">
            <el-icon>
                <component :is="menu.icon"></component>
            </el-icon>
            <template #title>
                <span>{{ menu.title }}</span>
            </template>
        </el-menu-item>
    </template>
</template>

<script setup>
defineProps({
    items: Array,
});
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
