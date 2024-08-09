<template>
    <MyDialogForm titleSuffix="黑名单" :formModel="formModel" :rules="rules" :request="request">
        <template #default="{ isAdd }">
            <el-form-item label="玩家Id" prop="playerId">
                <el-input :disabled="!isAdd" v-model="formModel.playerId"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="displayName">
                <el-input v-model="formModel.displayName"></el-input>
            </el-form-item>
            <el-form-item label="解封日期" prop="bannedUntil">
                <el-date-picker v-model="formModel.bannedUntil" type="datetime" placeholder="选择日期" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm:00" />
            </el-form-item>
            <el-form-item label="封禁原因" prop="reason">
                <el-input v-model="formModel.reason" type="textarea" :rows="5"></el-input>
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import * as api from '~/api/blacklist';

const props = defineProps({
    playerId: String,
    displayName: String,
});

const formModel = reactive({
    playerId: props.playerId,
    displayName: props.displayName,
    bannedUntil: '',
    reason: '',
});

const rules = {
    playerId: [{ required: true, message: '必填项', trigger: 'blur' }],
    bannedUntil: [{ required: true, message: '必填项', trigger: 'blur' }],
};

const request = async (isAdd) => {
    let result;
    if (isAdd) {
        result = await api.addBlacklist([formModel]);
    } else {
        await api.deleteBlacklist([formModel.playerId]);
        result = await api.addBlacklist([formModel]);
    }

    ElNotification({
        title: '命令执行结果',
        type: 'info',
        message: h('i', { style: 'color: teal' }, result[0]),
    });
};
</script>
