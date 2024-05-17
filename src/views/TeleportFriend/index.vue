<template>
    <div class="teleport-friend-settings">
        <el-card>
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" ref="formRef" label-width="200px" status-icon>
                        <el-form-item label="是否启用">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item>
                        <el-form-item label="可用变量">
                            <el-tag v-for="(item, index) in variables" :key="index" class="tag">{{ '{' + item + '}' }}</el-tag>
                        </el-form-item>
                        <el-form-item label="传送命令" prop="teleCmdPrefix" required>
                            <el-input v-model="formModel.teleCmdPrefix" />
                        </el-form-item>
                        <el-form-item label="传送间隔 (单位: 秒)" prop="teleInterval" required>
                            <el-input v-model="formModel.teleInterval" />
                        </el-form-item>
                        <el-form-item label="需要积分" prop="pointsRequired" required>
                            <el-input v-model="formModel.pointsRequired" />
                        </el-form-item>
                        <el-form-item label="传送成功提示" prop="teleSuccessTip" required>
                            <el-input v-model="formModel.teleSuccessTip" />
                        </el-form-item>
                        <el-form-item label="积分不足提示" prop="pointsNotEnoughTip" required>
                            <el-input v-model="formModel.pointsNotEnoughTip" />
                        </el-form-item>
                        <el-form-item label="正在冷却提示" prop="coolingTip" required>
                            <el-input v-model="formModel.coolingTip" />
                        </el-form-item>
                        <el-form-item label="传送目标没有找到提示" prop="targetNotFoundTip" required>
                            <el-input v-model="formModel.targetNotFoundTip" />
                        </el-form-item>
                        <el-form-item label="传送目标不是您的好友提示" prop="targetNotFriendTip" required>
                            <el-input v-model="formModel.targetNotFriendTip" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="save">保存</el-button>
                        </el-form-item>
                    </el-form>
                    <div>
                        <el-text style="color: green">提示: 游戏内输入tele+空格+好友名称 进行传送</el-text>
                    </div>
                </div>
            </el-scrollbar>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'TeleportFriend',
};
</script>

<script setup>
import * as api from '~/api/settings.js';

const formModel = reactive({});
const formRef = ref();

api.getSettings('TeleportFriend')
    .then((data) => {
        Object.assign(formModel, data);
    })
    .catch((error) => {});

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('TeleportFriend', formModel);
        ElMessage.success('保存成功');
    } catch {}
};

const variables = ['TeleInterval', 'PointsRequired', 'TargetName', 'CooldownSeconds', 'EntityId', 'PlatformId', 'PlayerName'];
</script>

<style scoped lang="scss">
.teleport-friend-settings {
    height: 100%;
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
