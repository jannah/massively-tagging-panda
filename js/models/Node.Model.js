define([
	"jquery",
	"underscore",
	"backbone",
	"app/collections/Nodes.Collection"
], function(
	$,
	_,
	Backbone,
	NodesCollection
) {
	var NodeModel = Backbone.Model.extend({
		initialize: function() {
			this.app = this.attributes.app;
			this.attributes.type ? this.setType(this, this.attributes.type) : this.setType(this, "");
			this.attributes.name ? this.setName(this, this.attributes.name) : this.setName(this, "");
			this.attributes.children ? this.setChildren(this, this.attributes.children) : this.setChildren(this, []);
			if (this.attributes.tag) this.setTag(this, this.attributes.tag);
			if (this.attributes.attr) this.setAttr(this, this.attributes.attr);
			// this.attributes.name = this.attributes.name || "";
			// this.attributes.type = this.attributes.type || "";

			this.on("change:children", this.setChildren);
			this.on("change:type", this.setType);
			this.on("change:name", this.setName);
			this.on("change:tag", this.setTag);
			this.on("change:attr", this.setAttr);
		},
		setChildren: function(model, val) {
			if (!this.children) {
				NodesCollection = NodesCollection || require("app/collections/Nodes.Collection");
				this.children = new NodesCollection();
			}
			this.children.reset(val);
		},
		setType: function(model, val) {
			var badge;
			if (val === "document") {
				badge = this.app.badges.document;
			} else if (val === "subunit") {
				badge = this.app.badges.subunit;
			} else if (val === "metadata") {
				badge = this.app.badges.metadata;
			} else {
				badge = "";
			}
			model.set("type", val, {silent: true});
			model.set("badge_type", badge);
		},
		setName: function(model, val) {
			var badge,
				names = {};
			_.chain(this.app.views)
				.values()
				.each(function(view) {
					names[view.model.get("name")] = view.model;
				});
				console.log(names);
			if (val === "title") {
				badge = this.app.nameBadges.title;
				console.log("title", names.title);
				if (!_.isEmpty(names)) names.title.set("name", ""); // need to figure out error message;

			} else if (val === "sentence") {
				badge = this.app.nameBadges.sentence;
				if (!_.isEmpty(names)) names.sentence.set("name", "");
				console.log("sentence", names.sentence);
			} else {
				badge = "";
			}
			model.set("name", val, {silent: true});
			model.set("name_badge", badge);
		},
		setTag: function(model, val) {
			if (val) {
				model.set("attr", "");
				model.set("btn_type", this.app.btnTypes.tag);
			}
		},
		setAttr: function(model, val) {
			if (val) {
				model.set("tag", "");
				model.set("btn_type", this.app.btnTypes.attr);
			}
		}
	});

	// exports.NodeModel = NodeModel;
	return NodeModel;
});