'use strict';
var Backbone = require('backbone');
Backbone.$ = window.$;

var Albums = require('../collections/albums');
var AlbumItemView = require('../views/album-item');

module.exports = Backbone.View.extend({

  tagName: 'article',
  className: 'albums-container',
  template: JST['albums'],

  events: {
    'click .add-album': 'addAlbum'
  },

  initialize: function () {
    this.listenTo(Albums, 'add', this.add);
    this.listenTo(this, 'destroy', this.remove);
  },

  render: function () {
    this.$el.html(this.template());
    this.$albums = this.$('.albums');
    
    //fetch albums
    Albums.fetch({success: function () {
      Backbone.history.start();
    }});

    return this;
  },

  add: function (album) {
    // Create an album and add it to the list of albums
    var albumItemView = new AlbumItemView({ model: album });
    this.$albums.prepend(albumItemView.render().el);
  },

  addAlbum: function () {
    // create new album and fire post to backend
    Albums.add({
      name: 'Add a name'
    });
    // focus on edit input
    var item = this.$albums.find('li:first');
    item.addClass('editing');
    item.find('.edit').focus();
  }
});