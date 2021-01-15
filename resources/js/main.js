var observer = lozad();
observer.observe();

var frameworks = {
    'lodash': ["https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.core.js", '_.VERSION', '_'],
    'jquery': ["", "$.fn.jquery"],
    'underscore': ["https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore.js", "_.VERSION", '_'],
    'ramda': ["https://cdnjs.cloudflare.com/ajax/libs/ramda/0.25.0/ramda.min.js", "", 'R'],
    'moment': ["https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.js", "", 'moment'],
    'math': ["https://cdnjs.cloudflare.com/ajax/libs/mathjs/6.2.2/math.js", "", 'math'],
    'collect': ["https://cdnjs.cloudflare.com/ajax/libs/collect.js/4.16.6/collect.js", "", "collect"]
};
var loaded = [];


function _loadScript(selectedIds) {
    "use strict";

    var i, o = 0,
        pathes = [],
        versionPath = [],
        variablePath = [];
    for (i = 0; i < selectedIds.length; i++) {
        if (!window[selectedIds[i]]) {
            pathes[o] = frameworks[selectedIds[i]][0];
            versionPath[o] = frameworks[selectedIds[i]][1];
            variablePath[o] = frameworks[selectedIds[i]][2];
            o++;
        } else {
            selectedIds[i] = undefined;
        }

    }
    selectedIds = selectedIds.filter(function (el) {
        return el != undefined;
    });
    //            var scripts = new Array();
    var j, script;
    for (j = 0; j < selectedIds.length; j++) {
        var path = pathes[j],
            verPath = versionPath[j],
            varPath = variablePath[j];
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.newVarPath = selectedIds[j];
        script.verPath = verPath;
        script.varPath = varPath;
        var arr = path.split('/');
        var version_ = arr[arr.length - 2];
        if (version_ && !version_.match(/[a-z]/i))
            script.version_ = version_;
        script.startTime = new Date().getMilliseconds();
        script.onload = function (script) {
						var b = "color:#0F669D;font-weight:bold;";
            try {

                console.log('%cVersion:' + eval("window." + this.verPath), b);
            } catch (error) {
                console.warn("failed identifying library's version");
                if (this.version_)
                    console.log("Identified version from URL instead: " + this.version_);
            }
            var success = true;
            try {
                // if the lib offers noConflict
                eval("window[\"" + this.newVarPath + "\"] = " + this.varPath + ".noConflict()");
            } catch (error2) {
                console.warn("failed loading the script strcictly with no conflict");
                try {
                    eval("window[\"" + this.newVarPath + "\"] = " + this.varPath);
                } catch (error3) {
                    success = false;
                    console.error("failed loading the script at all");
                }
            }
            if (success) {
                var endTime = new Date().getMilliseconds();
                console.log(this.newVarPath + '%c script loaded!' + 'in ' + (endTime - this.startTime) + ' ms', b);
                loaded.push(this.newVarPath);
                document.getElementById("loaded_list").innerHTML = JSON.stringify(loaded);
                $.each(loaded,function(index,value){
                  var checkbox="<label><input type='checkbox' value="+value+"@><span class='checkable'>"+value+"</span></label>";
                  if(!$("#frameworksDiff").text().includes(value))
                    $("#frameworksDiff").append($(checkbox));
                })

                // wrapping each function by the console timer:
              try {
                timeIt(eval("window[\"" + this.newVarPath + "\"]"));
              }
              catch (e) {
                /* work in case there is an error */
//                console.error("error wrapping functions by a timer: "+e.message);
              }
            }

        };
        script.src = path;
        document.head.appendChild(script);
    }
}

function custom_loadScript() {
    "use strict";
    var arbLibrary = document.getElementById('arbLibrary').value.replace('.', '_').replace('-', '_');
    var arbURL = document.getElementById('arbURL').value;
    var arbVersion = document.getElementById('arbVersion').value;
    var arbVariable = document.getElementById('arbVariable').value;
    if (frameworks[arbLibrary]) {
        console.log("known version with the initial variable was used instead");
    } else {
        frameworks[arbLibrary] = [arbURL, arbVersion, arbVariable];
    }
    _loadScript([arbLibrary]);

}

