exports.definition = {
	config: {
		columns: {
		    "id": "integer"
		},
		adapter: {
			type: "sql",
			collection_name: "seq_image"
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