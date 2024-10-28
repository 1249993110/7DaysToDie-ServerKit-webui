<template>
    <div>
        <RouterButton :names="['pointsSystem.settings', 'pointsSystem.management']" />
        <MyTable
            ref="myTableRef"
            row-key="id"
            :columns="columns"
            :model-name="t('views.pointsSystem.tableHeader.points')"
            :toolbar="toolbar"
            :search="search"
            :add-edit-form-fields="addEditFormFields"
            :request="request"
        />
    </div>
</template>

<script>
export default {
    name: 'pointsSystem.management',
};
</script>

<script setup>
import * as api from '~/api/points-info.js';

const { t, tm, rt } = useI18n();

const myTableRef = ref(null);

const columns = computed(() => [
    {
        type: 'selection',
    },
    {
        type: 'index',
    },
    {
        prop: 'id',
        label: t('views.pointsSystem.tableHeader.playerId'),
        width: 320,
        // sortable: 'custom',
    },
    {
        prop: 'playerName',
        label: t('views.pointsSystem.tableHeader.playerName'),
        minWidth: 150,
        // sortable: 'custom',
        tag: true,
    },
    {
        prop: 'points',
        label: t('views.pointsSystem.tableHeader.points'),
        minWidth: 80,
        // sortable: 'custom',
    },
    {
        prop: 'lastSignInAt',
        label: t('views.pointsSystem.tableHeader.lastSignInAt'),
        minWidth: 160,
        // sortable: 'custom',
    },
    {
        type: 'operation',
    },
]);

const toolbar = computed(() => ({
    batchOperationItems: [
        {
            label: t('views.pointsSystem.resetPoints'),
            onClick: async () => {
                try {
                    if (await myconfirm(t('views.pointsSystem.resetPointsConfirm'))) {
                        await api.deletePointsInfoByIds({ resetPoints: true });
                        await myTableRef.value.refresh();
                    }
                } catch {}
            },
        },
        {
            label: t('views.pointsSystem.resetSignIn'),
            onClick: async () => {
                try {
                    if (await myconfirm(t('views.pointsSystem.resetSignInConfirm'))) {
                        await api.deletePointsInfoByIds({ resetSignIn: true });
                        await myTableRef.value.refresh();
                    }
                } catch {}
            },
        },
        {
            type: 'export',
            fileName: rt(tm('menus.pointsSystem')['']),
            divided: true,
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
            }
        },
    ],
}));

const addEditFormFields = computed(() => [
    {
        type: 'input',
        name: 'id',
        label: t('views.pointsSystem.tableHeader.playerId'),
        required: true,
    },
    {
        type: 'input',
        name: 'playerName',
        label: t('views.pointsSystem.tableHeader.playerName'),
    },
    {
        type: 'input',
        name: 'points',
        label: t('views.pointsSystem.tableHeader.points'),
        required: true,
    },
    {
        type: 'date-picker',
        name: 'lastSignInAt',
        label: t('views.pointsSystem.tableHeader.lastSignInAt'),
        required: true,
        props: {
            type: 'datetime',
            placeholder: t('global.message.datePickerPlaceholder'),
            format: 'YYYY-MM-DD HH:mm',
            valueFormat: 'YYYY-MM-DD HH:mm:00',
        },
    },
]);

const requestGet = async (params) => {
    const data = await api.getPointsInfoPaged({
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        keyword: params.keyword,
        // order: params.sortPorp,
        // desc: params.sortOrder === 'descending',
    });

    return data;
};

const requestAdd = async (formModel) => {
    await api.addPointsInfo(formModel);
};

const requestEdit = async (formModel) => {
    await api.updatePointsInfo(formModel.id, formModel);
};

const requestDetele = async (id) => {
    await api.deletePointsInfoById(id);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deletePointsInfoByIds(selectedIds);
};

const request = {
    get: requestGet,
    add: requestAdd,
    edit: requestEdit,
    delete: requestDetele,
    batchDelete: requestBatchDelete,
};
</script>
