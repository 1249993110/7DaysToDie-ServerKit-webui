import { getStats } from '~/api/server';

L.Control.GameTime = L.Control.extend({
    options: {
        position: 'topleft',
    },

    onAdd: function (map) {
        const name = 'control-gametime';
        const container = L.DomUtil.create('div', name + ' webmap-control game-time');

        container.innerHTML = 'Loading ...';
        L.DomEvent.on(container, 'mousemove', L.DomEvent.stopPropagation);

        const { pause, resume, isActive } = useIntervalFn(
            async () => {
                const data = await getStats();
                this._updateGameTimeEvent(data.gameTime, container);
                document.getElementById('mapControlHostileCount').innerText = data.zombies;
                document.getElementById('mapControlAnimalCount').innerText = data.animals;
                document.getElementById('mapControlOfflinePlayerCount').innerText = data.offlinePlayers;
                document.getElementById('mapControlOnlinePlayerCount').innerText = data.onlinePlayers;
            },
            10000,
            { immediateCallback: true }
        );

        return container;
    },

    onRemove: function (map) {},

    _updateGameTimeEvent: function (gameTime, container) {
        const days = gameTime.days;
        const hours = gameTime.hours;
        const minutes = gameTime.minutes;

        let time = `Day ${days}, `;
        if (hours < 10) {
            time += '0';
        }
        time += hours;
        time += ':';
        if (minutes < 10) {
            time += '0';
        }
        time += minutes;
        container.innerHTML = time;
    },
});
