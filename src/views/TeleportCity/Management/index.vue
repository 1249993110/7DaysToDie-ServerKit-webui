<template>
    <div>
        <RouterButton
            :buttons="[
                {
                    value: '好友传送',
                    path: '/tele-system/friend',
                },
                {
                    value: '城镇配置',
                    path: '/tele-system/city/settings',
                },
                {
                    value: '城镇管理',
                    path: '/tele-system/city/management',
                },
                {
                    value: 'Home配置',
                    path: '/tele-system/home/settings',
                },
                {
                    value: 'Home管理',
                    path: '/tele-system/home/management',
                },
            ]"
        >
        </RouterButton>
        <MyTableEx
            style="margin-top: 20px"
            :show-searcher="false"
            :show-table-index="false"
            :show-export-btn="false"
            :show-pager="false"
            :show-add-btn="true"
            :show-edit-btn="true"
            :get-data="getData"
            :table-data="tableData"
            :delete="deleteRequest"
            :batch-delete="batchDeleteRequest"
            :add-or-edit-component="AddOrEditCityLocation"
            :addOrEditComponentProps="addOrEditComponentProps"
        >
            <template #columns>
                <el-table-column prop="id" label="城镇Id" width="120px" sortable> </el-table-column>
                <el-table-column prop="cityName" label="城镇名称" sortable> </el-table-column>
                <el-table-column prop="pointsRequired" label="传送需要积分" sortable> </el-table-column>
                <el-table-column prop="position" label="三维坐标"> </el-table-column>
                <el-table-column label="视角方向">
                    <template #default="{ row }">
                        {{ getLabel(row.viewDirection) }}
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建日期" sortable> </el-table-column>
            </template>
        </MyTableEx>
    </div>
</template>

<script>
export default {
    name: 'TeleportCity.Management',
};
</script>

<script setup>
import * as api from '~/api/city-location.js';
import AddOrEditCityLocation from './AddOrEditCityLocation.vue';
import { getLabel } from '~/utils/view-direction-options.js';

const tableData = ref([]);

const addOrEditComponentProps = ref({});
const getData = async () => {
    const data = await api.getCityLocations();
    if (data.length) {
        addOrEditComponentProps.value = { id: data[data.length - 1].id + 1 };
    }

    tableData.value = data;
};

const deleteRequest = async (row) => {
    return await api.deleteCityLocationByIds([row.id]);
};

const batchDeleteRequest = async (rows) => {
    return await api.deleteCityLocationByIds(rows.map((i) => i.id));
};
</script>
