define([
	"jquery",
	"underscore",
	"backbone",
	"app/models/Node.Model",
	"app/views/Node.View",
	"app/views/Content.View",
	"app/views/Tag.View"
], function(
	$,
	_,
	Backbone,
	NodeModel,
	NodeView,
	ContentView,
	TagView
) {
	return Backbone.View.extend({
		el: "body",
		initialize: function() {
			// inp = input
			this.input = this.options.input;
			this.app = this.options.app;
			console.log(this.input);
		},
		render: function() {
			var that = this;
			this.renderNode();
			// when done rendering content, render tag
			this.renderContent(function() {
				that.renderTag();
			});
		},
		renderNode: function() {
			var obj = {
				app: this.app,
				type: "document",
				name: "document",
				tag: "TEI",
				children: [
					{
						app: this.app,
						type: "subunit",
						name: "sentence",
						tag: "head",
						children: [
							{
								app: this.app,
								type: "metadata",
								name: "author",
								tag: "author"
							}
						]
					},
					{
						app: this.app,
						type: "metadata",
						name: "title",
						tag: "title"
					},
					{
						app: this.app,
						type: "subunit",
						name: "name",
						tag: "name"
					}
				]
			};
			var model = new NodeModel(obj),
				view = new NodeView({app: this.app, model: model});
			this.$("#tagHierarchy").append(view.render().el);
			this.app.views[model.cid] = view;
		},
		renderTag: function() {
			var view = new TagView({obj: this.app.contentNested, app: this.app});
			this.$("#tagContainer").append(view.render().el);

		},
		renderContent: function(callback) {
			var view = new ContentView({obj: this.input, app: this.app});
			this.$("#content").append(view.render().el);

			callback();
		}
	});
});