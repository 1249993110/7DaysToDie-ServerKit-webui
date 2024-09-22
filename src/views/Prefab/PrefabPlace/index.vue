<template>
    <div class="prefabPlace">
        <RouterButton :names="['prefab.prefabPlace']"></RouterButton>
        <el-card shadow="always" class="card">
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" :rules="rules" ref="formRef" label-width="250px" status-icon>
                        <el-form-item :label="t('views.prefab.prefabPath')" prop="prefabPath">
                            <el-input v-model="formModel.prefabPath" />
                            <el-button style="margin-top: 4px" @click="availablePrefabSelectorVisible = true">{{ t('global.button.select') }}</el-button>
                        </el-form-item>
                        <el-form-item :label="t('views.prefab.position')" prop="position">
                            <Coordinate v-model="formModel.position" />
                        </el-form-item>
                        <el-form-item :label="t('views.prefab.rotation')" prop="rotation">
                            <RotationSelector v-model="formModel.rotation" />
                        </el-form-item>
                        <el-form-item :label="t('views.prefab.noSleepers')" prop="noSleepers">
                            <el-switch v-model="formModel.noSleepers" />
                        </el-form-item>
                        <el-form-item :label="t('views.prefab.addToRWG')" prop="addToRWG">
                            <el-switch v-model="formModel.addToRWG" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="place">{{ t('views.prefab.place') }}</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div>{{ t('views.prefab.history') }}</div>
                <el-table :data="tableData" border highlight-current-row v-loading="loading">
                    <el-table-column prop="id" :label="t('views.prefab.id')" width="100px"> </el-table-column>
                    <el-table-column prop="prefabName" :label="t('views.prefab.prefabName')" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="position" :label="t('views.prefab.position')" show-overflow-tooltip>
                        <template #default="{ row }">
                            {{ formatPosition(row.position) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createdAt" :label="t('views.prefab.createdAt')" show-overflow-tooltip> </el-table-column>
                    <el-table-column align="center" width="200px" :label="t('global.button.undo')">
                        <template #default="{ row }">
                            <el-button :disabled="row.id !== 0" type="primary" @click="handleUndo(row)">{{ t('global.button.undo') }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-scrollbar>
        </el-card>
        <AvailablePrefabSelector v-model="availablePrefabSelectorVisible" @onSelect="handleSelect" />
    </div>
</template>

<script>
export default {
    name: 'prefab.prefabPlace',
};
</script>

<script setup>
import * as api from '~/api/prefab';
import { formatPosition } from '~/utils/formatHelper';

const { t } = useI18n();

const formModel = reactive({
    rotation: 0,
});
const formRef = ref();
const loading = ref(false);
const rules = {
    prefabPath: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    position: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    rotation: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
};

const availablePrefabSelectorVisible = ref(false);
const handleSelect = (row) => {
    formModel.prefabPath = row.fullPath;
    availablePrefabSelectorVisible.value = false;
};

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
    try {
        loading.value = true;
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
        const msg = result.join('\n');
        ElNotification({
            title: t('global.message.cmdExecResult'),
            type: 'info',
            message: h('i', { style: 'color: teal' }, msg),
        });

        await getHistory();
    }
};

const place = async () => {
    try {
        loading.value = true;
        await formRef.value.validate();
        const result = await api.placePrefab({
            prefabFileName: formModel.prefabPath,
            position: parsePosition(formModel.position),
            rotation: formModel.rotation,
            noSleepers: formModel.noSleepers,
            addToRWG: formModel.addToRWG,
        });

        const msg = result.join('\n');
        ElNotification({
            title: t('global.message.cmdExecResult'),
            type: 'info',
            message: h('i', { style: 'color: teal' }, msg),
        });
    } catch {
    } finally {
        loading.value = false;
    }

    await getHistory();
};
</script>

<style scoped lang="scss">
.prefabPlace {
    .card {
        height: 100%;
        margin-top: 20px;
        background-color: #ffffffaf;
        :deep(.el-card__body) {
            height: calc(100% - 40px);
        }
    }
}
</style>
