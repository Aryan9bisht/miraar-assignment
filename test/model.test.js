
const chai = require('chai');
const expect = chai.expect;

const mongoose = require('mongoose');
const { product } = require('../models/products'); 

describe('Product Model Tests', () => {
  it('should save a product', async () => {
    const testProduct = new product({
      name: 'Test Product',
      description: 'This is a test product',
      price: 10.99,
      variants: [{
        name: 'variant',
        sku: 'sku',
        additionalCost: 5,
        stockCount: 40
      }], 
    });
    const savedProduct = await testProduct.save();

    expect(savedProduct._id).to.exist;
    expect(savedProduct.name).to.equal('Test Product');
  });

  it('should retrieve a product by name', async () => {
    const foundProduct = await product.findOne({ name: 'Test Product' });

    expect(foundProduct).to.exist;
    expect(foundProduct.name).to.equal('Test Product');
  
  });

  });
