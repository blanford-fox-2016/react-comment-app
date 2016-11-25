'use strict'

var MainApp = React.createClass({
  getInitialState: function() {
    return {
      data: []
    }
  },
  //custom function
 loadComments: function(){
   console.log(this.props.url);
   $.ajax({
     url: this.props.url,
     dataType: 'JSON',
     cache: false,
     success: function(res_data){
       console.log(res_data);
       this.setState({
         data: res_data
       })
     }.bind(this),
     error: function(xhr, status, err){
       console.error(this.props.url, status, err.toString());
     }.bind(this)
   })
 },
 handleCommentSubmit: function(comment){
   var comments = this.state.data

   var newComments = comments.push([comment])
   this.setState({
     data: newComments
   })
   $.ajax({
     url: this.props.url,
     dataType: 'JSON',
     type: 'POST',
     data: comment,
     success: function(newdata){
       console.log(newdata);
      //  this.setState({
      //    data: newdata
      //  })
      this.loadComments()
     }.bind(this),
     error: function(xhr, status, err){
       this.setState({
         data: comments
       })
       console.error(this.props.url, status, err.toString())
     }.bind(this)
   })
 },
 handleDeleteComment: function(id){
   var comments = this.state.data
   $.ajax({
     url: this.props.url+id,
     dataType: 'JSON',
     method: 'DELETE',
     success: function(deleted_data){
       console.log(deleted_data);
       this.loadComments();
     }.bind(this),
     error: function(xhr, status, err){
       this.setState({
         data: comments
       })
       console.error(this.props.url, status, err.toString())
     }.bind(this)
   })
 },
 componentDidMount: function(){
   this.loadComments()
 },
  render: function() {
    return(
      <div>
      <NavBar />
      <div className="container">
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
        <CommentList data={this.state.data} deleteComment={this.handleDeleteComment}/>
      </div>
      </div>
    )
  }
})

var NavBar = React.createClass({
  render: function() {
    return(
      <nav className="navbar navbar-default">
        <div className="container text-center">
          <h3 className="h-title">TLTR (Tama Learns to React) - Comment App</h3>
        </div>
      </nav>
    )
  }
})


var CommentForm = React.createClass({
  getInitialState: function () {
    return({
      author: '',
      content: ''
    })
  },
  handleAuthorChange(e){
    this.setState({
      author: e.target.value
    })
  },
  handleContentChange(e){
    this.setState({
      content: e.target.value
    })
  },
  handleSubmit(e){
    e.preventDefault()
    var author = this.state.author.trim()
    var content = this.state.content.trim()
    if(!author || !content){
      return alert('Please input your name and your comment!')
    }else{
      this.props.onCommentSubmit({
        author: author,
        content: content
      })
      this.setState({
        author: '',
        content: ''
      })
    }
  },
  render: function() {
    return(
      <div className="row">
        <div className="well well-sm">
          <div className="pull-right">
            <button id="addNewBtn" type="button" className="btn btn-info" data-toggle="collapse" data-target="#addNewForm" aria-expanded="false" aria-controls="addNewForm">
              <i className="glyphicon glyphicon-plus"></i>Add New
            </button>
          </div>
          <div className="clearfix"></div>
        </div>

        <div className="collapse" id="addNewForm">
          <div className="well">
            <h3>Add New Comment</h3>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label className="control-label">Your Name (君の名は)</label>
                <input value={this.state.author} onChange={this.handleAuthorChange} type="text" className="form-control" placeholder="Enter your name (君の名は)" required />
              </div>
              <div className="form-group">
                <label className="control-label">Your Comment</label>
                <textarea type="text" value={this.state.content} onChange={this.handleContentChange} className="form-control" placeholder="Enter the comment" required></textarea>
              </div>
              <div className="form-group">
                <button type="submit" name="button" className="btn btn-info" data-toggle="collapse" data-target="#addNewForm" aria-expanded="false" aria-controls="addNewForm">Submit <i className="glyphicon glyphicon-send"></i></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
})

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return(
        <Comment key={comment._id} id={comment._id} author={comment.author} content={comment.content} deleteComment={this.props.deleteComment}/>
      )
    }.bind(this))
    return(
      <div className="row">
        {commentNodes}
      </div>
    )
  }
})

var MarkdownViewer = React.createClass({
  render: function() {
      var markdown = marked.parse(this.props.markdown);
      return <div dangerouslySetInnerHTML={{__html: markdown }} />;
  }
});

var Comment = React.createClass({
  handleDelete: function() {
    this.props.deleteComment(this.props.id)
  },
  render: function() {
    // var commenttext = marked(this.props.content)
    return(
      <div className="panel panel-default" data-id={this.props.id}>
        <div className="panel-body">
          <button type="button" className="close" onClick={this.handleDelete.bind(this)}><span aria-hidden="true" className="glyphicon glyphicon-trash small"></span></button>

          <div className="col-md-12">
            <h3 className="comm-author">{this.props.author}</h3>
            <MarkdownViewer markdown={this.props.content} />
          </div>
        </div>
      </div>
    )
  }
})

// var ModalDelete = React.createClass({
//   render: function() {
//
//   }
// })


// Rendering to the host
ReactDOM.render(<MainApp url="http://localhost:3000/api/comment/" />, document.getElementById('app'))
