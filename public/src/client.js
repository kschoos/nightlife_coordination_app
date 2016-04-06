$(document).ready(function(){
  ReactDOM.render(
    <Wrapper lastSearch={ sessionStorage.lastSearch } authed={ authed } />,
    document.getElementById("content-inner")
  );
})

var Wrapper = React.createClass({
  getInitialState(){
    return{
      data: {}
    }
  },
  componentWillMount(){
    this.searchFor(this.props.lastSearch);
  },
  searchFor(location, offset){
    var dataobj = { location: location, offset: offset || 0 };
    this.setState({data: {}, isLoading: true});

    $.ajax({
      url: "/search",
      method: "post",
      data: dataobj,
      success: this.renderSearchItems
    })
    sessionStorage.lastSearch = location;
    sessionStorage.offset = offset || 0;
  },
  renderSearchItems( data ){
    this.setState({data: data, isLoading: false})
  },
  render(){
    return(
      <div>
        <Header isLoading={this.state.isLoading} searchFor={this.searchFor} renderSearchItems = { this.renderSearchItems }/>
        <Body authed={ this.props.authed } data={ this.state.data } searchFor={ this.searchFor }/>
      </div> 
    )
  }
})

var Header = React.createClass({
  render(){
    return(
      <div>
        <Title/>
        <SearchBar searchFor={this.props.searchFor} isLoading={this.props.isLoading} renderSearchItems={ this.props.renderSearchItems }/>
      </div>
    )
  }
})

var Body = React.createClass({
  getBodyContent(){
    if( !$.isEmptyObject( this.props.data)){
      return(
        <div>
          <ItemContainer authed={ this.props.authed } data= { this.props.data }/>
          <Pager total={ this.props.data.total } paginate={ this.props.paginate } searchFor={this.props.searchFor} />
        </div>
      )
    } else {
      return(
        <div/>
      )
    }
  },
  render(){
    return(
      <div>
        {
          this.getBodyContent()
        }
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

var Pager = React.createClass({
  getInitialState(){
    var prevDisabled = sessionStorage.offset == 0 ? "disabled" : "";
    var nextDisabled = this.props.total - sessionStorage.offset < 20  ? "disabled" : "";
    return{
      prevDisabled: prevDisabled,
      nextDisabled: nextDisabled
    }
  },
  next(){
    var offset = sessionStorage.offset || 0;
    offset *= 1;
    offset += 20;
    this.props.searchFor(sessionStorage.lastSearch, offset);
    if(this.props.total - offset < 20){
      this.setState({nextDisabled: "disabled"})
    }
    if(offset > 0) this.setState({prevDisabled: ""});
  },
  prev(){
    var offset = sessionStorage.offset || 0;
    offset *= 1;
    if(offset >= 20){
      offset -= 20;
      this.props.searchFor(sessionStorage.lastSearch, offset);
    } 
    if(offset == 0) this.setState({prevDisabled: "disabled"});
    if(this.props.total - offset >= 20) this.setState({nextDisabled: ""});
  },
  render(){
    console.log(this.props.total);
    return(
      <nav>
        <ul className="pager">
            <li className= { this.state.prevDisabled }><a onClick={ this.prev }>Previous</a></li>
            <li className= { this.state.nextDisabled }><a onClick={ this.next }>Next</a></li>
        </ul>
      </nav>
    )
  }
})

var LoadingScreen = React.createClass({
  render(){
    return(
      <div className="loading-screen">
        <i className= { "fa fa-spinner fa-pulse fa-" + this.props.scale + "x" }/>
      </div>
    )
  }
})

var SearchBar = React.createClass({
  getInitialState(){
    return{
      textplaceholder: "YES!",
      textHasFocus: false,
      offset: 0
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
  drawLoadingScreen(){
    if(this.props.isLoading){
      return( <LoadingScreen scale="3"/> );
    } 
  },
  handleLocationChange(e){
    this.setState({location: e.target.value});
  },
  submitForm(e){
    e.preventDefault();
    this.props.searchFor(this.state.location);
  }, 
  render(){
    return(
      <div className="searchbar">
        <form onSubmit={ this.submitForm }>
          <input onFocus={ this.textFocus } onBlur={ this.textBlur } onChange={ this.handleLocationChange } value={this.state.location} type="text" id="location-input" className="form-control input-lg centered" placeholder={ this.state.textplaceholder  }/>
          { this.drawButton() }
          { this.drawLoadingScreen() }
        </form>
      </div>
    )
  }
})

var ItemContainer = React.createClass({
  render(){
    var items = [];
    for( var i  = 0; i < this.props.data.businesses.length; i++ ){
      items.push(<Item authed={ this.props.authed } key={i} data= { this.props.data.businesses[i] } />);
    }
    return (
      <div className="item-container card-columns">
        { items }
      </div>
    )
  }
})

var Item = React.createClass({
  getInitialState(){
    return{
      going: this.props.data.going,
      isLoading: false
    }
  },
  setGoing(going){
    this.setState({isLoading: false, going: going});
  },
  goHere(){
  var dataobj = {id: this.props.data.id};
  this.setState({isLoading: true})
    $.ajax({
      url: "/registerAt",
      method: "post",
      data: dataobj,
      success: this.setGoing
    }) 
    return false;
  },
  drawFooter(){
    if(this.props.authed){
      if(this.state.isLoading){
        return (
          <LoadingScreen scale="1"/>
        )
      } else {
          return (
            <a onClick={ this.goHere }>
              { this.state.going + " Going" }
            </a>
          )
        }
    } else {
      return (
        <div>
          { this.state.going + " Going" }
        </div>
      )
    } 
  },
  render(){
    return(
        <div className="card text-center">
          <div className="card-header">
            <img className="card-img-top" src={ this.props.data.image_url} alt={ "Photo of the bar '" + this.props.data.name + "'" }/>
            <img src={ this.props.data.rating_img_url } alt={ this.props.data.name + " is rated " + this.props.data.rating + " out of 5!" }/>
          </div>
          <div className="card-block">
            <h3 className="card-title">{ this.props.data.name }</h3>
            <p className="card-text">{ this.props.data.snippet_text }</p>
            <a href= { this.props.data.url } className="btn btn-default btn-primary">More...</a>
          </div>
          <div className="card-footer">
            {
              this.drawFooter()  
            }
          </div>
        </div>
    )
  }
})
