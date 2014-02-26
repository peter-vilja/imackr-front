'use strict';
var Backbone = require('backbone');
Backbone.$ = window.$;

var PageView = require('../views/page');

module.exports = Backbone.View.extend({

  tagName: 'section',
  className: 'album',

  template: JST['album'],

  //initing events
  events: {
    'click .page-prev': 'prev',
    'click .page-next': 'next',
    'click .add-page': 'addPage',
    'click #public-link': 'togglePublic',
    'click #order': 'order',
    'submit #flickr-search': 'search',
    'click .flickr-image': 'addFlickr'
  },

  initialize: function (options) {
    this.pageCount = 0;         //count of pages
    this.animating = false;     //helper for animation
    this.page = 0;              //current page index

    this.listenTo(this.collection, 'add', this.add);
    this.listenTo(this.collection, 'destroy', this.removeOne);
    this.listenTo(this, 'remove', this.remove);
    if (options.publicAlbum) {
      this.template = JST['album-public'];
    }
    this.publicAlbum = options.publicAlbum;
  },

  render: function () {
    //render the html of the view
    this.$el.html(this.template(this.model.attributes));
    
    //get DOM elements
    this.$list = this.$('#album-pages');
    this.$prev = this.$('.page-prev');
    this.$next = this.$('.page-next');
    this.$linkButton = this.$('#public-link');
    this.$link = this.$('#link-input');
    this.$search = this.$('#flickr-search-term');
    this.$results = this.$('.flickr-search-results');

    var hash = this.model.attributes.ahash;
    if (this.model.attributes.public == 1) {
      this.$link.addClass('public');
      this.$linkButton.addClass('public');
    }
    this.$link.attr('value', window.location.origin + '/public/album/' + hash);

    //fetch album pages
    this.collection.fetch();

    return this;
  },

  add: function (page) {
    this.pageCount += 1;

    var parent = this;
    var publicPage = false;
    if (this.publicAlbum) {
      publicPage = true;
    }
    // Create a page and add it to the DOM of album
    var pageView = new PageView({ collection: this.collection, model: page, parent: parent, publicPage: publicPage });
    this.$list.append(pageView.render().el);
    this.update();
  },

  removeOne: function (page) {
    // Handle navigation after removing a page
    this.pageCount -= 1;
    this.update();
    
    if (this.page > 0) {
      this.page -= 1;
    }
    this.slide();
  },

  update: function () {
    // Add album width as wide as there is pages
    this.$list.css('width', 100 * this.pageCount + '%');

    // Make each page to 100% width
    this.$list.find('li').css('width', 100 / this.pageCount + '%');

    // show next and previous buttons
    if (this.pageCount > 1) {
      this.$next.removeClass('hidden');      
    }
  },

  prev: function () {
    // if already animating do nothing
    if (this.animating) {
      return false;
    }

    // update the value of page index and animation
    this.animating = true;
    if (this.page > 0) {
      --this.page;
    }

    this.slide();
  },

  next: function () {
    // if already animating do nothing
    if (this.animating) {
      return false;
    }

    // update the value of page index and animation
    this.animating = true;
    if (this.page < this.pageCount-1) {
      ++this.page;
    }

    this.slide();
  },

  slide: function (add) {
    // check prev and next arrows status
    this.toggleNav();
    var page = page || this.page;
    // calculating the x coordinate for transition
    var translate = page * 100 / this.pageCount;
    
    // adding new coordinates
    this.$list.css('transform', 'translate3d(-'+translate+'%,0,0)');

    //listening for a transition end event
    this.$list.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', $.proxy(function() {
      this.animating = false;
      if (add) this.$list.find('li:last .image-url').focus();
    },this));
  },

  toggleNav: function () {
    //Toggle nav buttons visibility
    //if showing the first page
    if (this.page == 0) {
      if (this.pageCount <= 1) {
        this.$next.addClass('hidden');
      } else {
        this.$next.removeClass('hidden');
      }
      this.$prev.addClass('hidden');

    //if showing the last page
    } else if (this.page == this.pageCount-1) {
      this.$next.addClass('hidden');
      this.$prev.removeClass('hidden');
    } else {
      this.$next.removeClass('hidden');
      this.$prev.removeClass('hidden');
    }
  },

  addPage: function () {
    this.collection.add({
      template: 1,
      images: []
    });
    this.page = this.pageCount-1;
    this.slide(true);

    var item = this.$list.find('li:last');
    item.addClass('editing');
  },

  // toggle public status
  togglePublic: function () {
    var publ = 0;
    // if not public set public 1 when clicked
    if (!this.$link.hasClass('public')) {
      publ = 1;
    }
    this.model.save({public: publ}, {silent: true});
    this.$link.toggleClass('public');
    this.$linkButton.toggleClass('public');
    this.$link.focus();
  },

  order: function () {
    // navigate to the selected album order page
    Backbone.history.navigate('albums/' + this.model.get('id') + '/order', {trigger: true});
  },

  search: function () {
    // empty old image list
    this.$results.empty();

    var term = this.$search.val();
    var container = this.$results;
    var loading = container.siblings('.loading');
    loading.removeClass('hidden');
    
    // get flickr photos and add them to modal.

    $.getJSON('http://api.flickr.com/services/feeds/photos_public.gne?tags=' + term + '&tagmode=any&format=json&jsoncallback=?', function (data) {
      loading.addClass('hidden');
      data.items.forEach(function (item) {
        $('<li>', {'class': 'flickr-result'}).html('<img src="'+ item.media.m + '" class="flickr-image" alt="'+ item.title + '"/>').appendTo(container);
      });
    });

    return false;
  },

  addFlickr: function (e) {
    var elem = $(e.target);
    var url = elem.attr('src').replace('_m.jpg', '_b.jpg');
    var caption = elem.attr('alt');
    
    // get relative DOM elements and add url and caption.
    var btn = $('.flickr-download.active');
    btn.siblings('.image-url').val(url);
    btn.parents('.image-container').siblings('.caption-container').find('.image-caption').val(caption);

    // hide and clean flickr model
    $('#flickr-modal').modal('hide');
  }
  
});