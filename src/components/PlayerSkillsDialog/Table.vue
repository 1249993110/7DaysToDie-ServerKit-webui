<template>
    <el-table :data="skills" row-key="name">
        <el-table-column prop="name" label="技能名称" />
        <el-table-column prop="localizationName" label="本地化名称" />
        <el-table-column prop="level" label="等级" />
        <el-table-column prop="costForNextLevel" label="升级需要技能点" />
        <el-table-column prop="localizationDesc" label="说明" />
    </el-table>
</template>

<script setup>
const props = defineProps({
    skills: Array,
});
</script>