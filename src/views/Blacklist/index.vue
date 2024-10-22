<template>
    <div>
        <RouterButton :names="['blacklist']"></RouterButton>
        <MyTable
            row-key="playerId"
            :columns="columns"
            :model-name="t('menus.blacklist')"
            :toolbar="toolbar"
            :search-form-fields="searchFormFields"
            :add-edit-form-fields="addEditFormFields"
            :request-get="requestGet"
            :request-add="requestAdd"
            :request-edit="requestEdit"
            :request-delete="requestDetele"
            :request-batch-delete="requestBatchDelete"
        ></MyTable>
    </div>
</template>

<script>
export default {
    name: 'blacklist',
};
</script>

<script setup>
import * as api from '~/api/blacklist';

const { t } = useI18n();

const columns = [
    {
        type: 'selection',
    },
    {
        type: 'index',
    },
    {
        prop: 'playerId',
        label: t('views.blacklist.tableHeader.playerId'),
        width: 320,
        sortable: 'custom',
    },
    {
        prop: 'displayName',
        label: t('views.blacklist.tableHeader.displayName'),
        width: 150,
        sortable: 'custom',
        tag: true,
    },
    {
        prop: 'bannedUntil',
        label: t('views.blacklist.tableHeader.bannedUntil'),
        width: 160,
        sortable: 'custom',
        formatter: (row) => row.bannedUntil.substr(0, 16),
    },
    {
        prop: 'reason',
        label: t('views.blacklist.tableHeader.reason'),
    },
    {
        type: 'operation',
    },
];

const toolbar = {
    batchOperationItems: [
        {
            type: 'export',
            exportFileName: t('menus.blacklist'),
            exportLocaleKeyPrefix: 'views.blacklist.tableHeader',
        },
    ],
};

const searchFormFields = [
    {
        type: 'input',
        name: 'playerId',
        label: t('views.blacklist.tableHeader.playerId'),
        props: {
            placeholder: t('global.message.inputText'),
        },
    },
    {
        type: 'input',
        name: 'displayName',
        label: t('views.blacklist.tableHeader.displayName'),
        props: {
            placeholder: t('global.message.inputText'),
        },
    },
];

const addEditFormFields = [
    {
        type: 'input',
        name: 'playerId',
        label: t('views.blacklist.tableHeader.playerId'),
        required: true,
        props: {
            placeholder: t('global.message.inputText'),
        },
    },
    {
        type: 'input',
        name: 'displayName',
        label: t('views.blacklist.tableHeader.displayName'),
        props: {
            placeholder: t('global.message.inputText'),
        },
    },
    {
        type: 'date-picker',
        name: 'bannedUntil',
        label: t('views.blacklist.tableHeader.bannedUntil'),
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
        label: t('views.blacklist.tableHeader.reason'),
        props: {
            type: 'textarea',
            rows: 5,
        },
    },
];

const requestGet = async (params) => {
    let data = await api.getBlacklist();

    data = data.filter((i) => new RegExp(params.playerId, 'i').test(i.playerId));
    data = data.filter((i) => new RegExp(params.displayName, 'i').test(i.displayName));

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
    await api.addBlacklist([formModel]);
};

const requestEdit = async (formModel) => {
    await api.deleteBlacklist([formModel.playerId]);
    await api.addBlacklist([formModel]);
};

const requestDetele = async (id) => {
    await api.deleteBlacklist([id]);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deleteBlacklist(selectedIds);
};
</script>
