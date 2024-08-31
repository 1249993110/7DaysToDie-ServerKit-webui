<template>
    <div class="teleport-friend-settings">
        <RouterButton :names="['teleSystem.friend']"></RouterButton>
        <el-card shadow="always" class="card">
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" :rules="rules" ref="formRef" label-width="250px" status-icon>
                        <el-form-item :label="t('views.teleSystem.friend.isEnabled')">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.friend.variables')">
                            <el-tag v-for="(item, index) in variables" :key="index" class="tag">{{ '{' + item + '}' }}</el-tag>
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.friend.teleCmdPrefix')" prop="teleCmdPrefix">
                            <el-input v-model="formModel.teleCmdPrefix" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.friend.teleInterval')" prop="teleInterval">
                            <el-input-number v-model="formModel.teleInterval" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.friend.pointsRequired')" prop="pointsRequired">
                            <el-input-number v-model="formModel.pointsRequired" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.friend.teleSuccessTip')" prop="teleSuccessTip">
                            <el-input v-model="formModel.teleSuccessTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.friend.pointsNotEnoughTip')" prop="pointsNotEnoughTip">
                            <el-input v-model="formModel.pointsNotEnoughTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.friend.coolingTip')" prop="coolingTip">
                            <el-input v-model="formModel.coolingTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.friend.targetNotFoundTip')" prop="targetNotFoundTip">
                            <el-input v-model="formModel.targetNotFoundTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.teleSystem.friend.targetNotFriendTip')" prop="targetNotFriendTip">
                            <el-input v-model="formModel.targetNotFriendTip" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="save">{{ t('global.button.save') }}</el-button>
                            <el-button type="danger" @click="reset">{{ t('global.button.reset') }}</el-button>
                        </el-form-item>
                    </el-form>
                    <div>
                        <el-text style="color: green">{{ t('views.teleSystem.friend.useTips') }}</el-text>
                    </div>
                </div>
            </el-scrollbar>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'teleSystem.friend',
};
</script>

<script setup>
import * as api from '~/api/settings.js';

const { t } = useI18n();
const formModel = reactive({});
const formRef = ref();
const localeStore = useLocaleStore();
const getData = async () => {
    const data = await api.getSettings('TeleportFriend', localeStore.getLanguage());
    Object.assign(formModel, data);
};
getData();

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('TeleportFriend', formModel);
        ElMessage.success(t('global.message.saveSuccess'));
    } catch {}
};

const reset = async () => {
    try {
        if (await myconfirm(t('global.message.resetConfirm'))) {
            await api.resetSettings('TeleportFriend', localeStore.getLanguage());
            await getData();
            ElMessage.success(t('global.message.resetSuccess'));
        }
    } catch {}
};

const variables = ['TeleInterval', 'PointsRequired', 'TargetName', 'CooldownSeconds', 'EntityId', 'PlayerId', 'PlayerName'];

const rules = {
    teleCmdPrefix: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    teleInterval: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    pointsRequired: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    teleSuccessTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    pointsNotEnoughTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    coolingTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    targetNotFoundTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    targetNotFriendTip: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
};
</script>

<style scoped lang="scss">
.teleport-friend-settings {
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
