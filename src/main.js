import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import VueMatomo from 'vue-matomo'

const app = createApp(App);
app.use(router);
app.use(VueMatomo, {
            // Configure your matomo server and site by providing
            host: 'https://matomo.srps.org.uk/',
            siteId: 1,
        });
app.mount('#app');

window._paq.push(['trackPageView']); //To track pageview
