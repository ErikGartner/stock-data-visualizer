import { Meteor } from 'meteor/meteor';
import { StockData } from '../lib/collections.js';

Meteor.startup(() => {
});

Meteor.methods({
  getTickers: function() {
    return Meteor.wrapAsync(callback => {
      StockData.rawCollection().distinct('ticker', callback);
    })();
  }
});
