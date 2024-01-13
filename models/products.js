
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const variantSchema = new mongoose.Schema({
    name: { type: String, unique:false,required: true },
    sku: { type: String,unique:false, required: true },
    additionalCost: { type: Number, unique:false,required: true },
    stockCount: { type: Number,unique:false, required: true }
});

const productSchema = new mongoose.Schema({
    name: { type: String,unique:false, required: true },
    description: { type: String,unique:false, required: true },
    price: { type: Number, unique:false,required: true },
    variants: [variantSchema]
});
variantSchema.plugin(uniqueValidator);
const product = mongoose.model('Product', productSchema);
const variant = mongoose.model('Variant', variantSchema);

module.exports = {
    product,
    variant
};
