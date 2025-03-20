<template>
    <div>
        <RouterButton :names="['banWhitelist.banlist', 'banWhitelist.whitelist']" />
        <MyTable
            row-key="playerId"
            :columns="columns"
            :model-name="t('menus.banWhitelist.whitelist')"
            :toolbar="toolbar"
            :search="search"
            :add-edit-form-fields="addEditFormFields"
            :request="request"
        />
    </div>
</template>

<script>
export default {
    name: 'banWhitelist.whitelist',
};
</script>

<script setup>
import * as api from '~/api/whitelist';

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
        label: t('views.whitelist.tableHeader.playerId'),
        width: 320,
        sortable: 'custom',
    },
    {
        prop: 'displayName',
        label: t('views.whitelist.tableHeader.displayName'),
        width: 150,
        sortable: 'custom',
        tag: true,
    },
    {
        type: 'operation',
    },
]);

const toolbar = computed(() => ({
    batchOperationItems: [
        {
            type: 'export',
            fileName: t('menus.banWhitelist.whitelist'),
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
        label: t('views.whitelist.tableHeader.playerId'),
        required: true,
    },
    {
        type: 'input',
        name: 'displayName',
        label: t('views.whitelist.tableHeader.displayName'),
    },
]);

const requestGet = async (params) => {
    let data = await api.getWhitelist();
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
    const result = await api.addWhitelist(formModel);
    showCmdExecResult(result);
};

const requestEdit = async (formModel) => {
    await api.deleteWhitelist([formModel.playerId]);
    await requestAdd(formModel);
};

const requestDetele = async (id) => {
    await api.deleteWhitelist([id]);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deleteWhitelist(selectedIds);
};

const request = {
    get: requestGet,
    add: requestAdd,
    edit: requestEdit,
    delete: requestDetele,
    batchDelete: requestBatchDelete,
};
</script>
