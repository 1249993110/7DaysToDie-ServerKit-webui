<template>
    <el-table :data="skills" row-key="name" :indent="24">
        <el-table-column prop="name" label="技能名称" min-width="180px" show-overflow-tooltip>
            <template #default="{ row }">
                <span v-if="row.type == 'Skill' || row.type == 'BookGroup'" style="font-weight: bold">{{ row.name }}</span>
                <span v-else>{{ row.name }}</span>
            </template>
        </el-table-column>
        <el-table-column label="图标" width="65px" class-name="table-icon-col">
            <template #default="{ row }">
                <GameIcon isUiIcon :name="row.icon" :size="36" backgroundColor="#4d4d4d" :lazy="false" />
            </template>
        </el-table-column>
        <el-table-column prop="localizationName" label="本地化名称" min-width="150px" show-overflow-tooltip>
            <template #default="{ row }">
                <span v-if="row.type == 'Skill' || row.type == 'BookGroup'" style="font-weight: bold">{{ row.localizationName }}</span>
                <span v-else>{{ row.localizationName }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="level" label="等级" min-width="55px">
            <template #default="scope">
                {{ getValue(scope) }}
            </template>
        </el-table-column>
        <el-table-column prop="maxLevel" label="最大等级" min-width="80px">
            <template #default="scope">
                {{ getValue(scope) }}
            </template>
        </el-table-column>
        <el-table-column prop="costForNextLevel" label="升级需要技能点" min-width="125px">
            <template #default="scope">
                {{ getValue(scope) }}
            </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" min-width="95px" />
        <el-table-column prop="localizationDesc" label="说明" min-width="150px" show-overflow-tooltip />
    </el-table>
</template>

<script setup>
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
