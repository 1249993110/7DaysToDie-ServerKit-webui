<template>
    <div>
        <RouterButton :names="['permissions.cmds', 'permissions.admins']" />
        <MyTable
            row-key="command"
            :columns="columns"
            :model-name="t('menus.permissions.cmds')"
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
    name: 'permissions.cmds',
};
</script>

<script setup>
import * as api from '~/api/permissions';

const { t } = useI18n();

const columns = computed(() => [
    {
        type: 'selection',
    },
    {
        type: 'index',
    },
    {
        prop: 'command',
        label: t('views.permissions.cmds.tableHeader.command'),
        width: 200,
        sortable: 'custom',
        tag: true,
    },
    {
        prop: 'permissionLevel',
        label: t('views.permissions.cmds.tableHeader.permissionLevel'),
        width: 170,
        sortable: 'custom',
    },
    {
        prop: 'description',
        label: t('views.permissions.cmds.tableHeader.description'),
        minWidth: 200,
    },
    {
        type: 'operation',
    },
]);

const toolbar = computed(() => ({
    batchOperationItems: [
        {
            type: 'export',
            fileName: t('menus.permissions.cmds'),
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
        name: 'command',
        label: t('views.permissions.cmds.tableHeader.command'),
        required: true,
    },
    {
        type: 'input-number',
        name: 'permissionLevel',
        label: t('views.permissions.cmds.tableHeader.permissionLevel'),
        default: 2000,
    },
]);

const requestGet = async (params) => {
    let data = await api.getPermissions();
    data = searchByKeyword(data, params.keyword, ['command', 'description']);

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
    const result = await api.addPermissions(formModel);
    showCmdExecResult(result);
};

const requestEdit = async (formModel) => {
    await api.deletePermissions([formModel.command]);
    await requestAdd(formModel);
};

const requestDetele = async (id) => {
    await api.deletePermissions([id]);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deletePermissions(selectedIds);
};

const request = {
    get: requestGet,
    add: requestAdd,
    edit: requestEdit,
    delete: requestDetele,
    batchDelete: requestBatchDelete,
};
</script>
