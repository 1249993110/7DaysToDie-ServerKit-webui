import { defineStore } from 'pinia';

// menu = {
//     path: ,
//     title: ,
//     icon: ,
//     children: ,
//     isExternalLink: ,
// }

const getIcon = (source) => {
    return markRaw(defineAsyncComponent(source));
};

const tree = [
    {
        path: '/lobby',
        title: '仪表盘',
        icon: getIcon(() => import('~icons/uiw/dashboard')),
    },
    {
        path: '/map',
        title: 'GPS地图',
        icon: getIcon(() => import('~icons/ep/location-information')),
    },
    {
        path: '/playerlist',
        title: '玩家列表',
        icon: getIcon(() => import('~icons/ep/user')),
    },
    {
        path: '/chat',
        title: '游戏聊天',
        icon: getIcon(() => import('~icons/ep/chat-dot-round')),
    },
    // {
    //     path: '/permission',
    //     title: '权限管理',
    //     icon: getIcon(() => import('~icons/arcticons/kul-authenticator')),
    // },
    {
        path: '/blacklist',
        title: '黑名单',
        icon: getIcon(() => import('~icons/mdi/playlist-remove')),
    },
    // {
    //     path: '/whitelist',
    //     title: '白名单',
    //     icon: getIcon(() => import('~icons/mdi/playlist-check')),
    // },
    {
        path: '/item-blocks',
        title: '物品方块',
        icon: getIcon(() => import('~icons/mdi/menu')),
    },
    {
        path: '/console',
        title: '控制台',
        icon: getIcon(() => import('~icons/mdi/console')),
    },
    {
        path: '/global-settings',
        title: '功能配置',
        icon: getIcon(() => import('~icons/ep/setting')),
    },
    {
        path: '/autobackup',
        title: '自动备份',
        icon: getIcon(() => import('~icons/iconoir/database-backup')),
    },
    {
        path: '/game-notice',
        title: '游戏公告',
        icon: getIcon(() => import('~icons/icon-park-outline/volume-notice')),
    },
    {
        path: '/points-system',
        title: '积分系统',
        icon: getIcon(() => import('~icons/mdi/bitcoin')),
    },
    {
        path: '/list-management',
        title: '清单管理',
        icon: getIcon(() => import('~icons/material-symbols/checklist')),
    },
    {
        path: '/game-store',
        title: '游戏商店',
        icon: getIcon(() => import('~icons/mdi/store')),
    },
    {
        path: '/vip-gift',
        title: 'VIP礼包',
        icon: getIcon(() => import('~icons/quill/vip')),
    },
    {
        path: '/tele-friend',
        title: '好友传送',
        icon: getIcon(() => import('~icons/carbon/friendship')),
    },
    {
        path: '/tele-city',
        title: '城镇传送',
        icon: getIcon(() => import('~icons/mdi/city')),
        children: [
            {
                path: 'settings',
                title: '城镇配置',
            },
            {
                path: 'management',
                title: '城镇管理',
            },
        ],
    },
    {
        path: '/tele-home',
        title: '私人传送',
        icon: getIcon(() => import('~icons/mdi/home')),
        children: [
            {
                path: 'settings',
                title: '传送配置',
            },
            {
                path: 'management',
                title: 'Home管理',
            },
        ],
    },
    {
        path: import.meta.env.VITE_APP_SWAGGER_URL,
        title: '接口文档',
        icon: getIcon(() => import('~icons/ep/document')),
        isExternalLink: true,
    },
    {
        path: '',
        title: '退出登录',
        icon: getIcon(() => import('~icons/uiw/logout')),
    },
];

const dict = {};

const foreachTree = (menus, parentPath) => {
    for (let i = 0, len = menus.length; i < len; i++) {
        const menu = menus[i];
        if (parentPath && menu.path && menu.path[0] !== '/') {
            menu.path = parentPath + '/' + menu.path;
        }

        dict[menu.path] = menu;

        if (menu.children && menu.children.length) {
            foreachTree(menu.children, menu.path);
        }
    }
};

foreachTree(tree);

export const useMenusStore = defineStore('menus', {
    state: () => {
        return {
            tree: tree,
            dict: dict,
        };
    },
    actions: {
        getMenuByPath(path) {
            const slashIndex = path.indexOf('/', 1);
            const extractedPath = path.substring(0, slashIndex);
            return this.dict[path] ?? this.dict[extractedPath];
        },
    },
});
