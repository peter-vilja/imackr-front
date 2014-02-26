'use strict';
var Backbone = require('backbone');
Backbone.$ = window.$;


module.exports = Backbone.View.extend({

    className: 'order',
    template: JST['order'],

    events: {
        'submit .order-form': 'save',
        'click #cancel': 'cancel'
    },

    initialize: function (options) {
        // initializing order view
        this.order = options.model;
        this.album = options.album;
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'remove', this.remove);
        this.listenTo(this, 'remove', this.remove);
    },

    //render the view
    render: function () {
        this.$el.html(this.template({order: this.model.attributes, album: this.album.attributes}));
        var albumId = this.model.attributes.albumId;
        // put custom urls to the template view
        this.$('#success_url').attr('value', window.location.origin +'/#albums/' + albumId + '/order/success/');
        this.$('#cancel_url').attr('value', window.location.origin +'/#albums/' + albumId + '/order/cancel/');
        this.$('#error_url').attr('value', window.location.origin +'/#albums/' + albumId + '/order/error/');
        return this;
    },

    // Save order and send the form to the POST-url
    save: function (e) {
        // lets remove all old error warnings
        this.$('.form-group').removeClass('has-error');

        var self = this;

        // get form data
        var address = this.$('#address').val();
        var postalCode = this.$('#postalCode').val();
        var city = this.$('#city').val();
        var email = this.$('#email').val();
        var phone = this.$('#phone').val();
        var hasError = false;

        // Some basic validation if error stop process and add error class
        if (address == "")  {
            this.$('#address').parent().addClass('has-error');
            hasError = true;
        }

        if (postalCode == "" || !/^\d+$/.test(postalCode)) {
            this.$('#postalCode').parent().addClass('has-error');
            hasError = true;
        }

        if (city == "") {
            this.$('#city').parent().addClass('has-error');
            hasError = true;
        }

        if (email == "" || !/\S+@\S+\.\S+/.test(email)) {
            this.$('#email').parent().addClass('has-error');
            hasError = true;
        }

        if (phone == "") {
            this.$('#phone').parent().addClass('has-error');
            hasError = true;
        }
        
        if (hasError) return false;

        //save form data to the JSON-model and sen PUT -request to the server-side
        this.model.save({
            address: address,
            postalCode: postalCode,
            city: city,
            email: email,
            phone: phone
        },{success: function() {
            self.$('#order-form').removeClass('order-form');
            // send the form to Niksula
            $('#save').click();
        }}
        );
        return false;
    },

    cancel: function () {
        // Remove the just created order model and open the album view
        this.model.destroy();
        this.$el.empty();
        Backbone.history.navigate('albums/' + this.album.get('id'), {trigger: true});
    }

});

