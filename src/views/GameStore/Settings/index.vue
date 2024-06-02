<template>
    <div class="game-store-settings">
        <el-card>
            <el-scrollbar always>
                <div style="margin-right: 16px">
                    <el-form :model="formModel" ref="formRef" label-width="150px" status-icon>
                        <el-form-item label="是否启用" prop="isEnabled">
                            <el-switch v-model="formModel.isEnabled" />
                        </el-form-item>
                        <el-form-item label="可用变量">
                            <el-tag v-for="(item, index) in variables" :key="index" class="tag">{{ '{' + item + '}' }}</el-tag>
                        </el-form-item>
                        <el-form-item label="查询商品列表命令" prop="queryListCmd" required>
                            <el-input v-model="formModel.queryListCmd" />
                        </el-form-item>
                        <el-form-item label="购买命令前缀" prop="buyCmdPrefix" required>
                            <el-input v-model="formModel.buyCmdPrefix" />
                        </el-form-item>
                        <el-form-item label="商品项目提示" prop="goodsItemTip" required>
                            <el-input v-model="formModel.goodsItemTip" />
                        </el-form-item>
                        <el-form-item label="购买成功提示" prop="buySuccessTip" required>
                            <el-input v-model="formModel.buySuccessTip" />
                        </el-form-item>
                        <el-form-item label="积分不足提示" prop="pointsNotEnoughTip" required>
                            <el-input v-model="formModel.pointsNotEnoughTip" />
                        </el-form-item>
                        <el-form-item label="没有商品提示" prop="noGoods" required>
                            <el-input v-model="formModel.noGoods" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="save">保存</el-button>
                        </el-form-item>
                    </el-form>
                    <div>
                        <el-text style="color: green">提示: 游戏内输入buy+横杠(-)+商品名称 购买</el-text>
                    </div>
                </div></el-scrollbar
            >
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'GameStore.Settings',
};
</script>

<script setup>
import * as api from '~/api/settings.js';

const formModel = reactive({});

const formRef = ref();

api.getSettings('GameStore')
    .then((data) => {
        Object.assign(formModel, data);
    })
    .catch((error) => {});

const save = async () => {
    try {
        await formRef.value.validate();
        await api.updateSettings('GameStore', formModel);
        ElMessage.success('保存成功');
    } catch {}
};

const variables = ['GoodsName', 'Price', 'SerialNumber', 'EntityId', 'PlatformId', 'PlayerName'];
</script>

<style scoped lang="scss">
.game-store-settings {
    .el-card {
        height: 100%;
        background-color: #ffffffaf;
        :deep(.el-card__body) {
            height: calc(100% - 40px);
        }
    }
    .tag {
        margin-right: 8px;
    }
}
</style>
