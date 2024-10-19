<template>
    <div class="toolbar">
        <div class="left">
            <el-button v-if="addBtnVisible" type="primary" :icon="Plus" @click="emit('addClick')">
                <template #default v-if="btnLabelVisible">{{ t('global.button.add') }}</template>
            </el-button>
            <el-button v-if="batchDeleteBtnVisible" type="danger" :icon="Delete" @click="emit('batchDeleteClick')" :disabled="!isSelected">
                <template #default v-if="btnLabelVisible">{{ t('global.button.batchDelete') }}</template>
            </el-button>
            <el-dropdown v-if="batchOperationItems?.length" @command="emit('batchOperationCommand')">
                <el-button type="success">
                    {{ t('global.button.batchOperation') }}<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item
                            v-for="item in batchOperationItems"
                            :key="item"
                            :command="item.command"
                            :disabled="typeof item.disabled === 'function' ? item.disabled(isSelected) : item.disabled"
                            :divided="item.divided"
                            :icon="item.icon"
                            @click="item.onClick?.call(item, selectedListIds, selectedList)"
                        >
                            <template #default="scope">
                                <component v-if="item.render" :is="item.render" v-bind="scope" />
                                <template v-else>{{ item.label }}</template>
                            </template>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="right">
            <el-button v-if="refreshBtnVisible" :icon="Refresh" circle @click="emit('refreshClick')" />
            <el-button v-if="settingBtnVisible" :icon="Operation" circle @click="emit('settingClick')" />
            <el-button v-if="searchBtnVisible" :icon="Search" circle @click="emit('searchClick')" />
        </div>
    </div>
</template>

<script setup>
import { Plus, Delete, Refresh, Search, ArrowDown, Operation } from '@element-plus/icons-vue';

const props = defineProps({
    selectedListIds: {
        type: Array,
        default: [],
    },
    selectedList: {
        type: Array,
        default: [],
    },
    isSelected: {
        type: Boolean,
        default: false,
    },
    addBtnVisible: {
        type: Boolean,
        default: true,
    },
    batchDeleteBtnVisible: {
        type: Boolean,
        default: true,
    },
    batchOperationItems: {
        type: Array,
        default: [],
    },
    btnLabelVisible: {
        type: Boolean,
        default: true,
    },
    refreshBtnVisible: {
        type: Boolean,
        default: true,
    },
    settingBtnVisible: {
        type: Boolean,
        default: true,
    },
    searchBtnVisible: {
        type: Boolean,
        default: true,
    }
});

const { t } = useI18n();
const emit = defineEmits(['addClick', 'batchDeleteClick', 'batchOperationCommand', 'refreshClick', 'settingClick', 'searchClick']);
</script>

<style scoped lang="scss">
.toolbar {
    display: flex;
    margin-bottom: 16px;
    .left {
        .el-button + .el-dropdown {
            margin-left: 12px;
        }
    }
    .right {
        margin-left: auto;
    }
}
</style>
