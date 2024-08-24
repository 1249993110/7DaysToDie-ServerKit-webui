<template>
    <el-table :data="tableData" max-height="56vh" highlight-current-row>
        <el-table-column :label="t('components.inventoryDialog.tableHeader.icon')" width="86px" class-name="table-icon-col">
            <template #default="{ row }">
                <GameIconEx
                    :size="60"
                    :itemName="row.itemName"
                    :localizationName="row.localizationName"
                    :count="row.count"
                    :maxStackAllowed="row.maxStackAllowed"
                    :quality="row.quality"
                    :qualityColor="row.qualityColor"
                    :useTimes="row.useTimes"
                    :maxUseTimes="row.maxUseTimes"
                    :isMod="row.isMod"
                    :playerId="playerId"
                />
            </template>
        </el-table-column>
        <el-table-column prop="itemName" :label="t('components.inventoryDialog.tableHeader.itemName')" min-width="30%" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="localizationName" :label="t('components.inventoryDialog.tableHeader.localizationName')" min-width="20%" show-overflow-tooltip> </el-table-column>
        <el-table-column :label="t('components.inventoryDialog.tableHeader.mod')" class-name="table-icon-col" min-width="50%">
            <template #default="{ row }">
                <template v-if="row.parts && row.parts.length">
                    <GameIconEx
                        v-for="(item, index) in row.parts.filter((i) => i !== null)"
                        :key="index"
                        :size="60"
                        :itemName="item.itemName"
                        :localizationName="item.localizationName"
                        :count="item.count"
                        :maxStackAllowed="item.maxStackAllowed"
                        :quality="item.quality"
                        :qualityColor="item.qualityColor"
                        :useTimes="item.useTimes"
                        :maxUseTimes="item.maxUseTimes"
                        :isMod="item.isMod"
                    />
                </template>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup>
import { i18n } from '~/plugins/i18n';

const { t } = i18n.global;

const props = defineProps({
    tableData: {
        type: Array,
        required: true,
    },
    playerId: {
        type: String,
    },
});
</script>
