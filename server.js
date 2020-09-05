const express = require('express');
const path = require('path')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var session = require('express-session')
const expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');
var flash = require('connect-flash');
var config = require('./config/database')
var passport = require('passport')




//connection to DB
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind('console', 'connection error'));
db.once('open', function(){
    console.log("connected to mongoDB")
})

//app initialisation
const app = express()

//view engine setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//set public folder for static files
app.use(express.static(path.join(__dirname, 'public')))

//set middleware for file upload ----->bcoz bodyparser doesnt help with it
app.use(fileUpload());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,                 //bcoz succes flash was not working
    saveUninitialized: true
    // cookie: { secure: true }
  }))

//Express validator middleware
app.use(expressValidator({
    errorFormatter: function(params, msg, value){
        var namespace = params.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param : formParam,
            msg : msg,
            value : value
        };  

    },
    customValidators: {
        isImage: function (value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }
    }
}));


// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//sert global variable errors to null 
app.locals.errors = null

//set global variable for pages
var Page = require('./models/page')
Page.find({}).sort({sorting: 1}).exec(function(err, pages) {
    if(err) {
        console.log(err)
    }
    else {
        app.locals.pages = pages
    }
})

//set global variable for category
var Category = require('./models/category')
Category.find(function(err, categories) {
    if(err) {
        console.log(err) 
    }
    else {
        app.locals.categories = categories
    }
})

//passport config
require('./config/passport')(passport)

//set middleware for passport
app.use(passport.initialize())
app.use(passport.session())

//make cart available to each route
app.get('*', function(req, res, next) {
    app.locals.cart = req.session.cart;
    res.locals.user = req.user || null;
    next();
})



// ===================SET ROUTES HERE===============================

var pages = require('./routes/pages')
var adminPages = require('./routes/admin_pages')
var adminCategories = require('./routes/admin_categories')
var adminProducts = require('./routes/admin_products')
var products = require('./routes/products')
var cart = require('./routes/cart')
var user = require('./routes/user')




//================USE ROUTES HERE ==============================

//admin_pages routes
app.use('/admin/Pages', adminPages)

//admin-categories routes
app.use('/admin/categories', adminCategories)

//admin-products routes
app.use('/admin/products', adminProducts);

//products routes
app.use('/products', products)

//cart route
app.use('/cart', cart)

//user register/login
app.use('/user', user)

//pages routes
app.use('/', pages)








app.listen(2000, function() {
    console.log("server started at 2000")
   
})
