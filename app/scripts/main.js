'use strict';
window.$ = require('jquery');
window.jQuery = window.$;
window._ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = window.$;
var Bootstrap = require('./vendors/bootstrap.min');

var Router = require('./routes/router');
var AlbumView = require('./views/album');
var HeaderView = require('./views/header');
var Pages = require('./collections/public-pages');
var AlbumsView = require('./views/albums');
var Common = require('./common');

$(function () {
  function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }

  var csrftoken = getCookie('csrftoken');

  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if ((!/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type))) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    }
  });

  new Router();

  var publicAlbum = $('#albumHash');
  
  // check if the album is public
  if (publicAlbum.length < 1) {
    
    // create the album view
    var albumsView = new AlbumsView();
    albumsView.$el.addClass('hidden');
    
    // Add it to DOM
    $('div[role="main"]').append(albumsView.render().el);
    
    // Save active view, so it can be removed later
    Common.albumsView = albumsView;
  
  } else {

    // get hash
    var id = publicAlbum.attr('value');
    
    // create album view
    var Album = Backbone.Model.extend({urlRoot: '/public/albums/'});
    var album = new Album({id: id});
    album.fetch({ success: function () {
      var pages = new Pages([], {albumId: id});
      var albumView = new AlbumView({collection: pages, model: album, publicAlbum: true});
      
      // show created albumView
      $('div[role="main"]').append(albumView.render().el);
    }});
  }
  
  new HeaderView();
});