<template>
    <div class="autobackup-settings">
        <RouterButton :names="['autobackup.settings', 'autobackup.management']"></RouterButton>
        <el-card shadow="always" class="card">
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" ref="formRef" label-width="250px" status-icon>
                        <el-form-item :label="t('views.autoBackup.isEnabled')" prop="isEnabled">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item>
                        <el-form-item :label="t('views.autoBackup.interval')" prop="interval" required>
                            <el-input-number v-model="formModel.interval" :min="10" />
                        </el-form-item>
                        <el-form-item :label="t('views.autoBackup.retainedFileCountLimit')" prop="retainedFileCountLimit" required>
                            <el-input-number v-model="formModel.retainedFileCountLimit" :min="0" />
                        </el-form-item>
                        <el-form-item :label="t('views.autoBackup.resetIntervalAfterManualBackup')" prop="resetIntervalAfterManualBackup">
                            <el-switch v-model="formModel.resetIntervalAfterManualBackup" />
                        </el-form-item>
                        <el-form-item :label="t('views.autoBackup.skipIfThereAreNoPlayers')" prop="skipIfThereAreNoPlayers">
                            <el-switch v-model="formModel.skipIfThereAreNoPlayers" />
                        </el-form-item>
                        <el-form-item :label="t('views.autoBackup.autoBackupOnServerStartup')" prop="autoBackupOnServerStartup">
                            <el-switch v-model="formModel.autoBackupOnServerStartup" />
                        </el-form-item>
                        <el-form-item :label="t('views.autoBackup.archiveFolder')" prop="archiveFolder">
                            <el-input v-model="formModel.archiveFolder" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="save">{{ t('global.button.save') }}</el-button>
                            <el-button type="danger" @click="reset">{{ t('global.button.reset') }}</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-scrollbar>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'autobackup.settings',
};
</script>

<script setup>
import * as api from '~/api/settings.js';

const { t } = useI18n();

const formModel = reactive({});
const formRef = ref();

const localeStore = useLocaleStore();
const getData = async () => {
    const data = await api.getSettings('AutoBackup', localeStore.getLanguage());
    Object.assign(formModel, data);
};
getData();

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('AutoBackup', formModel);
        ElMessage.success(t('global.message.saveSuccess'));
    } catch {}
};

const reset = async () => {
    try {
        if (await myconfirm(t('global.message.resetConfirm'))) {
            await api.resetSettings('AutoBackup', localeStore.getLanguage());
            await getData();
            ElMessage.success(t('global.message.resetSuccess'));
        }
    } catch {}
};
</script>

<style scoped lang="scss">
.autobackup-settings {
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
