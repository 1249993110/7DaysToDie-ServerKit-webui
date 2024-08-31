<template>
    <div class="layout">
        <el-container>
            <el-aside :width="sidebarWidth">
                <Sidebar />
            </el-aside>
            <el-container>
                <el-scrollbar>
                    <el-main>
                        <Main />
                    </el-main>
                </el-scrollbar>
                <el-footer height="48px">
                    <Footer />
                </el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import Sidebar from './Sidebar/index.vue';
import Main from './Main/index.vue';
import Footer from './Footer/index.vue';
import { useSidebarStore } from '~/store/sidebar';
import { useUserInfoStore } from '~/store/user-info';
import { getAppSettings } from '~/api/app-settings';

const { locale } = useI18n();
const sidebarStore = useSidebarStore();
const sidebarWidth = computed(() => {
    if(sidebarStore.isCollapse){
        return '80px';
    }else{
        if(locale.value === 'en' || locale.value === 'zh' || locale.value === 'tw' || locale.value === 'ko'){
            return '180px';
        }
        return '220px';
    }
});

const userInfoStore = useUserInfoStore();
const isLoggedIn = computedAsync(async () => await userInfoStore.isLoggedIn());
watch(
    isLoggedIn,
    async (val) => {
        if (val) {
            const appSettings = await getAppSettings();
            const hostname = import.meta.env.DEV ? import.meta.env.VITE_APP_API_DOMAIN : location.hostname;
            const url = appSettings.webSocketUrl.replace('{hostname}', hostname) + '?token=' + (await userInfoStore.getToken());
            startWebsocket(url);
        }
    },
    {
        immediate: true,
    }
);
</script>

<style scoped lang="scss">
.layout {
    height: 100%;
    .el-container {
        height: 100%;
        .el-aside {
            transition: width 0.3s;
        }
        .el-container {
            background-color: #f4f4f4df;
            .el-main {
                transition: margin-left 0.3s;
                overflow: hidden;
            }
            .el-footer {
                padding: 0;
            }
        }
    }
}
</style>
