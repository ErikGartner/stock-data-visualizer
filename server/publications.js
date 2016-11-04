import { StockData } from '../lib/collections.js';

Meteor.publish('StockData', function stockPublication() {
  return StockData.find();
});

Meteor.publish('ticker', function stockPublication(ticker) {
  return StockData.find({'ticker':ticker});
})
