const route = require('express').Router();
const ProdController = require('../Controller/product');
const Middleware = require('../Middleware/auth');
const {ProductValidation} = require('../Validation/product');

route.post('/create', Middleware, ProductValidation(), ProdController.CreateProduct);

route.get('/all', Middleware, ProdController.GetAllProduct);

route.get('/:id', Middleware, ProdController.GetProductByID);

route.put('/:id', Middleware,ProductValidation(),ProdController.UpdateProductByID);

route.delete('/:id', Middleware, ProdController.DeleteProductByID);

module.exports = route;