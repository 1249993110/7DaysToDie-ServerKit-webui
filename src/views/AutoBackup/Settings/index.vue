<template>
    <div class="autobackup-settings">
        <RouterButton
            :buttons="[
                {
                    value: '备份配置',
                    path: '/autobackup/settings',
                },
                {
                    value: '备份管理',
                    path: '/autobackup/management',
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
                        <el-form-item label="自动备份间隔 (秒)" prop="interval" required>
                            <el-input-number v-model="formModel.interval" :min="10" />
                        </el-form-item>
                        <el-form-item label="保留文件数量限制" prop="retainedFileCountLimit" required>
                            <el-input-number v-model="formModel.retainedFileCountLimit" :min="0" />
                        </el-form-item>
                        <el-form-item label="是否在手动备份后重置计时" prop="resetIntervalAfterManualBackup">
                            <el-switch v-model="formModel.resetIntervalAfterManualBackup" />
                        </el-form-item>
                        <el-form-item label="是否在没有玩家时跳过备份" prop="skipIfThereAreNoPlayers">
                            <el-switch v-model="formModel.skipIfThereAreNoPlayers" />
                        </el-form-item>
                        <el-form-item label="是否在服务器启动时自动备份" prop="autoBackupOnServerStartup">
                            <el-switch v-model="formModel.autoBackupOnServerStartup" />
                        </el-form-item>
                        <el-form-item label="备份文件夹" prop="archiveFolder">
                            <el-input v-model="formModel.archiveFolder" />
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
    name: 'AutoBackup.Settings',
};
</script>

<script setup>
import * as api from '~/api/settings.js';
import myconfirm from '~/utils/myconfirm';

const formModel = reactive({});

const formRef = ref();

const getData = async () => {
    const data = await api.getSettings('AutoBackup');
    Object.assign(formModel, data);
};
getData();

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('AutoBackup', formModel);
        ElMessage.success('保存成功');
    } catch {}
};

const reset = async () => {
    try {
        if (await myconfirm('确定重置配置吗?')) {
            await api.resetSettings('AutoBackup', formModel);
            await getData();
            ElMessage.success('重置成功');
        }
    } catch {}
};
</script>

<style scoped lang="scss">
.autobackup-settings {
    .card {
        height: 100%;
        margin-top: 20px;
        background-color: #ffffffaf;
        :deep(.el-card__body) {
            height: calc(100% - 40px);
        }
    }
}
</style>
