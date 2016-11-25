'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let commentsSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
},
{
  timestamps: true
});

let comments = mongoose.model('comments', commentsSchema)

module.exports = comments;
