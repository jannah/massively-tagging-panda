/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


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
    var TreeView = Backbone.View.extend({
        className: "tagLine",
        initialize: function() {
            this.model = this.options.model;
        },
        render: function() {
            return this;
        },
        disableTag: function() {
        },
        disableAttr: function(attr) {

        },
        events: {
            "mouseenter .tagButtons:first": "mouseenter",
            "mouseleave .tagButtons:first": "mouseleave",
            "click .plus:first": "expand",
            "click .minus:first": "collapse",
            "click .tagButtons:first .tag": "highlight",
            "click .tagButtons:first .attr": "highlight"
            // "drag .tagButtons:first .tag": "drag",
            // "dragend .tagButtons:first .tag": "dragend"
        }, /*
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
         },*/
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

    return TreeView;
});