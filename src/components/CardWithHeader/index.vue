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
    margin-top: 20px;
    margin-bottom: 20px;
    .header {
        span {
            position: relative;
            font-size: 16px;
            font-weight: 500;
            margin-left: 18px;
            &::before {
                position: absolute;
                top: 4px;
                left: -13px;
                width: 4px;
                height: 14px;
                content: '';
                background: $primary-color;
                border-radius: 10px;
            }
        }
    }

    div:nth-child(2) {
        margin-top: 20px;
    }
}
</style>