function unloadScripts() {
    "use strict";
    var j;
    for (j = 0; j < loaded.length; j++) {
        eval("delete window." + loaded[j]);
    }
    document.getElementById("loaded_list").innerHTML = "";
    console.log('all libraries unloaded from windows context');
}
window.onload = function () {
    "use strict";
    var helloWorld = "font-size:21px; font-weight:200; letter-spacing:0.2em; line-height:1.4em; font-family:helvetica,arial; color:rgba(0,0,25,0.5); background: #222; color: #bada55";
    console.log("%cInteractive Arrays", helloWorld);
    console.log("Think of getting full advantage of Chrome 'console' object https://developers.google.com/web/tools/chrome-devtools/console/api");
    console.dir(console);
    var b = "color:#0F669D;font-weight:bold;";
    var r = "color:#8B0000;font-weight:bold;";
    console.log('%cjquery script loaded! Version:' + $.fn.jquery, b);
    console.log('%cLibraries loaded would be wrapped by a timer if possible! ie: some libraries loaded will be slightly modified!', r);
    //    Sentry.init({
    //        dsn: 'https://b20d3fb31f5247b0b3873400bb4a28cf@sentry.io/1840726'
    //    });

};
$(document).ready(function ($) {
    "use strict";
    $("#Frameworks").hide();
    $("#Frameworks").click(function () {
        var selectedIds = $("#frameworks :checkbox:checked").map(function () {
            return $(this).val();
        }).get();
        _loadScript(selectedIds);
    });

    $("#frameworks :checkbox").click(function () {
        if ($("#frameworks :checkbox:checked").length > 0) {
            $("#Frameworks").show();
        } else {
            $("#Frameworks").hide();
        }
    });
    $("#FrameworksDiff").click(function () {
        var selectedIds = $("#frameworksDiff :checkbox:checked").map(function () {
            return $(this).val();
        }).get();
        selectedIds = selectedIds.map(function(str){
          return str.substring(0, str.length - 1);
        });
        var functions = [];
        selectedIds.map(function(lib, index){
          if(index==0)
            functions.push("<hr><p>"+lib+"</p>");
          else {
            functions.push("<hr><p>"+lib+"</p>");
          }
          functions = functions.concat(Object.getOwnPropertyNames(window[lib]).filter(function (p) {
              return typeof window[lib][p] === 'function';
          }));
        });
        var strObj = functions.join(', ');
        print(checkWords(strObj), undefined, "diffBar");
    });
});

function timeIt(Obj){
  if(!Obj.name){
    return;
  }
  var lib = Obj.name;
  var functions = [],
      strObj;
  if (typeof Obj == 'string') {
      console.log("not a library");
  } else {
      if ((typeof Obj.prototype) == 'object') {
          functions = Object.getOwnPropertyNames(Obj).filter(function (p) {
              return typeof Obj[p] === 'function';
          });
          functions.forEach(function(func){
            var originalFunction = window[lib][func];
            window[lib][func] = function myFunction(a, b, c) { /* #1 */
              /* work before the function is called */
              console.time(func);
              try {
                var returnValue = originalFunction.apply(this, arguments); /* #2 */
                /* work after the function is called */
                console.timeEnd(func);
                return returnValue;
              }
              catch (e) {
                /* work in case there is an error */
                throw e;
              }
            }
            for(var prop in originalFunction) { /* #3 */
              if (originalFunction.hasOwnProperty(prop)) {
                window[lib].myFunction[prop] = originalFunction[prop];
              }
            }
          });
      }
      if ((typeof Obj.prototype) == undefined) {
          console.info("not a library");
      }
  }
}

// <a href="#reduce">reduce</a>
var docURLs = {
    'lodash': 'https://lodash.com/docs/#',
    'underscore': 'https://underscorejs.org/#',
    'ramda': 'https://ramdajs.com/docs/#',
    'jQuery': 'https://api.jquery.com/jQuery.',
    '$': 'https://api.jquery.com/jQuery.'
};

function print(Obj, lib, place) {
    if(!place)
      place = 'loggingBar';
    var functions = [],
        long = false,
        strObj;
    if (typeof Obj == 'string') {
        strObj = Obj;
    } else {
        if ((typeof Obj.prototype) == 'object') {
            console.info('Only logging functions in object');
            functions = Object.getOwnPropertyNames(Obj).filter(function (p) {
                return typeof Obj[p] === 'function';
            });
            strObj = functions.join(', ');
            console.info(strObj);
            long = true;
        }
        if ((typeof Obj.prototype) == undefined) {
            console.info("cannot log object in the web page");
            return;
        }
        for (var o in window) {
            if (window[o] === Obj) {
                lib = o;
            }
        }
        if (lib && functions) {
            var j;
            for (j = 0; j < functions.length; j++) {
                functions[j] = '<a href=' + docURLs[lib] + functions[j] + '>' + functions[j] + '</a>';
            }
            strObj = functions.join(', ');
        }
    }
    var x = document.getElementById(place);
    //check if div exist
    //if not create it and also add a script
    //that scrolls on bottom on every change
    if (long)
        strObj = "<br />" + strObj + "<br />";
    if (x) {
        x.innerHTML += "<br />" + strObj;
        x.style.display = 'block';
    } else {
        var div = document.createElement("pre"),
            css = "display:block;" +
            "position:fixed;" +
            "z-index:99999999;" +
            "padding:5px;" +
            "bottom:15px;" +
            "left:15px;" +
            "right:15px;" +
            "max-height:300px;" +
            "background:#333;" +
            "color:#ddd;" +
            "overflow: auto;" +
            "margin:0;";
        div.id = place;
        div.style.cssText = css;
        div.innerHTML = Obj;
        document.body.appendChild(div);
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML = `var x=document.getElementById(`+place+`);
                        if(window.addEventListener) {
                          x.addEventListener('DOMSubtreeModified', if_changed, false);
                        }
                        function if_changed() {
                          x.scrollTop = x.scrollHeight;
                        }`;
        document.body.appendChild(script);
    }
}

