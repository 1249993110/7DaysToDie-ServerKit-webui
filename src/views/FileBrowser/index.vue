<template>
    <div class="file-browser">
        <iframe :src="src" id="fileBrowserIframe"></iframe>
    </div>
</template>

<script>
export default {
    name: 'FileBrowser',
};
</script>

<script setup>
import { getAppSettings } from '~/api/app-settings';

const src = ref('');

getAppSettings()
    .then((data) => {
        const hostname = import.meta.env.DEV ? import.meta.env.VITE_APP_API_DOMAIN : location.hostname;
        src.value = `//${hostname}:${data.fileBrowserPort}`;
    })
    .catch((error) => {});
</script>

<style scoped lang="scss">
.file-browser {
    height: calc(100vh - 90px);
    #fileBrowserIframe {
        width: 100%;
        height: 100%;
        border: 0;
    }
}
</style>
