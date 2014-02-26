'use strict';
var Backbone = require('backbone');
Backbone.$ = window.$;

var Common = require('../common');


module.exports = Backbone.View.extend({

  tagName: 'li',
  template: JST['album-item'],

  events: {
  	'click img': 'navigate',
    'click figcaption': 'navigate',
  	'keypress .edit': 'updateOnEnter',
    'click .remove-album': 'destroy',
    'click .edit-name': 'editLabel'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  render: function () {
    this.$el.html(this.template(this.model.attributes));
    this.$input = this.$('.edit');
    return this;
  },

  focus: function () {
  	this.$input.focus();
  },

  navigate: function () {

  	if (this.$el.hasClass('editing')) {
  		this.focus();
  		return;
  	}
  	// destroy current active view if exists
  	if (Common.albumsView) {
  		Common.albumsView.$el.addClass('hidden');
  	}

  	// navigate to the selected album
  	Backbone.history.navigate('albums/' + this.model.get('id'), {trigger: true});
  },

  updateOnEnter: function (e) {
  	// if enter key is pressed save
  	if (e.keyCode === 13) {
  		this.save();
  	}
  },

  save: function () {
  	var value = this.$input.val().trim();
  	
  	if (value) {
  		var self = this;
  		this.model.save({name: value});
  	} else {
  		this.destroy();
  	}

  	this.$el.removeClass('editing');  
  },

  editLabel: function () {
    this.$el.toggleClass('editing');
    this.$input.focus();
  },

  destroy: function() {
  	this.model.destroy();
  }

});