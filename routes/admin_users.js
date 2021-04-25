var express = require('express')
var router = express.Router()
var User = require('../models/user')
var auth = require('../config/auth')
var isUser = auth.isUser;
var isAdmin = auth.isAdmin;



/*
Get users index
*/ 

router.get('/', isAdmin,  function(req, res) {
    User.find(function(err, users) {
        if(err) {
           return  console.log(err)
        }
        req.app.locals.users = users
        res.render('admin/users', {
            users: users
        })
    })
})





/*
Get edit user
*/
router.get('/edit-user/:id',isAdmin, function(req, res){
    
    User.findOne({_id: req.params.id}, function(err, user) {
        if(err) {
            return console.log(err)
        }
        else {
            res.render('admin/edit_user', {
                username: user.username,
                id: user._id,
                email: user.email,    
                name: user.name,
            });
        }
    });

});


/*
Post edit user
*/
router.post('/edit-user/:id', function(req, res){
    
    console.log("hello")
    req.checkBody('name', "Name must have a value. ").notEmpty()
    req.checkBody('email', "Email must have a value. ").notEmpty()
    req.checkBody('username', "Username must have a value. ").notEmpty()
    req.checkBody('role', "Role must have a value. ").notEmpty()

    
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var role = req.body.role;
    var id = req.params.id;

    var errors = req.validationErrors();

    if(errors) {
        console.log("hello error 1")
        res.render('admin/edit_user', {
            errors,id,username,email,name
        });
    }

    else {
        console.log("hello error free")
         User.findOne({ $or : [{username: username},  {email: email}]  }, function(err, user) {
             if(user._id != id) {
                console.log("hello 4")
                 req.flash('danger', 'user with same details exists, Please choose another username or email');
                 res.render('admin/edit_user', {
                    id,username,email,name
                 });
        
             }
             else {
                console.log("hello5")
                    User.findById(id, function(err, user){
                        if(err) {
                            console.log("hello 6")
                           return console.log(err)
                        }

                        user.username = username;
                        user.name = name;
                        user.email = email;
                        user.admin = role;

                        user.save(function(err){
                            if(err) {
                                console.log("hello 7")
                                return console.log(err);
                            }
                            console.log("hello 8")
                            req.flash('success', 'User Edited')
                            res.redirect('/admin/users/edit-user/'+id)
                        })
                    })


             }
         })
    }

});

router.get('/delete-user/:id', function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            return console.log(err)
        }
        req.flash('success', 'User deleted')
        res.redirect('/admin/users')


    })
})







router.get('/test', function(req, res){
    res.send("I am test from admin_pages")
})


module.exports = router;