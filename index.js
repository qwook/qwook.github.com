(function() {
  var ele, fakejax, xmlhttp, _i, _len, _ref;

  window.loading = false;

  window.spin = null;

  fakejax = /<!--START-CONTENT-->.*|\n*<!--END-CONTENT-->/g;

  xmlhttp = null;

  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.onreadystatechange = function() {
    var _this = this;
    if (xmlhttp.readyState === 4) {
      return setTimeout(function() {
        var arr;
        document.getElementById("content").innerHTML = "<h1><b>Error</b> loading page.</h1>";
        if (xmlhttp.status === 200) {
          arr = xmlhttp.responseText.match(fakejax);
          document.getElementById("content").innerHTML = arr[0];
        } else if (xmlhttp.status === 404) {
          document.getElementById("content").innerHTML = "<h1><b>404</b> page not found.</h1>";
        }
        document.getElementById("content").style.opacity = "1";
        window.loading = false;
        return window.spin.remove();
      }, 150);
    }
  };

  xmlhttp.ontimeout = function() {
    document.getElementById("content").innerHTML = "<p>Request timed out, I'm sorry :(</p>";
    window.loading = false;
    return window.spin.remove();
  };

  window.onpopstate = function(obj) {
    if (obj.state) {
      document.getElementById("content").style.opacity = "0.5";
      document.getElementById("content").innerHTML = "";
      xmlhttp.open("GET", obj.state.url, true);
      return xmlhttp.send();
    }
  };

  _ref = document.getElementsByClassName('link');
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    ele = _ref[_i];
    ele.onclick = function() {
      var img;
      if (!window.loading) {
        window.spin = document.createElement('div');
        window.spin.setAttribute('class', 'spin');
        img = document.createElement('img');
        img.setAttribute('src', './load.png');
        window.spin.appendChild(img);
        this.appendChild(spin);
        window.loading = true;
        document.getElementById("content").style.opacity = "0.25";
        xmlhttp.open("GET", this.getAttribute("href"), true);
        xmlhttp.send();
        history.pushState({
          url: this.getAttribute("href")
        }, "", this.getAttribute("href"));
      }
      return false;
    };
  }

}).call(this);