<template>
    <el-config-provider :locale="localeStore.locale === 'en' ? en : zhCn">
        <slot />
    </el-config-provider>
</template>

<script setup>
import en from 'element-plus/dist/locale/en.mjs';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

const localeStore = useLocaleStore();
</script>
