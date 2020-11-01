<template>
  <div class="book__wrapper">
    <div class="book" v-if="book">
      <table class="book__table table">
        <caption class="table__caption">Bids</caption>
        <tr class="table__header">
          <th>Amount</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
        <tr class="table__row" v-for="order in bids" :key="order[0]">
          <td>
            {{ order[1].toFixed(8) }}
          </td>
          <td>
            {{ order[0].toFixed(8) }}
          </td>
          <td>
            {{ (order[0] * order[1]).toFixed(8) }}
          </td>
        </tr>
      </table>

      <table class="book__table table">
        <caption class="table__caption">Asks</caption>
        <tr class="table__header">
          <th>Amount</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
        <tr class="table__row" v-for="order in asks" :key="order[0]">
          <td>
            {{ order[1].toFixed(8) }}
          </td>
          <td>
            {{ order[0].toFixed(8) }}
          </td>
          <td>
            {{ (order[0] * order[1]).toFixed(8) }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import {
  preprocessRESTResponse,
  preprocessWSResponse,
  updateBook,
  diffMessage,
} from '~/helpers/binanceHelpers';

export default {
  name: 'OrderBook',
  data() {
    return {
      symbol: 'BTCUSDT',
      book: null,
      socket: null,
    };
  },
  computed: {
    bids() {
      return [...this.book.bids]
        .sort((prevOrder, nextOrder) => ((prevOrder[0] < nextOrder[0]) ? 1 : -1));
    },
    asks() {
      return [...this.book.asks]
        .sort((prevOrder, nextOrder) => ((prevOrder[0] < nextOrder[0]) ? 1 : -1));
    },
  },
  methods: {
    async initializeBook() {
      const book = await this.$core.binanceApi.getOrderBook(this.symbol);
      this.book = preprocessRESTResponse(book);
      this.book.status = 'init';
    },
    async handleUpdate(event) {
      let { data } = event;
      data = JSON.parse(data);
      data = (data.result !== null) ? preprocessWSResponse(data) : data;
      // Possible book status:
      // empty: exchange with api hasn't started yet
      // init: waiting for an update, where U ≤ lastUpdateId + 1 ≤ u
      // ready: waiting for an update, where u === lastUpdateId + 1
      const bookStatus = (this.book && this.book.status) ? this.book.status : 'empty';

      if (bookStatus === 'empty') {
        if (data.result === null) {
          this.initializeBook();
          return;
        }
        // We get here if received an update for the book
        // that started initializing but hasn't finished yet
        return;
      }

      const { u, U } = data;
      const { lastUpdateId } = this.book;

      if (bookStatus === 'ready') {
        if (U === lastUpdateId + 1) {
          this.book = updateBook(this.book, data);
          return;
        }
        // We get here if the book is out of sync
        this.initializeBook();
        return;
      }

      if (bookStatus === 'init') {
        if (u >= lastUpdateId + 1 && U <= lastUpdateId + 1) {
          this.book = updateBook(this.book, data);
          this.book.status = 'ready';
        }
        // The opposite condition. If met, it is impossible
        // to ever get an event, appropriate for the book
        // with the init status
        if (u < lastUpdateId + 1 || U > lastUpdateId + 1) {
          this.initializeBook();
        }
        // Waiting for a miracle
      }
    },
  },
  beforeMount() {
    this.socket = this.$core.binanceApi
      .subscribeToStream(this.symbol, this.handleUpdate);
    this.$core.eventBus.subscribe('symbol', (symbol) => {
      this.symbol = symbol;
    });
  },
  watch: {
    book(prev, next) {
      if (prev && next) {
        const diff = diffMessage(prev, next, this.symbol);
        this.$core.eventBus.publish('diff', diff);
      }
    },
    symbol(newSymbol) {
      this.socket.close();
      this.socket = null;
      this.book = null;
      this.socket = this.$core.binanceApi
        .subscribeToStream(newSymbol, this.handleUpdate);
    },
  },
};
</script>

<style>
.book {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* margin: 0 auto; */
  padding: 1rem;
  width: 60rem;
}

.book__table {
  width: 28rem;
}

.book__wrapper {
  margin: 0 auto;
  margin-top: 1rem;
  width: 95vw;
  max-width: 60rem;
  height: 90vh;
  overflow: scroll;
}

.book__wrapper:hover::-webkit-scrollbar {
  width: .6rem;
  height: .6rem;
}

.book__wrapper:hover::-webkit-scrollbar-track {
  border-radius: .3rem;
  background: #CCC;
}

.book__wrapper:hover::-webkit-scrollbar-thumb {
  border-radius: .3rem;
  background: #555;
}

.table__caption {
  padding: .5rem;
  font-weight: bold;
  font-size: 1.5rem;
  border-radius: .5rem;
  background: #EEE;
}

.table__header {
  text-align: left;
}
</style>
