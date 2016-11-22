'use strict'
const div = React.DOM.div
const h1 = React.DOM.h1

const CommentBox = React.createClass({
  getInitialState () {
    return {data : []}
  },

  loadComment () {
    $.ajax({
      url: this.props.url,
      dataTypes: 'json',
      cache: false,
      success: (response) => {
        this.setState({data: response })
      }.bind(this)// to comment box or get this out of the ajax
    })
  },

  handleCommentSubmit (comment) {
    var comments = this.state.data;
    comment.id = Date.now()
    var newComments = comments.concat([comment])
    this.setState({data: newComments})
    $.ajax({
      url: this.props.url,
      dataTypes: 'json',
      type: 'POST',
      data: comment,
      success: (response) => {
        this.setState({data: response})
      }.bind(this),
      error: (err) => {
        this.setState({data: comments})
        console.log(this.props.url, status, err.toString()).bind(this)
      }
    })
  },

  handleDeleteCommentBox (id) {
    var comments = this.state.data;
    var newComments = comments.filter((comment) => comment.id !== id)
    this.setState({data: newComments})
    $.ajax({
      url: this.props.url,
      dataTypes: 'json',
      type: 'DELETE',
      data: newComments,
      success: (response) => {
        console.log('success')
      }.bind(this)
    })

  },

  componentDidMount () {
    this.loadComment()
  },

  render () {
    return (
      <div className="commentBox">
        <div className='comment-title'>
          <h1> Comments App</h1>
          <CommentList data={this.state.data} fromCommentList={this.handleDeleteCommentBox} />
          <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        </div>
      </div>
    )
  }
})

// comment list to show the list of comment
const CommentList = React.createClass({
  handleDeleteCommentList (id) {
    this.props.fromCommentList(id)
  },

  render () {
    return (
      <div>
        {this.props.data.map((comment) => (<Comment key={comment.id} fromComment={this.handleDeleteCommentList} commentId = {comment.id} author={comment.author} text={comment.text} />))}
      </div>
    )
  }
})


// comment  to show the comment author and text
const Comment = React.createClass({
  handleDelete () {
    var id = this.props.commentId
    this.props.fromComment(id)
    // var all_comments = this.props.all_comments
    // var newState = all_comments.filter((comment) => comment.id !== id)
    // this.setState({data : newState})

  },

  render () {
    return (
      <div className="comment">
        <h4>{this.props.author}</h4>
        <p>{this.props.text}</p>
        <button id={this.props.id} onClick={this.handleDelete}>delete</button>
      </div>
    )
  }
})

// the form to get the data from form
const CommentForm = React.createClass({
  getInitialState () {
    return {
      author: '',
      text: ''
    }
  },

  handleAuthorChange (e) {
    this.setState({author: e.target.value})
  },

  handleTextChange (e) {
    this.setState({text: e.target.value})
  },

  handleSubmit (e) {
    e.preventDefault()
    var author = this.state.author.trim()
    var text = this.state.text.trim()
    if(!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text})
  },

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Author Name" value={this.state.author} onChange={this.handleAuthorChange} />
        <input type="text" placeholder="Description" value={this.state.text} onChange={this.handleTextChange} />
        <input type='submit' value='add comment' />
      </form>
    )
  }
})

// Rendering to the host
ReactDOM.render(<CommentBox url={'http://localhost:3000/api/comments'} />, document.getElementById('content'))
