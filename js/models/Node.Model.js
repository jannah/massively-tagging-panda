define(["jquery", "underscore", "backbone", "app/collections/Nodes.Collection"], function($, _, Backbone, NodesCollection)
{
	var NodeModel = Backbone.Model.extend({
		initialize : function()
		{

			this.app = this.attributes.app;
			if (this.attributes.tag)
				this.setTag(this, this.attributes.tag);
			if (this.attributes.attr)
				this.setAttr(this, this.attributes.attr);
			// console.log(this.attributes.xpaths);
			this.attributes.type ? this.setType(this, this.attributes.type) : this.setType(this, "");
			this.attributes.name ? this.setName(this, this.attributes.name) : this.setName(this, "");
			this.attributes.children ? this.setChildren(this, this.attributes.children) : this.setChildren(this, []);
			this.attributes.xpaths ? this.setXPaths(this, this.attributes.xpaths) : this.setXPaths(this, []);
			this.attributes.nameIsDisplayed ? this.setNameIsDisplayed(this, this.attributes.nameIsDisplayed) : this.setNameIsDisplayed(this, true);
			this.attributes.valueIsDisplayed ? this.setValueIsDisplayed(this, this.attributes.valueIsDisplayed) : this.setValueIsDisplayed(this, true);
			this.attributes.isCategory ? this.setIsCategory(this, this.attributes.isCategory) : this.setIsCategory(this, true);
			this.attributes.dataType ? this.setDataType(this, this.attributes.dataType) : this.setDataType(this, "string");
			// this.attributes.belongsTo ? this.setBelongsTo(this, this.attributes.belongsTo) : this.setBelongsTo(this,"");

			// this.attributes.xpath ? this.setXPath(this, this.attributes.xpath) : this.setXPath(this,"");

			// this.attributes.name = this.attributes.name || "";
			// this.attributes.type = this.attributes.type || "";

			// "nameIsDisplayed": false,
			// "valueIsDisplayed": true,
			// "isCategory": true,
			// if(this)    "dataType"

			this.on("change:children", this.setChildren);
			this.on("change:type", this.setType);
			this.on("change:name", this.setName);
			this.on("change:tag", this.setTag);
			this.on("change:attr", this.setAttr);
			this.on("change:xpaths", this.setXPaths);
			this.on("change:isCategory", this.setIsCategory);
			this.on("change:nameIsDisplayed", this.setNameIsDisplayed);
			this.on("change:valueIsDisplayed", this.setValueIsDisplayed);
			this.on("change:dataType", this.setDataType);

		},
		setChildren : function(model, val)
		{
			if (!this.children) {
				NodesCollection = NodesCollection || require("app/collections/Nodes.Collection");
				this.children = new NodesCollection();
			}
			var myName = this.attributes.tag + "";
			// also make sure all children are passed this.app
			var that = this;
			_.each(val, function(obj)
			{
				obj.app = that.app;
				obj.belongsTo = myName;
				obj.xpaths = that.attributes.xpaths;
				console.log(obj);
			});
			this.children.reset(val);
		},
		setType : function(model, val)
		{
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
			model.set("type", val, {
				silent : true
			});
			model.set("badge_type", badge);
		},
		/*
		 when a name is set or changed, we must first check:
		 1.  was it set to "sentence" or "title"?  if so, make sure it is unique.
		 2.  set the name_badge to the appropriate badge.
		 */
		setName : function(model, val)
		{
			var badge = "", views = _.chain(this.app.views).values().filter(function(view)
			{
				return view.model.get("name") === val;
			}).value();
			if (val === "title") {
				badge = this.app.nameBadges.title;
			} else if (val === "sentence") {
				badge = this.app.nameBadges.sentence;
			}
			model.set("name_badge", badge);

			// if the value is not unique
			if (views.length > 1) {
				_.each(views, function(view)
				{
					if (view.model !== model) {
						view.model.set("name", "");
						// todo: send a warning message
					}
				});
			}
		},
		setTag : function(model, val)
		{
			if (val) {
				model.set("attr", "");
				model.set("btn_type", this.app.btnTypes.tag);
				// model.set("tag", val);
			}
		},
		setAttr : function(model, val)
		{
			if (val) {
				model.set("tag", "");
				model.set("btn_type", this.app.btnTypes.attr);
				// model.set("attr", val);
			}
		},
		setXPaths : function(model, val)
		{
			// val ? val: this.attributes.xpaths;
			if (val) {
				// val[0] = val[0].replace("\\", "/");
				/*	var attrs = this.attributes.attr;
				 console.log(attrs);
				 if (attrs && attrs.length > 0)
				 val[0] += "@" + attrs;*/
				model.set("xpaths", val);

			};
		},
		setNameIsDisplayed : function(model, val)
		{
			if (val) {
				model.set("nameIsDisplayed", val);

			};
		},
		setValueIsDisplayed : function(model, val)
		{
			if (val) {
				model.set("valueIsDisplayed", val);

			};
		},
		setIsCategory : function(model, val)
		{
			if (val) {
				model.set("isCategory", val);

			};
		},
		setDataType : function(model, val)
		{
			if (val) {
				model.set("dataType", val);

			};
		},
		// setBelongsTo: function(model, val){
		// if(val){
		// model.set("belongsTo", "belongsTo");
		//
		// };
		// },
		toJSON : function()
		{
			//TODO: Need to change structure.json reference to type under meta data in pipeline to dataType
			var relevant_keys = ["tag", "type", /*"name",*/"attr", "xpaths", "belongsTo"], json = {};
			var metadata_keys = ["dataType", "nameIsDisplayed", "valueIsDisplayed", "isCategory"];
			var thisType = this.attributes.type;
			_.each(this.attributes, function(val, key)
			{

				if (_.contains(relevant_keys, key)) {
					json[key] = val;
				}
				if (thisType === "metadata")
					if (_.contains(metadata_keys, key))
						json[key] = val;
			});
			var attrs = this.attributes.attr;
			console.log(attrs);
			if (attrs && attrs.length > 0)
				json.xpaths += "@" + attrs;
			json["displayName"] = this.attributes.name;

			if (this.attributes.type === "metadata") {
				json["propertyName"] = this.attributes.tag;
				json["displayName"] = this.attributes.name;
				// json["type"] = this.attributes.dataType;

			} else if (this.attributes.type === "subunit") {
				json["structureName"] = this.attributes.tag;
			}
			// take care of the children

			var children = [];
			if (this.children.length > 0)
				children = this.children.toJSON();
			// console.log(children);
			json.units = [];
			json.metadata = [];
			json.children = [];
			_.each(children, function(obj)
			{
				if (obj.type === "metadata")
					json.metadata.push(obj);
				else if (obj.type === "subunit")
					json.units.push(obj);
				json.children.push(obj);
			});
			// json.units = this.children.toJSON();

			return json;
		}
	});

	// exports.NodeModel = NodeModel;
	return NodeModel;
});
