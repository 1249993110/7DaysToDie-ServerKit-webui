<template>
    <el-scrollbar class="overview">
        <el-descriptions :column="3" class="description" direction="vertical">
            <el-descriptions-item class-name="content" label-class-name="label" min-width="150px">
                <template #label>
                    <span class="label">服务器名称</span>
                </template>
                {{ data.serverName }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label" min-width="150px">
                <template #label>
                    <span class="label">服务器区域</span>
                </template>
                {{ data.region }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label">
                <template #label>
                    <span class="label">服务器语言</span>
                </template>
                {{ data.language }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label" min-width="150px">
                <template #label>
                    <span class="label">服务器 IP</span>
                </template>
                {{ data.serverIp }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label" min-width="150px">
                <template #label>
                    <span class="label">服务端正常运行时长</span>
                </template>
                {{ formatUptime(data.uptime) }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label">
                <template #label>
                    <span class="label">游戏时间</span>
                </template>
                {{ formatGameTime(data.gameTime) }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label">
                <template #label>
                    <span class="label">服务器端口</span>
                </template>
                {{ data.serverPort }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label">
                <template #label>
                    <span class="label">游戏名称</span>
                </template>
                {{ data.gameName }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label">
                <template #label>
                    <span class="label">游戏模式</span>
                </template>
                {{ data.gameMode }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label">
                <template #label>
                    <span class="label">服务端版本</span>
                </template>
                {{ data.serverVersion }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label">
                <template #label>
                    <span class="label">游戏世界</span>
                </template>
                {{ data.gameWorld }}
            </el-descriptions-item>
            <el-descriptions-item class-name="content" label-class-name="label">
                <template #label>
                    <span class="label">游戏难度</span>
                </template>
                {{ formatGameDifficulty(data.gameDifficulty) }}
            </el-descriptions-item>
        </el-descriptions>
    </el-scrollbar>
</template>

<script setup>
const props = defineProps({
    data: Object,
});

const formatUptime = (val) => {
    const duration = dayjs.duration(val, 'seconds');
    const days = parseInt(duration.asDays());
    const hours = duration.get('hours');
    const minutes = duration.get('minutes');
    const seconds = duration.get('seconds');

    let result = '';
    if(days > 0){
        result += `${days} 天`;
    }

    return `${result} ${duration.format('HH 小时 mm 分钟 ss 秒')}`;
};

const formatGameDifficulty = (val) => {
    switch (val) {
        case 0:
            return '拾荒者';
        case 1:
            return '冒险家';
        case 2:
            return '流浪者';
        case 3:
            return '战士';
        case 4:
            return '幸存者';
        case 5:
            return '疯狂';
        default:
            return val;
    }
};

const formatGameTime = (val) => {
    if (!val) return '';
    return `${val.days} 天 ${val.hours} 小时 ${val.minutes} 分钟`;
};
</script>

<style scoped lang="scss">
.overview {
    :deep(.description) {
        margin-left: 18px;
        height: 280px;
        // min-width: 460px;
        .label {
            font-weight: 400 !important;
            font-size: 15px !important;
            color: #1f2329;
            padding-bottom: 2px;
        }

        .content {
            font-size: 13px;
            padding-bottom: 20px;
            color: $primary-color;
            font-weight: 600;
        }
    }
}
</style>
