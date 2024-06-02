<template>
    <div class="teleport-home-settings">
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
                        <el-form-item label="查询Home列表命令" prop="queryListCmd" required>
                            <el-input v-model="formModel.queryListCmd" />
                        </el-form-item>
                        <el-form-item label="传送间隔, 单位: 秒" prop="teleInterval" required>
                            <el-input v-model="formModel.teleInterval" />
                        </el-form-item>
                        <el-form-item label="设置Home命令前缀" prop="setHomeCmdPrefix" required>
                            <el-input v-model="formModel.setHomeCmdPrefix" />
                        </el-form-item>
                        <el-form-item label="最大可设置数量" prop="setCountLimit" required>
                            <el-input v-model="formModel.setCountLimit" />
                        </el-form-item>
                        <el-form-item label="设置需要积分" prop="pointsRequiredForSet" required>
                            <el-input v-model="formModel.pointsRequiredForSet" />
                        </el-form-item>
                        <el-form-item label="删除Home命令前缀" prop="deleteHomeCmdPrefix" required>
                            <el-input v-model="formModel.deleteHomeCmdPrefix" />
                        </el-form-item>
                        <el-form-item label="传送Home命令前缀" prop="teleHomeCmdPrefix" required>
                            <el-input v-model="formModel.teleHomeCmdPrefix" />
                        </el-form-item>
                        <el-form-item label="传送需要积分" prop="pointsRequiredForTele" required>
                            <el-input v-model="formModel.pointsRequiredForTele" />
                        </el-form-item>
                        <el-form-item label="没有Home提示" prop="noHomeTip" required>
                            <el-input v-model="formModel.noHomeTip" />
                        </el-form-item>
                        <el-form-item label="查询列表提示" prop="locationItemTip" required>
                            <el-input v-model="formModel.locationItemTip" />
                        </el-form-item>
                        <el-form-item label="超出限制提示" prop="overLimitTip" required>
                            <el-input v-model="formModel.overLimitTip" />
                        </el-form-item>
                        <el-form-item label="设置积分不足提示" prop="setPointsNotEnoughTip" required>
                            <el-input v-model="formModel.setPointsNotEnoughTip" />
                        </el-form-item>
                        <el-form-item label="设置成功提示" prop="setSuccessTip" required>
                            <el-input v-model="formModel.setSuccessTip" />
                        </el-form-item>
                        <el-form-item label="覆盖成功提示" prop="overwriteSuccessTip" required>
                            <el-input v-model="formModel.overwriteSuccessTip" />
                        </el-form-item>
                        <el-form-item label="删除成功提示" prop="deleteSuccessTip" required>
                            <el-input v-model="formModel.deleteSuccessTip" />
                        </el-form-item>
                        <el-form-item label="Home没有找到提示" prop="homeNotFoundTip" required>
                            <el-input v-model="formModel.homeNotFoundTip" />
                        </el-form-item>
                        <el-form-item label="正在冷却提示" prop="coolingTip" required>
                            <el-input v-model="formModel.coolingTip" />
                        </el-form-item>
                        <el-form-item label="传送积分不足提示" prop="telePointsNotEnoughTip" required>
                            <el-input v-model="formModel.telePointsNotEnoughTip" />
                        </el-form-item>
                        <el-form-item label="传送成功提示" prop="teleSuccessTip" required>
                            <el-input v-model="formModel.teleSuccessTip" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="save">保存</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div>
                    <el-text style="color: green">提示: 游戏内输入setHome+横杠(-)+home名称 保存当前坐标, 输入delHome+横杠(-)+home名称 删除home</el-text>
                </div>
            </el-scrollbar>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'TeleportHome.Settings',
};
</script>

<script setup>
import * as api from '~/api/settings';

const formModel = reactive({});
const formRef = ref();

api.getSettings('TeleportHome')
    .then((data) => {
        Object.assign(formModel, data);
    })
    .catch((error) => {});

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('TeleportHome', formModel);
        ElMessage.success('保存成功');
    } catch {}
};

const variables = ['HomeName', 'TeleInterval', 'SerialNumber', 'CooldownSeconds', 'EntityId', 'PlatformId', 'PlayerName'];
</script>

<style scoped lang="scss">
.teleport-home-settings {
    .tag {
        margin-right: 8px;
    }
    .el-card {
        height: 100%;
        background-color: #ffffffaf;
        :deep(.el-card__body) {
            height: calc(100% - 40px);
        }
    }
}
</style>
