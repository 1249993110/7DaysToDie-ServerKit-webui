import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from '../layout/index.vue';
import nProgress from '../plugins/nprogress';
import { useUserInfoStore } from '../store/user-info';
import qs from 'qs';

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
        component: Layout,
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
                path: 'autobackup',
                redirect: '/autobackup/settings',
                children: [
                    {
                        path: 'settings',
                        name: 'AutoBackup.Settings',
                        component: () => import('../views/AutoBackup/Settings/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                    {
                        path: 'management',
                        name: 'AutoBackup.Management',
                        component: () => import('../views/AutoBackup/Management/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                ],
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
                path: 'list-management',
                redirect: '/list-management/item-list',
                children: [
                    {
                        path: 'item-list',
                        name: 'ListManagement.ItemList',
                        component: () => import('../views/ListManagement/ItemList/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                    {
                        path: 'command-list',
                        name: 'ListManagement.CommandList',
                        component: () => import('../views/ListManagement/CommandList/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                ],
            },
            {
                path: '/game-store',
                redirect: '/game-store/settings',
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
                path: '/vip-gift',
                redirect: '/vip-gift/settings',
                children: [
                    {
                        path: 'settings',
                        name: 'VipGift.Settings',
                        component: () => import('../views/VipGift/Settings/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                    {
                        path: 'management',
                        name: 'VipGift.Management',
                        component: () => import('../views/VipGift/Management/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                ],
            },
            {
                path: 'tele-system',
                redirect: '/tele-system/friend',
                children: [
                    {
                        path: 'friend',
                        name: 'TeleportFriend',
                        component: () => import('../views/TeleportFriend/index.vue'),
                        meta: { requiresAuth: true, keepAlive: true },
                    },
                    {
                        path: 'city',
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
                        path: 'home',
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
    // Check if this route requires authorization and if the user has logged in
    if (to.meta.requiresAuth) {
        const userInfoStore = useUserInfoStore();
        const isLoggedIn = await userInfoStore.isLoggedIn();
        if (!isLoggedIn) {
            // If not, redirect to the login page
            return '/login?redirect=' + to.fullPath;
        }
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
