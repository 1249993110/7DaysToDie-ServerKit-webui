import { createApp } from 'vue';
import App from './App.vue';
import useElementPlus from './plugins/element';
import usePinia from './plugins/pinia';
import router from './router';

import './plugins/dayjs';

import 'normalize.css';
import './assets/styles/common.scss';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'

const app = createApp(App);
usePinia(app);
useElementPlus(app);
app.use(router);

app.mount('#app');