'use strict';
var Backbone = require('backbone');
Backbone.$ = window.$;


module.exports = Backbone.Model.extend({

  defaults: {
  	name: 'Add a name',
  	cover: 'static/app/images/0.png'
  }

});