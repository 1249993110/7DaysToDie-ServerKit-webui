<template>
    <el-drawer v-model="visible" :title="t('components.proTable.tableHeader.columnSetting')" :size="size">
        <div class="table-main">
            <el-table :data="columns" :border="true" height="calc(100vh - 128px)">
                <el-table-column prop="label" align="center" :label="t('components.proTable.tableHeader.columnName')" />
                <el-table-column v-slot="scope" prop="visible" align="center" :label="t('components.proTable.tableHeader.display')">
                    <el-switch v-model="scope.row.visible"></el-switch>
                </el-table-column>
            </el-table>
        </div>
    </el-drawer>
</template>

<script setup>
const { t } = useI18n();

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
    size: {
        type: [String, Number],
        default: 450,
    },
});

const visible = ref(false);

const open = () => {
    visible.value = true;
};
defineExpose({
    open: open,
});
</script>
