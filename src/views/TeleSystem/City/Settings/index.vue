<template>
    <div class="teleport-city-settings">
        <RouterButton :names="['teleSystem.city.settings', 'teleSystem.city.management']"></RouterButton>
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
                        <el-form-item label="查询列表命令" prop="queryListCmd">
                            <el-input v-model="formModel.queryListCmd" />
                        </el-form-item>
                        <el-form-item label="传送命令前缀" prop="teleCmdPrefix">
                            <el-input v-model="formModel.teleCmdPrefix" />
                        </el-form-item>
                        <el-form-item label="传送间隔, 单位: 秒" prop="teleInterval">
                            <el-input-number v-model="formModel.teleInterval" />
                        </el-form-item>
                        <el-form-item label="查询列表提示" prop="locationItemTip">
                            <el-input v-model="formModel.locationItemTip" />
                        </el-form-item>
                        <el-form-item label="传送成功提示" prop="teleSuccessTip">
                            <el-input v-model="formModel.teleSuccessTip" />
                        </el-form-item>
                        <el-form-item label="积分不足提示" prop="pointsNotEnoughTip">
                            <el-input v-model="formModel.pointsNotEnoughTip" />
                        </el-form-item>
                        <el-form-item label="正在冷却提示" prop="coolingTip">
                            <el-input v-model="formModel.coolingTip" />
                        </el-form-item>
                        <el-form-item label="无城市信息提示" prop="noLocation">
                            <el-input v-model="formModel.noLocation" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="save">保存</el-button>
                            <el-button type="danger" @click="reset">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <div>
                        <el-text style="color: green">提示: 游戏内输入hc+横杠(-)+城镇名称 进行传送</el-text>
                    </div>
                </div>
            </el-scrollbar>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'teleSystem.city.settings',
};
</script>

<script setup>
import * as api from '~/api/settings.js';

const formModel = reactive({});
const formRef = ref();
const localeStore = useLocaleStore();
const getData = async () => {
    const data = await api.getSettings('TeleportCity', localeStore.getLanguage());
    Object.assign(formModel, data);
};
getData();

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('TeleportCity', formModel);
        ElMessage.success('保存成功');
    } catch {}
};

const reset = async () => {
    try {
        if (await myconfirm('确定重置配置吗?')) {
            await api.resetSettings('TeleportCity', localeStore.getLanguage());
            await getData();
            ElMessage.success('重置成功');
        }
    } catch {}
};

const variables = ['CityId', 'CityName', 'TeleInterval', 'PointsRequired', 'CooldownSeconds', 'EntityId', 'PlayerId', 'PlayerName'];

const rules = {
    queryListCmd: [{ required: true, message: '必填项', trigger: 'blur' }],
    teleCmdPrefix: [{ required: true, message: '必填项', trigger: 'blur' }],
    teleInterval: [{ required: true, message: '必填项', trigger: 'blur' }],
    locationItemTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    teleSuccessTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    pointsNotEnoughTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    coolingTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    noLocation: [{ required: true, message: '必填项', trigger: 'blur' }],
};
</script>

<style scoped lang="scss">
.teleport-city-settings {
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
