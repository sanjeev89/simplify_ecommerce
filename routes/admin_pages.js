var express = require('express')
var router = express.Router()
var Page = require('../models/page')
var auth = require('../config/auth')
var isUser = auth.isUser;
var isAdmin = auth.isAdmin;



/*
Get pages index
*/ 

router.get('/', isAdmin, function(req, res) {
    Page.find({}).sort({sorting: 1}).exec(function(err, pages) {
        if(err) {
            console.log(err)
        }
        else {
            res.render('admin/pages', {
                pages: pages
            })
        }
    })
})

/*
Get add page
*/
router.get('/add-page', isAdmin, function(req, res){
    var title ="";
    var slug = "";
    var content = "";

    res.render('admin/add_pages', {
        title: title,
        slug: slug,
        content: content    
    });
});


/*
Post add page
*/
router.post('/add-page',  function(req, res){
    
    req.checkBody('title', "Title must have a value. ").notEmpty()
    req.checkBody('slug', "Slug must have a value. ").notEmpty()
    req.checkBody('content', "Content must have a value. ").notEmpty()

    var title =req.body.title;
    var slug = req.body.slug;
    var content = req.body.content;

    var errors = req.validationErrors();

    if(errors) {
        res.render('admin/add_pages', {
            errors: errors,
            title: title,
            slug: slug,
            content: content    
        });
    }

    else {
         Page.findOne({slug: slug}, function(err, page) {
             if(page) {
                 req.flash('danger', 'Page slug exists, choose another.');
                 res.render('admin/add_pages', {
                    errors: errors,
                    title: title,
                    slug: slug,
                    content: content    
                });
        
             }
             else {
                 var page = new Page({
                     title: title,
                     slug: slug,
                     content: content,
                     sorting: 0
                 });

                 page.save(function(err){
                     if(err) {
                         return console.log(err);
                     }
                     req.flash('success', 'Page added')
                     res.redirect('/admin/pages')
                 })
             }
         })
    }

});

/*
Get edit page
*/
router.get('/edit-page/:slug', isAdmin, function(req, res){
    
    Page.findOne({slug: req.params.slug}, function(err, page) {
        if(err) {
            return console.log(err)
        }
        else {
            res.render('admin/edit_page', {
                title: page.title,
                slug: page.slug,
                content: page.content,
                id: page._id    
            });
        }
    });

});


/*
Post edit page
*/
router.post('/edit-page/:slug',  function(req, res){
    
    req.checkBody('title', "Title must have a value. ").notEmpty()
    req.checkBody('slug', "Slug must have a value. ").notEmpty()
    req.checkBody('content', "Content must have a value. ").notEmpty()

    var title =req.body.title;
    var slug = req.body.slug;
    var content = req.body.content;
    var id = req.body.id

    var errors = req.validationErrors();

    if(errors) {
        res.render('admin/edit_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id : id    
        });
    }

    else {
         Page.findOne({slug: slug, _id: {'$ne':id} }, function(err, page) {
             if(page) {
                 req.flash('danger', 'Page slug exists, choose another.');
                 res.render('admin/edit_pages', {
                    errors: errors,
                    title: title,
                    slug: slug,
                    content: content    
                });
        
             }
             else {
                    Page.findById(id, function(err, page){
                        if(err) {
                           return console.log(err)
                        }

                        page.title = title;
                        page.slug = slug;
                        page.content = content; 

                        page.save(function(err){
                            if(err) {
                                return console.log(err);
                            }
                            req.flash('success', 'Page added')
                            res.redirect('/admin/pages/edit-page/' + page.slug)
                        })
                    })


             }
         })
    }

});

router.get('/delete-page/:id', isAdmin, function(req, res) {
    Page.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            return console.log(err)
        }
        req.flash('success', 'Page deleted')
        res.redirect('/admin/pages')


    })
})







router.get('/test', function(req, res){
    res.send("I am test from admin_pages")
})


module.exports = router;