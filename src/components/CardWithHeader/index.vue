<template>
    <el-card :style="{ height: height, minHeight: minHeight }" class="card">
        <div class="header">
            <span>{{ header }}</span>
            <slot name="header-r" />
        </div>
        <div>
            <slot name="body" />
        </div>
    </el-card>
</template>

<script setup>
defineProps({
    header: String,
    height: String,
    minHeight: String,
});
</script>

<style scoped lang="scss">
.card {
    margin-top: 16px;
    margin-bottom: 16px;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
            position: relative;
            font-size: 15px;
            font-weight: 700;
            color: var(--ty-text-primary);
            margin-left: 14px;

            &::before {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: -14px;
                width: 3px;
                height: 16px;
                content: '';
                background: var(--ty-color-primary);
                border-radius: 2px;
            }
        }
    }

    div:nth-child(2) {
        margin-top: 16px;
    }
}
</style>
