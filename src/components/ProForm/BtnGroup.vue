<template>
    <div class="btn-group">
        <template v-if="reverse">
            <el-button v-if="reset?.visible ?? true" :type="reset?.type ?? 'default'" @click="emit('reset')" :icon="reset?.icon">
                {{ reset?.label ?? t('global.button.reset') }}
            </el-button>
            <el-button v-if="submit?.visible ?? true" :type="submit?.type ?? 'primary'" @click="emit('submit')" :icon="submit?.icon">
                {{ submit?.label ?? t('global.button.submit') }}
            </el-button>
            <el-button v-if="cancel?.visible" :type="cancel?.type ?? 'default'" @click="emit('cancel')" :icon="cancel?.icon">
                {{ cancel?.label ?? t('global.button.cancel') }}
            </el-button>
        </template>
        <template v-else>
            <el-button v-if="cancel?.visible" :type="cancel?.type ?? 'default'" @click="emit('cancel')" :icon="cancel?.icon">
                {{ cancel?.label ?? t('global.button.cancel') }}
            </el-button>
            <el-button v-if="submit?.visible ?? true" :type="submit?.type ?? 'primary'" @click="emit('submit')" :icon="submit?.icon">
                {{ submit?.label ?? t('global.button.submit') }}
            </el-button>
            <el-button v-if="reset?.visible ?? true" :type="reset?.type ?? 'default'" @click="emit('reset')" :icon="reset?.icon">
                {{ reset?.label ?? t('global.button.reset') }}
            </el-button>
        </template>
    </div>
</template>

<script setup>
const { t } = useI18n();

const props = defineProps({
    reverse: {
        type: Boolean,
        default: false,
    },
    position: {
        type: String,
        default: 'left',
    },
    gutter: {
        type: [String, Number],
        default: 12,
    },
    cancel: {
        type: Object,
        default() {
            return {
                type: 'default',
                visible: false,
            };
        },
    },
    submit: {
        type: Object,
        default() {
            return {
                type: 'primary',
                visible: false,
            };
        },
    },
    reset: {
        type: Object,
        default() {
            return {
                type: 'default',
                visible: false,
            };
        },
    },
});

const emit = defineEmits(['cancel', 'submit', 'reset']);

const gutter = computed(() => addUnit(props.gutter));
</script>

<style scoped lang="scss">
.btn-group {
    display: flex;
    justify-content: v-bind(position);
    width: 100%;
    .el-button + .el-button {
        margin-left: v-bind(gutter);
    }
}
</style>
