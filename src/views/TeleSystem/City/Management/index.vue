<template>
    <div>
        <RouterButton :names="['teleSystem.city.settings', 'teleSystem.city.management']" />
        <MyTable
            row-key="id"
            :columns="columns"
            :model-name="rt(tm('menus.teleSystem.city')[''])"
            :toolbar="toolbar"
            :search="search"
            :add-edit-form-fields="addEditFormFields"
            :request="request"
        />
    </div>
</template>

<script>
export default {
    name: 'teleSystem.city.management',
};
</script>

<script setup>
import * as api from '~/api/city-location.js';
import { getViewDirectionLabel, getViewDirectionOptions } from '../viewDirectionOptions.js';

const { t, rt, tm } = useI18n();

const columns = computed(() => [
    {
        type: 'selection',
    },
    {
        prop: 'id',
        label: t('views.teleSystem.city.tableHeader.id'),
        width: 80,
        sortable: 'custom',
        align: 'center',
        fixed: true,
    },
    {
        prop: 'cityName',
        label: t('views.teleSystem.city.tableHeader.cityName'),
        minWidth: 150,
        sortable: 'custom',
        tag: true,
    },
    {
        prop: 'pointsRequired',
        label: t('views.teleSystem.city.tableHeader.pointsRequired'),
        width: 160,
        sortable: 'custom',
    },
    {
        prop: 'position',
        label: t('views.teleSystem.city.tableHeader.position'),
        width: 135,
    },
    {
        label: t('views.teleSystem.city.tableHeader.viewDirection'),
        render: ({ row }) => getViewDirectionLabel(row.viewDirection),
        width: 135,
    },
    {
        prop: 'createdAt',
        label: t('views.teleSystem.city.tableHeader.createdAt'),
        width: 160,
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
            fileName: rt(tm('menus.teleSystem.city')['']),
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
        type: 'input-number',
        name: 'id',
        label: t('views.teleSystem.city.tableHeader.id'),
        required: true,
        default: newId.value,
    },
    {
        type: 'input',
        name: 'cityName',
        label: t('views.teleSystem.city.tableHeader.cityName'),
        required: true,
    },
    {
        type: 'input-number',
        name: 'pointsRequired',
        label: t('views.teleSystem.city.tableHeader.pointsRequired'),
        required: true,
        props: {
            min: 0,
        },
    },
    {
        type: 'Coordinate',
        name: 'position',
        label: t('views.teleSystem.city.tableHeader.position'),
        required: true,
    },
    {
        type: 'select-v2',
        name: 'viewDirection',
        label: t('views.teleSystem.city.tableHeader.viewDirection'),
        props: {
            options: getViewDirectionOptions(),
            style: { width: '150px' },
        },
    },
]);

const requestGet = async (params) => {
    let data = await api.getCityLocations();
    if (data.length) {
        newId.value = data[data.length - 1].id + 1;
    }

    data = searchByKeyword(data, params.keyword, ['id', 'cityName']);

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
    await api.addCityLocation(formModel);
};

const requestEdit = async (formModel) => {
    await api.updateCityLocation(formModel.id, formModel);
};

const requestDetele = async (id) => {
    await api.deleteCityLocationById(id);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deleteCityLocationByIds(selectedIds);
};

const request = {
    get: requestGet,
    add: requestAdd,
    edit: requestEdit,
    delete: requestDetele,
    batchDelete: requestBatchDelete,
};
</script>
