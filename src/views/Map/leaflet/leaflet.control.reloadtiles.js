import { i18n } from "~/plugins/i18n";

L.Control.ReloadTiles = L.Control.extend({
    options: {
        position: 'bottomleft',
        autoreload_enable: true,
        autoreload_minInterval: 30,
        autoreload_interval: 120,
        autoreload_defaultOn: false,
        layers: [],
    },

    onAdd: function (map) {
        const name = 'control-reloadtiles';
        const container = L.DomUtil.create('div', name + ' webmap-control');

        // 停止将给定事件传播到父元素
        const stop = L.DomEvent.stopPropagation;
        L.DomEvent.on(container, 'mousemove', stop).on(container, 'click', stop).on(container, 'mousedown', stop).on(container, 'dblclick', stop);

        this._map = map;

        const reloadbutton = L.DomUtil.create('a', name + '-btn', container);
        reloadbutton.innerText = i18n.global.t('views.map.refreshMap');
        reloadbutton.href = 'javascript:void(0);';
        reloadbutton.title = 'Reload tiles now';
        L.DomEvent.on(reloadbutton, 'click', this._reload, this);

        if (this.options.autoreload_enable) {
            L.DomUtil.create('br', null, container);
            const autocheck = L.DomUtil.create('input', name + '-chk', container);
            autocheck.type = 'checkbox';
            autocheck.id = 'map_reloadtiles_autoreload';
            //autocheck.value = '1';
            L.DomEvent.on(autocheck, 'change', this._selectReload, this);
            this._autocheck = autocheck;

            if (this.options.autoreload_defaultOn) {
                autocheck.checked = true;
                this._timeout = window.setTimeout(() => {
                    this._reloadTilesEvent.call(this);
                }, this.options.autoreload_interval * 1000);
            }

            const label_left = L.DomUtil.create('label', null, container);
            label_left.for = 'map_reloadtiles_autoreload';
            label_left.innerText = i18n.global.t('views.map.autoReload') + ' ';

            const reloadInterval = L.DomUtil.create('input', name + '-txt', container);
            reloadInterval.name = 'map_reloadtiles_autoreload_time';
            reloadInterval.type = 'text';
            reloadInterval.size = '1';
            reloadInterval.maxLength = '4';
            reloadInterval.value = this.options.autoreload_interval;
            L.DomEvent.on(reloadInterval, 'input', this._verifyInterval, this);
            this._reloadInterval = reloadInterval;

            const label_right = L.DomUtil.create('label', null, container);
            label_right.for = 'map_reloadtiles_autoreload';
            label_right.innerText = ' ' + i18n.global.t('views.map.seconds');
        }

        return container;
    },

    onRemove: function (map) {
        if (this._timeout) {
            window.clearTimeout(this._timeout);
        }
    },

    _selectReload: function () {
        if (this._timeout) {
            window.clearTimeout(this._timeout);
        }

        if (this._autocheck.checked) {
            this._timeout = window.setTimeout(() => {
                this._reloadTilesEvent.call(this);
            }, this.options.autoreload_interval * 1000);
        }
    },

    _verifyInterval: function () {
        const val = this._reloadInterval.value;
        if (new RegExp(/^[\d]+$/).test(val)) {
            if (val >= this.options.autoreload_minInterval) {
                this._reloadInterval.classList.remove('invalid-input');
                this.options.autoreload_interval = val;
                if (this._autocheck.checked) {
                    if (this._timeout) {
                        window.clearTimeout(this._timeout);
                    }
                    this._timeout = window.setTimeout(() => {
                        this._reloadTilesEvent.call(this);
                    }, this.options.autoreload_interval * 1000);
                }
            } else {
                this._reloadInterval.classList.add('invalid-input');
            }
        } else {
            this._reloadInterval.classList.add('invalid-input');
        }
    },

    _reload: function () {
        const newTileTime = new Date().getTime();
        const layers = this.options.layers;
        for (let i = 0, len = layers.length; i < len; i++) {
            layers[i].options.time = newTileTime;
            layers[i].redraw();
        }
    },

    _reloadTilesEvent: function () {
        this._reload.call(this);
		if(this._timeout){
			window.clearTimeout(this._timeout);
		}
        this._timeout = window.setTimeout(() => {
            this._reloadTilesEvent.call(this);
        }, this.options.autoreload_interval * 1000);
    },
});
