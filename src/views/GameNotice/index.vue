<template>
    <div class="game-notice-settings">
        <RouterButton :names="['gameNotice']"></RouterButton>
        <el-card class="card">
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" ref="formRef" label-width="250px" status-icon>
                        <el-form-item :label="t('views.gameNotice.isEnabled')" prop="isEnabled">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item>
                        <el-form-item :label="t('views.gameNotice.variables')">
                            <el-tag v-for="(item, index) in variables" :key="index" class="tag">{{ '{' + item + '}' }}</el-tag>
                        </el-form-item>
                        <el-form-item :label="t('views.gameNotice.welcomeNotice')" prop="welcomeNotice" required>
                            <el-input v-model="formModel.welcomeNotice" />
                        </el-form-item>
                        <el-form-item :label="t('views.gameNotice.rotatingNotices')" prop="rotatingNotices">
                            <MyTextarea v-model="formModel.rotatingNotices"></MyTextarea>
                        </el-form-item>
                        <el-form-item :label="t('views.gameNotice.rotatingInterval')" prop="rotatingInterval" required>
                            <el-input-number v-model="formModel.rotatingInterval" />
                        </el-form-item>
                        <el-form-item :label="t('views.gameNotice.bloodMoonNotice1')" prop="bloodMoonNotice1">
                            <el-input v-model="formModel.bloodMoonNotice1" />
                        </el-form-item>
                        <el-form-item :label="t('views.gameNotice.bloodMoonNotice2')" prop="bloodMoonNotice2">
                            <el-input v-model="formModel.bloodMoonNotice2" />
                        </el-form-item>
                        <el-form-item :label="t('views.gameNotice.bloodMoonNotice3')" prop="bloodMoonNotice3">
                            <el-input v-model="formModel.bloodMoonNotice3" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="save">{{ $t('global.button.save') }}</el-button>
                            <el-button type="danger" @click="reset">{{ $t('global.button.reset') }}</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-scrollbar>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'gameNotice',
};
</script>

<script setup>
import * as api from '~/api/settings.js';

const { t } = useI18n();
const formModel = reactive({});

const formRef = ref();
const localeStore = useLocaleStore();
const getData = async () => {
    const data = await api.getSettings('GameNotice', localeStore.getLanguage());
    Object.assign(formModel, data);
};
getData();

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('GameNotice', formModel);
        ElMessage.success(t('global.message.saveSuccess'));
    } catch {}
};

const reset = async () => {
    try {
        if (await myconfirm(t('global.message.resetConfirm'))) {
            await api.resetSettings('GameNotice', localeStore.getLanguage());
            await getData();
            ElMessage.success(t('global.message.resetSuccess'));
        }
    } catch {}
};

const variables = ['BloodMoonDays', 'BloodMoonStartTime', 'BloodMoonEndTime', 'EntityId', 'PlayerId', 'PlayerName'];
</script>

<style scoped lang="scss">
.game-notice-settings {
    .card {
        margin-top: 20px;
        background-color: #ffffffaf;
        :deep(.el-card__body) {
            height: calc(100vh - 200px);
        }

        :deep(.el-form-item__label) {
            white-space: pre-line;
        }

        .tag {
            margin-right: 8px;
        }
    }
}
</style>
