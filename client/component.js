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
    console.log(comments);
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
      var comments = this.state.data
      console.log(comments);
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
  updateItem: function(id, author, text) {
    $.ajax({
      url: `http://localhost:3000/api/comments`,
      method: 'PUT',
      dataType: 'json',
      data: {
        id: id,
        author: author,
        text: text
      }, success: function(response) {
        this.setState({data: response})
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },
  componentDidMount: function() {
    this.loadComments()
  },
  render: function() {
    return(
      <div className="commentBox">
        <h1>Comments App</h1>
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
        <CommentList data={this.state.data} deleteItem={this.deleteItem} updateItem={this.updateItem}/>
      </div>
    )
  }
})

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return(<Comment key={comment.id} id={comment.id} author={comment.author} text={comment.text} deleteItem={this.props.deleteItem} updateItem={this.props.updateItem}/>)
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
    getInitialState: function() {
      return {author: this.props.author, text: this.props.text, editing: false}
    },
    handleDelete: function() {
      this.props.deleteItem(this.props.id)
    },
    updateForm: function() {
      this.setState({editing: true})
    },
    atAuthorChange: function(e) {
      this.setState({author: e.target.value})
      console.log(this.state.author);
    },
    atTextChange: function(e) {
      this.setState({text: e.target.value})
      console.log(this.state.text);

    },
    cancel: function(e) {
      e.preventDefault()
      this.setState({editing: false, author: this.props.author, text: this.props.text})
    },
    confirmEdit: function(e) {
      e.preventDefault()
      let author = this.state.author
      let text = this.state.text
      if (!author || !text) {
        return ;
      } else {
        this.props.updateItem(this.props.id, this.state.author, this.state.text)
        this.setState({editing: false})
      }
    },
    render: function() {
      if (!this.state.editing) {
        var convertAuthor = marked.parse(this.props.author)
        var convertText = marked.parse(this.props.text)
        return(
            <tr>
            <td>{this.props.author}</td>
            <MarkdownText markdown={this.props.text}/>
            <td>
            <div className="form-group">
            <button className="btn btn-warning" onClick={this.updateForm.bind(this)}>Update</button>
            </div>
            <div className="form-group">
            <button className="btn btn-danger" onClick={this.handleDelete.bind(this)}>Delete</button>
            </div>
            </td>
            </tr>
        )
      } else {
        return(
          <form className="form-inline well" onSubmit={this.confirmEdit.bind(this)}>
              <div className="form-group">
                  <label className="inline">Author Name</label>
                  <input type="text" className="form-control" id="form-edit-author" value={this.state.author} onChange={this.atAuthorChange.bind(this)} />
              </div>
              <div className="form-group">
                  <label className="inline">Frequency</label>
                  <input type="text" className="form-control" id="form-edit-text" value={this.state.text} onChange={this.atTextChange.bind(this)}/>
              </div>
              <button className="btn btn-primary" type="submit">Confirm Edit</button>
              <button className="btn btn-default" onClick={this.cancel.bind(this)}>Cancel</button>
          </form>
        )
      }
    }
})

var MarkdownText = React.createClass({
  render: function() {
      var markdown = marked.parse(this.props.markdown);
      return (
        <td>
        <div dangerouslySetInnerHTML={{__html: markdown }} />
      </td>
    )
  }
});

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
        <textarea className="form-control" type="text" placeholder="Enter Text" value={this.state.text} onChange={this.handleTextChange} />
        </div>
        <button className="btn btn-primary" type="submit">Post</button>
      </form>
    )
  }
})

ReactDOM.render(
  <CommentBox url="http://localhost:3000/api/comments"/>, document.getElementById('content')
)
