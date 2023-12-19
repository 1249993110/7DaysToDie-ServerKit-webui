import myconfirm from '~/utils/myconfirm';
import { renderMap } from '~/api/map';

L.Control.RenderFullMap = L.Control.extend({
    options: {
        position: 'bottomleft',
    },

    onAdd: function (map) {
        const name = 'control-renderfullmap';
        const container = L.DomUtil.create('div', name + ' webmap-control render-full-map');

        container.innerHTML = '渲染全图';
        this._map = map;
        this._div = container;

        L.DomEvent.on(container, 'click', this._onClick, this);

        return container;
    },

    onRemove: function (map) {},

    _onClick: async (e) => {
        if (await myconfirm('确认渲染全图吗? 这可能需要几分钟的时间, 您可以前往控制台查看进度, 此操作一般仅在开服后执行一次.')) {
            await renderMap();
        }
    },
});
