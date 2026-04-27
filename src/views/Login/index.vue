<template>
    <div class="login-page" :class="{ 'is-dark': isDark }">
        <div class="bg-layer">
            <div class="blob blob-1"></div>
            <div class="blob blob-2"></div>
            <div class="blob blob-3"></div>
            <div class="bubbles">
                <span v-for="i in 20" :key="i" class="bubble" :style="bubbleStyle()"></span>
            </div>
            <svg class="wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path fill="rgba(14,165,233,0.06)" d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,234.7C672,245,768,235,864,208C960,181,1056,139,1152,133.3C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                <path fill="rgba(56,189,248,0.04)" d="M0,288L48,272C96,256,192,224,288,218.7C384,213,480,235,576,245.3C672,256,768,256,864,234.7C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
        </div>

        <div class="login-card">
            <h1 class="brand">TianYi</h1>
            <p class="brand-sub">{{ localeStore.getAppTitle() }}</p>

            <el-form :model="formModel" :rules="rules" ref="loginRef" label-width="0px" class="login-form">
                <el-form-item prop="username">
                    <div class="input-group">
                        <el-icon class="input-icon"><User /></el-icon>
                        <el-input :placeholder="t('views.login.username')" v-model="formModel.username" autofocus size="large" />
                    </div>
                </el-form-item>
                <el-form-item prop="password">
                    <div class="input-group">
                        <el-icon class="input-icon"><Lock /></el-icon>
                        <el-input :placeholder="t('views.login.password')" v-model="formModel.password" type="password" @keyup.enter="submitForm" size="large" show-password />
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="large" @click="submitForm" class="login-btn">{{ t('views.login.login') }}</el-button>
                </el-form-item>
            </el-form>

            <div class="divider"><span>OR</span></div>

            <a :href="loginThroughSteam" class="steam-btn">
                <svg viewBox="0 0 256 259" class="steam-icon" xmlns="http://www.w3.org/2000/svg"><path d="M127.779 0C57.852 0 .674 55.143.029 124.386L68.59 152.68a36.296 36.296 0 0 1 20.539-6.352c.687 0 1.363.03 2.033.076l30.73-44.543v-.625c0-26.9 21.887-48.787 48.793-48.787 26.9 0 48.793 21.893 48.793 48.805 0 26.9-21.893 48.793-48.793 48.793-.37 0-.734-.012-1.098-.024l-43.835 31.288c.03.541.047 1.086.047 1.637 0 20.19-16.42 36.604-36.61 36.604-18.076 0-33.14-13.2-36.058-30.469L2.681 166.727C18.895 218.95 68.398 257.373 127.779 257.373c70.71 0 128.029-57.313 128.029-128.029V128.7C255.19 57.62 198.489 0 127.779 0" fill="currentColor"/></svg>
                <span>Steam {{ t('views.login.login') }}</span>
            </a>
        </div>
    </div>
</template>

<script>
export default { name: 'login' };
</script>

<script setup>
import { User, Lock } from '@element-plus/icons-vue';
import { disposeAllStores } from '~/plugins/pinia';
disposeAllStores();

const localeStore = useLocaleStore();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const userInfoStore = useUserInfoStore();

const formModel = reactive({ username: '', password: '' });
const isDark = useDark();
const rules = {
    username: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
    password: [{ required: true, message: t('global.formRule.required'), trigger: 'blur' }],
};

const loginRef = ref();
const submitForm = async () => {
    try {
        await loginRef.value.validate();
        try {
            await userInfoStore.login(formModel.username, formModel.password);
            ElMessage.success(t('views.login.loginSuccess'));
            router.push(route.query.redirect ?? '/');
        } catch (error) {
            ElMessage.error(t('views.login.loginFailed'));
            console.error(error);
        }
    } catch {}
};

const bubbleStyle = () => {
    const size = Math.random() * 60 + 20;
    return {
        left: Math.random() * 100 + '%',
        width: size + 'px',
        height: size + 'px',
        animationDelay: (Math.random() * 12) + 's',
        animationDuration: (Math.random() * 10 + 12) + 's',
        opacity: Math.random() * 0.3 + 0.05,
    };
};

const returnUrl = encodeURIComponent(window.location.origin + '/api/auth/steam/return?redirect=' + (route.query.redirect ?? '/'));
const loginThroughSteam =
    'https://steamcommunity.com/openid/login?openid.ns=http://specs.openid.net/auth/2.0&openid.mode=checkid_setup&openid.return_to=' +
    returnUrl + '&openid.realm=' + returnUrl +
    '&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select';
