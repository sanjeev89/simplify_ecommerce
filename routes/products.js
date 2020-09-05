var express = require('express')
var router = express.Router()
var fs = require('fs')
var isUser = require('../config/auth')
var isAdmin = require('../config/auth')

//get page model
var Page = require('../models/page')
var Product = require('../models/product')
var Category = require('../models/category')


/*
Get all products
*/

router.get('/', function(req, res){
    Product.find(function(err, products){
        res.render('./layouts/all_products', {
            products: products,
            title: 'All products'
        })
    })
    // res.render('index')
})

router.get('/:category', function(req, res) {
    var categorySlug = req.params.category;
    console.log("catslug is ", categorySlug)
    Category.findOne({slug: categorySlug}, function(err, category) {
        if(err) {
            return console.log(err)
        }
        else {
            if(category==null){
                res.redirect('/')
                return;
            }
            console.log("category", category)
            Product.find({category: categorySlug}, function(err, products) {
                res.render('cat_products', {
                    title: category.title,
                    products: products
                })
            })
        }
    })
})

/*
for details of products
*/

router.get('/:category/:product', function(req, res) {

    console.log("i was called")
    var loggedIn = (req.isAuthenticated()) ? true : false;
    Product.findOne({slug: req.params.product}, function(err, product) {
        if(err || product == null){
            
            return
        }
        else {
            console.log("product found")
            var galleryDir = 'public/product_images/'+product.id+'/gallery/'
            fs.readdir(galleryDir, function(err, files) {
                if(err){
                    return console.log(err) 
                }
                else {
                    console.log("no product found")
                    res.render('product', {
                        product: product.title,
                        p: product,
                        galleryImages: files,
                        loggedIn: loggedIn
                    })
                }
            } )
        }
    })
})







module.exports = router;

