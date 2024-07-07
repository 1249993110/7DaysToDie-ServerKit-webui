<template>
    <div class="global-settings">
        <RouterButton
            :buttons="[
                {
                    value: '功能配置',
                    path: '/global-settings',
                },
            ]"
        >
        </RouterButton>
        <el-card class="card">
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" :rules="rules" ref="formRef" label-width="250px">
                        <el-form-item>
                            <el-button type="primary" @click="save">保存</el-button>
                            <el-button type="danger" @click="reset">重置</el-button>
                        </el-form-item>
                        <!-- <el-form-item label="是否启用">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item> -->
                        <el-form-item label="服务器名称" prop="serverName">
                            <el-input v-model="formModel.serverName" />
                        </el-form-item>
                        <el-form-item label="聊天命令前缀" prop="chatCommandPrefix">
                            <el-input v-model="formModel.chatCommandPrefix" />
                        </el-form-item>
                        <el-form-item label="聊天命令分隔符" prop="chatCommandSeparator">
                            <el-input v-model="formModel.chatCommandSeparator" />
                        </el-form-item>
                        <el-form-item label="聊天消息错误提示" prop="handleChatMessageError">
                            <el-input v-model="formModel.handleChatMessageError" />
                        </el-form-item>
                        <el-form-item label="传送前是否检查玩家周围是否有僵尸" prop="teleZombieCheck">
                            <el-switch v-model="formModel.teleZombieCheck" />
                        </el-form-item>
                        <el-form-item label="禁止传送提示" prop="teleDisableTip">
                            <el-input v-model="formModel.teleDisableTip" />
                        </el-form-item>
                        <el-form-item label="是否启用僵尸击杀奖励">
                            <el-switch v-model="formModel.killZombieTrigger.isEnabled" />
                        </el-form-item>
                        <el-form-item class="label" :label="`执行指令\n(每行一条)`">
                            <MyTextarea v-model="formModel.killZombieTrigger.executeCommands"></MyTextarea>
                        </el-form-item>
                        <el-form-item label="是否启用死亡惩罚">
                            <el-switch v-model="formModel.deathTrigger.isEnabled" />
                        </el-form-item>
                        <el-form-item class="label" :label="`执行指令\n(每行一条)`">
                            <MyTextarea v-model="formModel.deathTrigger.executeCommands"></MyTextarea>
                        </el-form-item>
                        <el-form-item label="是否启用自动重启">
                            <el-switch v-model="formModel.autoRestart.isEnabled" />
                        </el-form-item>
                        <el-form-item label="自动重启时间">
                            <el-time-select v-model="autoRestartTime" style="width: 240px" start="00:00" step="00:30" end="23:59" placeholder="选择时间" />
                        </el-form-item>
                        <el-form-item class="label" :label="`自动重启提示\n(每行一条)`">
                            <MyTextarea v-model="formModel.autoRestart.messages"></MyTextarea>
                        </el-form-item>
                        <el-form-item label="是否禁止家庭共享账号" prop="blockFamilySharingAccount">
                            <el-switch v-model="formModel.blockFamilySharingAccount" />
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
    name: 'GlobalSettings',
};
</script>

<script setup>
import * as api from '~/api/settings.js';
import myconfirm from '~/utils/myconfirm';

const autoRestartTime = computed({
    get() {
        return formModel.autoRestart.restartHour.toString().padStart(2, '0') + ':' + formModel.autoRestart.restartMinute.toString().padStart(2, '0');
    },
    set(value) {
        const split = value.split(':');
        formModel.autoRestart.restartHour = parseInt(split[0]);
        formModel.autoRestart.restartMinute = parseInt(split[1]);
    },
});

const formModel = reactive({
    serverName: '',
    chatCommandPrefix: '',
    chatCommandSeparator: '',
    handleChatMessageError: '',
    teleZombieCheck: false,
    teleDisableTip: '',
    killZombieTrigger: {
        isEnabled: false,
        executeCommands: [],
    },
    deathTrigger: {
        isEnabled: false,
        executeCommands: [],
    },
    autoRestart: {
        isEnabled: false,
        restartHour: 0,
        restartMinute: 0,
        messages: [],
    },
    blockFamilySharingAccount: false,
});

const formRef = ref();

const rules = {
    serverName: [{ required: true, message: '请输入服务器名称', trigger: 'blur' }],
    handleChatMessageError: [{ required: true, message: '请输入聊天消息错误提示', trigger: 'blur' }],
};

const getData = async () => {
    const data = await api.getSettings('GlobalSettings');
    Object.assign(formModel, data);
};
getData();

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('GlobalSettings', formModel);
        ElMessage.success('保存成功');
    } catch {}
};

const reset = async () => {
    try {
        if (await myconfirm('确定重置配置吗?')) {
            await api.resetSettings('GlobalSettings', formModel);
            await getData();
            ElMessage.success('重置成功');
        }
    } catch {}
};
</script>

<style scoped lang="scss">
.global-settings {
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
