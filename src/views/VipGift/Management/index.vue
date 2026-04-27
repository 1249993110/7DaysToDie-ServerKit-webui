<template>
    <div>
        <RouterButton :names="['vipGift.settings', 'vipGift.management']" />
        <MyTable
            ref="myTableRef"
            row-key="id"
            :columns="columns"
            :model-name="rt(tm('menus.vipGift')[''])"
            :toolbar="toolbar"
            :search="search"
            :add-edit-form-fields="addEditFormFields"
            :add-edit-label-width="150"
            :request="request"
        >
            <template #bindCell="{ row }">
                <el-button size="small" color="#40e0d0" @click="handleAssociatedItem(row)">{{ t('views.vipGift.tableHeader.bindItem') }}</el-button>
                <el-button size="small" color="#8a2be2" @click="handleAssociatedCommand(row)">{{ t('views.vipGift.tableHeader.bindCmd') }}</el-button>
            </template>
        </MyTable>
        <AssociatedItems v-model="associatedItemsVisible" v-model:table-data="associatedData" :loading="associatedLoading" @edit="handleItemsEdit" />
        <AssociatedCommands v-model="associatedCommandsVisible" v-model:table-data="associatedData" :loading="associatedLoading" @edit="handleCommandsEdit" />
        <CsvImportDialog
            v-model:visible="csvImportVisible"
            module-type="vipGift"
            :import-api="api.importVipGiftCsv"
            :template-api="api.downloadVipGiftTemplate"
            @success="handleImportSuccess"
        />
    </div>
</template>

<script>
export default {
    name: 'vipGift.management',
};
</script>

<script setup>
import * as api from '~/api/vip-gift';
import { getHistoryPlayerIds } from '~/api/players';

const { t, tm, rt } = useI18n();

const columns = computed(() => [
    {
        type: 'selection',
    },
    {
        prop: 'id',
        label: t('views.vipGift.tableHeader.playerId'),
        minWidth: 200,
        sortable: 'custom',
    },
    {
        prop: 'playerName',
        label: t('views.vipGift.tableHeader.playerName'),
        minWidth: 100,
        sortable: 'custom',
    },
    {
        prop: 'name',
        label: t('views.vipGift.tableHeader.name'),
        minWidth: 100,
        sortable: 'custom',
        align: 'center',
        tag: true,
    },
    {
        prop: 'claimState',
        label: t('views.vipGift.tableHeader.claimState'),
        width: 120,
        sortable: 'custom',
        align: 'center',
        formatter: (row) => (row.claimState ? t('global.true') : t('global.false')),
    },
    {
        prop: 'totalClaimCount',
        label: t('views.vipGift.tableHeader.totalClaimCount'),
        width: 120,
        sortable: 'custom',
        align: 'center',
    },
    {
        prop: 'lastClaimAt',
        label: t('views.vipGift.tableHeader.lastClaimAt'),
        sortable: 'custom',
        minWidth: 120,
    },
    {
        prop: 'description',
        label: t('views.vipGift.tableHeader.description'),
        sortable: 'custom',
        minWidth: 150,
    },
    {
        prop: 'bind',
        label: t('views.vipGift.tableHeader.bind'),
        width: 260,
        headerAlign: 'center',
    },
    {
        type: 'operation',
        minWidth: 200,
    },
]);

