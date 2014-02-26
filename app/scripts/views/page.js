'use strict';
var Backbone = require('backbone');
Backbone.$ = window.$;


module.exports = Backbone.View.extend({

  tagName: 'li',
  className: 'page',
  template: JST['page'],

  events: {
    'keydown .image-url': 'load',
    'click .change-image': 'change',
    'click .save-page': 'save',
    'keydown .image-caption': 'saveOnEnter',
    'click .cancel': 'cancel',
    'click .remove-page': 'removePage',
    'click .edit-page': 'edit',
    'click .layout' : 'toggleLayout',
    'click .flickr-download': 'flickr' 
  },

  initialize: function (options) {
    //listen for changes of model and do actions based on events.
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'remove', this.remove);
    // parent view
    this.parent = options.parent;
    // if public show different template
    if (options.publicPage) {
      this.template = JST['page-public'];
    }
  },

  //render the view
  render: function () {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  load: function (e) {
    // Load image to the user immediatly for preview
    if (e.keyCode == 13 || e.keyCode == 9) { // when user presses enter or tab
        // Get relative DOM elements.
        var imageUrl = $(e.target);
        var placeholder = imageUrl.parent();
        var container = placeholder.parent();
        var changeImageBtn = placeholder.siblings('.change-image');
        var caption = container.siblings('.caption-container').find('.image-caption');
        
        var image = new Image();
        image.src = imageUrl.val();

        placeholder.addClass('hidden');
        var loading = placeholder.siblings('.loading').removeClass('hidden');

        // when image is loaded show it and hide loading text.
        var self = this;
        $(image).on('load', function() {
            loading.addClass('hidden');
            container.css('height', 'auto');            
            changeImageBtn.removeClass('hidden');
            image.style.display = 'none';
            container.prepend($(this));
            $(this).fadeIn();
        });

        if (e.keyCode == 13) caption.focus();
    }
  },

  change: function (e) {
    var changeImageBtn = $(e.target);
    var container = changeImageBtn.parent('.image-container');
    
    // handle changing of image.
    changeImageBtn.addClass('hidden');
    container.css('height', '300px');
    container.find('img').remove();
    container.find('.image').removeClass('hidden');
  },

  saveOnEnter: function (e) {
    if(e.keyCode == 13) this.save();
  },

  save: function () {
    // save the page to database and show it like another pages.

    var template = this.$('.template-selection .layout.active').data('layout');
    var images = [];
    var hasError = false;

    this.$('.image-url').each(function () {
        if (!this.value) {
            hasError = true;
            $(this).parent().addClass('has-error');
        }

        var imageUrl = $(this).val();
        var caption = $(this).parents('.image-container').siblings('.caption-container').find('.image-caption').val();
        images.push({imageUrl: imageUrl, caption: caption});
    });
    if (hasError) return;

    this.$el.removeClass('editing');

    this.model.save({
        template: template,
        images: images
    });
  },

  removePage: function () {
    this.model.destroy();
  },

  cancel: function () {
    if (typeof this.model.get('id') !== "undefined") {
        this.$el.removeClass('editing');
      console.log('noh')
    } else {
        this.model.destroy();
      }
  },

  toggleLayout: function (e) {
    //switch between different layouts when editing or creating a new page.
    var btn = $(e.target);
    if (!btn.hasClass('active')) {
        this.model.set('template', btn.data('layout'));
    }
  },

  edit: function () {
    this.$el.addClass('editing');
  },

  flickr: function (e) {    
    $(e.currentTarget).addClass('active');
    $('#flickr-modal').modal();
    
    $('#flickr-modal').on('hidden.bs.modal', function (e) {
        $(this).find('.loading').addClass('hidden');
        $('.flickr-download').removeClass('active');        
    });
  }

});

