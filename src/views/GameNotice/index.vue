<template>
    <div class="game-store-settings">
        <RouterButton
            :buttons="[
                {
                    value: '游戏公告',
                    path: '/game-notice',
                },
            ]"
        >
        </RouterButton>
        <el-card class="card">
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" ref="formRef" label-width="150px" status-icon>
                        <el-form-item label="是否启用" prop="isEnabled">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item>
                        <el-form-item label="可用变量">
                            <el-tag v-for="(item, index) in variables" :key="index" class="tag">{{ '{' + item + '}' }}</el-tag>
                        </el-form-item>
                        <el-form-item label="欢迎通知" prop="welcomeNotice" required>
                            <el-input v-model="formModel.welcomeNotice" />
                        </el-form-item>
                        <el-form-item :label="`轮播通知\n(每行一条)`" prop="rotatingNotices">
                            <el-input v-model="formModel.rotatingNotices" type="textarea" :rows="5"></el-input>
                        </el-form-item>
                        <el-form-item label="轮播间隔" prop="rotatingInterval" required>
                            <el-input v-model="formModel.rotatingInterval" />
                        </el-form-item>
                        <el-form-item label="血月通知1" prop="bloodMoonNotice1" required>
                            <el-input v-model="formModel.bloodMoonNotice1" />
                        </el-form-item>
                        <el-form-item label="血月通知2" prop="bloodMoonNotice2" required>
                            <el-input v-model="formModel.bloodMoonNotice2" />
                        </el-form-item>
                        <el-form-item label="血月通知3" prop="bloodMoonNotice3" required>
                            <el-input v-model="formModel.bloodMoonNotice3" />
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
    name: 'GameNotice',
};
</script>

<script setup>
import * as api from '~/api/settings.js';

const formModel = reactive({});

const formRef = ref();

api.getSettings('GameNotice')
    .then((data) => {
        data.rotatingNotices = data.rotatingNotices.join('\n');
        Object.assign(formModel, data);
    })
    .catch((error) => {});

const save = async () => {
    try {
        await formRef.value.validate();
        const data = { ...formModel };
        data.rotatingNotices = data.rotatingNotices.split('\n');
        await api.updateSettings('GameNotice', data);
        ElMessage.success('保存成功');
    } catch {}
};

const variables = ['BloodMoonDays', 'BloodMoonStartTime', 'BloodMoonEndTime', 'EntityId', 'PlatformId', 'PlayerName'];
</script>

<style scoped lang="scss">
.game-store-settings {
    .card {
        margin-top: 20px;
        background-color: #ffffffaf;
        :deep(.el-card__body) {
            height: calc(100vh - 200px);
        }

        :deep(.el-form-item__label) {
            white-space: pre-line;
        }

        .tag {
            margin-right: 8px;
        }
    }
}
</style>
