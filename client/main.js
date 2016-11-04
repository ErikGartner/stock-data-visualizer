import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { StockData } from '../lib/collections.js';

import Highcharts from 'highcharts/highstock';

import './main.html';

const DATA_KEYS = {'data.LastTradePriceOnly': 1, 'data.Name': 1, 'time': 1};

Template.stockselect.onCreated(function() {
  this.tickers = new ReactiveVar();
  this.tickersReady = new ReactiveVar(false);
  Meteor.call('getTickers', (error, result) => {
    if (error) {
      console.log(error);
    } else {
      this.tickers.set(result);
      this.tickersReady.set(true);
    }
  });
});

Template.stockselect.helpers({
  stocks: function() {
    if (Template.instance().tickersReady.get()){
      return Template.instance().tickers.get().sort(function(a, b){
          if(a < b) return -1;
          if(a > b) return 1;
                    return 0;
      });
    }
  }
});

Template.stockselect.events({
   'change select'(event, instance){
      var e = document.getElementById("selectedstock");
      var strStock = e.options[e.selectedIndex].text;
      Template.stockchart.showChart(strStock);
    }
});

Template.stockchart.showChart = function(ticker){
  handle = Meteor.subscribe('ticker', ticker, DATA_KEYS);
  Tracker.autorun(function() {
    if (handle.ready()){
      var sample = StockData.findOne();
      var decimals = sample.data.LastTradePriceOnly.split(".")[1].length;
      var name = sample.data.Name;
      var stockHistory = StockData.find().map(function (doc){
                          return [(new Date(doc.time)).getTime(),
                          parseFloat(doc.data.LastTradePriceOnly)]
                        });

      Highcharts.stockChart('chart', {
           rangeSelector: {
               selected: 1
           },

           title: {
              text: name
           },
          yAxis: {
            maxPadding:0.2,
            minPadding:0.2
          },
          series: [{
               name: ticker,
               data: stockHistory,
               tooltip: {
                  valueDecimals: decimals
               }
           }]
      });
      handle.stop();
    }
  });
};