</script>

<style scoped lang="scss">
.login-page {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: var(--login-bg);
    overflow: hidden; position: relative;

    --login-bg: linear-gradient(160deg, #f0f9ff 0%, #e0f2fe 30%, #f0f9ff 60%, #e8f4fd 100%);
    --login-blob-1: rgba(56, 189, 248, 0.15);
    --login-blob-2: rgba(125, 211, 252, 0.12);
    --login-blob-3: rgba(186, 230, 253, 0.18);
    --login-bubble-bg: linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(186, 230, 253, 0.08));
    --login-bubble-border: rgba(56, 189, 248, 0.1);
    --login-card-bg: rgba(255, 255, 255, 0.7);
    --login-card-border: rgba(255, 255, 255, 0.8);
    --login-card-shadow: 0 20px 60px rgba(14, 165, 233, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
    --login-input-bg: #fff;
    --login-input-border: #d6e8f5;
    --login-input-color: #0c1e2e;
    --login-input-placeholder: #a0bdd0;
    --login-icon-bg: linear-gradient(135deg, #e0f2fe, #f0f9ff);
    --login-icon-border: #d6e8f5;
    --login-icon-color: #0ea5e9;
    --login-divider: #d6e8f5;
    --login-divider-text: #94a8b8;
    --login-steam-bg: #fff;
    --login-steam-border: #d6e8f5;
    --login-steam-color: #475b6e;
    --login-steam-hover-bg: #f5faff;

    &.is-dark {
        --login-bg: linear-gradient(160deg, #080e14 0%, #0a1520 30%, #080e14 60%, #0c1218 100%);
        --login-blob-1: rgba(56, 189, 248, 0.08);
        --login-blob-2: rgba(14, 165, 233, 0.06);
        --login-blob-3: rgba(125, 211, 252, 0.05);
        --login-bubble-bg: linear-gradient(135deg, rgba(56, 189, 248, 0.06), rgba(14, 165, 233, 0.04));
        --login-bubble-border: rgba(56, 189, 248, 0.06);
        --login-card-bg: rgba(14, 24, 32, 0.8);
        --login-card-border: rgba(255, 255, 255, 0.06);
        --login-card-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.03) inset;
        --login-input-bg: rgba(255, 255, 255, 0.04);
        --login-input-border: rgba(255, 255, 255, 0.08);
        --login-input-color: #e0f2fe;
        --login-input-placeholder: #4a7a96;
        --login-icon-bg: linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(56, 189, 248, 0.08));
        --login-icon-border: rgba(255, 255, 255, 0.06);
        --login-icon-color: #38bdf8;
        --login-divider: rgba(255, 255, 255, 0.06);
        --login-divider-text: #3a5a72;
        --login-steam-bg: rgba(255, 255, 255, 0.04);
        --login-steam-border: rgba(255, 255, 255, 0.08);
        --login-steam-color: #7aacca;
        --login-steam-hover-bg: rgba(255, 255, 255, 0.08);
    }
}

.bg-layer { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }

.blob { position: absolute; border-radius: 50%; filter: blur(80px); }
.blob-1 { width: 500px; height: 500px; background: var(--login-blob-1); top: -10%; right: -5%; animation: blobFloat 18s ease-in-out infinite; }
.blob-2 { width: 400px; height: 400px; background: var(--login-blob-2); bottom: -8%; left: -5%; animation: blobFloat 22s ease-in-out infinite reverse; }
.blob-3 { width: 300px; height: 300px; background: var(--login-blob-3); top: 50%; left: 30%; animation: blobFloat 15s ease-in-out infinite; animation-delay: -6s; }

@keyframes blobFloat {
    0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
    33% { transform: translate(30px, -40px) scale(1.1) rotate(5deg); }
    66% { transform: translate(-20px, 30px) scale(0.9) rotate(-3deg); }
}

.bubbles { position: absolute; inset: 0; }
.bubble {
    position: absolute; bottom: -80px; border-radius: 50%;
    background: var(--login-bubble-bg);
    border: 1px solid var(--login-bubble-border);
    animation: rise linear infinite;
}

@keyframes rise {
    0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-110vh) translateX(40px) scale(0.6); opacity: 0; }
}

