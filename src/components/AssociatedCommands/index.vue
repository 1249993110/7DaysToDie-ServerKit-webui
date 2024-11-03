<template>
    <el-dialog :title="t('components.associatedCommands.title')" draggable append-to-body align-center :close-on-click-modal="false" width="1000px">
        <div style="margin-bottom: 8px">
            <el-button type="primary" @click="handleAdd">{{ t('components.associatedCommands.add') }}</el-button>
            <el-button color="#626aef" @click="handleAddFromList">{{ t('components.associatedCommands.addFromList') }}</el-button>
            <el-button type="danger" @click="handleBatchDelete" :disabled="batchDeleteDisabled">{{ t('global.button.batchDelete') }}</el-button>
        </div>
        <el-table :data="tableData" border height="calc(64vh)" highlight-current-row v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="42" />
            <!-- <el-table-column prop="id" label="Id" width="80px"> </el-table-column> -->
            <el-table-column prop="command" :label="t('views.listManagement.tableHeader.command')" show-overflow-tooltip />
            <el-table-column :label="t('views.listManagement.tableHeader.inMainThread')" width="150px" sortable>
                <template #default="{ row }">
                    {{ `${row.inMainThread ? t('global.true') : t('global.false')}` }}
                </template>
            </el-table-column>
            <el-table-column prop="description" :label="t('views.listManagement.tableHeader.description')" show-overflow-tooltip />
            <el-table-column :label="t('views.listManagement.operate')" align="center" width="120px">
                <template #default="{ row }">
                    <el-button type="danger" @click="handleDelete(row)">{{ t('global.button.delete') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <MyFormDialog ref="addEditDialogRef" :title="t('global.button.add') + ' ' + t('menus.listManagement.commandList')" :fields="addFormFields" :form-model="addFormModel" :request="requestAdd" @submit="handleAddConfirm" />
        <CommandListSelector v-model="commandListSelectorVisible" @on-select="handleSelectCommandList" :disabled-ids="tableData.map((i) => i.id)" />
    </el-dialog>
</template>

<script setup>
import * as api from '~/api/command-list';
import { i18n } from '~/plugins/i18n';
const { t } = i18n.global;

const props = defineProps({
    tableData: {
        type: Array,
    },
    loading: {
        type: Boolean,
    },
});

const emit = defineEmits(['update:tableData', 'edit']);
const { tableData } = useVModels(props, emit);

const batchDeleteDisabled = ref(true);
let multipleSelection = [];
const handleSelectionChange = (val) => {
    multipleSelection = val;
    batchDeleteDisabled.value = multipleSelection.length === 0;
};

const addEditDialogRef = ref(null);
const handleAdd = () => {
    addEditDialogRef.value.open();
};

const handleAddConfirm = async (id) => {
    const cmd = await api.getCommandById(id);
    tableData.value.push(cmd);
    emit(
        'edit',
        tableData.value.map((i) => i.id)
    );
};

const commandListSelectorVisible = ref(false);
const handleAddFromList = () => {
    commandListSelectorVisible.value = true;
};

const handleSelectCommandList = (rows) => {
    commandListSelectorVisible.value = false;
    const data = [...tableData.value, ...rows];
    emit(
        'edit',
        data.map((i) => i.id)
    );
    tableData.value = data;
};

const handleDelete = (row) => {
    const data = tableData.value.filter((i) => i.id !== row.id);
    emit(
        'edit',
        data.map((i) => i.id)
    );
    tableData.value = data;
};

const handleBatchDelete = () => {
    const ids = multipleSelection.map((i) => i.id);
    const data = tableData.value.filter((i) => !ids.includes(i.id));
    emit(
        'edit',
        data.map((i) => i.id)
    );
    tableData.value = data;
};

const addFormModel = reactive({});
const addFormFields = computed(() => [
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

const requestAdd = async () => {
    return await api.addCommand(addFormModel);
};
</script>
