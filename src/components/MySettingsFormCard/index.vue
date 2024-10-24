<template>
    <el-card class="card" shadow="always">
        <el-scrollbar always height="calc(100vh - 200px)">
            <ProForm
                class="form"
                label-position="left"
                :fields="fields"
                :col-span="24"
                :label-width="250"
                :model="formModel"
                :btn-group="btnGroup"
                :request="save"
                @submit="handleSubmit"
                @reset="handleReset"
                prevent-default-reset
                :custom-components="customComponents"
            >
                <template #[slot] v-for="slot in Object.keys($slots)">
                    <slot :name="slot" :form-model="formModel" />
                </template>
            </ProForm>
        </el-scrollbar>
    </el-card>
</template>

<script setup>
import * as api from '~/api/settings.js';
import MyTextarea from '~/components/MyTextarea/index.vue';
import Coordinate from '~/components/Coordinate/index.vue';

const props = defineProps({
    fields: {
        type: Array,
        required: true,
    },
    settingsName: {
        type: String,
        required: true,
    },
    localeKeyPrefix: {
        type: String,
        required: true,
    }
});

const { t } = useI18n();

const fields = computed(()=>{
    props.fields.forEach((item) => {
        if (item.name) {
            item.label = t(`${props.localeKeyPrefix}.${item.name}`);
        }
    });
    return props.fields;
});

const customComponents = {
    'my-textarea': MyTextarea,
    coordinate: Coordinate,
};

const formModel = reactive({});

const btnGroup = {
    submit: {
        label: t('global.button.save'),
        visable: true,
    },
    reset: {
        visable: true,
    },
};

const localeStore = useLocaleStore();
const getFormData = async () => {
    const data = await api.getSettings(props.settingsName, localeStore.getLanguage());
    Object.assign(formModel, data);
};
getFormData();

const save = async () => {
    await api.updateSettings(props.settingsName, formModel);
};

const handleSubmit = async () => {
    await getFormData();
    ElMessage.success(t('global.message.saveSuccess'));
};

const handleReset = async () => {
    if (await myconfirm(t('global.message.resetConfirm'))) {
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
            await api.resetSettings(props.settingsName, localeStore.getLanguage());
            await getFormData();
            ElMessage.success(t('global.message.resetSuccess'));
        } catch (error) {
            console.error(error);
        } finally {
            loading.close();
        }
    }
};

const globalStore = useGlobalStore();
const paddingRight = computed(() => (globalStore.isSmallScreen ? '20px' : 'calc(12vw + 20px)'));

defineExpose({
    formModel: formModel,
});
</script>

<style scoped lang="scss">
.card {
    margin-top: 20px;
    background-color: #ffffffaf;
    .form {
        padding-left: 20px;
        padding-right: v-bind(paddingRight);
    }
}
</style>
