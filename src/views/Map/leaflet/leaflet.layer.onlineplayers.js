import { getLocations } from '~/api/locations';
import { showPlayerInventory } from '~/components/InventoryDialog/index';
import * as sdtdConsole from '~/api/sdtd-console';
import { i18n } from '~/plugins/i18n';

// onlinePlayer icon
const onlinePlayerIcon = L.icon({
    iconUrl: new URL('~/assets/images/marker-survivor.png', import.meta.url).href,
    iconRetinaUrl: new URL('~/assets/images/marker-survivor-2x.png', import.meta.url).href,
    iconSize: [25, 48],
    iconAnchor: [12, 24],
    popupAnchor: [0, -20],
});

function formatCoord(latlng){
    if (latlng == false) return '- E / - N';
    else return '' + Math.abs(latlng.lat).toFixed(0) + (latlng.lat >= 0 ? ' E' : ' W') + ' / ' + Math.abs(latlng.lng).toFixed(0) + (latlng.lng >= 0 ? ' N' : ' S');
};

export function getOnlinePlayersLayer(map, mapInfo) {
    const onlinePlayersMarkerGroup = L.markerClusterGroup({
        maxClusterRadius: function (zoom) {
            return zoom >= mapInfo.maxZoom ? 10 : 50;
        },
    });

    const setOnlinePlayersLocation = function (data) {
        document.getElementById('mapControlOnlinePlayerCount').innerText = data.length;
        onlinePlayersMarkerGroup.clearLayers();

        for (let i = 0, len = data.length; i < len; i++) {
            const location = data[i];
            const playerId = location.playerId;
            const entityName = location.entityName;
            const position = location.position;

            const container = L.DomUtil.create('div');

            const title = L.DomUtil.create('span', null, container);
            title.innerText = `${i18n.global.t('player')}: ${entityName} (${playerId})`;

            L.DomUtil.create('br', null, container);

            const inventoryButton = L.DomUtil.create('a', null, container);
            inventoryButton.innerText = i18n.global.t('playerOperation.showInventory');
            inventoryButton.href = 'javascript:void(0);';
            inventoryButton.title = 'Show inventory';
            L.DomEvent.on(inventoryButton, 'click', () => {
                showPlayerInventory(playerId, entityName);
            });

            let initialPos = [position.x, position.z];
            const marker = L.marker(initialPos, {
                icon: onlinePlayerIcon,
                draggable: true, // 使标记可拖拽
            }).bindPopup(container);
            marker.addEventListener('popupopen', (e) => {
                e.popup._closeButton.href = 'javascript:void(0);';
            });



            // 监听拖拽结束事件
            marker.on('dragend', async (e) => {
                const newPos = e.target.getLatLng(); // 获取新的位置
                const message = i18n.global.t('views.map.dragendTelePlayerConfirm', [entityName, formatCoord(newPos)]);
                if (await myconfirm(message)) {
                    // console.log(`Marker dragged to new position: ${newPos}`);
                    // 在这里执行你想要的方法
                    sdtdConsole.sendConsoleCommand(`tele ${playerId} ${Math.round(newPos.lat)} -1 ${Math.round(newPos.lng)}`);
                    initialPos = [newPos.lat, newPos.lng];
                } else {
                    // 将 marker 移回初始位置
                    marker.setLatLng(initialPos);
                }
            });

            marker.bindTooltip(entityName + '<br>' + playerId, { permanent: false, opacity: 1.0 });

            marker.setOpacity(1.0);

            onlinePlayersMarkerGroup.addLayer(marker);
        }
    };

    const updateOnlinePlayersEvent = async function () {
        const data = await getLocations('onlineplayer');
        setOnlinePlayersLocation(data);
    };

    map.on('overlayadd', function (e) {
        if (e.layer == onlinePlayersMarkerGroup) {
            updateOnlinePlayersEvent();
        }
    });

    return onlinePlayersMarkerGroup;
}
