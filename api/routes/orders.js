const express = require('express');
const router = express.Router();
const Order = require('../../models/order');
const checkAuth = require('../middleware/check-auth');

// Handle incoming GET requests to /orders
router.get('/', checkAuth, (req, res, next) => {
   Order.find({})
   .select('-__v')
   .exec()
   .then(orders => {
       if (orders.length <= 0) {
           return res.json({message: 'no data in the collection'})
       }
       res.json(orders)
   })
   .catch(error => {
    console.log(error)
    res.status(500).json({error: error})
})
});

router.post('/', checkAuth, (req, res, next) => {
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    const order = new Order({
        productId: productId,
        quantity: quantity
    })
    order.save()
        
        .then(order => {
            console.log('3')
            res.json({
                message: 'created',
                order: order
            })
        .catch(error => {
            console.log(error)
            res.status(500).json({error: error})
        })
    })
});
  
router.get('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .then(order => {
            res.json(order)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({error: error})
        })
});

router.patch('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId;
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    Order.findById(id)
    .then(order => {
        order.productId = productId;
        order.quantity = quantity;
        order.save().then(result => {
            res.json({
                message: 'updated',
                order: result
            })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err));
})

router.delete('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId;
    Order.deleteOne({_id: id})
        .then(() => {
            res.json({
                message:'deleted'
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({error: error})
        })
});

module.exports = router;