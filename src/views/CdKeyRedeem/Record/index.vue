<template>
    <div>
        <RouterButton :names="['cdKeyRedeem.settings', 'cdKeyRedeem.management', 'cdKeyRedeem.record']" />
        <MyTable
            row-key="id"
            :columns="columns"
            :model-name="t('menus.cdKeyRedeem.record')"
            :toolbar="toolbar"
            :search="search"
            :request="request"
        >
        </MyTable>
    </div>
</template>

<script>
export default {
    name: 'cdKeyRedeem.record',
};
</script>

<script setup>
import * as api from '~/api/cdKeyRedeemRecord';

const { t, tm, rt } = useI18n();

const columns = computed(() => [
    {
        type: 'selection',
    },
    {
        type: 'index',
    },
    {
        prop: 'key',
        label: t('views.cdKeyRedeem.tableHeader.key'),
        width: 340,
        sortable: 'custom',
    },
    {
        prop: 'createdAt',
        label: t('views.cdKeyRedeem.tableHeader.createdAt'),
        width: 160,
        sortable: 'custom',
    },
    {
        prop: 'playerId',
        label: t('views.cdKeyRedeem.tableHeader.playerId'),
        width: 320,
        sortable: 'custom',
    },
    {
        prop: 'playerName',
        label: t('views.cdKeyRedeem.tableHeader.playerName'),
        minWidth: 150,
        sortable: 'custom',
    },
    {
        type: 'operation',
        editBtnVisible: false,
    },
]);

const toolbar = computed(() => ({
    batchOperationItems: [
        {
            type: 'export',
            fileName: t('menus.cdKeyRedeem.record'),
        },
    ],
    addBtnVisible: false
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

const requestGet = async (params) => {
    let data = await api.getCdKeyRedeemRecords();
    data = searchByKeyword(data, params.keyword, ['key', 'playerId', 'playerName']);
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
    await api.createCdKeyRedeemRecord(formModel);
};

const requestEdit = async (formModel) => {
    await api.updateCdKeyRedeemRecord(formModel.id, formModel);
};

const requestDetele = async (id) => {
    await api.deleteCdKeyRedeemRecord(id);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deleteCdKeyRedeemRecords(selectedIds);
};

const request = {
    get: requestGet,
    add: requestAdd,
    edit: requestEdit,
    delete: requestDetele,
    batchDelete: requestBatchDelete,
};
</script>