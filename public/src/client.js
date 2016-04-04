$(document).ready(function(){

  ReactDOM.render(
    <SearchBar/>,
    document.getElementById("header")
  );

  ReactDOM.render(
    <ItemRow/>,
    document.getElementById("content")
  );
})

var SearchBar = React.createClass({
  render(){
    return(
      <form>
        <div className="input-group">
          <input type="text" className="form-control"/>
          <span className="input-group-btn">
            <input type="submit" className="btn btn-default" value="Search!"/>
          </span>
        </div>
      </form>
    )
  }
})

var ItemRow = React.createClass({
  render(){
    return(
      <div className="row">
        <Item/>
        <Item/>
      </div>
    )
  }
})

var Item = React.createClass({
  render(){
    return(
      <div className="item col-sm-6">
        <div className="card card-block">
          <h3 className="card-title">This is a title</h3>
          <p className="card-text">This is some random text to go with the title</p>
          <a href="#" className="btn btn-default btn-primary">A Button</a>
        </div>
      </div>
    )
  }
})