const myTableRef = ref(null);
const toolbar = computed(() => ({
    batchOperationItems: [
        {
            label: t('views.vipGift.resetAll'),
            onClick: async () => {
                try {
                    if (await myconfirm(t('views.vipGift.resetAllConfirm'))) {
                        await api.deleteVipGiftByIds([], true);
                        await myTableRef.value.refresh();
                    }
                } catch {}
            },
        },
        {
            type: 'export',
            label: t('global.button.export') + ' CSV',
            fileName: rt(tm('menus.vipGift')['']),
            divided: true,
            onClick: async () => {
                const loading = ElLoading.service({ lock: true, text: 'Loading', background: 'rgba(0, 0, 0, 0.7)' });
                try {
                    const result = await requestGet({ pageSize: -1 });
                    const data = result.items;

                    const [itemResults, cmdResults] = await Promise.all([
                        Promise.all(data.map((row) => api.getItemList(row.id).catch(() => []))),
                        Promise.all(data.map((row) => api.getCommandList(row.id).catch(() => []))),
                    ]);

                    const exportData = data.map((row, i) => {
                        const items = itemResults[i];
                        const cmds = cmdResults[i];
                        return {
                            id: row.id,
                            playerName: row.playerName || '',
                            name: row.name,
                            claimState: row.claimState ? 'true' : 'false',
                            totalClaimCount: row.totalClaimCount,
                            lastClaimAt: row.lastClaimAt || '',
                            description: row.description || '',
                            bindItems: items.map((item) => `${item.itemName}x${item.count}`).join(', '),
                            bindCommands: cmds.map((cmd) => cmd.command).join(', '),
                        };
                    });

                    const columns = {
                        id: 'ID',
                        playerName: '玩家名称',
                        name: '名称',
                        claimState: '领取状态',
                        totalClaimCount: '总领取次数',
                        lastClaimAt: '上次领取时间',
                        description: '描述',
                        bindItems: '绑定物品',
                        bindCommands: '绑定命令',
                    };

                    exportCsv(exportData, rt(tm('menus.vipGift')['']), columns);
                } finally {
                    loading.close();
                }
            },
        },
        {
            label: t('global.button.import') + ' CSV',
            onClick: () => {
                csvImportVisible.value = true;
            },
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
const existingGiftNames = ref([]);
const handlePlayerSelect = (player) => {
    const formModel = myTableRef.value?.addEditFormModel;
    if (formModel) {
        formModel.playerName = player ? (player.playerName || '') : '';
    }
};
const addEditFormFields = computed(() => [
    {
        type: 'PlayerIdSelector',
        name: 'id',
        label: t('views.vipGift.tableHeader.playerId'),
        required: true,
        props: {
            onPlayerSelect: handlePlayerSelect,
            showSelectButton: false,
        },
    },
    {
        type: 'input',
        name: 'playerName',
        label: t('views.vipGift.tableHeader.playerName'),
    },
    {
        type: 'select-v2',
        name: 'name',
        label: t('views.vipGift.tableHeader.name'),
        required: true,
        props: {
            filterable: true,
            allowCreate: true,
            options: existingGiftNames.value,
            placeholder: t('global.message.inputText'),
        },
    },
    {
        type: 'switch',
        name: 'claimState',
        label: t('views.vipGift.tableHeader.claimState'),
    },
    {
        type: 'input-number',
        name: 'totalClaimCount',
        label: t('views.vipGift.tableHeader.totalClaimCount'),
        required: true,
        default: 0,
        props: {
            min: 0,
        },
    },
    {
        type: 'input',
        name: 'description',
        label: t('views.vipGift.tableHeader.description'),
        props: {
            type: 'textarea',
        },
    },
]);

const requestGet = async (params) => {
    const [data, players] = await Promise.all([api.getVipGift(), getHistoryPlayerIds()]);
    const playerMap = {};
    for (const p of players) {
        playerMap[p.playerId] = p.playerName;
    }
    let list = data.map((item) => ({ ...item, playerName: item.playerName || playerMap[item.id] || '' }));
    if (list.length) {
        newId.value = list[list.length - 1].id + 1;
    }

    const nameSet = new Set(data.map((item) => item.name).filter(Boolean));
    existingGiftNames.value = [...nameSet].map((name) => ({ value: name, label: name }));

    list = searchByKeyword(list, params.keyword, ['id', 'name', 'description', 'playerName']);
    if (params.sortOrder) {
        const desc = params.sortOrder === 'descending';
        const sortPorp = params.sortPorp;
        list = list.sort((a, b) => {
            if (desc) {
                return a[sortPorp] < b[sortPorp] ? 1 : -1;
            }

            return a[sortPorp] > b[sortPorp] ? 1 : -1;
        });
    }

    if (params.pageSize < 0) {
        return {
            items: list,
            total: list.length,
        };
    }
    return {
        items: list.slice((params.pageNumber - 1) * params.pageSize, params.pageNumber * params.pageSize),
        total: list.length,
    };
};

const requestAdd = async (formModel) => {
    await api.addVipGift(formModel);
};

const requestEdit = async (formModel) => {
    await api.updateVipGift(formModel.id, formModel);
};

const requestDetele = async (id) => {
    await api.deleteVipGiftById(id);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deleteVipGiftByIds(selectedIds);
};

const request = {
    get: requestGet,
    add: requestAdd,
    edit: requestEdit,
    delete: requestDetele,
    batchDelete: requestBatchDelete,
};

const lastClickId = ref(0);

const associatedItemsVisible = ref(false);
const associatedCommandsVisible = ref(false);
const associatedData = ref([]);
const associatedLoading = ref(false);

const handleAssociatedItem = async (row) => {
    associatedLoading.value = true;
    lastClickId.value = row.id;
    associatedData.value = [];
    associatedItemsVisible.value = true;
    try {
        const data = await api.getItemList(row.id);
        associatedData.value = data;
    } finally {
        associatedLoading.value = false;
    }
};

const handleItemsEdit = async (ids) => {
    await api.updateItemList(lastClickId.value, ids);
};

const handleAssociatedCommand = async (row) => {
    associatedLoading.value = true;
    lastClickId.value = row.id;
    associatedData.value = [];
    associatedCommandsVisible.value = true;
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

const csvImportVisible = ref(false);
const handleImportSuccess = () => {
    window.location.reload();
};
</script>
