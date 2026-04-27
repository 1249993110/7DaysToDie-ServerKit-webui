import { i18n } from '~/plugins/i18n.js';
import { renderFullMap, getRenderFullMapStatus, stopRenderFullMap } from '~/api/map';

L.Control.RenderFullMap = L.Control.extend({
    options: {
        position: 'bottomleft',
    },

    _pollTimer: null,
    _isRendering: false,

    onAdd: function (map) {
        const name = 'control-renderFullMap';
        const container = L.DomUtil.create('div', name + ' webmap-control render-map');

        this._btnText = L.DomUtil.create('span', '', container);
        this._btnText.innerText = i18n.global.t('views.map.renderFullMap');

        this._progressText = L.DomUtil.create('div', 'render-progress', container);
        this._progressText.style.display = 'none';
        this._progressText.style.fontSize = '11px';
        this._progressText.style.marginTop = '2px';

        this._map = map;
        this._div = container;

        L.DomEvent.on(container, 'click', this._onClick, this);

        this._checkInitialStatus();

        return container;
    },

    onRemove: function (map) {
        this._stopPolling();
    },

    _onClick: async function (e) {
        const t = i18n.global.t;

        if (this._isRendering) {
            if (await myconfirm(t('views.map.stopRenderFullMapConfirm'))) {
                try {
                    await stopRenderFullMap();
                    this._stopPolling();
                    this._setIdle();
                    ElMessage.success(t('views.map.stopRenderFullMapSuccess'));
                } catch (err) {
                    console.error(err);
                }
            }
            return;
        }

        if (await myconfirm(t('views.map.renderFullMapConfirm'))) {
            try {
                const res = await renderFullMap();
                if (res.success === false) {
                    ElMessage.warning(res.message);
                    return;
                }
                ElMessage.success(t('views.map.renderFullMapStarted'));
                this._setRendering();
                this._startPolling();
            } catch (err) {
                console.error(err);
            }
        }
    },

    _startPolling: function () {
        this._stopPolling();
        this._pollTimer = setInterval(async () => {
            try {
                const status = await getRenderFullMapStatus();
                this._updateProgress(status);

                if (status.status === 'done' || status.status === 'error' || status.status === 'idle') {
                    this._stopPolling();
                    this._setIdle();

                    if (status.status === 'done') {
                        ElMessage.success(i18n.global.t('views.map.renderFullMapDone', [status.chunksTotal, status.elapsedSeconds]));
                    } else if (status.status === 'error') {
                        ElMessage.error(status.error || 'Unknown error');
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }, 3000);
    },

    _stopPolling: function () {
        if (this._pollTimer) {
            clearInterval(this._pollTimer);
            this._pollTimer = null;
        }
    },

    _updateProgress: function (status) {
        this._progressText.style.display = 'block';
        this._progressText.innerText = `${status.chunksDone} / ${status.chunksTotal} (${status.percent}%)`;
    },

    _setRendering: function () {
        this._isRendering = true;
        this._btnText.innerText = i18n.global.t('views.map.stopRenderFullMap');
        this._div.classList.add('rendering');
    },

    _setIdle: function () {
        this._isRendering = false;
        this._btnText.innerText = i18n.global.t('views.map.renderFullMap');
        this._progressText.style.display = 'none';
        this._div.classList.remove('rendering');
    },

    _checkInitialStatus: async function () {
        try {
            const status = await getRenderFullMapStatus();
            if (status.status === 'running') {
                this._setRendering();
                this._updateProgress(status);
                this._startPolling();
            }
        } catch (err) {
            console.error(err);
        }
    },
});
