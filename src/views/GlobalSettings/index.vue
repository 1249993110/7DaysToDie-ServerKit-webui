<template>
    <div class="global-settings">
        <RouterButton :names="['globalSettings']"> </RouterButton>
        <el-card shadow="always" class="card">
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" :rules="rules" ref="formRef" label-width="250px" status-icon>
                        <el-form-item>
                            <el-button type="primary" @click="save">{{ t('global.button.save') }}</el-button>
                            <el-button type="danger" @click="reset">{{ t('global.button.reset') }}</el-button>
                        </el-form-item>
                        <!-- <el-form-item label="是否启用">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item> -->
                        <el-form-item :label="t('views.globalSettings.chatCommandPrefix')" prop="chatCommandPrefix">
                            <el-input v-model="formModel.chatCommandPrefix" />
                        </el-form-item>
                        <el-form-item :label="t('views.globalSettings.chatCommandSeparator')" prop="chatCommandSeparator">
                            <el-input v-model="formModel.chatCommandSeparator" />
                        </el-form-item>
                        <el-form-item :label="t('views.globalSettings.handleChatMessageError')" prop="handleChatMessageError">
                            <el-input v-model="formModel.handleChatMessageError" />
                        </el-form-item>
                        <el-form-item :label="t('views.globalSettings.teleZombieCheck')" prop="teleZombieCheck">
                            <el-switch v-model="formModel.teleZombieCheck" />
                        </el-form-item>
                        <el-form-item :label="t('views.globalSettings.teleDisableTip')" prop="teleDisableTip">
                            <el-input v-model="formModel.teleDisableTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.globalSettings.killZombieTrigger.isEnabled')">
                            <el-switch v-model="formModel.killZombieTrigger.isEnabled" />
                        </el-form-item>
                        <el-form-item class="label" :label="t('views.globalSettings.killZombieTrigger.executeCommands')">
                            <MyTextarea v-model="formModel.killZombieTrigger.executeCommands"></MyTextarea>
                        </el-form-item>
                        <el-form-item :label="t('views.globalSettings.deathTrigger.isEnabled')">
                            <el-switch v-model="formModel.deathTrigger.isEnabled" />
                        </el-form-item>
                        <el-form-item class="label" :label="t('views.globalSettings.deathTrigger.executeCommands')">
                            <MyTextarea v-model="formModel.deathTrigger.executeCommands"></MyTextarea>
                        </el-form-item>
                        <el-form-item :label="t('views.globalSettings.autoRestart.isEnabled')">
                            <el-switch v-model="formModel.autoRestart.isEnabled" />
                        </el-form-item>
                        <el-form-item :label="t('views.globalSettings.autoRestart.time')">
                            <el-time-select
                                v-model="autoRestartTime"
                                style="width: 240px"
                                start="00:00"
                                step="00:30"
                                end="23:59"
                                :placeholder="t('global.message.datePickerPlaceholder')"
                            />
                        </el-form-item>
                        <el-form-item class="label" :label="t('views.globalSettings.autoRestart.messages')">
                            <MyTextarea v-model="formModel.autoRestart.messages"></MyTextarea>
                        </el-form-item>
                        <el-form-item :label="t('views.globalSettings.blockFamilySharingAccount')" prop="blockFamilySharingAccount">
                            <el-switch v-model="formModel.blockFamilySharingAccount" />
                        </el-form-item>
                        <el-form-item :label="t('views.globalSettings.removeSleepingBagFromPOI')" prop="removeSleepingBagFromPOI">
                            <el-switch v-model="formModel.removeSleepingBagFromPOI" />
                        </el-form-item>
                        <el-form-item :label="t('views.globalSettings.isEnablePlayerInitialSpawnPoint')" prop="isEnablePlayerInitialSpawnPoint">
                            <el-switch v-model="formModel.isEnablePlayerInitialSpawnPoint" />
                        </el-form-item>
                        <el-form-item :label="t('views.globalSettings.playerInitialPosition')" prop="playerInitialPosition">
                            <Coordinate v-model="formModel.playerInitialPosition"></Coordinate>
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
    name: 'globalSettings',
};
</script>

<script setup>
import * as api from '~/api/settings.js';

const { t } = useI18n();

const autoRestartTime = computed({
    get() {
        return formModel.autoRestart.restartHour.toString().padStart(2, '0') + ':' + formModel.autoRestart.restartMinute.toString().padStart(2, '0');
    },
    set(value) {
        const split = value.split(':');
        formModel.autoRestart.restartHour = parseInt(split[0]);
        formModel.autoRestart.restartMinute = parseInt(split[1]);
    },
});

const formModel = reactive({
    // serverName: '',
    chatCommandPrefix: '',
    chatCommandSeparator: '',
    handleChatMessageError: '',
    teleZombieCheck: false,
    teleDisableTip: '',
    killZombieTrigger: {
        isEnabled: false,
        executeCommands: [],
    },
    deathTrigger: {
        isEnabled: false,
        executeCommands: [],
    },
    autoRestart: {
        isEnabled: false,
        restartHour: 0,
        restartMinute: 0,
        messages: [],
    },
    blockFamilySharingAccount: false,
    removeSleepingBagFromPOI: false,
    isEnablePlayerInitialSpawnPoint: false,
    playerInitialPosition: '',
});

const formRef = ref();

const rules = {
    handleChatMessageError: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
};

const localeStore = useLocaleStore();
const getData = async () => {
    const data = await api.getSettings('GlobalSettings', localeStore.getLanguage());
    Object.assign(formModel, data);
};
getData();

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('GlobalSettings', formModel);
        ElMessage.success(t('global.message.saveSuccess'));
    } catch {}
};

const reset = async () => {
    try {
        if (await myconfirm(t('global.message.resetConfirm'))) {
            await api.resetSettings('GlobalSettings', localeStore.getLanguage());
            await getData();
            ElMessage.success(t('global.message.resetSuccess'));
        }
    } catch {}
};
</script>

<style scoped lang="scss">
.global-settings {
    .card {
        margin-top: 20px;
        background-color: #ffffffaf;
        :deep(.el-card__body) {
            height: calc(100vh - 200px);
        }

        .label {
            :deep(.el-form-item__label) {
                word-break: break-all;
                white-space: pre-wrap;
            }
        }
    }
}
</style>
