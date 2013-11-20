define([
    "jquery",
    "underscore",
    "backbone"
], function(
    $,
    _,
    Backbone
) {
    return Backbone.Router.extend({
        initialize: function(options) {
            this.app = options.app;
        },
        routes: {
            ":history": "render"
        },
        render: function(history) {
            this.app.mediator.publish("router:render", history);
        }
    });
});