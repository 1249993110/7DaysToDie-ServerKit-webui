<template>
    <div class="footer">
        <a href="https://github.com/IceCoffee1024/7DaysToDie-ServerKit" target="_blank">{{ t('layout.footer.codeRepository') }}</a>
        <span class="sep">·</span>
        <a href="https://7dtd.top" target="_blank">{{ version + ' ' + t('layout.footer.copyright') }}</a>
        <span class="sep">·</span>
        <a :href="t('layout.footer.group.url')" target="_blank">{{ t('layout.footer.group.title') }}</a>
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
    justify-content: center;
    gap: 8px;
    height: 40px;
    background-color: var(--ty-main-bg-color);
    border-top: var(--ty-border);
    box-sizing: border-box;

    a {
        font-size: 11px;
        color: var(--ty-text-muted);
        text-decoration: none;
        letter-spacing: 0.3px;
        transition: color 0.12s ease;

        &:hover {
            color: var(--ty-color-accent);
        }
    }

    .sep {
        color: var(--ty-text-muted);
        font-size: 10px;
        opacity: 0.5;
    }
}
</style>
