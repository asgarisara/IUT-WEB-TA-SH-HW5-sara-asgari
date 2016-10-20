var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var ValidPassword = function(user, password){
    return bcrypt.compareSync(password, user.password);
};
var LocalStrategy = require('passport-local').Strategy;
passport.use('register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
            Account.findOne({ 'email' :  email }, function(err, user) {
                if (err)
                {
                    return done(err);
                }
                if (user)
                {
                    console.log('user already exists');
                    return done(null, false, req.flash('message', 'User already exists'));
                }
                var regex_password = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9]{8,}$/ ;
                if ( !req.body.password.match(regex_password))
                {
                    console.log('password must contain lowercase , uppercase and numbers and its length should be at least 8');
                    return done(null, false, req.flash('message','password must contain lowercase , uppercase and numbers and its length should be at least 8'));
                }
                if ( req.body.password !=req.body.confirm)
                {
                    console.log('confirm password is not equal with password');
                    return done(null, false, req.flash('message','confirm password is not equal with password'));
                }
                else
                {
                    var newaccount = new Account();

                    newaccount.password = bcrypt.hashSync(req.body.password);
                    newaccount.email = req.body.email;
                    newaccount.name = req.body.name;
                    newaccount.family = req.body.family;

                    // save the user
                    newaccount.save(function(err) {
                        if (err)
                        {
                            console.log('Error in Saving user: '+err);
                            throw err;
                        }
                        console.log('User Registration succesful');
                        return done(null, newaccount);
                    });
                }
            });
    })
);
router.post('/register', passport.authenticate('register', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash : true
}));
router.get('/', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('index', { message: req.flash('message') });
});
router.get('/register', function(req, res) {
    res.render('register', { });
});
router.get('/profile', function(req, res) {
    // if(user.access=='no access')
    //     res.render('/');
    res.render('profile', { user : req.user });
});
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;