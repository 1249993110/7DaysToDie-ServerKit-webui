<template>
    <div style="width: 855px">
        <div class="bag">
            <div>背包</div>
            <el-scrollbar noresize always class="split" height="410px">
                <GameIconEx
                    v-for="(item, index) in bag"
                    :key="index"
                    :size="80"
                    :itemName="item.itemName"
                    :localizationName="item.localizationName"
                    :count="item.count"
                    :maxStackAllowed="item.maxStackAllowed"
                    :quality="item.quality"
                    :qualityColor="item.qualityColor"
                    :useTimes="item.useTimes"
                    :maxUseTimes="item.maxUseTimes"
                    :isMod="item.isMod"
                    :playerId="playerId"
                    backgroundColor="#afafaf"
                />
            </el-scrollbar>
        </div>
        <div class="equipment">
            <div>装备</div>
            <el-scrollbar noresize always class="split" height="410px">
                <GameIconEx
                    v-for="(item, index) in equipment"
                    :key="index"
                    :size="80"
                    :itemName="item.itemName"
                    :localizationName="item.localizationName"
                    :count="item.count"
                    :maxStackAllowed="item.maxStackAllowed"
                    :quality="item.quality"
                    :qualityColor="item.qualityColor"
                    :useTimes="item.useTimes"
                    :maxUseTimes="item.maxUseTimes"
                    :isMod="item.isMod"
                    backgroundColor="#afafaf"
                />
            </el-scrollbar>
        </div>
    </div>
    <div style="width: 820px">
        <div>腰带</div>
        <div class="belt">
            <GameIconEx
                v-for="(item, index) in belt"
                :key="index"
                :size="80"
                :itemName="item.itemName"
                :localizationName="item.localizationName"
                :count="item.count"
                :maxStackAllowed="item.maxStackAllowed"
                :quality="item.quality"
                :qualityColor="item.qualityColor"
                :useTimes="item.useTimes"
                :maxUseTimes="item.maxUseTimes"
                :isMod="item.isMod"
                :playerId="playerId"
                backgroundColor="#afafaf"
            />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    bag: {
        type: Array,
    },
    belt: {
        type: Array,
    },
    equipment: {
        type: Array,
    },
    playerId: {
        type: String,
    },
});
</script>

<style scoped lang="scss">
.bag {
    display: inline-block;
    width: 668px;
    vertical-align: top;
}
.equipment {
    display: inline-block;
    width: 180px;
    vertical-align: top;
    margin-left: 4px;
}
.belt {
    display: flex;
    flex-wrap: wrap;
}
.split {
    .el-scrollbar__view {
        display: flex;
        flex-wrap: wrap;
    }
}
</style>
