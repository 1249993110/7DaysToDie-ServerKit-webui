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
import { i18n } from '~/plugins/i18n';

const { t } = i18n.global;

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
    padding: {
        type: [String, Number],
        default: 15,
    },
    margin: {
        type: [String, Number],
        default: 0,
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
const padding = computed(() => addUnit(props.padding));
const margin = computed(() => addUnit(props.margin));
</script>

<style scoped lang="scss">
.btn-group {
    display: flex;
    justify-content: v-bind(position);
    width: 100%;
    margin: v-bind(margin);
    .el-button{
        padding-left: v-bind(padding);
        padding-right: v-bind(padding);
    }
    .el-button + .el-button {
        margin-left: v-bind(gutter);
    }
}
</style>