function stringifyObject(e) {
    var obj = {};
    for (var k in e) {
        obj[k] = e[k];
    }
    var str = JSON.stringify(obj, (k, v) => {
        if (v instanceof Node) return 'Node';
        if (v instanceof Window) return 'Window';
        return v;
    }, ' ');
    var x = document.getElementById("loggingBar");
    x.innerHTML = str;
    document.body.appendChild(x);
    return str;
}

function Hide(divID) {
    divID.style.display = "none";
}

function Clear(div) {
  if(div.innerHTML.includes("loggingBar"))
      div.innerHTML = '    <div id="right">\
        <a href="#" onclick="Hide(loggingBar);">[X]</a>...\
        <a href="#" onclick="Clear(loggingBar);">Clear</a>\
    </div>\
    <div id="left">\
        <p>Loggings:</p>\
    </div>';

    if(div.innerHTML.includes("diffBar"))
    div.innerHTML = '    <div id="right">\
      <a href="#" onclick="Hide(diffBar);">[X]</a>...\
      <a href="#" onclick="Clear(diffBar);">Clear</a>\
  </div>\
  <div id="left">\
      <p>Differences between the libraries:</p>\
  </div>';
}


function toggleVisibility(id) {
    var el = document.getElementById(id);

    if (el.style.visibility == "visible") {
        el.style.visibility = "hidden";
    } else {
        el.style.visibility = "visible";
    }
}


// from php.js
function in_array (needle, haystack) {
  for (key in haystack) {
    if (haystack[key] == needle) {
      return true;
    }
  }
  return false;
}

// takes the text of a paragraph element as input
// returns marked up text with repeated words in 'b' tags with a class matching their "stemmed" root
function checkWords(input) {

  var words = input.split(' ');
  var wordcount = {};

  // build an object to count word frequency
  $.each(words,function(i){
    thisWord = String(this).replace(/[\/\\]/,' ').replace(/[^a-z' ]/gi,'').toLowerCase();
    var word = stemmer(thisWord);
    if (wordcount[word] > 0 && word.length) {
      wordcount[word] += 1;
    } else {
      wordcount[word] = 1;
    }
  });

  // convert the object to an object array
  // include only words repeated more than once within the paragraph
  var topwords = new Array();
  $.each(wordcount,function(w,i){
    if (i > 1)
      topwords.push({'word':w,'freq':i});
  });

  // convert the object array to a flat array
  topwordsArr = new Array();
    $.each(topwords,function(i) {
    topwordsArr.push(String(this['word']));
  });

  // re-parse the output, marking up repeated words based on their stems
  var output = '';
  $.each(words,function(w) {
    var aWord = String(this);
    var stripWord = stemmer(aWord.replace(/[\/\\]/,' ').replace(/[^a-z' ]/gi,'').toLowerCase());
    if (in_array(stripWord,topwordsArr))
      output += ' <b class="'+stripWord+'">'+aWord+'</b>';
    else
      output += ' '+aWord;
  });
  return output;
}

(function($){
  // grab common top-level elements
  grafs = $('p,ul,ol,blockquote,h1,h2,h3,h4,h5,h6,pre code',$('#content'));
  // navigate each element found
  $.each(grafs,function(a,g){
    // if it's a paragraph, we'll process it
    if (grafs[a].tagName == "P") {
      $('#work').append($('<p>').html(checkWords($(grafs[a]).text())));
    // if not, we just stick it back into the DOM
    } else {
      $('#work').append(grafs[a]);
    }
  });
  // set up hover listeners on the 'b' elements
  // the class is pulled from the hovered element
  // all similar words are highlighted on hover
  $('b','#work').hover(function(){
    var thisClass = this.className;
    $('.'+thisClass).addClass('highlight');
  },function(){
    $('.highlight').removeClass('highlight');
  });
})(jQuery);
