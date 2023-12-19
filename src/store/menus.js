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
        path: '/dashboard',
        title: '仪表盘',
        icon: getIcon(() => import('~icons/uiw/dashboard')),
    },
    {
        path: '/map',
        title: 'GPS地图',
        icon: getIcon(() => import('~icons/ep/location-information')),
    },
    {
        path: '/online-players',
        title: '在线玩家',
        icon: getIcon(() => import('~icons/ep/user')),
    },
    {
        path: '/history-players',
        title: '历史玩家',
        icon: getIcon(() => import('~icons/ep/user-filled')),
    },
    {
        path: '/live-chat',
        title: '实时聊天',
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
    // {
    //     path: '/app-settings',
    //     title: '应用设置',
    //     icon: getIcon(() => import('~icons/ep/setting')),
    // },
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
            return this.dict[path];
        },
    },
});
