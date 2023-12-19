import { getLocations } from '~/api/locations';

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

    const setAnimalsLocation = function (data) {
        document.getElementById('mapControlAnimalCount').innerText = data.length;

        animalsMarkerGroup.clearLayers();

        for (let i = 0, len = data.length; i < len; i++) {
            const location = data[i];
            const position = location.position;
            const marker = L.marker([position.x, position.z], { icon: animalIcon }).bindPopup(`动物: ${location.entityName} (${location.entityId})`);
            marker.addEventListener('popupopen', (e) => {
                e.popup._closeButton.href = 'javascript:void(0);';
            });
            marker.setOpacity(1.0);
            animalsMarkerGroup.addLayer(marker);
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
