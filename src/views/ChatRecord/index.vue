<template>
    <div>
        <RouterButton
            :buttons="[
                {
                    value: '实时聊天',
                    path: '/chat/live-chat',
                },
                {
                    value: '聊天记录',
                    path: '/chat/chat-record',
                },
            ]"
        >
        </RouterButton>
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
            tableSize="small"
            :pageSize="100"
        >
            <template #searchFormItems>
                <el-form-item label="关键词" prop="keyword">
                    <el-input v-model="searchFormModel.keyword" style="width: 400px" placeholder="请输入内容" clearable autofocus></el-input>
                </el-form-item>
            </template>
            <template #toolbarPost>
                <el-button @click="handleDeleteAll" type="danger">删除所有记录</el-button>
            </template>
            <template #columns>
                <el-table-column prop="createdAt" label="日期" width="165" sortable="custom"> </el-table-column>
                <el-table-column prop="senderName" label="发送者名称" width="180" show-overflow-tooltip> </el-table-column>
                <el-table-column prop="chatType" label="类型" width="80" :formatter="formatChatType"> </el-table-column>
                <el-table-column prop="message" label="消息内容" min-width="120" show-overflow-tooltip> </el-table-column>
                <el-table-column prop="entityId" label="实体Id" width="90"> </el-table-column>
                <el-table-column prop="playerId" label="玩家Id" width="280" show-overflow-tooltip> </el-table-column>
            </template>
        </MyTableEx>
    </div>
</template>
<script>
export default {
    name: 'ChatRecord',
};
</script>
<script setup>
import * as api from '~/api/chat-record';
import * as fileHelper from '~/utils/file-helper';
import myconfirm from '~/utils/myconfirm';

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
            type = '公屏';
            break;
        // Friends
        case 'Friends':
            type = '好友';
            break;
        // Party
        case 'Party':
            type = '阵营';
            break;
        // Whisper
        case 'Whisper':
            type = '私聊';
            break;
        // Unknown
        default:
            type = '未知';
    }
    return type;
};

const handleExport = (command) => {
    switch (command) {
        case 'csv':
            fileHelper.exportCsv(tableData.value, '聊天记录', {
                createdAt: '日期',
                entityId: '实体Id',
                senderName: '发送者名称',
                chatType: '类型',
                message: '消息内容',
                playerId: '玩家Id',
            });
            break;
        case 'json':
            fileHelper.exportJson(tableData.value, '聊天记录');
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
        if (await myconfirm('确定删除所有记录吗?')) {
            await api.deleteChatRecordByIds({ deleteAll: true });
            await getData();
        }
    } catch {}
};

const handleSortChange = async ({ prop, order }) => {
    searchFormModel.order = prop;
    searchFormModel.desc = order === 'descending';
    await getData();
};
</script>
