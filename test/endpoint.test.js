const chai = require('chai');
const expect = chai.expect;

const chaiHttp = require('chai-http');
const app = require('../index'); 

chai.use(chaiHttp);

describe('Product Endpoints Tests', () => {
  it('should create a new product', async () => {
    const res = await chai.request(app)
      .post('/create')
      .send({
        name: 'New Product',
        description: 'This is a new product',
        price: 19.99,
        variants: [{
            name: 'variant',
            sku: 'sku',
            additionalCost: 5,
            stockCount: 40
          }]
      });

    expect(res).to.have.status(201);
    expect(res.body.name).to.equal('New Product');
   
  });

  it('should retrieve all products', async () => {
    const res = await chai.request(app).get('/read');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
   
  });

 
});
