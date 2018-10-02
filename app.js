const dotenv = require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const expressSanitizer = require('express-sanitizer');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const path = require('path');
const {User} = require('./models/user');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

const port = process.env.PORT || 8000;
const app = express();
const sessionStore = new session.MemoryStore;


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MARSH_DB);

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_PARSER));
//expressSanitizer
app.use(expressSanitizer());
//express session middleware
app.use(session({
  secret: process.env.SESSION,
  resave: 'true',
  store: sessionStore,
  saveUninitialized: true,
  cookie: {maxAge: 60000 }
}));

app.use(flash());

//lets us know who is logged in. keep above routes
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


app.get('/', (req, res) => {
  res.render('index', {title: 'Home | TA Marsh'});
});

app.post('/user', (req, res) => {
  const body = _.pick(req.body, ['name', 'email', 'phone', 'comment']);
  const user = new User(body);


  user.save((err) => {
    if (err) {
      req.flash('error', 'Oops! Something went wrong with your request.');
      res.redirect('/');
    } else {
      req.flash('success', 'Your message has been sent.');
      res.redirect('/');
    }
  });
});

app.get('/about', (req, res) => {
  res.render('about', {title: 'About | TA Marsh'});
});

app.get('/reviews', (req, res) => {
  res.render('reviews', {title: 'Reviews | TA Marsh'});
});

app.get('/services', (req, res) => {
  res.render('services', {title: 'Services | TA Marsh'});
});

app.get('/contact', (req, res) => {
  res.render('contact', {title: 'Contact | TA Marsh'});
});

app.listen(port, () => {
  console.log(`Server is running on: ${port}`);
});
