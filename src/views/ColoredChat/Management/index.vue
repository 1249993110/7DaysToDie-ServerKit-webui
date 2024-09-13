<template>
    <div>
        <RouterButton :names="['coloredChat.settings', 'coloredChat.management']"></RouterButton>
        <MyTableEx
            style="margin-top: 20px"
            :show-export-btn="false"
            :show-searcher="false"
            :show-table-index="false"
            :show-pager="false"
            :get-data="getData"
            :table-data="tableData"
            :show-add-btn="true"
            :show-edit-btn="true"
            :delete="deleteRequest"
            :batch-delete="batchDeleteRequest"
            :add-or-edit-component="AddOrEditColoredChat"
        >
            <template #columns>
                <el-table-column prop="id" :label="t('views.coloredChat.tableHeader.playerId')" sortable> </el-table-column>
                <el-table-column prop="nameColor" :label="t('views.coloredChat.tableHeader.nameColor')" sortable>
                    <template #default="{ row }">
                        <span class="tableColColor">
                            <div :style="{ backgroundColor: '#' + row.nameColor }"></div>
                            {{ row.nameColor }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="textColor" :label="t('views.coloredChat.tableHeader.textColor')" sortable>
                    <template #default="{ row }">
                        <span class="tableColColor">
                            <div :style="{ backgroundColor: '#' + row.textColor }"></div>
                            {{ row.textColor }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" :label="t('views.coloredChat.tableHeader.createdAt')" sortable> </el-table-column>
                <el-table-column prop="description" :label="t('views.coloredChat.tableHeader.description')" show-overflow-tooltip> </el-table-column>
            </template>
        </MyTableEx>
    </div>
</template>

<script>
export default {
    name: 'coloredChat.management',
};
</script>

<script setup>
import * as api from '~/api/coloredChat.js';
import AddOrEditColoredChat from './AddOrEditColoredChat.vue';

const { t } = useI18n();
const tableData = ref([]);

const getData = async () => {
    const data = await api.getColoredChat();
    tableData.value = data;
};

const deleteRequest = async (row) => {
    return await api.deleteColoredChatByIds({ ids: [row.id] });
};

const batchDeleteRequest = async (rows) => {
    return await api.deleteColoredChatByIds({ ids: rows.map((i) => i.id) });
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
