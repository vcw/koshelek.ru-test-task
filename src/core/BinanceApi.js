class BinanceAPI {
  constructor() {
    this.RESTBase = 'https://api.binance.com';
    this.WSBase = 'wss://stream.binance.com:9443';
  }

  async getOrderBook(symbol, limit = 500) {
    const uri = `${this.RESTBase}/api/v3/depth?symbol=${symbol.toUpperCase()}&limit=${limit}`;
    const rawResponse = await fetch(uri);
    const response = await rawResponse.json();
    return response;
  }

  subscribeToStream(symbol, handler) {
    const socket = new WebSocket(`${this.WSBase}/ws/${symbol.toLowerCase()}@depth`);
    socket.onmessage = handler;
    socket.onopen = () => {
      socket.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: [`${symbol.toLowerCase()}@depth`],
        id: 1,
      }));
    };
    return socket;
  }
}

export default BinanceAPI;
