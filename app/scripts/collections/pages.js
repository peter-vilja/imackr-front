'use strict';
var Backbone = require('backbone');
Backbone.$ = window.$;

var Page = require('../models/page');

var Collection = Backbone.Collection.extend({
	model: Page,
	
	url: function() {
		return '/albums/' + this.albumId + '/pages/';
	},

	initialize: function(models, options) {
		this.albumId = options.albumId;
	}

});

module.exports = Collection;