(function() {
  var fakejax, loading, spin, xmlhttp;

  loading = false;

  spin = null;

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
          window.loadlinks();
        } else if (xmlhttp.status === 404) {
          document.getElementById("content").innerHTML = "<h1><b>404</b> page not found.</h1>";
        }
        document.getElementById("content").style.opacity = "1";
        window.scrollTo(window.scrollX || 0, 0);
        loading = false;
        if (spin !== null && spin.parentNode !== null) {
          return spin.parentNode.removeChild(spin);
        }
      }, 150);
    }
  };

  xmlhttp.ontimeout = function() {
    document.getElementById("content").innerHTML = "<p>Request timed out, I'm sorry :(</p>";
    loading = false;
    if (spin !== null && spin.parentNode !== null) {
      return spin.parentNode.removeChild(spin);
    }
  };

  window.onpopstate = function(obj) {
    if (obj.state) {
      document.getElementById("content").style.opacity = "0.5";
      document.getElementById("content").innerHTML = "";
      xmlhttp.open("GET", obj.state.url, true);
      return xmlhttp.send();
    }
  };

  window.loadlinks = function() {
    var ele, _i, _len, _ref, _results;
    _ref = document.getElementsByClassName('link');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ele = _ref[_i];
      _results.push(ele.onclick = function() {
        var img;
        if (!loading) {
          spin = document.createElement('div');
          spin.setAttribute('class', 'spin');
          img = document.createElement('img');
          img.setAttribute('src', './load.png');
          spin.appendChild(img);
          this.appendChild(spin);
          loading = true;
          document.getElementById("content").style.opacity = "0.25";
          xmlhttp.open("GET", this.getAttribute("href"), true);
          xmlhttp.send();
          history.pushState({
            url: this.getAttribute("href")
          }, "", this.getAttribute("href"));
        }
        return false;
      });
    }
    return _results;
  };

  window.loadlinks();

}).call(this);
