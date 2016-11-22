var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []}
  },
  loadComments: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(response) {
        this.setState({data: response})
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data
    comment.id = Date.now()
    var newComments = comments.concat([comment])
    this.setState({data: newComments})
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      method: 'post',
      data: comment,
      success: function(response) {
        this.setState({data: response})
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: comments})
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },
  deleteItem: function(parameter) {
    var del = confirm('Are you sure want to delete this data ?')
    if (del) {
      $.ajax({
        url: `http://localhost:3000/api/comments`,
        method: 'DELETE',
        dataType: 'json',
        data: {
          id: parameter
        },
        success: function(response){
          this.setState({data: response})
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      })
    } else {

    }
  },
  componentDidMount: function() {
    this.loadComments()
  },
  render: function() {
    return(
      <div className="commentBox">
        <h1>Comments App</h1>
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
        <CommentList data={this.state.data} deleteItem={this.deleteItem}/>
      </div>
    )
  }
})

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return(<Comment key={comment.id} id={comment.id} author={comment.author} text={comment.text} deleteItem={this.props.deleteItem}/>)
    }.bind(this))
    return(
      <table className="table">
          <thead>
              <tr>
                  <td>Author</td>
                  <td>Text</td>
                  <td>Action</td>
              </tr>
          </thead>
          <tbody>
          {commentNodes}
          </tbody>
      </table>

    )
  }
})

var Comment = React.createClass({
    handleDelete: function() {
      this.props.deleteItem(this.props.id)
    },
    render: function() {
      return(
          <tr>
          <td>{this.props.author}</td>
          <td>{this.props.text}</td>
          <td>
          <div className="form-group">
          <button className="btn btn-warning">Update</button>
          </div>
          <div className="form-group">
          <button className="btn btn-danger" onClick={this.handleDelete.bind(this)}>Delete</button>
          </div>
          </td>
          </tr>
      )
    }
})

var CommentForm = React.createClass({
  getInitialState: function() {
    return {author: '', text: ''}
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value})
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value})
  },
  handleSubmit: function(e) {
    e.preventDefault()
    var author = this.state.author.trim()
    var text = this.state.text.trim()
    if (!text || !author) {
      return
    }else{
      this.props.onCommentSubmit({author: author, text: text})
      this.setState({author: '', text: ''})
    }

  },
  render: function() {
    return(
      <form onSubmit={this.handleSubmit}>
       <div className="form-group">
       <label>Author Name : </label>
        <input className="form-control" type="text" placeholder="Enter Name" value={this.state.author} onChange={this.handleAuthorChange} />
        </div>
        <div className="form-group">
        <label>Text : </label>
        <input className="form-control" type="text" placeholder="Enter Text" value={this.state.text} onChange={this.handleTextChange} />
        </div>
        <button className="btn btn-danger" type="submit">Post</button>
      </form>
    )
  }
})

ReactDOM.render(
  <CommentBox url="http://localhost:3000/api/comments"/>, document.getElementById('content')
)
