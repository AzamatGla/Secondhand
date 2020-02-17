

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email}).exec().then(
        user => {
            if (user.length >= 1) {
                res.status(422).json({
                    error: 'email is already existed'
                })
            }
            else {
                bcrypt.hash(req.body.password, 10, function (err, hash) {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    const user = new User({
                        username: req.body.username,
                        email: req.body.email,
                        password: hash
                    });
                    user
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: 'user created',
                            user: result
                        })
                    })
                    .catch(error => {
                        console.log(error)
                        res.status(500).json({error: error})
                    });
                })
            }
        })          
});


router.delete('/:userId', (req, res, next) => {
    const userId = req.params.userId;
    
    User.findByIdAndDelete(userId)
    .then(result => {
        res.status(200).json({
            message: 'deleted successfully'
        })
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        })
    })
})

router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    User.find({email: email}).exec()
        .then(user => {
            if (user.length < 1) {
                res.status(401).json({
                    message: 'Auth failed'
                })
            }
            bcrypt.compare(password, user[0].password, (error, response) => {
                if (error) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    })
                }
                if (response) {
                    const token = jwt.sign({email: user[0].email, userId: user[0]._id}, 'secret', {expiresIn: '1h'});

                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Auth failed'
                })
            })
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            })
        });
})


module.exports = router;