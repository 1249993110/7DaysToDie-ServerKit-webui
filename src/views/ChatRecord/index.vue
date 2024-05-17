<template>
    <MyTableEx
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
    >
        <template #searchFormItems>
            <el-form-item label="关键词" prop="keyword">
                <el-input v-model="searchFormModel.keyword" style="width: 400px" placeholder="请输入内容" clearable autofocus></el-input>
            </el-form-item>
        </template>
        <template #columns>
            <el-table-column prop="createdAt" label="日期" width="165" sortable> </el-table-column>
            <el-table-column prop="entityId" label="实体Id" width="95" sortable> </el-table-column>
            <el-table-column prop="senderName" label="发送者名称" width="180" sortable> </el-table-column>
            <el-table-column prop="chatType" label="类型" width="80" sortable :formatter="format_chatType"> </el-table-column>
            <el-table-column prop="message" label="消息内容" min-width="120" sortable> </el-table-column>
            <el-table-column prop="playerId" label="玩家Id" width="215" sortable> </el-table-column>
        </template>
    </MyTableEx>
</template>
<script>
export default {
    name: 'ChatRecord',
};
</script>
<script setup>
import * as api from '~/api/chat-record';
import * as fileHelper from '~/utils/file-helper';

const searchFormModel = reactive({
    keyword: '',
});

const tableData = ref([]);
const total = ref(0);

const getData = async (pagination) => {
    const data = await api.getChatRecord({ ...pagination, ...searchFormModel });
    tableData.value = data.items;
    total.value = data.total;
};

const format_chatType = (row) => {
    let type;
    switch (row.chatType) {
        // Global
        case 0:
            type = '公屏';
            break;
        // Friends
        case 1:
            type = '好友';
            break;
        // Party
        case 2:
            type = '阵营';
            break;
        // Whisper
        case 3:
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
    return await api.deleteChatRecordById([row.id]);
};

const batchDeleteRequest = async (rows) => {
    return await api.deleteChatRecordByIds(rows.map((i) => i.id));
};
</script>
