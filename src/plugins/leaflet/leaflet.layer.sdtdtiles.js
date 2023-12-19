import { useUserInfoStore } from '~/store/user-info';

export function getSdtdTileLayer(mapInfo, initTime, isMiniMap = false) {
    const token = useUserInfoStore().token;
    const url = import.meta.env.VITE_APP_MAP_TILE_URL + `{z}/{x}/{y}?access-token=${token}&t={time}`;
    const tileLayer = L.tileLayer(url, {
        maxZoom: isMiniMap ? mapInfo.maxZoom : mapInfo.maxZoom + 1,
        minZoom: isMiniMap ? -1 : Math.max(0, mapInfo.maxZoom - 5),
        maxNativeZoom: mapInfo.maxZoom,
        minNativeZoom: 0,
        tileSize: mapInfo.tileSize,
        time: initTime,
        attribution: '&copy; <a href="https://7dtd.illy.bz/wiki/Server%20fixes" target="_blank">Alloc Mod</a> contributors',
    });

    tileLayer.getTileUrl = function (coords) {
        coords.y = -coords.y - 1;
        return L.TileLayer.prototype.getTileUrl.bind(tileLayer)(coords);
    };

    return tileLayer;
}
