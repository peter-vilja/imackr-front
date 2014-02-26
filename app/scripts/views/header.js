'use strict';
var Backbone = require('backbone');
Backbone.$ = window.$;

var Common = require('../common');

module.exports = Backbone.View.extend({
  el: '#main-header',

  events: {
    'click #logout': 'logout',
    'click #signin': 'signin',
    'click #profile': 'showProfile'
  },

  initialize: function () {
  },

  logout: function () {
    $.post('/logout/', function () {
      location.reload();
    });
  },

  signin: function () {
    location.replace('/login/');
  },

  showProfile: function () {
    // destroy current active view if exists
    if (Common.albumsView) {
      Common.albumsView.$el.addClass('hidden');
    }
    Backbone.history.navigate('profile/', {trigger: true});
  }
});