// get express application, which has diff utilty methods, etc.
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const redis = require('redis');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

const client = redis.createClient(); // TODO: need a server

// Express middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // makes it easier to read.

/*app.use((req, res, next) => { // A custom middleware func i.e. params => func body
    // sends status 200 as json
    res.status(200).json({
        message: 'It works!'
    });
    // next(); // Call next() so Express will call the next middleware func, but morgan does this
               // behind the scenes
});*/

/* 
 * NOTE:
 * Middleware and routing functions are called in the order that they are declared. 
 * For some middleware the order is important (for example if session middleware depends
 * on cookie middleware, then the cookie handler must be added first). It is almost always
 * the case that middleware is called before setting routes, or your route handlers will 
 * not have access to functionality added by your middleware.
 */

// Dealing with CORS (Cross Origin Resource Sharing)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // since RESTful API, want to provide to any
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization' // Headers to append to incoming reqs 
    );
    
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    // since there's that return statement
    next();
    });

// a filter, the routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error); // forwards error request
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;