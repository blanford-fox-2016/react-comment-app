const BASE_URL = 'http://localhost:3000/api/comments'

let CommentBox = React.createClass({
    //Statefull
    getInitialState: function () {
        return {
            data: []
        }
    },

    loadComments: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (response) {
                this.setState({data: response})
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString())
            }.bind(this)
        })
    },

    handleCommentSubmit: function (comment) {
        let comments = this.state.data
        comment.commentId = Date.now()
        let newComments = comments.concat([comment])
        this.setState({data: newComments})
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'post',
            data: comment,
            success: function (response) {
                this.setState({data: newComments})
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({data: comments})
                console.error(this.props.url, status, err.toString())
            }.bind(this)
        })
    },

    handleDeleteCommentBox: function (id) {
        let comments = this.state.data
        let newData = comments.filter(function (x) {
            if (x.commentId != id) return x
        })
        this.setState({data: newData})
        $.ajax({
            url: this.props.url,
            type: 'DELETE',
            data: {
                id: id
            },
            success: function (data) {
                this.setState({data: newData})
            }.bind(this)
        })
    },

    componentDidMount: function () {
        this.loadComments()
    },

    render: function () {
        return(
            <div className="commentBox">
                <h1>Comment App</h1>
                <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
                <CommentList handleDeleteCommentBox={this.handleDeleteCommentBox} data={this.state.data}/>
            </div>
        )
    }
})

let CommentList = React.createClass({

    commentDeleteCommentList: function (id) {
        this.props.handleDeleteCommentBox(id)
    },
    //state less
    render: function () {
        let commentNodes = this.props.data.map(function (comment) {
            return(<Comment onCommentDeleteCommentList={this.commentDeleteCommentList} key={comment.commentId} id={comment.commentId} author={comment.author} comment={comment.comment}/>)
        }.bind(this))
        return(
            <div>{commentNodes}</div>
        )
    }
})

let Comment = React.createClass({
    render: function () {
        return(
            <div>
                <button id={`${this.props.id}`} onClick={this.handleDelete} className="btn btn-danger">Delete</button>
                <div className="panel panel-default comment">
                    <div className="panel-heading text-center">
                        {this.props.author}
                    </div>
                    <div className="panel-body">
                        {this.props.comment}
                    </div>
                </div>
            </div>
        )
    },

    handleDelete: function (e) {
        let id = e.target.id
        if (confirm("are you sure?") == true) this.props.onCommentDeleteCommentList(id)
    }
})

let CommentForm = React.createClass({
    getInitialState: function () {
        return {
            author: '',
            comment: ''
        }
    },

    handleAuthorChange: function (e) {
        this.setState({author: e.target.value})
    },

    handlecommentChange: function (e) {
        this.setState({comment: e.target.value})
    },

    handleSubmit: function (e) {
        e.preventDefault()
        let author = this.state.author.trim()
        let comment = this.state.comment.trim()
        if (!comment || ! author) return
        else {
            this.props.onCommentSubmit({author: author, comment: comment})
            this.setState({author: ''})
            this.setState({comment: ''})
        }
    },

    render: function () {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Your Name" value={this.state.author} onChange={this.handleAuthorChange}/>
                </div>
                <div className="form-group">
                    <textarea className="form-control" rows="5" value={this.state.comment} onChange={this.handlecommentChange}></textarea>
                </div>
                <button type="submit" className="btn btn-success" value="post">Submit</button>
            </form>
        )
    }
})

ReactDOM.render(
    <CommentBox url="http://localhost:3000/api/comments"/>, document.getElementById('content')
)