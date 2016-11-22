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
        comment._id = Date.now()
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

    componentDidMount: function () {
        this.loadComments()
    },

    render: function () {
        return(
            <div className="commentBox">
                <h1>Comment App</h1>
                <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
                <CommentList data={this.state.data}/>
            </div>
        )
    }
})

let CommentList = React.createClass({
    //state less
    render: function () {
        let commentNodes = this.props.data.map(function (comment) {
            return(<Comment key={comment._id} author={comment.author} comment={comment.comment}/>)
        })
        return(
            <div>{commentNodes}</div>
        )
    }
})

let Comment = React.createClass({
    render: function () {
        return(
            <div>
                <button className="btn btn-danger">Delete</button>
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
                    <input type="comment" placeholder="Your Name" value={this.state.author} onChange={this.handleAuthorChange}/>
                </div>
                <div className="form-group">
                    <input type="comment" placeholder="Your Comment" value={this.state.comment} onChange={this.handlecommentChange}/>
                </div>
                <button type="submit" value="post">Submit</button>
            </form>
        )
    }
})

ReactDOM.render(
    <CommentBox url="http://localhost:3000/api/comments"/>, document.getElementById('content')
)