'use strict';
var Backbone = require('backbone');
Backbone.$ = window.$;


module.exports = Backbone.Model.extend({

  defaults: {
    template: 1,
    images: []
  }

});