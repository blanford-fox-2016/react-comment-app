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
        comment.id = Date.now()
        let newComments = comments.concat([comment])
        this.setState({data: newComments})
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'post',
            data: comment,
            success: function (response) {
                this.setState({data: response})
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
                <CommentList data={this.state.data}/>
                <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
            </div>
        )
    }
})

let CommentList = React.createClass({
    //state less
    render: function () {
        let commentNodes = this.props.data.map(function (comment) {
            return(<Comment key={comment._id} author={comment.author} text={comment.comment}/>)
        })
        return(
            <div>{commentNodes}</div>
        )
    }
})

let Comment = React.createClass({
    render: function () {
        return(
            <div className="comment">
                <h4>{this.props.author}</h4>
                <p>{this.props.text}</p>
            </div>
        )
    }
})

let CommentForm = React.createClass({
    getInitialState: function () {
        return {
            author: '',
            text: ''
        }
    },

    handleAuthorChange: function (e) {
        this.setState({author: e.target.value})
    },

    handleTextChange: function (e) {
        this.setState({text: e.target.value})
    },

    handleSubmit: function (e) {
        e.preventDefault()
        let author = this.state.author.trim()
        let text = this.state.text.trim()
        if (!text || ! author) return
        else {
            this.props.onCommentSubmit({author: author, comment: text})
            this.setState({author: ''})
            this.setState({text: ''})
        }
    },

    render: function () {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your Name" value={this.state.author} onChange={this.handleAuthorChange}/>
                <input type="text" placeholder="Your Comment" value={this.state.text} onChange={this.handleTextChange}/>
                <button type="submit" value="post">Submit</button>
            </form>
        )
    }
})

ReactDOM.render(
    <CommentBox url="http://localhost:3000/api/comments"/>, document.getElementById('content')
)