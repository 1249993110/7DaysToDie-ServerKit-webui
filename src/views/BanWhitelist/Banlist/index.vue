<template>
    <div>
        <RouterButton :names="['banWhitelist.banlist', 'banWhitelist.whitelist']" />
        <MyTable
            row-key="playerId"
            :columns="columns"
            :model-name="t('menus.banWhitelist.banlist')"
            :toolbar="toolbar"
            :search="search"
            :add-edit-form-fields="addEditFormFields"
            :request="request"
        />
    </div>
</template>

<script>
export default {
    name: 'banWhitelist.banlist',
};
</script>

<script setup>
import * as api from '~/api/blacklist';

const { t } = useI18n();

const columns = computed(() => [
    {
        type: 'selection',
    },
    {
        type: 'index',
    },
    {
        prop: 'playerId',
        label: t('views.banlist.tableHeader.playerId'),
        width: 320,
        sortable: 'custom',
    },
    {
        prop: 'displayName',
        label: t('views.banlist.tableHeader.displayName'),
        width: 150,
        sortable: 'custom',
        tag: true,
    },
    {
        prop: 'bannedUntil',
        label: t('views.banlist.tableHeader.bannedUntil'),
        width: 160,
        sortable: 'custom',
        formatter: (row) => row.bannedUntil.substr(0, 16),
    },
    {
        prop: 'reason',
        label: t('views.banlist.tableHeader.reason'),
    },
    {
        type: 'operation',
    },
]);

const toolbar = computed(() => ({
    batchOperationItems: [
        {
            type: 'export',
            fileName: t('menus.banWhitelist.banlist'),
        },
    ],
}));

const search = computed(() => ({
    fields: [
        {
            type: 'input',
            name: 'keyword',
            label: t('global.keyword'),
            props: {
                autofocus: true,
            },
        },
    ],
}));

const addEditFormFields = computed(() => [
    {
        type: 'PlayerIdSelector',
        name: 'playerId',
        label: t('views.banlist.tableHeader.playerId'),
        required: true,
    },
    {
        type: 'input',
        name: 'displayName',
        label: t('views.banlist.tableHeader.displayName'),
    },
    {
        type: 'date-picker',
        name: 'bannedUntil',
        label: t('views.banlist.tableHeader.bannedUntil'),
        required: true,
        props: {
            type: 'datetime',
            placeholder: t('global.message.datePickerPlaceholder'),
            format: 'YYYY-MM-DD HH:mm',
            valueFormat: 'YYYY-MM-DD HH:mm:00',
        },
    },
    {
        type: 'input',
        name: 'reason',
        label: t('views.banlist.tableHeader.reason'),
        props: {
            type: 'textarea',
        },
    },
]);

const requestGet = async (params) => {
    let data = await api.getBlacklist();
    data = searchByKeyword(data, params.keyword, ['playerId', 'displayName']);

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

const requestAdd = async (formModel) => {
    const result = await api.addBlacklist(formModel);
    showCmdExecResult(result);
};

const requestEdit = async (formModel) => {
    await api.deleteBlacklist([formModel.playerId]);
    await requestAdd(formModel);
};

const requestDetele = async (id) => {
    await api.deleteBlacklist([id]);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deleteBlacklist(selectedIds);
};

const request = {
    get: requestGet,
    add: requestAdd,
    edit: requestEdit,
    delete: requestDetele,
    batchDelete: requestBatchDelete,
};
</script>
