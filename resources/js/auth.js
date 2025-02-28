import './bootstrap';

import Vue from 'vue';
import App from './AuthApp.vue';
import store from './store';

// PLUGINS
import vuetify from './plugins/vuetify';
import i18n from './plugins/vue-i18n';
import './plugins/vue-head';

// STYLES
import '../sass/theme.scss';

Vue.config.productionTip = false;

Vue.prototype.$eventHub = new Vue();
Vue.prototype.$component = window.component;
Vue.prototype.$lang = window.locale;

Vue.component('register', require('./pages/auth/Register.vue').default);
Vue.component('login', require('./pages/auth/Login.vue').default);
Vue.component('verify', require('./pages/auth/Verify.vue').default);
Vue.component('email', require('./pages/auth/Email.vue').default);
Vue.component('reset', require('./pages/auth/Reset.vue').default);
Vue.component('g2fa', require('./pages/auth/G2FA.vue').default);

export default new Vue({
	i18n,
	vuetify,
	store,
	render: (h) => h(App),
}).$mount('#app');