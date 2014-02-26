'use strict';

var Backbone = require('backbone');
var AlbumView = require('../views/album');
var AlbumOrderView = require('../views/order');
var AlbumOrderConfirmView = require('../views/order-confirm');
var ProfileView = require('../views/profile');
var Pages = require('../collections/pages');
var Albums = require('../collections/albums');
var AlbumOrder = require('../models/albumOrder');
var Profile = require('../models/profile');
var Common = require('../common');

module.exports = Backbone.Router.extend({

  routes: {
    '': 'index',
    'albums/:id/order/success/:params': 'successOrder',
    'albums/:id/order/cancel/:params': 'cancelOrder',
    'albums/:id/order/error/:params': 'errorOrder',
    'albums/:id/order(/)': 'orderAlbum',
    'albums/:id(/)': 'showAlbum',
    'profile/': 'showProfile'

  },

  initialize: function () {
  },

  index: function () {
    // make sure that browsers back and foward buttons works correctly
    // by removing and showing right content 
    if (Common.activeAlbumView) Common.activeAlbumView.trigger('remove');
    if (Common.albumsView) Common.albumsView.$el.removeClass('hidden');
    if (Common.profileView) Common.profileView.trigger('remove');
    if (Common.orderView) Common.orderView.trigger('remove');
    if (Common.orderConfirmView) Common.orderConfirmView.trigger('remove');
  },

  showProfile: function () {
    // remove activeAlbumView
    if (Common.activeAlbumView) Common.activeAlbumView.trigger('remove');
    // hide albums view
    if (Common.albumsView) Common.albumsView.$el.addClass('hidden');
    // remove order view
    if (Common.orderView) Common.orderView.trigger('remove');
    // remove order confirm view
    if (Common.orderConfirmView) Common.orderConfirmView.trigger('remove');

    // create profile page
    var profile = new Profile();
    profile.fetch({ success: function (data) {
      var profileView = new ProfileView({model: data});
      $('div[role="main"]').append(profileView.render().el);
      Common.profileView = profileView;
    }});
  },

  showAlbum: function (id) {
    // remove activeAlbumView
    if (Common.activeAlbumView) Common.activeAlbumView.trigger('remove');
    // hide albums view
    if (Common.albumsView) Common.albumsView.$el.addClass('hidden');
    // remove profile view
    if (Common.profileView) Common.profileView.trigger('remove');
    // remove order view
    if (Common.orderView) Common.orderView.trigger('remove');
    // remove order confirm view
    if (Common.orderConfirmView) Common.orderConfirmView.trigger('remove');

    // create album view
    var pages = new Pages([], {albumId: id});
    var album = Albums.get(id);
    var albumView = new AlbumView({collection: pages, model: album});
    
    // show created albumView
    $('div[role="main"]').append(albumView.render().el);
    
    // save the active album view
    Common.activeAlbumView = albumView;
  },

  orderAlbum: function (id) {
    // remove activeAlbumView
    if (Common.activeAlbumView) Common.activeAlbumView.trigger('remove');
    // hide albums view
    if (Common.albumsView) Common.albumsView.$el.addClass('hidden');
    // remove profile view
    if (Common.profileView) Common.profileView.trigger('remove');
    // remove order confirm view
    if (Common.orderConfirmView) Common.orderConfirmView.trigger('remove');

    var album = Albums.get(id);
    var order = new AlbumOrder({albumId: id, paymentId: 0});
    order.fetch({success: function () {
      var orderView = new AlbumOrderView({model: order, album: album});
      $('div[role="main"]').append(orderView.render().el);
      Common.orderView = orderView;
    }});
  },

  successOrder: function(id, params) {
    // create and show order success view
    var paymentId = this.getPaymentIdFromParams(params);
    var checksum = this.getChecksumFromParams(params);
    var ref = this.getRefFromParams(params);
    var order = new AlbumOrder({id: paymentId, albumId: id, paymentId: paymentId, success: true, ref: ref});
    
    var orderConfirmView;
    order.fetch({success: function () {
      if (order.attributes.checksum == checksum){
        orderConfirmView =  new AlbumOrderConfirmView({albumId: id, success: true});        
      }
      else {
        order.destroy();
        orderConfirmView = new AlbumOrderConfirmView({albumId: id, error: true});
      }
      $('div[role="main"]').append(orderConfirmView.render().el);
      Common.orderConfirmView = orderConfirmView;

    }});
  },

  cancelOrder: function(id, params) {
    // create and show order cancel view
    var paymentId = this.getPaymentIdFromParams(params);
    var order = new AlbumOrder({id: paymentId, albumId: id, paymentId: paymentId, success: true});
    order.destroy({success: function () {
      var orderConfirmView =  new AlbumOrderConfirmView({albumId: id, cancel: true});
      $('div[role="main"]').append(orderConfirmView.render().el);
      Common.orderConfirmView = orderConfirmView;
    }});
  },

  errorOrder: function (id, params) {
    // create and show order error view
    var orderConfirmView = new AlbumOrderConfirmView({albumId: id, error: true});
    $('div[role="main"]').append(orderConfirmView.render().el);
    Common.orderConfirmView = orderConfirmView;

  },

  getPaymentIdFromParams: function(params) {
    // parse paymentId from url params
    var pidIndex = params.indexOf('pid=',0)+4;
    var pidEndIndex = params.indexOf('ref', 0)-1;
    var paymentId = params.substring(pidIndex, pidEndIndex);
    return paymentId;
  },

  getChecksumFromParams: function(params) {
    // parse checksum from url params
    var checksumBegIndex = params.indexOf('checksum=',0)+9;
    var checksumEndIndex = params.length;
    var checksum = params.substring(checksumBegIndex, checksumEndIndex);
    return checksum;
  },

  getRefFromParams: function(params) {
    // parse ref from url params
    var refBegIndex = params.indexOf('ref=',0)+4;
    var refEndIndex = params.indexOf('&checksum');
    var ref = params.substring(refBegIndex, refEndIndex);
    return ref;
  }

});