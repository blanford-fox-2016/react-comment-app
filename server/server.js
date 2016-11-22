const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()

const COMMENTS_FILE = path.join(__dirname, 'comments.json')

app.set('port', (process.env.PORT || 3000))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get('/api/comments', function(req, res) {
    fs.readFile(COMMENTS_FILE, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.json(JSON.parse(data))
        }
    })
})

app.post('/api/comments', function(req, res) {
    fs.readFile(COMMENTS_FILE, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            let comments = JSON.parse(data)
            let newComment = {
                id: req.body.id,
                author: req.body.author,
                text: req.body.text
            }
            comments.push(newComment)
            fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
                if (err) {
                    console.log(err);
                } else {
                    res.json(comments)
                }
            })
        }
    })
})

app.delete('/api/comments', function(req, res) {
    var bulk = fs.readFileSync(COMMENTS_FILE)
    var data = JSON.parse(bulk)
    for (var i = 0; i < data.length; i++) {
      if (data[i].id == req.body.id) {
          data.splice(i,1)
          fs.writeFile(COMMENTS_FILE, JSON.stringify(data, null, 4), function(err) {
              if (err) {
                  console.log(err);
              } else {
                  res.json(-data)
              }
          })
      } else {

      }
    }
})


app.listen(app.get('port'), function() {
    console.log('Server UP');
})
