<template>
    <el-card class="router-card">
        <el-radio-group v-model="defaultActive" @change="handleChange">
            <el-radio-button class="router-card-button" v-for="name in names" size="large" :key="name" :value="name">
                <span>{{ t('menus.' + name) }}</span>
            </el-radio-button>
        </el-radio-group>
        <div class="router-card-right">
            <slot name="route-button"></slot>
            <el-tooltip effect="dark" :content="t('components.routerButton.refresh')" placement="bottom">
                <el-icon class="icon-button reload" size="22" @click="handleReload">
                    <icon-mdi-reload />
                </el-icon>
            </el-tooltip>
            <el-tooltip effect="dark" :content="isFullscreen ? t('components.routerButton.exitFullscreen') : t('components.routerButton.fullscreen')" placement="bottom">
                <el-icon class="icon-button fullscreen" size="24" @click="handleScreenfull">
                    <icon-mdi-fullscreen-exit v-if="isFullscreen" />
                    <icon-mdi-fullscreen v-else />
                </el-icon>
            </el-tooltip>
        </div>
    </el-card>
</template>

<script setup>
import { useGlobalStore } from '~/store/global';
import screenfull from 'screenfull';

const props = defineProps({
    names: {
        type: Array,
        required: true,
    },
});

const { t } = useI18n();

const route = useRoute();
const defaultActive = ref('');
watch(
    () => route.name,
    (name) => {
        defaultActive.value = name;
    },
    { immediate: true }
);

const router = useRouter();
const handleChange = (name) => {
    router.push({ name: name });
};

const globalStore = useGlobalStore();
const handleReload = async () => {
    globalStore.isRouterAlive = false;
    await nextTick();
    globalStore.isRouterAlive = true;
};

const isFullscreen = ref(false);
screenfull.on('change', () => {
    isFullscreen.value = screenfull.isFullscreen;
});
const handleScreenfull = () => {
    if (!screenfull.isEnabled) {
        ElMessage.warning(t('components.routerButton.fullscreenNotSupport'));
    }

    screenfull.toggle();
};

onKeyStroke('F11', (e) => {
    e.preventDefault();
    handleScreenfull();
});
</script>

<style lang="scss">
.router-card {
    .el-card__body {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0;
    }

    .router-card-button {
        .el-radio-button__inner {
            min-width: 100px;
            height: 100%;
            background-color: white !important;
            box-shadow: none !important;
            border: 2px solid transparent !important;
        }

        .el-radio-button__original-radio:checked + .el-radio-button__inner {
            color: $primary-color;
            border-color: $primary-color !important;
            border-radius: 4px;
        }
    }

    .router-card-right {
        margin-left: auto;
        display: flex;
        align-items: center;
        .reload {
            &:hover {
                transform: rotate(360deg);
                transition: 0.6s linear;
            }
        }
        .fullscreen {
            margin: 0 12px;
        }
    }
}
</style>
