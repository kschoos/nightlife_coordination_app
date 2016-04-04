$(document).ready(function () {

  ReactDOM.render(React.createElement(Header, null), document.getElementById("header-inner"));
});

var Header = React.createClass({
  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(Title, null),
      React.createElement(SearchBar, null)
    );
  }
});

var Title = React.createClass({
  render() {
    return React.createElement(
      "div",
      { id: "title" },
      React.createElement(
        "h1",
        null,
        "Looking for a place to be tonight?"
      )
    );
  }
});

var SearchBar = React.createClass({
  getInitialState() {
    return {
      textplaceholder: "YES!",
      textHasFocus: false
    };
  },
  textFocus() {
    this.setState({ textplaceholder: "Where are you located?", textHasFocus: true });
  },
  textBlur() {
    setTimeout(function () {
      this.setState(this.getInitialState());
    }.bind(this), 100);
  },
  drawButton() {
    if (this.state.textHasFocus) return React.createElement("input", { type: "submit", value: "Go!", className: "btn btn-default" });
  },
  handleLocationChange(e) {
    this.setState({ location: e.target.value });
  },
  submitForm(e) {
    e.preventDefault();
    var dataobj = { location: this.state.location };
    $.ajax({
      url: "/search",
      method: "post",
      data: dataobj,
      success(data) {
        console.log(data.businesses);
        ReactDOM.render(React.createElement(ItemContainer, { data: data }), document.getElementById("content-inner"));
      }
    });
  },
  render() {
    return React.createElement(
      "div",
      { className: "searchbar" },
      React.createElement(
        "form",
        { onSubmit: this.submitForm },
        React.createElement("input", { onFocus: this.textFocus, onBlur: this.textBlur, onChange: this.handleLocationChange, value: this.state.location, type: "text", id: "location-input", className: "form-control input-lg centered", placeholder: this.state.textplaceholder }),
        this.drawButton()
      )
    );
  }
});

var ItemContainer = React.createClass({
  render() {
    var itemRows = [];
    for (var i = 0; i < this.props.data.businesses.length; i += 2) {
      var businesses = [];
      businesses.push(this.props.data.businesses[i]);
      businesses.push(this.props.data.businesses[i + 1]);
      itemRows.push(React.createElement(ItemRow, { items: businesses }));
    }
    return React.createElement(
      "div",
      { className: "itemContainer" },
      itemRows
    );
  }
});

var ItemRow = React.createClass({
  render() {
    var items = [];
    for (var i = 0; i < this.props.items.length; i++) {
      items.push(React.createElement(Item, { imagelink: this.props.items[i].image_url, name: this.props.items[i].name }));
    }
    return React.createElement(
      "div",
      { className: "row" },
      items
    );
  }
});

var Item = React.createClass({
  render() {
    return React.createElement(
      "div",
      { className: "item col-sm-6 col-xs-12" },
      React.createElement(
        "div",
        { className: "card text-center" },
        React.createElement("img", { className: "card-img-top", src: this.props.imagelink }),
        React.createElement(
          "div",
          { className: "card-block" },
          React.createElement(
            "h3",
            { className: "card-title" },
            this.props.name
          ),
          React.createElement(
            "p",
            { className: "card-text" },
            "This is some random text to go with the title"
          ),
          React.createElement(
            "a",
            { href: "#", className: "btn btn-default btn-primary" },
            "A Button"
          )
        ),
        React.createElement(
          "div",
          { className: "card-footer text-muted" },
          "2 Going"
        )
      )
    );
  }
});