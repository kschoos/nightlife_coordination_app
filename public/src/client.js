$(document).ready(function(){

  ReactDOM.render(
    <Header/>,
    document.getElementById("header-inner")
  );

})

var Header = React.createClass({
  render(){
    return(
      <div>
        <Title/>
        <SearchBar/>
      </div>
    )
  }
})

var Title = React.createClass({
  render(){
    return(
      <div id="title">
        <h1>Looking for a place to be tonight?</h1>
      </div>
    )
  }
})

var SearchBar = React.createClass({
  getInitialState(){
    return{
      textplaceholder: "YES!",
      textHasFocus: false
    }
  },
  textFocus(){
    this.setState({textplaceholder: "Where are you located?", textHasFocus: true});
  },
  textBlur(){
    setTimeout(function(){
      this.setState(this.getInitialState());
    }.bind(this), 100 );
  },
  drawButton(){
    if(this.state.textHasFocus)
      return(
        <input type="submit" value="Go!" className="btn btn-default"/>
      )
  },
  handleLocationChange(e){
    this.setState({location: e.target.value});
  },
  submitForm(e){
    e.preventDefault();
    var dataobj = { location: this.state.location};
    $.ajax({
      url: "/search",
      method: "post",
      data: dataobj,
      success(data){
        console.log(data.businesses);
        ReactDOM.render(
          <ItemContainer data= { data } />,
          document.getElementById("content-inner")
        );
      }
    })
  }, 
  render(){
    return(
      <div className="searchbar">
        <form onSubmit={ this.submitForm }>
          <input onFocus={ this.textFocus } onBlur={ this.textBlur } onChange={ this.handleLocationChange } value={this.state.location} type="text" id="location-input" className="form-control input-lg centered" placeholder={ this.state.textplaceholder  }/>
          { this.drawButton() }
        </form>
      </div>
    )
  }
})

var ItemContainer = React.createClass({
  render(){
    var itemRows = [];
    for( var i  = 0; i < this.props.data.businesses.length; i+=2 ){
      var businesses = [];
      businesses.push(this.props.data.businesses[i]);
      businesses.push(this.props.data.businesses[i+1]);
      itemRows.push(<ItemRow items= { businesses } />);
    }
    return (
      <div className="itemContainer">
        { itemRows }
      </div>
    )
  }
})

var ItemRow = React.createClass({
  render(){
    var items = [];
    for (var i = 0; i < this.props.items.length; i++){
      items.push(<Item imagelink={ this.props.items[i].image_url} name={ this.props.items[i].name }/>);
    }
    return(
      <div className="row">
        { items }
      </div>
    )
  }
})

var Item = React.createClass({
  render(){
    return(
      <div className="item col-sm-6 col-xs-12">
        <div className="card text-center">
          <img className="card-img-top" src={ this.props.imagelink }/>
          <div className="card-block">
            <h3 className="card-title">{ this.props.name }</h3>
            <p className="card-text">This is some random text to go with the title</p>
            <a href="#" className="btn btn-default btn-primary">A Button</a>
          </div>
          <div className="card-footer text-muted">
            2 Going
          </div>
        </div>
      </div>
    )
  }
})
