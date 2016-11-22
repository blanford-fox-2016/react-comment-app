var express = require('express');
var router = express.Router();
const commentsController = require('../controllers/controllers.api.comments')

/* GET home page. */
router.get('/', commentsController.getAllcomments)
router.post('/', commentsController.createComment)
router.delete('/', commentsController.deleteComment)

module.exports = router;
