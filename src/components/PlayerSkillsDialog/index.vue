<template>
    <el-dialog class="player-skills-dialog" width="63%" draggable :close-on-click-modal="false" :show-close="false" :fullscreen="fullscreen">
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                <h1 :id="titleId" :class="titleClass">{{ title }}</h1>
                <span style="margin-left: auto">
                    <el-text style="margin: 0 4px" type="success">{{ t('components.playerSkillsDialog.fold') }}</el-text>
                    <el-switch v-model="expand" style="--el-switch-on-color: #409eff; --el-switch-off-color: #13ce66"></el-switch>
                    <el-text style="margin: 0 4px" type="primary">{{ t('components.playerSkillsDialog.expand') }}</el-text>
                </span>
                <el-tooltip effect="dark" :content="fullscreen ? t('components.playerSkillsDialog.exitFullscreen') : t('components.playerSkillsDialog.fullscreen')" placement="right">
                    <IconButton @click="fullscreen = !fullscreen">
                        <icon-mdi-fullscreen-exit v-show="fullscreen" />
                        <icon-mdi-fullscreen v-show="!fullscreen" />
                    </IconButton>
                </el-tooltip>
                <IconButton style="margin-left: auto" @click="close">
                    <Close />
                </IconButton>
            </div>
        </template>
        <el-tabs type="border-card" v-loading="loading" v-model="activeTab">
            <el-tab-pane v-for="(item, index) in skills" :key="index" :name="index.toString()" lazy>
                <template #label>
                    <span class="custom-tabs-label">
                        <GameIcon v-if="item.icon" isUiIcon :name="item.icon" :size="24" backgroundColor="#4d4d4d" />
                        <span>{{ (item.localizationName || item.name) + ` (${t('components.playerSkillsDialog.tableHeader.level')}:${item.level})` }}</span>
                    </span>
                </template>
                <Table :skills="item.children" :expand-row-keys="expandRowKeys" :default-expand-all="expand" :height="fullscreen ? 'calc(100vh - 180px)' : '56vh'"></Table>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script setup>
import { getPlayerSkills } from '~/api/player-skills';
import Table from './Table.vue';
import { Close } from '@element-plus/icons-vue';
import { i18n } from '~/plugins/i18n';
const { t } = i18n.global;

const props = defineProps({
    title: {
        type: String,
    },
    playerId: {
        type: String,
    },
});

const loading = ref(true);
const skills = ref([]);
const localeStore = useLocaleStore();
getPlayerSkills(props.playerId, localeStore.getLanguage())
    .then((data) => {
        skills.value = data;
    })
    .finally(() => {
        loading.value = false;
    });

const activeTab = ref('0');
const expand = ref(false);
const expandRowKeys = ref([]);

watch(expand, (val) => {
    if (val) {
        expandRowKeys.value = skills.value[parseInt(activeTab.value)].children.map((i) => i.name);
    } else {
        expandRowKeys.value = [];
    }
});

const fullscreen = ref(false);
</script>

<style lang="scss" scoped>
.player-skills-dialog {
    .my-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;
    }
    .el-tabs {
        :deep(.el-tabs__item) {
            padding: 0 8x;
        }
    }
    .custom-tabs-label {
        :deep(.el-image) {
            vertical-align: middle;
        }
        :deep(span) {
            vertical-align: middle;
            margin-left: 4px;
        }
    }
}
</style>
