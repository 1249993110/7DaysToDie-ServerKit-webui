import { getLocations } from '~/api/locations';
import { i18n } from '~/plugins/i18n';
import { useLocaleStore } from '~/store/locale';
import { getLocalizationByKey } from '~/api/localization';

// animal icon
const animalIcon = L.icon({
    iconUrl: new URL('~/assets/images/marker-animal.png', import.meta.url).href,
    iconRetinaUrl: new URL('~/assets/images/marker-animal-2x.png', import.meta.url).href,
    iconSize: [25, 26],
    iconAnchor: [12, 13],
    popupAnchor: [0, -10],
});

export function getAnimalsLayer(map, mapInfo) {
    const animalsMarkerGroup = L.markerClusterGroup({
        maxClusterRadius: function (zoom) {
            return zoom >= mapInfo.maxZoom ? 10 : 50;
        },
    });

    const setAnimalsLocation = async (data) => {
        document.getElementById('mapControlAnimalCount').innerText = data.length;

        animalsMarkerGroup.clearLayers();
        const localeStore = useLocaleStore();

        for (let i = 0, len = data.length; i < len; i++) {
            const location = data[i];
            const position = location.position;
            getLocalizationByKey(location.entityName, localeStore.getLanguage())
                .then((entityName) => {
                    const marker = L.marker([position.x, position.z], { icon: animalIcon }).bindPopup(`${i18n.global.t('views.map.animal')}: ${entityName} (${location.entityId})`);
                    marker.addEventListener('popupopen', (e) => {
                        e.popup._closeButton.href = 'javascript:void(0);';
                    });
                    marker.setOpacity(1.0);
                    animalsMarkerGroup.addLayer(marker);
                })
                .catch((error) => {});
        }
    };

    const updateAnimalsEvent = async function () {
        const data = await getLocations('animal');
        setAnimalsLocation(data);
    };

    map.on('overlayadd', function (e) {
        if (e.layer == animalsMarkerGroup) {
            updateAnimalsEvent();
        }
    });

    return animalsMarkerGroup;
}
