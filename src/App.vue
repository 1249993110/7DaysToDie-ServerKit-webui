<template>
    <el-config-provider :locale="locale === 'en' ? en : zhCn">
        <router-view />
    </el-config-provider>
</template>

<script setup>
import en from 'element-plus/dist/locale/en.mjs';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

const { locale } = useI18n();
</script>
