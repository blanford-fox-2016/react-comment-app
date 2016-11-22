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
      error: () => {
        this.setState({data: comments})
        console.log(this.props.url, status, err.toString()).bind(this)
      }
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
          <CommentList data={this.state.data}/>
          <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        </div>
      </div>
    )
  }
})

// const CommentList = React.createClass({
//   render () {
//     var commentNodes = this.props.data.map((comment) => (<Comment key={comment.id} author={comment.author} text={comment.text} />))
//     return (
//       <div>{commentNodes}</div>
//     )
//   }
// })

const CommentList = (props) => {
  return (
    <div>
      {props.data.map((comment) => (<Comment key={comment.id} author={comment.author} text={comment.text} />))}
    </div>
  )
}

// const CommentList = (props) => {
//   ren
// }

const Comment = (props) => {
  return(
    <div className="comment">
      <h4>{props.author}</h4>
      <p>{props.text}</p>
    </div>
  )
}

// const Comment = React.createClass({
//   render () {
//     return (
//       <div className="comment">
//         <h4>{this.props.author}</h4>
//         <p>{this.props.text}</p>
//       </div>
//     )
//   }
// })


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

// const Comment = () => (
//   <h3> testing </h3>
// )




ReactDOM.render(<CommentBox url={'http://localhost:3000/api/comments'}/>, document.getElementById('content'))
