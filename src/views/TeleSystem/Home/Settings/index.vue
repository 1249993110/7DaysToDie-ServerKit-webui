<template>
    <div class="teleport-home-settings">
        <RouterButton :names="['teleSystem.home.settings', 'teleSystem.home.management']"></RouterButton>
        <el-card shadow="always" class="card">
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" :rules="rules" ref="formRef" label-width="150px" status-icon>
                        <el-form-item label="是否启用" prop="isEnabled">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item>
                        <el-form-item label="可用变量">
                            <el-tag v-for="(item, index) in variables" :key="index" class="tag">{{ '{' + item + '}' }}</el-tag>
                        </el-form-item>
                        <el-form-item label="查询Home列表命令" prop="queryListCmd">
                            <el-input v-model="formModel.queryListCmd" />
                        </el-form-item>
                        <el-form-item label="传送间隔, 单位: 秒" prop="teleInterval">
                            <el-input-number v-model="formModel.teleInterval" />
                        </el-form-item>
                        <el-form-item label="设置Home命令前缀" prop="setHomeCmdPrefix">
                            <el-input v-model="formModel.setHomeCmdPrefix" />
                        </el-form-item>
                        <el-form-item label="最大可设置数量" prop="setCountLimit">
                            <el-input-number v-model="formModel.setCountLimit" />
                        </el-form-item>
                        <el-form-item label="设置需要积分" prop="pointsRequiredForSet">
                            <el-input-number v-model="formModel.pointsRequiredForSet" />
                        </el-form-item>
                        <el-form-item label="删除Home命令前缀" prop="deleteHomeCmdPrefix">
                            <el-input v-model="formModel.deleteHomeCmdPrefix" />
                        </el-form-item>
                        <el-form-item label="传送Home命令前缀" prop="teleHomeCmdPrefix">
                            <el-input v-model="formModel.teleHomeCmdPrefix" />
                        </el-form-item>
                        <el-form-item label="传送需要积分" prop="pointsRequiredForTele">
                            <el-input-number v-model="formModel.pointsRequiredForTele" />
                        </el-form-item>
                        <el-form-item label="没有Home提示" prop="noHomeTip">
                            <el-input v-model="formModel.noHomeTip" />
                        </el-form-item>
                        <el-form-item label="查询列表提示" prop="locationItemTip">
                            <el-input v-model="formModel.locationItemTip" />
                        </el-form-item>
                        <el-form-item label="超出限制提示" prop="overLimitTip">
                            <el-input v-model="formModel.overLimitTip" />
                        </el-form-item>
                        <el-form-item label="设置积分不足提示" prop="setPointsNotEnoughTip">
                            <el-input v-model="formModel.setPointsNotEnoughTip" />
                        </el-form-item>
                        <el-form-item label="设置成功提示" prop="setSuccessTip">
                            <el-input v-model="formModel.setSuccessTip" />
                        </el-form-item>
                        <el-form-item label="覆盖成功提示" prop="overwriteSuccessTip">
                            <el-input v-model="formModel.overwriteSuccessTip" />
                        </el-form-item>
                        <el-form-item label="删除成功提示" prop="deleteSuccessTip">
                            <el-input v-model="formModel.deleteSuccessTip" />
                        </el-form-item>
                        <el-form-item label="Home没有找到提示" prop="homeNotFoundTip">
                            <el-input v-model="formModel.homeNotFoundTip" />
                        </el-form-item>
                        <el-form-item label="正在冷却提示" prop="coolingTip">
                            <el-input v-model="formModel.coolingTip" />
                        </el-form-item>
                        <el-form-item label="传送积分不足提示" prop="telePointsNotEnoughTip">
                            <el-input v-model="formModel.telePointsNotEnoughTip" />
                        </el-form-item>
                        <el-form-item label="传送成功提示" prop="teleSuccessTip">
                            <el-input v-model="formModel.teleSuccessTip" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="save">保存</el-button>
                            <el-button type="danger" @click="reset">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <div>
                        <el-text style="color: green">提示: 游戏内输入setHome+横杠(-)+home名称 保存当前坐标, 输入delHome+横杠(-)+home名称 删除home</el-text>
                    </div>
                </div>
            </el-scrollbar>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'teleSystem.home.settings',
};
</script>

<script setup>
import * as api from '~/api/settings.js';


const formModel = reactive({});
const formRef = ref();
const localeStore = useLocaleStore();
const getData = async () => {
    const data = await api.getSettings('TeleportHome', localeStore.getLanguage());
    Object.assign(formModel, data);
};
getData();

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('TeleportHome', formModel);
        ElMessage.success('保存成功');
    } catch {}
};

const reset = async () => {
    try {
        if (await myconfirm('确定重置配置吗?')) {
            await api.resetSettings('TeleportHome', localeStore.getLanguage());
            await getData();
            ElMessage.success('重置成功');
        }
    } catch {}
};

const variables = ['HomeName', 'TeleInterval', 'CooldownSeconds', 'EntityId', 'PlayerId', 'PlayerName'];

const rules = {
    queryListCmd: [{ required: true, message: '必填项', trigger: 'blur' }],
    teleInterval: [{ required: true, message: '必填项', trigger: 'blur' }],
    setHomeCmdPrefix: [{ required: true, message: '必填项', trigger: 'blur' }],
    setCountLimit: [{ required: true, message: '必填项', trigger: 'blur' }],
    pointsRequiredForSet: [{ required: true, message: '必填项', trigger: 'blur' }],
    deleteHomeCmdPrefix: [{ required: true, message: '必填项', trigger: 'blur' }],
    teleHomeCmdPrefix: [{ required: true, message: '必填项', trigger: 'blur' }],
    pointsRequiredForTele: [{ required: true, message: '必填项', trigger: 'blur' }],
    noHomeTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    locationItemTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    overLimitTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    setPointsNotEnoughTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    setSuccessTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    overwriteSuccessTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    deleteSuccessTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    homeNotFoundTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    coolingTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    telePointsNotEnoughTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    teleSuccessTip: [{ required: true, message: '必填项', trigger: 'blur' }],
};
</script>

<style scoped lang="scss">
.teleport-home-settings {
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
