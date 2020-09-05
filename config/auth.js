exports.isUser = function(req, res, next) {
    if(req.isAuthenticated()) {
        next()
    }
    else {
        req.flash('danger', 'please login');
        res.redirect('/user/login');
    }
    
}

exports.isAdmin = function(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    }

    else {
        req.flash('danger', 'Please login as Admin')
        res.redirect('/user/login')
    }
}