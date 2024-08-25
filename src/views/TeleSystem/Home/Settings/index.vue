<template>
    <div class="teleport-home-settings">
        <RouterButton :names="['teleSystem.home.settings', 'teleSystem.home.management']"></RouterButton>
        <el-card shadow="always" class="card">
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" :rules="rules" ref="formRef" label-width="250px" status-icon>
                        <el-form-item :label="t('views.teleSystem.home.isEnabled')" prop="isEnabled">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.variables')">
                            <el-tag v-for="(item, index) in variables" :key="index" class="tag">{{ '{' + item + '}' }}</el-tag>
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.queryListCmd')" prop="queryListCmd">
                            <el-input v-model="formModel.queryListCmd" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.teleInterval')" prop="teleInterval">
                            <el-input-number v-model="formModel.teleInterval" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.setHomeCmdPrefix')" prop="setHomeCmdPrefix">
                            <el-input v-model="formModel.setHomeCmdPrefix" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.setCountLimit')" prop="setCountLimit">
                            <el-input-number v-model="formModel.setCountLimit" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.pointsRequiredForSet')" prop="pointsRequiredForSet">
                            <el-input-number v-model="formModel.pointsRequiredForSet" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.deleteHomeCmdPrefix')" prop="deleteHomeCmdPrefix">
                            <el-input v-model="formModel.deleteHomeCmdPrefix" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.teleHomeCmdPrefix')" prop="teleHomeCmdPrefix">
                            <el-input v-model="formModel.teleHomeCmdPrefix" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.pointsRequiredForTele')" prop="pointsRequiredForTele">
                            <el-input-number v-model="formModel.pointsRequiredForTele" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.noHomeTip')" prop="noHomeTip">
                            <el-input v-model="formModel.noHomeTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.locationItemTip')" prop="locationItemTip">
                            <el-input v-model="formModel.locationItemTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.overLimitTip')" prop="overLimitTip">
                            <el-input v-model="formModel.overLimitTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.setPointsNotEnoughTip')" prop="setPointsNotEnoughTip">
                            <el-input v-model="formModel.setPointsNotEnoughTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.setSuccessTip')" prop="setSuccessTip">
                            <el-input v-model="formModel.setSuccessTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.overwriteSuccessTip')" prop="overwriteSuccessTip">
                            <el-input v-model="formModel.overwriteSuccessTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.deleteSuccessTip')" prop="deleteSuccessTip">
                            <el-input v-model="formModel.deleteSuccessTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.homeNotFoundTip')" prop="homeNotFoundTip">
                            <el-input v-model="formModel.homeNotFoundTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.coolingTip')" prop="coolingTip">
                            <el-input v-model="formModel.coolingTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.telePointsNotEnoughTip')" prop="telePointsNotEnoughTip">
                            <el-input v-model="formModel.telePointsNotEnoughTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.home.teleSuccessTip')" prop="teleSuccessTip">
                            <el-input v-model="formModel.teleSuccessTip" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="save">{{ $t('global.button.save') }}</el-button>
                            <el-button type="danger" @click="reset">{{ $t('global.button.reset') }}</el-button>
                        </el-form-item>
                    </el-form>
                    <div>
                        <el-text style="color: green">{{ t('views.teleSystem.home.useTips') }}</el-text>
                    </div>
                </div>
            </el-scrollbar>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'teleSystem.home.settings',
};
</script>

<script setup>
import * as api from '~/api/settings.js';

const { t } = useI18n();
const formModel = reactive({});
const formRef = ref();
const localeStore = useLocaleStore();
const getData = async () => {
    const data = await api.getSettings('TeleportHome', localeStore.getLanguage());
    Object.assign(formModel, data);
};
getData();

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('TeleportHome', formModel);
        ElMessage.success(t('global.message.saveSuccess'));
    } catch {}
};

const reset = async () => {
    try {
        if (await myconfirm(t('global.message.resetConfirm'))) {
            await api.resetSettings('TeleportHome', localeStore.getLanguage());
            await getData();
            ElMessage.success(t('global.message.resetSuccess'));
        }
    } catch {}
};

const variables = ['HomeName', 'TeleInterval', 'CooldownSeconds', 'EntityId', 'PlayerId', 'PlayerName'];

const rules = {
    queryListCmd: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    teleInterval: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    setHomeCmdPrefix: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    setCountLimit: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    pointsRequiredForSet: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    deleteHomeCmdPrefix: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    teleHomeCmdPrefix: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    pointsRequiredForTele: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    noHomeTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    locationItemTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    overLimitTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    setPointsNotEnoughTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    setSuccessTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    overwriteSuccessTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    deleteSuccessTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    homeNotFoundTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    coolingTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    telePointsNotEnoughTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    teleSuccessTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
};
</script>

<style scoped lang="scss">
.teleport-home-settings {
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
