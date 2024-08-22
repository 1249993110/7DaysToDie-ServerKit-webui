<template>
    <div class="login-container">
        <div class="login-box">
            <div class="login-box-title">
                <span>{{ localeStore.getAppTitle() }}</span>
            </div>
            <el-form :model="formModel" :rules="rules" ref="loginRef" label-width="0px" class="login-box-content">
                <el-form-item prop="username">
                    <el-input :placeholder="$t('views.login.username')" v-model="formModel.username" tabindex="-1">
                        <template #prepend>
                            <el-button :icon="User" tabindex="-1"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :placeholder="$t('views.login.password')" v-model="formModel.password" type="password" @keyup.enter="submitForm" tabindex="1" autofocus>
                        <template #prepend>
                            <el-button :icon="Lock" tabindex="-1"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm" tabindex="-1">{{ $t('views.login.login') }}</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'login',
};
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

const formModel = reactive({
    username: '',
    password: '',
});
const rules = {
    username: [{ required: true, message: t('global.form.required'), trigger: 'blur' }],
    password: [{ required: true, message: t('global.form.required'), trigger: 'blur' }],
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
</script>

<style scoped>
.login-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(45, 58, 75);
}

.login-box {
    width: 360px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
    margin-bottom: 8vh;
}

.login-box-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: rgb(238, 238, 238);
    border-bottom: 1px solid #ddd;
    position: relative;
}

.login-box-content {
    padding: 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
</style>
