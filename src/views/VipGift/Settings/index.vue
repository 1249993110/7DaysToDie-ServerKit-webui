<template>
    <div class="vip-gift-settings">
        <RouterButton :names="['vipGift.settings', 'vipGift.management']"></RouterButton>
        <el-card shadow="always" class="card">
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" ref="formRef" label-width="150px" status-icon>
                        <el-form-item label="是否启用" prop="isEnabled">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item>
                        <el-form-item label="可用变量">
                            <el-tag v-for="(item, index) in variables" :key="index" class="tag">{{ '{' + item + '}' }}</el-tag>
                        </el-form-item>
                        <el-form-item label="领取命令" prop="claimCmd" required>
                            <el-input v-model="formModel.claimCmd" />
                        </el-form-item>
                        <el-form-item label="已经领取过提示" prop="hasClaimedTip" required>
                            <el-input v-model="formModel.hasClaimedTip" />
                        </el-form-item>
                        <el-form-item label="非VIP提示" prop="nonVipTip" required>
                            <el-input v-model="formModel.nonVipTip" />
                        </el-form-item>
                        <el-form-item label="领取成功提示" prop="claimSuccessTip" required>
                            <el-input v-model="formModel.claimSuccessTip" />
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
    name: 'vipGift.settings',
};
</script>

<script setup>
import * as api from '~/api/settings.js';

const formModel = reactive({});

const formRef = ref();
const localeStore = useLocaleStore();
const getData = async () => {
    const data = await api.getSettings('VipGift', localeStore.getLanguage());
    Object.assign(formModel, data);
};
getData();

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('VipGift', formModel);
        ElMessage.success(t('global.message.saveSuccess'));
    } catch {}
};

const reset = async () => {
    try {
        if (await myconfirm(ElMessage.success(t('global.message.resetConfirm')))) {
            await api.resetSettings('VipGift', localeStore.getLanguage());
            await getData();
            ElMessage.success(t('global.message.resetSuccess'));
        }
    } catch {}
};

const variables = ['GiftName', 'TotalClaimCount', 'GiftDescription', 'EntityId', 'PlayerId', 'PlayerName'];
</script>

<style scoped lang="scss">
.vip-gift-settings {
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
