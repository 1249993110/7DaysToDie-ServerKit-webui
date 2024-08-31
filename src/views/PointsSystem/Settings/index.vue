<template>
    <div class="points-system-settings">
        <RouterButton :names="['pointsSystem.settings', 'pointsSystem.management']"></RouterButton>
        <el-card shadow="always" class="card">
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" ref="formRef" label-width="250px" status-icon>
                        <el-form-item :label="t('views.pointsSystem.isEnabled')" prop="isEnabled">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item>
                        <el-form-item :label="t('views.pointsSystem.variables')">
                            <el-tag v-for="(item, index) in variables" :key="index" class="tag">{{ '{' + item + '}' }}</el-tag>
                        </el-form-item>
                        <el-form-item :label="t('views.pointsSystem.signInCmd')" prop="signInCmd" required>
                            <el-input v-model="formModel.signInCmd" />
                        </el-form-item>
                        <el-form-item :label="t('views.pointsSystem.signInInterval')" prop="signInInterval" required>
                            <el-input-number v-model="formModel.signInInterval" :min="1" />
                        </el-form-item>
                        <el-form-item :label="t('views.pointsSystem.signInRewardPoints')" prop="signInRewardPoints" required>
                            <el-input-number v-model="formModel.signInRewardPoints" />
                        </el-form-item>
                        <el-form-item :label="t('views.pointsSystem.signInSuccessTip')" prop="signInSuccessTip" required>
                            <el-input v-model="formModel.signInSuccessTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.pointsSystem.signInFailureTip')" prop="signInFailureTip" required>
                            <el-input v-model="formModel.signInFailureTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.pointsSystem.queryPointsCmd')" prop="queryPointsCmd" required>
                            <el-input v-model="formModel.queryPointsCmd" />
                        </el-form-item>
                        <el-form-item :label="t('views.pointsSystem.queryPointsTip')" prop="queryPointsTip" required>
                            <el-input v-model="formModel.queryPointsTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.pointsSystem.isCurrencyExchangeEnabled')" prop="isCurrencyExchangeEnabled">
                            <el-switch v-model="formModel.isCurrencyExchangeEnabled" />
                        </el-form-item>
                        <el-form-item :label="t('views.pointsSystem.currencyToPointsExchangeRate')" prop="currencyToPointsExchangeRate" required>
                            <el-input-number v-model="formModel.currencyToPointsExchangeRate" :min="0.0" :precision="3" />
                        </el-form-item>
                        <el-form-item :label="t('views.pointsSystem.currencyExchangeCmd')" prop="currencyExchangeCmd" required>
                            <el-input v-model="formModel.currencyExchangeCmd" />
                        </el-form-item>
                        <el-form-item :label="t('views.pointsSystem.exchangeSuccessTip')" prop="exchangeSuccessTip" required>
                            <el-input v-model="formModel.exchangeSuccessTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.pointsSystem.exchangeFailureTip')" prop="exchangeFailureTip" required>
                            <el-input v-model="formModel.exchangeFailureTip" />
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
    name: 'pointsSystem.settings',
};
</script>

<script setup>
import * as api from '~/api/settings.js';

const { t } = useI18n();

const formModel = reactive({});
const formRef = ref();
const localeStore = useLocaleStore();
const getData = async () => {
    const data = await api.getSettings('PointsSystem', localeStore.getLanguage());
    Object.assign(formModel, data);
};
getData();

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('PointsSystem', formModel);
        ElMessage.success(t('global.message.saveSuccess'));
    } catch {}
};

const reset = async () => {
    try {
        if (await myconfirm(t('global.message.resetConfirm'))) {
            await api.resetSettings('PointsSystem', localeStore.getLanguage());
            await getData();
            ElMessage.success(t('global.message.resetSuccess'));
        }
    } catch {}
};

const variables = ['SignInRewardPoints', 'PlayerTotalPoints', 'CurrencyAmount', 'EntityId', 'PlayerId', 'PlayerName'];
</script>

<style scoped lang="scss">
.points-system-settings {
    .card {
        height: 100%;
        margin-top: 20px;
        background-color: #ffffffaf;
        :deep(.el-card__body) {
            height: calc(100% - 40px);
        }
    }

    .tag {
        margin-right: 8px;
    }
}
</style>
