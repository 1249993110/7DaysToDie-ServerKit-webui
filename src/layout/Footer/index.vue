<template>
    <div class="footer">
        <a href="https://github.com/1249993110/7DaysToDie-ServerKit" target="_blank">{{ t('layout.footer.codeRepository') }}</a>
        <a href="https://7dtd.top" target="_blank">{{ version + ' ' + t('layout.footer.copyright') }}</a>
        <a :href="t('layout.footer.group.url')" target="_blank">
            {{ t('layout.footer.group.title') }}
        </a>
    </div>
</template>

<script setup>
const version = import.meta.env.VITE_APP_VERSION;
const { t } = useI18n();
</script>

<style scoped lang="scss">
.footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    background-color: var(--ty-main-bg-color);
    border-top: var(--ty-border);
    box-sizing: border-box;
    padding: 10px 20px;
    a {
        font-size: 12px;
        color: #858585;
        text-decoration: none;
        letter-spacing: 0.5px;
    }
    span {
        font-size: 12px;
        color: #858585;
        text-decoration: none;
        letter-spacing: 0.5px;
    }
}
</style>
