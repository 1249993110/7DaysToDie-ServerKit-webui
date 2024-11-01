<template>
    <div>
        <RouterButton :names="['chat.liveChat', 'chat.chatRecord']" />
        <MyTable
            ref="myTableRef"
            row-key="id"
            :columns="columns"
            :toolbar="toolbar"
            :search="search"
            :request="request"
            :default-sort="{ prop: 'createdAt', order: 'descending' }"
        />
    </div>
</template>

<script>
export default {
    name: 'chat.chatRecord',
};
</script>

<script setup>
import * as api from '~/api/chat-record';

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
        prop: 'createdAt',
        label: t('views.chat.tableHeader.createdAt'),
        width: 160,
        sortable: 'custom',
    },
    {
        prop: 'senderName',
        label: t('views.chat.tableHeader.senderName'),
        minWidth: 150,
        tag: true,
    },
    {
        prop: 'chatType',
        label: t('views.chat.tableHeader.chatType'),
        width: 80,
        formatter: (row) => {
            let result;
            switch (row.chatType) {
                // Global
                case 'Global':
                    result = t('views.chat.chatType.global');
                    break;
                // Friends
                case 'Friends':
                    result = t('views.chat.chatType.friends');
                    break;
                // Party
                case 'Party':
                    result = t('views.chat.chatType.party');
                    break;
                // Whisper
                case 'Whisper':
                    result = t('views.chat.chatType.whisper');
                    break;
                // Unknown
                default:
                    result = t('views.chat.chatType.unknown');
            }
            return result;
        },
    },
    {
        prop: 'message',
        label: t('views.chat.tableHeader.message'),
        minWidth: 200,
    },
    {
        prop: 'entityId',
        label: t('views.chat.tableHeader.entityId'),
        width: 110,
    },
    {
        prop: 'playerId',
        label: t('views.chat.tableHeader.playerId'),
        width: 320,
    },

    {
        type: 'operation',
        editBtnVisible: false,
    },
]);

const toolbar = computed(() => ({
    addBtnVisible: false,
    batchOperationItems: [
        {
            label: t('global.button.deleteAll'),
            onClick: async () => {
                try {
                    if (await myconfirm(t('global.message.deleteConfirm'))) {
                        await api.deleteChatRecordByIds([], true);
                        await myTableRef.value.refresh();
                    }
                } catch {}
            },
        },
        {
            type: 'export',
            fileName: t('menus.chat.chatRecord'),
            divided: true,
        },
    ],
}));

const search = computed(() => ({
    fields: [
        {
            type: 'MyDateTimeSelector',
            name: 'datetimerange',
            label: t('views.chat.createdAt'),
            minWidth: 460,
        },
        {
            type: 'select-v2',
            name: 'chatType',
            label: t('views.chat.tableHeader.chatType'),
            span: 3,
            minWidth: 200,
            props: {
                options: [
                    { label: t('views.chat.chatType.global'), value: 'Global' },
                    { label: t('views.chat.chatType.friends'), value: 'Friends' },
                    { label: t('views.chat.chatType.party'), value: 'Party' },
                    { label: t('views.chat.chatType.whisper'), value: 'Whisper' },
                    { label: t('views.chat.chatType.unknown'), value: 'Unknown' },
                ],
            },
        },
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
    console.log(params);

    const data = await api.getChatRecord({
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        keyword: params.keyword,
        order: params.sortPorp,
        desc: params.sortOrder === 'descending',
        startDateTime: params.datetimerange ? params.datetimerange[0] : null,
        endDateTime: params.datetimerange ? params.datetimerange[1] : null,
        chatType: params.chatType,
    });

    return data;
};

const requestDetele = async (id) => {
    await api.deleteChatRecordById(id);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deleteChatRecordByIds(selectedIds);
};

const request = {
    get: requestGet,
    delete: requestDetele,
    batchDelete: requestBatchDelete,
};
</script>
