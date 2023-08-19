if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express = require('express');
const app = express();
// BCRYPT PASSWORD:
const bcrypt = require('bcrypt');
// PASSPORT:
const passport = require('passport');
const initializePassport = require('./passport-config');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override')
initializePassport(passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id),
);

// JUST FOR APP PURPOSES:
const users = [];

app.set('view-engine');
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

app.use(express.urlencoded(
    {extended: false}
));
// MAIN PAGE
app.get('/', checkAuthenticated, (req,res) => {
    res.render('index.ejs', {name: req.user.name});
});

// LOGIN
app.get('/login',checkNotAuthenticated, (req,res) => {
    res.render('login.ejs');
});
app.post('/login',checkNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

// REGISTER
app.get('/register',checkNotAuthenticated, (req,res) => {
    res.render('register.ejs');
});
app.post('/register',checkNotAuthenticated, async (req, res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login');
    }catch{
        res.redirect('/register');
    }
    console.log(users);
});

// LOGOUT:
app.post("/logout", function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect("/");
    });
  });

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}

app.listen(3000);