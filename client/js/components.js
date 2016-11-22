// statefull
var CommentBox = React.createClass({
  getInitialState: function(){
    return {data: []}
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
        // this.setState({
        //   data: {
        //     id: res_data.,
        //     author: ,
        //     text:
        //   }
        // })
      }.bind(this),// for point parent this : CommentBox
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },
  componentDidMount: function(){// function name from React
    this.loadComments()
  },
  handleCommentSubmit: function(comment){
    var comments = this.state.data
    comment.id = Date.now()
    // comment.text = marked(`${comment.text}`)
    var newComments = comments.concat([comment])
    // console.log(newComments);
    this.setState({
      data: newComments
    })

    $.ajax({
      url: this.props.url,
      dataType: 'JSON',
      type: 'POST',
      data: comment,
      success: function(res_new_data){
        this.setState({
          data: res_new_data
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
  handleDeleteSubmitCommentBox: function(id){
    var comments = this.state.data
    // console.log(id);
    // console.log(this.state.data);

    //var newComments = this.state.data.filter(comment => comment.id !== id)

    // ajax delete
    console.log(this.props.url+id);
    $.ajax({
      url: this.props.url+id,
      dataType: 'JSON',
      method: 'DELETE',
      success: function(deleted_data){
        console.log(deleted_data);
        this.setState({
          data: deleted_data
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
        <h1>Comments App</h1>
        <CommentList data={this.state.data} onDeleteSubmitCommentBox={this.handleDeleteSubmitCommentBox}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit} style_textarea={{resize: "none",height: 320 + "px"}} />
      </div>
    )
  }
  /*
  alternative:
  render (){

  }
  */
})

// stateless
var CommentList = React.createClass({
  // alternative delete
  handleDeleteSubmitCommentList: function(id){
    // console.log(id);
    // console.log(this.props.data);
    this.props.onDeleteSubmitCommentBox(id)
    // console.log(this.props.data.map((comment) => {
    //   // comment.id.indexOf(`${id}`)
    //   comment.id
    // }));
  },
  render: function(){
    var h2 = <h2>Comment List</h2>
    var commentNodes = this.props.data.map((comment) => {
      // Comment is a componen
      // key for props in each data
      return(
        <Comment key={comment.id} commentId={comment.id} author={comment.author} text={comment.text} onDeleteSubmitCommentList={this.handleDeleteSubmitCommentList} /*all_data={this.props.data}*//>
      )
    })
    // return(
    //   div(null, {commentNodes})
    // )
    return (<div>{commentNodes}</div>)
  }
})

var MarkdownViewer = React.createClass({
  render: function() {
      var markdown = marked.parse(this.props.markdown);
      // console.log(this.props.markdown);
      return <div dangerouslySetInnerHTML={{__html: markdown }} />;
  }
});

var Comment = React.createClass({
  deleteData(){
    // console.log(this.props.commentId);
    // console.log(this.props.all_data);
    // var r = confirm()
    // this.props.onDeleteSubmitCommentList(this.props.commentId)
    if(confirm("Are you sure want to delete?") === true){
      this.props.onDeleteSubmitCommentList(this.props.commentId)
    }
  },
  render(){
    return (
      <div className="comment panel panel-default">
        <div className="panel-heading">
          <h4>
            {this.props.author}
          </h4>
        </div>
        <div className="panel-body">
          <MarkdownViewer markdown={this.props.text} />
        </div>
        <div className="panel-footer">
          <button onClick={this.deleteData} className="btn btn-default btn-sm">Delete</button>
        </div>
      </div>
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
      <form onSubmit={this.handleSubmit} className="form-group">
        <label htmlFor="author">Input Author</label>
        <input type="text" placeholder="Your Name" value={this.state.author} onChange={this.handleAuthorChange} className="form-control" />
        <label htmlFor="text">Input Content</label>
        <textarea value={this.state.text} onChange={this.handleTextChange} className="form-control" placeholder="Your content" style={this.props.style_textarea}></textarea>
        <input type="submit" value="Add Post" className="form-control" />
      </form>
    )
  }
})

ReactDOM.render(
  <CommentBox url="http://localhost:3000/api/comments/"/>, document.getElementById('content')
)
