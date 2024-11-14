const coordToChunk = function (latlng, mapInfo) {
    const x = Math.floor((latlng.lat + 16777216) / mapInfo.chunkSize - 16777216 / mapInfo.chunkSize);
    const y = Math.floor((latlng.lng + 16777216) / mapInfo.chunkSize - 16777216 / mapInfo.chunkSize);
    return L.latLng(x, y);
};

const coordToRegion = function (latlng, mapInfo) {
    const x = Math.floor((latlng.lat + 16777216) / mapInfo.regionSize - 16777216 / mapInfo.regionSize);
    const y = Math.floor((latlng.lng + 16777216) / mapInfo.regionSize - 16777216 / mapInfo.regionSize);
    return L.latLng(x, y);
};

export function getRegionLayer(mapInfo) {
    const FormatRegionFileName = function (latlng) {
        return 'r.' + latlng.lat + '.' + latlng.lng + '.7rg';
    };

    const regionLayer = L.gridLayer({
        maxZoom: mapInfo.maxZoom + 1,
        minZoom: 0,
        maxNativeZoom: mapInfo.maxZoom + 1,
        tileSize: mapInfo.tileSize,
    });

    regionLayer.createTile = function (tilePoint) {
        const blockWorldSize = mapInfo.tileSize * Math.pow(2, mapInfo.maxZoom - tilePoint.z);
        const tileLeft = tilePoint.x * blockWorldSize;
        const tileBottom = (-1 - tilePoint.y) * blockWorldSize;
        const blockPos = L.latLng(tileLeft, tileBottom);

        const canvas = L.DomUtil.create('canvas', 'leaflet-tile');
        canvas.width = mapInfo.tileSize;
        canvas.height = mapInfo.tileSize;
        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 2;
        ctx.font = '900 24px "Tahoma", "Arial"';

        const lineCount = blockWorldSize / mapInfo.regionSize;
        if (lineCount >= 1) {
            let pos = 0;
            while (pos < mapInfo.tileSize) {
                // Vertical
                ctx.beginPath();
                ctx.moveTo(pos, 0);
                ctx.lineTo(pos, mapInfo.tileSize);
                ctx.stroke();

                // Horizontal
                ctx.beginPath();
                ctx.moveTo(0, pos);
                ctx.lineTo(mapInfo.tileSize, pos);
                ctx.stroke();

                pos += mapInfo.tileSize / lineCount;
            }
            ctx.fillText(FormatRegionFileName(coordToRegion(blockPos, mapInfo)), 4, mapInfo.tileSize - 5);
            ctx.strokeText(FormatRegionFileName(coordToRegion(blockPos, mapInfo)), 4, mapInfo.tileSize - 5);
        } else {
            if (tileLeft % mapInfo.regionSize == 0) {
                // Vertical
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, mapInfo.tileSize);
                ctx.stroke();
            }
            if (tileBottom % mapInfo.regionSize == 0) {
                // Horizontal
                ctx.beginPath();
                ctx.moveTo(0, mapInfo.tileSize);
                ctx.lineTo(mapInfo.tileSize, mapInfo.tileSize);
                ctx.stroke();
            }
            if (tileLeft % mapInfo.regionSize == 0 && tileBottom % mapInfo.regionSize == 0) {
                ctx.fillText(FormatRegionFileName(coordToRegion(blockPos, mapInfo)), 4, mapInfo.tileSize - 5);
                ctx.strokeText(FormatRegionFileName(coordToRegion(blockPos, mapInfo)), 4, mapInfo.tileSize - 5);
            }
        }
        return canvas;
    };

    return regionLayer;
}
