'use strict'
const Comments = require('../models/Comments');

let getAllComments = (req, res, next) => {
  Comments.find({}, (err, comments) => {
    if (err) {
      console.log(err);
    } else {
      res.send(comments);
    }
  })
}

let postNewComment = (req, res, next) => {
  Comments.create({
    author: req.body.author,
    content: req.body.content
  }, (err, comment) => {
    if (err) {
      console.log(err);
    } else {
      res.send(comment)
    }
  })
}

let deleteComment = (req, res, next) => {
  Comments.remove({
    _id: req.params.id
  }, (err, deleted) => {
    if (err) {
      console.log(err);
    } else {
      res.json(deleted);
    }
  })
}

module.exports = {
  getAllComments,
  postNewComment,
  deleteComment
}
