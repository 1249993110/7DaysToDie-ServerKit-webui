<template>
    <div class="teleport-city-settings">
        <RouterButton :names="['teleSystem.city.settings', 'teleSystem.city.management']"></RouterButton>
        <el-card shadow="always" class="card">
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" :rules="rules" ref="formRef" label-width="250px" status-icon>
                        <el-form-item :label="t('views.teleSystem.city.isEnabled')" prop="isEnabled">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.city.variables')">
                            <el-tag v-for="(item, index) in variables" :key="index" class="tag">{{ '{' + item + '}' }}</el-tag>
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.city.queryListCmd')" prop="queryListCmd">
                            <el-input v-model="formModel.queryListCmd" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.city.teleCmdPrefix')" prop="teleCmdPrefix">
                            <el-input v-model="formModel.teleCmdPrefix" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.city.teleInterval')" prop="teleInterval">
                            <el-input-number v-model="formModel.teleInterval" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.city.locationItemTip')" prop="locationItemTip">
                            <el-input v-model="formModel.locationItemTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.city.teleSuccessTip')" prop="teleSuccessTip">
                            <el-input v-model="formModel.teleSuccessTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.city.pointsNotEnoughTip')" prop="pointsNotEnoughTip">
                            <el-input v-model="formModel.pointsNotEnoughTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.city.coolingTip')" prop="coolingTip">
                            <el-input v-model="formModel.coolingTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.city.noLocation')"prop="noLocation">
                            <el-input v-model="formModel.noLocation" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="save">{{ $t('global.button.save') }}</el-button>
                            <el-button type="danger" @click="reset">{{ $t('global.button.reset') }}</el-button>
                        </el-form-item>
                    </el-form>
                    <div>
                        <el-text style="color: green">{{ t('views.teleSystem.city.useTips') }}</el-text>
                    </div>
                </div>
            </el-scrollbar>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'teleSystem.city.settings',
};
</script>

<script setup>
import * as api from '~/api/settings.js';

const {t} = useI18n();
const formModel = reactive({});
const formRef = ref();
const localeStore = useLocaleStore();
const getData = async () => {
    const data = await api.getSettings('TeleportCity', localeStore.getLanguage());
    Object.assign(formModel, data);
};
getData();

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('TeleportCity', formModel);
        ElMessage.success(t('global.message.saveSuccess'));
    } catch {}
};

const reset = async () => {
    try {
        if (await myconfirm(t('global.message.resetConfirm'))) {
            await api.resetSettings('TeleportCity', localeStore.getLanguage());
            await getData();
            ElMessage.success(t('global.message.resetSuccess'));
        }
    } catch {}
};

const variables = ['CityId', 'CityName', 'TeleInterval', 'PointsRequired', 'CooldownSeconds', 'EntityId', 'PlayerId', 'PlayerName'];

const rules = {
    queryListCmd: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    teleCmdPrefix: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    teleInterval: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    locationItemTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    teleSuccessTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    pointsNotEnoughTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    coolingTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    noLocation: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
};
</script>

<style scoped lang="scss">
.teleport-city-settings {
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
