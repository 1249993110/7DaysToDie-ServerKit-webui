<template>
    <MyDialogForm :title="`给予 ${playerName} 物品`" :formModel="formModel" :rules="rules" :request="request" successMessage="发送成功" confirmBtnText="发送">
        <template #default="{ isAdd }">
            <el-form-item label="物品名称" prop="itemName">
                <ItemBlockSelector v-model="itemBlockSelectorVisible" @on-select="handleSelect" />
                <div style="width: 100%">
                    <div style="display: flex; align-items: center">
                        <el-image :src="getIconUrl(formModel)" style="width: 80px; height: 80px">
                            <template #error>
                                <div class="image-slot">
                                    <el-icon><icon-picture /></el-icon>
                                </div>
                            </template>
                        </el-image>
                        <el-button @click="itemBlockSelectorVisible = true" style="margin-left: 8px">选择物品</el-button>
                    </div>
                </div>
                <div style="display: flex; align-items: center">
                    <el-input v-model="formModel.itemName"></el-input>
                    <el-tag type="success" style="margin-left: 12px">{{ formModel.name }}</el-tag>
                </div>
            </el-form-item>
            <el-form-item label="数量" prop="count">
                <el-input-number v-model="formModel.count" :min="1" :max="1000000" />
            </el-form-item>
            <el-form-item label="品质" prop="quality">
                <el-input-number v-model="formModel.quality" :min="0" :max="7" />
            </el-form-item>
            <el-form-item label="耐久度%" prop="durability">
                <el-input-number v-model="formModel.durability" :min="0" :max="100" />
            </el-form-item>
            <el-form-item prop="itemIcon" v-show="false"> </el-form-item>
            <el-form-item prop="iconColor" v-show="false"> </el-form-item>
        </template>
    </MyDialogForm>
</template>

<script setup>
import { getIconUrl } from '~/utils/image-helper';
import { Picture as IconPicture } from '@element-plus/icons-vue';
import { giveItem } from '~/api/sdtd-console';

const props = defineProps({
    playerId: String,
    playerName: String,
});

const itemBlockSelectorVisible = ref(false);
const formModel = reactive({
    name: '',
    itemName: '',
    count: 1,
    quality: 1,
    durability: 100,
    itemIcon: '',
    iconColor: '',
});

const rules = {
    itemName: [{ required: true, message: '必填项', trigger: 'blur' }],
    count: [{ required: true, message: '必填项', trigger: 'blur' }],
};

const request = async () => {
    await giveItem(props.playerId, formModel.itemName, formModel.count, formModel.quality, formModel.durability);
};

const handleSelect = (item) => {
    formModel.name = item.localizationName;
    formModel.itemName = item.itemName;
    formModel.itemIcon = item.itemIcon;
    formModel.iconColor = item.iconColor;
    itemBlockSelectorVisible.value = false;
};
</script>

<style scoped lang="scss">
.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
}
</style>
