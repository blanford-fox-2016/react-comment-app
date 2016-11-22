'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const app = express()

app.use(cors())

const COMMENT_FILES = path.join(__dirname, 'comments.json')

app.set('port', (process.env.PORT || 3000))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// cors manual
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   res.setHeader('Cache-Control', 'no-cache')
//   next()
// })

app.get('/api/comments', (req, res) => {
  fs.readFile(COMMENT_FILES, (err, data) => {
    err ? console.log(err) : res.json(JSON.parse(data))
  })
})

app.post('/api/comments', (req, res) => {
  fs.readFile(COMMENT_FILES, (err, data) => {
    if(err) {
      console.log(err)
    }
    let comments = JSON.parse(data)
    let newComment = {
      id: req.body.id,
      author: req.body.author,
      text: req.body.text
    };
    comments.push(newComment)
    fs.writeFile(COMMENT_FILES, JSON.stringify(comments, null, 4), (err) => {
      if(err) {
        console.log(err)
      }
      res.json(comments)
    })
  })
})

// app.delete('/api/comments', (req, res) => {
//     fs.writeFile(COMMENT_FILES, JSON.stringify(req.body, null, 4), (err) => {
//       if(err) {
//         console.log(err)
//       }
//       res.json()
//     })
//   })



app.listen(app.get('port'), () => {
  console.log('server is running on port 3000')
})
