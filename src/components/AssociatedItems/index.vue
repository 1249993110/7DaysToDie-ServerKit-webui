<template>
    <el-dialog :title="t('components.associatedItems.title')" draggable append-to-body align-center :close-on-click-modal="false" width="1000px">
        <div style="margin-bottom: 8px">
            <el-button type="primary" @click="handleAdd">{{ t('components.associatedItems.add') }}</el-button>
            <el-button color="#626aef" @click="handleAddFromList">{{ t('components.associatedItems.addFromList') }}</el-button>
            <el-button type="danger" @click="handleBatchDelete" :disabled="batchDeleteDisabled">{{ t('global.button.batchDelete') }}</el-button>
        </div>
        <el-table :data="tableData" border height="calc(64vh)" highlight-current-row v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="42" />
            <!-- <el-table-column prop="id" label="Id" width="80px"> </el-table-column> -->
            <el-table-column :label="t('views.listManagement.tableHeader.icon')" width="65px" class-name="table-icon-col">
                <template #default="{ row }">
                    <GameIcon :name="row.itemName" :size="40" />
                </template>
            </el-table-column>
            <el-table-column prop="itemName" :label="t('views.listManagement.tableHeader.itemName')" sortable show-overflow-tooltip />
            <el-table-column prop="count" :label="t('views.listManagement.tableHeader.count')" sortable width="100px" />
            <el-table-column prop="quality" :label="t('views.listManagement.tableHeader.quality')" sortable width="100px" />
            <el-table-column prop="durability" :label="t('views.listManagement.tableHeader.durability')" sortable width="115px" />
            <el-table-column prop="description" :label="t('views.listManagement.tableHeader.description')" show-overflow-tooltip />
            <el-table-column :label="t('views.listManagement.operate')" align="center" width="120px">
                <template #default="{ row }">
                    <el-button type="danger" @click="handleDelete(row)">{{ t('global.button.delete') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <MyFormDialog ref="addEditDialogRef" :title="t('global.button.add') + ' ' + t('menus.listManagement.itemList')" :fields="addFormFields" :form-model="addFormModel" :request="requestAdd" @submit="handleAddConfirm" />
        <ItemListSelector v-model="itemListSelectorVisible" @select="handleSelectItemList" :disabled-ids="tableData.map((i) => i.id)" />
    </el-dialog>
</template>

<script setup>
import * as api from '~/api/item-list';
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
    const item = await api.getItemById(id);
    tableData.value.push(item);
    emit(
        'edit',
        tableData.value.map((i) => i.id)
    );
};

const itemListSelectorVisible = ref(false);
const handleAddFromList = () => {
    itemListSelectorVisible.value = true;
};

const handleSelectItemList = (rows) => {
    itemListSelectorVisible.value = false;
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
        type: 'ItemBlockSelector',
        name: 'itemName',
        label: t('views.listManagement.tableHeader.itemName'),
        required: true,
        props: {
            onSelect: (row) => {
                addFormModel.description = row.localizationName;
            },
        },
    },
    {
        type: 'input-number',
        name: 'count',
        label: t('views.listManagement.tableHeader.count'),
        required: true,
        default: 1,
        props: {
            min: 1,
            max: 1000000,
        },
    },
    {
        type: 'input-number',
        name: 'quality',
        label: t('views.listManagement.tableHeader.quality'),
        default: 1,
        props: {
            min: 0,
        },
    },
    {
        type: 'input-number',
        name: 'durability',
        label: t('views.listManagement.tableHeader.durability'),
        default: 100,
        props: {
            min: 0,
            max: 100,
        },
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
    return await api.addItem(addFormModel);
};
</script>
