<template>
    <div class="global-settings">
        <el-card>
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" :rules="rules" ref="formRef" label-width="150px">
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
    name: 'GlobalSettings',
};
</script>

<script setup>
import * as api from '~/api/settings.js';

const formModel = reactive({
    serverName: '',
    chatCommandPrefix: '',
    chatCommandSeparator: '',
    handleChatMessageError: '',
});

const formRef = ref();

const rules = {
    serverName: [{ required: true, message: '请输入服务器名称', trigger: 'blur' }],
    handleChatMessageError: [{ required: true, message: '请输入聊天消息错误提示', trigger: 'blur' }],
};

api.getSettings('GlobalSettings')
    .then((data) => {
        Object.assign(formModel, data);
    })
    .catch((error) => {});

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('GlobalSettings', formModel);
        ElMessage.success('保存成功');
    } catch {}
};
</script>

<style scoped lang="scss">
.global-settings {
    .el-card {
        height: 100%;
        background-color: #ffffffaf;
        :deep(.el-card__body) {
            height: calc(100% - 40px);
        }
    }
}
</style>
