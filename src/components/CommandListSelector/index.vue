<template>
    <el-dialog :title="t('components.commandListSelector.title')" draggable append-to-body align-center :close-on-click-modal="false" width="800px" @open="handleOpen">
        <div style="margin-bottom: 8px">
            <el-input v-model="searchModel.keyword" :placeholder="t('global.message.inputText')" clearable autofocus style="width: 200px"></el-input>
            <el-button :icon="Search" @click="getData" type="primary" style="margin-left: 8px">{{ t('global.button.search') }}</el-button>
            <el-button @click="handleBatchSelect" color="#40e0d0" :disabled="batchSelectDisabled">{{ t('global.button.batchSelect') }}</el-button>
        </div>
        <el-table :data="tableData" border height="calc(50vh)" highlight-current-row v-loading="loading" @selection-change="handleSelectionChange" size="small">
            <el-table-column type="selection" width="42" :selectable="checkSelectable" />
            <el-table-column prop="id" :label="t('views.listManagement.tableHeader.id')" width="60px" align="center" />
            <el-table-column prop="command" :label="t('views.listManagement.tableHeader.command')" show-overflow-tooltip>
                <template #default="{ row }">
                    <el-tag v-for="item in row.command.split('\n').filter((i) => i.trim())" type="success" style="margin-left: 4px">{{ item }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column :label="t('views.listManagement.tableHeader.inMainThread')" width="130px" sortable>
                <template #default="{ row }">
                    {{ `${row.inMainThread ? t('global.true') : t('global.false')}` }}
                </template>
            </el-table-column>
            <el-table-column prop="description" :label="t('views.listManagement.tableHeader.description')" show-overflow-tooltip />
            <el-table-column :label="t('global.button.select')" align="center" width="100px">
                <template #default="{ row }">
                    <el-button color="#40e0d0" @click="handleSelect(row)" :disabled="checkDisabled(row.id)">{{ t('global.button.select') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 10px"
            background
            @size-change="getData"
            @current-change="getData"
            :page-sizes="[5, 10, 20, 50, 100]"
            v-model:current-page="searchModel.pageNumber"
            v-model:page-size="searchModel.pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
    </el-dialog>
</template>

<script setup>
import { getCommandListPaged } from '~/api/command-list';
import { Search } from '@element-plus/icons-vue';
import { i18n } from '~/plugins/i18n';
const { t } = i18n.global;
const props = defineProps({
    disabledIds: {
        type: Array,
    },
});

const checkDisabled = (id) => {
    return props.disabledIds.some((_id) => id === _id);
};
const checkSelectable = (row) => {
    return !checkDisabled(row.id);
};

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);

const searchModel = reactive({
    pageNumber: 1,
    pageSize: 20,
    keyword: '',
});

const getData = async () => {
    try {
        loading.value = true;
        const data = await getCommandListPaged(searchModel);
        tableData.value = data.items;
        total.value = data.total;
    } finally {
        loading.value = false;
    }
};

const handleOpen = async () => {
    await getData();
};

const emit = defineEmits(['onSelect']);
const handleSelect = (row) => {
    emit('onSelect', [row]);
};

const batchSelectDisabled = ref(true);
let multipleSelection = [];
const handleSelectionChange = (val) => {
    multipleSelection = val;
    batchSelectDisabled.value = multipleSelection.length === 0;
};

const handleBatchSelect = () => {
    emit('onSelect', multipleSelection);
};
</script>
