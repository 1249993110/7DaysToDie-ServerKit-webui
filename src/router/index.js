import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from '../layout/index.vue';
import nProgress from '../plugins/nprogress';
import { useUserInfoStore } from '../store/user-info';
import qs from 'qs';

const routes = [
    {
        path: '/',
        redirect: '/lobby',
        component: Layout,
        children: [
            {
                path: 'lobby',
                redirect: '/lobby/dashboard',
                children: [
                    {
                        path: 'dashboard',
                        name: 'Dashboard',
                        component: () => import('../views/Dashboard/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                    {
                        path: 'server-settings',
                        name: 'ServerSettings',
                        component: () => import('../views/ServerSettings/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                ],
            },
            {
                path: 'map',
                name: 'Map',
                component: () => import('../views/Map/index.vue'),
                meta: { requiresAuth: true, keepAlive: true },
            },
            {
                path: 'playerlist',
                redirect: '/playerlist/online-players',
                children: [
                    {
                        path: 'online-players',
                        name: 'OnlinePlayers',
                        component: () => import('../views/OnlinePlayers/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                    {
                        path: 'history-players',
                        name: 'HistoryPlayers',
                        component: () => import('../views/HistoryPlayers/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                ],
            },
            {
                path: 'chat',
                redirect: '/chat/live-chat',
                children: [
                    {
                        path: 'live-chat',
                        name: 'LiveChat',
                        component: () => import('../views/LiveChat/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                    {
                        path: 'chat-record',
                        name: 'ChatRecord',
                        component: () => import('../views/ChatRecord/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                ],
            },
            {
                path: 'blacklist',
                name: 'Blacklist',
                component: () => import('../views/Blacklist/index.vue'),
                meta: { requiresAuth: true, keepAlive: true },
            },
            {
                path: 'item-blocks',
                name: 'ItemBlocks',
                component: () => import('../views/ItemBlocks/index.vue'),
                meta: { requiresAuth: true, keepAlive: true },
            },
            {
                path: 'console',
                name: 'Console',
                component: () => import('../views/Console/index.vue'),
                meta: { requiresAuth: true, keepAlive: true },
            },
            {
                path: 'global-settings',
                name: 'GlobalSettings',
                component: () => import('../views/GlobalSettings/index.vue'),
                meta: { requiresAuth: true, keepAlive: true },
            },
            {
                path: 'game-notice',
                name: 'GameNotice',
                component: () => import('../views/GameNotice/index.vue'),
                meta: { requiresAuth: true, keepAlive: true },
            },
            {
                path: 'points-system',
                redirect: '/points-system/settings',
                children: [
                    {
                        path: 'settings',
                        name: 'PointsSystem.Settings',
                        component: () => import('../views/PointsSystem/Settings/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                    {
                        path: 'management',
                        name: 'PointsSystem.Management',
                        component: () => import('../views/PointsSystem/Management/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                ],
            },
            {
                path: '/game-store',
                children: [
                    {
                        path: 'settings',
                        name: 'GameStore.Settings',
                        component: () => import('../views/GameStore/Settings/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                    {
                        path: 'management',
                        name: 'GameStore.Management',
                        component: () => import('../views/GameStore/Management/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                ],
            },
            {
                path: '/tele-friend',
                name: 'TeleportFriend',
                component: () => import('../views/TeleportFriend/index.vue'),
                meta: { requiresAuth: true, keepAlive: true },
            },
            {
                path: '/tele-city',
                children: [
                    {
                        path: 'settings',
                        name: 'TeleportCity.Settings',
                        component: () => import('../views/TeleportCity/Settings/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                    {
                        path: 'management',
                        name: 'TeleportCity.Management',
                        component: () => import('../views/TeleportCity/Management/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                ],
            },
            {
                path: '/tele-home',
                children: [
                    {
                        path: 'settings',
                        name: 'TeleportHome.Settings',
                        component: () => import('../views/TeleportHome/Settings/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                    {
                        path: 'management',
                        name: 'TeleportHome.Management',
                        component: () => import('../views/TeleportHome/Management/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                ],
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login/index.vue'),
    },
    {
        path: '/404',
        name: '404',
        component: () => import('../views/404.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    parseQuery: qs.parse,
    stringifyQuery: qs.stringify,
});

router.beforeEach(async (to, from) => {
    nProgress.start();
    // 检查此路由需要授权, 用户是否已登录
    if (to.meta.requiresAuth) {
        const userInfoStore = useUserInfoStore();
        const isLoggedIn = await userInfoStore.isLoggedIn();
        if (!isLoggedIn) {
            // 如果没有, 则重定向到登录页面
            return '/login?redirect=' + to.fullPath;
        }

        // if(to.path === '/file-browser'){
        //     const token = await fileBrowserApi.getToken();
        //     console.log(token);
        //     document.cookie = 'auth=' + token;
        // }
    }
});

router.afterEach(() => {
    nProgress.done();
});

export default router;

const keepAlives = [];
const filterKeepAlive = (routes, cache) => {
    routes.forEach((item) => {
        item.meta?.keepAlive && item.name && cache.push(item.name);
        item?.children?.length && filterKeepAlive(item.children, cache);
    });
};

filterKeepAlive(routes, keepAlives);

export { keepAlives };
