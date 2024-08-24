import { i18n } from '~/plugins/i18n.js';
import { renderExploredArea } from '~/api/map';

L.Control.RenderExploredArea = L.Control.extend({
    options: {
        position: 'bottomleft',
    },

    onAdd: function (map) {
        const name = 'control-renderExploredArea';
        const container = L.DomUtil.create('div', name + ' webmap-control render-map');

        container.innerHTML = i18n.global.t('views.map.renderExploredArea');
        this._map = map;
        this._div = container;

        L.DomEvent.on(container, 'click', this._onClick, this);

        return container;
    },

    onRemove: function (map) {},

    _onClick: async (e) => {
        if (await myconfirm(i18n.global.t('views.map.renderExploredAreaConfirm'))) {
            await renderExploredArea();
        }
    },
});
