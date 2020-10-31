class EventBus {
  constructor() {
    this.subscriptions = {};
  }

  subscribe(event, handler) {
    const eventExists = this.subscriptions[event];
    if (eventExists) {
      const subscriberIndex = this.subscriptions[event].indexOf(handler);
      if (subscriberIndex === -1) {
        this.subscriptions[event].push(handler);
      } else {
        throw new Error('Already subscribed to this event');
      }
    } else {
      this.subscriptions[event] = [handler];
    }
  }

  unsubscribe(event, handler) {
    const eventExists = this.subscriptions[event];
    if (eventExists) {
      const subscriberIndex = this.subscriptions[event].indexOf(handler);
      if (subscriberIndex !== -1) {
        this.subscriptions[event].splice(subscriberIndex, 1);
      } else {
        throw new Error('Subscriber doesn\'t exist');
      }
    } else {
      throw new Error('Subscriber doesn\'t exist');
    }
  }

  publish(event, payload) {
    const eventSubscribers = this.subscriptions[event];
    if (eventSubscribers) eventSubscribers.forEach((handler) => handler(payload));
  }
}

export default EventBus;
