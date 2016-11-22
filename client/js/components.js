// statefull
var CommentBox = React.createClass({
  getInitialState: function(){
    return {
      data: [],
      edit_form: {
        commentId: '',
        author: '',
        text: ''
      }}
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
  handleEditFillForm : function(id){
    var index = this.state.data.findIndex((comment) => comment.id === id)
    // console.log(this.state.data[index]);
    this.setState({
      edit_form : {
        commentId: this.state.data[index].id,
        author: this.state.data[index].author,
        text: this.state.data[index].text
      }
    })
  },
  handleCommentEdit(edited_data){
    var comments = this.state.data
    $.ajax({
      url: this.props.url+edited_data.commentId,
      dataType: 'JSON',
      method: 'PUT',
      data: {
        author: edited_data.author,
        text: edited_data.text
      },
      success: function(data_res){
        console.log(data_res);
        this.setState({
          data: data_res,
          edit_form:{
            commentId: '',
            author: '',
            text: ''
          }
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
        <CommentList data={this.state.data} onDeleteSubmitCommentBox={this.handleDeleteSubmitCommentBox} onEditFillForm={this.handleEditFillForm} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} style_textarea={{resize: "none",height: 320 + "px"}} edit_form={this.state.edit_form} onCommentEdit={this.handleCommentEdit} />
      </div>
    )
  }
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
  handleEditFillForm: function(id){
    this.props.onEditFillForm(id)
  },
  render: function(){
    var h2 = <h2>Comment List</h2>
    var commentNodes = this.props.data.map((comment) => {
      // Comment is a componen
      // key for props in each data
      return(
        <Comment key={comment.id} commentId={comment.id} author={comment.author} text={comment.text} onDeleteSubmitCommentList={this.handleDeleteSubmitCommentList} onEditFillForm={this.handleEditFillForm}/*all_data={this.props.data}*//>
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
    if(confirm("Are you sure want to delete?") === true){
      this.props.onDeleteSubmitCommentList(this.props.commentId)
    }
  },
  editData(){
    this.props.onEditFillForm(this.props.commentId)
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
          <button onClick={this.editData} className="btn btn-success btn-sm">Edit</button>
          <button onClick={this.deleteData} className="btn btn-warning btn-sm">Delete</button>
        </div>
      </div>
    )
  }
})

var CommentForm = React.createClass({
  getInitialState(){
    // console.log(this.props.edit_form.author);
    return ({
      author: '',
      text: ''
    })
  },
  handleAuthorChange(e){
    // if(this.props.edit_form.author == ""){
    //   this.setState({
    //     author: e.target.value
    //   })
    // }else{
    //   this.setProps({
    //     author: e.target.value
    //   }).bind(this)
    // }
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
  handleEdit(e){
    e.preventDefault()
    var author = this.state.author.trim()
    var text = this.state.text.trim()
    console.log(author);
    console.log(text);
    if(author === "" && text === ""){
      return
    }else{
      console.log(`masuk`);
      this.props.onCommentEdit({
        commentId: this.props.edit_form.commentId,
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
    // console.log(this.props.edit_form);
    return(
      <form onSubmit={(this.props.edit_form.author == "") ? this.handleSubmit : this.handleEdit} className="form-group">
        <label htmlFor="author">Input Author</label>
        <input type="text" placeholder="Your Name" value={this.state.author || this.props.edit_form.author} onChange={this.handleAuthorChange} className="form-control" />
        <label htmlFor="text">Input Content</label>
        <textarea value={this.state.text || this.props.edit_form.text} onChange={this.handleTextChange} className="form-control" placeholder="Your content" style={this.props.style_textarea}></textarea>
        <input type="submit" value={(this.props.edit_form.author == "") ? "Add Post" : "Edit Post"} className="form-control" />
      </form>
    )
  }
})

ReactDOM.render(
  <CommentBox url="http://localhost:3000/api/comments/"/>, document.getElementById('content')
)
