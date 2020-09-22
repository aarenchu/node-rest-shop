const express = require('express');
const router = express.Router();
const redis = require('redis');

// connect the client side of Redis
const client = redis.createClient();
client.on("error", (error) => {
    console.error(error);
});

router.get('/', (req, res, next) => {
    // want to produce all books available
    client.hgetall("books", (err, docs) => {
        if (err) throw err;
        else {
            console.log(docs);
            res.status(200).json(docs);
        }
    });
});

router.post('/', (req, res, next) => {
    // Generate the book ID
    client.get("next_book_id", (err, value) => {
        var bookId = value;
        const product = {
            id: bookId,
            title: req.body.title,
            price: req.body.price
        };

        // store in redis while dealing with (TODO:) promises
        /*
        Promise -> "an action which will either be completed or rejected. 
        In case of completion, the promise is kept and otherwise, 
        the promise is broken...unlike callbacks, promises can be chained."
        (https://www.geeksforgeeks.org/promises-in-node-js/)
        
        Callback -> response of func. necessary in node.js, since node.js is async
        */ 
        client.hmset(
            "book:" + bookId,
            { 
                "title": product.title,
                "price": product.price
            },
            (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({error: err});
                } else {
                    res.status(201).json({ // Status 201 = object created succesfully
                        message : "New product created successfully",
                        createdProduct: product
                    });
                }
        });
        // add it to the container of books
        client.hset("books", bookId, product.title);
    });
    // generate next id
    client.incr("next_book_id");
});

// express uses :, similar to Flask and {id}
router.get('/:productID', (req, res, next) => {
    // to extract the id
    const id = req.params.productID;
    console.log(id);
    /*if (id === 'special'){
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    } else{
        res.status(200).json({
            message: 'You passed an ID'
        });
    }*/

    // Retrieve all fields based on id
    client.hgetall(
        "book:"+ id,
        (err, value) => {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
            } else {
                if (value) {
                    console.log(value.title);
                    console.log(value.price);
                    res.status(200).json({
                        "title": value.title,
                        "price": value.price
                    });
                } else {
                    res.status(404).json({message: "id does not exist"});
                }
            }
        });

});

router.patch('/:productID', (req, res, next) => {
    const id = req.params.productID;
    // checking which fields need to be changed
    for (const ops of req.body) {
        // update the existing id
        client.hset("book:" + id, ops.propName, ops.value);
        if (ops.propName === 'title'){
            client.hset("books", id, ops.value);
        }
        // TODO: check propName is valid
        // TODO: check for multiple properties
    }
});

router.delete('/:productID', (req, res, next) => {
    // to extract the id
    const id = req.params.productID;
    console.log(id);
    // delete it if it exists
    client.del(
        "book:"+ id,
        (err, value) => {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
            } else {
                if (value) {
                    res.status(200).json({
                        message: 'Deleted product!'
                    });
                } else {
                    res.status(404).json({message: "id does not exist"});
                }
            }
        });
    // remove it from the container of books
    client.hdel("books", bookId);
});

module.exports = router;