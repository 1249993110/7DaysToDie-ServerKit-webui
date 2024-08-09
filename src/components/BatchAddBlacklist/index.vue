<template>
    <MyDialogForm :formModel="formModel" :rules="rules" :request="request">
        <template #default="{ isAdd }">
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
    playerIds: Array,
    displayNames: Array,
});

const formModel = reactive({
    bannedUntil: '',
    reason: '',
});

const rules = {
    bannedUntil: [{ required: true, message: '必填项', trigger: 'blur' }],
};

const request = async () => {
    const data = [];
    for (let i = 0; i < props.playerIds.length; i++) {
        data.push({
            playerId: props.playerIds[i],
            displayName: props.displayNames[i],
            bannedUntil: formModel.bannedUntil,
            reason: formModel.reason,
        });
    }

    await api.addBlacklist(data);
};
</script>
