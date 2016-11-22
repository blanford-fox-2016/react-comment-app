require('dotenv').config()

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors')
const fs = require('fs')

const COMMENTS_FILE = path.join(__dirname, 'comments.json')

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE)

const routes = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors())

//isi cors
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     res.setHeader('Cache-Control', 'no-cache')
//     next()
// })

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/comments', routes);
// app.use('/users', users);


//router
// app.get('/api/comments', function (req, res) {
//     fs.readFile(COMMENTS_FILE, function (err, data) {
//         if (err) res.json(err)
//         else res.json(JSON.parse(data))
//     })
// })
//
// app.post('/api/comments', function (req, res) {
//     fs.readFile(COMMENTS_FILE, function (err, data) {
//         if (err) res.json(err)
//         else {
//             let comments = JSON.parse(data)
//             let newComment = {
//                 id: Date.now(),
//                 author: req.body.author,
//                 text: req.body.text
//             }
//             comments.push(newComment)
//             fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function (err) {
//                 if (err) res.json(err)
//                 else res.json(comments)
//             })
//         }
//     })
// })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
