'use strict';
var Backbone = require('backbone');
Backbone.$ = window.$;

var Common = require('../common');

module.exports = Backbone.View.extend({
  tagName: 'section',
  className: 'profile-content',
  template: JST['profile'],

  events: {
    'submit #profile-form': 'saveProfile',
    'click #profile-cancel': 'cancel',
    'keydown #image-url': 'updatePicture'
  },

  initialize: function () {
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this, 'remove', this.remove);
  },

  render: function () {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  saveProfile: function (e) {
    e.preventDefault();
    $.post('/user/', $('#profile-form').serialize(), function () {
      this.removeView();
      Backbone.history.navigate('/', {trigger: true});
    }.bind(this));
  },

  cancel: function () {
    this.removeView();
    Backbone.history.navigate('/', {trigger: true});
  },

  removeView: function () {
    this.model.destroy();
  },

  updatePicture: function (e) {
    if (e.keyCode === 9) {
      $('#profile-image').attr('src', $('#image-url').val());
    }
  }

});