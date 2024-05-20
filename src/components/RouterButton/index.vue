<template>
    <el-card class="router-card">
        <el-radio-group v-model="activeName" @change="handleChange">
            <el-radio-button class="router-card-button" :value="button.value" v-for="(button, index) in buttonArray" size="large" :key="index">
                <span>{{ button.value }}</span>
            </el-radio-button>
        </el-radio-group>
        <div class="router-card-right">
            <slot name="route-button"></slot>
            <el-tooltip effect="dark" content="刷新" placement="bottom">
                <el-icon class="icon-button reload" size="22" @click="handleReload">
                    <icon-mdi-reload />
                </el-icon>
            </el-tooltip>
            <el-tooltip effect="dark" :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
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
    buttons: {
        type: Array,
        required: true,
    },
});

const buttonArray = computed(() => {
    return props.buttons;
});

const router = useRouter();
const activeName = ref('');
const routerToPath = (path) => {
    router.push({ path: path });
};
const routerToName = (name) => {
    router.push({ name: name });
};

const handleChange = (value) => {
    const btn = buttonArray.value.find((btn) => btn.value === value);
    if (!btn) return;
    if (btn.path) routerToPath(btn.path);
    else if (btn.name) routerToName(btn.name);
    activeName.value = btn.value;
};

onMounted(() => {
    if (buttonArray.value.length) {
        let isPathExist = false;
        const btn = buttonArray.value.find((btn) => btn.path === router.currentRoute.value.path);
        if (btn) {
            isPathExist = true;
            activeName.value = btn.value;
        }
        if (!isPathExist) {
            activeName.value = buttonArray.value[0].value;
        }
    }
});

const globalStore = useGlobalStore();
const handleReload = async () => {
    globalStore.isRouterAlive = false;
    nextTick(() => {
        globalStore.isRouterAlive = true;
    });
};

const isFullscreen = ref(false);
screenfull.on('change', () => {
    isFullscreen.value = screenfull.isFullscreen;
});
const handleScreenfull = () => {
    if (!screenfull.isEnabled) {
        ElMessage.warning('您的浏览器不支持全屏');
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
