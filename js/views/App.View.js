define([
	"jquery",
	"underscore",
	"backbone",
	"app/routers/History.Router",
	"app/models/Node.Model",
	"app/views/Node.View",
	"app/views/Content.View",
	"app/views/Tag.View"
], function(
	$,
	_,
	Backbone,
	HistoryRouter,
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
	    this.router = new HistoryRouter({app: this.app});

			this.app.mediator.subscribe("node:removed", _.bind(this.renderNodes, this));
			this.app.mediator.subscribe("node:save", _.bind(this.saveToLocal, this));
			this.app.mediator.subscribe("router:render", _.bind(this.renderNodes, this));
		},
		render: function() {
			var that = this;
			this.renderNodes();
			// when done rendering content, render tag
			this.renderContent(function() {
				that.renderTag();
			});

	    Backbone.history.start();
		},
		renderNodes: function(history) {
			nodes = this.fetchFromLocal(history);
			nodes.type = "document";
			nodes.app = this.app;
			var model = this.topModel = new NodeModel(nodes),
				view = new NodeView({app: this.app, model: model});
			this.$("#tagHierarchy").html(view.render().el);
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
		},
		events: {
			"click .undo": "undo",
			"click .redo": "redo"
		},
		undo: function() {
			this.app.history -= 2;
			this.router.navigate("" + this.app.history, {trigger: true});
		},
		redo: function() {
			this.router.navigate("" + this.app.history, {trigger: true});
		},
		/*
		save to local storage, do not hit the server unless the user is done
		*/
		saveToLocal: function() {
			var nodes = (localStorage["nodes"] ? $.parseJSON(localStorage["nodes"]) : []),
					history = this.app.history;
			this.router.navigate("" + history);
			localStorage["history"] = history;
			nodes = _.first(nodes, history);
			nodes.push(this.topModel.toJSON());
			localStorage["nodes"] = JSON.stringify(nodes);

			this.app.history += 1;
		},
		fetchFromLocal: function(history) {
			var nodes = (localStorage["nodes"] ? $.parseJSON(localStorage["nodes"]) : null);
			if (history && nodes[history]) {
					localStorage["history"] = history;
					this.app.history = parseInt(history) + 1;
			} else if (!nodes[history] || !history) {
					this.app.history = history = parseInt(localStorage["history"]);
					this.router.navigate("" + history);
					console.log(this.app.history);
			}
			return (nodes && nodes[history] ? nodes[history] : {});
		}
	});
});