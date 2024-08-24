import { i18n } from '~/plugins/i18n.js';

const getLabel = (pos, lastPos) => {
    return `${i18n.global.t('views.map.mousePos')}: ${pos}<br/>${i18n.global.t('views.map.lastClick')}: ${lastPos}`;
};

L.Control.Coordinates = L.Control.extend({
    options: {
        position: 'bottomleft',
    },

    onAdd: function (map) {
        const name = 'control-coordinates';
        const container = L.DomUtil.create('div', name + ' webmap-control');

        container.innerHTML = getLabel('- E / - N', '- E / - N');
        L.DomEvent.on(container, 'mousemove', L.DomEvent.stopPropagation);

        this._map = map;
        this._div = container;

        map.on('mousemove', this._onMouseMove, this);
        map.on('mouseout', this._onMouseOut, this);
        map.on('click', this._onClick, this);

        return container;
    },

    onRemove: function (map) {},

    _onMouseMove: function (e) {
        this.lastPos = e.latlng;
        this._updateText();
    },

    _onMouseOut: function (e) {
        this.lastPos = false;
        this._updateText();
    },

    _onClick: function (e) {
        this.lastClick = e.latlng;
        this._updateText();
    },

    _updateText: function (e) {
        this._div.innerHTML = getLabel(this._formatCoord(this.lastPos), this._formatCoord(this.lastClick));
    },

    _formatCoord: function (latlng) {
        if (!latlng) {
            return '- E / - N';
        }
        
        return '' + Math.abs(latlng.lat).toFixed(0) + (latlng.lat >= 0 ? ' E' : ' W') + ' / ' + Math.abs(latlng.lng).toFixed(0) + (latlng.lng >= 0 ? ' N' : ' S');
    },

    lastPos: false,
    lastClick: false,
});
