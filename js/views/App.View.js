define([
    "jquery",
    "underscore",
    "backbone",
    "app/models/Node.Model",
    // "app/views/Node.View",
    "app/views/NodeAuto.View",
    "app/views/Content.View",
    "app/views/Tag.View",
    "app/views/TagAuto.View",
    "app/processConfig"
], function(
        $,
        _,
        Backbone,
        NodeModel,
        NodeView,
        ContentView,
        TagView,
        TagAutoView,
        ProcessConfig
        ) {
    return Backbone.View.extend({
        el: "body",
        initialize: function() {
            // inp = input
            this.input = this.options.input;
            this.app = this.options.app;

            this.app.mediator.subscribe("node:removed", _.bind(this.renderNodes, this));
        },
        render: function() {
            var that = this;
            this.renderNodes(this.fetchFromLocal());
            // when done rendering content, render tag
            this.renderContent(function() {
                that.renderTag();
                // that.renderAutoTag();
            });
        },
        renderNodes: function(nodes) {
            // console.log(nodes);
            nodes.type = "document";
            // nodes['xpaths'] = this.input.xpaths;
            nodes.app = this.app;

            var model = this.topModel = new NodeModel(nodes),
                    view = new NodeView({app: this.app, model: model});
            this.$("#tagHierarchy").append(view.render().el);
            this.app.views[model.cid] = view;
        },
        /**
         * function to render the initial tag tree on the left 
         */
        renderTag: function() {
            // console.log(this);
            var view = new TagView({obj: this.app.contentNested, app: this.app, xpaths: this.input.xpaths});
            this.$("#tagContainer").append(view.render().el);

        },
        renderAutoTag: function() {
            var view = new TagAutoView({obj: this.app.contentNested, app: this.app});
            this.$("#tagAutoContainer").append(view.render().el);
        },
        renderContent: function(callback) {
            var view = new ContentView({obj: this.input, app: this.app});
            this.$("#content").append(view.render().el);

            callback();
        },
        events: {
            "click .save": "saveToLocal"
        },
        /*
         save to local storage, do not hit the server unless the user is done
         */
        saveToDB: function() {
            //TODO: Save to DB
        },
        loadFromDB: function() {
            //TODO: Load to DB
        },
        saveToLocal: function() {
            var data = JSON.stringify(this.topModel);
            console.log(JSON.stringify(this.topModel.toJSON_Simple()));
            localStorage["nodes"] = data;
//			console.log(data);
            // console.log(ProcessConfig);
//			var pc = new ProcessConfig(this.topModel);
            // pc.process(data);
        },
        fetchFromLocal: function() {
            var nodes = (localStorage["nodes"] ? $.parseJSON(localStorage["nodes"]) : {});
            console.log(nodes);
            return nodes;
            // return {};
        }
    });
});