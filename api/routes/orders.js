const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Orders were created'
    });
});

// express uses :, similar to Flask and {id}
router.get('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderID', (req, res, next) => {
    res.status(200),json({
        message: 'Order deleted'
    });
});

module.exports = router;