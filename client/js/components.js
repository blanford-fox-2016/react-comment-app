var CommentBox = React.createClass({
  getInitialState: function(){
    return {data: []}
  },
  loadComments: function(){
    $.ajax({
      url: this.props.url,
      dataType: 'JSON',
      cache: false,
      success: function(response){
        this.setState({
          data: response
        })
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },
  componentDidMount: function(){
    this.loadComments()
  },
  handleCommentSubmit: function(comment){
    var comments = this.state.data
    comment.id = comments.length + 1
    var newComments = comments.concat([comment])
    this.setState({
      data: newComments
    })

    $.ajax({
      url: this.props.url,
      dataType: 'JSON',
      type: 'POST',
      data: comment,
      success: function(response){
        this.setState({
          data: response
        })
      }.bind(this),
      error: function(xhr, status, err){
        this.setState({
          data: comments
        })
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    })
  },
  handleCommentDelete: function(id){
    var comments = this.state.data
    $.ajax({
      url: this.props.url,
      dataType: 'JSON',
      type: 'DELETE',
      data: {id: id},
      success: function(response){
        this.setState({
          data: response
        })
      }.bind(this),
      error: function(xhr, status, err){
        this.setState({
          data: comments
        })
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    })
  },
  render: function(){
    return(
      <div className="commentBox">
        <div className="jumbotron">
        <div className="container text-center">
          <h1>Hacktiv8 Comments Apps</h1>
        </div>
      </div>
        <CommentList data={this.state.data} handleCommentDelete={this.handleCommentDelete}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    )
  }
})

var CommentList = React.createClass({
  onCommentDelete(){

  },
  render: function(){
    var h2 = <h2>Comment List</h2>
    var commentNodes = this.props.data.map((comment) => {
      return(
        <Comment key={comment.id} id={comment.id} author={comment.author} text={comment.text} handleCommentDelete={this.props.handleCommentDelete}/>
      )
    }.bind(this))
    return (<div>{commentNodes}</div>)
  }
})

var MarkdownViewer = React.createClass({
  render: function() {
      console.log(this.props.markdown)
      var markdown = marked.parse(this.props.markdown);
      return <div dangerouslySetInnerHTML={{__html: markdown }} />;
  }
});

var Comment = React.createClass({
  render(){
    return (
      <div className="comment" id={this.props.id}>
        <div className="well">
          <h3>{this.props.author}</h3>
          <h4><MarkdownViewer markdown={this.props.text} /></h4>
          <DeleteButton id={this.props.id} onCommentDelete={this.props.handleCommentDelete}/>
        </div>
      </div>
    )
  }
})

var DeleteButton = React.createClass({
  handleDelete(e){
    var id = this.props.id
    if(confirm("Are you sure you want to delete?") === true){
      this.props.onCommentDelete(id)
    }
  },
  render(){
    return(
      <button className="btn btn-danger btn-sm" onClick={this.handleDelete}>Delete Comment</button>
      )
  }
})

var CommentForm = React.createClass({
  getInitialState(){
    return ({
      author: '',
      text: ''
    })
  },
  handleAuthorChange(e){
    this.setState({
      author: e.target.value
    })
  },
  handleTextChange(e){
    this.setState({
      text: e.target.value
    })
  },
  handleSubmit(e){
    e.preventDefault()
    var author = this.state.author.trim()
    var text = this.state.text.trim()
    if(!author || !text){
      return
    }else{
      this.props.onCommentSubmit({
        author: author,
        text: text
      })
      this.setState({
        author: '',
        text: ''
      })
    }
  },
  render(){
    return(
      <div className="well">
        <form onSubmit={this.handleSubmit}>
        <input className="form-control" type="text" placeholder="Enter Name" value={this.state.author} onChange={this.handleAuthorChange} />
        <br/>
        <textarea className="form-control" type="text" placeholder="Enter comment" onChange={this.handleTextChange} value={this.state.text}></textarea>
        <br/>
        <input className="btn btn-md btn-primary" type="submit" value="Add Post" />
      </form>
      </div>
    )
  }
})

ReactDOM.render(
  <CommentBox url="http://localhost:3000/api/comments"/>, document.getElementById('content')
)