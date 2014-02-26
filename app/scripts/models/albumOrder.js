'use strict';
var Backbone = require('backbone');
Backbone.$ = window.$;


module.exports = Backbone.Model.extend({
  urlRoot: function() {
    return '/albums/' + this.get('albumId') + '/order/' + this.get('ref');
  },
  defaults: {
    id: 0,
    albumId: '',
    paymentId: '',
  	address: '',
  	postalCode: '',
    city: '',
    email: '',
    phone: '',
    checksum: '',
    ref: ''
  }
});