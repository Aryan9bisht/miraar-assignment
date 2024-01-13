const { request } = require('express');
const { ObjectId } = require('mongoose').Types;
const { product, variant } = require('../models/products'); 

module.exports.create =  async function(req,res){

    console.log(req.body);
    try {
        const prod = await product.create(req.body);
        res.status(201).json({
            message: 'Product created',
            product: prod
          });
       
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).send('Internal server error');
    }
}
module.exports.delete = async function(req,res){
    try{
        const prodDel = await product.findById(req.params.id);
        if(!prodDel){
            return res.status(404).send('product not found');
    }
    await prodDel.deleteOne();
    await variant.deleteMany({product :req.params.id});
    res.status(200).send('deleted');
    console.log('deleted');
    }
   catch (err) {
        console.error('Error in deleting', err);
        res.status(500).send('Internal server error',err);
    }
}
module.exports.read =  async function(req,res){
   
   try {
    const productsWithVariants = await product.find().populate('variants').exec();
    res.status(200).json(productsWithVariants);
} catch (err) {
        console.error('Error creating product:', err);
        res.status(500).send('Internal server error',err);
    }   
}

module.exports.createVar = async function(req,res){
    
    try {
        console.log(req.body, req.params.id);
        const existVariant = await variant.findOne({name:req.body.name});
        if(existVariant){
            console.log('variant exists')
            const upVar = await variant.findByIdAndUpdate(existVariant._id, { $set:req.body} ,{new :true});
        }
        else{
        const varCreate = await variant.create(req.body);
        const updateVar = await variant.findByIdAndUpdate(varCreate._id, { $set:req.body} ,{new :true});
        updateVar.save();
        const prod= await product.findById(req.params.id);
        if(prod){
            prod.variants.push(updateVar);
            await prod.save();
            console.log(prod);
            res.status(200).send(prod)
        }
        else{
            return res.status(404).send('variant not found');
        }
    }
    } catch (err) {
        console.error('Error creating variant:', err);
        res.status(500).send('Internal server error',err);
    }
   
}
module.exports.deleteVar= async function(req,res){
    try {
        const productId = req.params.prodid;
        const variantId = req.params.variantId;
console.log(req.params.variantId);

const prod = await product.findById(productId);
        if (!ObjectId.isValid(variantId)) {
            return res.status(400).send('Invalid variantId');
        }
        if (!prod) {
            return res.status(404).send('Product not found');
        }
        if (!prod) {
            return res.status(404).send('Product not found');
        }
        const variantIndex = prod.variants.findIndex(variant => variant._id.toString() === variantId);
        if (variantIndex === -1) {
            return res.status(404).send('Variant not found in the product');
        }
        const deletedVariant = prod.variants.splice(variantIndex, 1)[0];
await prod.save();
        await variant.findByIdAndDelete(deletedVariant._id);

        res.status(200).send('Variant deleted from the product');
    }
     catch (err) {
        console.error('Error deleting variant from the product:', err);
        res.status(500).send('Internal server error');
    }

}

module.exports.updateVar = async function(req,res){
    try {
        console.log(req.params.id);
        console.log(req.params.prodid);
   
        const prod = await product.findById(req.params.prodid);
        if (prod) {
 
    const variantIndex = prod.variants.findIndex((v) => v._id.toString() === req.params.id);

    if (variantIndex !== -1) {
      await product.updateOne(
        { _id: prod._id },
        {
          $set: {
            'variants.$[element]': req.body,
          },
        },
        {
          arrayFilters: [{ 'element._id': prod.variants[variantIndex]._id }],
        }
      );

      res.status(200).send('Variant updated');
    } else {
      res.status(404).send('Variant not found');
    }
  } else {
    res.status(404).send('Product not found');
  }
} catch (err) {
  console.error('Error in updating variant product:', err);
  res.status(500).send('Internal server error');
}
};

module.exports.update = async function(req,res){
    console.log(req.params.id);
   
    try {
        const prodUp = await product.findById(req.params.id);
        if(prodUp){
            console.log(req.body);
            const update = await product.findByIdAndUpdate(req.params.id,{$set: req.body});
            update.save();
            return res.status(200).send('product updated');
        }
        else{
            return res.status(404).send('product not found');
        }
    } catch (err) {
        console.error('Error in updating  product:', err);
        res.status(500).send('Internal server error');
    }
}



module.exports.search = async function (req, res) {
    try {
        const searchTerm = req.query.q;
        if (!searchTerm) {
            return res.status(400).send('Search term is required');
        }

        const searchResult = await product.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }, 
                { 'variants.name': { $regex: searchTerm, $options: 'i' } } 
            ]
        });

        res.status(200).json(searchResult);
    } catch (err) {
        console.error('Error searching products:', err);
        res.status(500).send('Internal server error');
    }
};
