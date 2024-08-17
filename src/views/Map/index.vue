<template>
    <el-card>
        <div class="contanier">
            <div class="map" ref="mapRef"></div>
        </div>
    </el-card>
</template>

<script>
export default {
    name: 'Map',
};
</script>

<script setup>
import { initMap } from '~/plugins/map';
import { getMapInfo } from '~/api/map';

const mapRef = ref();

onMounted(async () => {
    const data = await getMapInfo();
    const mapInfo = {
        regionSize: 512,
        chunkSize: 16,
        tileSize: data.blockSize,
        maxZoom: data.maxZoom,
    };
    initMap(mapRef.value, mapInfo);
});
</script>

<style scoped lang="scss">
:deep(.el-card__body){
    padding: 0;
}
.contanier {
    height: calc(100vh - 90px);
    background-image: url(~/assets/images/map-background.jpg);
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
    background-size: cover;
    background-color: black;

    :deep(.map) {
        height: 100%;
        background-color: transparent;

        .leaflet-control {
            background-color: rgba(50, 50, 50, 0.6);
            color: orange;
            box-shadow: 0 3px 14px rgba(0, 0, 0, 0.5);
        }

        a,
        a:hover,
        .leaflet-container a,
        .leaflet-container a:hover {
            text-decoration: none;
            color: orangered;
        }

        .webmap-control {
            border-radius: 5px;
            padding: 6px 10px 6px 6px;
            white-space: nowrap;
        }

        .leaflet-popup-tip,
        .leaflet-popup-content-wrapper {
            background-color: rgba(50, 50, 50, 0.8);
            color: orange;
        }

        .invalid-input {
            background-color: #f00;
        }

        .game-time {
            position: fixed;
            left: 50%;
        }

        .render-map {
            cursor: pointer;
        }
    }
}
</style>
