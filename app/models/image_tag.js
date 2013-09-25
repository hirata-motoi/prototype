exports.definition = {
	config: {
		columns: {
		    "id": "integer",
		    "tag": "text",
		    "disabled": "integer",
		    "created_at": "integer",
		    "updated_at": "integer"
		},
		adapter: {
			type: "sql",
			collection_name: "image_tag"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};
