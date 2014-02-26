'use strict';
var Backbone = require('backbone');
Backbone.$ = window.$;


module.exports = Backbone.View.extend({

    className: 'order-confirm',
    template: JST['order-confirm'],

    initialize: function (options) {
        if (options.success){
            this.success = 0;
        } else if (options.cancel){
            this.success = 1;
        } else {
            this.success = 2;
        }
        this.albumId = options.albumId;
        this.listenTo(this, 'remove', this.remove);
    },

    //render the view
    render: function () {
        this.$el.html(this.template({albumId: this.albumId, success: this.success}));
        return this;
    }
});

