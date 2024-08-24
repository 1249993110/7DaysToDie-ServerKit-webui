import { i18n } from '~/plugins/i18n.js';
import { renderFullMap } from '~/api/map';

L.Control.RenderFullMap = L.Control.extend({
    options: {
        position: 'bottomleft',
    },

    onAdd: function (map) {
        const name = 'control-renderFullMap';
        const container = L.DomUtil.create('div', name + ' webmap-control render-map');

        container.innerHTML = i18n.global.t('views.map.renderFullMap');
        this._map = map;
        this._div = container;

        L.DomEvent.on(container, 'click', this._onClick, this);

        return container;
    },

    onRemove: function (map) {},

    _onClick: async (e) => {
        if (await myconfirm(i18n.global.t('views.map.renderFullMapConfirm'))) {
            await renderFullMap();
        }
    },
});
