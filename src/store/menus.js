import { defineStore } from 'pinia';

// menu = {
//     name: ,
//     path: ,
//     icon: ,
//     children: ,
//     isExternalLink: ,
// }

const getIcon = (source) => {
    return markRaw(defineAsyncComponent(source));
};

const tree = [
    {
        name: 'dashboard',
        icon: getIcon(() => import('~icons/uiw/dashboard')),
    },
    {
        name: 'serverSettings',
        icon: getIcon(() => import('~icons/material-symbols/display-settings-outline')),
    },
    {
        name: 'map',
        icon: getIcon(() => import('~icons/ep/location-information')),
    },
    {
        name: 'playerList',
        icon: getIcon(() => import('~icons/ep/user')),
    },
    {
        name: 'chat',
        icon: getIcon(() => import('~icons/ep/chat-dot-round')),
    },
    {
        name: 'blacklist',
        icon: getIcon(() => import('~icons/mdi/playlist-remove')),
    },
    {
        name: 'permissions',
        icon: getIcon(() => import('~icons/icon-park-outline/permissions')),
        children: [
            {
                name: 'permissions.cmds',
            },
            {
                name: 'permissions.admins',
            },
        ],
    },
    {
        name: 'itemBlocks',
        icon: getIcon(() => import('~icons/mdi/menu')),
    },
    {
        name: 'console',
        icon: getIcon(() => import('~icons/mdi/console')),
    },
    {
        name: 'globalSettings',
        icon: getIcon(() => import('~icons/ep/setting')),
    },
    {
        name: 'autobackup',
        icon: getIcon(() => import('~icons/iconoir/database-backup')),
    },
    {
        name: 'gameNotice',
        icon: getIcon(() => import('~icons/icon-park-outline/volume-notice')),
    },
    {
        name: 'pointsSystem',
        icon: getIcon(() => import('~icons/tabler/coin-filled')),
    },
    {
        name: 'listManagement',
        icon: getIcon(() => import('~icons/material-symbols/checklist')),
    },
    {
        name: 'gameStore',
        icon: getIcon(() => import('~icons/mdi/store')),
    },
    {
        name: 'vipGift',
        icon: getIcon(() => import('~icons/quill/vip')),
    },
    {
        name: 'teleSystem',
        icon: getIcon(() => import('~icons/game-icons/teleport')),
        children: [
            {
                name: 'teleSystem.friend',
            },
            {
                name: 'teleSystem.city',
            },
            {
                name: 'teleSystem.home',
            },
        ],
    },
    {
        name: 'coloredChat',
        icon: getIcon(() => import('~icons/hugeicons/text-color')),
    },
    {
        name: 'prefab',
        icon: getIcon(() => import('~icons/ph/buildings')),
    },
    {
        name: 'swagger',
        path: import.meta.env.DEV ? `//${import.meta.env.VITE_APP_API_DOMAIN}:${import.meta.env.VITE_APP_API_PORT}/swagger/` : '/swagger',
        icon: getIcon(() => import('~icons/ep/document')),
        isExternalLink: true,
    },
    // {
    //     name: 'logout',
    //     icon: getIcon(() => import('~icons/uiw/logout')),
    // },
];

const dict = {};

const foreachTree = (menus, parentPath) => {
    for (let i = 0, len = menus.length; i < len; i++) {
        const menu = menus[i];
        if (parentPath && menu.path && menu.path[0] !== '/') {
            menu.path = parentPath + '/' + menu.path;
        }

        dict[menu.name] = menu;

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
});
