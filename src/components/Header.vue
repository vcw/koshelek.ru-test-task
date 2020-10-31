<template>
  <header class="header">
    <nav class="header__nav">
      <ul class="navlist header__navlist">
        <li class="navlist__item">
          <a
            @click="switchPage('OrderBook')"
            href="#"
            class="navlist__link"
          >
            Order book
          </a>
        </li>
        <li class="navlist__item">
          <a
            @click="switchPage('Settings')"
            href="#"
            class="navlist__link"
          >
            Settings
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    switchPage(page) {
      this.$core.eventBus.publish('page', page);
    },
  },
};
</script>

<style>
.header {
  border-radius: .5rem;
  background: #EEE;
}
.navlist {
  display: flex;
  margin: 0;
  padding: 0;
}

.navlist__item {
  padding: 1rem;
  list-style: none;
}

.navlist__link {
  color: inherit;
  text-decoration: none;
}
</style>
