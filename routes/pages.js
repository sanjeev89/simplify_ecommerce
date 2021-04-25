var express = require('express')
var router = express.Router()

//get page model
var Page = require('../models/page')


/*
Get pages index
*/





router.get('/', function(req, res){
    Page.findOne({slug: 'home'}, function(err, page){
        res.render('index', {
            title: 'home',
            content: page.content
        })
    })
    // res.render('index')
})

router.get('/:slug', function(req, res) {
    var slug = req.params.slug;
    if(slug=="favicon.ico"){
        return;
    }
    console.log("slug", slug)

    Page.findOne({slug: slug}, function(err, page) { 
        if(err) {
            return console.log(err)
        }
        if(page)
        res.render('index', {
            title: page.title,
            slug: page.slug,
            content: page.content
        })
        else {
            res.send("no page found")
        }
    })
})


module.exports = router;