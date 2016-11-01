import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import Highcharts from 'highcharts/highstock';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  console.log(Highcharts);

  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
    Highcharts.stockChart('chart', {

            rangeSelector: {
                selected: 1
            },

            title: {
                text: 'AAPL Stock Price'
            },

            series: [{
                name: 'AAPL',
                data: [],
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });

  },
});
