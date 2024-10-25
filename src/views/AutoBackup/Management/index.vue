<template>
    <div class="autobackup-management">
        <RouterButton :names="['autobackup.settings', 'autobackup.management']" />
        <MyTable
            row-key="name"
            :columns="columns"
            :toolbar="toolbar"
            :search="search"
            :request="request"
            :default-sort="{ prop: 'createdAt', order: 'descending' }"
        />
    </div>
</template>

<script>
export default {
    name: 'autobackup.management',
};
</script>

<script setup>
import * as api from '~/api/autobackup.js';

const { t, tm, rt } = useI18n();

const columns = computed(() => [
    {
        type: 'selection',
    },
    {
        type: 'index',
    },
    {
        prop: 'name',
        label: t('views.autoBackup.tableHeader.name'),
        visible: false,
    },
    {
        prop: 'serverVersion',
        label: t('views.autoBackup.tableHeader.serverVersion'),
        sortable: 'custom',
    },
    {
        prop: 'gameWorld',
        label: t('views.autoBackup.tableHeader.gameWorld'),
        sortable: 'custom',
    },
    {
        prop: 'gameName',
        label: t('views.autoBackup.tableHeader.gameName'),
        sortable: 'custom',
    },
    {
        prop: 'gameTime',
        label: t('views.autoBackup.tableHeader.gameTime'),
        tag: true,
        formatter: (row) => t('views.autoBackup.tableHeader.formatGameTime', [row.days, row.hours]),
    },
    {
        prop: 'createdAt',
        label: t('views.autoBackup.tableHeader.createdAt'),
        sortable: 'custom',
    },
    {
        prop: 'size',
        label: t('views.autoBackup.tableHeader.size'),
        sortable: 'custom',
        formatter: (row) => `${Math.round(row.size / 1024 / 1024)} MB`,
    },
    {
        type: 'operation',
        editBtnVisible: false,
    },
]);

const toolbar = computed(() => ({
    addBtnVisible: false,
    batchOperationItems: [
        {
            type: 'export',
            fileName: rt(tm('menus.autobackup')['']),
        },
    ],
}));

const search = computed(() => ({
    fields: [
        {
            type: 'input',
            name: 'keyword',
            label: t('global.keyword'),
        },
    ]
}));

const requestGet = async (params) => {
    let data = await api.getBackupFiles();

    data = searchByKeyword(data, params.keyword, ['serverVersion', 'gameWorld', 'gameName', 'gameTime', 'createdAt']);

    if (params.sortOrder) {
        const desc = params.sortOrder === 'descending';
        const sortPorp = params.sortPorp;
        data = data.sort((a, b) => {
            if (desc) {
                return a[sortPorp] < b[sortPorp] ? 1 : -1;
            }

            return a[sortPorp] > b[sortPorp] ? 1 : -1;
        });
    } else {
        data.reverse();
    }

    if (params.pageSize < 0) {
        return {
            items: data,
            total: data.length,
        };
    }
    return {
        items: data.slice((params.pageNumber - 1) * params.pageSize, params.pageNumber * params.pageSize),
        total: data.length,
    };
};

const requestDetele = async (id) => {
    await api.deletetBackupFiles([id]);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deletetBackupFiles(selectedIds);
};

const request = {
    get: requestGet,
    delete: requestDetele,
    batchDelete: requestBatchDelete,
};

console.log(request);
</script>
