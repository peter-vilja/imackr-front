'use strict';
var Backbone = require('backbone');
Backbone.$ = window.$;

var Album = require('../models/album');

var Collection = Backbone.Collection.extend({
	url: '/albums/',
	model: Album
});

module.exports = new Collection();