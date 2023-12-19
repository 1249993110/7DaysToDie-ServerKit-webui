import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import 'leaflet.zoomslider/src/L.Control.Zoomslider.css';
import 'leaflet.zoomslider/src/L.Control.Zoomslider.js';
import 'leaflet-minimap/dist/Control.MiniMap.min.css';
import 'leaflet-minimap/dist/Control.MiniMap.min.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet-measure/dist/leaflet-measure.css';
import 'leaflet-measure/dist/leaflet-measure.cn.js';
import './leaflet/leaflet.control.coordinates.js';
import './leaflet/leaflet.control.reloadtiles.js';
import './leaflet/leaflet.control.renderFullMap.js';

import './leaflet/leaflet.control.gametime.js';
import { getSdtdTileLayer } from './leaflet/leaflet.layer.sdtdtiles';
import { getRegionLayer } from './leaflet/leaflet.regionlayer';
import { getLandClaimsLayer } from './leaflet/leaflet.layer.landclaims';
import { getHostilesLayer } from './leaflet/leaflet.layer.hostiles';
import { getAnimalsLayer } from './leaflet/leaflet.layer.animals';
import { getOfflinePlayersLayer } from './leaflet/leaflet.layer.offlineplayers';
import { getOnlinePlayersLayer } from './leaflet/leaflet.layer.onlineplayers';

export const initMap = (element, mapInfo) => {
    // ===============================================================================================
    // 7dtd coordinate transformations
    const SDTD_Projection = {
        project: function (latlng) {
            return new L.Point(latlng.lat / Math.pow(2, mapInfo.maxZoom), latlng.lng / Math.pow(2, mapInfo.maxZoom));
        },

        unproject: function (point) {
            return new L.LatLng(point.x * Math.pow(2, mapInfo.maxZoom), point.y * Math.pow(2, mapInfo.maxZoom));
        },
    };

    const SDTD_CRS = L.extend({}, L.CRS.Simple, {
        projection: SDTD_Projection,
        transformation: new L.Transformation(1, 0, -1, 0),
        scale: function (zoom) {
            return Math.pow(2, zoom);
        },
    });
    // ===============================================================================================

    // Map and basic tile layers
    const map = L.map(element, {
        zoomControl: false, // Added by Zoomslider
        zoomsliderControl: true,
        attributionControl: false,
        crs: SDTD_CRS,
        // For the below options read section "Fractional zoom" here: https://leafletjs.com/examples/zoom-levels/
        zoomSnap: 1, // Defines the zoom levels that can be achieved at all
        zoomDelta: 1, // Defines how much the zoom is changed with keyboard +/- and the zoom slider control
        wheelPxPerZoomLevel: 60, // Defines how much mouse scrolling is needed per zoom level. If zoomDelta is e.g. 0.25 and you want the mouse scroll zoom to match that make this 4 times as high, i.e. 240
    }).setView([0, 0], Math.max(0, mapInfo.maxZoom - 5));

    const initTime = new Date().getTime();
    const tileLayer = getSdtdTileLayer(mapInfo, initTime);

    // Add tileLayer
    tileLayer.addTo(map);

    // Add game time
    new L.Control.GameTime({}).addTo(map);

    // Add coordinates
    new L.Control.Coordinates({}).addTo(map);

    // Add mini map
    const tileLayerMiniMap = getSdtdTileLayer(mapInfo, initTime, true);
    new L.Control.MiniMap(tileLayerMiniMap, {
        zoomLevelOffset: -6,
        toggleDisplay: true,
    }).addTo(map);

    // Add reload tiles
    new L.Control.ReloadTiles({
        autoreload_enable: true,
        autoreload_minInterval: 30,
        autoreload_interval: 120,
        autoreload_defaultOn: false,
        layers: [tileLayer, tileLayerMiniMap],
    }).addTo(map);

    new L.Control.RenderFullMap({}).addTo(map);

    // L.control.measure({
    // 	units: {
    // 		sdtdMeters: {
    // 			factor: 0.00001,
    // 			display: 'XMeters',
    // 			decimals: 0
    // 		},
    // 		sdtdSqMeters: {
    // 			factor: 0.000000001,
    // 			display: 'XSqMeters',
    // 			decimals: 0
    // 		}
    // 	},
    // 	primaryLengthUnit: "sdtdMeters",
    // 	primaryAreaUnit: "sdtdSqMeters",
    // 	//activeColor: "#ABE67E",
    // 	//completedColor: "#C8F2BE",
    // 	position: "bottomleft"
    // }).addTo(map);

    const layerControl = L.control.layers(
        {
            //"Map": tileLayer
        },
        null,
        {
            collapsed: false,
        }
    );

    layerControl.addOverlay(getRegionLayer(mapInfo), '区域文件');
    layerControl.addOverlay(getLandClaimsLayer(map, mapInfo), '领地石');
    layerControl.addOverlay(getHostilesLayer(map, mapInfo), "僵尸 (<span id='mapControlHostileCount'>0</span>)");
    layerControl.addOverlay(getAnimalsLayer(map, mapInfo), "动物 (<span id='mapControlAnimalCount'>0</span>)");
    layerControl.addOverlay(getOfflinePlayersLayer(map, mapInfo), "玩家 (离线) (<span id='mapControlOfflinePlayerCount'>0</span>)");
    layerControl.addOverlay(getOnlinePlayersLayer(map, mapInfo), "玩家 (在线) (<span id='mapControlOnlinePlayerCount'>0</span>)");

    layerControl.addTo(map);
};
