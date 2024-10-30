<template>
    <div>
        <RouterButton :names="['coloredChat.settings', 'coloredChat.management']" />
        <MyTable
            row-key="id"
            :columns="columns"
            :model-name="rt(tm('menus.coloredChat')[''])"
            :toolbar="toolbar"
            :search="search"
            :add-edit-form-fields="addEditFormFields"
            :request="request"
        >
            <template #nameColorCell="{ row }">
                <span class="tableColColor">
                    <div :style="{ backgroundColor: '#' + row.nameColor }"></div>
                    {{ row.nameColor }}
                </span>
            </template>
            <template #textColorCell="{ row }">
                <span class="tableColColor">
                    <div :style="{ backgroundColor: '#' + row.textColor }"></div>
                    {{ row.textColor }}
                </span>
            </template>
        </MyTable>
    </div>
</template>

<script>
export default {
    name: 'coloredChat.management',
};
</script>

<script setup>
import * as api from '~/api/coloredChat.js';

const { t, tm, rt } = useI18n();

const columns = computed(() => [
    {
        type: 'selection',
    },
    {
        type: 'index',
    },
    {
        prop: 'id',
        label: t('views.coloredChat.tableHeader.playerId'),
        width: 320,
    },
    {
        prop: 'customName',
        label: t('views.coloredChat.tableHeader.customName'),
        minWidth: 150,
        tag: true,
    },
    {
        prop: 'nameColor',
        label: t('views.coloredChat.tableHeader.nameColor'),
        minWidth: 105,
    },
    {
        prop: 'textColor',
        label: t('views.coloredChat.tableHeader.textColor'),
        minWidth: 105,
    },
    {
        prop: 'createdAt',
        label: t('views.coloredChat.tableHeader.createdAt'),
        width: 160,
        sort: 'custom',
    },
    {
        prop: 'description',
        label: t('views.coloredChat.tableHeader.description'),
        minWidth: 150,
        sort: 'custom',
    },
    {
        type: 'operation',
    },
]);

const toolbar = computed(() => ({
    batchOperationItems: [
        {
            type: 'export',
            fileName: rt(tm('menus.coloredChat')['']),
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
            },
        },
    ],
}));

const addEditFormFields = computed(() => [
    {
        type: 'input',
        name: 'id',
        label: t('views.coloredChat.tableHeader.playerId'),
        required: true,
    },
    {
        type: 'input',
        name: 'customName',
        label: t('views.coloredChat.tableHeader.customName'),
    },
    {
        type: 'MyColorPicker',
        name: 'nameColor',
        label: t('views.coloredChat.tableHeader.nameColor'),
        required: true,
    },
    {
        type: 'MyColorPicker',
        name: 'textColor',
        label: t('views.coloredChat.tableHeader.textColor'),
        required: true,
    },
    {
        type: 'input',
        name: 'description',
        label: t('views.coloredChat.tableHeader.description'),
    },
]);

const requestGet = async (params) => {
    let data = await api.getColoredChat();
    data = searchByKeyword(data, params.keyword, ['id', 'customName', 'description']);
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
    await api.addColoredChat(formModel);
};

const requestEdit = async (formModel) => {
    await api.updateColoredChat(formModel.id, formModel);
};

const requestDetele = async (id) => {
    await api.deleteColoredChatById(id);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deleteColoredChatByIds(selectedIds);
};

const request = {
    get: requestGet,
    add: requestAdd,
    edit: requestEdit,
    delete: requestDetele,
    batchDelete: requestBatchDelete,
};
</script>

<style scoped lang="scss">
.tableColColor {
    display: flex;
    align-items: center;
    div {
        height: 20px;
        width: 20px;
        margin-right: 5px;
    }
}
</style>
