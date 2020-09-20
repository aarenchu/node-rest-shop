const express = require('express');
const router = express.Router();
const redis = require('redis');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    });
});

router.post('/', (req, res, next) => {
    const product ={
        name: req.body.name,
        price:req.body.price
    };
    // Status 201 = object created succesfully
    res.status(201).json({
        message: 'Handling POST requests to /products',
        createdProduct: product
    });
});

// express uses :, similar to Flask and {id}
router.get('/:productID', (req, res, next) => {
    // to extract the id
    const id = req.params.productID;
    console.log(id);
    if (id === 'special'){
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    } else{
        res.status(200).json({
            message: 'You passed an ID'
        });
    }

});

router.patch('/:productID', (req, res, next) => {
    res.status(200),json({
        message: 'Updated product!'
    });
});

router.delete('/:productID', (req, res, next) => {
    res.status(200),json({
        message: 'Deleted product!'
    });
});

module.exports = router;