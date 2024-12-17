<template>
    <div>
        <RouterButton :names="['taskSchedule.settings', 'taskSchedule.management']" />
        <MyTable
            ref="myTableRef"
            row-key="id"
            :columns="columns"
            :model-name="rt(tm('menus.taskSchedule')[''])"
            :toolbar="toolbar"
            :search="search"
            :add-edit-form-fields="addEditFormFields"
            :add-edit-form-rules="addEditFormRules"
            :add-edit-label-width="150"
            :request="request"
        >
            <template #bindCell="{ row }">
                <el-button size="small" color="#8a2be2" @click="handleAssociatedCommand(row)">{{ t('views.taskSchedule.tableHeader.bindCmd') }}</el-button>
            </template>
            <template #isEnabledCell="{ row }">
                <el-switch v-model="row.isEnabled" :active-value="true" :inactive-value="false" @change="handleEnable(row)" />
            </template>
        </MyTable>
        <AssociatedCommands v-model="associatedCommandsVisible" v-model:table-data="associatedData" :loading="associatedLoading" @edit="handleCommandsEdit" />
    </div>
</template>

<script>
export default {
    name: 'taskSchedule.management',
};
</script>

<script setup>
import * as api from '~/api/task-schedule';
import cron from 'cron-validate';

const { t, tm, rt } = useI18n();

const columns = computed(() => [
    {
        type: 'selection',
    },
    {
        prop: 'name',
        label: t('views.taskSchedule.tableHeader.name'),
        minWidth: 120,
        sortable: 'custom',
        tag: true,
    },
    {
        prop: 'cronExpression',
        label: t('views.taskSchedule.tableHeader.cronExpression'),
        width: 140,
    },
    {
        prop: 'isEnabled',
        label: t('views.taskSchedule.tableHeader.isEnabled'),
        width: 120,
        sortable: 'custom',
        formatter: (row) => (row.isEnabled ? t('global.true') : t('global.false')),
    },
    {
        prop: 'lastRunAt',
        label: t('views.taskSchedule.tableHeader.lastRunAt'),
        sortable: 'custom',
        width: 160,
    },
    {
        prop: 'description',
        label: t('views.taskSchedule.tableHeader.description'),
        sortable: 'custom',
        minWidth: 150,
    },
    {
        prop: 'bind',
        label: t('views.taskSchedule.tableHeader.bind'),
        width: 140,
        headerAlign: 'center',
        fixed: 'right',
    },
    {
        type: 'operation',
        width: 200,
    },
]);

const myTableRef = ref(null);
const toolbar = computed(() => ({
    batchOperationItems: [
        {
            type: 'export',
            fileName: rt(tm('menus.taskSchedule')['']),
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

const newId = ref(0);
const addEditFormFields = computed(() => [
    {
        type: 'input',
        name: 'name',
        label: t('views.taskSchedule.tableHeader.name'),
        required: true,
    },
    {
        type: 'CronSelector',
        name: 'cronExpression',
        label: t('views.taskSchedule.tableHeader.cronExpression'),
        required: true,
    },
    {
        type: 'switch',
        name: 'isEnabled',
        label: t('views.taskSchedule.tableHeader.isEnabled'),
    },
    {
        type: 'input',
        name: 'description',
        label: t('views.taskSchedule.tableHeader.description'),
        props: {
            type: 'textarea',
        },
    },
]);

const addEditFormRules = {
    cronExpression: [
        {
            validator: (rule, value, callback) => {
                const cronResult = cron(value, {
                    preset: 'aws-cloud-watch',
                    override: {
                        useSeconds: true,
                        useYears: false,
                    },
                });
                if (!cronResult.isValid()) {
                    return callback(new Error('Invalid cron expression'));
                }
                callback();
            },
            message: t('components.cronSelector.invalid'),
            trigger: 'blur',
        },
    ],
};

const requestGet = async (params) => {
    let data = await api.getTaskSchedule();
    if (data.length) {
        newId.value = data[data.length - 1].id + 1;
    }

    data = searchByKeyword(data, params.keyword, ['name', 'description']);
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
    await api.addTaskSchedule(formModel);
};

const requestEdit = async (formModel) => {
    await api.updateTaskSchedule(formModel.id, formModel);
};

const requestDetele = async (id) => {
    await api.deleteTaskScheduleById(id);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deleteTaskScheduleByIds(selectedIds);
};

const request = {
    get: requestGet,
    add: requestAdd,
    edit: requestEdit,
    delete: requestDetele,
    batchDelete: requestBatchDelete,
};

const lastClickId = ref(0);

const associatedCommandsVisible = ref(false);
const associatedData = ref([]);
const associatedLoading = ref(false);

const handleAssociatedCommand = async (row) => {
    associatedLoading.value = true;
    associatedCommandsVisible.value = true;
    lastClickId.value = row.id;
    try {
        const data = await api.getCommandList(row.id);
        associatedData.value = data;
    } finally {
        associatedLoading.value = false;
    }
};

const handleCommandsEdit = async (ids) => {
    await api.updateCommandList(lastClickId.value, ids);
};

const handleEnable = async (row) => {
    try {
        await api.updateTaskSchedule(row.id, row);
        if (row.isEnabled) {
            ElMessage.success(t('global.message.enableSuccess'));
        } else {
            ElMessage.success(t('global.message.disableSuccess'));
        }
    } catch (error) {
        if (row.isEnabled) {
            ElMessage.success(t('global.message.enableFailed') + error);
        } else {
            ElMessage.success(t('global.message.disableFailed') + error);
        }
    }
};
</script>
