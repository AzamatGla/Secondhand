const express = require('express');
const multer = require('multer');
const Product = require('../../models/product');
const checkAuth = require('../middleware/check-auth');
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './uploads/')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
//         cb(null, true)
//     }
//     else {
//         cb(null, false)
//     }
    
// }

// const upload = multer({
//     storage: storage, 
//     limits: {
//         fileSize: 1024*1024*5
//     },
//     fileFilter: fileFilter})



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true)
    }
    else {
        cb(null, false)
    }
    
}

const upload = multer({storage: storage, limits: {fileSize: 1024 * 1024 *5}, fileFilter: fileFilter})











const router = express.Router();

router.get('/', (req, res, next) => {
    Product.find({})
    .select('-__v')
    .exec()
    .then(products => {
        const response = products.map(product => {
            return {
                name: product.name,
                price: product.price,
                _id: product._id,
                productImage: product.productImage,
                request:{
                    method: 'GET',
                    url: 'http://127.0.0.1:3000/products/'+product._id
                }
            
            }
        })
        res.json(response)
    })
    .catch(error => console.log(error))
    
});

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    console.log(req.file)
    const product =new Product ({
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save()
    .then((product) => {
        const response = {
            _id: product._id,
            name: product.name,
            price: product.price,
            productImage: product.productImage,
            request: {
                method: 'GET',
                url: 'http://127.0.0.1:3000/products/' + product._id
            }
        }
        res.status(201).json({
            message: 'created',
            product: response
        });
    })
    .catch(err => console.log(error));
    
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.find({_id: id})
    .then(product => {
        res.status(200).json({
            message: 'success',
            product: product
    })
    })
    .catch(error => console.log(error))
});

router.patch('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    Product.updateOne({_id: id}, {$set: {name: req.body.name, price: req.body.price}})
    .then(result => {
            Product.findById(id).then(updatedProduct => {
                res.status(201).json({
                    message: 'Updated',
                    product: updatedProduct
                })
            })
            .catch(error => console.log(error));
           
        }
    )
    .catch(error => console.log(error));
});

router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id}).then(
        () => {
            res.json({
                message: 'deleted'
            })
        }
    )
    .catch(error => console.log(error))
});

module.exports = router;