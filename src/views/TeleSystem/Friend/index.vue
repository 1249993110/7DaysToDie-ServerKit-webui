<template>
    <div class="teleport-friend-settings">
        <RouterButton :names="['teleSystem.friend']"></RouterButton>
        <el-card shadow="always" class="card">
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" :rules="rules" ref="formRef" label-width="200px" status-icon>
                        <el-form-item label="是否启用">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item>
                        <el-form-item label="可用变量">
                            <el-tag v-for="(item, index) in variables" :key="index" class="tag">{{ '{' + item + '}' }}</el-tag>
                        </el-form-item>
                        <el-form-item label="传送命令" prop="teleCmdPrefix">
                            <el-input v-model="formModel.teleCmdPrefix" />
                        </el-form-item>
                        <el-form-item label="传送间隔 (单位: 秒)" prop="teleInterval">
                            <el-input-number v-model="formModel.teleInterval" />
                        </el-form-item>
                        <el-form-item label="需要积分" prop="pointsRequired">
                            <el-input-number v-model="formModel.pointsRequired" />
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
                        <el-form-item label="传送目标没有找到提示" prop="targetNotFoundTip">
                            <el-input v-model="formModel.targetNotFoundTip" />
                        </el-form-item>
                        <el-form-item label="传送目标不是您的好友提示" prop="targetNotFriendTip">
                            <el-input v-model="formModel.targetNotFriendTip" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="save">保存</el-button>
                            <el-button type="danger" @click="reset">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <div>
                        <el-text style="color: green">提示: 游戏内输入tele+横杠(-)+好友名称 进行传送</el-text>
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

const formModel = reactive({});
const formRef = ref();

const getData = async () => {
    const data = await api.getSettings('TeleportFriend');
    Object.assign(formModel, data);
};
getData();

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('TeleportFriend', formModel);
        ElMessage.success('保存成功');
    } catch {}
};

const reset = async () => {
    try {
        if (await myconfirm('确定重置配置吗?')) {
            await api.resetSettings('TeleportFriend', formModel);
            await getData();
            ElMessage.success('重置成功');
        }
    } catch {}
};

const variables = ['TeleInterval', 'PointsRequired', 'TargetName', 'CooldownSeconds', 'EntityId', 'PlayerId', 'PlayerName'];

const rules = {
    teleCmdPrefix: [{ required: true, message: '必填项', trigger: 'blur' }],
    teleInterval: [{ required: true, message: '必填项', trigger: 'blur' }],
    pointsRequired: [{ required: true, message: '必填项', trigger: 'blur' }],
    teleSuccessTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    pointsNotEnoughTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    coolingTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    targetNotFoundTip: [{ required: true, message: '必填项', trigger: 'blur' }],
    targetNotFriendTip: [{ required: true, message: '必填项', trigger: 'blur' }],
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
