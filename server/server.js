const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')

const COMMENTS_FILE = path.join(__dirname, 'comments.json')

app.set('port', (process.env.PORT || 3000))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())

// app.use(function(req, res, next) {
//         res.setHeader('Access-Control-Allow-Origin', '*')
//         res.setHeader('Cache-Control', 'no-cache')
//         res.setHeader('Access-Control-Allow-Methods', 'DELETE')
//         next()
//     })

app.get('/api/comments', function(req, res) {
    fs.readFile(COMMENTS_FILE, function(err, data) {
        if (err) return console.log(err)
        res.json(JSON.parse(data))
    })
})

app.post('/api/comments', function(req, res) {
    fs.readFile(COMMENTS_FILE, function(err, data) {
        if (err) { console.log(err) }
        var comments = JSON.parse(data)
        var newComment = {
            id: req.body.id,
            author: req.body.author,
            text: req.body.text
        }
        comments.push(newComment)
        fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
            if (err) { console.log(err) }
            res.json(comments)
        })
    })
})

app.delete('/api/comments', function(req, res) {
	var data = fs.readFileSync(COMMENTS_FILE)
	var comments = JSON.parse(data)

	for (var i = 0; i < comments.length; i++) {
      if (comments[i].id == req.body.id) {
          comments.splice(i,1)
          fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
              if (err) {
                  console.log(err);
              } else {
                  res.json(comments)
              }
          })
      } else {

      }
    }
})

app.listen(app.get('port'), function() {
    console.log('ya udah jalan bos!')
})
