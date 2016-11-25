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
   comment.id = Date.now()
   var newComments = comments.concat([comment])
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
 componentDidMount: function(){
   this.loadComments()
 },
  render: function() {
    return(
      <div>
      <NavBar />
      <div className="container">
        <CommentForm />
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
            <div className="form-group">
              <label className="control-label">Your Name (君の名は)</label>
              <input type="text" className="form-control" placeholder="Enter your name (君の名は)" required />
            </div>
            <div className="form-group">
              <label className="control-label">Your Comment</label>
              <textarea className="form-control" placeholder="Enter the comment" required></textarea>
            </div>
            <div className="form-group">
              <button type="button" name="button" className="btn btn-info" data-toggle="collapse" data-target="#addNewForm" aria-expanded="false" aria-controls="addNewForm">Submit <i className="glyphicon glyphicon-send"></i></button>
            </div>
          </div>
        </div>
      </div>
    )
  }
})


// Rendering to the host
ReactDOM.render(<MainApp url="http://localhost:3000/api/comment/" />, document.getElementById('app'))
