<template>
    <div>
        <RouterButton :names="['listManagement.itemList', 'listManagement.commandList']" />
        <MyTable
            row-key="id"
            :columns="columns"
            :model-name="t('menus.listManagement.commandList')"
            :toolbar="toolbar"
            :search="search"
            :add-edit-form-fields="addEditFormFields"
            :request="request"
            ref="myTableRef"
        />
    </div>
</template>

<script>
export default {
    name: 'listManagement.commandList',
};
</script>

<script setup>
import * as api from '~/api/command-list';
import { ElTag } from 'element-plus';

const { t, tm, rt } = useI18n();
const myTableRef = ref(null);

const columns = computed(() => [
    {
        type: 'selection',
    },
    {
        prop: 'id',
        label: t('views.listManagement.tableHeader.id'),
        width: 80,
        align: 'center',
        fixed: true,
    },
    {
        prop: 'command',
        label: t('views.listManagement.tableHeader.command'),
        render: ({ row }) => {
            const split = row.command?.split('\n');
            if (!split) {
                return;
            }
            const arr = [];
            for (let i = 0; i < split.length; i++) {
                const str = split[i].trim();
                if (str) {
                    arr.push(h(ElTag, { type: 'success', style: { marginLeft: '4px' } }, () => str));
                }
            }
            return h('span', null, arr);
        },
        minWidth: 150,
    },
    {
        prop: 'inMainThread',
        label: t('views.listManagement.tableHeader.inMainThread'),
        formatter: (row) => (row.inMainThread ? t('global.true') : t('global.false')),
        width: 130,
    },
    {
        prop: 'description',
        label: t('views.listManagement.tableHeader.description'),
        minWidth: 150,
    },
    {
        type: 'operation',
    },
]);

const toolbar = computed(() => ({
    batchOperationItems: [
        {
            type: 'export',
            fileName: t('menus.listManagement.commandList'),
            // divided: true,
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
        label: t('views.listManagement.tableHeader.command'),
        required: true,
        props: {
            type: 'textarea',
        },
    },
    {
        type: 'switch',
        name: 'inMainThread',
        label: t('views.listManagement.tableHeader.inMainThread'),
        default: true,
    },
    {
        type: 'input',
        name: 'description',
        label: t('views.listManagement.tableHeader.description'),
        props: {
            type: 'textarea',
        },
    },
]);

const requestGet = async (params) => {
    const data = await api.getCommandListPaged({
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        keyword: params.keyword,
        // order: params.sortPorp,
        // desc: params.sortOrder === 'descending',
    });

    return data;
};

const requestAdd = async (formModel) => {
    await api.addCommand(formModel);
};

const requestEdit = async (formModel) => {
    await api.updateCommand(formModel.id, formModel);
};

const requestDetele = async (id) => {
    await api.deleteCommandById(id);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deleteCommandByIds(selectedIds);
};

const request = {
    get: requestGet,
    add: requestAdd,
    edit: requestEdit,
    delete: requestDetele,
    batchDelete: requestBatchDelete,
};
</script>
