<template>
    <div>
        <RouterButton :names="['teleSystem.home.settings', 'teleSystem.home.management']" />
        <MyTable
            row-key="id"
            :columns="columns"
            :model-name="rt(tm('menus.teleSystem.home')[''])"
            :toolbar="toolbar"
            :search="search"
            :add-edit-form-fields="addEditFormFields"
            :request="request"
            :disableOnEditFields="['playerId']"
            ref="myTableRef"
        />
    </div>
</template>

<script>
export default {
    name: 'teleSystem.home.management',
};
</script>

<script setup>
import * as api from '~/api/home-location.js';

const { t, rt, tm } = useI18n();

const columns = computed(() => [
    {
        type: 'selection',
    },
    {
        prop: 'playerId',
        label: t('views.teleSystem.home.tableHeader.playerId'),
        width: 320,
        sortable: 'custom',
        fixed: true,
    },
    {
        prop: 'playerName',
        label: t('views.teleSystem.home.tableHeader.playerName'),
        width: 120,
    },
    {
        prop: 'homeName',
        label: t('views.teleSystem.home.tableHeader.homeName'),
        width: 120,
    },
    {
        prop: 'position',
        label: t('views.teleSystem.home.tableHeader.position'),
        width: 135,
    },
    {
        prop: 'createdAt',
        label: t('views.teleSystem.home.tableHeader.createdAt'),
        width: 160,
        sortable: 'custom',
    },
    {
        type: 'operation',
    },
]);

const myTableRef = ref(null);
const toolbar = computed(() => ({
    batchOperationItems: [
        {
            label: t('views.teleSystem.home.deleteAll'),
            onClick: async () => {
                try {
                    if (await myconfirm(t('views.teleSystem.home.deleteAllConfirm'))) {
                        await api.deleteHomeLocationByIds([], true);
                        await myTableRef.value.refresh();
                    }
                } catch {}
            },
        },
        {
            type: 'export',
            fileName: rt(tm('menus.teleSystem.home')['']),
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
        label: t('views.teleSystem.home.tableHeader.playerId'),
        required: true,
    },
    {
        type: 'input',
        name: 'playerName',
        label: t('views.teleSystem.home.tableHeader.playerName'),
        required: true,
    },
    {
        type: 'input',
        name: 'homeName',
        label: t('views.teleSystem.home.tableHeader.homeName'),
        required: true,
    },
    {
        type: 'Coordinate',
        name: 'position',
        label: t('views.teleSystem.home.tableHeader.position'),
        required: true,
    },
]);

const requestGet = async (params) => {
    return await api.getHomeLocationPaged({
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        keyword: params.keyword,
        // order: params.sortPorp,
        // desc: params.sortOrder === 'descending',
    });
};

const requestAdd = async (formModel) => {
    await api.addHomeLocation(formModel);
};

const requestEdit = async (formModel) => {
    await api.updateHomeLocation(formModel.playerId, formModel);
};

const requestDetele = async (id) => {
    await api.deleteHomeLocationById(id);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deleteHomeLocationByIds(selectedIds);
};

const request = {
    get: requestGet,
    add: requestAdd,
    edit: requestEdit,
    delete: requestDetele,
    batchDelete: requestBatchDelete,
};
</script>
