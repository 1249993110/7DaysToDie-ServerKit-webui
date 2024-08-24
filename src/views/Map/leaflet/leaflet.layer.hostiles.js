import { getLocations } from '~/api/locations';
import { i18n } from '~/plugins/i18n';
import { useLocaleStore } from '~/store/locale';
import { getLocalizationByKey } from '~/api/localization';

// hostile icon
const hostileIcon = L.icon({
    iconUrl: new URL('~/assets/images/marker-zombie.png', import.meta.url).href,
    iconRetinaUrl: new URL('~/assets/images/marker-zombie-2x.png', import.meta.url).href,
    iconSize: [25, 33],
    iconAnchor: [12, 16],
    popupAnchor: [0, -10],
});

export function getHostilesLayer(map, mapInfo) {
    const hostilesMarkerGroup = L.markerClusterGroup({
        maxClusterRadius: function (zoom) {
            return zoom >= mapInfo.maxZoom ? 10 : 50;
        },
    });

    const setHostilesLocation = function (data) {
        document.getElementById('mapControlHostileCount').innerText = data.length;

        hostilesMarkerGroup.clearLayers();
        const localeStore = useLocaleStore();

        for (let i = 0, len = data.length; i < len; i++) {
            const location = data[i];
            const position = location.position;
            getLocalizationByKey(location.entityName, localeStore.getLanguage())
                .then((entityName) => {
                    const marker = L.marker([position.x, position.z], { icon: hostileIcon }).bindPopup(
                        `${i18n.global.t('views.map.zombie')}: ${entityName} (${location.entityId})`
                    );
                    marker.addEventListener('popupopen', (e) => {
                        e.popup._closeButton.href = 'javascript:void(0);';
                    });
                    marker.setOpacity(1.0);
                    hostilesMarkerGroup.addLayer(marker);
                })
                .catch((error) => {});
        }
    };

    const updateHostilesEvent = async function () {
        const data = await getLocations('hostiles');
        setHostilesLocation(data);
    };

    map.on('overlayadd', function (e) {
        if (e.layer == hostilesMarkerGroup) {
            updateHostilesEvent();
        }
    });

    return hostilesMarkerGroup;
}
