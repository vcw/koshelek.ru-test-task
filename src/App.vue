<template>
  <div class="app">
    <Header />
    <OrderBook v-show="activePage === 'OrderBook'" />
    <Settings v-if="activePage === 'Settings'" />
  </div>
</template>

<script>
import Header from '~/components/Header.vue';

const OrderBook = () => import('~/components/OrderBook.vue');
const Settings = () => import('~/components/Settings.vue');

export default {
  name: 'App',
  components: {
    Header,
    OrderBook,
    Settings,
  },
  data() {
    return {
      activePage: 'OrderBook',
    };
  },
  methods: {
    handlePageChange(page) {
      this.activePage = page;
    },
  },
  beforeMount() {
    this.$core.eventBus.subscribe('page', this.handlePageChange.bind(this));
  },
};
</script>

<style>
html {
  font-size: 16px;
}
* {
  box-sizing: border-box;
}
.app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
  Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
