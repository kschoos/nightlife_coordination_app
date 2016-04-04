$(document).ready(function () {

  ReactDOM.render(React.createElement(SearchBar, null), document.getElementById("header"));

  ReactDOM.render(React.createElement(ItemRow, null), document.getElementById("content"));
});

var SearchBar = React.createClass({
  render() {
    return React.createElement(
      "form",
      null,
      React.createElement(
        "div",
        { className: "input-group" },
        React.createElement("input", { type: "text", className: "form-control" }),
        React.createElement(
          "span",
          { className: "input-group-btn" },
          React.createElement("input", { type: "submit", className: "btn btn-default", value: "Search!" })
        )
      )
    );
  }
});

var ItemRow = React.createClass({
  render() {
    return React.createElement(
      "div",
      { className: "row" },
      React.createElement(Item, null),
      React.createElement(Item, null)
    );
  }
});

var Item = React.createClass({
  render() {
    return React.createElement(
      "div",
      { className: "item col-sm-6" },
      React.createElement(
        "div",
        { className: "card card-block" },
        React.createElement(
          "h3",
          { className: "card-title" },
          "This is a title"
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
      )
    );
  }
});