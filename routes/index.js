const express = require('express');


const router = express.Router();

const controller = require('../controls/controller');

router.get('/read', controller.read);
router.post('/create',controller.create);
router.put('/update/:id', controller.update);
router.delete('/delete/:id', controller.delete);

router.post('/var/create/:id',controller.createVar);
router.put('/var/:prodid/update/:id', controller.updateVar);
router.delete('/var/:prodid/delete/:variantId', controller.deleteVar);

router.get('/search', controller.search);







module.exports = router;