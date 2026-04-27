<template>
    <div>
        <RouterButton :names="['globalSettings.settings', 'globalSettings.zombieKillReward']" />

        <el-card shadow="always" style="margin-top: 20px" v-loading="loading">
            <template #header><span>{{ t('views.globalSettings.killZombieTrigger.isEnableds') }}</span></template>
            <el-form label-position="left" :label-width="200">
                <div style="display: flex; gap: 40px; flex-wrap: wrap;">
                    <el-form-item :label="t('views.globalSettings.killZombieTrigger.isEnabled')" style="margin-bottom: 0;">
                        <el-switch v-model="settings.killZombieTrigger.isEnabled" />
                    </el-form-item>
                    <el-form-item :label="t('views.zombieKillReward.isEnableKillNotification')" style="margin-bottom: 0;">
                        <el-switch v-model="settings.killZombieTrigger.isEnableKillNotification" />
                    </el-form-item>
                    <el-form-item :label="t('views.globalSettings.deathTrigger.isEnabled')" style="margin-bottom: 0;">
                        <el-switch v-model="settings.deathTrigger.isEnabled" />
                    </el-form-item>
                    <el-form-item :label="t('views.globalSettings.deathTrigger.isEnableDeathNotification')" style="margin-bottom: 0;">
                        <el-switch v-model="settings.deathTrigger.isEnableDeathNotification" />
                    </el-form-item>
                </div>
            </el-form>
        </el-card>

        <el-card shadow="always" style="margin-top: 16px">
            <template #header>
                <span>{{ t('views.zombieKillReward.addReward') }}</span>
            </template>
            <el-form :model="addForm" label-position="left" :label-width="160" inline>
                <el-form-item :label="t('views.zombieKillReward.zombieName')">
                    <el-autocomplete v-model="addForm.entityClassName" :fetch-suggestions="fetchZombieSuggestions"
                        :placeholder="t('views.zombieKillReward.searchZombie')" clearable style="width: 280px" :debounce="200">
                        <template #default="{ item }">
                            <span>{{ item.label }}</span>
                        </template>
                    </el-autocomplete>
                </el-form-item>
                <el-form-item :label="t('views.zombieKillReward.rewardPoints')">
                    <el-input-number v-model="addForm.rewardPoints" :min="0" controls-position="right" style="width: 160px" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">{{ t('global.button.add') }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card shadow="always" style="margin-top: 16px" v-loading="loading">
            <template #header>
                <div style="display: flex; align-items: center; justify-content: space-between">
                    <span>
                        {{ t('views.zombieKillReward.rewardList') }}
                        <el-tag type="info" style="margin-left: 8px">{{ settings.killZombieTrigger.zombieRewards.length }}</el-tag>
                    </span>
                    <el-button type="primary" @click="saveSettings" :loading="saving">{{ t('global.button.save') }}</el-button>
                </div>
            </template>
            <el-table :data="settings.killZombieTrigger.zombieRewards" border size="small">
                <el-table-column type="index" width="60" align="center" />
                <el-table-column :label="t('views.zombieKillReward.localizationName')" min-width="150">
                    <template #default="{ row }">
                        <span v-if="row.entityClassName === '*'">—</span>
                        <span v-else>{{ getLocalizationName(row.entityClassName) }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.zombieKillReward.zombieName')" min-width="200">
                    <template #default="{ row }">
                        <el-tag v-if="row.entityClassName === '*'" type="warning" size="small">{{ t('views.zombieKillReward.globalEntry') }}</el-tag>
                        <span v-else>{{ row.entityClassName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rewardPoints" :label="t('views.zombieKillReward.rewardPoints')" width="130" align="center" />
                <el-table-column :label="t('global.button.edit')" width="80" align="center">
                    <template #default="{ row, $index }">
                        <el-button size="small" type="primary" plain @click="handleEdit(row, $index)">{{ t('global.button.edit') }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column :label="t('global.button.delete')" width="80" align="center">
                    <template #default="{ row, $index }">
                        <el-button size="small" type="danger" plain @click="handleDelete($index)" :disabled="row.entityClassName === '*'">
                            {{ t('global.button.delete') }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-card shadow="always" style="margin-top: 16px" v-loading="loading">
            <template #header>
                <div style="display: flex; align-items: center; justify-content: space-between">
                    <span>{{ t('views.zombieKillReward.deathPenaltyPoints') }}</span>
                    <el-button type="primary" @click="saveSettings" :loading="saving">{{ t('global.button.save') }}</el-button>
                </div>
            </template>
            <el-table :data="[settings.deathTrigger]" border size="small">
                <el-table-column :label="t('views.globalSettings.deathTrigger.isEnabled')" width="200" align="center">
                    <template #default>
                        <el-tag :type="settings.deathTrigger.isEnabled ? 'success' : 'info'" size="small">
                            {{ settings.deathTrigger.isEnabled ? t('global.button.enable') : t('global.button.disable') }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('views.zombieKillReward.deathPenaltyPoints')" min-width="150" align="center">
                    <template #default>
                        <span>{{ settings.deathTrigger.deathPenaltyPoints }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('global.button.edit')" width="80" align="center">
                    <template #default>
                        <el-button size="small" type="primary" plain @click="handleEditDeathPenalty">{{ t('global.button.edit') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="editDialogVisible" :title="t('views.zombieKillReward.editReward')"
            width="400px" append-to-body draggable>
            <el-form :model="editForm" label-width="120px">
                <el-form-item :label="t('views.zombieKillReward.zombieName')">
                    <el-tag v-if="editForm.entityClassName === '*'" type="warning">{{ t('views.zombieKillReward.globalEntry') }}</el-tag>
                    <el-input v-else v-model="editForm.entityClassName" disabled />
                </el-form-item>
                <el-form-item :label="t('views.zombieKillReward.rewardPoints')">
                    <el-input-number v-model="editForm.rewardPoints" :min="0" controls-position="right" style="width: 100%" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editDialogVisible = false">{{ t('global.button.cancel') }}</el-button>
                <el-button type="primary" @click="handleEditConfirm">{{ t('global.button.confirm') }}</el-button>
            </template>
        </el-dialog>

        <el-dialog v-model="deathPenaltyDialogVisible" :title="t('views.zombieKillReward.editDeathPenalty')"
            width="400px" append-to-body draggable>
            <el-form :model="deathPenaltyForm" label-width="120px">
                <el-form-item :label="t('views.zombieKillReward.deathPenaltyPoints')">
                    <el-input-number v-model="deathPenaltyForm.deathPenaltyPoints" :min="0" controls-position="right" style="width: 100%" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="deathPenaltyDialogVisible = false">{{ t('global.button.cancel') }}</el-button>
                <el-button type="primary" @click="handleDeathPenaltyConfirm">{{ t('global.button.confirm') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
export default { name: 'globalSettings.zombieKillReward' };
</script>

<script setup>
import { getSettings, updateSettings } from '~/api/settings';
import { getZombieEntityClasses } from '~/api/server';

const { t } = useI18n();
const localeStore = useLocaleStore();
const loading = ref(false);
const saving = ref(false);
const allZombieClasses = ref([]);
const GLOBAL_ENTRY = '*';

const settings = reactive({
    killZombieTrigger: { isEnabled: false, isEnableKillNotification: false, executeCommands: [], zombieRewards: [] },
    deathTrigger: { isEnabled: false, isEnableDeathNotification: false, deathPenaltyPoints: 0 },
});

const ensureGlobalEntry = (rewards) => {
    if (!rewards.some((r) => r.entityClassName === GLOBAL_ENTRY)) {
        rewards.unshift({ entityClassName: GLOBAL_ENTRY, rewardPoints: 1, executeCommands: [] });
    }
    return rewards;
};

const loadSettings = async () => {
    loading.value = true;
    try {
        const data = await getSettings('GlobalSettings', localeStore.getLanguage());
        if (data.killZombieTrigger) {
            settings.killZombieTrigger.isEnabled = data.killZombieTrigger.isEnabled ?? false;
            settings.killZombieTrigger.isEnableKillNotification = data.killZombieTrigger.isEnableKillNotification ?? false;
            settings.killZombieTrigger.executeCommands = data.killZombieTrigger.executeCommands ?? [];
            const rewards = (data.killZombieTrigger.zombieRewards ?? []).map((r) => ({
                entityClassName: r.entityClassName,
                rewardPoints: r.rewardPoints,
                executeCommands: r.executeCommands ?? [],
            }));
            settings.killZombieTrigger.zombieRewards = ensureGlobalEntry(rewards);
        }
        if (data.deathTrigger) {
            settings.deathTrigger.isEnabled = data.deathTrigger.isEnabled ?? false;
            settings.deathTrigger.isEnableDeathNotification = data.deathTrigger.isEnableDeathNotification ?? false;
            settings.deathTrigger.deathPenaltyPoints = data.deathTrigger.deathPenaltyPoints ?? 0;
        }
    } finally { loading.value = false; }
};

const loadZombieClasses = async () => {
    try { allZombieClasses.value = await getZombieEntityClasses(localeStore.getLanguage()); } catch { allZombieClasses.value = []; }
};

const getLocalizationName = (entityClassName) => {
    const found = allZombieClasses.value.find((item) => item.entityClassName === entityClassName);
    return found?.localizationName || entityClassName;
};

const fetchZombieSuggestions = (query, callback) => {
    const q = (query || '').toLowerCase();
    const results = allZombieClasses.value
        .filter((item) => {
            const cn = item.entityClassName.toLowerCase();
            const ln = (item.localizationName || '').toLowerCase();
            return cn.includes(q) || ln.includes(q);
        })
        .slice(0, 30)
        .map((item) => ({
            value: item.entityClassName,
            label: item.localizationName ? `${item.localizationName}  (${item.entityClassName})` : item.entityClassName,
        }));
    callback(results);
};

const saveSettings = async () => {
    saving.value = true;
    try {
        const fullData = await getSettings('GlobalSettings', localeStore.getLanguage());
        fullData.killZombieTrigger = {
            isEnabled: settings.killZombieTrigger.isEnabled,
            isEnableKillNotification: settings.killZombieTrigger.isEnableKillNotification,
            executeCommands: settings.killZombieTrigger.executeCommands,
            zombieRewards: settings.killZombieTrigger.zombieRewards,
        };
        fullData.deathTrigger = {
            isEnabled: settings.deathTrigger.isEnabled,
            isEnableDeathNotification: settings.deathTrigger.isEnableDeathNotification,
            deathPenaltyPoints: settings.deathTrigger.deathPenaltyPoints,
        };
        await updateSettings('GlobalSettings', fullData);
        ElMessage.success(t('global.message.saveSuccess'));
    } catch { ElMessage.error(t('global.message.saveFailed')); }
    finally { saving.value = false; }
};

const addForm = reactive({ entityClassName: '', rewardPoints: 0 });

const handleAdd = () => {
    if (!addForm.entityClassName.trim()) { ElMessage.warning(t('views.zombieKillReward.inputZombieName')); return; }
    if (addForm.entityClassName.trim() === GLOBAL_ENTRY) { ElMessage.warning(t('views.zombieKillReward.alreadyExists')); return; }
    if (settings.killZombieTrigger.zombieRewards.some((r) => r.entityClassName === addForm.entityClassName.trim())) {
        ElMessage.warning(t('views.zombieKillReward.alreadyExists')); return;
    }
    settings.killZombieTrigger.zombieRewards.push({
        entityClassName: addForm.entityClassName.trim(),
        rewardPoints: addForm.rewardPoints,
        executeCommands: [],
    });
    addForm.entityClassName = '';
    addForm.rewardPoints = 0;
};

const handleDelete = (index) => {
    if (settings.killZombieTrigger.zombieRewards[index]?.entityClassName === GLOBAL_ENTRY) return;
    settings.killZombieTrigger.zombieRewards.splice(index, 1);
};

const editDialogVisible = ref(false);
const editForm = reactive({ entityClassName: '', rewardPoints: 0 });
let editIndex = -1;

const handleEdit = (row, index) => {
    editIndex = index;
    editForm.entityClassName = row.entityClassName;
    editForm.rewardPoints = row.rewardPoints;
    editDialogVisible.value = true;
};

const handleEditConfirm = () => {
    if (editIndex >= 0) {
        settings.killZombieTrigger.zombieRewards[editIndex] = {
            entityClassName: editForm.entityClassName,
            rewardPoints: editForm.rewardPoints,
            executeCommands: [],
        };
    }
    editDialogVisible.value = false;
};

const deathPenaltyDialogVisible = ref(false);
const deathPenaltyForm = reactive({ deathPenaltyPoints: 0 });

const handleEditDeathPenalty = () => {
    deathPenaltyForm.deathPenaltyPoints = settings.deathTrigger.deathPenaltyPoints;
    deathPenaltyDialogVisible.value = true;
};

const handleDeathPenaltyConfirm = () => {
    settings.deathTrigger.deathPenaltyPoints = deathPenaltyForm.deathPenaltyPoints;
    deathPenaltyDialogVisible.value = false;
};

onMounted(() => { loadSettings(); loadZombieClasses(); });
</script>
