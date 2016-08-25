var mongoose = require('mongoose');
var Category = require('./category');
var fx = require('./fx');

var productSchema = {
	name : { type : String , required : true},

	pictures : [{ type: String, match : /^http:\/\//i }],
	
	price : {
		amount : { 
					type: Number,
				   	required : true,
				   	set : function(v){
				   			this.internal.approximatePriceUSD = 
				   				v/( fx()[this.price.currency] || 1 );
				   				return v;
				   } 
				},

		currency : {
			type : String,
			enum : ['INR','USD','EUR'],
			required : true,
			set : function(v){
				this.internal.approximatePriceUSD = 
					this.price.amount/ ( fx()[v] || 1);

				return v;
			}
		}
	},

	category : Category.categorySchema
};

// module.exports = new mongoose.Schema(productSchema);
// module.exports.productSchema = productSchema;

var schema = new mongoose.Schema(productSchema);
var currencySymbols = {
	'USD' : '$',
	'INR' : '₹',
	'EUR' : '€'
};

schema.virtual('displayPrice').get(function(){
	return currencySymbols[this.price.currency] + ' '+
			this.price.amount;
});

schema.set('toObject', { virtuals : true});
schema.set('toJSON', { virtuals : true});

module.exports = schema;