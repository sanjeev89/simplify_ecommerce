var express = require('express')
var router = express.Router()
var Category = require('../models/category')
var auth = require('../config/auth')
var isUser = auth.isUser;
var isAdmin = auth.isAdmin;



/*
Get categories index
*/ 

router.get('/', isAdmin,  function(req, res) {
    Category.find(function(err, categories) {
        if(err) {
           return  console.log(err)
        }
        req.app.locals.categories = categories
        res.render('admin/categories', {
            categories: categories
        })
    })
})

/*
Get add categories
*/
router.get('/add-category',isAdmin, function(req, res){
    var title ="";
    var slug = "";

    res.render('admin/add_categories', {
        title: title,
    });
});


/*
Post add categories
*/
router.post('/add-category', function(req, res){
    
    req.checkBody('title', "Title must have a value. ").notEmpty()

    var title =req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var errors = req.validationErrors();

    if(errors) {
        res.render('admin/add_categories', {
            errors: errors,
            title: title,    
        });
    }

    else {
         Category.findOne({slug: slug}, function(err, category) {
             if(category) {
                 req.flash('danger', 'category title exists, choose another.');
                 res.render('admin/add_categories', {
                    errors: errors,
                    title: title
                });
        
             }
             else {
                 var category = new Category({
                     title: title,
                     slug: slug
                 });

                 category.save(function(err){
                     if(err) {
                         return console.log(err);
                     }
                     req.flash('success', 'Category added')
                     res.redirect('/admin/categories')
                 })
             }
         })
    }

});

/*
Get edit categories
*/
router.get('/edit-category/:id',isAdmin, function(req, res){
    
    Category.findOne({_id: req.params.id}, function(err, category) {
        if(err) {
            return console.log(err)
        }
        else {
            res.render('admin/edit_category', {
                title: category.title,
                id: category._id    
            });
        }
    });

});


/*
Post edit categories
*/
router.post('/edit-category/:id', function(req, res){
    
    console.log("hello")
    req.checkBody('title', "Title must have a value. ").notEmpty()

    
    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;

    var errors = req.validationErrors();

    if(errors) {
        console.log("hello error 1")
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        });
    }

    else {
        console.log("hello error free")
         Category.findOne({slug: slug,  _id: {'$ne':id} }, function(err, category) {
             if(category) {
                console.log("hello 4")
                 req.flash('danger', 'category exists, choose another.');
                 res.render('admin/edit_category', {
                    title: title,
                    id: id
                });
        
             }
             else {
                console.log("hello5")
                    Category.findById(id, function(err, category){
                        if(err) {
                            console.log("hello 6")
                           return console.log(err)
                        }

                        category.title = title;
                        category.slug = slug;

                        category.save(function(err){
                            if(err) {
                                console.log("hello 7")
                                return console.log(err);
                            }
                            console.log("hello 8")
                            req.flash('success', 'Page added')
                            res.redirect('/admin/categories/edit-category/'+id)
                        })
                    })


             }
         })
    }

});

router.get('/delete-category/:id', function(req, res) {
    Category.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            return console.log(err)
        }
        req.flash('success', 'Category deleted')
        res.redirect('/admin/categories')


    })
})







router.get('/test', function(req, res){
    res.send("I am test from admin_pages")
})


module.exports = router;