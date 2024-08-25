<template>
    <div class="game-store-settings">
        <RouterButton :names="['gameStore.settings', 'gameStore.management']"></RouterButton>
        <el-card shadow="always" class="card">
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" ref="formRef" label-width="250px" status-icon>
                        <el-form-item :label="t('views.gameStore.isEnabled')" prop="isEnabled">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item>
                        <el-form-item :label="t('views.gameStore.variables')">
                            <el-tag v-for="(item, index) in variables" :key="index" class="tag">{{ '{' + item + '}' }}</el-tag>
                        </el-form-item>
                        <el-form-item :label="t('views.gameStore.queryListCmd')" prop="queryListCmd" required>
                            <el-input v-model="formModel.queryListCmd" />
                        </el-form-item>
                        <el-form-item :label="t('views.gameStore.buyCmdPrefix')" prop="buyCmdPrefix" required>
                            <el-input v-model="formModel.buyCmdPrefix" />
                        </el-form-item>
                        <el-form-item :label="t('views.gameStore.goodsItemTip')" prop="goodsItemTip" required>
                            <el-input v-model="formModel.goodsItemTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.gameStore.buySuccessTip')" prop="buySuccessTip" required>
                            <el-input v-model="formModel.buySuccessTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.gameStore.pointsNotEnoughTip')" prop="pointsNotEnoughTip" required>
                            <el-input v-model="formModel.pointsNotEnoughTip" />
                        </el-form-item>
                        <el-form-item :label="t('views.gameStore.noGoods')" prop="noGoods" required>
                            <el-input v-model="formModel.noGoods" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="save">{{ $t('global.button.save') }}</el-button>
                            <el-button type="danger" @click="reset">{{ $t('global.button.reset') }}</el-button>
                        </el-form-item>
                    </el-form>
                    <div>
                        <el-text style="color: green">{{ t('views.gameStore.useTips') }}</el-text>
                    </div>
                </div></el-scrollbar
            >
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'gameStore.settings',
};
</script>

<script setup>
import * as api from '~/api/settings.js';

const { t } = useI18n();

const formModel = reactive({});

const formRef = ref();
const localeStore = useLocaleStore();
const getData = async () => {
    const data = await api.getSettings('GameStore', localeStore.getLanguage());
    Object.assign(formModel, data);
};
getData();

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('GameStore', formModel);
        ElMessage.success(t('global.message.saveSuccess'));
    } catch {}
};

const reset = async () => {
    try {
        if (await myconfirm(t('global.message.resetConfirm'))) {
            await api.resetSettings('GameStore', localeStore.getLanguage());
            await getData();
            ElMessage.success(t('global.message.resetSuccess'));
        }
    } catch {}
};

const variables = ['GoodsId', 'GoodsName', 'Price', 'EntityId', 'PlayerId', 'PlayerName'];
</script>

<style scoped lang="scss">
.game-store-settings {
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
