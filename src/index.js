import Vue from 'vue';
import App from './App.vue';
import core from './core';

Vue.use(core);

const vm = new Vue({
  render: (h) => h(App),
});

vm.$mount('.root');
