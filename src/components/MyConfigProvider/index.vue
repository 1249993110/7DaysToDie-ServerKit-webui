<template>
    <el-config-provider :locale="locale">
        <slot />
    </el-config-provider>
</template>

<script setup>
import en from 'element-plus/dist/locale/en.mjs';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import zhTw from 'element-plus/dist/locale/zh-tw.mjs';

const localeStore = useLocaleStore();
const locale = computed(() => {
    switch (localeStore.locale) {
        case 'en':
            return en;
        case 'zh':
            return zhCn;
        case 'tw':
            return zhTw;
        default:
            console.error('Unknown locale:', localeStore.locale);
    }
});
</script>
