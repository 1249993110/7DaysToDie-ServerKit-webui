<template>
    <el-table :data="skills" row-key="name" :indent="24">
        <el-table-column prop="name" :label="t('components.playerSkillsDialog.tableHeader.name')" min-width="180px" show-overflow-tooltip>
            <template #default="{ row }">
                <span v-if="row.type == 'Skill' || row.type == 'BookGroup'" style="font-weight: bold">{{ row.name }}</span>
                <span v-else>{{ row.name }}</span>
            </template>
        </el-table-column>
        <el-table-column :label="t('components.playerSkillsDialog.tableHeader.icon')" width="65px" class-name="table-icon-col">
            <template #default="{ row }">
                <GameIcon isUiIcon :name="row.icon" :size="36" backgroundColor="#4d4d4d" :lazy="false" />
            </template>
        </el-table-column>
        <el-table-column prop="localizationName" :label="t('components.playerSkillsDialog.tableHeader.localizationName')" min-width="150px" show-overflow-tooltip>
            <template #default="{ row }">
                <span v-if="row.type == 'Skill' || row.type == 'BookGroup'" style="font-weight: bold">{{ row.localizationName }}</span>
                <span v-else>{{ row.localizationName }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="level" :label="t('components.playerSkillsDialog.tableHeader.level')" min-width="55px">
            <template #default="scope">
                {{ getValue(scope) }}
            </template>
        </el-table-column>
        <el-table-column prop="maxLevel" :label="t('components.playerSkillsDialog.tableHeader.maxLevel')"min-width="80px">
            <template #default="scope">
                {{ getValue(scope) }}
            </template>
        </el-table-column>
        <el-table-column prop="costForNextLevel" :label="t('components.playerSkillsDialog.tableHeader.costForNextLevel')" min-width="80px">
            <template #default="scope">
                {{ getValue(scope) }}
            </template>
        </el-table-column>
        <el-table-column prop="type" :label="t('components.playerSkillsDialog.tableHeader.type')"min-width="95px" />
        <el-table-column prop="localizationDesc" :label="t('components.playerSkillsDialog.tableHeader.localizationDesc')" min-width="150px" show-overflow-tooltip />
    </el-table>
</template>

<script setup>
import { i18n } from '~/plugins/i18n';
const { t } = i18n.global;

const props = defineProps({
    skills: Array,
});

const getValue = ({ row, column }) => {
    if (row.type == 'Skill' || row.type == 'BookGroup') {
        return '';
    } else {
        return row[column.property];
    }
};
</script>
