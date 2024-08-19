
import { renderExploredArea } from '~/api/map';

L.Control.RenderExploredArea = L.Control.extend({
    options: {
        position: 'bottomleft',
    },

    onAdd: function (map) {
        const name = 'control-renderExploredArea';
        const container = L.DomUtil.create('div', name + ' webmap-control render-map');

        container.innerHTML = '渲染已探索区域';
        this._map = map;
        this._div = container;

        L.DomEvent.on(container, 'click', this._onClick, this);

        return container;
    },

    onRemove: function (map) {},

    _onClick: async (e) => {
        if (await myconfirm('确认渲染已探索区域吗? 这可能需要几分钟的时间, 您可以前往控制台查看进度.')) {
            await renderExploredArea();
        }
    },
});
