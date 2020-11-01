<template>
  <div>
    <h1 class="settings__heading">Settings</h1>

    <div class="dropdown">
      <header class="dropdown__header">
        <a href="#" class="dropdown__link">
          <h2 class="dropdown__heading">Symbol</h2>
        </a>
        <h3 class="dropdown__current">{{ symbol }}</h3>
      </header>
      <ul class="dropdown__list">
        <li class="dropdown__item">
          <a
            @click="symbol = 'BTCUSDT'"
            href="#"
            class="dropdown__link"
          >
            BTCUSDT
          </a>
        </li>
        <li class="dropdown__item">
          <a
            @click="symbol = 'BNBBTC'"
            href="#"
            class="dropdown__link"
          >
            BNBBTC
          </a>
        </li>
        <li class="dropdown__item">
          <a
            @click="symbol = 'ETHBTC'"
            href="#"
            class="dropdown__link"
          >
            ETHBTC
          </a>
        </li>
      </ul>
    </div>

    <main
      class="diff"
      v-if="diff"
    >
      <span class="diff__id">{{ `${diff.prevId} → ${diff.nextId}` }}</span>

      <div class="diff__lists">
        <section class="diff__side">
          <h2 class="diff__title">Bids</h2>

          <ul class="diff__add diff-list" v-if="diff.bids.add.length">
            <li class="diff-list__item" v-for="order in diff.bids.add" :key="order[0]">
              <span class="diff-list__price">
                {{ order[0].toFixed(8) }}
              </span>
              <span class="diff-list__quantity">
                {{ order[1].toFixed(8) }}
              </span>
            </li>
          </ul>

          <ul class="diff__modify diff-list" v-if="diff.bids.modify.length">
            <li class="diff-list__item" v-for="order in diff.bids.modify" :key="order.price">
              <span class="diff-list__price">
                {{ order.price.toFixed(8) }}
              </span>
              <span class="diff-list__quantity">
                {{ `${order.before.toFixed(8)} → ${order.after.toFixed(8)}` }}
              </span>
            </li>
          </ul>

          <ul class="diff__remove diff-list" v-if="diff.bids.remove.length">
            <li class="diff-list__item" v-for="order in diff.bids.remove" :key="order[0]">
              <span class="diff-list__price">
                {{ order[0].toFixed(8) }}
              </span>
              <span class="diff-list__quantity">
                {{ order[1].toFixed(8) }}
              </span>
            </li>
          </ul>
        </section>

        <section class="diff__side">
          <h2 class="diff__title">Asks</h2>
          <ul class="diff__add diff-list" v-if="diff.asks.add.length">
            <li class="diff-list__item" v-for="order in diff.asks.add" :key="order[0]">
              <span class="diff-list__price">
                {{ order[0].toFixed(8) }}
              </span>
              <span class="diff-list__quantity">
                {{ order[1].toFixed(8) }}
              </span>
            </li>
          </ul>

          <ul class="diff__modify diff-list" v-if="diff.asks.modify.length">
            <li class="diff-list__item" v-for="order in diff.asks.modify" :key="order.price">
              <span class="diff-list__price">
                {{ order.price.toFixed(8) }}
              </span>
              <span class="diff-list__quantity">
                {{ `${order.before.toFixed(8)} → ${order.after.toFixed(8)}` }}
              </span>
            </li>
          </ul>

          <ul class="diff__remove diff-list" v-if="diff.asks.remove.length">
            <li class="diff-list__item" v-for="order in diff.asks.remove" :key="order[0]">
              <span class="diff-list__price">
                {{ order[0].toFixed(8) }}
              </span>
              <span class="diff-list__quantity">
                {{ order[1].toFixed(8) }}
              </span>
            </li>
          </ul>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      diff: null,
      symbol: 'BTCUSDT',
    };
  },
  methods: {
    handleDiffMessage(message) {
      this.diff = message;
    },
  },
  watch: {
    symbol(newSymbol) {
      this.$core.eventBus.publish('symbol', newSymbol);
    },
  },
  beforeMount() {
    this.$core.eventBus.subscribe('diff', this.handleDiffMessage);
  },
  beforeDestroy() {
    this.$core.eventBus.unsubscribe('diff', this.handleDiffMessage);
  },
};
</script>

<style>
.dropdown {
  position: relative;
}

.dropdown__header {
  display: flex;
  justify-content: space-between;
  padding: .5rem;
  border-top-left-radius: .5rem;
  border-top-right-radius: .5rem;
  color: #FFF;
  background: #272727;
}

.dropdown__heading {
  display: inline;
  margin: 0;
  font-size: 1.5rem;
  text-decoration: underline;
}

.dropdown__current {
  display: inline;
  margin: 0;
  font-size: 1.5rem;
}

.dropdown__list {
  display: none;
  position: absolute;
  margin: 0;
  padding: .5rem;
  border-bottom-left-radius: .5rem;
  border-bottom-right-radius: .5rem;
  border-top: 1px solid #fff;
  color: #EEE;
  background: #272727;
}

.dropdown__header:hover +
.dropdown__list,
.dropdown__list:hover {
  display: block;
}

.dropdown__item {
  padding: .5rem;
  list-style: none;
}

.dropdown__link {
  color: inherit;
  text-decoration: none;
}

.diff__id {
  display: block;
  padding: .5rem;
  text-align: right;
  border-bottom-left-radius: .5rem;
  border-bottom-right-radius: .5rem;
  background: #EEE;
}

.diff__lists {
  display: flex;
  flex-direction: column;
}

@media screen and (min-width: 850px) {
  .diff__lists {
    flex-direction: row;
    justify-content: space-between;
  }

  .diff__side {
    width: 48%;
  }
}

.diff__add {
  background: #8EA604;
}

.diff__modify {
  background: #3581B8;
}

.diff__remove {
  background: #E5625E;
}

.diff-list {
  padding: .5rem;
  border-radius: .5rem;
}

.diff-list__item {
  display: flex;
  justify-content: space-between;
  padding: .2rem;
  list-style: none;
}

.diff-list__item:not(:last-of-type) {
  border-bottom: 1px solid black;
}

.diff-list__price {
  font-weight: bold;
}
</style>
