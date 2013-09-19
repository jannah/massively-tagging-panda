define([
	"jquery",
	"underscore",
	"backbone",
	"text!app/templates/Node.Template.html",
	"text!app/templates/NodeDropped.Template.html",
	"app/views/NodeModal.View"
], function(
	$,
	_,
	Backbone,
	NodeTemplate,
	NodeDroppedTemplate,
	NodeModalView
) {
	var NodeView = Backbone.View.extend({
		className: "node",
		initialize: function() {
			this.app = this.options.app;
			this.parent = this.options.parent; // parent NodeView
			this.model = this.options.model;
			this.droppable = true;

			var that = this;
			this.model.on("change", _.bind(this.renderDropped, this));
			this.model.children.on("reset", _.bind(this.renderChildren, this));
			this.model.children.on("add", function(model) {
				that.renderChild(model);
			});

		},
		render: function() {
			this.$el.html(_.template(NodeTemplate));
			if (this.model.get("tag")) {
				this.renderDropped();
				this.createModal();
				this.showDropped();
			}
			this.renderChildren();

			return this;
		},
		renderDropped: function() {
			console.log(this.el, "render drop");
			this.$(".dropped:first").html(_.template(NodeDroppedTemplate, this.model.attributes));
		},
		removeChildren: function() {
			this.$(".childNodes:first").empty();
		},
		renderChildren: function() {
			this.removeChildren();
			var that = this;
			this.model.children.each(function(model) {
				that.renderChild(model);
			});
		},
		renderChild: function(model) {
			var view = new NodeView({app: this.app, model: model, parent: this.model});
			this.$(".childNodes:first").append(view.render().el);
			this.app.views[model.cid] = view;
		},
		events: {
			// drag events
			"dragover .undropped:first": "dragover",
			"dragenter .undropped:first": "dragenter",
			"dragleave .undropped:first": "dragleave",
			"drop .undropped:first": "drop",
			// "hidden .modal:first": "showDropped",
			"click .edit:first": "edit",
			"click .addChild:first": "addChild"
		},
		dragover: function(e) {
			e.preventDefault();
		},
		dragenter: function(e) {
			this.$(".undropped:first").addClass("dragenter");
		},
		dragleave: function() {
			this.$(".undropped:first").removeClass("dragenter");
		},
		drop: function(e) {
			if (this.droppable) {
				this.tag = this.app.dragTarget.view; // tagView
				// this.app.dragTarget = undefined;

				var name = this.app.dragTarget.name;
				if (this.app.dragTarget.type === "tag") {
					this.model.set("tag", name);
					this.tag.disableTag();
				} else {
					this.model.set("attr", name)
					this.tag.disableAttr(name);
				}
				this.createModal();
				this.modal.open();
				this.showDropped();

				this.dragleave();
				this.droppable = false;
			}

		},
		createModal: function() {
			this.modal = new NodeModalView({
				app: this.app, 
				model: this.model, 
				parent: this.parent
			});
			$("#modal").append(this.modal.render().el);
		},
		showDropped: function() {
			this.$(".undropped:first").hide();
			this.$(".dropped:first").show();

		},
		edit: function() {
			console.log("edit");
			this.modal.open();
		},
		addChild: function() {
			this.model.children.add({app: this.app});
		}
	});

	return NodeView;
});