<template>
    <el-config-provider :locale="locale">
        <slot />
    </el-config-provider>
</template>

<script setup>
import en from 'element-plus/dist/locale/en.mjs';
import de from 'element-plus/dist/locale/de.mjs';
import es from 'element-plus/dist/locale/es.mjs';
import fr from 'element-plus/dist/locale/fr.mjs';
import it from 'element-plus/dist/locale/it.mjs';
import ja from 'element-plus/dist/locale/ja.mjs';
import ko from 'element-plus/dist/locale/ko.mjs';
import pl from 'element-plus/dist/locale/pl.mjs';
import pt from 'element-plus/dist/locale/pt.mjs';
import ru from 'element-plus/dist/locale/ru.mjs';
import tr from 'element-plus/dist/locale/tr.mjs';
import zh from 'element-plus/dist/locale/zh-cn.mjs';
import tw from 'element-plus/dist/locale/zh-tw.mjs';

const localeStore = useLocaleStore();
const locale = computed(() => {
    switch (localeStore.locale) {
        case 'en':
            return en;
        case 'de':
            return de;
        case 'es':
            return es;
        case 'fr':
            return fr;
        case 'it':
            return it;
        case 'ja':
            return ja;
        case 'ko':
            return ko;
        case 'pl':
            return pl;
        case 'pt':
            return pt;
        case 'ru':
            return ru;
        case 'tr':
            return tr;
        case 'zh':
            return zh;
        case 'tw':
            return tw;
        default:
            return en;
    }
});
</script>
