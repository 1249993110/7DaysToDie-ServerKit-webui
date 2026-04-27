<template>
    <el-dialog
        v-model="dialogVisible"
        :title="t('csvImport.title')"
        width="600px"
        :close-on-click-modal="false"
        @close="handleClose"
    >
        <el-upload
            v-if="!importing && !importResult"
            ref="uploadRef"
            :auto-upload="false"
            accept=".csv,.txt"
            :limit="1"
            :on-change="handleFileChange"
            :on-exceed="handleExceed"
            drag
        >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                {{ t('csvImport.dragTip') }}
            </div>
            <template #tip>
                <div class="el-upload__tip">
                    {{ t('csvImport.formatTip') }}
                    <el-link type="primary" @click.stop="downloadTemplate">
                        {{ t('csvImport.downloadTemplate') }}
                    </el-link>
                </div>
            </template>
        </el-upload>

        <div v-if="importing" class="import-progress">
            <el-progress :percentage="100" :indeterminate="true" />
            <p>{{ t('csvImport.importing') }}</p>
        </div>

        <div v-if="importResult" class="import-result">
            <el-result
                :icon="importResult.success ? 'success' : 'warning'"
                :title="resultTitle"
            >
                <template #sub-title>
                    <div v-if="importResult.failureCount > 0">
                        <p>{{ t('csvImport.successCount', { count: importResult.successCount }) }}</p>
                        <p>{{ t('csvImport.failureCount', { count: importResult.failureCount }) }}</p>
                        <el-button type="primary" @click="downloadFailures">
                            {{ t('csvImport.downloadFailures') }}
                        </el-button>
                    </div>
                </template>
            </el-result>

            <el-table
                v-if="importResult.failures && importResult.failures.length > 0"
                :data="importResult.failures"
                max-height="300"
                style="margin-top: 20px"
            >
                <el-table-column prop="rowNumber" :label="t('csvImport.rowNumber')" width="80" />
                <el-table-column :label="t('csvImport.errorMessage')">
                    <template #default="{ row }">
                        <div v-for="(error, index) in row.errors" :key="index" class="error-item">
                            {{ error }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <template #footer>
            <el-button @click="handleClose">
                {{ importResult ? t('global.button.close') : t('global.button.cancel') }}
            </el-button>
            <el-button
                v-if="!importing && !importResult"
                type="primary"
                :disabled="!selectedFile"
                @click="handleImport"
            >
                {{ t('csvImport.startImport') }}
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { UploadFilled } from '@element-plus/icons-vue';

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    moduleType: {
        type: String,
        required: true,
        validator: (value) => {
            return ['goods', 'vipGift', 'cdKey', 'pointsInfo', 'itemList', 'commandList'].includes(value);
        }
    },
    importApi: {
        type: Function,
        required: true
    },
    templateApi: {
        type: Function,
        required: true
    }
});

const emit = defineEmits(['update:visible', 'success']);

const { t } = useI18n();

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
});

const uploadRef = ref();
const selectedFile = ref(null);
const importing = ref(false);
const importResult = ref(null);

const resultTitle = computed(() => {
    if (!importResult.value) return '';
    
    if (importResult.value.success) {
        return t('csvImport.importSuccess', { count: importResult.value.successCount });
    } else if (importResult.value.failureCount > 0) {
        return t('csvImport.partialSuccess', {
            success: importResult.value.successCount,
            failure: importResult.value.failureCount
        });
    } else {
        return t('csvImport.importFailed');
    }
});

const handleFileChange = (file) => {
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (extension !== '.csv' && extension !== '.txt') {
        ElMessage.error(t('csvImport.fileFormatError'));
        uploadRef.value.clearFiles();
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        ElMessage.error(t('csvImport.fileSizeError'));
        uploadRef.value.clearFiles();
        return;
    }

    selectedFile.value = file.raw;
};

const handleExceed = () => {
    ElMessage.warning(t('csvImport.fileExceedError'));
};

const handleImport = async () => {
    if (!selectedFile.value) {
        return;
    }

    importing.value = true;
    importResult.value = null;

    try {
        const formData = new FormData();
        formData.append('file', selectedFile.value);

        const result = await props.importApi(formData);
        importResult.value = result;

        if (result.success) {
            ElMessage.success(t('csvImport.importSuccess', { count: result.successCount }));
            emit('success');
        } else {
            ElMessage.warning(t('csvImport.importFailed'));
        }
    } catch (error) {
        console.error('Import error:', error);
        ElMessage.error(error.message || t('csvImport.importError'));
        importResult.value = {
            success: false,
            totalCount: 0,
            successCount: 0,
            failureCount: 0,
            failures: [],
            errorMessage: error.message || t('csvImport.importError')
        };
    } finally {
        importing.value = false;
    }
};

const downloadTemplate = async () => {
    try {
        const blob = await props.templateApi();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${props.moduleType}_template.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download template error:', error);
        ElMessage.error(t('csvImport.downloadTemplateError'));
    }
};

const downloadFailures = () => {
    if (!importResult.value || !importResult.value.failures) {
        return;
    }

    let csv = `${t('csvImport.rowNumber')},${t('csvImport.errorMessage')}\n`;
    importResult.value.failures.forEach(failure => {
        const errors = failure.errors.join('; ');
        csv += `${failure.rowNumber},"${errors}"\n`;
    });

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${props.moduleType}_failures.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

const handleClose = () => {
    if (importResult.value && importResult.value.success) {
        emit('success');
    }
    
    selectedFile.value = null;
    importing.value = false;
    importResult.value = null;
    if (uploadRef.value) {
        uploadRef.value.clearFiles();
    }
    
    dialogVisible.value = false;
};
</script>

<style scoped lang="scss">
.import-progress {
    text-align: center;
    padding: 40px 20px;

    p {
        margin-top: 20px;
        color: var(--el-text-color-regular);
    }
}

.import-result {
    .error-item {
        margin: 4px 0;
        color: var(--el-color-danger);
    }
}

:deep(.el-upload) {
    width: 100%;
}

:deep(.el-upload-dragger) {
    width: 100%;
}
</style>
