import { getLandClaims } from '~/api/land-claims';
import { removePlayerLandClaim } from '~/api/sdtd-console';


export function getLandClaimsLayer(map, mapInfo) {
    const landClaimsGroup = L.layerGroup();
    const landClaimsClusterGroup = L.markerClusterGroup({
        disableClusteringAtZoom: mapInfo.maxZoom,
        singleMarkerMode: true,
        maxClusterRadius: 50,
    });
    const landClaimsRectGroup = L.layerGroup();

    landClaimsGroup.addLayer(landClaimsClusterGroup);
    landClaimsGroup.addLayer(landClaimsRectGroup);
    let maxZoomForCluster = -1;

    const setLandClaims = function (data) {
        landClaimsClusterGroup.clearLayers();
        landClaimsRectGroup.clearLayers();

        const claimPower = Math.floor(Math.log(data.claimSize) / Math.LN2);
        const maxClusterZoomUnlimited = mapInfo.maxZoom - (claimPower - 3);
        const maxClusterZoomLimitedMax = Math.min(maxClusterZoomUnlimited, mapInfo.maxZoom + 1);
        maxZoomForCluster = Math.max(maxClusterZoomLimitedMax, 0);

        checkClaimClustering({ target: map });

        const sizeHalf = Math.floor(data.claimSize / 2);
        const claimOwners = data.claimOwners;

        for (let i = 0, len = claimOwners.length; i < len; i++) {
            const claimOwner = claimOwners[i];
            const playerId = claimOwner.playerId;
            const playerName = claimOwner.playerName ?? '&lt;unknown&gt;';
            const active = claimOwner.claimActive;
            const color = active ? '#55ff55' : '#ff0000';
            const claimPositions = claimOwner.claimPositions;
            for (let j = 0, len1 = claimPositions.length; j < len1; j++) {
                const position = claimPositions[j];
                const pos = L.latLng(position.x, position.z);
                const bounds = L.latLngBounds(L.latLng(position.x - sizeHalf, position.z - sizeHalf), L.latLng(position.x + sizeHalf, position.z + sizeHalf));
                const r = L.rectangle(bounds, { color: color, weight: 1, opacity: 0.8, fillOpacity: 0.15 });
                const m = L.marker(pos, {
                    clickable: false,
                    keyboard: false,
                    zIndexOffset: -1000,
                    iconSize: [0, 0],
                    icon: L.divIcon({ className: 'invisIcon', iconSize: [0, 0] }),
                });

                const container = L.DomUtil.create('div');
                const title = L.DomUtil.create('span', null, container);
                title.innerText = '所有者: ' + playerName + ' (' + playerId + ')';

                L.DomUtil.create('br', null, container);

                const posText = L.DomUtil.create('span', null, container);
                posText.innerText = 'Position: ' + position.x + ' ' + position.y + ' ' + position.z;

                L.DomUtil.create('br', null, container);

                const inventoryButton = L.DomUtil.create('a', null, container);
                inventoryButton.innerText = '移除此领地石';
                inventoryButton.href = 'javascript:void(0);';
                inventoryButton.title = '移除此领地石';
                L.DomEvent.on(inventoryButton, 'click', async () => {
                    if (await myconfirm('此操作将移除选定的领地石, 是否继续?', '提示', 'warning')) {
                        await removePlayerLandClaim(position.x, position.y, position.z);
                        await updateClaimsEvent();
                    }
                });

                r.bindPopup(container);

                landClaimsRectGroup.addLayer(r);
                r.addEventListener('popupopen', (e) => {
                    e.popup._closeButton.href = 'javascript:void(0);';
                });
                landClaimsClusterGroup.addLayer(m);
            }
        }
    };

    const updateClaimsEvent = async function () {
        const data = await getLandClaims();
        setLandClaims(data);
    };

    const checkClaimClustering = function (e) {
        if (e.target._zoom >= maxZoomForCluster) {
            landClaimsGroup.removeLayer(landClaimsClusterGroup);
        } else {
            landClaimsGroup.addLayer(landClaimsClusterGroup);
        }
    };

    map.on('zoomend', checkClaimClustering);

    map.on('overlayadd', function (e) {
        if (e.layer == landClaimsGroup) {
            updateClaimsEvent();
        }
    });

    return landClaimsGroup;
}
