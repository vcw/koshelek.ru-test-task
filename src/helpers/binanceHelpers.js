function preprocessList(list) {
  return list.map((order) => [
    Number.parseFloat(order[0]),
    Number.parseFloat(order[1]),
  ]);
}

export function preprocessWSResponse(response) {
  return {
    ...response,
    b: preprocessList(response.b),
    a: preprocessList(response.a),
  };
}

export function preprocessRESTResponse(response) {
  return {
    ...response,
    bids: preprocessList(response.bids),
    asks: preprocessList(response.asks),
  };
}

function updateList(prev, next) {
  // Clone the orders list we want to update
  const updatedList = [...prev];
  // Make an array of price levels,
  // allows us easily find indexes
  const prevPriceLevels = prev.map((order) => order[0]);

  // Iterate over the list of updates
  next.forEach((order) => {
    const [orderPriceLevel, orderQuantity] = order;
    const indexInPrev = prevPriceLevels.indexOf(orderPriceLevel);
    // If there is an order for current price level
    if (indexInPrev !== -1) {
      // update it
      updatedList[indexInPrev] = [orderPriceLevel, orderQuantity];
    // If there are no orders for current price level
    } else {
      // create it
      updatedList.push([
        orderPriceLevel,
        orderQuantity,
      ]);
    }
  });
  // Clean updated list
  return updatedList.filter((order) => order[1] !== 0);
}

export function updateBook(book, update) {
  const updatedBook = {
    ...book,
    lastUpdateId: update.u,
    bids: updateList(book.bids, update.b),
    asks: updateList(book.asks, update.a),
  };

  return updatedBook;
}

function diffList(prev, next) {
  const prevPrices = prev.map((order) => order[0]);
  const nextPrices = next.map((order) => order[0]);
  const addModify = nextPrices.reduce((accumulator, currentPrice, nextIndex) => {
    const prevIndex = prevPrices.indexOf(currentPrice);
    const nextQuantity = next[nextIndex][1];
    if (prevIndex !== -1) {
      const prevQuantity = prev[prevIndex][1];
      if (prevQuantity !== nextQuantity) {
        accumulator.modify.push({
          price: currentPrice,
          before: prevQuantity,
          after: nextQuantity,
        });
      }
    } else {
      accumulator.add.push(next[nextIndex]);
    }
    return accumulator;
  }, {
    add: [],
    modify: [],
  });

  const remove = prevPrices.reduce((accumulator, prevPrice, prevPriceIndex) => {
    const nextIndex = nextPrices.indexOf(prevPrice);
    if (nextIndex === -1) accumulator.push(prev[prevPriceIndex]);
    return accumulator;
  }, []);

  return {
    ...addModify,
    remove,
  };
}

export function diffMessage(prev, next) {
  const prevBook = { ...prev };
  const nextBook = { ...next };

  const { lastUpdateId, bids, asks } = prevBook;
  const newUpdateId = nextBook.lastUpdateId;
  const newBids = nextBook.bids;
  const newAsks = nextBook.asks;

  return {
    prevId: lastUpdateId,
    nextId: newUpdateId,
    bids: diffList(bids, newBids),
    asks: diffList(asks, newAsks),
  };
}
