<template>
    <MyDialogForm :formModel="formModel" :rules="rules" :request="request">
        <template #default="{ isAdd }">
            <el-form-item :label="t('components.batchAddBlacklist.banUntil')" prop="bannedUntil">
                <el-date-picker v-model="formModel.bannedUntil" type="datetime" :placeholder="t('global.message.datePickerPlaceholder')" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm:00" />
            </el-form-item>
            <el-form-item :label="t('components.batchAddBlacklist.reason')" prop="reason">
                <el-input v-model="formModel.reason" type="textarea" :rows="5"></el-input>
            </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import * as api from '~/api/blacklist';
import { i18n } from '~/plugins/i18n';
const { t } = i18n.global;
const props = defineProps({
    playerIds: Array,
    displayNames: Array,
});

const formModel = reactive({
    bannedUntil: '',
    reason: '',
});

const rules = {
    bannedUntil: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
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
