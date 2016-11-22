const Comment = require('../models/models.api.comments')

module.exports = {
    createComment: (req, res) => {
        const insertData = {
            commentId: req.body.commentId,
            author: req.body.author,
            comment: req.body.comment
        }

        Comment.create(insertData, function (err, data) {
            if (err) res.json(err)
            else res.json(data)
        })
    },

    getAllcomments: (req, res) => {
        Comment.find(function (err, data) {
            if (err) res.json(err)
            else res.json(data)
        })
    },

    deleteComment: (req, res) => {
        Comment.findOneAndRemove({
            commentId: req.body.id
        }, function (err, data) {
            if (err) res.json(err)
            else res.json(data)
        })
    }
}