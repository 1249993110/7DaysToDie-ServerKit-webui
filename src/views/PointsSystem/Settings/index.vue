<template>
    <div class="points-system-settings">
        <RouterButton
            :buttons="[
                {
                    value: '签到配置',
                    path: '/points-system/settings',
                },
                {
                    value: '积分管理',
                    path: '/points-system/management',
                },
            ]"
        >
        </RouterButton>
        <el-card shadow="always" class="card">
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" ref="formRef" label-width="200px" status-icon>
                        <el-form-item label="是否启用" prop="isEnabled">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item>
                        <el-form-item label="可用变量">
                            <el-tag v-for="(item, index) in variables" :key="index" class="tag">{{ '{' + item + '}' }}</el-tag>
                        </el-form-item>
                        <el-form-item label="签到命令" prop="signInCmd" required>
                            <el-input v-model="formModel.signInCmd" />
                        </el-form-item>
                        <el-form-item label="签到间隔秒数" prop="signInInterval" required>
                            <el-input-number v-model="formModel.signInInterval" :min="1" />
                        </el-form-item>
                        <el-form-item label="签到奖励积分" prop="signInRewardPoints" required>
                            <el-input-number v-model="formModel.signInRewardPoints" />
                        </el-form-item>
                        <el-form-item label="签到成功提示" prop="signInSuccessTip" required>
                            <el-input v-model="formModel.signInSuccessTip" />
                        </el-form-item>
                        <el-form-item label="签到失败提示" prop="signInFailureTip" required>
                            <el-input v-model="formModel.signInFailureTip" />
                        </el-form-item>
                        <el-form-item label="查询积分命令" prop="queryPointsCmd" required>
                            <el-input v-model="formModel.queryPointsCmd" />
                        </el-form-item>
                        <el-form-item label="查询积分提示" prop="queryPointsTip" required>
                            <el-input v-model="formModel.queryPointsTip" />
                        </el-form-item>
                        <el-form-item label="是否启用游戏内货币兑换积分" prop="isCurrencyExchangeEnabled">
                            <el-switch v-model="formModel.isCurrencyExchangeEnabled" />
                        </el-form-item>
                        <el-form-item label="游戏内货币与积分兑换比例" prop="currencyToPointsExchangeRate" required>
                            <el-input-number v-model="formModel.currencyToPointsExchangeRate" :min="0.0" :precision="3" />
                        </el-form-item>
                        <el-form-item label="兑换命令" prop="currencyExchangeCmd" required>
                            <el-input v-model="formModel.currencyExchangeCmd" />
                        </el-form-item>
                        <el-form-item label="兑换成功提示" prop="exchangeSuccessTip" required>
                            <el-input v-model="formModel.exchangeSuccessTip" />
                        </el-form-item>
                        <el-form-item label="兑换失败提示" prop="exchangeFailureTip" required>
                            <el-input v-model="formModel.exchangeFailureTip" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="save">保存</el-button>
                            <el-button type="danger" @click="reset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-scrollbar>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'PointsSystem.Settings',
};
</script>

<script setup>
import * as api from '~/api/settings.js';
import myconfirm from '~/utils/myconfirm';

const formModel = reactive({});
const formRef = ref();

const getData = async () => {
    const data = await api.getSettings('PointsSystem');
    Object.assign(formModel, data);
};
getData();

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('PointsSystem', formModel);
        ElMessage.success('保存成功');
    } catch {}
};

const reset = async () => {
    try {
        if (await myconfirm('确定重置配置吗?')) {
            await api.resetSettings('PointsSystem', formModel);
            await getData();
            ElMessage.success('重置成功');
        }
    } catch {}
};

const variables = ['SignInRewardPoints', 'PlayerTotalPoints', 'CurrencyAmount', 'EntityId', 'PlatformId', 'PlayerName'];
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
