<template>
    <MyDialogForm :titleSuffix="t('menus.blacklist')" :formModel="formModel" :rules="rules" :request="request">
        <template #default="{ isAdd }">
            <el-form-item :label="t('views.blacklist.tableHeader.playerId')" prop="playerId">
                <el-input :disabled="!isAdd" v-model="formModel.playerId"></el-input>
            </el-form-item>
            <el-form-item :label="t('views.blacklist.tableHeader.displayName')" prop="displayName">
                <el-input v-model="formModel.displayName"></el-input>
            </el-form-item>
            <el-form-item :label="t('views.blacklist.tableHeader.bannedUntil')" prop="bannedUntil">
                <el-date-picker v-model="formModel.bannedUntil" type="datetime" :placeholder="t('global.message.datePickerPlaceholder')" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm:00" />
            </el-form-item>
            <el-form-item :label="t('views.blacklist.tableHeader.reason')" prop="reason">
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
const { t } = useI18n();
const formModel = reactive({
    playerId: props.playerId,
    displayName: props.displayName,
    bannedUntil: '',
    reason: '',
});

const rules = {
    playerId: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    bannedUntil: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
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
        title: t('global.message.cmdExecResult'),
        type: 'info',
        message: h('i', { style: 'color: teal' }, result[0]),
    });
};
</script>
