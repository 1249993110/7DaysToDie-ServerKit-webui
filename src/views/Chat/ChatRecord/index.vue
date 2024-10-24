<template>
    <div>
        <RouterButton :names="['chat.liveChat', 'chat.chatRecord']"></RouterButton>
        <MyTableEx
            style="margin-top: 20px"
            @on-export="handleExport"
            :search-form-model="searchFormModel"
            :get-data="getData"
            :table-data="tableData"
            :total="total"
            :show-add-btn="false"
            :show-edit-btn="false"
            :operation-column-width="90"
            :delete="deleteRequest"
            :batch-delete="batchDeleteRequest"
            @onSortChange="handleSortChange"
            :default-sort="{ prop: 'createdAt', order: 'descending' }"
            :pageSize="100"
        >
            <template #searchFormItems>
                <el-form-item :label="t('global.keyword')" prop="keyword">
                    <el-input v-model="searchFormModel.keyword" style="width: 400px" :placeholder="t('global.message.inputText')" clearable autofocus></el-input>
                </el-form-item>
            </template>
            <template #toolbarPost>
                <el-button @click="handleDeleteAll" type="danger">{{ t('global.button.deleteAll') }}</el-button>
            </template>
            <template #columns>
                <el-table-column prop="createdAt" :label="t('views.chat.tableHeader.createdAt')" width="165" sortable="custom"> </el-table-column>
                <el-table-column prop="senderName" :label="t('views.chat.tableHeader.senderName')" width="180" show-overflow-tooltip> </el-table-column>
                <el-table-column prop="chatType" :label="t('views.chat.tableHeader.chatType')" width="80" :formatter="formatChatType"> </el-table-column>
                <el-table-column prop="message" :label="t('views.chat.tableHeader.message')" min-width="120" show-overflow-tooltip> </el-table-column>
                <el-table-column prop="entityId" :label="t('views.chat.tableHeader.entityId')" width="90"> </el-table-column>
                <el-table-column prop="playerId" :label="t('views.chat.tableHeader.playerId')" width="280" show-overflow-tooltip> </el-table-column>
            </template>
        </MyTableEx>
    </div>
</template>
<script>
export default {
    name: 'chat.chatRecord',
};
</script>
<script setup>
import * as api from '~/api/chat-record';

const { t } = useI18n();

const searchFormModel = reactive({
    keyword: '',
    order: 'createdAt',
    desc: true,
});

const tableData = ref([]);
const total = ref(0);

const getData = async (pagination) => {
    const data = await api.getChatRecord({ ...pagination, ...searchFormModel });
    tableData.value = data.items;
    total.value = data.total;
};

const formatChatType = (row) => {
    let type;
    switch (row.chatType) {
        // Global
        case 'Global':
            type = t('views.chat.chatType.global');
            break;
        // Friends
        case 'Friends':
            type = t('views.chat.chatType.friends');
            break;
        // Party
        case 'Party':
            type = t('views.chat.chatType.party');
            break;
        // Whisper
        case 'Whisper':
            type = t('views.chat.chatType.whisper');
            break;
        // Unknown
        default:
            type = t('views.chat.chatType.unknown');
    }
    return type;
};

const handleExport = (command) => {
    switch (command) {
        case 'csv':
            exportCsv(tableData.value, t('menus.chat.chatRecord'), {
                createdAt: t('views.chat.tableHeader.createdAt'),
                entityId: t('views.chat.tableHeader.entityId'),
                senderName: t('views.chat.tableHeader.senderName'),
                chatType: t('views.chat.tableHeader.chatType'),
                message: t('views.chat.tableHeader.message'),
                playerId: t('views.chat.tableHeader.playerId'),
            });
            break;
        case 'json':
            exportJson(tableData.value, t('menus.chat.chatRecord'));
            break;
    }
};

const deleteRequest = async (row) => {
    return await api.deleteChatRecordByIds({ ids: [row.id] });
};

const batchDeleteRequest = async (rows) => {
    return await api.deleteChatRecordByIds({ ids: rows.map((i) => i.id) });
};

const handleDeleteAll = async () => {
    try {
        if (await myconfirm(t('global.message.deleteConfirm'))) {
            await api.deleteChatRecordByIds({ deleteAll: true });
            await getData();
        }
    } catch {}
};

const handleSortChange = async ({ prop, order }) => {
    searchFormModel.order = prop;
    searchFormModel.desc = order === 'descending';
};
</script>
