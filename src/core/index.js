import BinanceApi from './BinanceApi';
import EventBus from './EventBus';

/* eslint-disable no-param-reassign */
export default {
  install(vue) {
    vue.prototype.$core = {
      binanceApi: new BinanceApi(),
      eventBus: new EventBus(),
    };
  },
};
