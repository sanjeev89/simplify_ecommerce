var express = require('express')
var router = express.Router()
var passport = require('passport')
var bcrypt = require('bcryptjs');

//get user model
var User = require('../models/user')


/*
Get Register
*/

router.get('/register', function(req, res){
    res.render('register', {
        title: 'Register'
    });
})

/**
 post register
 */
router.post('/register', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    var username = req.body.username;
    console.log("reached with success")

    req.checkBody('name', 'Name is required!').notEmpty()
    req.checkBody('email', 'email is required!').notEmpty()
    req.checkBody('username', 'userame is required!').notEmpty()
    req.checkBody('password', 'Password is required!').notEmpty()
    req.checkBody('password2', 'Passwords did not match!').equals(password)

    var errors = req.validationErrors();

    if(errors) {
        console.log(errors)
        res.render('register', {
            errors: errors,
            user: null,
            title: 'Register'
        });
    }


    else {
        User.findOne({username: username}, function(err, user) {
            if(err) {
                console.log(err)
            }

            if(user) {
                req.flash('danger', 'user already exists, choose another username')
                return res.redirect('/user/register')
            }
            User.find({}, (err, users) => {
                var user = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    admin: users.length ? "0" : "1"
                });

                bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(user.password, salt, function(err, hash) {
                            if(err) {
                                return console.log(err);
                            }
                            else {
                                user.password = hash;
                                user.save(function(err) {
                                    if(err) {
                                        return console.log(err)
                                    }
                                    else {
                                        req.flash('success', 'You are reistered Now!')
                                        res.redirect('/user/login')
                                    }
                                })
                            }
                        })
                })
            })
        })
    }
})

/*
GET login 
*/

router.get('/login', function(req, res) {
    if(res.locals.user) {
        res.redirect('/')
    }

    res.render('login', {
        title: 'login page'
    })
})

router.post('/login', function(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next)
})

/*
 * GET logout
 */
router.get('/logout', function (req, res) {

    req.logout();
    
    req.flash('success', 'You are logged out!');
    res.redirect('/user/login')


});





module.exports = router;