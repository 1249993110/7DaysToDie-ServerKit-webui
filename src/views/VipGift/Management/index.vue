<template>
    <div>
        <RouterButton :names="['vipGift.settings', 'vipGift.management']" />
        <MyTable
            ref="myTableRef"
            row-key="id"
            :columns="columns"
            :model-name="rt(tm('menus.vipGift')[''])"
            :toolbar="toolbar"
            :search="search"
            :add-edit-form-fields="addEditFormFields"
            :add-edit-label-width="150"
            :request="request"
        >
            <template #bindCell="{ row }">
                <el-button size="small" color="#40e0d0" @click="handleAssociatedItem(row)">{{ t('views.vipGift.tableHeader.bindItem') }}</el-button>
                <el-button size="small" color="#8a2be2" @click="handleAssociatedCommand(row)">{{ t('views.vipGift.tableHeader.bindCmd') }}</el-button>
            </template>
        </MyTable>
        <AssociatedItems v-model="associatedItemsVisible" v-model:table-data="associatedData" :loading="associatedLoading" @edit="handleItemsEdit" />
        <AssociatedCommands v-model="associatedCommandsVisible" v-model:table-data="associatedData" :loading="associatedLoading" @edit="handleCommandsEdit" />
    </div>
</template>

<script>
export default {
    name: 'vipGift.management',
};
</script>

<script setup>
import * as api from '~/api/vip-gift.js';

const { t, tm, rt } = useI18n();

const columns = computed(() => [
    {
        type: 'selection',
    },
    {
        prop: 'id',
        label: t('views.vipGift.tableHeader.playerId'),
        width: 320,
        sortable: 'custom',
    },
    {
        prop: 'name',
        label: t('views.vipGift.tableHeader.name'),
        minWidth: 150,
        sortable: 'custom',
        tag: true,
    },
    {
        prop: 'claimState',
        label: t('views.vipGift.tableHeader.claimState'),
        width: 160,
        sortable: 'custom',
        formatter: (row) => (row.claimState ? t('global.true') : t('global.false')),
    },
    {
        prop: 'totalClaimCount',
        label: t('views.vipGift.tableHeader.totalClaimCount'),
        width: 170,
        sortable: 'custom',
    },
    {
        prop: 'lastClaimAt',
        label: t('views.vipGift.tableHeader.lastClaimAt'),
        sortable: 'custom',
        width: 160,
    },
    {
        prop: 'description',
        label: t('views.vipGift.tableHeader.description'),
        sortable: 'custom',
        minWidth: 150,
    },
    {
        prop: 'bind',
        label: t('views.vipGift.tableHeader.bind'),
        width: 220,
        headerAlign: 'center',
    },
    {
        type: 'operation',
    },
]);

const myTableRef = ref(null);
const toolbar = computed(() => ({
    batchOperationItems: [
        {
            label: t('views.vipGift.resetAll'),
            onClick: async () => {
                try {
                    if (await myconfirm(t('views.vipGift.resetAllConfirm'))) {
                        await api.deleteVipGiftByIds([], true);
                        await myTableRef.value.refresh();
                    }
                } catch {}
            },
        },
        {
            type: 'export',
            fileName: rt(tm('menus.vipGift')['']),
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

const newId = ref(0);
const addEditFormFields = computed(() => [
    {
        type: 'input',
        name: 'id',
        label: t('views.vipGift.tableHeader.playerId'),
        required: true,
    },
    {
        type: 'input',
        name: 'name',
        label: t('views.vipGift.tableHeader.name'),
        required: true,
    },
    {
        type: 'switch',
        name: 'claimState',
        label: t('views.vipGift.tableHeader.claimState'),
    },
    {
        type: 'input-number',
        name: 'totalClaimCount',
        label: t('views.vipGift.tableHeader.totalClaimCount'),
        required: true,
        default: 0,
        props: {
            min: 0,
        },
    },
    {
        type: 'input',
        name: 'description',
        label: t('views.vipGift.tableHeader.description'),
        props: {
            type: 'textarea',
        },
    },
]);

const requestGet = async (params) => {
    let data = await api.getVipGift();
    if (data.length) {
        newId.value = data[data.length - 1].id + 1;
    }

    data = searchByKeyword(data, params.keyword, ['id', 'name', 'description']);
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
    await api.addVipGift(formModel);
};

const requestEdit = async (formModel) => {
    await api.updateVipGift(formModel.id, formModel);
};

const requestDetele = async (id) => {
    await api.deleteVipGiftById(id);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deleteVipGiftByIds(selectedIds);
};

const request = {
    get: requestGet,
    add: requestAdd,
    edit: requestEdit,
    delete: requestDetele,
    batchDelete: requestBatchDelete,
};

const lastClickId = ref(0);

const associatedItemsVisible = ref(false);
const associatedCommandsVisible = ref(false);
const associatedData = ref([]);
const associatedLoading = ref(false);

const handleAssociatedItem = async (row) => {
    associatedLoading.value = true;
    associatedItemsVisible.value = true;
    lastClickId.value = row.id;
    try {
        const data = await api.getItemList(row.id);
        associatedData.value = data;
    } finally {
        associatedLoading.value = false;
    }
};

const handleItemsEdit = async (ids) => {
    await api.updateItemList(lastClickId.value, ids);
};

const handleAssociatedCommand = async (row) => {
    associatedLoading.value = true;
    associatedCommandsVisible.value = true;
    lastClickId.value = row.id;
    try {
        const data = await api.getCommandList(row.id);
        associatedData.value = data;
    } finally {
        associatedLoading.value = false;
    }
};

const handleCommandsEdit = async (ids) => {
    await api.updateCommandList(lastClickId.value, ids);
};
</script>
