require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

const User = require('./models/user.model');
const userRouter = require('./routes/user.route');
const { isLoggedIn } = require('./middleware/auth.middleware');
const Secret = require('./models/secret.model');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000 // day * hour * min * second * mili second
    }
  })
); //it,s must need to create here above of mongoose connect

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((conn) => {
    console.log(
      `Mongodb Connected to: ${conn.connection.host}, ${conn.connection.name} on PORT ${conn.connection.port} `
    );
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB,\nError: ', err.message);
  });

// passport.use(
//   new LocalStrategy(function (username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false);
//       }
//       if (!user.verifyPassword(password)) {
//         return done(null, false);
//       }
//       return done(null, user);
//     });
//   })
// );
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routs
app.get('*', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
    next();
  } else {
    res.locals.user = null;
    next();
  }
});

app.use(userRouter);

app.get('/secrets', isLoggedIn, (req, res) => {
  Secret.find({ user: req.user._id }, (err, secrets) => {
    if (err) {
      res.render('secrets', { secrets: [] });
    } else {
      res.render('secrets', { secrets: secrets });
    }
  });
});

app.get('/submit', isLoggedIn, (req, res) => {
  res.render('submit');
});

app.post('/submit', isLoggedIn, (req, res) => {
  Secret.create(
    { secret: req.body.secret, user: req.user._id },
    (err, secret) => {
      if (err) {
        res.redirect('/submit');
      } else {
        res.redirect('/secrets');
      }
    }
  );
});

app.listen(process.env.PORT, () =>
  console.log(
    `Server running on PORT ${process.env.PORT}\nLocal:\thttp://localhost:${process.env.PORT}`
  )
);
