<template>
    <div class="points-system-settings">
        <el-card>
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" ref="formRef" label-width="150px" status-icon>
                        <el-form-item label="是否启用" prop="isEnabled">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item>
                        <el-form-item label="可用变量">
                            <el-tag v-for="(item, index) in variables" :key="index" class="tag">{{ '{' + item + '}' }}</el-tag>
                        </el-form-item>
                        <el-form-item label="签到命令" prop="signInCmd" required>
                            <el-input v-model="formModel.signInCmd" />
                        </el-form-item>
                        <el-form-item label="签到间隔天数" prop="daysBetweenSignIn" required>
                            <el-input v-model="formModel.daysBetweenSignIn" />
                        </el-form-item>
                        <el-form-item label="签到奖励积分" prop="signInRewardPoints" required>
                            <el-input v-model="formModel.signInRewardPoints" />
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
                        <el-form-item>
                            <el-button type="primary" @click="save">保存</el-button>
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

const formModel = reactive({});
const formRef = ref();

api.getSettings('PointsSystem')
    .then((data) => {
        Object.assign(formModel, data);
    })
    .catch((error) => {});

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('PointsSystem', formModel);
        ElMessage.success('保存成功');
    } catch {}
};

const variables = ['SignInRewardPoints', 'PlayerTotalPoints', 'EntityId', 'PlatformId', 'PlayerName'];
</script>

<style scoped lang="scss">
.points-system-settings {
    .el-card {
        height: 100%;
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
