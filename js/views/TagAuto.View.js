define([
    "jquery",
    "underscore",
    "backbone",
    "d3",
    "text!app/templates/TagAuto.Template.html"
], function(
        $,
        _,
        Backbone,
        d3,
        TagTemplate
        ) {
    var TagAutoView = Backbone.View.extend({
        className: "tagLine",
        initialize: function() {
            this.app = this.options.app;
            this.obj = this.options.obj;
            this.id = _.keys(this.obj)[0];
            this.children = this.obj[this.id];
            this.collapsed = false;
            this.contents = this.app.contentHash[this.id];
            this.els = {};
            this.highlightClicked = 0;
        },
        render: function() {
            this.$el.html(_.template(TagTemplate, this.contents[0].obj));

            var that = this;
            this.els.tag = this.$(".tag:first")[0];
            this.$(".tagButtons:first .attr").each(function() {
                var text = $(this).text();
                that.els[text] = this;
            });

            _.each(this.children, function(child) {
                var view = new TagAutoView({obj: child, app: that.app});
                console.log(view);
                that.$(".tagChildren:first").append(view.render().el);
            });

            return this;
        },
        drag: function() {
            var drag = d3.behavior.drag()
                    .on("dragstart", function() {

                    }).on("drag", function() {
                console.log("drag");
            }).on("dragend", function() {

            });

            return drag;
        },
        disableTag: function() {
            $(this.els.tag).addClass("disabled");
            $(this.els.tag).attr("draggable", false);
        },
        disableAttr: function(attr) {
            $(this.els[attr]).addClass("disabled");
            $(this.els[attr]).attr("draggable", false);
        },
        events: {
            "mouseenter .tagButtons:first": "mouseenter",
            "mouseleave .tagButtons:first": "mouseleave",
            "click .plus:first": "expand",
            "click .minus:first": "collapse",
            "click .tagButtons:first .tag": "highlight",
            "click .tagButtons:first .attr": "highlight",
            "dragstart .tagButtons:first .tag": "dragstart",
            "dragstart .tagButtons:first .attr": "dragstart"
                    // "drag .tagButtons:first .tag": "drag",
                    // "dragend .tagButtons:first .tag": "dragend"
        },
        mouseenter: function() {
            if (this.children.length > 0) {
                this.$(".icons:first").removeClass("hidden");
                this.$(".tagChildren:first").addClass("bordered");
            }
        },
        mouseleave: function() {
            if (this.children.length > 0 && !this.collapsed) {
                this.$(".icons:first").addClass("hidden");
                this.$(".tagChildren:first").removeClass("bordered");
            }
        },
        expand: function() {
            if (this.children.length > 0) {
                this.$(".tagChildren:first").show();
                this.$(".minus:first").show();
                this.$(".plus:first").hide();
                this.collapsed = false;
            }
        },
        collapse: function() {
            if (this.children.length > 0) {
                this.$(".tagChildren:first").hide();
                this.$(".minus:first").hide();
                this.$(".plus:first").show();
                this.collapsed = true;
            }
        },
        highlight: function() {
            $(".highlight").removeClass("highlight");
            var num = this.highlightClicked % this.contents.length;
            this.contents[num].highlight();
            this.highlightClicked += 1;
        },
        disable: function() {

            //TODO: add disable functionality 
        },
        enable: function() {
            //TODO: add enable functionality
        },
        // clickAttr: function() {
        // 	console.log("click attr");
        // 	$(".highlight").removeClass("highlight");
        // 	_.each(this.app.contentHash[this.id], function(content) { // ContentView
        // 		content.focusAttr();
        // 	});
        // },
        /*
        dragstart: function(e) {
            var name = $(e.target).text(),
                    type = $(e.target).hasClass("tag") ? "tag" : "attr";
            console.log(type);

            this.app.dragTarget = {
                type: type,
                name: name,
                view: this
            };

        }
*/
    });

    return TagAutoView;
});