<template>
    <div class="prefabPlace">
        <RouterButton :names="['prefab.prefabPlace']" />
        <el-card class="card" shadow="always">
            <el-scrollbar always height="calc(100vh - 200px)">
                <ProForm
                    class="form"
                    label-position="left"
                    :fields="fields"
                    :col-span="24"
                    :label-width="180"
                    :model="formModel"
                    :btn-group="btnGroup"
                    :request="place"
                    :custom-components="customComponents"
                />
                <div class="table">
                    <el-text style="color: green">{{ t('views.prefab.history') }}</el-text>
                    <el-table :data="tableData" border highlight-current-row v-loading="loading">
                        <el-table-column prop="id" :label="t('views.prefab.id')" width="100px" />
                        <el-table-column prop="prefabName" :label="t('views.prefab.prefabName')" show-overflow-tooltip />
                        <el-table-column prop="position" :label="t('views.prefab.position')" show-overflow-tooltip>
                            <template #default="{ row }">
                                {{ formatPosition(row.position) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="createdAt" :label="t('views.prefab.createdAt')" width="160px" />
                        <el-table-column align="center" width="200px" :label="t('global.button.undo')">
                            <template #default="{ row }">
                                <el-button :disabled="row.id !== 0" type="primary" @click="handleUndo(row)">{{ t('global.button.undo') }}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-scrollbar>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'prefab.prefabPlace',
};
</script>

<script setup>
import * as api from '~/api/prefab';
import customComponents from '~/utils/customComponents';
import { formatPosition } from '~/utils/formatHelper';

const { t } = useI18n();

const formModel = reactive({
    rotation: 0,
});

const btnGroup = computed(() => ({
    submit: {
        label: t('views.prefab.place'),
        visible: true,
    },
    reset: {
        visible: false,
    },
}));

const fields = computed(() => [
    {
        type: 'AvailablePrefabSelector',
        name: 'prefabPath',
        label: t('views.prefab.prefabPath'),
        required: true,
    },
    {
        type: 'Coordinate',
        name: 'position',
        label: t('views.prefab.position'),
        required: true,
    },
    {
        type: 'RotationSelector',
        name: 'rotation',
        label: t('views.prefab.rotation'),
    },
    {
        type: 'switch',
        name: 'noSleepers',
        label: t('views.prefab.noSleepers'),
    },
    {
        type: 'switch',
        name: 'addToRWG',
        label: t('views.prefab.addToRWG'),
    },
]);

const loading = ref(false);

const parsePosition = (val) => {
    const split = val.split(' ');
    return {
        x: parseInt(split[0]),
        y: parseInt(split[1]),
        z: parseInt(split[2]),
    };
};

const tableData = ref([]);
const getHistory = async () => {
    loading.value = true;
    try {
        const data = await api.getUndoHistory();
        tableData.value = data;
    } finally {
        loading.value = false;
    }
};
getHistory();

const handleUndo = async (row) => {
    if (await myconfirm(t('views.prefab.undoConfirm'))) {
        const result = await api.undoPrefab(row.id);
        showCmdExecResult(result);
        await getHistory();
    }
};

const place = async () => {
    const result = await api.placePrefab({
        prefabFileName: formModel.prefabPath,
        position: parsePosition(formModel.position),
        rotation: formModel.rotation,
        noSleepers: formModel.noSleepers,
        addToRWG: formModel.addToRWG,
    });
    showCmdExecResult(result);
    await getHistory();
};

const globalStore = useGlobalStore();
const paddingRight = computed(() => (globalStore.isSmallScreen ? '20px' : 'calc(12vw + 20px)'));
</script>

<style scoped lang="scss">
.prefabPlace {
    .card {
        margin-top: 20px;
        .form {
            padding-left: 20px;
            padding-right: v-bind(paddingRight);
        }
        .table {
            padding-left: 20px;
            padding-right: v-bind(paddingRight);
        }
    }
}
</style>
