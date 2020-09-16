// get express application, which has diff utilty methods, etc.
const express = require('express');
const app = express();

const productRoutes = require('.\\api\\routes\\products');
const orderRoutes = require('.\\api\\routes\\orders');

// The middleware
/*app.use((req, res, next) => {
    // sends status 200 as json
    res.status(200).json({
        message: 'It works!'
    }
    );
});*/

// a filter
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

module.exports = app;