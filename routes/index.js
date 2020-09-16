var express = require('express');
var router = express.Router();
const mydb = require('../models');
const data = {userName: 'admin', pass: '1234'};


// create user info
class User {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}

/* GET login page. */
router.get('/', function (req, res, next) {
    if (!req.session.isLogged) { // init the session
        req.session.isLogged = false;
    }
    if (req.session.isLogged) { // if user is logged in
        res.render('index');
    } else { // user is't logged in
        res.render('login', {myMsg: 'You are not logged in'});
    }

});

router.get('/logout', function (req, res) { // when user logs out
    req.session.isLogged = false; // change session boolean
    res.redirect("/"); // go to home page
});

router.get('/readme', function (req, res) { // when user logs out
    res.render('readme'); // go to readme
});


router.get('/check', function (req, res, next) {
    if (!req.session.isLogged) { // initialize the session boolean
        res.render('login', {myMsg: "You are not logged in"});
    } else {
        return false;
    }
});


/* GET github page. */
router.post('/github', function (req, res, next) {

    user = new User(req.body.userName.trim(), req.body.pass.trim());
    req.session.isLogged = false;
    if (user.id === data.pass && user.name === data.userName) {
        req.session.isLogged = true;
        res.render('index', {title: 'welcome'});
    }
    else if(req.body.userName.trim() === "" || req.body.pass.trim() === ""){
        res.render('login', {
            myMsg: "Username or password are empty!"});
    }
    else {
        res.render('login', {
            myMsg: "Wrong username or password"
        });
    }
});

// handle save command
router.post('/save', function (req, res) {

    mydb.Contact.findOne({
        where: {login: req.body.userName}
    }).then(prod => {

        if (prod.login === req.body.userName) {

            mydb.Contact.findAll({}).then(prod => {
                res.json(prod);
            });
        }

    }).catch(function (err) {
        mydb.Contact.create({
            login: req.body.userName
        });
        mydb.Contact.findAll({}).then(prod => {
            res.json(prod);
        });
    });

});

// handle delete command
router.post('/delete', function (req, res) {

    mydb.Contact.findOne({
        where: {login: req.body.userName}
    }).then(prod => {

        if (prod.login === req.body.userName) {
            mydb.Contact.destroy({
                where: {
                    login: prod.login
                }
            });
            mydb.Contact.findAll({}).then(prod => {
                res.json(prod);
            });
        }

    }).catch(function (err) {
        mydb.Contact.findAll({}).then(prod => {
            res.json(prod);
        });
    });
});


// render data of the users
router.post('/', function(req, res) {
    mydb.Contact.findAll({}).then(prod => {
        res.json(prod);
    });
});


module.exports = router;
