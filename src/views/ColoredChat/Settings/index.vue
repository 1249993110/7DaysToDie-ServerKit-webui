<template>
    <div class="coloredChat-settings">
        <RouterButton :names="['coloredChat.settings', 'coloredChat.management']"></RouterButton>
        <el-card shadow="always" class="card">
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" ref="formRef" label-width="250px" status-icon>
                        <el-form-item :label="t('views.coloredChat.isEnabled')" prop="isEnabled">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item>
                        <el-form-item :label="t('views.coloredChat.globalDefault')" prop="globalDefault">
                            <MyColorPicker v-model="formModel.globalDefault" />
                        </el-form-item>
                        <el-form-item :label="t('views.coloredChat.whisperDefault')" prop="whisperDefault">
                            <MyColorPicker v-model="formModel.whisperDefault" />
                        </el-form-item>
                        <el-form-item :label="t('views.coloredChat.friendsDefault')" prop="friendsDefault">
                            <MyColorPicker v-model="formModel.friendsDefault" />
                        </el-form-item>
                        <el-form-item :label="t('views.coloredChat.partyDefault')" prop="partyDefault">
                            <MyColorPicker v-model="formModel.partyDefault" />
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
    name: 'coloredChat.settings',
};
</script>

<script setup>
import * as api from '~/api/settings.js';

const { t } = useI18n();
const formModel = reactive({});

const formRef = ref();
const localeStore = useLocaleStore();
const getData = async () => {
    const data = await api.getSettings('ColoredChat', localeStore.getLanguage());
    Object.assign(formModel, data);
};
getData();

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('ColoredChat', formModel);
        ElMessage.success(t('global.message.saveSuccess'));
    } catch {}
};

const reset = async () => {
    try {
        if (await myconfirm(t('global.message.resetConfirm'))) {
            await api.resetSettings('ColoredChat', localeStore.getLanguage());
            await getData();
            ElMessage.success(t('global.message.resetSuccess'));
        }
    } catch {}
};

</script>

<style scoped lang="scss">
.coloredChat-settings {
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
