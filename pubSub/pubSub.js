class PubSub {
    constructor() {
      this.events = {};
    }
  
    subscribe(event, listener) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(listener);
    }
  
    publish(event, data) {
      if (this.events[event]) {
        this.events[event].forEach(listener => listener(data));
      }
    }
  }
  
  const pubSub = new PubSub();
  
  // Subscriber to handle delivery status updates
  pubSub.subscribe('sendMessage', async (data) => {
    const { logId, status } = data;
  
    try {
      const response = await fetch(`http://localhost:5000/api/messages/receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId, status }),
      });
  
      if (!response.ok) {
        console.error(`Failed to update log ${logId}:`, await response.text());
      }
    } catch (err) {
      console.error('Error in pub-sub listener:', err);
    }
  });
  
  module.exports = { PubSub: pubSub };
  