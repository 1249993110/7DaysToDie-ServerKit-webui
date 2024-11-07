<template>
    <div>
        <RouterButton :names="['permissions.cmds', 'permissions.admins']" />
        <MyTable
            row-key="playerId"
            :columns="columns"
            :model-name="t('menus.permissions.admins')"
            :toolbar="toolbar"
            :search="search"
            :add-edit-form-fields="addEditFormFields"
            :request="request"
            :add-edit-label-width="150"
        />
    </div>
</template>

<script>
export default {
    name: 'permissions.admins',
};
</script>

<script setup>
import * as api from '~/api/admins';

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
        label: t('views.permissions.admins.tableHeader.playerId'),
        width: 320,
        sortable: 'custom',
    },
    {
        prop: 'permissionLevel',
        label: t('views.permissions.admins.tableHeader.permissionLevel'),
        width: 170,
        sortable: 'custom',
    },
    {
        prop: 'displayName',
        label: t('views.permissions.admins.tableHeader.displayName'),
        minWidth: 200,
        tag: true,
        sortable: 'custom',
    },
    {
        type: 'operation',
    },
]);

const toolbar = computed(() => ({
    batchOperationItems: [
        {
            type: 'export',
            fileName: t('menus.permissions.admins'),
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
        type: 'input',
        name: 'playerId',
        label: t('views.permissions.admins.tableHeader.playerId'),
        required: true,
    },
    {
        type: 'input-number',
        name: 'permissionLevel',
        label: t('views.permissions.admins.tableHeader.permissionLevel'),
        default: 2000,
    },
    {
        type: 'input',
        name: 'displayName',
        label: t('views.permissions.admins.tableHeader.displayName'),
    },
]);

const requestGet = async (params) => {
    let data = await api.getAdmins();
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
    const result = await api.addAdmins(formModel);
    showCmdExecResult(result);
};

const requestEdit = async (formModel) => {
    await api.deleteAdmins([formModel.playerId]);
    await requestAdd(formModel);
};

const requestDetele = async (id) => {
    await api.deleteAdmins([id]);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deleteAdmins(selectedIds);
};

const request = {
    get: requestGet,
    add: requestAdd,
    edit: requestEdit,
    delete: requestDetele,
    batchDelete: requestBatchDelete,
};
</script>
