'use strict'
const express = require('express');
const router = express.Router();
const controller = require('../controllers/apiCommentController');

/* GET comments listing. */
router.get('/', controller.getAllComments);
// POST new comment
router.post('/', controller.postNewComment);
// DELETE a comment by id
router.delete('/:id', controller.deleteComment)

module.exports = router;
