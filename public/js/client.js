$(document).ready(function () {
  ReactDOM.render(React.createElement(Wrapper, { lastSearch: sessionStorage.lastSearch, authed: authed }), document.getElementById("content-inner"));
});

var Wrapper = React.createClass({
  getInitialState() {
    return {
      data: {}
    };
  },
  componentWillMount() {
    if (this.props.lastSearch) this.searchFor(this.props.lastSearch);
  },
  searchFor(location, offset) {
    var dataobj = { location: location, offset: offset || 0 };
    this.setState({ data: {}, isLoading: true });

    $.ajax({
      url: "/search",
      method: "post",
      data: dataobj,
      success: this.renderSearchItems
    });
    sessionStorage.lastSearch = location;
    sessionStorage.offset = offset || 0;
  },
  renderSearchItems(data) {
    this.setState({ data: data, isLoading: false });
  },
  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(Header, { isLoading: this.state.isLoading, total: this.state.data.total, searchFor: this.searchFor, renderSearchItems: this.renderSearchItems }),
      React.createElement(Body, { authed: this.props.authed, data: this.state.data, searchFor: this.searchFor })
    );
  }
});

var Header = React.createClass({
  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(Title, null),
      React.createElement(SearchBar, { searchFor: this.props.searchFor, isLoading: this.props.isLoading, total: this.props.total, renderSearchItems: this.props.renderSearchItems })
    );
  }
});

var Body = React.createClass({
  getBodyContent() {
    if (!$.isEmptyObject(this.props.data) && !this.props.data.total == 0) {
      return React.createElement(
        "div",
        null,
        React.createElement(ItemContainer, { authed: this.props.authed, data: this.props.data }),
        React.createElement(Pager, { total: this.props.data.total, paginate: this.props.paginate, searchFor: this.props.searchFor })
      );
    } else {
      return React.createElement("div", null);
    }
  },
  render() {
    return React.createElement(
      "div",
      null,
      this.getBodyContent()
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

var Pager = React.createClass({
  getInitialState() {
    var prevDisabled = sessionStorage.offset == 0 ? "disabled" : "";
    var nextDisabled = this.props.total - sessionStorage.offset < 18 ? "disabled" : "";
    return {
      prevDisabled: prevDisabled,
      nextDisabled: nextDisabled
    };
  },
  next() {
    var offset = sessionStorage.offset || 0;
    offset *= 1;
    offset += 18;
    this.props.searchFor(sessionStorage.lastSearch, offset);
    if (this.props.total - offset < 18) {
      this.setState({ nextDisabled: "disabled" });
    }
    if (offset > 0) this.setState({ prevDisabled: "" });
  },
  prev() {
    var offset = sessionStorage.offset || 0;
    offset *= 1;
    if (offset >= 18) {
      offset -= 18;
      this.props.searchFor(sessionStorage.lastSearch, offset);
    }
    if (offset == 0) this.setState({ prevDisabled: "disabled" });
    if (this.props.total - offset >= 18) this.setState({ nextDisabled: "" });
  },
  render() {
    return React.createElement(
      "nav",
      null,
      React.createElement(
        "ul",
        { className: "pager" },
        React.createElement(
          "li",
          { className: this.state.prevDisabled },
          React.createElement(
            "a",
            { href: "#", onClick: this.prev },
            "Previous"
          )
        ),
        React.createElement(
          "li",
          { className: this.state.nextDisabled },
          React.createElement(
            "a",
            { href: "#", onClick: this.next },
            "Next"
          )
        )
      )
    );
  }
});

var LoadingScreen = React.createClass({
  render() {
    return React.createElement(
      "div",
      { className: "loading-screen" },
      React.createElement("i", { className: "fa fa-spinner fa-pulse fa-" + this.props.scale + "x" })
    );
  }
});

var Results = React.createClass({
  render() {
    if (this.props.total > 0) return React.createElement(
      "div",
      { className: "results" },
      React.createElement(
        "h2",
        null,
        this.props.total + " Results"
      )
    );else return React.createElement(
      "div",
      { className: "results" },
      React.createElement(
        "h2",
        null,
        "0 Results"
      ),
      React.createElement(
        "h4",
        null,
        "Sorry"
      ),
      React.createElement("i", { className: "fa fa-meh-o fa-3x" })
    );
  }
});

var SearchBar = React.createClass({
  getInitialState() {
    return {
      textplaceholder: "YES!",
      textHasFocus: false,
      offset: 0
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
  drawLoadingScreen() {
    if (this.props.isLoading) {
      return React.createElement(LoadingScreen, { scale: "3" });
    }
  },
  drawResults() {
    if (this.props.total != undefined) {
      return React.createElement(Results, { total: this.props.total });
    }
  },
  handleLocationChange(e) {
    this.setState({ location: e.target.value });
  },
  submitForm(e) {
    e.preventDefault();
    this.props.searchFor(this.state.location);
  },
  render() {
    return React.createElement(
      "div",
      { className: "searchbar" },
      React.createElement(
        "form",
        { onSubmit: this.submitForm },
        React.createElement("input", { onFocus: this.textFocus, onBlur: this.textBlur, onChange: this.handleLocationChange, value: this.state.location, type: "text", id: "location-input", className: "form-control input-lg centered", placeholder: this.state.textplaceholder }),
        this.drawButton(),
        this.drawResults(),
        this.drawLoadingScreen()
      )
    );
  }
});

var ItemContainer = React.createClass({
  render() {
    var items = [];
    for (var i = 0; i < this.props.data.businesses.length; i++) {
      items.push(React.createElement(Item, { authed: this.props.authed, key: i, data: this.props.data.businesses[i] }));
    }
    return React.createElement(
      "div",
      { className: "item-container card-columns" },
      items
    );
  }
});

var Item = React.createClass({
  getInitialState() {
    return {
      going: this.props.data.going,
      isLoading: false
    };
  },
  setGoing(going) {
    this.setState({ isLoading: false, going: going });
  },
  goHere() {
    var dataobj = { id: this.props.data.id };
    this.setState({ isLoading: true });
    $.ajax({
      url: "/registerAt",
      method: "post",
      data: dataobj,
      success: this.setGoing
    });
    return false;
  },
  drawFooter() {
    if (this.props.authed) {
      if (this.state.isLoading) {
        return React.createElement(LoadingScreen, { scale: "1" });
      } else {
        return React.createElement(
          "a",
          { onClick: this.goHere },
          this.state.going + " Going"
        );
      }
    } else {
      return React.createElement(
        "div",
        null,
        this.state.going + " Going"
      );
    }
  },
  render() {
    return React.createElement(
      "div",
      { className: "card text-center" },
      React.createElement(
        "div",
        { className: "card-header" },
        React.createElement("img", { className: "card-img-top", src: this.props.data.image_url, alt: "Photo of the bar '" + this.props.data.name + "'" }),
        React.createElement("img", { src: this.props.data.rating_img_url, alt: this.props.data.name + " is rated " + this.props.data.rating + " out of 5!" })
      ),
      React.createElement(
        "div",
        { className: "card-block" },
        React.createElement(
          "h3",
          { className: "card-title" },
          this.props.data.name
        ),
        React.createElement(
          "p",
          { className: "card-text" },
          this.props.data.snippet_text
        ),
        React.createElement(
          "a",
          { href: this.props.data.url, className: "btn btn-default btn-primary" },
          "More..."
        )
      ),
      React.createElement(
        "div",
        { className: "card-footer" },
        this.drawFooter()
      )
    );
  }
});