.wave { position: absolute; bottom: 0; left: 0; width: 100%; height: 200px; }

.login-card {
    position: relative; z-index: 1;
    width: 400px; padding: 44px 40px 36px;
    background: var(--login-card-bg);
    backdrop-filter: blur(20px) saturate(1.6);
    -webkit-backdrop-filter: blur(20px) saturate(1.6);
    border-radius: 24px;
    border: 1px solid var(--login-card-border);
    box-shadow: var(--login-card-shadow);

    &::before {
        content: '';
        position: absolute;
        top: -1px; left: 25%; right: 25%; height: 3px;
        background: linear-gradient(90deg, transparent, #38bdf8, #7dd3fc, #38bdf8, transparent);
        border-radius: 3px;
    }
}

.brand {
    font-family: 'Pacifico', cursive;
    font-size: 42px; text-align: center; margin: 0 0 12px;
    background: linear-gradient(135deg, #0ea5e9, #38bdf8, #0284c7);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 2px 6px rgba(14, 165, 233, 0.2));
}

.brand-sub {
    text-align: center; font-size: 14px;
    color: var(--ty-text-muted); margin: 0 0 40px; letter-spacing: 0.5px;
}

.login-form {
    .el-form-item { margin-bottom: 22px; }

    .input-group {
        position: relative; width: 100%;

        .input-icon {
            position: absolute; left: 0; top: 50%; transform: translateY(-50%);
            z-index: 1; width: 44px; height: 44px;
            display: flex; align-items: center; justify-content: center;
            color: var(--login-icon-color); font-size: 18px;
            background: var(--login-icon-bg);
            border-radius: 12px 0 0 12px;
            border-right: 1px solid var(--login-icon-border);
            pointer-events: none;
        }
    }

    :deep(.el-input__wrapper) {
        background: var(--login-input-bg);
        border: 1.5px solid var(--login-input-border);
        border-radius: 12px;
        box-shadow: 0 2px 6px rgba(14, 165, 233, 0.04) !important;
        padding-left: 48px; height: 44px;
        transition: all 0.2s ease;

        &:hover {
            border-color: #7dd3fc;
            box-shadow: 0 2px 10px rgba(14, 165, 233, 0.08) !important;
        }
        &.is-focus {
            border-color: #38bdf8;
            box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1), 0 2px 10px rgba(14, 165, 233, 0.08) !important;
        }
        .el-input__inner {
            color: var(--login-input-color); font-size: 15px; font-weight: 500;
            &:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus {
                -webkit-box-shadow: 0 0 0 1000px var(--login-input-bg) inset !important;
                -webkit-text-fill-color: var(--login-input-color) !important;
                transition: background-color 5000s ease-in-out 0s;
            }
            &::placeholder { color: var(--login-input-placeholder); font-weight: 400; }
        }
    }

    .login-btn {
        width: 100%; height: 50px;
        font-size: 16px; font-weight: 700;
        border-radius: 14px; border: none;
        background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%);
        box-shadow: 0 4px 18px rgba(14, 165, 233, 0.3);
        transition: all 0.2s ease;

        &:hover { box-shadow: 0 6px 24px rgba(14, 165, 233, 0.4); transform: translateY(-2px); }
        &:active { transform: translateY(0); box-shadow: 0 2px 10px rgba(14, 165, 233, 0.2); }
    }
}

.divider {
    display: flex; align-items: center; margin: 26px 0;
    &::before, &::after { content: ''; flex: 1; height: 1px; background: var(--login-divider); }
    span { padding: 0 16px; font-size: 11px; color: var(--login-divider-text); font-weight: 600; letter-spacing: 0.15em; }
}

.steam-btn {
    display: flex; align-items: center; justify-content: center;
    gap: 10px; width: 100%; padding: 13px 0;
    border-radius: 14px;
    background: var(--login-steam-bg);
    border: 1.5px solid var(--login-steam-border);
    color: var(--login-steam-color);
    text-decoration: none; font-size: 14px; font-weight: 600;
    transition: all 0.2s ease;
    .steam-icon { width: 20px; height: 20px; color: var(--login-steam-color); transition: color 0.2s ease; }
    &:hover {
        border-color: #38bdf8; color: #0ea5e9;
        background: var(--login-steam-hover-bg);
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(14, 165, 233, 0.1);
        .steam-icon { color: #0ea5e9; }
    }
}
</style>
