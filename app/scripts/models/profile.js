'use strict';
var Backbone = require('backbone');
Backbone.$ = window.$;


module.exports = Backbone.Model.extend({
  urlRoot: '/user/',
  defaults: {
    name: 'Add a name',
    password: ''
  }
});