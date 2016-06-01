/**
 * algorithm-visualizer - Algorithm Visualizer
 * @version v0.1.0
 * @author Jason Park & contributors
 * @link https://github.com/parkjs814/AlgorithmVisualizer#readme
 * @license MIT
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _$ = $;
var extend = _$.extend;


var cache = {
  lastFileUsed: '',
  files: {}
};

var assertFileName = function assertFileName(name) {
  if (!name) {
    throw 'Missing file name';
  }
};

/**
 * Global application cache
 */
module.exports = {
  getCachedFile: function getCachedFile(name) {
    assertFileName(name);
    return cache.files[name];
  },
  updateCachedFile: function updateCachedFile(name, updates) {
    assertFileName(name);
    if (!cache.files[name]) {
      cache.files[name] = {};
    }
    extend(cache.files[name], updates);
  },
  getLastFileUsed: function getLastFileUsed() {
    return cache.lastFileUsed;
  },
  setLastFileUsed: function setLastFileUsed(file) {
    cache.lastFileUsed = file;
  }
};

},{}],2:[function(require,module,exports){
'use strict';

var Editor = require('../editor');
var TracerManager = require('../tracer_manager');
var DOM = require('../dom/setup');

var _require = require('../dom/loading_slider');

var showLoadingSlider = _require.showLoadingSlider;
var hideLoadingSlider = _require.hideLoadingSlider;

var _require2 = require('../utils');

var getFileDir = _require2.getFileDir;


var Cache = require('./cache');

var state = {
  isLoading: null,
  editor: null,
  tracerManager: null,
  categories: null,
  loadedScratch: null
};

var initState = function initState(tracerManager) {
  state.isLoading = false;
  state.editor = new Editor(tracerManager);
  state.tracerManager = tracerManager;
  state.categories = {};
  state.loadedScratch = null;
};

/**
 * Global application singleton.
 */
var App = function App() {

  this.getIsLoading = function () {
    return state.isLoading;
  };

  this.setIsLoading = function (loading) {
    state.isLoading = loading;
    if (loading) {
      showLoadingSlider();
    } else {
      hideLoadingSlider();
    }
  };

  this.getEditor = function () {
    return state.editor;
  };

  this.getCategories = function () {
    return state.categories;
  };

  this.getCategory = function (name) {
    return state.categories[name];
  };

  this.setCategories = function (categories) {
    state.categories = categories;
  };

  this.updateCategory = function (name, updates) {
    $.extend(state.categories[name], updates);
  };

  this.getTracerManager = function () {
    return state.tracerManager;
  };

  this.getLoadedScratch = function () {
    return state.loadedScratch;
  };

  this.setLoadedScratch = function (loadedScratch) {
    state.loadedScratch = loadedScratch;
  };

  var tracerManager = TracerManager.init();

  initState(tracerManager);
  DOM.setup(tracerManager);
};

App.prototype = Cache;

module.exports = App;

},{"../dom/loading_slider":7,"../dom/setup":8,"../editor":26,"../tracer_manager":59,"../utils":65,"./cache":1}],3:[function(require,module,exports){
'use strict';

/**
 * This is the main application instance.
 * Gets populated on page load. 
 */

module.exports = {};

},{}],4:[function(require,module,exports){
'use strict';

var app = require('../app');
var Server = require('../server');
var showAlgorithm = require('./show_algorithm');

var _$ = $;
var each = _$.each;


var addAlgorithmToCategoryDOM = function addAlgorithmToCategoryDOM(category, subList, algorithm) {
  var $algorithm = $('<button class="indent collapse">').append(subList[algorithm]).attr('data-algorithm', algorithm).attr('data-category', category).click(function () {
    Server.loadAlgorithm(category, algorithm).then(function (data) {
      showAlgorithm(category, algorithm, data);
    });
  });

  $('#list').append($algorithm);
};

var addCategoryToDOM = function addCategoryToDOM(category) {
  var _app$getCategory = app.getCategory(category);

  var categoryName = _app$getCategory.name;
  var categorySubList = _app$getCategory.list;


  var $category = $('<button class="category">').append('<i class="fa fa-fw fa-caret-right">').append(categoryName).attr('data-category', category);

  $category.click(function () {
    $('.indent[data-category="' + category + '"]').toggleClass('collapse');
    $(this).find('i.fa').toggleClass('fa-caret-right fa-caret-down');
  });

  $('#list').append($category);

  each(categorySubList, function (algorithm) {
    addAlgorithmToCategoryDOM(category, categorySubList, algorithm);
  });
};

module.exports = function () {
  each(app.getCategories(), addCategoryToDOM);
};

},{"../app":3,"../server":53,"./show_algorithm":19}],5:[function(require,module,exports){
'use strict';

var Server = require('../server');

var _$ = $;
var each = _$.each;


var addFileToDOM = function addFileToDOM(category, algorithm, file, explanation) {
  var $file = $('<button>').append(file).attr('data-file', file).click(function () {
    Server.loadFile(category, algorithm, file, explanation);
    $('.files_bar > .wrapper > button').removeClass('active');
    $(this).addClass('active');
  });
  $('.files_bar > .wrapper').append($file);
  return $file;
};

module.exports = function (category, algorithm, files, requestedFile) {
  $('.files_bar > .wrapper').empty();

  each(files, function (file, explanation) {
    var $file = addFileToDOM(category, algorithm, file, explanation);
    if (requestedFile && requestedFile == file) $file.click();
  });

  if (!requestedFile) $('.files_bar > .wrapper > button').first().click();
  $('.files_bar > .wrapper').scroll();
};

},{"../server":53}],6:[function(require,module,exports){
'use strict';

var showAlgorithm = require('./show_algorithm');
var addCategories = require('./add_categories');
var showDescription = require('./show_description');
var addFiles = require('./add_files');
var showFirstAlgorithm = require('./show_first_algorithm');
var showRequestedAlgorithm = require('./show_requested_algorithm');

module.exports = {
  showAlgorithm: showAlgorithm,
  addCategories: addCategories,
  showDescription: showDescription,
  addFiles: addFiles,
  showFirstAlgorithm: showFirstAlgorithm,
  showRequestedAlgorithm: showRequestedAlgorithm
};

},{"./add_categories":4,"./add_files":5,"./show_algorithm":19,"./show_description":20,"./show_first_algorithm":21,"./show_requested_algorithm":22}],7:[function(require,module,exports){
'use strict';

var showLoadingSlider = function showLoadingSlider() {
  $('#loading-slider').removeClass('loaded');
};

var hideLoadingSlider = function hideLoadingSlider() {
  $('#loading-slider').addClass('loaded');
};

module.exports = {
  showLoadingSlider: showLoadingSlider,
  hideLoadingSlider: hideLoadingSlider
};

},{}],8:[function(require,module,exports){
'use strict';

var setupDividers = require('./setup_dividers');
var setupDocument = require('./setup_document');
var setupFilesBar = require('./setup_files_bar');
var setupInterval = require('./setup_interval');
var setupModuleContainer = require('./setup_module_container');
var setupPoweredBy = require('./setup_powered_by');
var setupScratchPaper = require('./setup_scratch_paper');
var setupSideMenu = require('./setup_side_menu');
var setupTopMenu = require('./setup_top_menu');
var setupWindow = require('./setup_window');

/**
 * Initializes elements once the app loads in the DOM. 
 */
var setup = function setup() {

  $('.btn input').click(function (e) {
    e.stopPropagation();
  });

  // dividers
  setupDividers();

  // document
  setupDocument();

  // files bar
  setupFilesBar();

  // interval
  setupInterval();

  // module container
  setupModuleContainer();

  // powered by
  setupPoweredBy();

  // scratch paper
  setupScratchPaper();

  // side menu
  setupSideMenu();

  // top menu
  setupTopMenu();

  // window
  setupWindow();
};

module.exports = {
  setup: setup
};

},{"./setup_dividers":9,"./setup_document":10,"./setup_files_bar":11,"./setup_interval":12,"./setup_module_container":13,"./setup_powered_by":14,"./setup_scratch_paper":15,"./setup_side_menu":16,"./setup_top_menu":17,"./setup_window":18}],9:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var app = require('../../app');

var addDividerToDom = function addDividerToDom(divider) {
  var _divider = _slicedToArray(divider, 3);

  var vertical = _divider[0];
  var $first = _divider[1];
  var $second = _divider[2];

  var $parent = $first.parent();
  var thickness = 5;

  var $divider = $('<div class="divider">');

  var dragging = false;
  if (vertical) {
    (function () {
      $divider.addClass('vertical');

      var _left = -thickness / 2;
      $divider.css({
        top: 0,
        bottom: 0,
        left: _left,
        width: thickness
      });

      var x = void 0;
      $divider.mousedown(function (_ref) {
        var pageX = _ref.pageX;

        x = pageX;
        dragging = true;
      });

      $(document).mousemove(function (_ref2) {
        var pageX = _ref2.pageX;

        if (dragging) {
          var new_left = $second.position().left + pageX - x;
          var percent = new_left / $parent.width() * 100;
          percent = Math.min(90, Math.max(10, percent));
          $first.css('right', 100 - percent + '%');
          $second.css('left', percent + '%');
          x = pageX;
          app.getTracerManager().resize();
          $('.files_bar > .wrapper').scroll();
        }
      });

      $(document).mouseup(function (e) {
        dragging = false;
      });
    })();
  } else {
    (function () {

      $divider.addClass('horizontal');
      var _top = -thickness / 2;
      $divider.css({
        top: _top,
        height: thickness,
        left: 0,
        right: 0
      });

      var y = void 0;
      $divider.mousedown(function (_ref3) {
        var pageY = _ref3.pageY;

        y = pageY;
        dragging = true;
      });

      $(document).mousemove(function (_ref4) {
        var pageY = _ref4.pageY;

        if (dragging) {
          var new_top = $second.position().top + pageY - y;
          var percent = new_top / $parent.height() * 100;
          percent = Math.min(90, Math.max(10, percent));
          $first.css('bottom', 100 - percent + '%');
          $second.css('top', percent + '%');
          y = pageY;
          app.getTracerManager().resize();
        }
      });

      $(document).mouseup(function (e) {
        dragging = false;
      });
    })();
  }

  $second.append($divider);
};

module.exports = function () {
  var dividers = [['v', $('.sidemenu'), $('.workspace')], ['v', $('.viewer_container'), $('.editor_container')], ['h', $('.data_container'), $('.code_container')]];
  for (var i = 0; i < dividers.length; i++) {
    addDividerToDom(dividers[i]);
  }
};

},{"../../app":3}],10:[function(require,module,exports){
'use strict';

var app = require('../../app');

module.exports = function () {
  $(document).on('click', 'a', function (e) {
    console.log(e);
    e.preventDefault();
    if (!window.open($(this).attr('href'), '_blank')) {
      alert('Please allow popups for this site');
    }
  });

  $(document).mouseup(function (e) {
    app.getTracerManager().command('mouseup', e);
  });
};

},{"../../app":3}],11:[function(require,module,exports){
'use strict';

var definitelyBigger = function definitelyBigger(x, y) {
  return x > y + 2;
};

module.exports = function () {

  $('.files_bar > .btn-left').click(function () {
    var $wrapper = $('.files_bar > .wrapper');
    var clipWidth = $wrapper.width();
    var scrollLeft = $wrapper.scrollLeft();

    $($wrapper.children('button').get().reverse()).each(function () {
      var left = $(this).position().left;
      var right = left + $(this).outerWidth();
      if (0 > left) {
        $wrapper.scrollLeft(scrollLeft + right - clipWidth);
        return false;
      }
    });
  });

  $('.files_bar > .btn-right').click(function () {
    var $wrapper = $('.files_bar > .wrapper');
    var clipWidth = $wrapper.width();
    var scrollLeft = $wrapper.scrollLeft();

    $wrapper.children('button').each(function () {
      var left = $(this).position().left;
      var right = left + $(this).outerWidth();
      if (clipWidth < right) {
        $wrapper.scrollLeft(scrollLeft + left);
        return false;
      }
    });
  });

  $('.files_bar > .wrapper').scroll(function () {

    var $wrapper = $('.files_bar > .wrapper');
    var clipWidth = $wrapper.width();
    var $left = $wrapper.children('button:first-child');
    var $right = $wrapper.children('button:last-child');
    var left = $left.position().left;
    var right = $right.position().left + $right.outerWidth();

    if (definitelyBigger(0, left) && definitelyBigger(clipWidth, right)) {
      var scrollLeft = $wrapper.scrollLeft();
      $wrapper.scrollLeft(scrollLeft + clipWidth - right);
      return;
    }

    var lefter = definitelyBigger(0, left);
    var righter = definitelyBigger(right, clipWidth);
    $wrapper.toggleClass('shadow-left', lefter);
    $wrapper.toggleClass('shadow-right', righter);
    $('.files_bar > .btn-left').attr('disabled', !lefter);
    $('.files_bar > .btn-right').attr('disabled', !righter);
  });
};

},{}],12:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var app = require('../../app');
var Toast = require('../toast');

var parseFloat = Number.parseFloat;


var minInterval = 0.1;
var maxInterval = 10;
var startInterval = 0.5;
var stepInterval = 0.1;

var normalize = function normalize(sec) {

  var interval = void 0;
  var message = void 0;
  if (sec < minInterval) {
    interval = minInterval;
    message = 'Interval of ' + sec + ' seconds is too low. Setting to min allowed interval of ' + minInterval + ' second(s).';
  } else if (sec > maxInterval) {
    interval = maxInterval;
    message = 'Interval of ' + sec + ' seconds is too high. Setting to max allowed interval of ' + maxInterval + ' second(s).';
  } else {
    interval = sec;
    message = 'Interval has been set to ' + sec + ' second(s).';
  }

  return [interval, message];
};

module.exports = function () {

  var $interval = $('#interval');
  $interval.val(startInterval);
  $interval.attr({
    max: maxInterval,
    min: minInterval,
    step: stepInterval
  });

  $('#interval').on('change', function () {
    var tracerManager = app.getTracerManager();

    var _normalize = normalize(parseFloat($(this).val()));

    var _normalize2 = _slicedToArray(_normalize, 2);

    var seconds = _normalize2[0];
    var message = _normalize2[1];


    $(this).val(seconds);
    tracerManager.interval = seconds * 1000;
    Toast.showInfoToast(message);
  });
};

},{"../../app":3,"../toast":23}],13:[function(require,module,exports){
'use strict';

var app = require('../../app');

module.exports = function () {

  var $module_container = $('.module_container');

  $module_container.on('mousedown', '.module_wrapper', function (e) {
    app.getTracerManager().findOwner(this).mousedown(e);
  });

  $module_container.on('mousemove', '.module_wrapper', function (e) {
    app.getTracerManager().findOwner(this).mousemove(e);
  });

  $module_container.on('DOMMouseScroll mousewheel', '.module_wrapper', function (e) {
    app.getTracerManager().findOwner(this).mousewheel(e);
  });
};

},{"../../app":3}],14:[function(require,module,exports){
'use strict';

module.exports = function () {
  $('#powered-by').click(function () {
    $('#powered-by-list button').toggleClass('collapse');
  });
};

},{}],15:[function(require,module,exports){
'use strict';

var app = require('../../app');
var Server = require('../../server');
var showAlgorithm = require('../show_algorithm');

module.exports = function () {
  $('#scratch-paper').click(function () {
    var category = 'scratch';
    var algorithm = app.getLoadedScratch();
    Server.loadAlgorithm(category, algorithm).then(function (data) {
      showAlgorithm(category, algorithm, data);
    });
  });
};

},{"../../app":3,"../../server":53,"../show_algorithm":19}],16:[function(require,module,exports){
'use strict';

var app = require('../../app');

var sidemenu_percent = void 0;

module.exports = function () {
  $('#navigation').click(function () {
    var $sidemenu = $('.sidemenu');
    var $workspace = $('.workspace');

    $sidemenu.toggleClass('active');
    $('.nav-dropdown').toggleClass('fa-caret-down fa-caret-up');

    if ($sidemenu.hasClass('active')) {
      $sidemenu.css('right', 100 - sidemenu_percent + '%');
      $workspace.css('left', sidemenu_percent + '%');
    } else {
      sidemenu_percent = $workspace.position().left / $('body').width() * 100;
      $sidemenu.css('right', 0);
      $workspace.css('left', 0);
    }

    app.getTracerManager().resize();
  });
};

},{"../../app":3}],17:[function(require,module,exports){
'use strict';

var app = require('../../app');
var Server = require('../../server');
var Toast = require('../toast');

module.exports = function () {

  // shared
  $('#shared').mouseup(function () {
    $(this).select();
  });

  $('#btn_share').click(function () {

    var $icon = $(this).find('.fa-share');
    $icon.addClass('fa-spin fa-spin-faster');

    Server.shareScratchPaper().then(function (url) {
      $icon.removeClass('fa-spin fa-spin-faster');
      $('#shared').removeClass('collapse');
      $('#shared').val(url);
      Toast.showInfoToast('Shareable link is created.');
    });
  });

  // control

  $('#btn_run').click(function () {
    $('#btn_trace').click();
    var err = app.getEditor().execute();
    if (err) {
      console.error(err);
      Toast.showErrorToast(err);
    }
  });
  $('#btn_pause').click(function () {
    if (app.getTracerManager().isPause()) {
      app.getTracerManager().resumeStep();
    } else {
      app.getTracerManager().pauseStep();
    }
  });
  $('#btn_prev').click(function () {
    app.getTracerManager().pauseStep();
    app.getTracerManager().prevStep();
  });
  $('#btn_next').click(function () {
    app.getTracerManager().pauseStep();
    app.getTracerManager().nextStep();
  });

  // description & trace

  $('#btn_desc').click(function () {
    $('.tab_container > .tab').removeClass('active');
    $('#tab_desc').addClass('active');
    $('.tab_bar > button').removeClass('active');
    $(this).addClass('active');
  });

  $('#btn_trace').click(function () {
    $('.tab_container > .tab').removeClass('active');
    $('#tab_module').addClass('active');
    $('.tab_bar > button').removeClass('active');
    $(this).addClass('active');
  });
};

},{"../../app":3,"../../server":53,"../toast":23}],18:[function(require,module,exports){
'use strict';

var app = require('../../app');

module.exports = function () {
  $(window).resize(function () {
    app.getTracerManager().resize();
  });
};

},{"../../app":3}],19:[function(require,module,exports){
'use strict';

var app = require('../app');

var _require = require('../utils');

var isScratchPaper = _require.isScratchPaper;


var showDescription = require('./show_description');
var addFiles = require('./add_files');

module.exports = function (category, algorithm, data, requestedFile) {
  var $menu = void 0;
  var category_name = void 0;
  var algorithm_name = void 0;

  if (isScratchPaper(category)) {
    $menu = $('#scratch-paper');
    category_name = 'Scratch Paper';
    algorithm_name = algorithm ? 'Shared' : 'Temporary';
  } else {
    $menu = $('[data-category="' + category + '"][data-algorithm="' + algorithm + '"]');
    var categoryObj = app.getCategory(category);
    category_name = categoryObj.name;
    algorithm_name = categoryObj.list[algorithm];
  }

  $('.sidemenu button').removeClass('active');
  $menu.addClass('active');

  $('#category').html(category_name);
  $('#algorithm').html(algorithm_name);
  $('#tab_desc > .wrapper').empty();
  $('.files_bar > .wrapper').empty();
  $('#explanation').html('');

  app.setLastFileUsed(null);
  app.getEditor().clearContent();

  var files = data.files;


  delete data.files;

  showDescription(data);
  addFiles(category, algorithm, files, requestedFile);
};

},{"../app":3,"../utils":65,"./add_files":5,"./show_description":20}],20:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var isArray = Array.isArray;
var _$ = $;
var each = _$.each;


module.exports = function (data) {
  var $container = $('#tab_desc > .wrapper');
  $container.empty();

  each(data, function (key, value) {

    if (key) {
      $container.append($('<h3>').html(key));
    }

    if (typeof value === 'string') {
      $container.append($('<p>').html(value));
    } else if (isArray(value)) {
      (function () {

        var $ul = $('<ul>');
        $container.append($ul);

        value.forEach(function (li) {
          $ul.append($('<li>').html(li));
        });
      })();
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      (function () {

        var $ul = $('<ul>');
        $container.append($ul);

        each(value, function (prop) {
          $ul.append($('<li>').append($('<strong>').html(prop)).append(' ' + value[prop]));
        });
      })();
    }
  });
};

},{}],21:[function(require,module,exports){
'use strict';

// click the first algorithm in the first category

module.exports = function () {
  $('#list button.category').first().click();
  $('#list button.category + .indent').first().click();
};

},{}],22:[function(require,module,exports){
'use strict';

var Server = require('../server');
var showAlgorithm = require('./show_algorithm');

module.exports = function (category, algorithm, file) {
  $('.category[data-category="' + category + '"]').click();
  Server.loadAlgorithm(category, algorithm).then(function (data) {
    showAlgorithm(category, algorithm, data, file);
  });
};

},{"../server":53,"./show_algorithm":19}],23:[function(require,module,exports){
'use strict';

var showToast = function showToast(data, type) {
  var $toast = $('<div class="toast ' + type + '">').append(data);

  $('.toast_container').append($toast);
  setTimeout(function () {
    $toast.fadeOut(function () {
      $toast.remove();
    });
  }, 3000);
};

var showErrorToast = function showErrorToast(err) {
  showToast(err, 'error');
};

var showInfoToast = function showInfoToast(err) {
  showToast(err, 'info');
};

module.exports = {
  showErrorToast: showErrorToast,
  showInfoToast: showInfoToast
};

},{}],24:[function(require,module,exports){
'use strict';

module.exports = function (id) {
  var editor = ace.edit(id);

  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
  });

  editor.setTheme('ace/theme/tomorrow_night_eighties');
  editor.session.setMode('ace/mode/javascript');
  editor.$blockScrolling = Infinity;

  return editor;
};

},{}],25:[function(require,module,exports){
'use strict';

var execute = function execute(tracerManager, code) {
  // all modules available to eval are obtained from window
  try {
    tracerManager.deallocateAll();
    eval(code);
    tracerManager.visualize();
  } catch (err) {
    return err;
  } finally {
    tracerManager.removeUnallocated();
  }
};

var executeData = function executeData(tracerManager, algoData) {
  return execute(tracerManager, algoData);
};

var executeDataAndCode = function executeDataAndCode(tracerManager, algoData, algoCode) {
  return execute(tracerManager, algoData + ';' + algoCode);
};

module.exports = {
  executeData: executeData,
  executeDataAndCode: executeDataAndCode
};

},{}],26:[function(require,module,exports){
'use strict';

var app = require('../app');
var createEditor = require('./create');
var Executor = require('./executor');

function Editor(tracerManager) {
  var _this = this;

  if (!tracerManager) {
    throw 'Cannot create Editor. Missing the tracerManager';
  }

  ace.require('ace/ext/language_tools');

  this.dataEditor = createEditor('data');
  this.codeEditor = createEditor('code');

  // Setting data

  this.setData = function (data) {
    _this.dataEditor.setValue(data, -1);
  };

  this.setCode = function (code) {
    _this.codeEditor.setValue(code, -1);
  };

  this.setContent = function (_ref) {
    var data = _ref.data;
    var code = _ref.code;

    _this.setData(data);
    _this.setCode(code);
  };

  // Clearing data

  this.clearData = function () {
    _this.dataEditor.setValue('');
  };

  this.clearCode = function () {
    _this.codeEditor.setValue('');
  };

  this.clearContent = function () {
    _this.clearData();
    _this.clearCode();
  };

  this.execute = function () {
    var data = _this.dataEditor.getValue();
    var code = _this.codeEditor.getValue();
    return Executor.executeDataAndCode(tracerManager, data, code);
  };

  // listeners

  this.dataEditor.on('change', function () {
    var data = _this.dataEditor.getValue();
    var lastFileUsed = app.getLastFileUsed();
    if (lastFileUsed) {
      app.updateCachedFile(lastFileUsed, {
        data: data
      });
    }
    Executor.executeData(tracerManager, data);
  });

  this.codeEditor.on('change', function () {
    var code = _this.codeEditor.getValue();
    var lastFileUsed = app.getLastFileUsed();
    if (lastFileUsed) {
      app.updateCachedFile(lastFileUsed, {
        code: code
      });
    }
  });
};

module.exports = Editor;

},{"../app":3,"./create":24,"./executor":25}],27:[function(require,module,exports){
'use strict';

var RSVP = require('rsvp');
var app = require('./app');
var AppConstructor = require('./app/constructor');
var DOM = require('./dom');
var Server = require('./server');

var modules = require('./module');

var _$ = $;
var extend = _$.extend;


$.ajaxSetup({
  cache: false,
  dataType: 'text'
});

var _require = require('./utils');

var isScratchPaper = _require.isScratchPaper;

var _require2 = require('./server/helpers');

var getPath = _require2.getPath;

// set global promise error handler

RSVP.on('error', function (reason) {
  console.assert(false, reason);
});

$(function () {

  // initialize the application and attach in to the instance module
  var appConstructor = new AppConstructor();
  extend(true, app, appConstructor);

  // load modules to the global scope so they can be evaled
  extend(true, window, modules);

  Server.loadCategories().then(function (data) {
    app.setCategories(data);
    DOM.addCategories();

    // determine if the app is loading a pre-existing scratch-pad
    // or the home page

    var _getPath = getPath();

    var category = _getPath.category;
    var algorithm = _getPath.algorithm;
    var file = _getPath.file;

    if (isScratchPaper(category)) {
      if (algorithm) {
        Server.loadScratchPaper(algorithm).then(function (_ref) {
          var category = _ref.category;
          var algorithm = _ref.algorithm;
          var data = _ref.data;

          DOM.showAlgorithm(category, algorithm, data);
        });
      } else {
        Server.loadAlgorithm(category).then(function (data) {
          DOM.showAlgorithm(category, null, data);
        });
      }
    } else if (category && algorithm) {
      DOM.showRequestedAlgorithm(category, algorithm, file);
    } else {
      DOM.showFirstAlgorithm();
    }
  });
});

},{"./app":3,"./app/constructor":2,"./dom":6,"./module":36,"./server":53,"./server/helpers":52,"./utils":65,"rsvp":67}],28:[function(require,module,exports){
'use strict';

var Array2D = require('./array2d');

var random = function random(N, min, max) {
  return Array2D.random(1, N, min, max)[0];
};

var randomSorted = function randomSorted(N, min, max) {
  return Array2D.randomSorted(1, N, min, max)[0];
};

module.exports = {
  random: random,
  randomSorted: randomSorted
};

},{"./array2d":29}],29:[function(require,module,exports){
"use strict";

var random = function random(N, M, min, max) {
  if (!N) N = 10;
  if (!M) M = 10;
  if (min === undefined) min = 1;
  if (max === undefined) max = 9;
  var D = [];
  for (var i = 0; i < N; i++) {
    D.push([]);
    for (var j = 0; j < M; j++) {
      D[i].push((Math.random() * (max - min + 1) | 0) + min);
    }
  }
  return D;
};

var randomSorted = function randomSorted(N, M, min, max) {
  return undefined.random(N, M, min, max).map(function (arr) {
    return arr.sort(function (a, b) {
      return a - b;
    });
  });
};

module.exports = {
  random: random,
  randomSorted: randomSorted
};

},{}],30:[function(require,module,exports){
"use strict";

var random = function random(N, min, max) {
  if (!N) N = 7;
  if (!min) min = 1;
  if (!max) max = 10;
  var C = new Array(N);
  for (var i = 0; i < N; i++) {
    C[i] = new Array(2);
  }for (var i = 0; i < N; i++) {
    for (var j = 0; j < C[i].length; j++) {
      C[i][j] = (Math.random() * (max - min + 1) | 0) + min;
    }
  }return C;
};

module.exports = {
  random: random
};

},{}],31:[function(require,module,exports){
"use strict";

var random = function random(N, ratio) {
  if (!N) N = 5;
  if (!ratio) ratio = .3;
  var G = new Array(N);
  for (var i = 0; i < N; i++) {
    G[i] = new Array(N);
    for (var j = 0; j < N; j++) {
      if (i != j) {
        G[i][j] = (Math.random() * (1 / ratio) | 0) == 0 ? 1 : 0;
      }
    }
  }
  return G;
};

module.exports = {
  random: random
};

},{}],32:[function(require,module,exports){
'use strict';

var Array1D = require('./array1d');
var Array2D = require('./array2d');
var CoordinateSystem = require('./coordinate_system');
var DirectedGraph = require('./directed_graph');
var UndirectedGraph = require('./undirected_graph');
var WeightedDirectedGraph = require('./weighted_directed_graph');
var WeightedUndirectedGraph = require('./weighted_undirected_graph');

module.exports = {
  Array1D: Array1D,
  Array2D: Array2D,
  CoordinateSystem: CoordinateSystem,
  DirectedGraph: DirectedGraph,
  UndirectedGraph: UndirectedGraph,
  WeightedDirectedGraph: WeightedDirectedGraph,
  WeightedUndirectedGraph: WeightedUndirectedGraph
};

},{"./array1d":28,"./array2d":29,"./coordinate_system":30,"./directed_graph":31,"./undirected_graph":33,"./weighted_directed_graph":34,"./weighted_undirected_graph":35}],33:[function(require,module,exports){
"use strict";

var random = function random(N, ratio) {
  if (!N) N = 5;
  if (!ratio) ratio = .3;
  var G = new Array(N);
  for (var i = 0; i < N; i++) {
    G[i] = new Array(N);
  }for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      if (i > j) {
        G[i][j] = G[j][i] = (Math.random() * (1 / ratio) | 0) == 0 ? 1 : 0;
      }
    }
  }
  return G;
};

module.exports = {
  random: random
};

},{}],34:[function(require,module,exports){
"use strict";

var random = function random(N, ratio, min, max) {
  if (!N) N = 5;
  if (!ratio) ratio = .3;
  if (!min) min = 1;
  if (!max) max = 5;
  var G = new Array(N);
  for (var i = 0; i < N; i++) {
    G[i] = new Array(N);
    for (var j = 0; j < N; j++) {
      if (i != j && (Math.random() * (1 / ratio) | 0) == 0) {
        G[i][j] = (Math.random() * (max - min + 1) | 0) + min;
      }
    }
  }
  return G;
};

module.exports = {
  random: random
};

},{}],35:[function(require,module,exports){
"use strict";

var random = function random(N, ratio, min, max) {
  if (!N) N = 5;
  if (!ratio) ratio = .3;
  if (!min) min = 1;
  if (!max) max = 5;
  var G = new Array(N);
  for (var i = 0; i < N; i++) {
    G[i] = new Array(N);
  }for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      if (i > j && (Math.random() * (1 / ratio) | 0) == 0) {
        G[i][j] = G[j][i] = (Math.random() * (max - min + 1) | 0) + min;
      }
    }
  }
  return G;
};

module.exports = {
  random: random
};

},{}],36:[function(require,module,exports){
'use strict';

var tracers = require('./tracer');
var datas = require('./data');

var _$ = $;
var extend = _$.extend;


module.exports = extend(true, {}, tracers, datas);

},{"./data":32,"./tracer":42}],37:[function(require,module,exports){
"use strict";

var Array2DTracer = require('./array2d');

function Array1DTracer() {
  return Array2DTracer.apply(this, arguments);
}

Array1DTracer.prototype = $.extend(true, Object.create(Array2DTracer.prototype), {
  constructor: Array1DTracer,
  name: "Array1DTracer",
  _notify: function _notify(idx, v) {
    Array2DTracer.prototype._notify.call(this, 0, idx, v);
    return this;
  },
  _denotify: function _denotify(idx) {
    Array2DTracer.prototype._denotify.call(this, 0, idx);
    return this;
  },
  _select: function _select(s, e) {
    if (e === undefined) {
      Array2DTracer.prototype._select.call(this, 0, s);
    } else {
      Array2DTracer.prototype._selectRow.call(this, 0, s, e);
    }
    return this;
  },
  _deselect: function _deselect(s, e) {
    if (e === undefined) {
      Array2DTracer.prototype._deselect.call(this, 0, s);
    } else {
      Array2DTracer.prototype._deselectRow.call(this, 0, s, e);
    }
    return this;
  },
  setData: function setData(D) {
    return Array2DTracer.prototype.setData.call(this, [D]);
  }
});

module.exports = Array1DTracer;

},{"./array2d":38}],38:[function(require,module,exports){
'use strict';

var Tracer = require('./tracer');

var _require = require('../../tracer_manager/util/index');

var refineByType = _require.refineByType;


function Array2DTracer() {
  if (Tracer.apply(this, arguments)) {
    Array2DTracer.prototype.init.call(this);
    return true;
  }
  return false;
}

Array2DTracer.prototype = $.extend(true, Object.create(Tracer.prototype), {
  constructor: Array2DTracer,
  name: 'Array2DTracer',
  init: function init() {
    this.$table = this.capsule.$table = $('<div class="mtbl-table">');
    this.$container.append(this.$table);
  },
  _notify: function _notify(x, y, v) {
    this.manager.pushStep(this.capsule, {
      type: 'notify',
      x: x,
      y: y,
      v: v
    });
    return this;
  },
  _denotify: function _denotify(x, y) {
    this.manager.pushStep(this.capsule, {
      type: 'denotify',
      x: x,
      y: y
    });
    return this;
  },
  _select: function _select(sx, sy, ex, ey) {
    this.pushSelectingStep('select', null, arguments);
    return this;
  },
  _selectRow: function _selectRow(x, sy, ey) {
    this.pushSelectingStep('select', 'row', arguments);
    return this;
  },
  _selectCol: function _selectCol(y, sx, ex) {
    this.pushSelectingStep('select', 'col', arguments);
    return this;
  },
  _deselect: function _deselect(sx, sy, ex, ey) {
    this.pushSelectingStep('deselect', null, arguments);
    return this;
  },
  _deselectRow: function _deselectRow(x, sy, ey) {
    this.pushSelectingStep('deselect', 'row', arguments);
    return this;
  },
  _deselectCol: function _deselectCol(y, sx, ex) {
    this.pushSelectingStep('deselect', 'col', arguments);
    return this;
  },
  _separate: function _separate(x, y) {
    this.manager.pushStep(this.capsule, {
      type: 'separate',
      x: x,
      y: y
    });
    return this;
  },
  _separateRow: function _separateRow(x) {
    this._separate(x, -1);
    return this;
  },
  _separateCol: function _separateCol(y) {
    this._separate(-1, y);
    return this;
  },
  _deseparate: function _deseparate(x, y) {
    this.manager.pushStep(this.capsule, {
      type: 'deseparate',
      x: x,
      y: y
    });
    return this;
  },
  _deseparateRow: function _deseparateRow(x) {
    this._deseparate(x, -1);
    return this;
  },
  _deseparateCol: function _deseparateCol(y) {
    this._deseparate(-1, y);
    return this;
  },
  pushSelectingStep: function pushSelectingStep() {
    var args = Array.prototype.slice.call(arguments);
    var type = args.shift();
    var mode = args.shift();
    args = Array.prototype.slice.call(args.shift());
    var coord;
    switch (mode) {
      case 'row':
        coord = {
          x: args[0],
          sy: args[1],
          ey: args[2]
        };
        break;
      case 'col':
        coord = {
          y: args[0],
          sx: args[1],
          ex: args[2]
        };
        break;
      default:
        if (args[2] === undefined && args[3] === undefined) {
          coord = {
            x: args[0],
            y: args[1]
          };
        } else {
          coord = {
            sx: args[0],
            sy: args[1],
            ex: args[2],
            ey: args[3]
          };
        }
    }
    var step = {
      type: type
    };
    $.extend(step, coord);
    this.manager.pushStep(this.capsule, step);
  },
  processStep: function processStep(step, options) {
    switch (step.type) {
      case 'notify':
        if (step.v !== undefined) {
          var $row = this.$table.find('.mtbl-row').eq(step.x);
          var $col = $row.find('.mtbl-col').eq(step.y);
          $col.text(refineByType(step.v));
        }
      case 'denotify':
      case 'select':
      case 'deselect':
        var colorClass = step.type == 'select' || step.type == 'deselect' ? this.colorClass.selected : this.colorClass.notified;
        var addClass = step.type == 'select' || step.type == 'notify';
        var sx = step.sx;
        var sy = step.sy;
        var ex = step.ex;
        var ey = step.ey;
        if (sx === undefined) sx = step.x;
        if (sy === undefined) sy = step.y;
        if (ex === undefined) ex = step.x;
        if (ey === undefined) ey = step.y;
        this.paintColor(sx, sy, ex, ey, colorClass, addClass);
        break;
      case 'separate':
        this.deseparate(step.x, step.y);
        this.separate(step.x, step.y);
        break;
      case 'deseparate':
        this.deseparate(step.x, step.y);
        break;
      default:
        Tracer.prototype.processStep.call(this, step, options);
    }
  },
  setData: function setData(D) {
    this.viewX = this.viewY = 0;
    this.paddingH = 6;
    this.paddingV = 3;
    this.fontSize = 16;

    if (Tracer.prototype.setData.apply(this, arguments)) {
      this.$table.find('.mtbl-row').each(function (i) {
        $(this).find('.mtbl-col').each(function (j) {
          $(this).text(refineByType(D[i][j]));
        });
      });
      return true;
    }

    this.$table.empty();
    for (var i = 0; i < D.length; i++) {
      var $row = $('<div class="mtbl-row">');
      this.$table.append($row);
      for (var j = 0; j < D[i].length; j++) {
        var $col = $('<div class="mtbl-col">').css(this.getCellCss()).text(refineByType(D[i][j]));
        $row.append($col);
      }
    }
    this.resize();

    return false;
  },
  resize: function resize() {
    Tracer.prototype.resize.call(this);

    this.refresh();
  },
  clear: function clear() {
    Tracer.prototype.clear.call(this);

    this.clearColor();
    this.deseparateAll();
  },
  getCellCss: function getCellCss() {
    return {
      padding: this.paddingV.toFixed(1) + 'px ' + this.paddingH.toFixed(1) + 'px',
      'font-size': this.fontSize.toFixed(1) + 'px'
    };
  },
  refresh: function refresh() {
    Tracer.prototype.refresh.call(this);

    var $parent = this.$table.parent();
    var top = $parent.height() / 2 - this.$table.height() / 2 + this.viewY;
    var left = $parent.width() / 2 - this.$table.width() / 2 + this.viewX;
    this.$table.css('margin-top', top);
    this.$table.css('margin-left', left);
  },
  mousedown: function mousedown(e) {
    Tracer.prototype.mousedown.call(this, e);

    this.dragX = e.pageX;
    this.dragY = e.pageY;
    this.dragging = true;
  },
  mousemove: function mousemove(e) {
    Tracer.prototype.mousemove.call(this, e);

    if (this.dragging) {
      this.viewX += e.pageX - this.dragX;
      this.viewY += e.pageY - this.dragY;
      this.dragX = e.pageX;
      this.dragY = e.pageY;
      this.refresh();
    }
  },
  mouseup: function mouseup(e) {
    Tracer.prototype.mouseup.call(this, e);

    this.dragging = false;
  },
  mousewheel: function mousewheel(e) {
    Tracer.prototype.mousewheel.call(this, e);

    e.preventDefault();
    e = e.originalEvent;
    var delta = e.wheelDelta !== undefined && e.wheelDelta || e.detail !== undefined && -e.detail;
    var weight = 1.01;
    var ratio = delta > 0 ? 1 / weight : weight;
    if (this.fontSize < 4 && ratio < 1) return;
    if (this.fontSize > 40 && ratio > 1) return;
    this.paddingV *= ratio;
    this.paddingH *= ratio;
    this.fontSize *= ratio;
    this.$table.find('.mtbl-col').css(this.getCellCss());
    this.refresh();
  },
  paintColor: function paintColor(sx, sy, ex, ey, colorClass, addClass) {
    for (var i = sx; i <= ex; i++) {
      var $row = this.$table.find('.mtbl-row').eq(i);
      for (var j = sy; j <= ey; j++) {
        var $col = $row.find('.mtbl-col').eq(j);
        if (addClass) $col.addClass(colorClass);else $col.removeClass(colorClass);
      }
    }
  },
  clearColor: function clearColor() {
    this.$table.find('.mtbl-col').removeClass(Object.keys(this.colorClass).join(' '));
  },
  colorClass: {
    selected: 'selected',
    notified: 'notified'
  },
  separate: function separate(x, y) {
    this.$table.find('.mtbl-row').each(function (i) {
      var $row = $(this);
      if (i == x) {
        $row.after($('<div class="mtbl-empty-row">').attr('data-row', i));
      }
      $row.find('.mtbl-col').each(function (j) {
        var $col = $(this);
        if (j == y) {
          $col.after($('<div class="mtbl-empty-col">').attr('data-col', j));
        }
      });
    });
  },
  deseparate: function deseparate(x, y) {
    this.$table.find('[data-row=' + x + ']').remove();
    this.$table.find('[data-col=' + y + ']').remove();
  },
  deseparateAll: function deseparateAll() {
    this.$table.find('.mtbl-empty-row, .mtbl-empty-col').remove();
  }
});

module.exports = Array2DTracer;

},{"../../tracer_manager/util/index":62,"./tracer":44}],39:[function(require,module,exports){
'use strict';

var Tracer = require('./tracer');

function ChartTracer() {
  if (Tracer.apply(this, arguments)) {
    ChartTracer.prototype.init.call(this, arguments);
    return true;
  }
  return false;
}

ChartTracer.prototype = $.extend(true, Object.create(Tracer.prototype), {
  constructor: ChartTracer,
  name: 'ChartTracer',
  init: function init() {
    this.$wrapper = this.capsule.$wrapper = $('<canvas id="chart">');
    this.$container.append(this.$wrapper);
  },
  setData: function setData(C) {
    if (Tracer.prototype.setData.apply(this, arguments)) return true;
    var tracer = this;
    var color = [];
    for (var i = 0; i < C.length; i++) {
      color.push('rgba(136, 136, 136, 1)');
    }var data = {
      type: 'bar',
      data: {
        labels: C.map(String),
        datasets: [{
          backgroundColor: color,
          data: C
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    };
    this.chart = this.capsule.chart = new Chart(this.$wrapper, data);
  },
  _notify: function _notify(s, v) {
    this.manager.pushStep(this.capsule, {
      type: 'notify',
      s: s,
      v: v
    });
    return this;
  },
  _denotify: function _denotify(s) {
    this.manager.pushStep(this.capsule, {
      type: 'denotify',
      s: s
    });
    return this;
  },
  _select: function _select(s, e) {
    this.manager.pushStep(this.capsule, {
      type: 'select',
      s: s,
      e: e
    });
    return this;
  },
  _deselect: function _deselect(s, e) {
    this.manager.pushStep(this.capsule, {
      type: 'deselect',
      s: s,
      e: e
    });
    return this;
  },
  processStep: function processStep(step, options) {
    switch (step.type) {
      case 'notify':
        if (step.v !== undefined) {
          this.chart.config.data.datasets[0].data[step.s] = step.v;
          this.chart.config.data.labels[step.s] = step.v.toString();
        }
      case 'denotify':
      case 'deselect':
        var color = step.type == 'denotify' || step.type == 'deselect' ? 'rgba(136, 136, 136, 1)' : 'rgba(255, 0, 0, 1)';
      case 'select':
        if (color === undefined) var color = 'rgba(0, 0, 255, 1)';
        if (step.e !== undefined) for (var i = step.s; i <= step.e; i++) {
          this.chart.config.data.datasets[0].backgroundColor[i] = color;
        } else this.chart.config.data.datasets[0].backgroundColor[step.s] = color;
        this.chart.update();
        break;
      default:
        Tracer.prototype.processStep.call(this, step, options);
    }
  }
});

module.exports = ChartTracer;

},{"./tracer":44}],40:[function(require,module,exports){
'use strict';

var DirectedGraphTracer = require('./directed_graph');

function CoordinateSystemTracer() {
  if (DirectedGraphTracer.apply(this, arguments)) {
    CoordinateSystemTracer.prototype.init.call(this);
    return true;
  }
  return false;
}

CoordinateSystemTracer.prototype = $.extend(true, Object.create(DirectedGraphTracer.prototype), {
  constructor: CoordinateSystemTracer,
  name: 'CoordinateSystemTracer',
  init: function init() {
    var tracer = this;

    this.s.settings({
      defaultEdgeType: 'def',
      funcEdgesDef: function funcEdgesDef(edge, source, target, context, settings) {
        var color = tracer.getColor(edge, source, target, settings);
        tracer.drawEdge(edge, source, target, color, context, settings);
      }
    });
  },
  setData: function setData(C) {
    if (Tracer.prototype.setData.apply(this, arguments)) return true;

    this.graph.clear();
    var nodes = [];
    var edges = [];
    for (var i = 0; i < C.length; i++) {
      nodes.push({
        id: this.n(i),
        x: C[i][0],
        y: C[i][1],
        label: '' + i,
        size: 1,
        color: this.color.default
      });
    }this.graph.read({
      nodes: nodes,
      edges: edges
    });
    this.s.camera.goTo({
      x: 0,
      y: 0,
      angle: 0,
      ratio: 1
    });
    this.refresh();

    return false;
  },
  processStep: function processStep(step, options) {
    switch (step.type) {
      case 'visit':
      case 'leave':
        var visit = step.type == 'visit';
        var targetNode = this.graph.nodes(this.n(step.target));
        var color = visit ? this.color.visited : this.color.left;
        targetNode.color = color;
        if (step.source !== undefined) {
          var edgeId = this.e(step.source, step.target);
          if (this.graph.edges(edgeId)) {
            var edge = this.graph.edges(edgeId);
            edge.color = color;
            this.graph.dropEdge(edgeId).addEdge(edge);
          } else {
            this.graph.addEdge({
              id: this.e(step.target, step.source),
              source: this.n(step.source),
              target: this.n(step.target),
              color: color,
              size: 1
            });
          }
        }
        if (this.logTracer) {
          var source = step.source;
          if (source === undefined) source = '';
          this.logTracer.print(visit ? source + ' -> ' + step.target : source + ' <- ' + step.target);
        }
        break;
      default:
        Tracer.prototype.processStep.call(this, step, options);
    }
  },
  e: function e(v1, v2) {
    if (v1 > v2) {
      var temp = v1;
      v1 = v2;
      v2 = temp;
    }
    return 'e' + v1 + '_' + v2;
  },
  drawOnHover: function drawOnHover(node, context, settings, next) {
    var tracer = this;

    context.setLineDash([5, 5]);
    var nodeIdx = node.id.substring(1);
    this.graph.edges().forEach(function (edge) {
      var ends = edge.id.substring(1).split("_");
      if (ends[0] == nodeIdx) {
        var color = '#0ff';
        var source = node;
        var target = tracer.graph.nodes('n' + ends[1]);
        tracer.drawEdge(edge, source, target, color, context, settings);
        if (next) next(edge, source, target, color, context, settings);
      } else if (ends[1] == nodeIdx) {
        var color = '#0ff';
        var source = tracer.graph.nodes('n' + ends[0]);
        var target = node;
        tracer.drawEdge(edge, source, target, color, context, settings);
        if (next) next(edge, source, target, color, context, settings);
      }
    });
  },
  drawEdge: function drawEdge(edge, source, target, color, context, settings) {
    var prefix = settings('prefix') || '',
        size = edge[prefix + 'size'] || 1;

    context.strokeStyle = color;
    context.lineWidth = size;
    context.beginPath();
    context.moveTo(source[prefix + 'x'], source[prefix + 'y']);
    context.lineTo(target[prefix + 'x'], target[prefix + 'y']);
    context.stroke();
  }
});

module.exports = CoordinateSystemTracer;

},{"./directed_graph":41}],41:[function(require,module,exports){
'use strict';

var Tracer = require('./tracer');

function DirectedGraphTracer() {
  if (Tracer.apply(this, arguments)) {
    DirectedGraphTracer.prototype.init.call(this);
    return true;
  }
  return false;
}

DirectedGraphTracer.prototype = $.extend(true, Object.create(Tracer.prototype), {
  constructor: DirectedGraphTracer,
  name: 'DirectedGraphTracer',
  init: function init() {
    var tracer = this;

    this.s = this.capsule.s = new sigma({
      renderer: {
        container: this.$container[0],
        type: 'canvas'
      },
      settings: {
        minArrowSize: 8,
        defaultEdgeType: 'arrow',
        maxEdgeSize: 2.5,
        labelThreshold: 4,
        font: 'Roboto',
        defaultLabelColor: '#fff',
        zoomMin: 0.6,
        zoomMax: 1.2,
        skipErrors: true,
        minNodeSize: .5,
        maxNodeSize: 12,
        labelSize: 'proportional',
        labelSizeRatio: 1.3,
        funcLabelsDef: function funcLabelsDef(node, context, settings) {
          tracer.drawLabel(node, context, settings);
        },
        funcHoversDef: function funcHoversDef(node, context, settings, next) {
          tracer.drawOnHover(node, context, settings, next);
        },
        funcEdgesArrow: function funcEdgesArrow(edge, source, target, context, settings) {
          var color = tracer.getColor(edge, source, target, settings);
          tracer.drawArrow(edge, source, target, color, context, settings);
        }
      }
    });
    sigma.plugins.dragNodes(this.s, this.s.renderers[0]);
    this.graph = this.capsule.graph = this.s.graph;
  },
  _setTreeData: function _setTreeData(G, root) {
    this.manager.pushStep(this.capsule, {
      type: 'setTreeData',
      arguments: arguments
    });
    return this;
  },
  _visit: function _visit(target, source) {
    this.manager.pushStep(this.capsule, {
      type: 'visit',
      target: target,
      source: source
    });
    return this;
  },
  _leave: function _leave(target, source) {
    this.manager.pushStep(this.capsule, {
      type: 'leave',
      target: target,
      source: source
    });
    return this;
  },
  processStep: function processStep(step, options) {
    switch (step.type) {
      case 'setTreeData':
        this.setTreeData.apply(this, step.arguments);
        break;
      case 'visit':
      case 'leave':
        var visit = step.type == 'visit';
        var targetNode = this.graph.nodes(this.n(step.target));
        var color = visit ? this.color.visited : this.color.left;
        targetNode.color = color;
        if (step.source !== undefined) {
          var edgeId = this.e(step.source, step.target);
          var edge = this.graph.edges(edgeId);
          edge.color = color;
          this.graph.dropEdge(edgeId).addEdge(edge);
        }
        if (this.logTracer) {
          var source = step.source;
          if (source === undefined) source = '';
          this.logTracer.print(visit ? source + ' -> ' + step.target : source + ' <- ' + step.target);
        }
        break;
      default:
        Tracer.prototype.processStep.call(this, step, options);
    }
  },
  setTreeData: function setTreeData(G, root) {
    var tracer = this;

    root = root || 0;
    var maxDepth = -1;

    var chk = new Array(G.length);
    var getDepth = function getDepth(node, depth) {
      if (chk[node]) throw "the given graph is not a tree because it forms a circuit";
      chk[node] = true;
      if (maxDepth < depth) maxDepth = depth;
      for (var i = 0; i < G[node].length; i++) {
        if (G[node][i]) getDepth(i, depth + 1);
      }
    };
    getDepth(root, 1);

    if (this.setData.apply(this, arguments)) return true;

    var place = function place(node, x, y) {
      var temp = tracer.graph.nodes(tracer.n(node));
      temp.x = x;
      temp.y = y;
    };

    var wgap = 1 / (maxDepth - 1);
    var dfs = function dfs(node, depth, top, bottom) {
      place(node, top + bottom, depth * wgap);
      var children = 0;
      for (var i = 0; i < G[node].length; i++) {
        if (G[node][i]) children++;
      }
      var vgap = (bottom - top) / children;
      var cnt = 0;
      for (var i = 0; i < G[node].length; i++) {
        if (G[node][i]) dfs(i, depth + 1, top + vgap * cnt, top + vgap * ++cnt);
      }
    };
    dfs(root, 0, 0, 1);

    this.refresh();
  },
  setData: function setData(G) {
    if (Tracer.prototype.setData.apply(this, arguments)) return true;

    this.graph.clear();
    var nodes = [];
    var edges = [];
    var unitAngle = 2 * Math.PI / G.length;
    var currentAngle = 0;
    for (var i = 0; i < G.length; i++) {
      currentAngle += unitAngle;
      nodes.push({
        id: this.n(i),
        label: '' + i,
        x: .5 + Math.sin(currentAngle) / 2,
        y: .5 + Math.cos(currentAngle) / 2,
        size: 1,
        color: this.color.default
      });
      for (var j = 0; j < G[i].length; j++) {
        if (G[i][j]) {
          edges.push({
            id: this.e(i, j),
            source: this.n(i),
            target: this.n(j),
            color: this.color.default,
            size: 1
          });
        }
      }
    }

    this.graph.read({
      nodes: nodes,
      edges: edges
    });
    this.s.camera.goTo({
      x: 0,
      y: 0,
      angle: 0,
      ratio: 1
    });
    this.refresh();

    return false;
  },
  resize: function resize() {
    Tracer.prototype.resize.call(this);

    this.s.renderers[0].resize();
    this.refresh();
  },
  refresh: function refresh() {
    Tracer.prototype.refresh.call(this);

    this.s.refresh();
  },
  clear: function clear() {
    Tracer.prototype.clear.call(this);

    this.clearGraphColor();
  },
  color: {
    visited: '#f00',
    left: '#000',
    default: '#888'
  },
  clearGraphColor: function clearGraphColor() {
    var tracer = this;

    this.graph.nodes().forEach(function (node) {
      node.color = tracer.color.default;
    });
    this.graph.edges().forEach(function (edge) {
      edge.color = tracer.color.default;
    });
  },
  n: function n(v) {
    return 'n' + v;
  },
  e: function e(v1, v2) {
    return 'e' + v1 + '_' + v2;
  },
  getColor: function getColor(edge, source, target, settings) {
    var color = edge.color,
        edgeColor = settings('edgeColor'),
        defaultNodeColor = settings('defaultNodeColor'),
        defaultEdgeColor = settings('defaultEdgeColor');
    if (!color) switch (edgeColor) {
      case 'source':
        color = source.color || defaultNodeColor;
        break;
      case 'target':
        color = target.color || defaultNodeColor;
        break;
      default:
        color = defaultEdgeColor;
        break;
    }

    return color;
  },
  drawLabel: function drawLabel(node, context, settings) {
    var fontSize,
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'];

    if (size < settings('labelThreshold')) return;

    if (!node.label || typeof node.label !== 'string') return;

    fontSize = settings('labelSize') === 'fixed' ? settings('defaultLabelSize') : settings('labelSizeRatio') * size;

    context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') + fontSize + 'px ' + settings('font');
    context.fillStyle = settings('labelColor') === 'node' ? node.color || settings('defaultNodeColor') : settings('defaultLabelColor');

    context.textAlign = 'center';
    context.fillText(node.label, Math.round(node[prefix + 'x']), Math.round(node[prefix + 'y'] + fontSize / 3));
  },
  drawArrow: function drawArrow(edge, source, target, color, context, settings) {
    var prefix = settings('prefix') || '',
        size = edge[prefix + 'size'] || 1,
        tSize = target[prefix + 'size'],
        sX = source[prefix + 'x'],
        sY = source[prefix + 'y'],
        tX = target[prefix + 'x'],
        tY = target[prefix + 'y'],
        angle = Math.atan2(tY - sY, tX - sX),
        dist = 3;
    sX += Math.sin(angle) * dist;
    tX += Math.sin(angle) * dist;
    sY += -Math.cos(angle) * dist;
    tY += -Math.cos(angle) * dist;
    var aSize = Math.max(size * 2.5, settings('minArrowSize')),
        d = Math.sqrt(Math.pow(tX - sX, 2) + Math.pow(tY - sY, 2)),
        aX = sX + (tX - sX) * (d - aSize - tSize) / d,
        aY = sY + (tY - sY) * (d - aSize - tSize) / d,
        vX = (tX - sX) * aSize / d,
        vY = (tY - sY) * aSize / d;

    context.strokeStyle = color;
    context.lineWidth = size;
    context.beginPath();
    context.moveTo(sX, sY);
    context.lineTo(aX, aY);
    context.stroke();

    context.fillStyle = color;
    context.beginPath();
    context.moveTo(aX + vX, aY + vY);
    context.lineTo(aX + vY * 0.6, aY - vX * 0.6);
    context.lineTo(aX - vY * 0.6, aY + vX * 0.6);
    context.lineTo(aX + vX, aY + vY);
    context.closePath();
    context.fill();
  },
  drawOnHover: function drawOnHover(node, context, settings, next) {
    var tracer = this;

    context.setLineDash([5, 5]);
    var nodeIdx = node.id.substring(1);
    this.graph.edges().forEach(function (edge) {
      var ends = edge.id.substring(1).split("_");
      if (ends[0] == nodeIdx) {
        var color = '#0ff';
        var source = node;
        var target = tracer.graph.nodes('n' + ends[1]);
        tracer.drawArrow(edge, source, target, color, context, settings);
        if (next) next(edge, source, target, color, context, settings);
      } else if (ends[1] == nodeIdx) {
        var color = '#ff0';
        var source = tracer.graph.nodes('n' + ends[0]);
        var target = node;
        tracer.drawArrow(edge, source, target, color, context, settings);
        if (next) next(edge, source, target, color, context, settings);
      }
    });
  }
});

sigma.canvas.labels.def = function (node, context, settings) {
  var func = settings('funcLabelsDef');
  if (func) {
    func(node, context, settings);
  }
};
sigma.canvas.hovers.def = function (node, context, settings) {
  var func = settings('funcHoversDef');
  if (func) {
    func(node, context, settings);
  }
};
sigma.canvas.edges.def = function (edge, source, target, context, settings) {
  var func = settings('funcEdgesDef');
  if (func) {
    func(edge, source, target, context, settings);
  }
};
sigma.canvas.edges.arrow = function (edge, source, target, context, settings) {
  var func = settings('funcEdgesArrow');
  if (func) {
    func(edge, source, target, context, settings);
  }
};

module.exports = DirectedGraphTracer;

},{"./tracer":44}],42:[function(require,module,exports){
'use strict';

var Tracer = require('./tracer');
var LogTracer = require('./log');
var Array1DTracer = require('./array1d');
var Array2DTracer = require('./array2d');
var ChartTracer = require('./chart');
var CoordinateSystemTracer = require('./coordinate_system');
var DirectedGraphTracer = require('./directed_graph');
var UndirectedGraphTracer = require('./undirected_graph');
var WeightedDirectedGraphTracer = require('./weighted_directed_graph');
var WeightedUndirectedGraphTracer = require('./weighted_undirected_graph');

module.exports = {
  Tracer: Tracer,
  LogTracer: LogTracer,
  Array1DTracer: Array1DTracer,
  Array2DTracer: Array2DTracer,
  ChartTracer: ChartTracer,
  CoordinateSystemTracer: CoordinateSystemTracer,
  DirectedGraphTracer: DirectedGraphTracer,
  UndirectedGraphTracer: UndirectedGraphTracer,
  WeightedDirectedGraphTracer: WeightedDirectedGraphTracer,
  WeightedUndirectedGraphTracer: WeightedUndirectedGraphTracer
};

},{"./array1d":37,"./array2d":38,"./chart":39,"./coordinate_system":40,"./directed_graph":41,"./log":43,"./tracer":44,"./undirected_graph":45,"./weighted_directed_graph":46,"./weighted_undirected_graph":47}],43:[function(require,module,exports){
'use strict';

var Tracer = require('./tracer');

function LogTracer() {
  if (Tracer.apply(this, arguments)) {
    LogTracer.prototype.init.call(this);
    return true;
  }
  return false;
}

LogTracer.prototype = $.extend(true, Object.create(Tracer.prototype), {
  constructor: LogTracer,
  name: 'LogTracer',
  init: function init() {
    this.$wrapper = this.capsule.$wrapper = $('<div class="wrapper">');
    this.$container.append(this.$wrapper);
  },
  _print: function _print(msg) {
    this.manager.pushStep(this.capsule, {
      type: 'print',
      msg: msg
    });
    return this;
  },
  processStep: function processStep(step, options) {
    switch (step.type) {
      case 'print':
        this.print(step.msg);
        break;
    }
  },
  refresh: function refresh() {
    this.scrollToEnd(Math.min(50, this.interval));
  },
  clear: function clear() {
    Tracer.prototype.clear.call(this);

    this.$wrapper.empty();
  },
  print: function print(message) {
    this.$wrapper.append($('<span>').append(message + '<br/>'));
  },
  scrollToEnd: function scrollToEnd(duration) {
    this.$container.animate({
      scrollTop: this.$container[0].scrollHeight
    }, duration);
  }
});

module.exports = LogTracer;

},{"./tracer":44}],44:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('../../tracer_manager/util/index');

var toJSON = _require.toJSON;
var fromJSON = _require.fromJSON;


function Tracer(name) {
  this.module = this.constructor;
  this.capsule = this.manager.allocate(this);
  $.extend(this, this.capsule);
  this.setName(name);
  return this.isNew;
}

Tracer.prototype = {

  constructor: Tracer,
  name: 'Tracer',
  manager: null,

  _setData: function _setData() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this.manager.pushStep(this.capsule, {
      type: 'setData',
      args: toJSON(args)
    });
    return this;
  },
  _clear: function _clear() {
    this.manager.pushStep(this.capsule, {
      type: 'clear'
    });
    return this;
  },
  _wait: function _wait() {
    this.manager.newStep();
    return this;
  },
  processStep: function processStep(step, options) {
    var type = step.type;
    var args = step.args;


    switch (type) {
      case 'setData':
        this.setData.apply(this, _toConsumableArray(fromJSON(args)));
        break;
      case 'clear':
        this.clear();
        break;
    }
  },
  setName: function setName(name) {
    var $name = void 0;
    if (this.isNew) {
      $name = $('<span class="name">');
      this.$container.append($name);
    } else {
      $name = this.$container.find('span.name');
    }
    $name.text(name || this.defaultName);
  },
  setData: function setData() {
    var data = toJSON(arguments);
    if (!this.isNew && this.lastData === data) {
      return true;
    }
    this.isNew = this.capsule.isNew = false;
    this.lastData = this.capsule.lastData = data;
    return false;
  },
  resize: function resize() {},
  refresh: function refresh() {},
  clear: function clear() {},
  attach: function attach(tracer) {
    if (tracer.module === LogTracer) {
      this.logTracer = tracer;
    }
    return this;
  },
  mousedown: function mousedown(e) {},
  mousemove: function mousemove(e) {},
  mouseup: function mouseup(e) {},
  mousewheel: function mousewheel(e) {}
};

module.exports = Tracer;

},{"../../tracer_manager/util/index":62}],45:[function(require,module,exports){
'use strict';

var DirectedGraphTracer = require('./directed_graph');

function UndirectedGraphTracer() {
  if (DirectedGraphTracer.apply(this, arguments)) {
    UndirectedGraphTracer.prototype.init.call(this);
    return true;
  }
  return false;
}

UndirectedGraphTracer.prototype = $.extend(true, Object.create(DirectedGraphTracer.prototype), {
  constructor: UndirectedGraphTracer,
  name: 'UndirectedGraphTracer',
  init: function init() {
    var tracer = this;

    this.s.settings({
      defaultEdgeType: 'def',
      funcEdgesDef: function funcEdgesDef(edge, source, target, context, settings) {
        var color = tracer.getColor(edge, source, target, settings);
        tracer.drawEdge(edge, source, target, color, context, settings);
      }
    });
  },
  setData: function setData(G) {
    if (Tracer.prototype.setData.apply(this, arguments)) return true;

    this.graph.clear();
    var nodes = [];
    var edges = [];
    var unitAngle = 2 * Math.PI / G.length;
    var currentAngle = 0;
    for (var i = 0; i < G.length; i++) {
      currentAngle += unitAngle;
      nodes.push({
        id: this.n(i),
        label: '' + i,
        x: .5 + Math.sin(currentAngle) / 2,
        y: .5 + Math.cos(currentAngle) / 2,
        size: 1,
        color: this.color.default
      });
    }
    for (var i = 0; i < G.length; i++) {
      for (var j = 0; j <= i; j++) {
        if (G[i][j] || G[j][i]) {
          edges.push({
            id: this.e(i, j),
            source: this.n(i),
            target: this.n(j),
            color: this.color.default,
            size: 1
          });
        }
      }
    }

    this.graph.read({
      nodes: nodes,
      edges: edges
    });
    this.s.camera.goTo({
      x: 0,
      y: 0,
      angle: 0,
      ratio: 1
    });
    this.refresh();

    return false;
  },
  e: function e(v1, v2) {
    if (v1 > v2) {
      var temp = v1;
      v1 = v2;
      v2 = temp;
    }
    return 'e' + v1 + '_' + v2;
  },
  drawOnHover: function drawOnHover(node, context, settings, next) {
    var tracer = this;

    context.setLineDash([5, 5]);
    var nodeIdx = node.id.substring(1);
    this.graph.edges().forEach(function (edge) {
      var ends = edge.id.substring(1).split("_");
      if (ends[0] == nodeIdx) {
        var color = '#0ff';
        var source = node;
        var target = tracer.graph.nodes('n' + ends[1]);
        tracer.drawEdge(edge, source, target, color, context, settings);
        if (next) next(edge, source, target, color, context, settings);
      } else if (ends[1] == nodeIdx) {
        var color = '#0ff';
        var source = tracer.graph.nodes('n' + ends[0]);
        var target = node;
        tracer.drawEdge(edge, source, target, color, context, settings);
        if (next) next(edge, source, target, color, context, settings);
      }
    });
  },
  drawEdge: function drawEdge(edge, source, target, color, context, settings) {
    var prefix = settings('prefix') || '',
        size = edge[prefix + 'size'] || 1;

    context.strokeStyle = color;
    context.lineWidth = size;
    context.beginPath();
    context.moveTo(source[prefix + 'x'], source[prefix + 'y']);
    context.lineTo(target[prefix + 'x'], target[prefix + 'y']);
    context.stroke();
  }
});

module.exports = UndirectedGraphTracer;

},{"./directed_graph":41}],46:[function(require,module,exports){
'use strict';

var DirectedGraphTracer = require('./directed_graph');

var _require = require('../../tracer_manager/util/index');

var refineByType = _require.refineByType;


function WeightedDirectedGraphTracer() {
  if (DirectedGraphTracer.apply(this, arguments)) {
    WeightedDirectedGraphTracer.prototype.init.call(this);
    return true;
  }
  return false;
}

WeightedDirectedGraphTracer.prototype = $.extend(true, Object.create(DirectedGraphTracer.prototype), {
  constructor: WeightedDirectedGraphTracer,
  name: 'WeightedDirectedGraphTracer',
  init: function init() {
    var tracer = this;

    this.s.settings({
      edgeLabelSize: 'proportional',
      defaultEdgeLabelSize: 20,
      edgeLabelSizePowRatio: 0.8,
      funcLabelsDef: function funcLabelsDef(node, context, settings) {
        tracer.drawNodeWeight(node, context, settings);
        tracer.drawLabel(node, context, settings);
      },
      funcHoversDef: function funcHoversDef(node, context, settings) {
        tracer.drawOnHover(node, context, settings, tracer.drawEdgeWeight);
      },
      funcEdgesArrow: function funcEdgesArrow(edge, source, target, context, settings) {
        var color = tracer.getColor(edge, source, target, settings);
        tracer.drawArrow(edge, source, target, color, context, settings);
        tracer.drawEdgeWeight(edge, source, target, color, context, settings);
      }
    });
  },
  _weight: function _weight(target, weight) {
    this.manager.pushStep(this.capsule, {
      type: 'weight',
      target: target,
      weight: weight
    });
    return this;
  },
  _visit: function _visit(target, source, weight) {
    this.manager.pushStep(this.capsule, {
      type: 'visit',
      target: target,
      source: source,
      weight: weight
    });
    return this;
  },
  _leave: function _leave(target, source, weight) {
    this.manager.pushStep(this.capsule, {
      type: 'leave',
      target: target,
      source: source,
      weight: weight
    });
    return this;
  },
  processStep: function processStep(step, options) {
    switch (step.type) {
      case 'weight':
        var targetNode = this.graph.nodes(this.n(step.target));
        if (step.weight !== undefined) targetNode.weight = refineByType(step.weight);
        break;
      case 'visit':
      case 'leave':
        var visit = step.type == 'visit';
        var targetNode = this.graph.nodes(this.n(step.target));
        var color = visit ? this.color.visited : this.color.left;
        targetNode.color = color;
        if (step.weight !== undefined) targetNode.weight = refineByType(step.weight);
        if (step.source !== undefined) {
          var edgeId = this.e(step.source, step.target);
          var edge = this.graph.edges(edgeId);
          edge.color = color;
          this.graph.dropEdge(edgeId).addEdge(edge);
        }
        if (this.logTracer) {
          var source = step.source;
          if (source === undefined) source = '';
          this.logTracer.print(visit ? source + ' -> ' + step.target : source + ' <- ' + step.target);
        }
        break;
      default:
        DirectedGraphTracer.prototype.processStep.call(this, step, options);
    }
  },
  setData: function setData(G) {
    if (Tracer.prototype.setData.apply(this, arguments)) return true;

    this.graph.clear();
    var nodes = [];
    var edges = [];
    var unitAngle = 2 * Math.PI / G.length;
    var currentAngle = 0;
    for (var i = 0; i < G.length; i++) {
      currentAngle += unitAngle;
      nodes.push({
        id: this.n(i),
        label: '' + i,
        x: .5 + Math.sin(currentAngle) / 2,
        y: .5 + Math.cos(currentAngle) / 2,
        size: 1,
        color: this.color.default,
        weight: 0
      });
      for (var j = 0; j < G[i].length; j++) {
        if (G[i][j]) {
          edges.push({
            id: this.e(i, j),
            source: this.n(i),
            target: this.n(j),
            color: this.color.default,
            size: 1,
            weight: refineByType(G[i][j])
          });
        }
      }
    }

    this.graph.read({
      nodes: nodes,
      edges: edges
    });
    this.s.camera.goTo({
      x: 0,
      y: 0,
      angle: 0,
      ratio: 1
    });
    this.refresh();

    return false;
  },
  clear: function clear() {
    DirectedGraphTracer.prototype.clear.call(this);

    this.clearWeights();
  },
  clearWeights: function clearWeights() {
    this.graph.nodes().forEach(function (node) {
      node.weight = 0;
    });
  },
  drawEdgeWeight: function drawEdgeWeight(edge, source, target, color, context, settings) {
    if (source == target) return;

    var prefix = settings('prefix') || '',
        size = edge[prefix + 'size'] || 1;

    if (size < settings('edgeLabelThreshold')) return;

    if (0 === settings('edgeLabelSizePowRatio')) throw '"edgeLabelSizePowRatio" must not be 0.';

    var fontSize,
        x = (source[prefix + 'x'] + target[prefix + 'x']) / 2,
        y = (source[prefix + 'y'] + target[prefix + 'y']) / 2,
        dX = target[prefix + 'x'] - source[prefix + 'x'],
        dY = target[prefix + 'y'] - source[prefix + 'y'],
        angle = Math.atan2(dY, dX);

    fontSize = settings('edgeLabelSize') === 'fixed' ? settings('defaultEdgeLabelSize') : settings('defaultEdgeLabelSize') * size * Math.pow(size, -1 / settings('edgeLabelSizePowRatio'));

    context.save();

    if (edge.active) {
      context.font = [settings('activeFontStyle'), fontSize + 'px', settings('activeFont') || settings('font')].join(' ');

      context.fillStyle = color;
    } else {
      context.font = [settings('fontStyle'), fontSize + 'px', settings('font')].join(' ');

      context.fillStyle = color;
    }

    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';

    context.translate(x, y);
    context.rotate(angle);
    context.fillText(edge.weight, 0, -size / 2 - 3);

    context.restore();
  },
  drawNodeWeight: function drawNodeWeight(node, context, settings) {
    var fontSize,
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'];

    if (size < settings('labelThreshold')) return;

    fontSize = settings('labelSize') === 'fixed' ? settings('defaultLabelSize') : settings('labelSizeRatio') * size;

    context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') + fontSize + 'px ' + settings('font');
    context.fillStyle = settings('labelColor') === 'node' ? node.color || settings('defaultNodeColor') : settings('defaultLabelColor');

    context.textAlign = 'left';
    context.fillText(node.weight, Math.round(node[prefix + 'x'] + size * 1.5), Math.round(node[prefix + 'y'] + fontSize / 3));
  }
});

module.exports = WeightedDirectedGraphTracer;

},{"../../tracer_manager/util/index":62,"./directed_graph":41}],47:[function(require,module,exports){
'use strict';

var WeightedDirectedGraphTracer = require('./weighted_directed_graph');
var UndirectedGraphTracer = require('./undirected_graph');

function WeightedUndirectedGraphTracer() {
  if (WeightedDirectedGraphTracer.apply(this, arguments)) {
    WeightedUndirectedGraphTracer.prototype.init.call(this);
    return true;
  }
  return false;
}

WeightedUndirectedGraphTracer.prototype = $.extend(true, Object.create(WeightedDirectedGraphTracer.prototype), {
  constructor: WeightedUndirectedGraphTracer,
  name: 'WeightedUndirectedGraphTracer',
  init: function init() {
    var tracer = this;

    this.s.settings({
      defaultEdgeType: 'def',
      funcEdgesDef: function funcEdgesDef(edge, source, target, context, settings) {
        var color = tracer.getColor(edge, source, target, settings);
        tracer.drawEdge(edge, source, target, color, context, settings);
        tracer.drawEdgeWeight(edge, source, target, color, context, settings);
      }
    });
  },
  setData: function setData(G) {
    if (Tracer.prototype.setData.apply(this, arguments)) return true;

    this.graph.clear();
    var nodes = [];
    var edges = [];
    var unitAngle = 2 * Math.PI / G.length;
    var currentAngle = 0;
    for (var i = 0; i < G.length; i++) {
      currentAngle += unitAngle;
      nodes.push({
        id: this.n(i),
        label: '' + i,
        x: .5 + Math.sin(currentAngle) / 2,
        y: .5 + Math.cos(currentAngle) / 2,
        size: 1,
        color: this.color.default,
        weight: 0
      });
    }
    for (var i = 0; i < G.length; i++) {
      for (var j = 0; j <= i; j++) {
        if (G[i][j] || G[j][i]) {
          edges.push({
            id: this.e(i, j),
            source: this.n(i),
            target: this.n(j),
            color: this.color.default,
            size: 1,
            weight: G[i][j]
          });
        }
      }
    }

    this.graph.read({
      nodes: nodes,
      edges: edges
    });
    this.s.camera.goTo({
      x: 0,
      y: 0,
      angle: 0,
      ratio: 1
    });
    this.refresh();

    return false;
  },
  e: UndirectedGraphTracer.prototype.e,
  drawOnHover: UndirectedGraphTracer.prototype.drawOnHover,
  drawEdge: UndirectedGraphTracer.prototype.drawEdge,
  drawEdgeWeight: function drawEdgeWeight(edge, source, target, color, context, settings) {
    var prefix = settings('prefix') || '';
    if (source[prefix + 'x'] > target[prefix + 'x']) {
      var temp = source;
      source = target;
      target = temp;
    }
    WeightedDirectedGraphTracer.prototype.drawEdgeWeight.call(this, edge, source, target, color, context, settings);
  }
});

module.exports = WeightedUndirectedGraphTracer;

},{"./undirected_graph":45,"./weighted_directed_graph":46}],48:[function(require,module,exports){
'use strict';

var request = require('./request');

module.exports = function (url) {

  return request(url, {
    type: 'GET'
  });
};

},{"./request":51}],49:[function(require,module,exports){
'use strict';

var request = require('./request');

module.exports = function (url) {
  return request(url, {
    dataType: 'json',
    type: 'GET'
  });
};

},{"./request":51}],50:[function(require,module,exports){
'use strict';

var request = require('./request');

module.exports = function (url, data) {
  return request(url, {
    dataType: 'json',
    type: 'POST',
    data: JSON.stringify(data)
  });
};

},{"./request":51}],51:[function(require,module,exports){
'use strict';

var RSVP = require('rsvp');
var app = require('../../app');

var _$ = $;
var ajax = _$.ajax;
var extend = _$.extend;


var defaults = {};

module.exports = function (url) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  app.setIsLoading(true);

  return new RSVP.Promise(function (resolve, reject) {
    var callbacks = {
      success: function success(response) {
        app.setIsLoading(false);
        resolve(response);
      },
      error: function error(reason) {
        app.setIsLoading(false);
        reject(reason);
      }
    };

    var opts = extend({}, defaults, options, callbacks, {
      url: url
    });

    ajax(opts);
  });
};

},{"../../app":3,"rsvp":67}],52:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var app = require('../app');
var Toast = require('../dom/toast');

var checkLoading = function checkLoading() {
  if (app.getIsLoading()) {
    Toast.showErrorToast('Wait until it completes loading of previous file.');
    return true;
  }
  return false;
};

var getParameterByName = function getParameterByName(name) {
  var url = window.location.href;
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');

  var results = regex.exec(url);

  if (!results || results.length !== 3) {
    return null;
  }

  var _results = _slicedToArray(results, 3);

  var id = _results[2];


  return id;
};

var getHashValue = function getHashValue(key) {
  if (!key) return null;
  var hash = window.location.hash.substr(1);
  var params = hash ? hash.split('&') : [];
  for (var i = 0; i < params.length; i++) {
    var pair = params[i].split('=');
    if (pair[0] === key) {
      return pair[1];
    }
  }
  return null;
};

var setHashValue = function setHashValue(key, value) {
  if (!key || !value) return;
  var hash = window.location.hash.substr(1);
  var params = hash ? hash.split('&') : [];

  var found = false;
  for (var i = 0; i < params.length && !found; i++) {
    var pair = params[i].split('=');
    if (pair[0] === key) {
      pair[1] = value;
      params[i] = pair.join('=');
      found = true;
    }
  }
  if (!found) {
    params.push([key, value].join('='));
  }

  var newHash = params.join('&');
  window.location.hash = '#' + newHash;
};

var removeHashValue = function removeHashValue(key) {
  if (!key) return;
  var hash = window.location.hash.substr(1);
  var params = hash ? hash.split('&') : [];

  for (var i = 0; i < params.length; i++) {
    var pair = params[i].split('=');
    if (pair[0] === key) {
      params.splice(i, 1);
      break;
    }
  }

  var newHash = params.join('&');
  window.location.hash = '#' + newHash;
};

var setPath = function setPath(category, algorithm, file) {
  var path = category ? category + (algorithm ? '/' + algorithm + (file ? '/' + file : '') : '') : '';
  setHashValue('path', path);
};

var getPath = function getPath() {
  var hash = getHashValue('path');
  if (hash) {
    var parts = hash.split('/');
    return { category: parts[0], algorithm: parts[1], file: parts[2] };
  } else {
    return false;
  }
};

module.exports = {
  checkLoading: checkLoading,
  getParameterByName: getParameterByName,
  getHashValue: getHashValue,
  setHashValue: setHashValue,
  removeHashValue: removeHashValue,
  setPath: setPath,
  getPath: getPath
};

},{"../app":3,"../dom/toast":23}],53:[function(require,module,exports){
'use strict';

var loadAlgorithm = require('./load_algorithm');
var loadCategories = require('./load_categories');
var loadFile = require('./load_file');
var loadScratchPaper = require('./load_scratch_paper');
var shareScratchPaper = require('./share_scratch_paper');

module.exports = {
  loadAlgorithm: loadAlgorithm,
  loadCategories: loadCategories,
  loadFile: loadFile,
  loadScratchPaper: loadScratchPaper,
  shareScratchPaper: shareScratchPaper
};

},{"./load_algorithm":54,"./load_categories":55,"./load_file":56,"./load_scratch_paper":57,"./share_scratch_paper":58}],54:[function(require,module,exports){
'use strict';

var getJSON = require('./ajax/get_json');

var _require = require('../utils');

var getAlgorithmDir = _require.getAlgorithmDir;


module.exports = function (category, algorithm) {
  var dir = getAlgorithmDir(category, algorithm);
  return getJSON(dir + 'desc.json');
};

},{"../utils":65,"./ajax/get_json":49}],55:[function(require,module,exports){
'use strict';

var getJSON = require('./ajax/get_json');

module.exports = function () {
  return getJSON('./algorithm/category.json');
};

},{"./ajax/get_json":49}],56:[function(require,module,exports){
'use strict';

var RSVP = require('rsvp');

var app = require('../app');

var _require = require('../utils');

var getFileDir = _require.getFileDir;
var isScratchPaper = _require.isScratchPaper;

var _require2 = require('./helpers');

var checkLoading = _require2.checkLoading;
var setPath = _require2.setPath;


var get = require('./ajax/get');

var loadDataAndCode = function loadDataAndCode(dir) {
  return RSVP.hash({
    data: get(dir + 'data.js'),
    code: get(dir + 'code.js')
  });
};

var loadFileAndUpdateContent = function loadFileAndUpdateContent(dir) {
  app.getEditor().clearContent();

  return loadDataAndCode(dir).then(function (content) {
    app.updateCachedFile(dir, content);
    app.getEditor().setContent(content);
  });
};

var cachedContentExists = function cachedContentExists(cachedFile) {
  return cachedFile && cachedFile.data !== undefined && cachedFile.code !== undefined;
};

module.exports = function (category, algorithm, file, explanation) {
  return new RSVP.Promise(function (resolve, reject) {
    if (checkLoading()) {
      reject();
    } else {
      if (isScratchPaper(category)) {
        setPath(category, app.getLoadedScratch());
      } else {
        setPath(category, algorithm, file);
      }
      $('#explanation').html(explanation);

      var dir = getFileDir(category, algorithm, file);
      app.setLastFileUsed(dir);
      var cachedFile = app.getCachedFile(dir);

      if (cachedContentExists(cachedFile)) {
        app.getEditor().setContent(cachedFile);
        resolve();
      } else {
        loadFileAndUpdateContent(dir).then(resolve, reject);
      }
    }
  });
};

},{"../app":3,"../utils":65,"./ajax/get":48,"./helpers":52,"rsvp":67}],57:[function(require,module,exports){
'use strict';

var RSVP = require('rsvp');
var app = require('../app');

var _require = require('../utils');

var getFileDir = _require.getFileDir;


var getJSON = require('./ajax/get_json');
var loadAlgorithm = require('./load_algorithm');

var extractGistCode = function extractGistCode(files, name) {
  return files[name + '.js'].content;
};

module.exports = function (gistID) {
  return new RSVP.Promise(function (resolve, reject) {
    app.setLoadedScratch(gistID);

    getJSON('https://api.github.com/gists/' + gistID).then(function (_ref) {
      var files = _ref.files;


      var category = 'scratch';
      var algorithm = gistID;

      loadAlgorithm(category, algorithm).then(function (data) {

        var algoData = extractGistCode(files, 'data');
        var algoCode = extractGistCode(files, 'code');

        // update scratch paper algo code with the loaded gist code
        var dir = getFileDir(category, algorithm, 'scratch_paper');
        app.updateCachedFile(dir, {
          data: algoData,
          code: algoCode,
          'CREDIT.md': 'Shared by an anonymous user from http://parkjs814.github.io/AlgorithmVisualizer'
        });

        resolve({
          category: category,
          algorithm: algorithm,
          data: data
        });
      });
    });
  });
};

},{"../app":3,"../utils":65,"./ajax/get_json":49,"./load_algorithm":54,"rsvp":67}],58:[function(require,module,exports){
'use strict';

var RSVP = require('rsvp');
var app = require('../app');

var postJSON = require('./ajax/post_json');

var _require = require('./helpers');

var setPath = _require.setPath;


module.exports = function () {
  return new RSVP.Promise(function (resolve, reject) {
    var _app$getEditor = app.getEditor();

    var dataEditor = _app$getEditor.dataEditor;
    var codeEditor = _app$getEditor.codeEditor;


    var gist = {
      'description': 'temp',
      'public': true,
      'files': {
        'data.js': {
          'content': dataEditor.getValue()
        },
        'code.js': {
          'content': codeEditor.getValue()
        }
      }
    };

    postJSON('https://api.github.com/gists', gist).then(function (_ref) {
      var id = _ref.id;

      app.setLoadedScratch(id);
      setPath('scratch', id);
      var _location = location;
      var href = _location.href;

      $('#algorithm').html('Shared');
      resolve(href);
    });
  });
};

},{"../app":3,"./ajax/post_json":50,"./helpers":52,"rsvp":67}],59:[function(require,module,exports){
'use strict';

var TracerManager = require('./manager');
var Tracer = require('../module/tracer/tracer');

module.exports = {
  init: function init() {
    var tm = new TracerManager();
    Tracer.prototype.manager = tm;
    return tm;
  }
};

},{"../module/tracer/tracer":44,"./manager":60}],60:[function(require,module,exports){
'use strict';

var stepLimit = 1e6;

var TracerManager = function TracerManager() {
  this.timer = null;
  this.pause = false;
  this.capsules = [];
  this.interval = 500;
};

TracerManager.prototype = {
  add: function add(tracer) {

    var $container = $('<section class="module_wrapper">');
    $('.module_container').append($container);

    var capsule = {
      module: tracer.module,
      tracer: tracer,
      allocated: true,
      defaultName: null,
      $container: $container,
      isNew: true
    };

    this.capsules.push(capsule);
    return capsule;
  },
  allocate: function allocate(newTracer) {
    var selectedCapsule = null;
    var count = 0;

    $.each(this.capsules, function (i, capsule) {
      if (capsule.module === newTracer.module) {
        count++;
        if (!capsule.allocated) {
          capsule.tracer = newTracer;
          capsule.allocated = true;
          capsule.isNew = false;
          selectedCapsule = capsule;
          return false;
        }
      }
    });

    if (selectedCapsule === null) {
      count++;
      selectedCapsule = this.add(newTracer);
    }

    selectedCapsule.defaultName = newTracer.name + ' ' + count;
    selectedCapsule.order = this.order++;
    return selectedCapsule;
  },
  deallocateAll: function deallocateAll() {
    this.order = 0;
    this.reset();
    $.each(this.capsules, function (i, capsule) {
      capsule.allocated = false;
    });
  },
  removeUnallocated: function removeUnallocated() {
    var changed = false;

    this.capsules = $.grep(this.capsules, function (capsule) {
      var removed = !capsule.allocated;

      if (capsule.isNew || removed) {
        changed = true;
      }
      if (removed) {
        capsule.$container.remove();
      }

      return !removed;
    });

    if (changed) {
      this.place();
    }
  },
  place: function place() {
    var capsules = this.capsules;


    $.each(capsules, function (i, capsule) {
      var width = 100;
      var height = 100 / capsules.length;
      var top = height * capsule.order;

      capsule.$container.css({
        top: top + '%',
        width: width + '%',
        height: height + '%'
      });

      capsule.tracer.resize();
    });
  },
  resize: function resize() {
    this.command('resize');
  },
  isPause: function isPause() {
    return this.pause;
  },
  setInterval: function setInterval(interval) {
    $('#interval').val(interval);
  },
  reset: function reset() {
    this.traces = [];
    this.traceIndex = -1;
    this.stepCnt = 0;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.command('clear');
  },
  pushStep: function pushStep(capsule, step) {
    if (this.stepCnt++ > stepLimit) throw "Tracer's stack overflow";
    var len = this.traces.length;
    var last = [];
    if (len === 0) {
      this.traces.push(last);
    } else {
      last = this.traces[len - 1];
    }
    last.push($.extend(step, {
      capsule: capsule
    }));
  },
  newStep: function newStep() {
    this.traces.push([]);
  },
  pauseStep: function pauseStep() {
    if (this.traceIndex < 0) return;
    this.pause = true;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    $('#btn_pause').addClass('active');
  },
  resumeStep: function resumeStep() {
    this.pause = false;
    this.step(this.traceIndex + 1);
    $('#btn_pause').removeClass('active');
  },
  step: function step(i) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var tracer = this;

    if (isNaN(i) || i >= this.traces.length || i < 0) return;

    this.traceIndex = i;
    var trace = this.traces[i];
    trace.forEach(function (step) {
      step.capsule.tracer.processStep(step, options);
    });

    if (!options.virtual) {
      this.command('refresh');
    }

    if (this.pause) return;

    this.timer = setTimeout(function () {
      tracer.step(i + 1, options);
    }, this.interval);
  },
  prevStep: function prevStep() {
    this.command('clear');

    var finalIndex = this.traceIndex - 1;
    if (finalIndex < 0) {
      this.traceIndex = -1;
      this.command('refresh');
      return;
    }

    for (var i = 0; i < finalIndex; i++) {
      this.step(i, {
        virtual: true
      });
    }

    this.step(finalIndex);
  },
  nextStep: function nextStep() {
    this.step(this.traceIndex + 1);
  },
  visualize: function visualize() {
    this.traceIndex = -1;
    this.resumeStep();
  },
  command: function command() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var functionName = args.shift();
    $.each(this.capsules, function (i, capsule) {
      if (capsule.allocated) {
        capsule.tracer.module.prototype[functionName].apply(capsule.tracer, args);
      }
    });
  },
  findOwner: function findOwner(container) {
    var selectedCapsule = null;
    $.each(this.capsules, function (i, capsule) {
      if (capsule.$container[0] === container) {
        selectedCapsule = capsule;
        return false;
      }
    });
    return selectedCapsule.tracer;
  }
};

module.exports = TracerManager;

},{}],61:[function(require,module,exports){
'use strict';

var parse = JSON.parse;


var fromJSON = function fromJSON(obj) {
  return parse(obj, function (key, value) {
    return value === 'Infinity' ? Infinity : value;
  });
};

module.exports = fromJSON;

},{}],62:[function(require,module,exports){
'use strict';

var toJSON = require('./to_json');
var fromJSON = require('./from_json');
var refineByType = require('./refine_by_type');

module.exports = {
  toJSON: toJSON,
  fromJSON: fromJSON,
  refineByType: refineByType
};

},{"./from_json":61,"./refine_by_type":63,"./to_json":64}],63:[function(require,module,exports){
'use strict';

var refineByType = function refineByType(item) {
  return typeof item === 'number' ? refineNumber(item) : refineString(item);
};

var refineString = function refineString(str) {
  return str === '' ? ' ' : str;
};

var refineNumber = function refineNumber(num) {
  return num === Infinity ? '∞' : num;
};

module.exports = refineByType;

},{}],64:[function(require,module,exports){
'use strict';

var stringify = JSON.stringify;


var toJSON = function toJSON(obj) {
  return stringify(obj, function (key, value) {
    return value === Infinity ? 'Infinity' : value;
  });
};

module.exports = toJSON;

},{}],65:[function(require,module,exports){
'use strict';

var isScratchPaper = function isScratchPaper(category, algorithm) {
  return category == 'scratch';
};

var getAlgorithmDir = function getAlgorithmDir(category, algorithm) {
  if (isScratchPaper(category)) return './algorithm/scratch_paper/';
  return './algorithm/' + category + '/' + algorithm + '/';
};

var getFileDir = function getFileDir(category, algorithm, file) {
  if (isScratchPaper(category)) return './algorithm/scratch_paper/';
  return './algorithm/' + category + '/' + algorithm + '/' + file + '/';
};

module.exports = {
  isScratchPaper: isScratchPaper,
  getAlgorithmDir: getAlgorithmDir,
  getFileDir: getFileDir
};

},{}],66:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],67:[function(require,module,exports){
(function (process,global){
/*!
 * @overview RSVP - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/tildeio/rsvp.js/master/LICENSE
 * @version   3.2.1
 */

(function() {
    "use strict";
    function lib$rsvp$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$rsvp$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$rsvp$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$rsvp$utils$$_isArray;
    if (!Array.isArray) {
      lib$rsvp$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$rsvp$utils$$_isArray = Array.isArray;
    }

    var lib$rsvp$utils$$isArray = lib$rsvp$utils$$_isArray;

    var lib$rsvp$utils$$now = Date.now || function() { return new Date().getTime(); };

    function lib$rsvp$utils$$F() { }

    var lib$rsvp$utils$$o_create = (Object.create || function (o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (typeof o !== 'object') {
        throw new TypeError('Argument must be an object');
      }
      lib$rsvp$utils$$F.prototype = o;
      return new lib$rsvp$utils$$F();
    });
    function lib$rsvp$events$$indexOf(callbacks, callback) {
      for (var i=0, l=callbacks.length; i<l; i++) {
        if (callbacks[i] === callback) { return i; }
      }

      return -1;
    }

    function lib$rsvp$events$$callbacksFor(object) {
      var callbacks = object._promiseCallbacks;

      if (!callbacks) {
        callbacks = object._promiseCallbacks = {};
      }

      return callbacks;
    }

    var lib$rsvp$events$$default = {

      /**
        `RSVP.EventTarget.mixin` extends an object with EventTarget methods. For
        Example:

        ```javascript
        var object = {};

        RSVP.EventTarget.mixin(object);

        object.on('finished', function(event) {
          // handle event
        });

        object.trigger('finished', { detail: value });
        ```

        `EventTarget.mixin` also works with prototypes:

        ```javascript
        var Person = function() {};
        RSVP.EventTarget.mixin(Person.prototype);

        var yehuda = new Person();
        var tom = new Person();

        yehuda.on('poke', function(event) {
          console.log('Yehuda says OW');
        });

        tom.on('poke', function(event) {
          console.log('Tom says OW');
        });

        yehuda.trigger('poke');
        tom.trigger('poke');
        ```

        @method mixin
        @for RSVP.EventTarget
        @private
        @param {Object} object object to extend with EventTarget methods
      */
      'mixin': function(object) {
        object['on']      = this['on'];
        object['off']     = this['off'];
        object['trigger'] = this['trigger'];
        object._promiseCallbacks = undefined;
        return object;
      },

      /**
        Registers a callback to be executed when `eventName` is triggered

        ```javascript
        object.on('event', function(eventInfo){
          // handle the event
        });

        object.trigger('event');
        ```

        @method on
        @for RSVP.EventTarget
        @private
        @param {String} eventName name of the event to listen for
        @param {Function} callback function to be called when the event is triggered.
      */
      'on': function(eventName, callback) {
        if (typeof callback !== 'function') {
          throw new TypeError('Callback must be a function');
        }

        var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks;

        callbacks = allCallbacks[eventName];

        if (!callbacks) {
          callbacks = allCallbacks[eventName] = [];
        }

        if (lib$rsvp$events$$indexOf(callbacks, callback) === -1) {
          callbacks.push(callback);
        }
      },

      /**
        You can use `off` to stop firing a particular callback for an event:

        ```javascript
        function doStuff() { // do stuff! }
        object.on('stuff', doStuff);

        object.trigger('stuff'); // doStuff will be called

        // Unregister ONLY the doStuff callback
        object.off('stuff', doStuff);
        object.trigger('stuff'); // doStuff will NOT be called
        ```

        If you don't pass a `callback` argument to `off`, ALL callbacks for the
        event will not be executed when the event fires. For example:

        ```javascript
        var callback1 = function(){};
        var callback2 = function(){};

        object.on('stuff', callback1);
        object.on('stuff', callback2);

        object.trigger('stuff'); // callback1 and callback2 will be executed.

        object.off('stuff');
        object.trigger('stuff'); // callback1 and callback2 will not be executed!
        ```

        @method off
        @for RSVP.EventTarget
        @private
        @param {String} eventName event to stop listening to
        @param {Function} callback optional argument. If given, only the function
        given will be removed from the event's callback queue. If no `callback`
        argument is given, all callbacks will be removed from the event's callback
        queue.
      */
      'off': function(eventName, callback) {
        var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks, index;

        if (!callback) {
          allCallbacks[eventName] = [];
          return;
        }

        callbacks = allCallbacks[eventName];

        index = lib$rsvp$events$$indexOf(callbacks, callback);

        if (index !== -1) { callbacks.splice(index, 1); }
      },

      /**
        Use `trigger` to fire custom events. For example:

        ```javascript
        object.on('foo', function(){
          console.log('foo event happened!');
        });
        object.trigger('foo');
        // 'foo event happened!' logged to the console
        ```

        You can also pass a value as a second argument to `trigger` that will be
        passed as an argument to all event listeners for the event:

        ```javascript
        object.on('foo', function(value){
          console.log(value.name);
        });

        object.trigger('foo', { name: 'bar' });
        // 'bar' logged to the console
        ```

        @method trigger
        @for RSVP.EventTarget
        @private
        @param {String} eventName name of the event to be triggered
        @param {*} options optional value to be passed to any event handlers for
        the given `eventName`
      */
      'trigger': function(eventName, options, label) {
        var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks, callback;

        if (callbacks = allCallbacks[eventName]) {
          // Don't cache the callbacks.length since it may grow
          for (var i=0; i<callbacks.length; i++) {
            callback = callbacks[i];

            callback(options, label);
          }
        }
      }
    };

    var lib$rsvp$config$$config = {
      instrument: false
    };

    lib$rsvp$events$$default['mixin'](lib$rsvp$config$$config);

    function lib$rsvp$config$$configure(name, value) {
      if (name === 'onerror') {
        // handle for legacy users that expect the actual
        // error to be passed to their function added via
        // `RSVP.configure('onerror', someFunctionHere);`
        lib$rsvp$config$$config['on']('error', value);
        return;
      }

      if (arguments.length === 2) {
        lib$rsvp$config$$config[name] = value;
      } else {
        return lib$rsvp$config$$config[name];
      }
    }

    var lib$rsvp$instrument$$queue = [];

    function lib$rsvp$instrument$$scheduleFlush() {
      setTimeout(function() {
        var entry;
        for (var i = 0; i < lib$rsvp$instrument$$queue.length; i++) {
          entry = lib$rsvp$instrument$$queue[i];

          var payload = entry.payload;

          payload.guid = payload.key + payload.id;
          payload.childGuid = payload.key + payload.childId;
          if (payload.error) {
            payload.stack = payload.error.stack;
          }

          lib$rsvp$config$$config['trigger'](entry.name, entry.payload);
        }
        lib$rsvp$instrument$$queue.length = 0;
      }, 50);
    }

    function lib$rsvp$instrument$$instrument(eventName, promise, child) {
      if (1 === lib$rsvp$instrument$$queue.push({
        name: eventName,
        payload: {
          key: promise._guidKey,
          id:  promise._id,
          eventName: eventName,
          detail: promise._result,
          childId: child && child._id,
          label: promise._label,
          timeStamp: lib$rsvp$utils$$now(),
          error: lib$rsvp$config$$config["instrument-with-stack"] ? new Error(promise._label) : null
        }})) {
          lib$rsvp$instrument$$scheduleFlush();
        }
      }
    var lib$rsvp$instrument$$default = lib$rsvp$instrument$$instrument;
    function lib$rsvp$then$$then(onFulfillment, onRejection, label) {
      var parent = this;
      var state = parent._state;

      if (state === lib$rsvp$$internal$$FULFILLED && !onFulfillment || state === lib$rsvp$$internal$$REJECTED && !onRejection) {
        lib$rsvp$config$$config.instrument && lib$rsvp$instrument$$default('chained', parent, parent);
        return parent;
      }

      parent._onError = null;

      var child = new parent.constructor(lib$rsvp$$internal$$noop, label);
      var result = parent._result;

      lib$rsvp$config$$config.instrument && lib$rsvp$instrument$$default('chained', parent, child);

      if (state) {
        var callback = arguments[state - 1];
        lib$rsvp$config$$config.async(function(){
          lib$rsvp$$internal$$invokeCallback(state, child, callback, result);
        });
      } else {
        lib$rsvp$$internal$$subscribe(parent, child, onFulfillment, onRejection);
      }

      return child;
    }
    var lib$rsvp$then$$default = lib$rsvp$then$$then;
    function lib$rsvp$promise$resolve$$resolve(object, label) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$rsvp$$internal$$noop, label);
      lib$rsvp$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$rsvp$promise$resolve$$default = lib$rsvp$promise$resolve$$resolve;
    function lib$rsvp$enumerator$$makeSettledResult(state, position, value) {
      if (state === lib$rsvp$$internal$$FULFILLED) {
        return {
          state: 'fulfilled',
          value: value
        };
      } else {
         return {
          state: 'rejected',
          reason: value
        };
      }
    }

    function lib$rsvp$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor(lib$rsvp$$internal$$noop, label);
      this._abortOnReject = abortOnReject;

      if (this._validateInput(input)) {
        this._input     = input;
        this.length     = input.length;
        this._remaining = input.length;

        this._init();

        if (this.length === 0) {
          lib$rsvp$$internal$$fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            lib$rsvp$$internal$$fulfill(this.promise, this._result);
          }
        }
      } else {
        lib$rsvp$$internal$$reject(this.promise, this._validationError());
      }
    }

    var lib$rsvp$enumerator$$default = lib$rsvp$enumerator$$Enumerator;

    lib$rsvp$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$rsvp$utils$$isArray(input);
    };

    lib$rsvp$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$rsvp$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    lib$rsvp$enumerator$$Enumerator.prototype._enumerate = function() {
      var length     = this.length;
      var promise    = this.promise;
      var input      = this._input;

      for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._settleMaybeThenable = function(entry, i) {
      var c = this._instanceConstructor;
      var resolve = c.resolve;

      if (resolve === lib$rsvp$promise$resolve$$default) {
        var then = lib$rsvp$$internal$$getThen(entry);

        if (then === lib$rsvp$then$$default &&
            entry._state !== lib$rsvp$$internal$$PENDING) {
          entry._onError = null;
          this._settledAt(entry._state, i, entry._result);
        } else if (typeof then !== 'function') {
          this._remaining--;
          this._result[i] = this._makeResult(lib$rsvp$$internal$$FULFILLED, i, entry);
        } else if (c === lib$rsvp$promise$$default) {
          var promise = new c(lib$rsvp$$internal$$noop);
          lib$rsvp$$internal$$handleMaybeThenable(promise, entry, then);
          this._willSettleAt(promise, i);
        } else {
          this._willSettleAt(new c(function(resolve) { resolve(entry); }), i);
        }
      } else {
        this._willSettleAt(resolve(entry), i);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      if (lib$rsvp$utils$$isMaybeThenable(entry)) {
        this._settleMaybeThenable(entry, i);
      } else {
        this._remaining--;
        this._result[i] = this._makeResult(lib$rsvp$$internal$$FULFILLED, i, entry);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var promise = this.promise;

      if (promise._state === lib$rsvp$$internal$$PENDING) {
        this._remaining--;

        if (this._abortOnReject && state === lib$rsvp$$internal$$REJECTED) {
          lib$rsvp$$internal$$reject(promise, value);
        } else {
          this._result[i] = this._makeResult(state, i, value);
        }
      }

      if (this._remaining === 0) {
        lib$rsvp$$internal$$fulfill(promise, this._result);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._makeResult = function(state, i, value) {
      return value;
    };

    lib$rsvp$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$rsvp$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$rsvp$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$rsvp$$internal$$REJECTED, i, reason);
      });
    };
    function lib$rsvp$promise$all$$all(entries, label) {
      return new lib$rsvp$enumerator$$default(this, entries, true /* abort on reject */, label).promise;
    }
    var lib$rsvp$promise$all$$default = lib$rsvp$promise$all$$all;
    function lib$rsvp$promise$race$$race(entries, label) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$rsvp$$internal$$noop, label);

      if (!lib$rsvp$utils$$isArray(entries)) {
        lib$rsvp$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$rsvp$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$rsvp$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        lib$rsvp$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$rsvp$promise$race$$default = lib$rsvp$promise$race$$race;
    function lib$rsvp$promise$reject$$reject(reason, label) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$rsvp$$internal$$noop, label);
      lib$rsvp$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$rsvp$promise$reject$$default = lib$rsvp$promise$reject$$reject;

    var lib$rsvp$promise$$guidKey = 'rsvp_' + lib$rsvp$utils$$now() + '-';
    var lib$rsvp$promise$$counter = 0;

    function lib$rsvp$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$rsvp$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    function lib$rsvp$promise$$Promise(resolver, label) {
      this._id = lib$rsvp$promise$$counter++;
      this._label = label;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      lib$rsvp$config$$config.instrument && lib$rsvp$instrument$$default('created', this);

      if (lib$rsvp$$internal$$noop !== resolver) {
        typeof resolver !== 'function' && lib$rsvp$promise$$needsResolver();
        this instanceof lib$rsvp$promise$$Promise ? lib$rsvp$$internal$$initializePromise(this, resolver) : lib$rsvp$promise$$needsNew();
      }
    }

    var lib$rsvp$promise$$default = lib$rsvp$promise$$Promise;

    // deprecated
    lib$rsvp$promise$$Promise.cast = lib$rsvp$promise$resolve$$default;
    lib$rsvp$promise$$Promise.all = lib$rsvp$promise$all$$default;
    lib$rsvp$promise$$Promise.race = lib$rsvp$promise$race$$default;
    lib$rsvp$promise$$Promise.resolve = lib$rsvp$promise$resolve$$default;
    lib$rsvp$promise$$Promise.reject = lib$rsvp$promise$reject$$default;

    lib$rsvp$promise$$Promise.prototype = {
      constructor: lib$rsvp$promise$$Promise,

      _guidKey: lib$rsvp$promise$$guidKey,

      _onError: function (reason) {
        var promise = this;
        lib$rsvp$config$$config.after(function() {
          if (promise._onError) {
            lib$rsvp$config$$config['trigger']('error', reason, promise._label);
          }
        });
      },

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfillment
      @param {Function} onRejection
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      then: lib$rsvp$then$$default,

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection, label) {
        return this.then(undefined, onRejection, label);
      },

    /**
      `finally` will be invoked regardless of the promise's fate just as native
      try/catch/finally behaves

      Synchronous example:

      ```js
      findAuthor() {
        if (Math.random() > 0.5) {
          throw new Error();
        }
        return new Author();
      }

      try {
        return findAuthor(); // succeed or fail
      } catch(error) {
        return findOtherAuther();
      } finally {
        // always runs
        // doesn't affect the return value
      }
      ```

      Asynchronous example:

      ```js
      findAuthor().catch(function(reason){
        return findOtherAuther();
      }).finally(function(){
        // author was either found, or not
      });
      ```

      @method finally
      @param {Function} callback
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      'finally': function(callback, label) {
        var promise = this;
        var constructor = promise.constructor;

        return promise.then(function(value) {
          return constructor.resolve(callback()).then(function() {
            return value;
          });
        }, function(reason) {
          return constructor.resolve(callback()).then(function() {
            return constructor.reject(reason);
          });
        }, label);
      }
    };
    function  lib$rsvp$$internal$$withOwnPromise() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$rsvp$$internal$$noop() {}

    var lib$rsvp$$internal$$PENDING   = void 0;
    var lib$rsvp$$internal$$FULFILLED = 1;
    var lib$rsvp$$internal$$REJECTED  = 2;

    var lib$rsvp$$internal$$GET_THEN_ERROR = new lib$rsvp$$internal$$ErrorObject();

    function lib$rsvp$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$rsvp$$internal$$GET_THEN_ERROR.error = error;
        return lib$rsvp$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$rsvp$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$rsvp$$internal$$handleForeignThenable(promise, thenable, then) {
      lib$rsvp$config$$config.async(function(promise) {
        var sealed = false;
        var error = lib$rsvp$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$rsvp$$internal$$resolve(promise, value, undefined);
          } else {
            lib$rsvp$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$rsvp$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$rsvp$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$rsvp$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$rsvp$$internal$$FULFILLED) {
        lib$rsvp$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$rsvp$$internal$$REJECTED) {
        thenable._onError = null;
        lib$rsvp$$internal$$reject(promise, thenable._result);
      } else {
        lib$rsvp$$internal$$subscribe(thenable, undefined, function(value) {
          if (thenable !== value) {
            lib$rsvp$$internal$$resolve(promise, value, undefined);
          } else {
            lib$rsvp$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          lib$rsvp$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$rsvp$$internal$$handleMaybeThenable(promise, maybeThenable, then) {
      if (maybeThenable.constructor === promise.constructor &&
          then === lib$rsvp$then$$default &&
          constructor.resolve === lib$rsvp$promise$resolve$$default) {
        lib$rsvp$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        if (then === lib$rsvp$$internal$$GET_THEN_ERROR) {
          lib$rsvp$$internal$$reject(promise, lib$rsvp$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$rsvp$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$rsvp$utils$$isFunction(then)) {
          lib$rsvp$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$rsvp$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$rsvp$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$rsvp$$internal$$fulfill(promise, value);
      } else if (lib$rsvp$utils$$objectOrFunction(value)) {
        lib$rsvp$$internal$$handleMaybeThenable(promise, value, lib$rsvp$$internal$$getThen(value));
      } else {
        lib$rsvp$$internal$$fulfill(promise, value);
      }
    }

    function lib$rsvp$$internal$$publishRejection(promise) {
      if (promise._onError) {
        promise._onError(promise._result);
      }

      lib$rsvp$$internal$$publish(promise);
    }

    function lib$rsvp$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$rsvp$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$rsvp$$internal$$FULFILLED;

      if (promise._subscribers.length === 0) {
        if (lib$rsvp$config$$config.instrument) {
          lib$rsvp$instrument$$default('fulfilled', promise);
        }
      } else {
        lib$rsvp$config$$config.async(lib$rsvp$$internal$$publish, promise);
      }
    }

    function lib$rsvp$$internal$$reject(promise, reason) {
      if (promise._state !== lib$rsvp$$internal$$PENDING) { return; }
      promise._state = lib$rsvp$$internal$$REJECTED;
      promise._result = reason;
      lib$rsvp$config$$config.async(lib$rsvp$$internal$$publishRejection, promise);
    }

    function lib$rsvp$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onError = null;

      subscribers[length] = child;
      subscribers[length + lib$rsvp$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$rsvp$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$rsvp$config$$config.async(lib$rsvp$$internal$$publish, parent);
      }
    }

    function lib$rsvp$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (lib$rsvp$config$$config.instrument) {
        lib$rsvp$instrument$$default(settled === lib$rsvp$$internal$$FULFILLED ? 'fulfilled' : 'rejected', promise);
      }

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$rsvp$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$rsvp$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$rsvp$$internal$$TRY_CATCH_ERROR = new lib$rsvp$$internal$$ErrorObject();

    function lib$rsvp$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$rsvp$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$rsvp$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$rsvp$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$rsvp$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$rsvp$$internal$$tryCatch(callback, detail);

        if (value === lib$rsvp$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$rsvp$$internal$$reject(promise, lib$rsvp$$internal$$withOwnPromise());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$rsvp$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$rsvp$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$rsvp$$internal$$reject(promise, error);
      } else if (settled === lib$rsvp$$internal$$FULFILLED) {
        lib$rsvp$$internal$$fulfill(promise, value);
      } else if (settled === lib$rsvp$$internal$$REJECTED) {
        lib$rsvp$$internal$$reject(promise, value);
      }
    }

    function lib$rsvp$$internal$$initializePromise(promise, resolver) {
      var resolved = false;
      try {
        resolver(function resolvePromise(value){
          if (resolved) { return; }
          resolved = true;
          lib$rsvp$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          if (resolved) { return; }
          resolved = true;
          lib$rsvp$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$rsvp$$internal$$reject(promise, e);
      }
    }

    function lib$rsvp$all$settled$$AllSettled(Constructor, entries, label) {
      this._superConstructor(Constructor, entries, false /* don't abort on reject */, label);
    }

    lib$rsvp$all$settled$$AllSettled.prototype = lib$rsvp$utils$$o_create(lib$rsvp$enumerator$$default.prototype);
    lib$rsvp$all$settled$$AllSettled.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$all$settled$$AllSettled.prototype._makeResult = lib$rsvp$enumerator$$makeSettledResult;
    lib$rsvp$all$settled$$AllSettled.prototype._validationError = function() {
      return new Error('allSettled must be called with an array');
    };

    function lib$rsvp$all$settled$$allSettled(entries, label) {
      return new lib$rsvp$all$settled$$AllSettled(lib$rsvp$promise$$default, entries, label).promise;
    }
    var lib$rsvp$all$settled$$default = lib$rsvp$all$settled$$allSettled;
    function lib$rsvp$all$$all(array, label) {
      return lib$rsvp$promise$$default.all(array, label);
    }
    var lib$rsvp$all$$default = lib$rsvp$all$$all;
    var lib$rsvp$asap$$len = 0;
    var lib$rsvp$asap$$toString = {}.toString;
    var lib$rsvp$asap$$vertxNext;
    function lib$rsvp$asap$$asap(callback, arg) {
      lib$rsvp$asap$$queue[lib$rsvp$asap$$len] = callback;
      lib$rsvp$asap$$queue[lib$rsvp$asap$$len + 1] = arg;
      lib$rsvp$asap$$len += 2;
      if (lib$rsvp$asap$$len === 2) {
        // If len is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        lib$rsvp$asap$$scheduleFlush();
      }
    }

    var lib$rsvp$asap$$default = lib$rsvp$asap$$asap;

    var lib$rsvp$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$rsvp$asap$$browserGlobal = lib$rsvp$asap$$browserWindow || {};
    var lib$rsvp$asap$$BrowserMutationObserver = lib$rsvp$asap$$browserGlobal.MutationObserver || lib$rsvp$asap$$browserGlobal.WebKitMutationObserver;
    var lib$rsvp$asap$$isNode = typeof self === 'undefined' &&
      typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$rsvp$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$rsvp$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(lib$rsvp$asap$$flush);
      };
    }

    // vertx
    function lib$rsvp$asap$$useVertxTimer() {
      return function() {
        lib$rsvp$asap$$vertxNext(lib$rsvp$asap$$flush);
      };
    }

    function lib$rsvp$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$rsvp$asap$$BrowserMutationObserver(lib$rsvp$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$rsvp$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$rsvp$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$rsvp$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$rsvp$asap$$flush, 1);
      };
    }

    var lib$rsvp$asap$$queue = new Array(1000);
    function lib$rsvp$asap$$flush() {
      for (var i = 0; i < lib$rsvp$asap$$len; i+=2) {
        var callback = lib$rsvp$asap$$queue[i];
        var arg = lib$rsvp$asap$$queue[i+1];

        callback(arg);

        lib$rsvp$asap$$queue[i] = undefined;
        lib$rsvp$asap$$queue[i+1] = undefined;
      }

      lib$rsvp$asap$$len = 0;
    }

    function lib$rsvp$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$rsvp$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$rsvp$asap$$useVertxTimer();
      } catch(e) {
        return lib$rsvp$asap$$useSetTimeout();
      }
    }

    var lib$rsvp$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$rsvp$asap$$isNode) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useNextTick();
    } else if (lib$rsvp$asap$$BrowserMutationObserver) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useMutationObserver();
    } else if (lib$rsvp$asap$$isWorker) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useMessageChannel();
    } else if (lib$rsvp$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$attemptVertex();
    } else {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useSetTimeout();
    }
    function lib$rsvp$defer$$defer(label) {
      var deferred = {};

      deferred['promise'] = new lib$rsvp$promise$$default(function(resolve, reject) {
        deferred['resolve'] = resolve;
        deferred['reject'] = reject;
      }, label);

      return deferred;
    }
    var lib$rsvp$defer$$default = lib$rsvp$defer$$defer;
    function lib$rsvp$filter$$filter(promises, filterFn, label) {
      return lib$rsvp$promise$$default.all(promises, label).then(function(values) {
        if (!lib$rsvp$utils$$isFunction(filterFn)) {
          throw new TypeError("You must pass a function as filter's second argument.");
        }

        var length = values.length;
        var filtered = new Array(length);

        for (var i = 0; i < length; i++) {
          filtered[i] = filterFn(values[i]);
        }

        return lib$rsvp$promise$$default.all(filtered, label).then(function(filtered) {
          var results = new Array(length);
          var newLength = 0;

          for (var i = 0; i < length; i++) {
            if (filtered[i]) {
              results[newLength] = values[i];
              newLength++;
            }
          }

          results.length = newLength;

          return results;
        });
      });
    }
    var lib$rsvp$filter$$default = lib$rsvp$filter$$filter;

    function lib$rsvp$promise$hash$$PromiseHash(Constructor, object, label) {
      this._superConstructor(Constructor, object, true, label);
    }

    var lib$rsvp$promise$hash$$default = lib$rsvp$promise$hash$$PromiseHash;

    lib$rsvp$promise$hash$$PromiseHash.prototype = lib$rsvp$utils$$o_create(lib$rsvp$enumerator$$default.prototype);
    lib$rsvp$promise$hash$$PromiseHash.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$promise$hash$$PromiseHash.prototype._init = function() {
      this._result = {};
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._validateInput = function(input) {
      return input && typeof input === 'object';
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._validationError = function() {
      return new Error('Promise.hash must be called with an object');
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._enumerate = function() {
      var enumerator = this;
      var promise    = enumerator.promise;
      var input      = enumerator._input;
      var results    = [];

      for (var key in input) {
        if (promise._state === lib$rsvp$$internal$$PENDING && Object.prototype.hasOwnProperty.call(input, key)) {
          results.push({
            position: key,
            entry: input[key]
          });
        }
      }

      var length = results.length;
      enumerator._remaining = length;
      var result;

      for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        result = results[i];
        enumerator._eachEntry(result.entry, result.position);
      }
    };

    function lib$rsvp$hash$settled$$HashSettled(Constructor, object, label) {
      this._superConstructor(Constructor, object, false, label);
    }

    lib$rsvp$hash$settled$$HashSettled.prototype = lib$rsvp$utils$$o_create(lib$rsvp$promise$hash$$default.prototype);
    lib$rsvp$hash$settled$$HashSettled.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$hash$settled$$HashSettled.prototype._makeResult = lib$rsvp$enumerator$$makeSettledResult;

    lib$rsvp$hash$settled$$HashSettled.prototype._validationError = function() {
      return new Error('hashSettled must be called with an object');
    };

    function lib$rsvp$hash$settled$$hashSettled(object, label) {
      return new lib$rsvp$hash$settled$$HashSettled(lib$rsvp$promise$$default, object, label).promise;
    }
    var lib$rsvp$hash$settled$$default = lib$rsvp$hash$settled$$hashSettled;
    function lib$rsvp$hash$$hash(object, label) {
      return new lib$rsvp$promise$hash$$default(lib$rsvp$promise$$default, object, label).promise;
    }
    var lib$rsvp$hash$$default = lib$rsvp$hash$$hash;
    function lib$rsvp$map$$map(promises, mapFn, label) {
      return lib$rsvp$promise$$default.all(promises, label).then(function(values) {
        if (!lib$rsvp$utils$$isFunction(mapFn)) {
          throw new TypeError("You must pass a function as map's second argument.");
        }

        var length = values.length;
        var results = new Array(length);

        for (var i = 0; i < length; i++) {
          results[i] = mapFn(values[i]);
        }

        return lib$rsvp$promise$$default.all(results, label);
      });
    }
    var lib$rsvp$map$$default = lib$rsvp$map$$map;

    function lib$rsvp$node$$Result() {
      this.value = undefined;
    }

    var lib$rsvp$node$$ERROR = new lib$rsvp$node$$Result();
    var lib$rsvp$node$$GET_THEN_ERROR = new lib$rsvp$node$$Result();

    function lib$rsvp$node$$getThen(obj) {
      try {
       return obj.then;
      } catch(error) {
        lib$rsvp$node$$ERROR.value= error;
        return lib$rsvp$node$$ERROR;
      }
    }


    function lib$rsvp$node$$tryApply(f, s, a) {
      try {
        f.apply(s, a);
      } catch(error) {
        lib$rsvp$node$$ERROR.value = error;
        return lib$rsvp$node$$ERROR;
      }
    }

    function lib$rsvp$node$$makeObject(_, argumentNames) {
      var obj = {};
      var name;
      var i;
      var length = _.length;
      var args = new Array(length);

      for (var x = 0; x < length; x++) {
        args[x] = _[x];
      }

      for (i = 0; i < argumentNames.length; i++) {
        name = argumentNames[i];
        obj[name] = args[i + 1];
      }

      return obj;
    }

    function lib$rsvp$node$$arrayResult(_) {
      var length = _.length;
      var args = new Array(length - 1);

      for (var i = 1; i < length; i++) {
        args[i - 1] = _[i];
      }

      return args;
    }

    function lib$rsvp$node$$wrapThenable(then, promise) {
      return {
        then: function(onFulFillment, onRejection) {
          return then.call(promise, onFulFillment, onRejection);
        }
      };
    }

    function lib$rsvp$node$$denodeify(nodeFunc, options) {
      var fn = function() {
        var self = this;
        var l = arguments.length;
        var args = new Array(l + 1);
        var arg;
        var promiseInput = false;

        for (var i = 0; i < l; ++i) {
          arg = arguments[i];

          if (!promiseInput) {
            // TODO: clean this up
            promiseInput = lib$rsvp$node$$needsPromiseInput(arg);
            if (promiseInput === lib$rsvp$node$$GET_THEN_ERROR) {
              var p = new lib$rsvp$promise$$default(lib$rsvp$$internal$$noop);
              lib$rsvp$$internal$$reject(p, lib$rsvp$node$$GET_THEN_ERROR.value);
              return p;
            } else if (promiseInput && promiseInput !== true) {
              arg = lib$rsvp$node$$wrapThenable(promiseInput, arg);
            }
          }
          args[i] = arg;
        }

        var promise = new lib$rsvp$promise$$default(lib$rsvp$$internal$$noop);

        args[l] = function(err, val) {
          if (err)
            lib$rsvp$$internal$$reject(promise, err);
          else if (options === undefined)
            lib$rsvp$$internal$$resolve(promise, val);
          else if (options === true)
            lib$rsvp$$internal$$resolve(promise, lib$rsvp$node$$arrayResult(arguments));
          else if (lib$rsvp$utils$$isArray(options))
            lib$rsvp$$internal$$resolve(promise, lib$rsvp$node$$makeObject(arguments, options));
          else
            lib$rsvp$$internal$$resolve(promise, val);
        };

        if (promiseInput) {
          return lib$rsvp$node$$handlePromiseInput(promise, args, nodeFunc, self);
        } else {
          return lib$rsvp$node$$handleValueInput(promise, args, nodeFunc, self);
        }
      };

      fn.__proto__ = nodeFunc;

      return fn;
    }

    var lib$rsvp$node$$default = lib$rsvp$node$$denodeify;

    function lib$rsvp$node$$handleValueInput(promise, args, nodeFunc, self) {
      var result = lib$rsvp$node$$tryApply(nodeFunc, self, args);
      if (result === lib$rsvp$node$$ERROR) {
        lib$rsvp$$internal$$reject(promise, result.value);
      }
      return promise;
    }

    function lib$rsvp$node$$handlePromiseInput(promise, args, nodeFunc, self){
      return lib$rsvp$promise$$default.all(args).then(function(args){
        var result = lib$rsvp$node$$tryApply(nodeFunc, self, args);
        if (result === lib$rsvp$node$$ERROR) {
          lib$rsvp$$internal$$reject(promise, result.value);
        }
        return promise;
      });
    }

    function lib$rsvp$node$$needsPromiseInput(arg) {
      if (arg && typeof arg === 'object') {
        if (arg.constructor === lib$rsvp$promise$$default) {
          return true;
        } else {
          return lib$rsvp$node$$getThen(arg);
        }
      } else {
        return false;
      }
    }
    var lib$rsvp$platform$$platform;

    /* global self */
    if (typeof self === 'object') {
      lib$rsvp$platform$$platform = self;

    /* global global */
    } else if (typeof global === 'object') {
      lib$rsvp$platform$$platform = global;
    } else {
      throw new Error('no global: `self` or `global` found');
    }

    var lib$rsvp$platform$$default = lib$rsvp$platform$$platform;
    function lib$rsvp$race$$race(array, label) {
      return lib$rsvp$promise$$default.race(array, label);
    }
    var lib$rsvp$race$$default = lib$rsvp$race$$race;
    function lib$rsvp$reject$$reject(reason, label) {
      return lib$rsvp$promise$$default.reject(reason, label);
    }
    var lib$rsvp$reject$$default = lib$rsvp$reject$$reject;
    function lib$rsvp$resolve$$resolve(value, label) {
      return lib$rsvp$promise$$default.resolve(value, label);
    }
    var lib$rsvp$resolve$$default = lib$rsvp$resolve$$resolve;
    function lib$rsvp$rethrow$$rethrow(reason) {
      setTimeout(function() {
        throw reason;
      });
      throw reason;
    }
    var lib$rsvp$rethrow$$default = lib$rsvp$rethrow$$rethrow;

    // defaults
    lib$rsvp$config$$config.async = lib$rsvp$asap$$default;
    lib$rsvp$config$$config.after = function(cb) {
      setTimeout(cb, 0);
    };
    var lib$rsvp$$cast = lib$rsvp$resolve$$default;
    function lib$rsvp$$async(callback, arg) {
      lib$rsvp$config$$config.async(callback, arg);
    }

    function lib$rsvp$$on() {
      lib$rsvp$config$$config['on'].apply(lib$rsvp$config$$config, arguments);
    }

    function lib$rsvp$$off() {
      lib$rsvp$config$$config['off'].apply(lib$rsvp$config$$config, arguments);
    }

    // Set up instrumentation through `window.__PROMISE_INTRUMENTATION__`
    if (typeof window !== 'undefined' && typeof window['__PROMISE_INSTRUMENTATION__'] === 'object') {
      var lib$rsvp$$callbacks = window['__PROMISE_INSTRUMENTATION__'];
      lib$rsvp$config$$configure('instrument', true);
      for (var lib$rsvp$$eventName in lib$rsvp$$callbacks) {
        if (lib$rsvp$$callbacks.hasOwnProperty(lib$rsvp$$eventName)) {
          lib$rsvp$$on(lib$rsvp$$eventName, lib$rsvp$$callbacks[lib$rsvp$$eventName]);
        }
      }
    }

    var lib$rsvp$umd$$RSVP = {
      'race': lib$rsvp$race$$default,
      'Promise': lib$rsvp$promise$$default,
      'allSettled': lib$rsvp$all$settled$$default,
      'hash': lib$rsvp$hash$$default,
      'hashSettled': lib$rsvp$hash$settled$$default,
      'denodeify': lib$rsvp$node$$default,
      'on': lib$rsvp$$on,
      'off': lib$rsvp$$off,
      'map': lib$rsvp$map$$default,
      'filter': lib$rsvp$filter$$default,
      'resolve': lib$rsvp$resolve$$default,
      'reject': lib$rsvp$reject$$default,
      'all': lib$rsvp$all$$default,
      'rethrow': lib$rsvp$rethrow$$default,
      'defer': lib$rsvp$defer$$default,
      'EventTarget': lib$rsvp$events$$default,
      'configure': lib$rsvp$config$$configure,
      'async': lib$rsvp$$async
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$rsvp$umd$$RSVP; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$rsvp$umd$$RSVP;
    } else if (typeof lib$rsvp$platform$$default !== 'undefined') {
      lib$rsvp$platform$$default['RSVP'] = lib$rsvp$umd$$RSVP;
    }
}).call(this);


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":66}]},{},[27])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAvY2FjaGUuanMiLCJqcy9hcHAvY29uc3RydWN0b3IuanMiLCJqcy9hcHAvaW5kZXguanMiLCJqcy9kb20vYWRkX2NhdGVnb3JpZXMuanMiLCJqcy9kb20vYWRkX2ZpbGVzLmpzIiwianMvZG9tL2luZGV4LmpzIiwianMvZG9tL2xvYWRpbmdfc2xpZGVyLmpzIiwianMvZG9tL3NldHVwL2luZGV4LmpzIiwianMvZG9tL3NldHVwL3NldHVwX2RpdmlkZXJzLmpzIiwianMvZG9tL3NldHVwL3NldHVwX2RvY3VtZW50LmpzIiwianMvZG9tL3NldHVwL3NldHVwX2ZpbGVzX2Jhci5qcyIsImpzL2RvbS9zZXR1cC9zZXR1cF9pbnRlcnZhbC5qcyIsImpzL2RvbS9zZXR1cC9zZXR1cF9tb2R1bGVfY29udGFpbmVyLmpzIiwianMvZG9tL3NldHVwL3NldHVwX3Bvd2VyZWRfYnkuanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfc2NyYXRjaF9wYXBlci5qcyIsImpzL2RvbS9zZXR1cC9zZXR1cF9zaWRlX21lbnUuanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfdG9wX21lbnUuanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfd2luZG93LmpzIiwianMvZG9tL3Nob3dfYWxnb3JpdGhtLmpzIiwianMvZG9tL3Nob3dfZGVzY3JpcHRpb24uanMiLCJqcy9kb20vc2hvd19maXJzdF9hbGdvcml0aG0uanMiLCJqcy9kb20vc2hvd19yZXF1ZXN0ZWRfYWxnb3JpdGhtLmpzIiwianMvZG9tL3RvYXN0LmpzIiwianMvZWRpdG9yL2NyZWF0ZS5qcyIsImpzL2VkaXRvci9leGVjdXRvci5qcyIsImpzL2VkaXRvci9pbmRleC5qcyIsImpzL2luZGV4LmpzIiwianMvbW9kdWxlL2RhdGEvYXJyYXkxZC5qcyIsImpzL21vZHVsZS9kYXRhL2FycmF5MmQuanMiLCJqcy9tb2R1bGUvZGF0YS9jb29yZGluYXRlX3N5c3RlbS5qcyIsImpzL21vZHVsZS9kYXRhL2RpcmVjdGVkX2dyYXBoLmpzIiwianMvbW9kdWxlL2RhdGEvaW5kZXguanMiLCJqcy9tb2R1bGUvZGF0YS91bmRpcmVjdGVkX2dyYXBoLmpzIiwianMvbW9kdWxlL2RhdGEvd2VpZ2h0ZWRfZGlyZWN0ZWRfZ3JhcGguanMiLCJqcy9tb2R1bGUvZGF0YS93ZWlnaHRlZF91bmRpcmVjdGVkX2dyYXBoLmpzIiwianMvbW9kdWxlL2luZGV4LmpzIiwianMvbW9kdWxlL3RyYWNlci9hcnJheTFkLmpzIiwianMvbW9kdWxlL3RyYWNlci9hcnJheTJkLmpzIiwianMvbW9kdWxlL3RyYWNlci9jaGFydC5qcyIsImpzL21vZHVsZS90cmFjZXIvY29vcmRpbmF0ZV9zeXN0ZW0uanMiLCJqcy9tb2R1bGUvdHJhY2VyL2RpcmVjdGVkX2dyYXBoLmpzIiwianMvbW9kdWxlL3RyYWNlci9pbmRleC5qcyIsImpzL21vZHVsZS90cmFjZXIvbG9nLmpzIiwianMvbW9kdWxlL3RyYWNlci90cmFjZXIuanMiLCJqcy9tb2R1bGUvdHJhY2VyL3VuZGlyZWN0ZWRfZ3JhcGguanMiLCJqcy9tb2R1bGUvdHJhY2VyL3dlaWdodGVkX2RpcmVjdGVkX2dyYXBoLmpzIiwianMvbW9kdWxlL3RyYWNlci93ZWlnaHRlZF91bmRpcmVjdGVkX2dyYXBoLmpzIiwianMvc2VydmVyL2FqYXgvZ2V0LmpzIiwianMvc2VydmVyL2FqYXgvZ2V0X2pzb24uanMiLCJqcy9zZXJ2ZXIvYWpheC9wb3N0X2pzb24uanMiLCJqcy9zZXJ2ZXIvYWpheC9yZXF1ZXN0LmpzIiwianMvc2VydmVyL2hlbHBlcnMuanMiLCJqcy9zZXJ2ZXIvaW5kZXguanMiLCJqcy9zZXJ2ZXIvbG9hZF9hbGdvcml0aG0uanMiLCJqcy9zZXJ2ZXIvbG9hZF9jYXRlZ29yaWVzLmpzIiwianMvc2VydmVyL2xvYWRfZmlsZS5qcyIsImpzL3NlcnZlci9sb2FkX3NjcmF0Y2hfcGFwZXIuanMiLCJqcy9zZXJ2ZXIvc2hhcmVfc2NyYXRjaF9wYXBlci5qcyIsImpzL3RyYWNlcl9tYW5hZ2VyL2luZGV4LmpzIiwianMvdHJhY2VyX21hbmFnZXIvbWFuYWdlci5qcyIsImpzL3RyYWNlcl9tYW5hZ2VyL3V0aWwvZnJvbV9qc29uLmpzIiwianMvdHJhY2VyX21hbmFnZXIvdXRpbC9pbmRleC5qcyIsImpzL3RyYWNlcl9tYW5hZ2VyL3V0aWwvcmVmaW5lX2J5X3R5cGUuanMiLCJqcy90cmFjZXJfbWFuYWdlci91dGlsL3RvX2pzb24uanMiLCJqcy91dGlscy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcnN2cC9kaXN0L3JzdnAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7U0FJSSxDO0lBREYsTSxNQUFBLE07OztBQUdGLElBQU0sUUFBUTtBQUNaLGdCQUFjLEVBREY7QUFFWixTQUFPO0FBRkssQ0FBZDs7QUFLQSxJQUFNLGlCQUFpQixTQUFqQixjQUFpQixDQUFDLElBQUQsRUFBVTtBQUMvQixNQUFJLENBQUMsSUFBTCxFQUFXO0FBQ1QsVUFBTSxtQkFBTjtBQUNEO0FBQ0YsQ0FKRDs7Ozs7QUFVQSxPQUFPLE9BQVAsR0FBaUI7QUFFZixlQUZlLHlCQUVELElBRkMsRUFFSztBQUNsQixtQkFBZSxJQUFmO0FBQ0EsV0FBTyxNQUFNLEtBQU4sQ0FBWSxJQUFaLENBQVA7QUFDRCxHQUxjO0FBT2Ysa0JBUGUsNEJBT0UsSUFQRixFQU9RLE9BUFIsRUFPaUI7QUFDOUIsbUJBQWUsSUFBZjtBQUNBLFFBQUksQ0FBQyxNQUFNLEtBQU4sQ0FBWSxJQUFaLENBQUwsRUFBd0I7QUFDdEIsWUFBTSxLQUFOLENBQVksSUFBWixJQUFvQixFQUFwQjtBQUNEO0FBQ0QsV0FBTyxNQUFNLEtBQU4sQ0FBWSxJQUFaLENBQVAsRUFBMEIsT0FBMUI7QUFDRCxHQWJjO0FBZWYsaUJBZmUsNkJBZUc7QUFDaEIsV0FBTyxNQUFNLFlBQWI7QUFDRCxHQWpCYztBQW1CZixpQkFuQmUsMkJBbUJDLElB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB7XG4gIGV4dGVuZFxufSA9ICQ7XG5cbmNvbnN0IGNhY2hlID0ge1xuICBsYXN0RmlsZVVzZWQ6ICcnLFxuICBmaWxlczoge31cbn07XG5cbmNvbnN0IGFzc2VydEZpbGVOYW1lID0gKG5hbWUpID0+IHtcbiAgaWYgKCFuYW1lKSB7XG4gICAgdGhyb3cgJ01pc3NpbmcgZmlsZSBuYW1lJztcbiAgfVxufTtcblxuXG4vKipcbiAqIEdsb2JhbCBhcHBsaWNhdGlvbiBjYWNoZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBnZXRDYWNoZWRGaWxlKG5hbWUpIHtcbiAgICBhc3NlcnRGaWxlTmFtZShuYW1lKTtcbiAgICByZXR1cm4gY2FjaGUuZmlsZXNbbmFtZV07XG4gIH0sXG5cbiAgdXBkYXRlQ2FjaGVkRmlsZShuYW1lLCB1cGRhdGVzKSB7XG4gICAgYXNzZXJ0RmlsZU5hbWUobmFtZSk7XG4gICAgaWYgKCFjYWNoZS5maWxlc1tuYW1lXSkge1xuICAgICAgY2FjaGUuZmlsZXNbbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgZXh0ZW5kKGNhY2hlLmZpbGVzW25hbWVdLCB1cGRhdGVzKTtcbiAgfSxcblxuICBnZXRMYXN0RmlsZVVzZWQoKSB7XG4gICAgcmV0dXJuIGNhY2hlLmxhc3RGaWxlVXNlZDtcbiAgfSxcblxuICBzZXRMYXN0RmlsZVVzZWQoZmlsZSkge1xuICAgIGNhY2hlLmxhc3RGaWxlVXNlZCA9IGZpbGU7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBFZGl0b3IgPSByZXF1aXJlKCcuLi9lZGl0b3InKTtcbmNvbnN0IFRyYWNlck1hbmFnZXIgPSByZXF1aXJlKCcuLi90cmFjZXJfbWFuYWdlcicpO1xuY29uc3QgRE9NID0gcmVxdWlyZSgnLi4vZG9tL3NldHVwJyk7XG5cbmNvbnN0IHtcbiAgc2hvd0xvYWRpbmdTbGlkZXIsXG4gIGhpZGVMb2FkaW5nU2xpZGVyXG59ID0gcmVxdWlyZSgnLi4vZG9tL2xvYWRpbmdfc2xpZGVyJyk7XG5cbmNvbnN0IHtcbiAgZ2V0RmlsZURpclxufSA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbmNvbnN0IENhY2hlID0gcmVxdWlyZSgnLi9jYWNoZScpO1xuXG5jb25zdCBzdGF0ZSA9IHtcbiAgaXNMb2FkaW5nOiBudWxsLFxuICBlZGl0b3I6IG51bGwsXG4gIHRyYWNlck1hbmFnZXI6IG51bGwsXG4gIGNhdGVnb3JpZXM6IG51bGwsXG4gIGxvYWRlZFNjcmF0Y2g6IG51bGxcbn07XG5cbmNvbnN0IGluaXRTdGF0ZSA9ICh0cmFjZXJNYW5hZ2VyKSA9PiB7XG4gIHN0YXRlLmlzTG9hZGluZyA9IGZhbHNlO1xuICBzdGF0ZS5lZGl0b3IgPSBuZXcgRWRpdG9yKHRyYWNlck1hbmFnZXIpO1xuICBzdGF0ZS50cmFjZXJNYW5hZ2VyID0gdHJhY2VyTWFuYWdlcjtcbiAgc3RhdGUuY2F0ZWdvcmllcyA9IHt9O1xuICBzdGF0ZS5sb2FkZWRTY3JhdGNoID0gbnVsbDtcbn07XG5cbi8qKlxuICogR2xvYmFsIGFwcGxpY2F0aW9uIHNpbmdsZXRvbi5cbiAqL1xuY29uc3QgQXBwID0gZnVuY3Rpb24gKCkge1xuXG4gIHRoaXMuZ2V0SXNMb2FkaW5nID0gKCkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5pc0xvYWRpbmc7XG4gIH07XG5cbiAgdGhpcy5zZXRJc0xvYWRpbmcgPSAobG9hZGluZykgPT4ge1xuICAgIHN0YXRlLmlzTG9hZGluZyA9IGxvYWRpbmc7XG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHNob3dMb2FkaW5nU2xpZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhpZGVMb2FkaW5nU2xpZGVyKCk7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuZ2V0RWRpdG9yID0gKCkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5lZGl0b3I7XG4gIH07XG5cbiAgdGhpcy5nZXRDYXRlZ29yaWVzID0gKCkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5jYXRlZ29yaWVzO1xuICB9O1xuXG4gIHRoaXMuZ2V0Q2F0ZWdvcnkgPSAobmFtZSkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5jYXRlZ29yaWVzW25hbWVdO1xuICB9O1xuXG4gIHRoaXMuc2V0Q2F0ZWdvcmllcyA9IChjYXRlZ29yaWVzKSA9PiB7XG4gICAgc3RhdGUuY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG4gIH07XG5cbiAgdGhpcy51cGRhdGVDYXRlZ29yeSA9IChuYW1lLCB1cGRhdGVzKSA9PiB7XG4gICAgJC5leHRlbmQoc3RhdGUuY2F0ZWdvcmllc1tuYW1lXSwgdXBkYXRlcyk7XG4gIH07XG5cbiAgdGhpcy5nZXRUcmFjZXJNYW5hZ2VyID0gKCkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS50cmFjZXJNYW5hZ2VyO1xuICB9O1xuXG4gIHRoaXMuZ2V0TG9hZGVkU2NyYXRjaCA9ICgpID0+IHtcbiAgICByZXR1cm4gc3RhdGUubG9hZGVkU2NyYXRjaDtcbiAgfTtcblxuICB0aGlzLnNldExvYWRlZFNjcmF0Y2ggPSAobG9hZGVkU2NyYXRjaCkgPT4ge1xuICAgIHN0YXRlLmxvYWRlZFNjcmF0Y2ggPSBsb2FkZWRTY3JhdGNoO1xuICB9O1xuXG4gIGNvbnN0IHRyYWNlck1hbmFnZXIgPSBUcmFjZXJNYW5hZ2VyLmluaXQoKTtcblxuICBpbml0U3RhdGUodHJhY2VyTWFuYWdlcik7XG4gIERPTS5zZXR1cCh0cmFjZXJNYW5hZ2VyKTtcblxufTtcblxuQXBwLnByb3RvdHlwZSA9IENhY2hlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcDtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBtYWluIGFwcGxpY2F0aW9uIGluc3RhbmNlLlxuICogR2V0cyBwb3B1bGF0ZWQgb24gcGFnZSBsb2FkLiBcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7fTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuY29uc3QgU2VydmVyID0gcmVxdWlyZSgnLi4vc2VydmVyJyk7XG5jb25zdCBzaG93QWxnb3JpdGhtID0gcmVxdWlyZSgnLi9zaG93X2FsZ29yaXRobScpO1xuXG5jb25zdCB7XG4gIGVhY2hcbn0gPSAkO1xuXG5jb25zdCBhZGRBbGdvcml0aG1Ub0NhdGVnb3J5RE9NID0gKGNhdGVnb3J5LCBzdWJMaXN0LCBhbGdvcml0aG0pID0+IHtcbiAgY29uc3QgJGFsZ29yaXRobSA9ICQoJzxidXR0b24gY2xhc3M9XCJpbmRlbnQgY29sbGFwc2VcIj4nKVxuICAgIC5hcHBlbmQoc3ViTGlzdFthbGdvcml0aG1dKVxuICAgIC5hdHRyKCdkYXRhLWFsZ29yaXRobScsIGFsZ29yaXRobSlcbiAgICAuYXR0cignZGF0YS1jYXRlZ29yeScsIGNhdGVnb3J5KVxuICAgIC5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBTZXJ2ZXIubG9hZEFsZ29yaXRobShjYXRlZ29yeSwgYWxnb3JpdGhtKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIHNob3dBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSwgZGF0YSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAkKCcjbGlzdCcpLmFwcGVuZCgkYWxnb3JpdGhtKTtcbn07XG5cbmNvbnN0IGFkZENhdGVnb3J5VG9ET00gPSAoY2F0ZWdvcnkpID0+IHtcblxuICBjb25zdCB7XG4gICAgbmFtZTogY2F0ZWdvcnlOYW1lLFxuICAgIGxpc3Q6IGNhdGVnb3J5U3ViTGlzdFxuICB9ID0gYXBwLmdldENhdGVnb3J5KGNhdGVnb3J5KTtcblxuICBjb25zdCAkY2F0ZWdvcnkgPSAkKCc8YnV0dG9uIGNsYXNzPVwiY2F0ZWdvcnlcIj4nKVxuICAgIC5hcHBlbmQoJzxpIGNsYXNzPVwiZmEgZmEtZncgZmEtY2FyZXQtcmlnaHRcIj4nKVxuICAgIC5hcHBlbmQoY2F0ZWdvcnlOYW1lKVxuICAgIC5hdHRyKCdkYXRhLWNhdGVnb3J5JywgY2F0ZWdvcnkpO1xuXG4gICRjYXRlZ29yeS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgJChgLmluZGVudFtkYXRhLWNhdGVnb3J5PVwiJHtjYXRlZ29yeX1cIl1gKS50b2dnbGVDbGFzcygnY29sbGFwc2UnKTtcbiAgICAkKHRoaXMpLmZpbmQoJ2kuZmEnKS50b2dnbGVDbGFzcygnZmEtY2FyZXQtcmlnaHQgZmEtY2FyZXQtZG93bicpO1xuICB9KTtcblxuICAkKCcjbGlzdCcpLmFwcGVuZCgkY2F0ZWdvcnkpO1xuXG4gIGVhY2goY2F0ZWdvcnlTdWJMaXN0LCAoYWxnb3JpdGhtKSA9PiB7XG4gICAgYWRkQWxnb3JpdGhtVG9DYXRlZ29yeURPTShjYXRlZ29yeSwgY2F0ZWdvcnlTdWJMaXN0LCBhbGdvcml0aG0pO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuICBlYWNoKGFwcC5nZXRDYXRlZ29yaWVzKCksIGFkZENhdGVnb3J5VG9ET00pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFNlcnZlciA9IHJlcXVpcmUoJy4uL3NlcnZlcicpO1xuXG5jb25zdCB7XG4gIGVhY2hcbn0gPSAkO1xuXG5jb25zdCBhZGRGaWxlVG9ET00gPSAoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSwgZXhwbGFuYXRpb24pID0+IHtcbiAgdmFyICRmaWxlID0gJCgnPGJ1dHRvbj4nKVxuICAgIC5hcHBlbmQoZmlsZSlcbiAgICAuYXR0cignZGF0YS1maWxlJywgZmlsZSlcbiAgICAuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgU2VydmVyLmxvYWRGaWxlKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUsIGV4cGxhbmF0aW9uKTtcbiAgICAgICQoJy5maWxlc19iYXIgPiAud3JhcHBlciA+IGJ1dHRvbicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH0pO1xuICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKS5hcHBlbmQoJGZpbGUpO1xuICByZXR1cm4gJGZpbGU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IChjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlcywgcmVxdWVzdGVkRmlsZSkgPT4ge1xuICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKS5lbXB0eSgpO1xuXG4gIGVhY2goZmlsZXMsIChmaWxlLCBleHBsYW5hdGlvbikgPT4ge1xuICAgIHZhciAkZmlsZSA9IGFkZEZpbGVUb0RPTShjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlLCBleHBsYW5hdGlvbik7XG4gICAgaWYgKHJlcXVlc3RlZEZpbGUgJiYgcmVxdWVzdGVkRmlsZSA9PSBmaWxlKSAkZmlsZS5jbGljaygpO1xuICB9KTtcblxuICBpZiAoIXJlcXVlc3RlZEZpbGUpICQoJy5maWxlc19iYXIgPiAud3JhcHBlciA+IGJ1dHRvbicpLmZpcnN0KCkuY2xpY2soKTtcbiAgJCgnLmZpbGVzX2JhciA+IC53cmFwcGVyJykuc2Nyb2xsKCk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc2hvd0FsZ29yaXRobSA9IHJlcXVpcmUoJy4vc2hvd19hbGdvcml0aG0nKTtcbmNvbnN0IGFkZENhdGVnb3JpZXMgPSByZXF1aXJlKCcuL2FkZF9jYXRlZ29yaWVzJyk7XG5jb25zdCBzaG93RGVzY3JpcHRpb24gPSByZXF1aXJlKCcuL3Nob3dfZGVzY3JpcHRpb24nKTtcbmNvbnN0IGFkZEZpbGVzID0gcmVxdWlyZSgnLi9hZGRfZmlsZXMnKTtcbmNvbnN0IHNob3dGaXJzdEFsZ29yaXRobSA9IHJlcXVpcmUoJy4vc2hvd19maXJzdF9hbGdvcml0aG0nKTtcbmNvbnN0IHNob3dSZXF1ZXN0ZWRBbGdvcml0aG0gPSByZXF1aXJlKCcuL3Nob3dfcmVxdWVzdGVkX2FsZ29yaXRobScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2hvd0FsZ29yaXRobSxcbiAgYWRkQ2F0ZWdvcmllcyxcbiAgc2hvd0Rlc2NyaXB0aW9uLFxuICBhZGRGaWxlcyxcbiAgc2hvd0ZpcnN0QWxnb3JpdGhtLFxuICBzaG93UmVxdWVzdGVkQWxnb3JpdGhtXG59OyIsIlxuY29uc3Qgc2hvd0xvYWRpbmdTbGlkZXIgPSAoKSA9PiB7XG4gICQoJyNsb2FkaW5nLXNsaWRlcicpLnJlbW92ZUNsYXNzKCdsb2FkZWQnKTtcbn07XG5cbmNvbnN0IGhpZGVMb2FkaW5nU2xpZGVyID0gKCkgPT4ge1xuICAkKCcjbG9hZGluZy1zbGlkZXInKS5hZGRDbGFzcygnbG9hZGVkJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2hvd0xvYWRpbmdTbGlkZXIsXG4gIGhpZGVMb2FkaW5nU2xpZGVyXG59O1xuIiwiY29uc3Qgc2V0dXBEaXZpZGVycyA9IHJlcXVpcmUoJy4vc2V0dXBfZGl2aWRlcnMnKTtcbmNvbnN0IHNldHVwRG9jdW1lbnQgPSByZXF1aXJlKCcuL3NldHVwX2RvY3VtZW50Jyk7XG5jb25zdCBzZXR1cEZpbGVzQmFyID0gcmVxdWlyZSgnLi9zZXR1cF9maWxlc19iYXInKTtcbmNvbnN0IHNldHVwSW50ZXJ2YWwgPSByZXF1aXJlKCcuL3NldHVwX2ludGVydmFsJyk7XG5jb25zdCBzZXR1cE1vZHVsZUNvbnRhaW5lciA9IHJlcXVpcmUoJy4vc2V0dXBfbW9kdWxlX2NvbnRhaW5lcicpO1xuY29uc3Qgc2V0dXBQb3dlcmVkQnkgPSByZXF1aXJlKCcuL3NldHVwX3Bvd2VyZWRfYnknKTtcbmNvbnN0IHNldHVwU2NyYXRjaFBhcGVyID0gcmVxdWlyZSgnLi9zZXR1cF9zY3JhdGNoX3BhcGVyJyk7XG5jb25zdCBzZXR1cFNpZGVNZW51ID0gcmVxdWlyZSgnLi9zZXR1cF9zaWRlX21lbnUnKTtcbmNvbnN0IHNldHVwVG9wTWVudSA9IHJlcXVpcmUoJy4vc2V0dXBfdG9wX21lbnUnKTtcbmNvbnN0IHNldHVwV2luZG93ID0gcmVxdWlyZSgnLi9zZXR1cF93aW5kb3cnKTtcblxuLyoqXG4gKiBJbml0aWFsaXplcyBlbGVtZW50cyBvbmNlIHRoZSBhcHAgbG9hZHMgaW4gdGhlIERPTS4gXG4gKi9cbmNvbnN0IHNldHVwID0gKCkgPT4ge1xuXG4gICQoJy5idG4gaW5wdXQnKS5jbGljaygoZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH0pO1xuXG4gIC8vIGRpdmlkZXJzXG4gIHNldHVwRGl2aWRlcnMoKTtcblxuICAvLyBkb2N1bWVudFxuICBzZXR1cERvY3VtZW50KCk7XG5cbiAgLy8gZmlsZXMgYmFyXG4gIHNldHVwRmlsZXNCYXIoKTtcblxuICAvLyBpbnRlcnZhbFxuICBzZXR1cEludGVydmFsKCk7XG5cbiAgLy8gbW9kdWxlIGNvbnRhaW5lclxuICBzZXR1cE1vZHVsZUNvbnRhaW5lcigpO1xuXG4gIC8vIHBvd2VyZWQgYnlcbiAgc2V0dXBQb3dlcmVkQnkoKTtcblxuICAvLyBzY3JhdGNoIHBhcGVyXG4gIHNldHVwU2NyYXRjaFBhcGVyKCk7XG5cbiAgLy8gc2lkZSBtZW51XG4gIHNldHVwU2lkZU1lbnUoKTtcblxuICAvLyB0b3AgbWVudVxuICBzZXR1cFRvcE1lbnUoKTtcblxuICAvLyB3aW5kb3dcbiAgc2V0dXBXaW5kb3coKTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldHVwXG59OyIsImNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uLy4uL2FwcCcpO1xuXG5jb25zdCBhZGREaXZpZGVyVG9Eb20gPSAoZGl2aWRlcikgPT4ge1xuICBjb25zdCBbdmVydGljYWwsICRmaXJzdCwgJHNlY29uZF0gPSBkaXZpZGVyO1xuICBjb25zdCAkcGFyZW50ID0gJGZpcnN0LnBhcmVudCgpO1xuICBjb25zdCB0aGlja25lc3MgPSA1O1xuXG4gIGNvbnN0ICRkaXZpZGVyID0gJCgnPGRpdiBjbGFzcz1cImRpdmlkZXJcIj4nKTtcblxuICBsZXQgZHJhZ2dpbmcgPSBmYWxzZTtcbiAgaWYgKHZlcnRpY2FsKSB7XG4gICAgJGRpdmlkZXIuYWRkQ2xhc3MoJ3ZlcnRpY2FsJyk7XG5cbiAgICBsZXQgX2xlZnQgPSAtdGhpY2tuZXNzIC8gMjtcbiAgICAkZGl2aWRlci5jc3Moe1xuICAgICAgdG9wOiAwLFxuICAgICAgYm90dG9tOiAwLFxuICAgICAgbGVmdDogX2xlZnQsXG4gICAgICB3aWR0aDogdGhpY2tuZXNzXG4gICAgfSk7XG5cbiAgICBsZXQgeDtcbiAgICAkZGl2aWRlci5tb3VzZWRvd24oKHtcbiAgICAgIHBhZ2VYXG4gICAgfSkgPT4ge1xuICAgICAgeCA9IHBhZ2VYO1xuICAgICAgZHJhZ2dpbmcgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkubW91c2Vtb3ZlKCh7XG4gICAgICBwYWdlWFxuICAgIH0pID0+IHtcbiAgICAgIGlmIChkcmFnZ2luZykge1xuICAgICAgICBjb25zdCBuZXdfbGVmdCA9ICRzZWNvbmQucG9zaXRpb24oKS5sZWZ0ICsgcGFnZVggLSB4O1xuICAgICAgICBsZXQgcGVyY2VudCA9IG5ld19sZWZ0IC8gJHBhcmVudC53aWR0aCgpICogMTAwO1xuICAgICAgICBwZXJjZW50ID0gTWF0aC5taW4oOTAsIE1hdGgubWF4KDEwLCBwZXJjZW50KSk7XG4gICAgICAgICRmaXJzdC5jc3MoJ3JpZ2h0JywgKDEwMCAtIHBlcmNlbnQpICsgJyUnKTtcbiAgICAgICAgJHNlY29uZC5jc3MoJ2xlZnQnLCBwZXJjZW50ICsgJyUnKTtcbiAgICAgICAgeCA9IHBhZ2VYO1xuICAgICAgICBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpLnJlc2l6ZSgpO1xuICAgICAgICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKS5zY3JvbGwoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24oZSkge1xuICAgICAgZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICB9KTtcblxuICB9IGVsc2Uge1xuXG4gICAgJGRpdmlkZXIuYWRkQ2xhc3MoJ2hvcml6b250YWwnKTtcbiAgICBjb25zdCBfdG9wID0gLXRoaWNrbmVzcyAvIDI7XG4gICAgJGRpdmlkZXIuY3NzKHtcbiAgICAgIHRvcDogX3RvcCxcbiAgICAgIGhlaWdodDogdGhpY2tuZXNzLFxuICAgICAgbGVmdDogMCxcbiAgICAgIHJpZ2h0OiAwXG4gICAgfSk7XG5cbiAgICBsZXQgeTtcbiAgICAkZGl2aWRlci5tb3VzZWRvd24oZnVuY3Rpb24oe1xuICAgICAgcGFnZVlcbiAgICB9KSB7XG4gICAgICB5ID0gcGFnZVk7XG4gICAgICBkcmFnZ2luZyA9IHRydWU7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5tb3VzZW1vdmUoZnVuY3Rpb24oe1xuICAgICAgcGFnZVlcbiAgICB9KSB7XG4gICAgICBpZiAoZHJhZ2dpbmcpIHtcbiAgICAgICAgY29uc3QgbmV3X3RvcCA9ICRzZWNvbmQucG9zaXRpb24oKS50b3AgKyBwYWdlWSAtIHk7XG4gICAgICAgIGxldCBwZXJjZW50ID0gbmV3X3RvcCAvICRwYXJlbnQuaGVpZ2h0KCkgKiAxMDA7XG4gICAgICAgIHBlcmNlbnQgPSBNYXRoLm1pbig5MCwgTWF0aC5tYXgoMTAsIHBlcmNlbnQpKTtcbiAgICAgICAgJGZpcnN0LmNzcygnYm90dG9tJywgKDEwMCAtIHBlcmNlbnQpICsgJyUnKTtcbiAgICAgICAgJHNlY29uZC5jc3MoJ3RvcCcsIHBlcmNlbnQgKyAnJScpO1xuICAgICAgICB5ID0gcGFnZVk7XG4gICAgICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkucmVzaXplKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5tb3VzZXVwKGZ1bmN0aW9uKGUpIHtcbiAgICAgIGRyYWdnaW5nID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICAkc2Vjb25kLmFwcGVuZCgkZGl2aWRlcik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgY29uc3QgZGl2aWRlcnMgPSBbXG4gICAgWyd2JywgJCgnLnNpZGVtZW51JyksICQoJy53b3Jrc3BhY2UnKV0sXG4gICAgWyd2JywgJCgnLnZpZXdlcl9jb250YWluZXInKSwgJCgnLmVkaXRvcl9jb250YWluZXInKV0sXG4gICAgWydoJywgJCgnLmRhdGFfY29udGFpbmVyJyksICQoJy5jb2RlX2NvbnRhaW5lcicpXVxuICBdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGRpdmlkZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgYWRkRGl2aWRlclRvRG9tKGRpdmlkZXJzW2ldKTtcbiAgfVxufSIsImNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uLy4uL2FwcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJ2EnLCBmdW5jdGlvbiAoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoIXdpbmRvdy5vcGVuKCQodGhpcykuYXR0cignaHJlZicpLCAnX2JsYW5rJykpIHtcbiAgICAgIGFsZXJ0KCdQbGVhc2UgYWxsb3cgcG9wdXBzIGZvciB0aGlzIHNpdGUnKTtcbiAgICB9XG4gIH0pO1xuXG4gICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24gKGUpIHtcbiAgICBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpLmNvbW1hbmQoJ21vdXNldXAnLCBlKTtcbiAgfSk7XG59OyIsImNvbnN0IGRlZmluaXRlbHlCaWdnZXIgPSAoeCwgeSkgPT4geCA+ICh5ICsgMik7XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuXG4gICQoJy5maWxlc19iYXIgPiAuYnRuLWxlZnQnKS5jbGljaygoKSA9PiB7XG4gICAgY29uc3QgJHdyYXBwZXIgPSAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKTtcbiAgICBjb25zdCBjbGlwV2lkdGggPSAkd3JhcHBlci53aWR0aCgpO1xuICAgIGNvbnN0IHNjcm9sbExlZnQgPSAkd3JhcHBlci5zY3JvbGxMZWZ0KCk7XG5cbiAgICAkKCR3cmFwcGVyLmNoaWxkcmVuKCdidXR0b24nKS5nZXQoKS5yZXZlcnNlKCkpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBsZWZ0ID0gJCh0aGlzKS5wb3NpdGlvbigpLmxlZnQ7XG4gICAgICBjb25zdCByaWdodCA9IGxlZnQgKyAkKHRoaXMpLm91dGVyV2lkdGgoKTtcbiAgICAgIGlmICgwID4gbGVmdCkge1xuICAgICAgICAkd3JhcHBlci5zY3JvbGxMZWZ0KHNjcm9sbExlZnQgKyByaWdodCAtIGNsaXBXaWR0aCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgJCgnLmZpbGVzX2JhciA+IC5idG4tcmlnaHQnKS5jbGljaygoKSA9PiB7XG4gICAgY29uc3QgJHdyYXBwZXIgPSAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKTtcbiAgICBjb25zdCBjbGlwV2lkdGggPSAkd3JhcHBlci53aWR0aCgpO1xuICAgIGNvbnN0IHNjcm9sbExlZnQgPSAkd3JhcHBlci5zY3JvbGxMZWZ0KCk7XG5cbiAgICAkd3JhcHBlci5jaGlsZHJlbignYnV0dG9uJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGxlZnQgPSAkKHRoaXMpLnBvc2l0aW9uKCkubGVmdDtcbiAgICAgIGNvbnN0IHJpZ2h0ID0gbGVmdCArICQodGhpcykub3V0ZXJXaWR0aCgpO1xuICAgICAgaWYgKGNsaXBXaWR0aCA8IHJpZ2h0KSB7XG4gICAgICAgICR3cmFwcGVyLnNjcm9sbExlZnQoc2Nyb2xsTGVmdCArIGxlZnQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gICQoJy5maWxlc19iYXIgPiAud3JhcHBlcicpLnNjcm9sbChmdW5jdGlvbigpIHtcblxuICAgIGNvbnN0ICR3cmFwcGVyID0gJCgnLmZpbGVzX2JhciA+IC53cmFwcGVyJyk7XG4gICAgY29uc3QgY2xpcFdpZHRoID0gJHdyYXBwZXIud2lkdGgoKTtcbiAgICBjb25zdCAkbGVmdCA9ICR3cmFwcGVyLmNoaWxkcmVuKCdidXR0b246Zmlyc3QtY2hpbGQnKTtcbiAgICBjb25zdCAkcmlnaHQgPSAkd3JhcHBlci5jaGlsZHJlbignYnV0dG9uOmxhc3QtY2hpbGQnKTtcbiAgICBjb25zdCBsZWZ0ID0gJGxlZnQucG9zaXRpb24oKS5sZWZ0O1xuICAgIGNvbnN0IHJpZ2h0ID0gJHJpZ2h0LnBvc2l0aW9uKCkubGVmdCArICRyaWdodC5vdXRlcldpZHRoKCk7XG5cbiAgICBpZiAoZGVmaW5pdGVseUJpZ2dlcigwLCBsZWZ0KSAmJiBkZWZpbml0ZWx5QmlnZ2VyKGNsaXBXaWR0aCwgcmlnaHQpKSB7XG4gICAgICBjb25zdCBzY3JvbGxMZWZ0ID0gJHdyYXBwZXIuc2Nyb2xsTGVmdCgpO1xuICAgICAgJHdyYXBwZXIuc2Nyb2xsTGVmdChzY3JvbGxMZWZ0ICsgY2xpcFdpZHRoIC0gcmlnaHQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxlZnRlciA9IGRlZmluaXRlbHlCaWdnZXIoMCwgbGVmdCk7XG4gICAgY29uc3QgcmlnaHRlciA9IGRlZmluaXRlbHlCaWdnZXIocmlnaHQsIGNsaXBXaWR0aCk7XG4gICAgJHdyYXBwZXIudG9nZ2xlQ2xhc3MoJ3NoYWRvdy1sZWZ0JywgbGVmdGVyKTtcbiAgICAkd3JhcHBlci50b2dnbGVDbGFzcygnc2hhZG93LXJpZ2h0JywgcmlnaHRlcik7XG4gICAgJCgnLmZpbGVzX2JhciA+IC5idG4tbGVmdCcpLmF0dHIoJ2Rpc2FibGVkJywgIWxlZnRlcik7XG4gICAgJCgnLmZpbGVzX2JhciA+IC5idG4tcmlnaHQnKS5hdHRyKCdkaXNhYmxlZCcsICFyaWdodGVyKTtcbiAgfSk7XG59IiwiY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XG5jb25zdCBUb2FzdCA9IHJlcXVpcmUoJy4uL3RvYXN0Jyk7XG5cbmNvbnN0IHtcbiAgcGFyc2VGbG9hdFxufSA9IE51bWJlcjtcblxuY29uc3QgbWluSW50ZXJ2YWwgPSAwLjE7XG5jb25zdCBtYXhJbnRlcnZhbCA9IDEwO1xuY29uc3Qgc3RhcnRJbnRlcnZhbCA9IDAuNTtcbmNvbnN0IHN0ZXBJbnRlcnZhbCA9IDAuMTtcblxuY29uc3Qgbm9ybWFsaXplID0gKHNlYykgPT4ge1xuXG5cbiAgbGV0IGludGVydmFsO1xuICBsZXQgbWVzc2FnZTtcbiAgaWYgKHNlYyA8IG1pbkludGVydmFsKSB7XG4gICAgaW50ZXJ2YWwgPSBtaW5JbnRlcnZhbDtcbiAgICBtZXNzYWdlID0gYEludGVydmFsIG9mICR7c2VjfSBzZWNvbmRzIGlzIHRvbyBsb3cuIFNldHRpbmcgdG8gbWluIGFsbG93ZWQgaW50ZXJ2YWwgb2YgJHttaW5JbnRlcnZhbH0gc2Vjb25kKHMpLmA7XG4gIH0gZWxzZSBpZiAoc2VjID4gbWF4SW50ZXJ2YWwpIHtcbiAgICBpbnRlcnZhbCA9IG1heEludGVydmFsO1xuICAgIG1lc3NhZ2UgPSBgSW50ZXJ2YWwgb2YgJHtzZWN9IHNlY29uZHMgaXMgdG9vIGhpZ2guIFNldHRpbmcgdG8gbWF4IGFsbG93ZWQgaW50ZXJ2YWwgb2YgJHttYXhJbnRlcnZhbH0gc2Vjb25kKHMpLmA7XG4gIH0gZWxzZSB7XG4gICAgaW50ZXJ2YWwgPSBzZWM7XG4gICAgbWVzc2FnZSA9IGBJbnRlcnZhbCBoYXMgYmVlbiBzZXQgdG8gJHtzZWN9IHNlY29uZChzKS5gXG4gIH1cblxuICByZXR1cm4gW2ludGVydmFsLCBtZXNzYWdlXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuXG4gIGNvbnN0ICRpbnRlcnZhbCA9ICQoJyNpbnRlcnZhbCcpO1xuICAkaW50ZXJ2YWwudmFsKHN0YXJ0SW50ZXJ2YWwpO1xuICAkaW50ZXJ2YWwuYXR0cih7XG4gICAgbWF4OiBtYXhJbnRlcnZhbCxcbiAgICBtaW46IG1pbkludGVydmFsLFxuICAgIHN0ZXA6IHN0ZXBJbnRlcnZhbFxuICB9KTtcblxuICAkKCcjaW50ZXJ2YWwnKS5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgdHJhY2VyTWFuYWdlciA9IGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCk7XG4gICAgY29uc3QgW3NlY29uZHMsIG1lc3NhZ2VdID0gbm9ybWFsaXplKHBhcnNlRmxvYXQoJCh0aGlzKS52YWwoKSkpO1xuXG4gICAgJCh0aGlzKS52YWwoc2Vjb25kcyk7XG4gICAgdHJhY2VyTWFuYWdlci5pbnRlcnZhbCA9IHNlY29uZHMgKiAxMDAwO1xuICAgIFRvYXN0LnNob3dJbmZvVG9hc3QobWVzc2FnZSk7XG4gIH0pO1xufTsiLCJjb25zdCBhcHAgPSByZXF1aXJlKCcuLi8uLi9hcHAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG5cbiAgY29uc3QgJG1vZHVsZV9jb250YWluZXIgPSAkKCcubW9kdWxlX2NvbnRhaW5lcicpO1xuXG4gICRtb2R1bGVfY29udGFpbmVyLm9uKCdtb3VzZWRvd24nLCAnLm1vZHVsZV93cmFwcGVyJywgZnVuY3Rpb24oZSkge1xuICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkuZmluZE93bmVyKHRoaXMpLm1vdXNlZG93bihlKTtcbiAgfSk7XG5cbiAgJG1vZHVsZV9jb250YWluZXIub24oJ21vdXNlbW92ZScsICcubW9kdWxlX3dyYXBwZXInLCBmdW5jdGlvbihlKSB7XG4gICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5maW5kT3duZXIodGhpcykubW91c2Vtb3ZlKGUpO1xuICB9KTtcblxuICAkbW9kdWxlX2NvbnRhaW5lci5vbignRE9NTW91c2VTY3JvbGwgbW91c2V3aGVlbCcsICcubW9kdWxlX3dyYXBwZXInLCBmdW5jdGlvbihlKSB7XG4gICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5maW5kT3duZXIodGhpcykubW91c2V3aGVlbChlKTtcbiAgfSk7XG59IiwibW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG4gICQoJyNwb3dlcmVkLWJ5JykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgJCgnI3Bvd2VyZWQtYnktbGlzdCBidXR0b24nKS50b2dnbGVDbGFzcygnY29sbGFwc2UnKTtcbiAgfSk7XG59OyIsImNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uLy4uL2FwcCcpO1xuY29uc3QgU2VydmVyID0gcmVxdWlyZSgnLi4vLi4vc2VydmVyJyk7XG5jb25zdCBzaG93QWxnb3JpdGhtID0gcmVxdWlyZSgnLi4vc2hvd19hbGdvcml0aG0nKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG4gICQoJyNzY3JhdGNoLXBhcGVyJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgY2F0ZWdvcnkgPSAnc2NyYXRjaCc7XG4gICAgY29uc3QgYWxnb3JpdGhtID0gYXBwLmdldExvYWRlZFNjcmF0Y2goKTtcbiAgICBTZXJ2ZXIubG9hZEFsZ29yaXRobShjYXRlZ29yeSwgYWxnb3JpdGhtKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICBzaG93QWxnb3JpdGhtKGNhdGVnb3J5LCBhbGdvcml0aG0sIGRhdGEpO1xuICAgIH0pO1xuICB9KTtcbn07IiwiY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XG5cbmxldCBzaWRlbWVudV9wZXJjZW50O1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgJCgnI25hdmlnYXRpb24nKS5jbGljaygoKSA9PiB7XG4gICAgY29uc3QgJHNpZGVtZW51ID0gJCgnLnNpZGVtZW51Jyk7XG4gICAgY29uc3QgJHdvcmtzcGFjZSA9ICQoJy53b3Jrc3BhY2UnKTtcblxuICAgICRzaWRlbWVudS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgnLm5hdi1kcm9wZG93bicpLnRvZ2dsZUNsYXNzKCdmYS1jYXJldC1kb3duIGZhLWNhcmV0LXVwJyk7XG5cbiAgICBpZiAoJHNpZGVtZW51Lmhhc0NsYXNzKCdhY3RpdmUnKSkge1xuICAgICAgJHNpZGVtZW51LmNzcygncmlnaHQnLCAoMTAwIC0gc2lkZW1lbnVfcGVyY2VudCkgKyAnJScpO1xuICAgICAgJHdvcmtzcGFjZS5jc3MoJ2xlZnQnLCBzaWRlbWVudV9wZXJjZW50ICsgJyUnKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBzaWRlbWVudV9wZXJjZW50ID0gJHdvcmtzcGFjZS5wb3NpdGlvbigpLmxlZnQgLyAkKCdib2R5Jykud2lkdGgoKSAqIDEwMDtcbiAgICAgICRzaWRlbWVudS5jc3MoJ3JpZ2h0JywgMCk7XG4gICAgICAkd29ya3NwYWNlLmNzcygnbGVmdCcsIDApO1xuICAgIH1cblxuICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkucmVzaXplKCk7XG4gIH0pO1xufSIsImNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uLy4uL2FwcCcpO1xuY29uc3QgU2VydmVyID0gcmVxdWlyZSgnLi4vLi4vc2VydmVyJyk7XG5jb25zdCBUb2FzdCA9IHJlcXVpcmUoJy4uL3RvYXN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuXG4gIC8vIHNoYXJlZFxuICAkKCcjc2hhcmVkJykubW91c2V1cChmdW5jdGlvbigpIHtcbiAgICAkKHRoaXMpLnNlbGVjdCgpO1xuICB9KTtcblxuICAkKCcjYnRuX3NoYXJlJykuY2xpY2soZnVuY3Rpb24oKSB7XG5cbiAgICBjb25zdCAkaWNvbiA9ICQodGhpcykuZmluZCgnLmZhLXNoYXJlJyk7XG4gICAgJGljb24uYWRkQ2xhc3MoJ2ZhLXNwaW4gZmEtc3Bpbi1mYXN0ZXInKTtcblxuICAgIFNlcnZlci5zaGFyZVNjcmF0Y2hQYXBlcigpLnRoZW4oKHVybCkgPT4ge1xuICAgICAgJGljb24ucmVtb3ZlQ2xhc3MoJ2ZhLXNwaW4gZmEtc3Bpbi1mYXN0ZXInKTtcbiAgICAgICQoJyNzaGFyZWQnKS5yZW1vdmVDbGFzcygnY29sbGFwc2UnKTtcbiAgICAgICQoJyNzaGFyZWQnKS52YWwodXJsKTtcbiAgICAgIFRvYXN0LnNob3dJbmZvVG9hc3QoJ1NoYXJlYWJsZSBsaW5rIGlzIGNyZWF0ZWQuJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIGNvbnRyb2xcblxuICAkKCcjYnRuX3J1bicpLmNsaWNrKCgpID0+IHtcbiAgICAkKCcjYnRuX3RyYWNlJykuY2xpY2soKTtcbiAgICB2YXIgZXJyID0gYXBwLmdldEVkaXRvcigpLmV4ZWN1dGUoKTtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICBUb2FzdC5zaG93RXJyb3JUb2FzdChlcnIpO1xuICAgIH1cbiAgfSk7XG4gICQoJyNidG5fcGF1c2UnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICBpZiAoYXBwLmdldFRyYWNlck1hbmFnZXIoKS5pc1BhdXNlKCkpIHtcbiAgICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkucmVzdW1lU3RlcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpLnBhdXNlU3RlcCgpO1xuICAgIH1cbiAgfSk7XG4gICQoJyNidG5fcHJldicpLmNsaWNrKCgpID0+IHtcbiAgICBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpLnBhdXNlU3RlcCgpO1xuICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkucHJldlN0ZXAoKTtcbiAgfSk7XG4gICQoJyNidG5fbmV4dCcpLmNsaWNrKCgpID0+IHtcbiAgICBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpLnBhdXNlU3RlcCgpO1xuICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkubmV4dFN0ZXAoKTtcbiAgfSk7XG5cbiAgLy8gZGVzY3JpcHRpb24gJiB0cmFjZVxuXG4gICQoJyNidG5fZGVzYycpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICQoJy50YWJfY29udGFpbmVyID4gLnRhYicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCcjdGFiX2Rlc2MnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgnLnRhYl9iYXIgPiBidXR0b24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gIH0pO1xuXG4gICQoJyNidG5fdHJhY2UnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAkKCcudGFiX2NvbnRhaW5lciA+IC50YWInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgnI3RhYl9tb2R1bGUnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgnLnRhYl9iYXIgPiBidXR0b24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gIH0pO1xuXG59OyIsImNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uLy4uL2FwcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkucmVzaXplKCk7XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuXG5jb25zdCB7XG4gIGlzU2NyYXRjaFBhcGVyXG59ID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuY29uc3Qgc2hvd0Rlc2NyaXB0aW9uID0gcmVxdWlyZSgnLi9zaG93X2Rlc2NyaXB0aW9uJyk7XG5jb25zdCBhZGRGaWxlcyA9IHJlcXVpcmUoJy4vYWRkX2ZpbGVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGNhdGVnb3J5LCBhbGdvcml0aG0sIGRhdGEsIHJlcXVlc3RlZEZpbGUpID0+IHtcbiAgbGV0ICRtZW51O1xuICBsZXQgY2F0ZWdvcnlfbmFtZTtcbiAgbGV0IGFsZ29yaXRobV9uYW1lO1xuXG4gIGlmIChpc1NjcmF0Y2hQYXBlcihjYXRlZ29yeSkpIHtcbiAgICAkbWVudSA9ICQoJyNzY3JhdGNoLXBhcGVyJyk7XG4gICAgY2F0ZWdvcnlfbmFtZSA9ICdTY3JhdGNoIFBhcGVyJztcbiAgICBhbGdvcml0aG1fbmFtZSA9IGFsZ29yaXRobSA/ICdTaGFyZWQnIDogJ1RlbXBvcmFyeSc7XG4gIH0gZWxzZSB7XG4gICAgJG1lbnUgPSAkKGBbZGF0YS1jYXRlZ29yeT1cIiR7Y2F0ZWdvcnl9XCJdW2RhdGEtYWxnb3JpdGhtPVwiJHthbGdvcml0aG19XCJdYCk7XG4gICAgY29uc3QgY2F0ZWdvcnlPYmogPSBhcHAuZ2V0Q2F0ZWdvcnkoY2F0ZWdvcnkpO1xuICAgIGNhdGVnb3J5X25hbWUgPSBjYXRlZ29yeU9iai5uYW1lO1xuICAgIGFsZ29yaXRobV9uYW1lID0gY2F0ZWdvcnlPYmoubGlzdFthbGdvcml0aG1dO1xuICB9XG5cbiAgJCgnLnNpZGVtZW51IGJ1dHRvbicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgJG1lbnUuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICQoJyNjYXRlZ29yeScpLmh0bWwoY2F0ZWdvcnlfbmFtZSk7XG4gICQoJyNhbGdvcml0aG0nKS5odG1sKGFsZ29yaXRobV9uYW1lKTtcbiAgJCgnI3RhYl9kZXNjID4gLndyYXBwZXInKS5lbXB0eSgpO1xuICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKS5lbXB0eSgpO1xuICAkKCcjZXhwbGFuYXRpb24nKS5odG1sKCcnKTtcblxuICBhcHAuc2V0TGFzdEZpbGVVc2VkKG51bGwpO1xuICBhcHAuZ2V0RWRpdG9yKCkuY2xlYXJDb250ZW50KCk7XG5cbiAgY29uc3Qge1xuICAgIGZpbGVzXG4gIH0gPSBkYXRhO1xuXG4gIGRlbGV0ZSBkYXRhLmZpbGVzO1xuXG4gIHNob3dEZXNjcmlwdGlvbihkYXRhKTtcbiAgYWRkRmlsZXMoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZXMsIHJlcXVlc3RlZEZpbGUpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHtcbiAgaXNBcnJheVxufSA9IEFycmF5O1xuXG5jb25zdCB7XG4gIGVhY2hcbn0gPSAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChkYXRhKSA9PiB7XG4gIGNvbnN0ICRjb250YWluZXIgPSAkKCcjdGFiX2Rlc2MgPiAud3JhcHBlcicpO1xuICAkY29udGFpbmVyLmVtcHR5KCk7XG5cbiAgZWFjaChkYXRhLCAoa2V5LCB2YWx1ZSkgPT4ge1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgJGNvbnRhaW5lci5hcHBlbmQoJCgnPGgzPicpLmh0bWwoa2V5KSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICRjb250YWluZXIuYXBwZW5kKCQoJzxwPicpLmh0bWwodmFsdWUpKTtcblxuICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcblxuICAgICAgY29uc3QgJHVsID0gJCgnPHVsPicpO1xuICAgICAgJGNvbnRhaW5lci5hcHBlbmQoJHVsKTtcblxuICAgICAgdmFsdWUuZm9yRWFjaCgobGkpID0+IHtcbiAgICAgICAgJHVsLmFwcGVuZCgkKCc8bGk+JykuaHRtbChsaSkpO1xuICAgICAgfSk7XG5cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcblxuICAgICAgY29uc3QgJHVsID0gJCgnPHVsPicpO1xuICAgICAgJGNvbnRhaW5lci5hcHBlbmQoJHVsKTtcblxuICAgICAgZWFjaCh2YWx1ZSwgKHByb3ApID0+IHtcbiAgICAgICAgJHVsLmFwcGVuZCgkKCc8bGk+JykuYXBwZW5kKCQoJzxzdHJvbmc+JykuaHRtbChwcm9wKSkuYXBwZW5kKGAgJHt2YWx1ZVtwcm9wXX1gKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8vIGNsaWNrIHRoZSBmaXJzdCBhbGdvcml0aG0gaW4gdGhlIGZpcnN0IGNhdGVnb3J5XG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgJCgnI2xpc3QgYnV0dG9uLmNhdGVnb3J5JykuZmlyc3QoKS5jbGljaygpO1xuICAkKCcjbGlzdCBidXR0b24uY2F0ZWdvcnkgKyAuaW5kZW50JykuZmlyc3QoKS5jbGljaygpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFNlcnZlciA9IHJlcXVpcmUoJy4uL3NlcnZlcicpO1xuY29uc3Qgc2hvd0FsZ29yaXRobSA9IHJlcXVpcmUoJy4vc2hvd19hbGdvcml0aG0nKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSkgPT4ge1xuICAkKGAuY2F0ZWdvcnlbZGF0YS1jYXRlZ29yeT1cIiR7Y2F0ZWdvcnl9XCJdYCkuY2xpY2soKTtcbiAgU2VydmVyLmxvYWRBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSkudGhlbigoZGF0YSkgPT4ge1xuICAgIHNob3dBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSwgZGF0YSwgZmlsZSk7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc2hvd1RvYXN0ID0gKGRhdGEsIHR5cGUpID0+IHtcbiAgY29uc3QgJHRvYXN0ID0gJChgPGRpdiBjbGFzcz1cInRvYXN0ICR7dHlwZX1cIj5gKS5hcHBlbmQoZGF0YSk7XG5cbiAgJCgnLnRvYXN0X2NvbnRhaW5lcicpLmFwcGVuZCgkdG9hc3QpO1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAkdG9hc3QuZmFkZU91dCgoKSA9PiB7XG4gICAgICAkdG9hc3QucmVtb3ZlKCk7XG4gICAgfSk7XG4gIH0sIDMwMDApO1xufTtcblxuY29uc3Qgc2hvd0Vycm9yVG9hc3QgPSAoZXJyKSA9PiB7XG4gIHNob3dUb2FzdChlcnIsICdlcnJvcicpO1xufTtcblxuY29uc3Qgc2hvd0luZm9Ub2FzdCA9IChlcnIpID0+IHtcbiAgc2hvd1RvYXN0KGVyciwgJ2luZm8nKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzaG93RXJyb3JUb2FzdCxcbiAgc2hvd0luZm9Ub2FzdFxufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaWQpIHtcbiAgY29uc3QgZWRpdG9yID0gYWNlLmVkaXQoaWQpO1xuXG4gIGVkaXRvci5zZXRPcHRpb25zKHtcbiAgICBlbmFibGVCYXNpY0F1dG9jb21wbGV0aW9uOiB0cnVlLFxuICAgIGVuYWJsZVNuaXBwZXRzOiB0cnVlLFxuICAgIGVuYWJsZUxpdmVBdXRvY29tcGxldGlvbjogdHJ1ZVxuICB9KTtcblxuICBlZGl0b3Iuc2V0VGhlbWUoJ2FjZS90aGVtZS90b21vcnJvd19uaWdodF9laWdodGllcycpO1xuICBlZGl0b3Iuc2Vzc2lvbi5zZXRNb2RlKCdhY2UvbW9kZS9qYXZhc2NyaXB0Jyk7XG4gIGVkaXRvci4kYmxvY2tTY3JvbGxpbmcgPSBJbmZpbml0eTtcblxuICByZXR1cm4gZWRpdG9yO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGV4ZWN1dGUgPSAodHJhY2VyTWFuYWdlciwgY29kZSkgPT4ge1xuICAvLyBhbGwgbW9kdWxlcyBhdmFpbGFibGUgdG8gZXZhbCBhcmUgb2J0YWluZWQgZnJvbSB3aW5kb3dcbiAgdHJ5IHtcbiAgICB0cmFjZXJNYW5hZ2VyLmRlYWxsb2NhdGVBbGwoKTtcbiAgICBldmFsKGNvZGUpO1xuICAgIHRyYWNlck1hbmFnZXIudmlzdWFsaXplKCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBlcnI7XG4gIH0gZmluYWxseSB7XG4gICAgdHJhY2VyTWFuYWdlci5yZW1vdmVVbmFsbG9jYXRlZCgpO1xuICB9XG59O1xuXG5jb25zdCBleGVjdXRlRGF0YSA9ICh0cmFjZXJNYW5hZ2VyLCBhbGdvRGF0YSkgPT4ge1xuICByZXR1cm4gZXhlY3V0ZSh0cmFjZXJNYW5hZ2VyLCBhbGdvRGF0YSk7XG59O1xuXG5jb25zdCBleGVjdXRlRGF0YUFuZENvZGUgPSAodHJhY2VyTWFuYWdlciwgYWxnb0RhdGEsIGFsZ29Db2RlKSA9PiB7XG4gIHJldHVybiBleGVjdXRlKHRyYWNlck1hbmFnZXIsIGAke2FsZ29EYXRhfTske2FsZ29Db2RlfWApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGV4ZWN1dGVEYXRhLFxuICBleGVjdXRlRGF0YUFuZENvZGVcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBhcHAgPSByZXF1aXJlKCcuLi9hcHAnKTtcbmNvbnN0IGNyZWF0ZUVkaXRvciA9IHJlcXVpcmUoJy4vY3JlYXRlJyk7XG5jb25zdCBFeGVjdXRvciA9IHJlcXVpcmUoJy4vZXhlY3V0b3InKTtcblxuZnVuY3Rpb24gRWRpdG9yKHRyYWNlck1hbmFnZXIpIHtcbiAgaWYgKCF0cmFjZXJNYW5hZ2VyKSB7XG4gICAgdGhyb3cgJ0Nhbm5vdCBjcmVhdGUgRWRpdG9yLiBNaXNzaW5nIHRoZSB0cmFjZXJNYW5hZ2VyJztcbiAgfVxuXG4gIGFjZS5yZXF1aXJlKCdhY2UvZXh0L2xhbmd1YWdlX3Rvb2xzJyk7XG5cbiAgdGhpcy5kYXRhRWRpdG9yID0gY3JlYXRlRWRpdG9yKCdkYXRhJyk7XG4gIHRoaXMuY29kZUVkaXRvciA9IGNyZWF0ZUVkaXRvcignY29kZScpO1xuXG4gIC8vIFNldHRpbmcgZGF0YVxuXG4gIHRoaXMuc2V0RGF0YSA9IChkYXRhKSA9PiB7XG4gICAgdGhpcy5kYXRhRWRpdG9yLnNldFZhbHVlKGRhdGEsIC0xKTtcbiAgfTtcblxuICB0aGlzLnNldENvZGUgPSAoY29kZSkgPT4ge1xuICAgIHRoaXMuY29kZUVkaXRvci5zZXRWYWx1ZShjb2RlLCAtMSk7XG4gIH07XG5cbiAgdGhpcy5zZXRDb250ZW50ID0gKCh7XG4gICAgZGF0YSxcbiAgICBjb2RlXG4gIH0pID0+IHtcbiAgICB0aGlzLnNldERhdGEoZGF0YSk7XG4gICAgdGhpcy5zZXRDb2RlKGNvZGUpO1xuICB9KTtcblxuICAvLyBDbGVhcmluZyBkYXRhXG5cbiAgdGhpcy5jbGVhckRhdGEgPSAoKSA9PiB7XG4gICAgdGhpcy5kYXRhRWRpdG9yLnNldFZhbHVlKCcnKTtcbiAgfTtcblxuICB0aGlzLmNsZWFyQ29kZSA9ICgpID0+IHtcbiAgICB0aGlzLmNvZGVFZGl0b3Iuc2V0VmFsdWUoJycpO1xuICB9O1xuXG4gIHRoaXMuY2xlYXJDb250ZW50ID0gKCkgPT4ge1xuICAgIHRoaXMuY2xlYXJEYXRhKCk7XG4gICAgdGhpcy5jbGVhckNvZGUoKTtcbiAgfTtcblxuICB0aGlzLmV4ZWN1dGUgPSAoKSA9PiB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZGF0YUVkaXRvci5nZXRWYWx1ZSgpO1xuICAgIGNvbnN0IGNvZGUgPSB0aGlzLmNvZGVFZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICByZXR1cm4gRXhlY3V0b3IuZXhlY3V0ZURhdGFBbmRDb2RlKHRyYWNlck1hbmFnZXIsIGRhdGEsIGNvZGUpO1xuICB9O1xuXG4gIC8vIGxpc3RlbmVyc1xuXG4gIHRoaXMuZGF0YUVkaXRvci5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmRhdGFFZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICBjb25zdCBsYXN0RmlsZVVzZWQgPSBhcHAuZ2V0TGFzdEZpbGVVc2VkKCk7XG4gICAgaWYgKGxhc3RGaWxlVXNlZCkge1xuICAgICAgYXBwLnVwZGF0ZUNhY2hlZEZpbGUobGFzdEZpbGVVc2VkLCB7XG4gICAgICAgIGRhdGFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBFeGVjdXRvci5leGVjdXRlRGF0YSh0cmFjZXJNYW5hZ2VyLCBkYXRhKTtcbiAgfSk7XG5cbiAgdGhpcy5jb2RlRWRpdG9yLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgY29uc3QgY29kZSA9IHRoaXMuY29kZUVkaXRvci5nZXRWYWx1ZSgpO1xuICAgIGNvbnN0IGxhc3RGaWxlVXNlZCA9IGFwcC5nZXRMYXN0RmlsZVVzZWQoKTtcbiAgICBpZiAobGFzdEZpbGVVc2VkKSB7XG4gICAgICBhcHAudXBkYXRlQ2FjaGVkRmlsZShsYXN0RmlsZVVzZWQsIHtcbiAgICAgICAgY29kZVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRWRpdG9yOyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgUlNWUCA9IHJlcXVpcmUoJ3JzdnAnKTtcbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4vYXBwJyk7XG5jb25zdCBBcHBDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vYXBwL2NvbnN0cnVjdG9yJyk7XG5jb25zdCBET00gPSByZXF1aXJlKCcuL2RvbScpO1xuY29uc3QgU2VydmVyID0gcmVxdWlyZSgnLi9zZXJ2ZXInKTtcblxuY29uc3QgbW9kdWxlcyA9IHJlcXVpcmUoJy4vbW9kdWxlJyk7XG5cbmNvbnN0IHtcbiAgZXh0ZW5kXG59ID0gJDtcblxuJC5hamF4U2V0dXAoe1xuICBjYWNoZTogZmFsc2UsXG4gIGRhdGFUeXBlOiAndGV4dCdcbn0pO1xuXG5jb25zdCB7XG4gIGlzU2NyYXRjaFBhcGVyXG59ID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5jb25zdCB7XG4gIGdldFBhdGhcbn0gPSByZXF1aXJlKCcuL3NlcnZlci9oZWxwZXJzJyk7XG5cbi8vIHNldCBnbG9iYWwgcHJvbWlzZSBlcnJvciBoYW5kbGVyXG5SU1ZQLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgY29uc29sZS5hc3NlcnQoZmFsc2UsIHJlYXNvbik7XG59KTtcblxuJCgoKSA9PiB7XG5cbiAgLy8gaW5pdGlhbGl6ZSB0aGUgYXBwbGljYXRpb24gYW5kIGF0dGFjaCBpbiB0byB0aGUgaW5zdGFuY2UgbW9kdWxlXG4gIGNvbnN0IGFwcENvbnN0cnVjdG9yID0gbmV3IEFwcENvbnN0cnVjdG9yKCk7XG4gIGV4dGVuZCh0cnVlLCBhcHAsIGFwcENvbnN0cnVjdG9yKTtcblxuICAvLyBsb2FkIG1vZHVsZXMgdG8gdGhlIGdsb2JhbCBzY29wZSBzbyB0aGV5IGNhbiBiZSBldmFsZWRcbiAgZXh0ZW5kKHRydWUsIHdpbmRvdywgbW9kdWxlcyk7XG5cbiAgU2VydmVyLmxvYWRDYXRlZ29yaWVzKCkudGhlbigoZGF0YSkgPT4ge1xuICAgIGFwcC5zZXRDYXRlZ29yaWVzKGRhdGEpO1xuICAgIERPTS5hZGRDYXRlZ29yaWVzKCk7XG5cbiAgICAvLyBkZXRlcm1pbmUgaWYgdGhlIGFwcCBpcyBsb2FkaW5nIGEgcHJlLWV4aXN0aW5nIHNjcmF0Y2gtcGFkXG4gICAgLy8gb3IgdGhlIGhvbWUgcGFnZVxuICAgIGNvbnN0IHtcbiAgICAgIGNhdGVnb3J5LFxuICAgICAgYWxnb3JpdGhtLFxuICAgICAgZmlsZVxuICAgIH0gPSBnZXRQYXRoKCk7XG4gICAgaWYgKGlzU2NyYXRjaFBhcGVyKGNhdGVnb3J5KSkge1xuICAgICAgaWYgKGFsZ29yaXRobSkge1xuICAgICAgICBTZXJ2ZXIubG9hZFNjcmF0Y2hQYXBlcihhbGdvcml0aG0pLnRoZW4oKHtjYXRlZ29yeSwgYWxnb3JpdGhtLCBkYXRhfSkgPT4ge1xuICAgICAgICAgIERPTS5zaG93QWxnb3JpdGhtKGNhdGVnb3J5LCBhbGdvcml0aG0sIGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFNlcnZlci5sb2FkQWxnb3JpdGhtKGNhdGVnb3J5KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgRE9NLnNob3dBbGdvcml0aG0oY2F0ZWdvcnksIG51bGwsIGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNhdGVnb3J5ICYmIGFsZ29yaXRobSkge1xuICAgICAgRE9NLnNob3dSZXF1ZXN0ZWRBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIERPTS5zaG93Rmlyc3RBbGdvcml0aG0oKTtcbiAgICB9XG5cbiAgfSk7XG59KTsiLCJjb25zdCBBcnJheTJEID0gcmVxdWlyZSgnLi9hcnJheTJkJyk7XG5cbmNvbnN0IHJhbmRvbSA9IChOLCBtaW4sIG1heCkgPT4ge1xuICByZXR1cm4gQXJyYXkyRC5yYW5kb20oMSwgTiwgbWluLCBtYXgpWzBdO1xufTtcblxuY29uc3QgcmFuZG9tU29ydGVkID0gKE4sIG1pbiwgbWF4KT0+IHtcbiAgcmV0dXJuIEFycmF5MkQucmFuZG9tU29ydGVkKDEsIE4sIG1pbiwgbWF4KVswXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5kb20sXG4gIHJhbmRvbVNvcnRlZFxufTtcbiIsImNvbnN0IHJhbmRvbSA9IChOLCBNLCBtaW4sIG1heCkgPT4ge1xuICBpZiAoIU4pIE4gPSAxMDtcbiAgaWYgKCFNKSBNID0gMTA7XG4gIGlmIChtaW4gPT09IHVuZGVmaW5lZCkgbWluID0gMTtcbiAgaWYgKG1heCA9PT0gdW5kZWZpbmVkKSBtYXggPSA5O1xuICB2YXIgRCA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IE47IGkrKykge1xuICAgIEQucHVzaChbXSk7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBNOyBqKyspIHtcbiAgICAgIERbaV0ucHVzaCgoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSB8IDApICsgbWluKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIEQ7XG59O1xuXG5jb25zdCByYW5kb21Tb3J0ZWQgPSAoTiwgTSwgbWluLCBtYXgpPT4ge1xuICByZXR1cm4gdGhpcy5yYW5kb20oTiwgTSwgbWluLCBtYXgpLm1hcChmdW5jdGlvbiAoYXJyKSB7XG4gICAgcmV0dXJuIGFyci5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gYSAtIGI7XG4gICAgfSk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJhbmRvbSxcbiAgcmFuZG9tU29ydGVkXG59OyIsImNvbnN0IHJhbmRvbSA9IChOLCBtaW4sIG1heCkgPT4ge1xuICBpZiAoIU4pIE4gPSA3O1xuICBpZiAoIW1pbikgbWluID0gMTtcbiAgaWYgKCFtYXgpIG1heCA9IDEwO1xuICB2YXIgQyA9IG5ldyBBcnJheShOKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIENbaV0gPSBuZXcgQXJyYXkoMik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKVxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgQ1tpXS5sZW5ndGg7IGorKylcbiAgICAgIENbaV1bal0gPSAoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSB8IDApICsgbWluO1xuICByZXR1cm4gQztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5kb21cbn07IiwiY29uc3QgcmFuZG9tID0gKE4sIHJhdGlvKSA9PiB7XG4gIGlmICghTikgTiA9IDU7XG4gIGlmICghcmF0aW8pIHJhdGlvID0gLjM7XG4gIHZhciBHID0gbmV3IEFycmF5KE4pO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IE47IGkrKykge1xuICAgIEdbaV0gPSBuZXcgQXJyYXkoTik7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBOOyBqKyspIHtcbiAgICAgIGlmIChpICE9IGopIHtcbiAgICAgICAgR1tpXVtqXSA9IChNYXRoLnJhbmRvbSgpICogKDEgLyByYXRpbykgfCAwKSA9PSAwID8gMSA6IDA7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBHO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJhbmRvbVxufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IEFycmF5MUQgPSByZXF1aXJlKCcuL2FycmF5MWQnKTtcbmNvbnN0IEFycmF5MkQgPSByZXF1aXJlKCcuL2FycmF5MmQnKTtcbmNvbnN0IENvb3JkaW5hdGVTeXN0ZW0gPSByZXF1aXJlKCcuL2Nvb3JkaW5hdGVfc3lzdGVtJyk7XG5jb25zdCBEaXJlY3RlZEdyYXBoID0gcmVxdWlyZSgnLi9kaXJlY3RlZF9ncmFwaCcpO1xuY29uc3QgVW5kaXJlY3RlZEdyYXBoID0gcmVxdWlyZSgnLi91bmRpcmVjdGVkX2dyYXBoJyk7XG5jb25zdCBXZWlnaHRlZERpcmVjdGVkR3JhcGggPSByZXF1aXJlKCcuL3dlaWdodGVkX2RpcmVjdGVkX2dyYXBoJyk7XG5jb25zdCBXZWlnaHRlZFVuZGlyZWN0ZWRHcmFwaCA9IHJlcXVpcmUoJy4vd2VpZ2h0ZWRfdW5kaXJlY3RlZF9ncmFwaCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQXJyYXkxRCxcbiAgQXJyYXkyRCxcbiAgQ29vcmRpbmF0ZVN5c3RlbSxcbiAgRGlyZWN0ZWRHcmFwaCxcbiAgVW5kaXJlY3RlZEdyYXBoLFxuICBXZWlnaHRlZERpcmVjdGVkR3JhcGgsXG4gIFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoXG59OyIsImNvbnN0IHJhbmRvbSA9IChOLCByYXRpbykgPT4ge1xuICBpZiAoIU4pIE4gPSA1O1xuICBpZiAoIXJhdGlvKSByYXRpbyA9IC4zO1xuICB2YXIgRyA9IG5ldyBBcnJheShOKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIEdbaV0gPSBuZXcgQXJyYXkoTik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBOOyBqKyspIHtcbiAgICAgIGlmIChpID4gaikge1xuICAgICAgICBHW2ldW2pdID0gR1tqXVtpXSA9IChNYXRoLnJhbmRvbSgpICogKDEgLyByYXRpbykgfCAwKSA9PSAwID8gMSA6IDA7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBHO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJhbmRvbVxufTsiLCJjb25zdCByYW5kb20gPSAoTiwgcmF0aW8sIG1pbiwgbWF4KSA9PiB7XG4gIGlmICghTikgTiA9IDU7XG4gIGlmICghcmF0aW8pIHJhdGlvID0gLjM7XG4gIGlmICghbWluKSBtaW4gPSAxO1xuICBpZiAoIW1heCkgbWF4ID0gNTtcbiAgdmFyIEcgPSBuZXcgQXJyYXkoTik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XG4gICAgR1tpXSA9IG5ldyBBcnJheShOKTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IE47IGorKykge1xuICAgICAgaWYgKGkgIT0gaiAmJiAoTWF0aC5yYW5kb20oKSAqICgxIC8gcmF0aW8pIHwgMCkgPT0gMCkge1xuICAgICAgICBHW2ldW2pdID0gKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgfCAwKSArIG1pbjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIEc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmFuZG9tXG59OyIsImNvbnN0IHJhbmRvbSA9IChOLCByYXRpbywgbWluLCBtYXgpID0+IHtcbiAgaWYgKCFOKSBOID0gNTtcbiAgaWYgKCFyYXRpbykgcmF0aW8gPSAuMztcbiAgaWYgKCFtaW4pIG1pbiA9IDE7XG4gIGlmICghbWF4KSBtYXggPSA1O1xuICB2YXIgRyA9IG5ldyBBcnJheShOKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIEdbaV0gPSBuZXcgQXJyYXkoTik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBOOyBqKyspIHtcbiAgICAgIGlmIChpID4gaiAmJiAoTWF0aC5yYW5kb20oKSAqICgxIC8gcmF0aW8pIHwgMCkgPT0gMCkge1xuICAgICAgICBHW2ldW2pdID0gR1tqXVtpXSA9IChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpIHwgMCkgKyBtaW47XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBHO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJhbmRvbVxufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB0cmFjZXJzID0gcmVxdWlyZSgnLi90cmFjZXInKTtcbnZhciBkYXRhcyA9IHJlcXVpcmUoJy4vZGF0YScpO1xuXG5jb25zdCB7XG4gIGV4dGVuZFxufSA9ICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kKHRydWUsIHt9LCB0cmFjZXJzLCBkYXRhcyk7IiwiY29uc3QgQXJyYXkyRFRyYWNlciA9IHJlcXVpcmUoJy4vYXJyYXkyZCcpO1xuXG5mdW5jdGlvbiBBcnJheTFEVHJhY2VyKCkge1xuICByZXR1cm4gQXJyYXkyRFRyYWNlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5BcnJheTFEVHJhY2VyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHRydWUsIE9iamVjdC5jcmVhdGUoQXJyYXkyRFRyYWNlci5wcm90b3R5cGUpLCB7XG4gIGNvbnN0cnVjdG9yOiBBcnJheTFEVHJhY2VyLFxuICBuYW1lOiBcIkFycmF5MURUcmFjZXJcIixcbiAgX25vdGlmeTogZnVuY3Rpb24gKGlkeCwgdikge1xuICAgIEFycmF5MkRUcmFjZXIucHJvdG90eXBlLl9ub3RpZnkuY2FsbCh0aGlzLCAwLCBpZHgsIHYpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBfZGVub3RpZnk6IGZ1bmN0aW9uIChpZHgpIHtcbiAgICBBcnJheTJEVHJhY2VyLnByb3RvdHlwZS5fZGVub3RpZnkuY2FsbCh0aGlzLCAwLCBpZHgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBfc2VsZWN0OiBmdW5jdGlvbiAocywgZSkge1xuICAgIGlmIChlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIEFycmF5MkRUcmFjZXIucHJvdG90eXBlLl9zZWxlY3QuY2FsbCh0aGlzLCAwLCBzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgQXJyYXkyRFRyYWNlci5wcm90b3R5cGUuX3NlbGVjdFJvdy5jYWxsKHRoaXMsIDAsIHMsIGUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgX2Rlc2VsZWN0OiBmdW5jdGlvbiAocywgZSkge1xuICAgIGlmIChlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIEFycmF5MkRUcmFjZXIucHJvdG90eXBlLl9kZXNlbGVjdC5jYWxsKHRoaXMsIDAsIHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBBcnJheTJEVHJhY2VyLnByb3RvdHlwZS5fZGVzZWxlY3RSb3cuY2FsbCh0aGlzLCAwLCBzLCBlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIHNldERhdGE6IGZ1bmN0aW9uIChEKSB7XG4gICAgcmV0dXJuIEFycmF5MkRUcmFjZXIucHJvdG90eXBlLnNldERhdGEuY2FsbCh0aGlzLCBbRF0pO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcnJheTFEVHJhY2VyOyIsImNvbnN0IFRyYWNlciA9IHJlcXVpcmUoJy4vdHJhY2VyJyk7XG5cbmNvbnN0IHtcbiAgcmVmaW5lQnlUeXBlXG59ID0gcmVxdWlyZSgnLi4vLi4vdHJhY2VyX21hbmFnZXIvdXRpbC9pbmRleCcpO1xuXG5mdW5jdGlvbiBBcnJheTJEVHJhY2VyKCkge1xuICBpZiAoVHJhY2VyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICBBcnJheTJEVHJhY2VyLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5BcnJheTJEVHJhY2VyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHRydWUsIE9iamVjdC5jcmVhdGUoVHJhY2VyLnByb3RvdHlwZSksIHtcbiAgY29uc3RydWN0b3I6IEFycmF5MkRUcmFjZXIsXG4gIG5hbWU6ICdBcnJheTJEVHJhY2VyJyxcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJHRhYmxlID0gdGhpcy5jYXBzdWxlLiR0YWJsZSA9ICQoJzxkaXYgY2xhc3M9XCJtdGJsLXRhYmxlXCI+Jyk7XG4gICAgdGhpcy4kY29udGFpbmVyLmFwcGVuZCh0aGlzLiR0YWJsZSk7XG4gIH0sXG4gIF9ub3RpZnk6IGZ1bmN0aW9uICh4LCB5LCB2KSB7XG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgdHlwZTogJ25vdGlmeScsXG4gICAgICB4OiB4LFxuICAgICAgeTogeSxcbiAgICAgIHY6IHZcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgX2Rlbm90aWZ5OiBmdW5jdGlvbiAoeCwgeSkge1xuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgIHR5cGU6ICdkZW5vdGlmeScsXG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBfc2VsZWN0OiBmdW5jdGlvbiAoc3gsIHN5LCBleCwgZXkpIHtcbiAgICB0aGlzLnB1c2hTZWxlY3RpbmdTdGVwKCdzZWxlY3QnLCBudWxsLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBfc2VsZWN0Um93OiBmdW5jdGlvbiAoeCwgc3ksIGV5KSB7XG4gICAgdGhpcy5wdXNoU2VsZWN0aW5nU3RlcCgnc2VsZWN0JywgJ3JvdycsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIF9zZWxlY3RDb2w6IGZ1bmN0aW9uICh5LCBzeCwgZXgpIHtcbiAgICB0aGlzLnB1c2hTZWxlY3RpbmdTdGVwKCdzZWxlY3QnLCAnY29sJywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgX2Rlc2VsZWN0OiBmdW5jdGlvbiAoc3gsIHN5LCBleCwgZXkpIHtcbiAgICB0aGlzLnB1c2hTZWxlY3RpbmdTdGVwKCdkZXNlbGVjdCcsIG51bGwsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIF9kZXNlbGVjdFJvdzogZnVuY3Rpb24gKHgsIHN5LCBleSkge1xuICAgIHRoaXMucHVzaFNlbGVjdGluZ1N0ZXAoJ2Rlc2VsZWN0JywgJ3JvdycsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIF9kZXNlbGVjdENvbDogZnVuY3Rpb24gKHksIHN4LCBleCkge1xuICAgIHRoaXMucHVzaFNlbGVjdGluZ1N0ZXAoJ2Rlc2VsZWN0JywgJ2NvbCcsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIF9zZXBhcmF0ZTogZnVuY3Rpb24gKHgsIHkpIHtcbiAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICB0eXBlOiAnc2VwYXJhdGUnLFxuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgX3NlcGFyYXRlUm93OiBmdW5jdGlvbiAoeCkge1xuICAgIHRoaXMuX3NlcGFyYXRlKHgsIC0xKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgX3NlcGFyYXRlQ29sOiBmdW5jdGlvbiAoeSkge1xuICAgIHRoaXMuX3NlcGFyYXRlKC0xLCB5KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgX2Rlc2VwYXJhdGU6IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgdHlwZTogJ2Rlc2VwYXJhdGUnLFxuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgX2Rlc2VwYXJhdGVSb3c6IGZ1bmN0aW9uICh4KSB7XG4gICAgdGhpcy5fZGVzZXBhcmF0ZSh4LCAtMSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIF9kZXNlcGFyYXRlQ29sOiBmdW5jdGlvbiAoeSkge1xuICAgIHRoaXMuX2Rlc2VwYXJhdGUoLTEsIHkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBwdXNoU2VsZWN0aW5nU3RlcDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgdHlwZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICB2YXIgbW9kZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJncy5zaGlmdCgpKTtcbiAgICB2YXIgY29vcmQ7XG4gICAgc3dpdGNoIChtb2RlKSB7XG4gICAgICBjYXNlICdyb3cnOlxuICAgICAgICBjb29yZCA9IHtcbiAgICAgICAgICB4OiBhcmdzWzBdLFxuICAgICAgICAgIHN5OiBhcmdzWzFdLFxuICAgICAgICAgIGV5OiBhcmdzWzJdXG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sJzpcbiAgICAgICAgY29vcmQgPSB7XG4gICAgICAgICAgeTogYXJnc1swXSxcbiAgICAgICAgICBzeDogYXJnc1sxXSxcbiAgICAgICAgICBleDogYXJnc1syXVxuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChhcmdzWzJdID09PSB1bmRlZmluZWQgJiYgYXJnc1szXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29vcmQgPSB7XG4gICAgICAgICAgICB4OiBhcmdzWzBdLFxuICAgICAgICAgICAgeTogYXJnc1sxXVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29vcmQgPSB7XG4gICAgICAgICAgICBzeDogYXJnc1swXSxcbiAgICAgICAgICAgIHN5OiBhcmdzWzFdLFxuICAgICAgICAgICAgZXg6IGFyZ3NbMl0sXG4gICAgICAgICAgICBleTogYXJnc1szXVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIHN0ZXAgPSB7XG4gICAgICB0eXBlOiB0eXBlXG4gICAgfTtcbiAgICAkLmV4dGVuZChzdGVwLCBjb29yZCk7XG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwgc3RlcCk7XG4gIH0sXG4gIHByb2Nlc3NTdGVwOiBmdW5jdGlvbiAoc3RlcCwgb3B0aW9ucykge1xuICAgIHN3aXRjaCAoc3RlcC50eXBlKSB7XG4gICAgICBjYXNlICdub3RpZnknOlxuICAgICAgICBpZiAoc3RlcC52ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgJHJvdyA9IHRoaXMuJHRhYmxlLmZpbmQoJy5tdGJsLXJvdycpLmVxKHN0ZXAueCk7XG4gICAgICAgICAgdmFyICRjb2wgPSAkcm93LmZpbmQoJy5tdGJsLWNvbCcpLmVxKHN0ZXAueSk7XG4gICAgICAgICAgJGNvbC50ZXh0KHJlZmluZUJ5VHlwZShzdGVwLnYpKTtcbiAgICAgICAgfVxuICAgICAgY2FzZSAnZGVub3RpZnknOlxuICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgIGNhc2UgJ2Rlc2VsZWN0JzpcbiAgICAgICAgdmFyIGNvbG9yQ2xhc3MgPSBzdGVwLnR5cGUgPT0gJ3NlbGVjdCcgfHwgc3RlcC50eXBlID09ICdkZXNlbGVjdCcgPyB0aGlzLmNvbG9yQ2xhc3Muc2VsZWN0ZWQgOiB0aGlzLmNvbG9yQ2xhc3Mubm90aWZpZWQ7XG4gICAgICAgIHZhciBhZGRDbGFzcyA9IHN0ZXAudHlwZSA9PSAnc2VsZWN0JyB8fCBzdGVwLnR5cGUgPT0gJ25vdGlmeSc7XG4gICAgICAgIHZhciBzeCA9IHN0ZXAuc3g7XG4gICAgICAgIHZhciBzeSA9IHN0ZXAuc3k7XG4gICAgICAgIHZhciBleCA9IHN0ZXAuZXg7XG4gICAgICAgIHZhciBleSA9IHN0ZXAuZXk7XG4gICAgICAgIGlmIChzeCA9PT0gdW5kZWZpbmVkKSBzeCA9IHN0ZXAueDtcbiAgICAgICAgaWYgKHN5ID09PSB1bmRlZmluZWQpIHN5ID0gc3RlcC55O1xuICAgICAgICBpZiAoZXggPT09IHVuZGVmaW5lZCkgZXggPSBzdGVwLng7XG4gICAgICAgIGlmIChleSA9PT0gdW5kZWZpbmVkKSBleSA9IHN0ZXAueTtcbiAgICAgICAgdGhpcy5wYWludENvbG9yKHN4LCBzeSwgZXgsIGV5LCBjb2xvckNsYXNzLCBhZGRDbGFzcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2VwYXJhdGUnOlxuICAgICAgICB0aGlzLmRlc2VwYXJhdGUoc3RlcC54LCBzdGVwLnkpO1xuICAgICAgICB0aGlzLnNlcGFyYXRlKHN0ZXAueCwgc3RlcC55KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkZXNlcGFyYXRlJzpcbiAgICAgICAgdGhpcy5kZXNlcGFyYXRlKHN0ZXAueCwgc3RlcC55KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBUcmFjZXIucHJvdG90eXBlLnByb2Nlc3NTdGVwLmNhbGwodGhpcywgc3RlcCwgb3B0aW9ucyk7XG4gICAgfVxuICB9LFxuICBzZXREYXRhOiBmdW5jdGlvbiAoRCkge1xuICAgIHRoaXMudmlld1ggPSB0aGlzLnZpZXdZID0gMDtcbiAgICB0aGlzLnBhZGRpbmdIID0gNjtcbiAgICB0aGlzLnBhZGRpbmdWID0gMztcbiAgICB0aGlzLmZvbnRTaXplID0gMTY7XG5cbiAgICBpZiAoVHJhY2VyLnByb3RvdHlwZS5zZXREYXRhLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgIHRoaXMuJHRhYmxlLmZpbmQoJy5tdGJsLXJvdycpLmVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgJCh0aGlzKS5maW5kKCcubXRibC1jb2wnKS5lYWNoKGZ1bmN0aW9uIChqKSB7XG4gICAgICAgICAgJCh0aGlzKS50ZXh0KHJlZmluZUJ5VHlwZShEW2ldW2pdKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLiR0YWJsZS5lbXB0eSgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgRC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyICRyb3cgPSAkKCc8ZGl2IGNsYXNzPVwibXRibC1yb3dcIj4nKTtcbiAgICAgIHRoaXMuJHRhYmxlLmFwcGVuZCgkcm93KTtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgRFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICB2YXIgJGNvbCA9ICQoJzxkaXYgY2xhc3M9XCJtdGJsLWNvbFwiPicpXG4gICAgICAgICAgLmNzcyh0aGlzLmdldENlbGxDc3MoKSlcbiAgICAgICAgICAudGV4dChyZWZpbmVCeVR5cGUoRFtpXVtqXSkpO1xuICAgICAgICAkcm93LmFwcGVuZCgkY29sKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5yZXNpemUoKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgcmVzaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgVHJhY2VyLnByb3RvdHlwZS5yZXNpemUuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9LFxuICBjbGVhcjogZnVuY3Rpb24gKCkge1xuICAgIFRyYWNlci5wcm90b3R5cGUuY2xlYXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuY2xlYXJDb2xvcigpO1xuICAgIHRoaXMuZGVzZXBhcmF0ZUFsbCgpO1xuICB9LFxuICBnZXRDZWxsQ3NzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhZGRpbmc6IHRoaXMucGFkZGluZ1YudG9GaXhlZCgxKSArICdweCAnICsgdGhpcy5wYWRkaW5nSC50b0ZpeGVkKDEpICsgJ3B4JyxcbiAgICAgICdmb250LXNpemUnOiB0aGlzLmZvbnRTaXplLnRvRml4ZWQoMSkgKyAncHgnXG4gICAgfTtcbiAgfSxcbiAgcmVmcmVzaDogZnVuY3Rpb24gKCkge1xuICAgIFRyYWNlci5wcm90b3R5cGUucmVmcmVzaC5jYWxsKHRoaXMpO1xuXG4gICAgdmFyICRwYXJlbnQgPSB0aGlzLiR0YWJsZS5wYXJlbnQoKTtcbiAgICB2YXIgdG9wID0gJHBhcmVudC5oZWlnaHQoKSAvIDIgLSB0aGlzLiR0YWJsZS5oZWlnaHQoKSAvIDIgKyB0aGlzLnZpZXdZO1xuICAgIHZhciBsZWZ0ID0gJHBhcmVudC53aWR0aCgpIC8gMiAtIHRoaXMuJHRhYmxlLndpZHRoKCkgLyAyICsgdGhpcy52aWV3WDtcbiAgICB0aGlzLiR0YWJsZS5jc3MoJ21hcmdpbi10b3AnLCB0b3ApO1xuICAgIHRoaXMuJHRhYmxlLmNzcygnbWFyZ2luLWxlZnQnLCBsZWZ0KTtcbiAgfSxcbiAgbW91c2Vkb3duOiBmdW5jdGlvbiAoZSkge1xuICAgIFRyYWNlci5wcm90b3R5cGUubW91c2Vkb3duLmNhbGwodGhpcywgZSk7XG5cbiAgICB0aGlzLmRyYWdYID0gZS5wYWdlWDtcbiAgICB0aGlzLmRyYWdZID0gZS5wYWdlWTtcbiAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcbiAgfSxcbiAgbW91c2Vtb3ZlOiBmdW5jdGlvbiAoZSkge1xuICAgIFRyYWNlci5wcm90b3R5cGUubW91c2Vtb3ZlLmNhbGwodGhpcywgZSk7XG5cbiAgICBpZiAodGhpcy5kcmFnZ2luZykge1xuICAgICAgdGhpcy52aWV3WCArPSBlLnBhZ2VYIC0gdGhpcy5kcmFnWDtcbiAgICAgIHRoaXMudmlld1kgKz0gZS5wYWdlWSAtIHRoaXMuZHJhZ1k7XG4gICAgICB0aGlzLmRyYWdYID0gZS5wYWdlWDtcbiAgICAgIHRoaXMuZHJhZ1kgPSBlLnBhZ2VZO1xuICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgfVxuICB9LFxuICBtb3VzZXVwOiBmdW5jdGlvbiAoZSkge1xuICAgIFRyYWNlci5wcm90b3R5cGUubW91c2V1cC5jYWxsKHRoaXMsIGUpO1xuXG4gICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuICB9LFxuICBtb3VzZXdoZWVsOiBmdW5jdGlvbiAoZSkge1xuICAgIFRyYWNlci5wcm90b3R5cGUubW91c2V3aGVlbC5jYWxsKHRoaXMsIGUpO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUgPSBlLm9yaWdpbmFsRXZlbnQ7XG4gICAgdmFyIGRlbHRhID0gKGUud2hlZWxEZWx0YSAhPT0gdW5kZWZpbmVkICYmIGUud2hlZWxEZWx0YSkgfHxcbiAgICAgIChlLmRldGFpbCAhPT0gdW5kZWZpbmVkICYmIC1lLmRldGFpbCk7XG4gICAgdmFyIHdlaWdodCA9IDEuMDE7XG4gICAgdmFyIHJhdGlvID0gZGVsdGEgPiAwID8gMSAvIHdlaWdodCA6IHdlaWdodDtcbiAgICBpZiAodGhpcy5mb250U2l6ZSA8IDQgJiYgcmF0aW8gPCAxKSByZXR1cm47XG4gICAgaWYgKHRoaXMuZm9udFNpemUgPiA0MCAmJiByYXRpbyA+IDEpIHJldHVybjtcbiAgICB0aGlzLnBhZGRpbmdWICo9IHJhdGlvO1xuICAgIHRoaXMucGFkZGluZ0ggKj0gcmF0aW87XG4gICAgdGhpcy5mb250U2l6ZSAqPSByYXRpbztcbiAgICB0aGlzLiR0YWJsZS5maW5kKCcubXRibC1jb2wnKS5jc3ModGhpcy5nZXRDZWxsQ3NzKCkpO1xuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9LFxuICBwYWludENvbG9yOiBmdW5jdGlvbiAoc3gsIHN5LCBleCwgZXksIGNvbG9yQ2xhc3MsIGFkZENsYXNzKSB7XG4gICAgZm9yICh2YXIgaSA9IHN4OyBpIDw9IGV4OyBpKyspIHtcbiAgICAgIHZhciAkcm93ID0gdGhpcy4kdGFibGUuZmluZCgnLm10Ymwtcm93JykuZXEoaSk7XG4gICAgICBmb3IgKHZhciBqID0gc3k7IGogPD0gZXk7IGorKykge1xuICAgICAgICB2YXIgJGNvbCA9ICRyb3cuZmluZCgnLm10YmwtY29sJykuZXEoaik7XG4gICAgICAgIGlmIChhZGRDbGFzcykgJGNvbC5hZGRDbGFzcyhjb2xvckNsYXNzKTtcbiAgICAgICAgZWxzZSAkY29sLnJlbW92ZUNsYXNzKGNvbG9yQ2xhc3MpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgY2xlYXJDb2xvcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJHRhYmxlLmZpbmQoJy5tdGJsLWNvbCcpLnJlbW92ZUNsYXNzKE9iamVjdC5rZXlzKHRoaXMuY29sb3JDbGFzcykuam9pbignICcpKTtcbiAgfSxcbiAgY29sb3JDbGFzczoge1xuICAgIHNlbGVjdGVkOiAnc2VsZWN0ZWQnLFxuICAgIG5vdGlmaWVkOiAnbm90aWZpZWQnXG4gIH0sXG4gIHNlcGFyYXRlOiBmdW5jdGlvbiAoeCwgeSkge1xuICAgIHRoaXMuJHRhYmxlLmZpbmQoJy5tdGJsLXJvdycpLmVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgIHZhciAkcm93ID0gJCh0aGlzKTtcbiAgICAgIGlmIChpID09IHgpIHtcbiAgICAgICAgJHJvdy5hZnRlcigkKCc8ZGl2IGNsYXNzPVwibXRibC1lbXB0eS1yb3dcIj4nKS5hdHRyKCdkYXRhLXJvdycsIGkpKVxuICAgICAgfVxuICAgICAgJHJvdy5maW5kKCcubXRibC1jb2wnKS5lYWNoKGZ1bmN0aW9uIChqKSB7XG4gICAgICAgIHZhciAkY29sID0gJCh0aGlzKTtcbiAgICAgICAgaWYgKGogPT0geSkge1xuICAgICAgICAgICRjb2wuYWZ0ZXIoJCgnPGRpdiBjbGFzcz1cIm10YmwtZW1wdHktY29sXCI+JykuYXR0cignZGF0YS1jb2wnLCBqKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBkZXNlcGFyYXRlOiBmdW5jdGlvbiAoeCwgeSkge1xuICAgIHRoaXMuJHRhYmxlLmZpbmQoJ1tkYXRhLXJvdz0nICsgeCArICddJykucmVtb3ZlKCk7XG4gICAgdGhpcy4kdGFibGUuZmluZCgnW2RhdGEtY29sPScgKyB5ICsgJ10nKS5yZW1vdmUoKTtcbiAgfSxcbiAgZGVzZXBhcmF0ZUFsbDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJHRhYmxlLmZpbmQoJy5tdGJsLWVtcHR5LXJvdywgLm10YmwtZW1wdHktY29sJykucmVtb3ZlKCk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5MkRUcmFjZXI7IiwiY29uc3QgVHJhY2VyID0gcmVxdWlyZSgnLi90cmFjZXInKTtcblxuZnVuY3Rpb24gQ2hhcnRUcmFjZXIoKSB7XG4gIGlmIChUcmFjZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgIENoYXJ0VHJhY2VyLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbkNoYXJ0VHJhY2VyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHRydWUsIE9iamVjdC5jcmVhdGUoVHJhY2VyLnByb3RvdHlwZSksIHtcbiAgY29uc3RydWN0b3I6IENoYXJ0VHJhY2VyLFxuICBuYW1lOiAnQ2hhcnRUcmFjZXInLFxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kd3JhcHBlciA9IHRoaXMuY2Fwc3VsZS4kd3JhcHBlciA9ICQoJzxjYW52YXMgaWQ9XCJjaGFydFwiPicpO1xuICAgIHRoaXMuJGNvbnRhaW5lci5hcHBlbmQodGhpcy4kd3JhcHBlcik7XG4gIH0sXG4gIHNldERhdGE6IGZ1bmN0aW9uIChDKSB7XG4gICAgaWYgKFRyYWNlci5wcm90b3R5cGUuc2V0RGF0YS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSByZXR1cm4gdHJ1ZTtcbiAgICB2YXIgdHJhY2VyID0gdGhpcztcbiAgICB2YXIgY29sb3IgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IEMubGVuZ3RoOyBpKyspIGNvbG9yLnB1c2goJ3JnYmEoMTM2LCAxMzYsIDEzNiwgMSknKTtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIHR5cGU6ICdiYXInLFxuICAgICAgZGF0YToge1xuICAgICAgICBsYWJlbHM6IEMubWFwKFN0cmluZyksXG4gICAgICAgIGRhdGFzZXRzOiBbe1xuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3IsXG4gICAgICAgICAgZGF0YTogQ1xuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgc2NhbGVzOiB7XG4gICAgICAgICAgeUF4ZXM6IFt7XG4gICAgICAgICAgICB0aWNrczoge1xuICAgICAgICAgICAgICBiZWdpbkF0WmVybzogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1dXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuY2hhcnQgPSB0aGlzLmNhcHN1bGUuY2hhcnQgPSBuZXcgQ2hhcnQodGhpcy4kd3JhcHBlciwgZGF0YSk7XG4gIH0sXG4gIF9ub3RpZnk6IGZ1bmN0aW9uIChzLCB2KSB7XG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgdHlwZTogJ25vdGlmeScsXG4gICAgICBzOiBzLFxuICAgICAgdjogdlxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBfZGVub3RpZnk6IGZ1bmN0aW9uIChzKSB7XG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgdHlwZTogJ2Rlbm90aWZ5JyxcbiAgICAgIHM6IHNcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgX3NlbGVjdDogZnVuY3Rpb24gKHMsIGUpIHtcbiAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICAgIHM6IHMsXG4gICAgICBlOiBlXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIF9kZXNlbGVjdDogZnVuY3Rpb24gKHMsIGUpIHtcbiAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICB0eXBlOiAnZGVzZWxlY3QnLFxuICAgICAgczogcyxcbiAgICAgIGU6IGVcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgcHJvY2Vzc1N0ZXA6IGZ1bmN0aW9uIChzdGVwLCBvcHRpb25zKSB7XG4gICAgc3dpdGNoIChzdGVwLnR5cGUpIHtcbiAgICAgIGNhc2UgJ25vdGlmeSc6XG4gICAgICAgIGlmIChzdGVwLnYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMuY2hhcnQuY29uZmlnLmRhdGEuZGF0YXNldHNbMF0uZGF0YVtzdGVwLnNdID0gc3RlcC52O1xuICAgICAgICAgIHRoaXMuY2hhcnQuY29uZmlnLmRhdGEubGFiZWxzW3N0ZXAuc10gPSBzdGVwLnYudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgY2FzZSAnZGVub3RpZnknOlxuICAgICAgY2FzZSAnZGVzZWxlY3QnOlxuICAgICAgICB2YXIgY29sb3IgPSBzdGVwLnR5cGUgPT0gJ2Rlbm90aWZ5JyB8fCBzdGVwLnR5cGUgPT0gJ2Rlc2VsZWN0JyA/ICdyZ2JhKDEzNiwgMTM2LCAxMzYsIDEpJyA6ICdyZ2JhKDI1NSwgMCwgMCwgMSknO1xuICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIHZhciBjb2xvciA9ICdyZ2JhKDAsIDAsIDI1NSwgMSknO1xuICAgICAgICBpZiAoc3RlcC5lICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgZm9yICh2YXIgaSA9IHN0ZXAuczsgaSA8PSBzdGVwLmU7IGkrKylcbiAgICAgICAgICAgIHRoaXMuY2hhcnQuY29uZmlnLmRhdGEuZGF0YXNldHNbMF0uYmFja2dyb3VuZENvbG9yW2ldID0gY29sb3I7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aGlzLmNoYXJ0LmNvbmZpZy5kYXRhLmRhdGFzZXRzWzBdLmJhY2tncm91bmRDb2xvcltzdGVwLnNdID0gY29sb3I7XG4gICAgICAgIHRoaXMuY2hhcnQudXBkYXRlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5wcm9jZXNzU3RlcC5jYWxsKHRoaXMsIHN0ZXAsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhcnRUcmFjZXI7IiwiY29uc3QgRGlyZWN0ZWRHcmFwaFRyYWNlciA9IHJlcXVpcmUoJy4vZGlyZWN0ZWRfZ3JhcGgnKTtcblxuZnVuY3Rpb24gQ29vcmRpbmF0ZVN5c3RlbVRyYWNlcigpIHtcbiAgaWYgKERpcmVjdGVkR3JhcGhUcmFjZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgIENvb3JkaW5hdGVTeXN0ZW1UcmFjZXIucHJvdG90eXBlLmluaXQuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbkNvb3JkaW5hdGVTeXN0ZW1UcmFjZXIucHJvdG90eXBlID0gJC5leHRlbmQodHJ1ZSwgT2JqZWN0LmNyZWF0ZShEaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZSksIHtcbiAgY29uc3RydWN0b3I6IENvb3JkaW5hdGVTeXN0ZW1UcmFjZXIsXG4gIG5hbWU6ICdDb29yZGluYXRlU3lzdGVtVHJhY2VyJyxcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0cmFjZXIgPSB0aGlzO1xuXG4gICAgdGhpcy5zLnNldHRpbmdzKHtcbiAgICAgIGRlZmF1bHRFZGdlVHlwZTogJ2RlZicsXG4gICAgICBmdW5jRWRnZXNEZWY6IGZ1bmN0aW9uIChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICAgdmFyIGNvbG9yID0gdHJhY2VyLmdldENvbG9yKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBzZXR0aW5ncyk7XG4gICAgICAgIHRyYWNlci5kcmF3RWRnZShlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgc2V0RGF0YTogZnVuY3Rpb24gKEMpIHtcbiAgICBpZiAoVHJhY2VyLnByb3RvdHlwZS5zZXREYXRhLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHJldHVybiB0cnVlO1xuXG4gICAgdGhpcy5ncmFwaC5jbGVhcigpO1xuICAgIHZhciBub2RlcyA9IFtdO1xuICAgIHZhciBlZGdlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgQy5sZW5ndGg7IGkrKylcbiAgICAgIG5vZGVzLnB1c2goe1xuICAgICAgICBpZDogdGhpcy5uKGkpLFxuICAgICAgICB4OiBDW2ldWzBdLFxuICAgICAgICB5OiBDW2ldWzFdLFxuICAgICAgICBsYWJlbDogJycgKyBpLFxuICAgICAgICBzaXplOiAxLFxuICAgICAgICBjb2xvcjogdGhpcy5jb2xvci5kZWZhdWx0XG4gICAgICB9KTtcbiAgICB0aGlzLmdyYXBoLnJlYWQoe1xuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgZWRnZXM6IGVkZ2VzXG4gICAgfSk7XG4gICAgdGhpcy5zLmNhbWVyYS5nb1RvKHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwLFxuICAgICAgYW5nbGU6IDAsXG4gICAgICByYXRpbzogMVxuICAgIH0pO1xuICAgIHRoaXMucmVmcmVzaCgpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBwcm9jZXNzU3RlcDogZnVuY3Rpb24gKHN0ZXAsIG9wdGlvbnMpIHtcbiAgICBzd2l0Y2ggKHN0ZXAudHlwZSkge1xuICAgICAgY2FzZSAndmlzaXQnOlxuICAgICAgY2FzZSAnbGVhdmUnOlxuICAgICAgICB2YXIgdmlzaXQgPSBzdGVwLnR5cGUgPT0gJ3Zpc2l0JztcbiAgICAgICAgdmFyIHRhcmdldE5vZGUgPSB0aGlzLmdyYXBoLm5vZGVzKHRoaXMubihzdGVwLnRhcmdldCkpO1xuICAgICAgICB2YXIgY29sb3IgPSB2aXNpdCA/IHRoaXMuY29sb3IudmlzaXRlZCA6IHRoaXMuY29sb3IubGVmdDtcbiAgICAgICAgdGFyZ2V0Tm9kZS5jb2xvciA9IGNvbG9yO1xuICAgICAgICBpZiAoc3RlcC5zb3VyY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlZGdlSWQgPSB0aGlzLmUoc3RlcC5zb3VyY2UsIHN0ZXAudGFyZ2V0KTtcbiAgICAgICAgICBpZiAodGhpcy5ncmFwaC5lZGdlcyhlZGdlSWQpKSB7XG4gICAgICAgICAgICB2YXIgZWRnZSA9IHRoaXMuZ3JhcGguZWRnZXMoZWRnZUlkKTtcbiAgICAgICAgICAgIGVkZ2UuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgICAgIHRoaXMuZ3JhcGguZHJvcEVkZ2UoZWRnZUlkKS5hZGRFZGdlKGVkZ2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdyYXBoLmFkZEVkZ2Uoe1xuICAgICAgICAgICAgICBpZDogdGhpcy5lKHN0ZXAudGFyZ2V0LCBzdGVwLnNvdXJjZSksXG4gICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5uKHN0ZXAuc291cmNlKSxcbiAgICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLm4oc3RlcC50YXJnZXQpLFxuICAgICAgICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgICAgICAgIHNpemU6IDFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5sb2dUcmFjZXIpIHtcbiAgICAgICAgICB2YXIgc291cmNlID0gc3RlcC5zb3VyY2U7XG4gICAgICAgICAgaWYgKHNvdXJjZSA9PT0gdW5kZWZpbmVkKSBzb3VyY2UgPSAnJztcbiAgICAgICAgICB0aGlzLmxvZ1RyYWNlci5wcmludCh2aXNpdCA/IHNvdXJjZSArICcgLT4gJyArIHN0ZXAudGFyZ2V0IDogc291cmNlICsgJyA8LSAnICsgc3RlcC50YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5wcm9jZXNzU3RlcC5jYWxsKHRoaXMsIHN0ZXAsIG9wdGlvbnMpO1xuICAgIH1cbiAgfSxcbiAgZTogZnVuY3Rpb24gKHYxLCB2Mikge1xuICAgIGlmICh2MSA+IHYyKSB7XG4gICAgICB2YXIgdGVtcCA9IHYxO1xuICAgICAgdjEgPSB2MjtcbiAgICAgIHYyID0gdGVtcDtcbiAgICB9XG4gICAgcmV0dXJuICdlJyArIHYxICsgJ18nICsgdjI7XG4gIH0sXG4gIGRyYXdPbkhvdmVyOiBmdW5jdGlvbiAobm9kZSwgY29udGV4dCwgc2V0dGluZ3MsIG5leHQpIHtcbiAgICB2YXIgdHJhY2VyID0gdGhpcztcblxuICAgIGNvbnRleHQuc2V0TGluZURhc2goWzUsIDVdKTtcbiAgICB2YXIgbm9kZUlkeCA9IG5vZGUuaWQuc3Vic3RyaW5nKDEpO1xuICAgIHRoaXMuZ3JhcGguZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChlZGdlKSB7XG4gICAgICB2YXIgZW5kcyA9IGVkZ2UuaWQuc3Vic3RyaW5nKDEpLnNwbGl0KFwiX1wiKTtcbiAgICAgIGlmIChlbmRzWzBdID09IG5vZGVJZHgpIHtcbiAgICAgICAgdmFyIGNvbG9yID0gJyMwZmYnO1xuICAgICAgICB2YXIgc291cmNlID0gbm9kZTtcbiAgICAgICAgdmFyIHRhcmdldCA9IHRyYWNlci5ncmFwaC5ub2RlcygnbicgKyBlbmRzWzFdKTtcbiAgICAgICAgdHJhY2VyLmRyYXdFZGdlKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICBpZiAobmV4dCkgbmV4dChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgIH0gZWxzZSBpZiAoZW5kc1sxXSA9PSBub2RlSWR4KSB7XG4gICAgICAgIHZhciBjb2xvciA9ICcjMGZmJztcbiAgICAgICAgdmFyIHNvdXJjZSA9IHRyYWNlci5ncmFwaC5ub2RlcygnbicgKyBlbmRzWzBdKTtcbiAgICAgICAgdmFyIHRhcmdldCA9IG5vZGU7XG4gICAgICAgIHRyYWNlci5kcmF3RWRnZShlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgaWYgKG5leHQpIG5leHQoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGRyYXdFZGdlOiBmdW5jdGlvbiAoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJycsXG4gICAgICBzaXplID0gZWRnZVtwcmVmaXggKyAnc2l6ZSddIHx8IDE7XG5cbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gICAgY29udGV4dC5saW5lV2lkdGggPSBzaXplO1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgY29udGV4dC5tb3ZlVG8oXG4gICAgICBzb3VyY2VbcHJlZml4ICsgJ3gnXSxcbiAgICAgIHNvdXJjZVtwcmVmaXggKyAneSddXG4gICAgKTtcbiAgICBjb250ZXh0LmxpbmVUbyhcbiAgICAgIHRhcmdldFtwcmVmaXggKyAneCddLFxuICAgICAgdGFyZ2V0W3ByZWZpeCArICd5J11cbiAgICApO1xuICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvb3JkaW5hdGVTeXN0ZW1UcmFjZXI7IiwiY29uc3QgVHJhY2VyID0gcmVxdWlyZSgnLi90cmFjZXInKTtcblxuZnVuY3Rpb24gRGlyZWN0ZWRHcmFwaFRyYWNlcigpIHtcbiAgaWYgKFRyYWNlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSB7XG4gICAgRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUuaW5pdC5jYWxsKHRoaXMpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUgPSAkLmV4dGVuZCh0cnVlLCBPYmplY3QuY3JlYXRlKFRyYWNlci5wcm90b3R5cGUpLCB7XG4gIGNvbnN0cnVjdG9yOiBEaXJlY3RlZEdyYXBoVHJhY2VyLFxuICBuYW1lOiAnRGlyZWN0ZWRHcmFwaFRyYWNlcicsXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdHJhY2VyID0gdGhpcztcblxuICAgIHRoaXMucyA9IHRoaXMuY2Fwc3VsZS5zID0gbmV3IHNpZ21hKHtcbiAgICAgIHJlbmRlcmVyOiB7XG4gICAgICAgIGNvbnRhaW5lcjogdGhpcy4kY29udGFpbmVyWzBdLFxuICAgICAgICB0eXBlOiAnY2FudmFzJ1xuICAgICAgfSxcbiAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgIG1pbkFycm93U2l6ZTogOCxcbiAgICAgICAgZGVmYXVsdEVkZ2VUeXBlOiAnYXJyb3cnLFxuICAgICAgICBtYXhFZGdlU2l6ZTogMi41LFxuICAgICAgICBsYWJlbFRocmVzaG9sZDogNCxcbiAgICAgICAgZm9udDogJ1JvYm90bycsXG4gICAgICAgIGRlZmF1bHRMYWJlbENvbG9yOiAnI2ZmZicsXG4gICAgICAgIHpvb21NaW46IDAuNixcbiAgICAgICAgem9vbU1heDogMS4yLFxuICAgICAgICBza2lwRXJyb3JzOiB0cnVlLFxuICAgICAgICBtaW5Ob2RlU2l6ZTogLjUsXG4gICAgICAgIG1heE5vZGVTaXplOiAxMixcbiAgICAgICAgbGFiZWxTaXplOiAncHJvcG9ydGlvbmFsJyxcbiAgICAgICAgbGFiZWxTaXplUmF0aW86IDEuMyxcbiAgICAgICAgZnVuY0xhYmVsc0RlZjogZnVuY3Rpb24gKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICAgICAgdHJhY2VyLmRyYXdMYWJlbChub2RlLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmNIb3ZlcnNEZWY6IGZ1bmN0aW9uIChub2RlLCBjb250ZXh0LCBzZXR0aW5ncywgbmV4dCkge1xuICAgICAgICAgIHRyYWNlci5kcmF3T25Ib3Zlcihub2RlLCBjb250ZXh0LCBzZXR0aW5ncywgbmV4dCk7XG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmNFZGdlc0Fycm93OiBmdW5jdGlvbiAoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICAgICAgdmFyIGNvbG9yID0gdHJhY2VyLmdldENvbG9yKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgdHJhY2VyLmRyYXdBcnJvdyhlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHNpZ21hLnBsdWdpbnMuZHJhZ05vZGVzKHRoaXMucywgdGhpcy5zLnJlbmRlcmVyc1swXSk7XG4gICAgdGhpcy5ncmFwaCA9IHRoaXMuY2Fwc3VsZS5ncmFwaCA9IHRoaXMucy5ncmFwaDtcbiAgfSxcbiAgX3NldFRyZWVEYXRhOiBmdW5jdGlvbiAoRywgcm9vdCkge1xuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgIHR5cGU6ICdzZXRUcmVlRGF0YScsXG4gICAgICBhcmd1bWVudHM6IGFyZ3VtZW50c1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBfdmlzaXQ6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgIHR5cGU6ICd2aXNpdCcsXG4gICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgIHNvdXJjZTogc291cmNlXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIF9sZWF2ZTogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgdHlwZTogJ2xlYXZlJyxcbiAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgc291cmNlOiBzb3VyY2VcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgcHJvY2Vzc1N0ZXA6IGZ1bmN0aW9uIChzdGVwLCBvcHRpb25zKSB7XG4gICAgc3dpdGNoIChzdGVwLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3NldFRyZWVEYXRhJzpcbiAgICAgICAgdGhpcy5zZXRUcmVlRGF0YS5hcHBseSh0aGlzLCBzdGVwLmFyZ3VtZW50cyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndmlzaXQnOlxuICAgICAgY2FzZSAnbGVhdmUnOlxuICAgICAgICB2YXIgdmlzaXQgPSBzdGVwLnR5cGUgPT0gJ3Zpc2l0JztcbiAgICAgICAgdmFyIHRhcmdldE5vZGUgPSB0aGlzLmdyYXBoLm5vZGVzKHRoaXMubihzdGVwLnRhcmdldCkpO1xuICAgICAgICB2YXIgY29sb3IgPSB2aXNpdCA/IHRoaXMuY29sb3IudmlzaXRlZCA6IHRoaXMuY29sb3IubGVmdDtcbiAgICAgICAgdGFyZ2V0Tm9kZS5jb2xvciA9IGNvbG9yO1xuICAgICAgICBpZiAoc3RlcC5zb3VyY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlZGdlSWQgPSB0aGlzLmUoc3RlcC5zb3VyY2UsIHN0ZXAudGFyZ2V0KTtcbiAgICAgICAgICB2YXIgZWRnZSA9IHRoaXMuZ3JhcGguZWRnZXMoZWRnZUlkKTtcbiAgICAgICAgICBlZGdlLmNvbG9yID0gY29sb3I7XG4gICAgICAgICAgdGhpcy5ncmFwaC5kcm9wRWRnZShlZGdlSWQpLmFkZEVkZ2UoZWRnZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubG9nVHJhY2VyKSB7XG4gICAgICAgICAgdmFyIHNvdXJjZSA9IHN0ZXAuc291cmNlO1xuICAgICAgICAgIGlmIChzb3VyY2UgPT09IHVuZGVmaW5lZCkgc291cmNlID0gJyc7XG4gICAgICAgICAgdGhpcy5sb2dUcmFjZXIucHJpbnQodmlzaXQgPyBzb3VyY2UgKyAnIC0+ICcgKyBzdGVwLnRhcmdldCA6IHNvdXJjZSArICcgPC0gJyArIHN0ZXAudGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIFRyYWNlci5wcm90b3R5cGUucHJvY2Vzc1N0ZXAuY2FsbCh0aGlzLCBzdGVwLCBvcHRpb25zKTtcbiAgICB9XG4gIH0sXG4gIHNldFRyZWVEYXRhOiBmdW5jdGlvbiAoRywgcm9vdCkge1xuICAgIHZhciB0cmFjZXIgPSB0aGlzO1xuXG4gICAgcm9vdCA9IHJvb3QgfHwgMDtcbiAgICB2YXIgbWF4RGVwdGggPSAtMTtcblxuICAgIHZhciBjaGsgPSBuZXcgQXJyYXkoRy5sZW5ndGgpO1xuICAgIHZhciBnZXREZXB0aCA9IGZ1bmN0aW9uIChub2RlLCBkZXB0aCkge1xuICAgICAgaWYgKGNoa1tub2RlXSkgdGhyb3cgXCJ0aGUgZ2l2ZW4gZ3JhcGggaXMgbm90IGEgdHJlZSBiZWNhdXNlIGl0IGZvcm1zIGEgY2lyY3VpdFwiO1xuICAgICAgY2hrW25vZGVdID0gdHJ1ZTtcbiAgICAgIGlmIChtYXhEZXB0aCA8IGRlcHRoKSBtYXhEZXB0aCA9IGRlcHRoO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBHW25vZGVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChHW25vZGVdW2ldKSBnZXREZXB0aChpLCBkZXB0aCArIDEpO1xuICAgICAgfVxuICAgIH07XG4gICAgZ2V0RGVwdGgocm9vdCwgMSk7XG5cbiAgICBpZiAodGhpcy5zZXREYXRhLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHJldHVybiB0cnVlO1xuXG4gICAgdmFyIHBsYWNlID0gZnVuY3Rpb24gKG5vZGUsIHgsIHkpIHtcbiAgICAgIHZhciB0ZW1wID0gdHJhY2VyLmdyYXBoLm5vZGVzKHRyYWNlci5uKG5vZGUpKTtcbiAgICAgIHRlbXAueCA9IHg7XG4gICAgICB0ZW1wLnkgPSB5O1xuICAgIH07XG5cbiAgICB2YXIgd2dhcCA9IDEgLyAobWF4RGVwdGggLSAxKTtcbiAgICB2YXIgZGZzID0gZnVuY3Rpb24gKG5vZGUsIGRlcHRoLCB0b3AsIGJvdHRvbSkge1xuICAgICAgcGxhY2Uobm9kZSwgdG9wICsgYm90dG9tLCBkZXB0aCAqIHdnYXApO1xuICAgICAgdmFyIGNoaWxkcmVuID0gMDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgR1tub2RlXS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoR1tub2RlXVtpXSkgY2hpbGRyZW4rKztcbiAgICAgIH1cbiAgICAgIHZhciB2Z2FwID0gKGJvdHRvbSAtIHRvcCkgLyBjaGlsZHJlbjtcbiAgICAgIHZhciBjbnQgPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBHW25vZGVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChHW25vZGVdW2ldKSBkZnMoaSwgZGVwdGggKyAxLCB0b3AgKyB2Z2FwICogY250LCB0b3AgKyB2Z2FwICogKytjbnQpO1xuICAgICAgfVxuICAgIH07XG4gICAgZGZzKHJvb3QsIDAsIDAsIDEpO1xuXG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH0sXG4gIHNldERhdGE6IGZ1bmN0aW9uIChHKSB7XG4gICAgaWYgKFRyYWNlci5wcm90b3R5cGUuc2V0RGF0YS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSByZXR1cm4gdHJ1ZTtcblxuICAgIHRoaXMuZ3JhcGguY2xlYXIoKTtcbiAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICB2YXIgZWRnZXMgPSBbXTtcbiAgICB2YXIgdW5pdEFuZ2xlID0gMiAqIE1hdGguUEkgLyBHLmxlbmd0aDtcbiAgICB2YXIgY3VycmVudEFuZ2xlID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IEcubGVuZ3RoOyBpKyspIHtcbiAgICAgIGN1cnJlbnRBbmdsZSArPSB1bml0QW5nbGU7XG4gICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgaWQ6IHRoaXMubihpKSxcbiAgICAgICAgbGFiZWw6ICcnICsgaSxcbiAgICAgICAgeDogLjUgKyBNYXRoLnNpbihjdXJyZW50QW5nbGUpIC8gMixcbiAgICAgICAgeTogLjUgKyBNYXRoLmNvcyhjdXJyZW50QW5nbGUpIC8gMixcbiAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdFxuICAgICAgfSk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IEdbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKEdbaV1bal0pIHtcbiAgICAgICAgICBlZGdlcy5wdXNoKHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmUoaSwgaiksXG4gICAgICAgICAgICBzb3VyY2U6IHRoaXMubihpKSxcbiAgICAgICAgICAgIHRhcmdldDogdGhpcy5uKGopLFxuICAgICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdCxcbiAgICAgICAgICAgIHNpemU6IDFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZ3JhcGgucmVhZCh7XG4gICAgICBub2Rlczogbm9kZXMsXG4gICAgICBlZGdlczogZWRnZXNcbiAgICB9KTtcbiAgICB0aGlzLnMuY2FtZXJhLmdvVG8oe1xuICAgICAgeDogMCxcbiAgICAgIHk6IDAsXG4gICAgICBhbmdsZTogMCxcbiAgICAgIHJhdGlvOiAxXG4gICAgfSk7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIHJlc2l6ZTogZnVuY3Rpb24gKCkge1xuICAgIFRyYWNlci5wcm90b3R5cGUucmVzaXplLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLnMucmVuZGVyZXJzWzBdLnJlc2l6ZSgpO1xuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9LFxuICByZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgVHJhY2VyLnByb3RvdHlwZS5yZWZyZXNoLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLnMucmVmcmVzaCgpO1xuICB9LFxuICBjbGVhcjogZnVuY3Rpb24gKCkge1xuICAgIFRyYWNlci5wcm90b3R5cGUuY2xlYXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuY2xlYXJHcmFwaENvbG9yKCk7XG4gIH0sXG4gIGNvbG9yOiB7XG4gICAgdmlzaXRlZDogJyNmMDAnLFxuICAgIGxlZnQ6ICcjMDAwJyxcbiAgICBkZWZhdWx0OiAnIzg4OCdcbiAgfSxcbiAgY2xlYXJHcmFwaENvbG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRyYWNlciA9IHRoaXM7XG5cbiAgICB0aGlzLmdyYXBoLm5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgbm9kZS5jb2xvciA9IHRyYWNlci5jb2xvci5kZWZhdWx0O1xuICAgIH0pO1xuICAgIHRoaXMuZ3JhcGguZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChlZGdlKSB7XG4gICAgICBlZGdlLmNvbG9yID0gdHJhY2VyLmNvbG9yLmRlZmF1bHQ7XG4gICAgfSk7XG4gIH0sXG4gIG46IGZ1bmN0aW9uICh2KSB7XG4gICAgcmV0dXJuICduJyArIHY7XG4gIH0sXG4gIGU6IGZ1bmN0aW9uICh2MSwgdjIpIHtcbiAgICByZXR1cm4gJ2UnICsgdjEgKyAnXycgKyB2MjtcbiAgfSxcbiAgZ2V0Q29sb3I6IGZ1bmN0aW9uIChlZGdlLCBzb3VyY2UsIHRhcmdldCwgc2V0dGluZ3MpIHtcbiAgICB2YXIgY29sb3IgPSBlZGdlLmNvbG9yLFxuICAgICAgZWRnZUNvbG9yID0gc2V0dGluZ3MoJ2VkZ2VDb2xvcicpLFxuICAgICAgZGVmYXVsdE5vZGVDb2xvciA9IHNldHRpbmdzKCdkZWZhdWx0Tm9kZUNvbG9yJyksXG4gICAgICBkZWZhdWx0RWRnZUNvbG9yID0gc2V0dGluZ3MoJ2RlZmF1bHRFZGdlQ29sb3InKTtcbiAgICBpZiAoIWNvbG9yKVxuICAgICAgc3dpdGNoIChlZGdlQ29sb3IpIHtcbiAgICAgICAgY2FzZSAnc291cmNlJzpcbiAgICAgICAgICBjb2xvciA9IHNvdXJjZS5jb2xvciB8fCBkZWZhdWx0Tm9kZUNvbG9yO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0YXJnZXQnOlxuICAgICAgICAgIGNvbG9yID0gdGFyZ2V0LmNvbG9yIHx8IGRlZmF1bHROb2RlQ29sb3I7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29sb3IgPSBkZWZhdWx0RWRnZUNvbG9yO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgcmV0dXJuIGNvbG9yO1xuICB9LFxuICBkcmF3TGFiZWw6IGZ1bmN0aW9uIChub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgIHZhciBmb250U2l6ZSxcbiAgICAgIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJyxcbiAgICAgIHNpemUgPSBub2RlW3ByZWZpeCArICdzaXplJ107XG5cbiAgICBpZiAoc2l6ZSA8IHNldHRpbmdzKCdsYWJlbFRocmVzaG9sZCcpKVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKCFub2RlLmxhYmVsIHx8IHR5cGVvZiBub2RlLmxhYmVsICE9PSAnc3RyaW5nJylcbiAgICAgIHJldHVybjtcblxuICAgIGZvbnRTaXplID0gKHNldHRpbmdzKCdsYWJlbFNpemUnKSA9PT0gJ2ZpeGVkJykgP1xuICAgICAgc2V0dGluZ3MoJ2RlZmF1bHRMYWJlbFNpemUnKSA6XG4gICAgc2V0dGluZ3MoJ2xhYmVsU2l6ZVJhdGlvJykgKiBzaXplO1xuXG4gICAgY29udGV4dC5mb250ID0gKHNldHRpbmdzKCdmb250U3R5bGUnKSA/IHNldHRpbmdzKCdmb250U3R5bGUnKSArICcgJyA6ICcnKSArXG4gICAgICBmb250U2l6ZSArICdweCAnICsgc2V0dGluZ3MoJ2ZvbnQnKTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IChzZXR0aW5ncygnbGFiZWxDb2xvcicpID09PSAnbm9kZScpID9cbiAgICAgIChub2RlLmNvbG9yIHx8IHNldHRpbmdzKCdkZWZhdWx0Tm9kZUNvbG9yJykpIDpcbiAgICAgIHNldHRpbmdzKCdkZWZhdWx0TGFiZWxDb2xvcicpO1xuXG4gICAgY29udGV4dC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICBjb250ZXh0LmZpbGxUZXh0KFxuICAgICAgbm9kZS5sYWJlbCxcbiAgICAgIE1hdGgucm91bmQobm9kZVtwcmVmaXggKyAneCddKSxcbiAgICAgIE1hdGgucm91bmQobm9kZVtwcmVmaXggKyAneSddICsgZm9udFNpemUgLyAzKVxuICAgICk7XG4gIH0sXG4gIGRyYXdBcnJvdzogZnVuY3Rpb24gKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICB2YXIgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnLFxuICAgICAgc2l6ZSA9IGVkZ2VbcHJlZml4ICsgJ3NpemUnXSB8fCAxLFxuICAgICAgdFNpemUgPSB0YXJnZXRbcHJlZml4ICsgJ3NpemUnXSxcbiAgICAgIHNYID0gc291cmNlW3ByZWZpeCArICd4J10sXG4gICAgICBzWSA9IHNvdXJjZVtwcmVmaXggKyAneSddLFxuICAgICAgdFggPSB0YXJnZXRbcHJlZml4ICsgJ3gnXSxcbiAgICAgIHRZID0gdGFyZ2V0W3ByZWZpeCArICd5J10sXG4gICAgICBhbmdsZSA9IE1hdGguYXRhbjIodFkgLSBzWSwgdFggLSBzWCksXG4gICAgICBkaXN0ID0gMztcbiAgICBzWCArPSBNYXRoLnNpbihhbmdsZSkgKiBkaXN0O1xuICAgIHRYICs9IE1hdGguc2luKGFuZ2xlKSAqIGRpc3Q7XG4gICAgc1kgKz0gLU1hdGguY29zKGFuZ2xlKSAqIGRpc3Q7XG4gICAgdFkgKz0gLU1hdGguY29zKGFuZ2xlKSAqIGRpc3Q7XG4gICAgdmFyIGFTaXplID0gTWF0aC5tYXgoc2l6ZSAqIDIuNSwgc2V0dGluZ3MoJ21pbkFycm93U2l6ZScpKSxcbiAgICAgIGQgPSBNYXRoLnNxcnQoTWF0aC5wb3codFggLSBzWCwgMikgKyBNYXRoLnBvdyh0WSAtIHNZLCAyKSksXG4gICAgICBhWCA9IHNYICsgKHRYIC0gc1gpICogKGQgLSBhU2l6ZSAtIHRTaXplKSAvIGQsXG4gICAgICBhWSA9IHNZICsgKHRZIC0gc1kpICogKGQgLSBhU2l6ZSAtIHRTaXplKSAvIGQsXG4gICAgICB2WCA9ICh0WCAtIHNYKSAqIGFTaXplIC8gZCxcbiAgICAgIHZZID0gKHRZIC0gc1kpICogYVNpemUgLyBkO1xuXG4gICAgY29udGV4dC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgIGNvbnRleHQubGluZVdpZHRoID0gc2l6ZTtcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIGNvbnRleHQubW92ZVRvKHNYLCBzWSk7XG4gICAgY29udGV4dC5saW5lVG8oXG4gICAgICBhWCxcbiAgICAgIGFZXG4gICAgKTtcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIGNvbnRleHQubW92ZVRvKGFYICsgdlgsIGFZICsgdlkpO1xuICAgIGNvbnRleHQubGluZVRvKGFYICsgdlkgKiAwLjYsIGFZIC0gdlggKiAwLjYpO1xuICAgIGNvbnRleHQubGluZVRvKGFYIC0gdlkgKiAwLjYsIGFZICsgdlggKiAwLjYpO1xuICAgIGNvbnRleHQubGluZVRvKGFYICsgdlgsIGFZICsgdlkpO1xuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgY29udGV4dC5maWxsKCk7XG4gIH0sXG4gIGRyYXdPbkhvdmVyOiBmdW5jdGlvbiAobm9kZSwgY29udGV4dCwgc2V0dGluZ3MsIG5leHQpIHtcbiAgICB2YXIgdHJhY2VyID0gdGhpcztcblxuICAgIGNvbnRleHQuc2V0TGluZURhc2goWzUsIDVdKTtcbiAgICB2YXIgbm9kZUlkeCA9IG5vZGUuaWQuc3Vic3RyaW5nKDEpO1xuICAgIHRoaXMuZ3JhcGguZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChlZGdlKSB7XG4gICAgICB2YXIgZW5kcyA9IGVkZ2UuaWQuc3Vic3RyaW5nKDEpLnNwbGl0KFwiX1wiKTtcbiAgICAgIGlmIChlbmRzWzBdID09IG5vZGVJZHgpIHtcbiAgICAgICAgdmFyIGNvbG9yID0gJyMwZmYnO1xuICAgICAgICB2YXIgc291cmNlID0gbm9kZTtcbiAgICAgICAgdmFyIHRhcmdldCA9IHRyYWNlci5ncmFwaC5ub2RlcygnbicgKyBlbmRzWzFdKTtcbiAgICAgICAgdHJhY2VyLmRyYXdBcnJvdyhlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgaWYgKG5leHQpIG5leHQoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICB9IGVsc2UgaWYgKGVuZHNbMV0gPT0gbm9kZUlkeCkge1xuICAgICAgICB2YXIgY29sb3IgPSAnI2ZmMCc7XG4gICAgICAgIHZhciBzb3VyY2UgPSB0cmFjZXIuZ3JhcGgubm9kZXMoJ24nICsgZW5kc1swXSk7XG4gICAgICAgIHZhciB0YXJnZXQgPSBub2RlO1xuICAgICAgICB0cmFjZXIuZHJhd0Fycm93KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICBpZiAobmV4dCkgbmV4dChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG5cbnNpZ21hLmNhbnZhcy5sYWJlbHMuZGVmID0gZnVuY3Rpb24gKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gIHZhciBmdW5jID0gc2V0dGluZ3MoJ2Z1bmNMYWJlbHNEZWYnKTtcbiAgaWYgKGZ1bmMpIHtcbiAgICBmdW5jKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgfVxufTtcbnNpZ21hLmNhbnZhcy5ob3ZlcnMuZGVmID0gZnVuY3Rpb24gKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gIHZhciBmdW5jID0gc2V0dGluZ3MoJ2Z1bmNIb3ZlcnNEZWYnKTtcbiAgaWYgKGZ1bmMpIHtcbiAgICBmdW5jKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgfVxufTtcbnNpZ21hLmNhbnZhcy5lZGdlcy5kZWYgPSBmdW5jdGlvbiAoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gIHZhciBmdW5jID0gc2V0dGluZ3MoJ2Z1bmNFZGdlc0RlZicpO1xuICBpZiAoZnVuYykge1xuICAgIGZ1bmMoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgfVxufTtcbnNpZ21hLmNhbnZhcy5lZGdlcy5hcnJvdyA9IGZ1bmN0aW9uIChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgdmFyIGZ1bmMgPSBzZXR0aW5ncygnZnVuY0VkZ2VzQXJyb3cnKTtcbiAgaWYgKGZ1bmMpIHtcbiAgICBmdW5jKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0ZWRHcmFwaFRyYWNlcjsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFRyYWNlciA9IHJlcXVpcmUoJy4vdHJhY2VyJyk7XG5jb25zdCBMb2dUcmFjZXIgPSByZXF1aXJlKCcuL2xvZycpO1xuY29uc3QgQXJyYXkxRFRyYWNlciA9IHJlcXVpcmUoJy4vYXJyYXkxZCcpO1xuY29uc3QgQXJyYXkyRFRyYWNlciA9IHJlcXVpcmUoJy4vYXJyYXkyZCcpO1xuY29uc3QgQ2hhcnRUcmFjZXIgPSByZXF1aXJlKCcuL2NoYXJ0Jyk7XG5jb25zdCBDb29yZGluYXRlU3lzdGVtVHJhY2VyID0gcmVxdWlyZSgnLi9jb29yZGluYXRlX3N5c3RlbScpO1xuY29uc3QgRGlyZWN0ZWRHcmFwaFRyYWNlciA9IHJlcXVpcmUoJy4vZGlyZWN0ZWRfZ3JhcGgnKTtcbmNvbnN0IFVuZGlyZWN0ZWRHcmFwaFRyYWNlciA9IHJlcXVpcmUoJy4vdW5kaXJlY3RlZF9ncmFwaCcpO1xuY29uc3QgV2VpZ2h0ZWREaXJlY3RlZEdyYXBoVHJhY2VyID0gcmVxdWlyZSgnLi93ZWlnaHRlZF9kaXJlY3RlZF9ncmFwaCcpO1xuY29uc3QgV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGhUcmFjZXIgPSByZXF1aXJlKCcuL3dlaWdodGVkX3VuZGlyZWN0ZWRfZ3JhcGgnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFRyYWNlcixcbiAgTG9nVHJhY2VyLFxuICBBcnJheTFEVHJhY2VyLFxuICBBcnJheTJEVHJhY2VyLFxuICBDaGFydFRyYWNlcixcbiAgQ29vcmRpbmF0ZVN5c3RlbVRyYWNlcixcbiAgRGlyZWN0ZWRHcmFwaFRyYWNlcixcbiAgVW5kaXJlY3RlZEdyYXBoVHJhY2VyLFxuICBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXIsXG4gIFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoVHJhY2VyXG59OyIsImNvbnN0IFRyYWNlciA9IHJlcXVpcmUoJy4vdHJhY2VyJyk7XG5cbmZ1bmN0aW9uIExvZ1RyYWNlcigpIHtcbiAgaWYgKFRyYWNlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSB7XG4gICAgTG9nVHJhY2VyLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5Mb2dUcmFjZXIucHJvdG90eXBlID0gJC5leHRlbmQodHJ1ZSwgT2JqZWN0LmNyZWF0ZShUcmFjZXIucHJvdG90eXBlKSwge1xuICBjb25zdHJ1Y3RvcjogTG9nVHJhY2VyLFxuICBuYW1lOiAnTG9nVHJhY2VyJyxcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJHdyYXBwZXIgPSB0aGlzLmNhcHN1bGUuJHdyYXBwZXIgPSAkKCc8ZGl2IGNsYXNzPVwid3JhcHBlclwiPicpO1xuICAgIHRoaXMuJGNvbnRhaW5lci5hcHBlbmQodGhpcy4kd3JhcHBlcik7XG4gIH0sXG4gIF9wcmludDogZnVuY3Rpb24gKG1zZykge1xuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgIHR5cGU6ICdwcmludCcsXG4gICAgICBtc2c6IG1zZ1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBwcm9jZXNzU3RlcDogZnVuY3Rpb24gKHN0ZXAsIG9wdGlvbnMpIHtcbiAgICBzd2l0Y2ggKHN0ZXAudHlwZSkge1xuICAgICAgY2FzZSAncHJpbnQnOlxuICAgICAgICB0aGlzLnByaW50KHN0ZXAubXNnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9LFxuICByZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zY3JvbGxUb0VuZChNYXRoLm1pbig1MCwgdGhpcy5pbnRlcnZhbCkpO1xuICB9LFxuICBjbGVhcjogZnVuY3Rpb24gKCkge1xuICAgIFRyYWNlci5wcm90b3R5cGUuY2xlYXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuJHdyYXBwZXIuZW1wdHkoKTtcbiAgfSxcbiAgcHJpbnQ6IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgdGhpcy4kd3JhcHBlci5hcHBlbmQoJCgnPHNwYW4+JykuYXBwZW5kKG1lc3NhZ2UgKyAnPGJyLz4nKSk7XG4gIH0sXG4gIHNjcm9sbFRvRW5kOiBmdW5jdGlvbiAoZHVyYXRpb24pIHtcbiAgICB0aGlzLiRjb250YWluZXIuYW5pbWF0ZSh7XG4gICAgICBzY3JvbGxUb3A6IHRoaXMuJGNvbnRhaW5lclswXS5zY3JvbGxIZWlnaHRcbiAgICB9LCBkdXJhdGlvbik7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ1RyYWNlcjsiLCJjb25zdCB7XG4gIHRvSlNPTixcbiAgZnJvbUpTT05cbn0gPSByZXF1aXJlKCcuLi8uLi90cmFjZXJfbWFuYWdlci91dGlsL2luZGV4Jyk7XG5cbmZ1bmN0aW9uIFRyYWNlcihuYW1lKSB7XG4gIHRoaXMubW9kdWxlID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgdGhpcy5jYXBzdWxlID0gdGhpcy5tYW5hZ2VyLmFsbG9jYXRlKHRoaXMpO1xuICAkLmV4dGVuZCh0aGlzLCB0aGlzLmNhcHN1bGUpO1xuICB0aGlzLnNldE5hbWUobmFtZSk7XG4gIHJldHVybiB0aGlzLmlzTmV3O1xufVxuXG5UcmFjZXIucHJvdG90eXBlID0ge1xuXG4gIGNvbnN0cnVjdG9yOiBUcmFjZXIsXG4gIG5hbWU6ICdUcmFjZXInLFxuICBtYW5hZ2VyOiBudWxsLFxuXG4gIF9zZXREYXRhKC4uLmFyZ3MpIHtcbiAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICB0eXBlOiAnc2V0RGF0YScsXG4gICAgICBhcmdzOiB0b0pTT04oYXJncylcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBfY2xlYXIoKSB7XG4gICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgdHlwZTogJ2NsZWFyJ1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIF93YWl0KCkge1xuICAgIHRoaXMubWFuYWdlci5uZXdTdGVwKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgcHJvY2Vzc1N0ZXAoc3RlcCwgb3B0aW9ucykge1xuICAgIGNvbnN0IHtcbiAgICAgIHR5cGUsXG4gICAgICBhcmdzXG4gICAgfSA9IHN0ZXA7XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ3NldERhdGEnOlxuICAgICAgICB0aGlzLnNldERhdGEoLi4uZnJvbUpTT04oYXJncykpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NsZWFyJzpcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH0sXG5cbiAgc2V0TmFtZShuYW1lKSB7XG4gICAgbGV0ICRuYW1lO1xuICAgIGlmICh0aGlzLmlzTmV3KSB7XG4gICAgICAkbmFtZSA9ICQoJzxzcGFuIGNsYXNzPVwibmFtZVwiPicpO1xuICAgICAgdGhpcy4kY29udGFpbmVyLmFwcGVuZCgkbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRuYW1lID0gdGhpcy4kY29udGFpbmVyLmZpbmQoJ3NwYW4ubmFtZScpO1xuICAgIH1cbiAgICAkbmFtZS50ZXh0KG5hbWUgfHwgdGhpcy5kZWZhdWx0TmFtZSk7XG4gIH0sXG5cbiAgc2V0RGF0YSgpIHtcbiAgICBjb25zdCBkYXRhID0gdG9KU09OKGFyZ3VtZW50cyk7XG4gICAgaWYgKCF0aGlzLmlzTmV3ICYmIHRoaXMubGFzdERhdGEgPT09IGRhdGEpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB0aGlzLmlzTmV3ID0gdGhpcy5jYXBzdWxlLmlzTmV3ID0gZmFsc2U7XG4gICAgdGhpcy5sYXN0RGF0YSA9IHRoaXMuY2Fwc3VsZS5sYXN0RGF0YSA9IGRhdGE7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIHJlc2l6ZSgpIHtcbiAgfSxcbiAgcmVmcmVzaCgpIHtcbiAgfSxcbiAgY2xlYXIoKSB7XG4gIH0sXG5cbiAgYXR0YWNoKHRyYWNlcikge1xuICAgIGlmICh0cmFjZXIubW9kdWxlID09PSBMb2dUcmFjZXIpIHtcbiAgICAgIHRoaXMubG9nVHJhY2VyID0gdHJhY2VyO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBtb3VzZWRvd24oZSkge1xuICB9LFxuICBtb3VzZW1vdmUoZSkge1xuICB9LFxuICBtb3VzZXVwKGUpIHtcbiAgfSxcbiAgbW91c2V3aGVlbChlKSB7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2VyOyIsImNvbnN0IERpcmVjdGVkR3JhcGhUcmFjZXIgPSByZXF1aXJlKCcuL2RpcmVjdGVkX2dyYXBoJyk7XG5cbmZ1bmN0aW9uIFVuZGlyZWN0ZWRHcmFwaFRyYWNlcigpIHtcbiAgaWYgKERpcmVjdGVkR3JhcGhUcmFjZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgIFVuZGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUuaW5pdC5jYWxsKHRoaXMpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuVW5kaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHRydWUsIE9iamVjdC5jcmVhdGUoRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUpLCB7XG4gIGNvbnN0cnVjdG9yOiBVbmRpcmVjdGVkR3JhcGhUcmFjZXIsXG4gIG5hbWU6ICdVbmRpcmVjdGVkR3JhcGhUcmFjZXInLFxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRyYWNlciA9IHRoaXM7XG5cbiAgICB0aGlzLnMuc2V0dGluZ3Moe1xuICAgICAgZGVmYXVsdEVkZ2VUeXBlOiAnZGVmJyxcbiAgICAgIGZ1bmNFZGdlc0RlZjogZnVuY3Rpb24gKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICB2YXIgY29sb3IgPSB0cmFjZXIuZ2V0Q29sb3IoZWRnZSwgc291cmNlLCB0YXJnZXQsIHNldHRpbmdzKTtcbiAgICAgICAgdHJhY2VyLmRyYXdFZGdlKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBzZXREYXRhOiBmdW5jdGlvbiAoRykge1xuICAgIGlmIChUcmFjZXIucHJvdG90eXBlLnNldERhdGEuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuIHRydWU7XG5cbiAgICB0aGlzLmdyYXBoLmNsZWFyKCk7XG4gICAgdmFyIG5vZGVzID0gW107XG4gICAgdmFyIGVkZ2VzID0gW107XG4gICAgdmFyIHVuaXRBbmdsZSA9IDIgKiBNYXRoLlBJIC8gRy5sZW5ndGg7XG4gICAgdmFyIGN1cnJlbnRBbmdsZSA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBHLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjdXJyZW50QW5nbGUgKz0gdW5pdEFuZ2xlO1xuICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgIGlkOiB0aGlzLm4oaSksXG4gICAgICAgIGxhYmVsOiAnJyArIGksXG4gICAgICAgIHg6IC41ICsgTWF0aC5zaW4oY3VycmVudEFuZ2xlKSAvIDIsXG4gICAgICAgIHk6IC41ICsgTWF0aC5jb3MoY3VycmVudEFuZ2xlKSAvIDIsXG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLmRlZmF1bHRcbiAgICAgIH0pO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IEcubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDw9IGk7IGorKykge1xuICAgICAgICBpZiAoR1tpXVtqXSB8fCBHW2pdW2ldKSB7XG4gICAgICAgICAgZWRnZXMucHVzaCh7XG4gICAgICAgICAgICBpZDogdGhpcy5lKGksIGopLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLm4oaSksXG4gICAgICAgICAgICB0YXJnZXQ6IHRoaXMubihqKSxcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLmRlZmF1bHQsXG4gICAgICAgICAgICBzaXplOiAxXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmdyYXBoLnJlYWQoe1xuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgZWRnZXM6IGVkZ2VzXG4gICAgfSk7XG4gICAgdGhpcy5zLmNhbWVyYS5nb1RvKHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwLFxuICAgICAgYW5nbGU6IDAsXG4gICAgICByYXRpbzogMVxuICAgIH0pO1xuICAgIHRoaXMucmVmcmVzaCgpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBlOiBmdW5jdGlvbiAodjEsIHYyKSB7XG4gICAgaWYgKHYxID4gdjIpIHtcbiAgICAgIHZhciB0ZW1wID0gdjE7XG4gICAgICB2MSA9IHYyO1xuICAgICAgdjIgPSB0ZW1wO1xuICAgIH1cbiAgICByZXR1cm4gJ2UnICsgdjEgKyAnXycgKyB2MjtcbiAgfSxcbiAgZHJhd09uSG92ZXI6IGZ1bmN0aW9uIChub2RlLCBjb250ZXh0LCBzZXR0aW5ncywgbmV4dCkge1xuICAgIHZhciB0cmFjZXIgPSB0aGlzO1xuXG4gICAgY29udGV4dC5zZXRMaW5lRGFzaChbNSwgNV0pO1xuICAgIHZhciBub2RlSWR4ID0gbm9kZS5pZC5zdWJzdHJpbmcoMSk7XG4gICAgdGhpcy5ncmFwaC5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24gKGVkZ2UpIHtcbiAgICAgIHZhciBlbmRzID0gZWRnZS5pZC5zdWJzdHJpbmcoMSkuc3BsaXQoXCJfXCIpO1xuICAgICAgaWYgKGVuZHNbMF0gPT0gbm9kZUlkeCkge1xuICAgICAgICB2YXIgY29sb3IgPSAnIzBmZic7XG4gICAgICAgIHZhciBzb3VyY2UgPSBub2RlO1xuICAgICAgICB2YXIgdGFyZ2V0ID0gdHJhY2VyLmdyYXBoLm5vZGVzKCduJyArIGVuZHNbMV0pO1xuICAgICAgICB0cmFjZXIuZHJhd0VkZ2UoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgIGlmIChuZXh0KSBuZXh0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgfSBlbHNlIGlmIChlbmRzWzFdID09IG5vZGVJZHgpIHtcbiAgICAgICAgdmFyIGNvbG9yID0gJyMwZmYnO1xuICAgICAgICB2YXIgc291cmNlID0gdHJhY2VyLmdyYXBoLm5vZGVzKCduJyArIGVuZHNbMF0pO1xuICAgICAgICB2YXIgdGFyZ2V0ID0gbm9kZTtcbiAgICAgICAgdHJhY2VyLmRyYXdFZGdlKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICBpZiAobmV4dCkgbmV4dChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgZHJhd0VkZ2U6IGZ1bmN0aW9uIChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJyxcbiAgICAgIHNpemUgPSBlZGdlW3ByZWZpeCArICdzaXplJ10gfHwgMTtcblxuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHNpemU7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBjb250ZXh0Lm1vdmVUbyhcbiAgICAgIHNvdXJjZVtwcmVmaXggKyAneCddLFxuICAgICAgc291cmNlW3ByZWZpeCArICd5J11cbiAgICApO1xuICAgIGNvbnRleHQubGluZVRvKFxuICAgICAgdGFyZ2V0W3ByZWZpeCArICd4J10sXG4gICAgICB0YXJnZXRbcHJlZml4ICsgJ3knXVxuICAgICk7XG4gICAgY29udGV4dC5zdHJva2UoKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVW5kaXJlY3RlZEdyYXBoVHJhY2VyOyIsImNvbnN0IERpcmVjdGVkR3JhcGhUcmFjZXIgPSByZXF1aXJlKCcuL2RpcmVjdGVkX2dyYXBoJyk7XG5cbmNvbnN0IHtcbiAgcmVmaW5lQnlUeXBlXG59ID0gcmVxdWlyZSgnLi4vLi4vdHJhY2VyX21hbmFnZXIvdXRpbC9pbmRleCcpO1xuXG5mdW5jdGlvbiBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXIoKSB7XG4gIGlmIChEaXJlY3RlZEdyYXBoVHJhY2VyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlLmluaXQuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbldlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUgPSAkLmV4dGVuZCh0cnVlLCBPYmplY3QuY3JlYXRlKERpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlKSwge1xuICBjb25zdHJ1Y3RvcjogV2VpZ2h0ZWREaXJlY3RlZEdyYXBoVHJhY2VyLFxuICBuYW1lOiAnV2VpZ2h0ZWREaXJlY3RlZEdyYXBoVHJhY2VyJyxcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0cmFjZXIgPSB0aGlzO1xuXG4gICAgdGhpcy5zLnNldHRpbmdzKHtcbiAgICAgIGVkZ2VMYWJlbFNpemU6ICdwcm9wb3J0aW9uYWwnLFxuICAgICAgZGVmYXVsdEVkZ2VMYWJlbFNpemU6IDIwLFxuICAgICAgZWRnZUxhYmVsU2l6ZVBvd1JhdGlvOiAwLjgsXG4gICAgICBmdW5jTGFiZWxzRGVmOiBmdW5jdGlvbiAobm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICAgdHJhY2VyLmRyYXdOb2RlV2VpZ2h0KG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgdHJhY2VyLmRyYXdMYWJlbChub2RlLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICB9LFxuICAgICAgZnVuY0hvdmVyc0RlZjogZnVuY3Rpb24gKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICAgIHRyYWNlci5kcmF3T25Ib3Zlcihub2RlLCBjb250ZXh0LCBzZXR0aW5ncywgdHJhY2VyLmRyYXdFZGdlV2VpZ2h0KTtcbiAgICAgIH0sXG4gICAgICBmdW5jRWRnZXNBcnJvdzogZnVuY3Rpb24gKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICB2YXIgY29sb3IgPSB0cmFjZXIuZ2V0Q29sb3IoZWRnZSwgc291cmNlLCB0YXJnZXQsIHNldHRpbmdzKTtcbiAgICAgICAgdHJhY2VyLmRyYXdBcnJvdyhlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgdHJhY2VyLmRyYXdFZGdlV2VpZ2h0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBfd2VpZ2h0OiBmdW5jdGlvbiAodGFyZ2V0LCB3ZWlnaHQpIHtcbiAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICB0eXBlOiAnd2VpZ2h0JyxcbiAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgd2VpZ2h0OiB3ZWlnaHRcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgX3Zpc2l0OiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UsIHdlaWdodCkge1xuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgIHR5cGU6ICd2aXNpdCcsXG4gICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgd2VpZ2h0OiB3ZWlnaHRcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgX2xlYXZlOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UsIHdlaWdodCkge1xuICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgIHR5cGU6ICdsZWF2ZScsXG4gICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgd2VpZ2h0OiB3ZWlnaHRcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgcHJvY2Vzc1N0ZXA6IGZ1bmN0aW9uIChzdGVwLCBvcHRpb25zKSB7XG4gICAgc3dpdGNoIChzdGVwLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3dlaWdodCc6XG4gICAgICAgIHZhciB0YXJnZXROb2RlID0gdGhpcy5ncmFwaC5ub2Rlcyh0aGlzLm4oc3RlcC50YXJnZXQpKTtcbiAgICAgICAgaWYgKHN0ZXAud2VpZ2h0ICE9PSB1bmRlZmluZWQpIHRhcmdldE5vZGUud2VpZ2h0ID0gcmVmaW5lQnlUeXBlKHN0ZXAud2VpZ2h0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd2aXNpdCc6XG4gICAgICBjYXNlICdsZWF2ZSc6XG4gICAgICAgIHZhciB2aXNpdCA9IHN0ZXAudHlwZSA9PSAndmlzaXQnO1xuICAgICAgICB2YXIgdGFyZ2V0Tm9kZSA9IHRoaXMuZ3JhcGgubm9kZXModGhpcy5uKHN0ZXAudGFyZ2V0KSk7XG4gICAgICAgIHZhciBjb2xvciA9IHZpc2l0ID8gdGhpcy5jb2xvci52aXNpdGVkIDogdGhpcy5jb2xvci5sZWZ0O1xuICAgICAgICB0YXJnZXROb2RlLmNvbG9yID0gY29sb3I7XG4gICAgICAgIGlmIChzdGVwLndlaWdodCAhPT0gdW5kZWZpbmVkKSB0YXJnZXROb2RlLndlaWdodCA9IHJlZmluZUJ5VHlwZShzdGVwLndlaWdodCk7XG4gICAgICAgIGlmIChzdGVwLnNvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGVkZ2VJZCA9IHRoaXMuZShzdGVwLnNvdXJjZSwgc3RlcC50YXJnZXQpO1xuICAgICAgICAgIHZhciBlZGdlID0gdGhpcy5ncmFwaC5lZGdlcyhlZGdlSWQpO1xuICAgICAgICAgIGVkZ2UuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgICB0aGlzLmdyYXBoLmRyb3BFZGdlKGVkZ2VJZCkuYWRkRWRnZShlZGdlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5sb2dUcmFjZXIpIHtcbiAgICAgICAgICB2YXIgc291cmNlID0gc3RlcC5zb3VyY2U7XG4gICAgICAgICAgaWYgKHNvdXJjZSA9PT0gdW5kZWZpbmVkKSBzb3VyY2UgPSAnJztcbiAgICAgICAgICB0aGlzLmxvZ1RyYWNlci5wcmludCh2aXNpdCA/IHNvdXJjZSArICcgLT4gJyArIHN0ZXAudGFyZ2V0IDogc291cmNlICsgJyA8LSAnICsgc3RlcC50YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUucHJvY2Vzc1N0ZXAuY2FsbCh0aGlzLCBzdGVwLCBvcHRpb25zKTtcbiAgICB9XG4gIH0sXG4gIHNldERhdGE6IGZ1bmN0aW9uIChHKSB7XG4gICAgaWYgKFRyYWNlci5wcm90b3R5cGUuc2V0RGF0YS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSByZXR1cm4gdHJ1ZTtcblxuICAgIHRoaXMuZ3JhcGguY2xlYXIoKTtcbiAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICB2YXIgZWRnZXMgPSBbXTtcbiAgICB2YXIgdW5pdEFuZ2xlID0gMiAqIE1hdGguUEkgLyBHLmxlbmd0aDtcbiAgICB2YXIgY3VycmVudEFuZ2xlID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IEcubGVuZ3RoOyBpKyspIHtcbiAgICAgIGN1cnJlbnRBbmdsZSArPSB1bml0QW5nbGU7XG4gICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgaWQ6IHRoaXMubihpKSxcbiAgICAgICAgbGFiZWw6ICcnICsgaSxcbiAgICAgICAgeDogLjUgKyBNYXRoLnNpbihjdXJyZW50QW5nbGUpIC8gMixcbiAgICAgICAgeTogLjUgKyBNYXRoLmNvcyhjdXJyZW50QW5nbGUpIC8gMixcbiAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdCxcbiAgICAgICAgd2VpZ2h0OiAwXG4gICAgICB9KTtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgR1tpXS5sZW5ndGg7IGorKykge1xuICAgICAgICBpZiAoR1tpXVtqXSkge1xuICAgICAgICAgIGVkZ2VzLnB1c2goe1xuICAgICAgICAgICAgaWQ6IHRoaXMuZShpLCBqKSxcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5uKGkpLFxuICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLm4oaiksXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvci5kZWZhdWx0LFxuICAgICAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgICAgIHdlaWdodDogcmVmaW5lQnlUeXBlKEdbaV1bal0pXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmdyYXBoLnJlYWQoe1xuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgZWRnZXM6IGVkZ2VzXG4gICAgfSk7XG4gICAgdGhpcy5zLmNhbWVyYS5nb1RvKHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwLFxuICAgICAgYW5nbGU6IDAsXG4gICAgICByYXRpbzogMVxuICAgIH0pO1xuICAgIHRoaXMucmVmcmVzaCgpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBjbGVhcjogZnVuY3Rpb24gKCkge1xuICAgIERpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlLmNsZWFyLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLmNsZWFyV2VpZ2h0cygpO1xuICB9LFxuICBjbGVhcldlaWdodHM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmdyYXBoLm5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgbm9kZS53ZWlnaHQgPSAwO1xuICAgIH0pO1xuICB9LFxuICBkcmF3RWRnZVdlaWdodDogZnVuY3Rpb24gKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICBpZiAoc291cmNlID09IHRhcmdldClcbiAgICAgIHJldHVybjtcblxuICAgIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJycsXG4gICAgICBzaXplID0gZWRnZVtwcmVmaXggKyAnc2l6ZSddIHx8IDE7XG5cbiAgICBpZiAoc2l6ZSA8IHNldHRpbmdzKCdlZGdlTGFiZWxUaHJlc2hvbGQnKSlcbiAgICAgIHJldHVybjtcblxuICAgIGlmICgwID09PSBzZXR0aW5ncygnZWRnZUxhYmVsU2l6ZVBvd1JhdGlvJykpXG4gICAgICB0aHJvdyAnXCJlZGdlTGFiZWxTaXplUG93UmF0aW9cIiBtdXN0IG5vdCBiZSAwLic7XG5cbiAgICB2YXIgZm9udFNpemUsXG4gICAgICB4ID0gKHNvdXJjZVtwcmVmaXggKyAneCddICsgdGFyZ2V0W3ByZWZpeCArICd4J10pIC8gMixcbiAgICAgIHkgPSAoc291cmNlW3ByZWZpeCArICd5J10gKyB0YXJnZXRbcHJlZml4ICsgJ3knXSkgLyAyLFxuICAgICAgZFggPSB0YXJnZXRbcHJlZml4ICsgJ3gnXSAtIHNvdXJjZVtwcmVmaXggKyAneCddLFxuICAgICAgZFkgPSB0YXJnZXRbcHJlZml4ICsgJ3knXSAtIHNvdXJjZVtwcmVmaXggKyAneSddLFxuICAgICAgYW5nbGUgPSBNYXRoLmF0YW4yKGRZLCBkWCk7XG5cbiAgICBmb250U2l6ZSA9IChzZXR0aW5ncygnZWRnZUxhYmVsU2l6ZScpID09PSAnZml4ZWQnKSA/XG4gICAgICBzZXR0aW5ncygnZGVmYXVsdEVkZ2VMYWJlbFNpemUnKSA6XG4gICAgc2V0dGluZ3MoJ2RlZmF1bHRFZGdlTGFiZWxTaXplJykgKlxuICAgIHNpemUgKlxuICAgIE1hdGgucG93KHNpemUsIC0xIC8gc2V0dGluZ3MoJ2VkZ2VMYWJlbFNpemVQb3dSYXRpbycpKTtcblxuICAgIGNvbnRleHQuc2F2ZSgpO1xuXG4gICAgaWYgKGVkZ2UuYWN0aXZlKSB7XG4gICAgICBjb250ZXh0LmZvbnQgPSBbXG4gICAgICAgIHNldHRpbmdzKCdhY3RpdmVGb250U3R5bGUnKSxcbiAgICAgICAgZm9udFNpemUgKyAncHgnLFxuICAgICAgICBzZXR0aW5ncygnYWN0aXZlRm9udCcpIHx8IHNldHRpbmdzKCdmb250JylcbiAgICAgIF0uam9pbignICcpO1xuXG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250ZXh0LmZvbnQgPSBbXG4gICAgICAgIHNldHRpbmdzKCdmb250U3R5bGUnKSxcbiAgICAgICAgZm9udFNpemUgKyAncHgnLFxuICAgICAgICBzZXR0aW5ncygnZm9udCcpXG4gICAgICBdLmpvaW4oJyAnKTtcblxuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICB9XG5cbiAgICBjb250ZXh0LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIGNvbnRleHQudGV4dEJhc2VsaW5lID0gJ2FscGhhYmV0aWMnO1xuXG4gICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XG4gICAgY29udGV4dC5yb3RhdGUoYW5nbGUpO1xuICAgIGNvbnRleHQuZmlsbFRleHQoXG4gICAgICBlZGdlLndlaWdodCxcbiAgICAgIDAsXG4gICAgICAoLXNpemUgLyAyKSAtIDNcbiAgICApO1xuXG4gICAgY29udGV4dC5yZXN0b3JlKCk7XG4gIH0sXG4gIGRyYXdOb2RlV2VpZ2h0OiBmdW5jdGlvbiAobm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICB2YXIgZm9udFNpemUsXG4gICAgICBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJycsXG4gICAgICBzaXplID0gbm9kZVtwcmVmaXggKyAnc2l6ZSddO1xuXG4gICAgaWYgKHNpemUgPCBzZXR0aW5ncygnbGFiZWxUaHJlc2hvbGQnKSlcbiAgICAgIHJldHVybjtcblxuICAgIGZvbnRTaXplID0gKHNldHRpbmdzKCdsYWJlbFNpemUnKSA9PT0gJ2ZpeGVkJykgP1xuICAgICAgc2V0dGluZ3MoJ2RlZmF1bHRMYWJlbFNpemUnKSA6XG4gICAgc2V0dGluZ3MoJ2xhYmVsU2l6ZVJhdGlvJykgKiBzaXplO1xuXG4gICAgY29udGV4dC5mb250ID0gKHNldHRpbmdzKCdmb250U3R5bGUnKSA/IHNldHRpbmdzKCdmb250U3R5bGUnKSArICcgJyA6ICcnKSArXG4gICAgICBmb250U2l6ZSArICdweCAnICsgc2V0dGluZ3MoJ2ZvbnQnKTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IChzZXR0aW5ncygnbGFiZWxDb2xvcicpID09PSAnbm9kZScpID9cbiAgICAgIChub2RlLmNvbG9yIHx8IHNldHRpbmdzKCdkZWZhdWx0Tm9kZUNvbG9yJykpIDpcbiAgICAgIHNldHRpbmdzKCdkZWZhdWx0TGFiZWxDb2xvcicpO1xuXG4gICAgY29udGV4dC50ZXh0QWxpZ24gPSAnbGVmdCc7XG4gICAgY29udGV4dC5maWxsVGV4dChcbiAgICAgIG5vZGUud2VpZ2h0LFxuICAgICAgTWF0aC5yb3VuZChub2RlW3ByZWZpeCArICd4J10gKyBzaXplICogMS41KSxcbiAgICAgIE1hdGgucm91bmQobm9kZVtwcmVmaXggKyAneSddICsgZm9udFNpemUgLyAzKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlcjsiLCJjb25zdCBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXIgPSByZXF1aXJlKCcuL3dlaWdodGVkX2RpcmVjdGVkX2dyYXBoJyk7XG5jb25zdCBVbmRpcmVjdGVkR3JhcGhUcmFjZXIgPSByZXF1aXJlKCcuL3VuZGlyZWN0ZWRfZ3JhcGgnKTtcblxuZnVuY3Rpb24gV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGhUcmFjZXIoKSB7XG4gIGlmIChXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgIFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5XZWlnaHRlZFVuZGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUgPSAkLmV4dGVuZCh0cnVlLCBPYmplY3QuY3JlYXRlKFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUpLCB7XG4gIGNvbnN0cnVjdG9yOiBXZWlnaHRlZFVuZGlyZWN0ZWRHcmFwaFRyYWNlcixcbiAgbmFtZTogJ1dlaWdodGVkVW5kaXJlY3RlZEdyYXBoVHJhY2VyJyxcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0cmFjZXIgPSB0aGlzO1xuXG4gICAgdGhpcy5zLnNldHRpbmdzKHtcbiAgICAgIGRlZmF1bHRFZGdlVHlwZTogJ2RlZicsXG4gICAgICBmdW5jRWRnZXNEZWY6IGZ1bmN0aW9uIChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICAgdmFyIGNvbG9yID0gdHJhY2VyLmdldENvbG9yKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBzZXR0aW5ncyk7XG4gICAgICAgIHRyYWNlci5kcmF3RWRnZShlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgdHJhY2VyLmRyYXdFZGdlV2VpZ2h0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBzZXREYXRhOiBmdW5jdGlvbiAoRykge1xuICAgIGlmIChUcmFjZXIucHJvdG90eXBlLnNldERhdGEuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuIHRydWU7XG5cbiAgICB0aGlzLmdyYXBoLmNsZWFyKCk7XG4gICAgdmFyIG5vZGVzID0gW107XG4gICAgdmFyIGVkZ2VzID0gW107XG4gICAgdmFyIHVuaXRBbmdsZSA9IDIgKiBNYXRoLlBJIC8gRy5sZW5ndGg7XG4gICAgdmFyIGN1cnJlbnRBbmdsZSA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBHLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjdXJyZW50QW5nbGUgKz0gdW5pdEFuZ2xlO1xuICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgIGlkOiB0aGlzLm4oaSksXG4gICAgICAgIGxhYmVsOiAnJyArIGksXG4gICAgICAgIHg6IC41ICsgTWF0aC5zaW4oY3VycmVudEFuZ2xlKSAvIDIsXG4gICAgICAgIHk6IC41ICsgTWF0aC5jb3MoY3VycmVudEFuZ2xlKSAvIDIsXG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLmRlZmF1bHQsXG4gICAgICAgIHdlaWdodDogMFxuICAgICAgfSk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgRy5sZW5ndGg7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPD0gaTsgaisrKSB7XG4gICAgICAgIGlmIChHW2ldW2pdIHx8IEdbal1baV0pIHtcbiAgICAgICAgICBlZGdlcy5wdXNoKHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmUoaSwgaiksXG4gICAgICAgICAgICBzb3VyY2U6IHRoaXMubihpKSxcbiAgICAgICAgICAgIHRhcmdldDogdGhpcy5uKGopLFxuICAgICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdCxcbiAgICAgICAgICAgIHNpemU6IDEsXG4gICAgICAgICAgICB3ZWlnaHQ6IEdbaV1bal1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZ3JhcGgucmVhZCh7XG4gICAgICBub2Rlczogbm9kZXMsXG4gICAgICBlZGdlczogZWRnZXNcbiAgICB9KTtcbiAgICB0aGlzLnMuY2FtZXJhLmdvVG8oe1xuICAgICAgeDogMCxcbiAgICAgIHk6IDAsXG4gICAgICBhbmdsZTogMCxcbiAgICAgIHJhdGlvOiAxXG4gICAgfSk7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIGU6IFVuZGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUuZSxcbiAgZHJhd09uSG92ZXI6IFVuZGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUuZHJhd09uSG92ZXIsXG4gIGRyYXdFZGdlOiBVbmRpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlLmRyYXdFZGdlLFxuICBkcmF3RWRnZVdlaWdodDogZnVuY3Rpb24gKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICB2YXIgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnO1xuICAgIGlmIChzb3VyY2VbcHJlZml4ICsgJ3gnXSA+IHRhcmdldFtwcmVmaXggKyAneCddKSB7XG4gICAgICB2YXIgdGVtcCA9IHNvdXJjZTtcbiAgICAgIHNvdXJjZSA9IHRhcmdldDtcbiAgICAgIHRhcmdldCA9IHRlbXA7XG4gICAgfVxuICAgIFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUuZHJhd0VkZ2VXZWlnaHQuY2FsbCh0aGlzLCBlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGhUcmFjZXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgnLi9yZXF1ZXN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKHVybCkgPT4ge1xuXG4gIHJldHVybiByZXF1ZXN0KHVybCwge1xuICAgIHR5cGU6ICdHRVQnXG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHJlcXVlc3QgPSByZXF1aXJlKCcuL3JlcXVlc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cmwpIHtcbiAgcmV0dXJuIHJlcXVlc3QodXJsLCB7XG4gICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICB0eXBlOiAnR0VUJ1xuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgnLi9yZXF1ZXN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJsLCBkYXRhKSB7XG4gIHJldHVybiByZXF1ZXN0KHVybCwge1xuICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgdHlwZTogJ1BPU1QnLFxuICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBSU1ZQID0gcmVxdWlyZSgncnN2cCcpO1xuY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XG5cbmNvbnN0IHtcbiAgYWpheCxcbiAgZXh0ZW5kXG59ID0gJDtcblxuY29uc3QgZGVmYXVsdHMgPSB7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJsLCBvcHRpb25zID0ge30pIHtcbiAgYXBwLnNldElzTG9hZGluZyh0cnVlKTtcblxuICByZXR1cm4gbmV3IFJTVlAuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgY2FsbGJhY2tzID0ge1xuICAgICAgc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICBhcHAuc2V0SXNMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9LFxuICAgICAgZXJyb3IocmVhc29uKSB7XG4gICAgICAgIGFwcC5zZXRJc0xvYWRpbmcoZmFsc2UpO1xuICAgICAgICByZWplY3QocmVhc29uKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgb3B0cyA9IGV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMsIGNhbGxiYWNrcywge1xuICAgICAgdXJsXG4gICAgfSk7XG5cbiAgICBhamF4KG9wdHMpO1xuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBhcHAgPSByZXF1aXJlKCcuLi9hcHAnKTtcbmNvbnN0IFRvYXN0ID0gcmVxdWlyZSgnLi4vZG9tL3RvYXN0Jyk7XG5cbmNvbnN0IGNoZWNrTG9hZGluZyA9ICgpID0+IHtcbiAgaWYgKGFwcC5nZXRJc0xvYWRpbmcoKSkge1xuICAgIFRvYXN0LnNob3dFcnJvclRvYXN0KCdXYWl0IHVudGlsIGl0IGNvbXBsZXRlcyBsb2FkaW5nIG9mIHByZXZpb3VzIGZpbGUuJyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgZ2V0UGFyYW1ldGVyQnlOYW1lID0gKG5hbWUpID0+IHtcbiAgY29uc3QgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgWz8mXSR7bmFtZX0oPShbXiYjXSopfCZ8I3wkKWApO1xuXG4gIGNvbnN0IHJlc3VsdHMgPSByZWdleC5leGVjKHVybCk7XG5cbiAgaWYgKCFyZXN1bHRzIHx8IHJlc3VsdHMubGVuZ3RoICE9PSAzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBbLCAsIGlkXSA9IHJlc3VsdHM7XG5cbiAgcmV0dXJuIGlkO1xufTtcblxuY29uc3QgZ2V0SGFzaFZhbHVlID0gKGtleSk9PiB7XG4gIGlmICgha2V5KSByZXR1cm4gbnVsbDtcbiAgY29uc3QgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKTtcbiAgY29uc3QgcGFyYW1zID0gaGFzaCA/IGhhc2guc3BsaXQoJyYnKSA6IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmFtcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHBhaXIgPSBwYXJhbXNbaV0uc3BsaXQoJz0nKTtcbiAgICBpZiAocGFpclswXSA9PT0ga2V5KSB7XG4gICAgICByZXR1cm4gcGFpclsxXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5jb25zdCBzZXRIYXNoVmFsdWUgPSAoa2V5LCB2YWx1ZSk9PiB7XG4gIGlmICgha2V5IHx8ICF2YWx1ZSkgcmV0dXJuO1xuICBjb25zdCBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpO1xuICBjb25zdCBwYXJhbXMgPSBoYXNoID8gaGFzaC5zcGxpdCgnJicpIDogW107XG5cbiAgbGV0IGZvdW5kID0gZmFsc2U7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyYW1zLmxlbmd0aCAmJiAhZm91bmQ7IGkrKykge1xuICAgIGNvbnN0IHBhaXIgPSBwYXJhbXNbaV0uc3BsaXQoJz0nKTtcbiAgICBpZiAocGFpclswXSA9PT0ga2V5KSB7XG4gICAgICBwYWlyWzFdID0gdmFsdWU7XG4gICAgICBwYXJhbXNbaV0gPSBwYWlyLmpvaW4oJz0nKTtcbiAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgaWYgKCFmb3VuZCkge1xuICAgIHBhcmFtcy5wdXNoKFtrZXksIHZhbHVlXS5qb2luKCc9JykpO1xuICB9XG5cbiAgY29uc3QgbmV3SGFzaCA9IHBhcmFtcy5qb2luKCcmJyk7XG4gIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJyMnICsgbmV3SGFzaDtcbn07XG5cbmNvbnN0IHJlbW92ZUhhc2hWYWx1ZSA9IChrZXkpID0+IHtcbiAgaWYgKCFrZXkpIHJldHVybjtcbiAgY29uc3QgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKTtcbiAgY29uc3QgcGFyYW1zID0gaGFzaCA/IGhhc2guc3BsaXQoJyYnKSA6IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyYW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcGFpciA9IHBhcmFtc1tpXS5zcGxpdCgnPScpO1xuICAgIGlmIChwYWlyWzBdID09PSBrZXkpIHtcbiAgICAgIHBhcmFtcy5zcGxpY2UoaSwgMSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBjb25zdCBuZXdIYXNoID0gcGFyYW1zLmpvaW4oJyYnKTtcbiAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnIycgKyBuZXdIYXNoO1xufTtcblxuY29uc3Qgc2V0UGF0aCA9IChjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlKSA9PiB7XG4gIGNvbnN0IHBhdGggPSBjYXRlZ29yeSA/IGNhdGVnb3J5ICsgKGFsZ29yaXRobSA/ICcvJyArIGFsZ29yaXRobSArIChmaWxlID8gJy8nICsgZmlsZSA6ICcnKSA6ICcnKSA6ICcnO1xuICBzZXRIYXNoVmFsdWUoJ3BhdGgnLCBwYXRoKTtcbn07XG5cbmNvbnN0IGdldFBhdGggPSAoKSA9PiB7XG4gIGNvbnN0IGhhc2ggPSBnZXRIYXNoVmFsdWUoJ3BhdGgnKTtcbiAgaWYgKGhhc2gpIHtcbiAgICBjb25zdCBwYXJ0cyA9IGhhc2guc3BsaXQoJy8nKTtcbiAgICByZXR1cm4ge2NhdGVnb3J5OiBwYXJ0c1swXSwgYWxnb3JpdGhtOiBwYXJ0c1sxXSwgZmlsZTogcGFydHNbMl19O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNoZWNrTG9hZGluZyxcbiAgZ2V0UGFyYW1ldGVyQnlOYW1lLFxuICBnZXRIYXNoVmFsdWUsXG4gIHNldEhhc2hWYWx1ZSxcbiAgcmVtb3ZlSGFzaFZhbHVlLFxuICBzZXRQYXRoLFxuICBnZXRQYXRoXG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgbG9hZEFsZ29yaXRobSA9IHJlcXVpcmUoJy4vbG9hZF9hbGdvcml0aG0nKTtcbmNvbnN0IGxvYWRDYXRlZ29yaWVzID0gcmVxdWlyZSgnLi9sb2FkX2NhdGVnb3JpZXMnKTtcbmNvbnN0IGxvYWRGaWxlID0gcmVxdWlyZSgnLi9sb2FkX2ZpbGUnKTtcbmNvbnN0IGxvYWRTY3JhdGNoUGFwZXIgPSByZXF1aXJlKCcuL2xvYWRfc2NyYXRjaF9wYXBlcicpO1xuY29uc3Qgc2hhcmVTY3JhdGNoUGFwZXIgPSByZXF1aXJlKCcuL3NoYXJlX3NjcmF0Y2hfcGFwZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGxvYWRBbGdvcml0aG0sXG4gIGxvYWRDYXRlZ29yaWVzLFxuICBsb2FkRmlsZSxcbiAgbG9hZFNjcmF0Y2hQYXBlcixcbiAgc2hhcmVTY3JhdGNoUGFwZXJcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBnZXRKU09OID0gcmVxdWlyZSgnLi9hamF4L2dldF9qc29uJyk7XG5cbmNvbnN0IHtcbiAgZ2V0QWxnb3JpdGhtRGlyXG59ID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoY2F0ZWdvcnksIGFsZ29yaXRobSkgPT4ge1xuICBjb25zdCBkaXIgPSBnZXRBbGdvcml0aG1EaXIoY2F0ZWdvcnksIGFsZ29yaXRobSk7XG4gIHJldHVybiBnZXRKU09OKGAke2Rpcn1kZXNjLmpzb25gKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBnZXRKU09OID0gcmVxdWlyZSgnLi9hamF4L2dldF9qc29uJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuICByZXR1cm4gZ2V0SlNPTignLi9hbGdvcml0aG0vY2F0ZWdvcnkuanNvbicpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFJTVlAgPSByZXF1aXJlKCdyc3ZwJyk7XG5cbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuXG5jb25zdCB7XG4gIGdldEZpbGVEaXIsXG4gIGlzU2NyYXRjaFBhcGVyXG59ID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuY29uc3Qge1xuICBjaGVja0xvYWRpbmcsXG4gIHNldFBhdGhcbn0gPSByZXF1aXJlKCcuL2hlbHBlcnMnKTtcblxuY29uc3QgZ2V0ID0gcmVxdWlyZSgnLi9hamF4L2dldCcpO1xuXG5jb25zdCBsb2FkRGF0YUFuZENvZGUgPSAoZGlyKSA9PiB7XG4gIHJldHVybiBSU1ZQLmhhc2goe1xuICAgIGRhdGE6IGdldChgJHtkaXJ9ZGF0YS5qc2ApLFxuICAgIGNvZGU6IGdldChgJHtkaXJ9Y29kZS5qc2ApXG4gIH0pO1xufTtcblxuY29uc3QgbG9hZEZpbGVBbmRVcGRhdGVDb250ZW50ID0gKGRpcikgPT4ge1xuICBhcHAuZ2V0RWRpdG9yKCkuY2xlYXJDb250ZW50KCk7XG5cbiAgcmV0dXJuIGxvYWREYXRhQW5kQ29kZShkaXIpLnRoZW4oKGNvbnRlbnQpID0+IHtcbiAgICBhcHAudXBkYXRlQ2FjaGVkRmlsZShkaXIsIGNvbnRlbnQpO1xuICAgIGFwcC5nZXRFZGl0b3IoKS5zZXRDb250ZW50KGNvbnRlbnQpO1xuICB9KTtcbn07XG5cbmNvbnN0IGNhY2hlZENvbnRlbnRFeGlzdHMgPSAoY2FjaGVkRmlsZSkgPT4ge1xuICByZXR1cm4gY2FjaGVkRmlsZSAmJlxuICAgIGNhY2hlZEZpbGUuZGF0YSAhPT0gdW5kZWZpbmVkICYmXG4gICAgY2FjaGVkRmlsZS5jb2RlICE9PSB1bmRlZmluZWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IChjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlLCBleHBsYW5hdGlvbikgPT4ge1xuICByZXR1cm4gbmV3IFJTVlAuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgaWYgKGNoZWNrTG9hZGluZygpKSB7XG4gICAgICByZWplY3QoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzU2NyYXRjaFBhcGVyKGNhdGVnb3J5KSkge1xuICAgICAgICBzZXRQYXRoKGNhdGVnb3J5LCBhcHAuZ2V0TG9hZGVkU2NyYXRjaCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFBhdGgoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSk7XG4gICAgICB9XG4gICAgICAkKCcjZXhwbGFuYXRpb24nKS5odG1sKGV4cGxhbmF0aW9uKTtcblxuICAgICAgbGV0IGRpciA9IGdldEZpbGVEaXIoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSk7XG4gICAgICBhcHAuc2V0TGFzdEZpbGVVc2VkKGRpcik7XG4gICAgICBjb25zdCBjYWNoZWRGaWxlID0gYXBwLmdldENhY2hlZEZpbGUoZGlyKTtcblxuICAgICAgaWYgKGNhY2hlZENvbnRlbnRFeGlzdHMoY2FjaGVkRmlsZSkpIHtcbiAgICAgICAgYXBwLmdldEVkaXRvcigpLnNldENvbnRlbnQoY2FjaGVkRmlsZSk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvYWRGaWxlQW5kVXBkYXRlQ29udGVudChkaXIpLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFJTVlAgPSByZXF1aXJlKCdyc3ZwJyk7XG5jb25zdCBhcHAgPSByZXF1aXJlKCcuLi9hcHAnKTtcblxuY29uc3Qge1xuICBnZXRGaWxlRGlyXG59ID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuY29uc3QgZ2V0SlNPTiA9IHJlcXVpcmUoJy4vYWpheC9nZXRfanNvbicpO1xuY29uc3QgbG9hZEFsZ29yaXRobSA9IHJlcXVpcmUoJy4vbG9hZF9hbGdvcml0aG0nKTtcblxuY29uc3QgZXh0cmFjdEdpc3RDb2RlID0gKGZpbGVzLCBuYW1lKSA9PiBmaWxlc1tgJHtuYW1lfS5qc2BdLmNvbnRlbnQ7XG5cbm1vZHVsZS5leHBvcnRzID0gKGdpc3RJRCkgPT4ge1xuICByZXR1cm4gbmV3IFJTVlAuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgYXBwLnNldExvYWRlZFNjcmF0Y2goZ2lzdElEKTtcblxuICAgIGdldEpTT04oYGh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vZ2lzdHMvJHtnaXN0SUR9YCkudGhlbigoe1xuICAgICAgZmlsZXNcbiAgICB9KSA9PiB7XG5cbiAgICAgIGNvbnN0IGNhdGVnb3J5ID0gJ3NjcmF0Y2gnO1xuICAgICAgY29uc3QgYWxnb3JpdGhtID0gZ2lzdElEO1xuXG4gICAgICBsb2FkQWxnb3JpdGhtKGNhdGVnb3J5LCBhbGdvcml0aG0pLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICBjb25zdCBhbGdvRGF0YSA9IGV4dHJhY3RHaXN0Q29kZShmaWxlcywgJ2RhdGEnKTtcbiAgICAgICAgY29uc3QgYWxnb0NvZGUgPSBleHRyYWN0R2lzdENvZGUoZmlsZXMsICdjb2RlJyk7XG5cbiAgICAgICAgLy8gdXBkYXRlIHNjcmF0Y2ggcGFwZXIgYWxnbyBjb2RlIHdpdGggdGhlIGxvYWRlZCBnaXN0IGNvZGVcbiAgICAgICAgY29uc3QgZGlyID0gZ2V0RmlsZURpcihjYXRlZ29yeSwgYWxnb3JpdGhtLCAnc2NyYXRjaF9wYXBlcicpO1xuICAgICAgICBhcHAudXBkYXRlQ2FjaGVkRmlsZShkaXIsIHtcbiAgICAgICAgICBkYXRhOiBhbGdvRGF0YSxcbiAgICAgICAgICBjb2RlOiBhbGdvQ29kZSxcbiAgICAgICAgICAnQ1JFRElULm1kJzogJ1NoYXJlZCBieSBhbiBhbm9ueW1vdXMgdXNlciBmcm9tIGh0dHA6Ly9wYXJranM4MTQuZ2l0aHViLmlvL0FsZ29yaXRobVZpc3VhbGl6ZXInXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgIGNhdGVnb3J5LFxuICAgICAgICAgIGFsZ29yaXRobSxcbiAgICAgICAgICBkYXRhXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgUlNWUCA9IHJlcXVpcmUoJ3JzdnAnKTtcbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuXG5jb25zdCBwb3N0SlNPTiA9IHJlcXVpcmUoJy4vYWpheC9wb3N0X2pzb24nKTtcblxuY29uc3Qge1xuICBzZXRQYXRoXG59ID0gcmVxdWlyZSgnLi9oZWxwZXJzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuICByZXR1cm4gbmV3IFJTVlAuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICBjb25zdCB7XG4gICAgICBkYXRhRWRpdG9yLFxuICAgICAgY29kZUVkaXRvclxuICAgIH0gPSBhcHAuZ2V0RWRpdG9yKCk7XG5cbiAgICBjb25zdCBnaXN0ID0ge1xuICAgICAgJ2Rlc2NyaXB0aW9uJzogJ3RlbXAnLFxuICAgICAgJ3B1YmxpYyc6IHRydWUsXG4gICAgICAnZmlsZXMnOiB7XG4gICAgICAgICdkYXRhLmpzJzoge1xuICAgICAgICAgICdjb250ZW50JzogZGF0YUVkaXRvci5nZXRWYWx1ZSgpXG4gICAgICAgIH0sXG4gICAgICAgICdjb2RlLmpzJzoge1xuICAgICAgICAgICdjb250ZW50JzogY29kZUVkaXRvci5nZXRWYWx1ZSgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcG9zdEpTT04oJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vZ2lzdHMnLCBnaXN0KS50aGVuKCh7XG4gICAgICBpZFxuICAgIH0pID0+IHtcbiAgICAgIGFwcC5zZXRMb2FkZWRTY3JhdGNoKGlkKTtcbiAgICAgIHNldFBhdGgoJ3NjcmF0Y2gnLCBpZCk7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGhyZWZcbiAgICAgIH0gPSBsb2NhdGlvbjtcbiAgICAgICQoJyNhbGdvcml0aG0nKS5odG1sKCdTaGFyZWQnKTtcbiAgICAgIHJlc29sdmUoaHJlZik7XG4gICAgfSk7XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFRyYWNlck1hbmFnZXIgPSByZXF1aXJlKCcuL21hbmFnZXInKTtcbmNvbnN0IFRyYWNlciA9IHJlcXVpcmUoJy4uL21vZHVsZS90cmFjZXIvdHJhY2VyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGluaXQoKSB7XG4gICAgY29uc3QgdG0gPSBuZXcgVHJhY2VyTWFuYWdlcigpO1xuICAgIFRyYWNlci5wcm90b3R5cGUubWFuYWdlciA9IHRtO1xuICAgIHJldHVybiB0bTtcbiAgfVxuXG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc3RlcExpbWl0ID0gMWU2O1xuXG5jb25zdCBUcmFjZXJNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnRpbWVyID0gbnVsbDtcbiAgdGhpcy5wYXVzZSA9IGZhbHNlO1xuICB0aGlzLmNhcHN1bGVzID0gW107XG4gIHRoaXMuaW50ZXJ2YWwgPSA1MDA7XG59O1xuXG5UcmFjZXJNYW5hZ2VyLnByb3RvdHlwZSA9IHtcblxuICBhZGQodHJhY2VyKSB7XG5cbiAgICBjb25zdCAkY29udGFpbmVyID0gJCgnPHNlY3Rpb24gY2xhc3M9XCJtb2R1bGVfd3JhcHBlclwiPicpO1xuICAgICQoJy5tb2R1bGVfY29udGFpbmVyJykuYXBwZW5kKCRjb250YWluZXIpO1xuXG4gICAgY29uc3QgY2Fwc3VsZSA9IHtcbiAgICAgIG1vZHVsZTogdHJhY2VyLm1vZHVsZSxcbiAgICAgIHRyYWNlcixcbiAgICAgIGFsbG9jYXRlZDogdHJ1ZSxcbiAgICAgIGRlZmF1bHROYW1lOiBudWxsLFxuICAgICAgJGNvbnRhaW5lcixcbiAgICAgIGlzTmV3OiB0cnVlXG4gICAgfTtcblxuICAgIHRoaXMuY2Fwc3VsZXMucHVzaChjYXBzdWxlKTtcbiAgICByZXR1cm4gY2Fwc3VsZTtcbiAgfSxcblxuICBhbGxvY2F0ZShuZXdUcmFjZXIpIHtcbiAgICBsZXQgc2VsZWN0ZWRDYXBzdWxlID0gbnVsbDtcbiAgICBsZXQgY291bnQgPSAwO1xuXG4gICAgJC5lYWNoKHRoaXMuY2Fwc3VsZXMsIChpLCBjYXBzdWxlKSA9PiB7XG4gICAgICBpZiAoY2Fwc3VsZS5tb2R1bGUgPT09IG5ld1RyYWNlci5tb2R1bGUpIHtcbiAgICAgICAgY291bnQrKztcbiAgICAgICAgaWYgKCFjYXBzdWxlLmFsbG9jYXRlZCkge1xuICAgICAgICAgIGNhcHN1bGUudHJhY2VyID0gbmV3VHJhY2VyO1xuICAgICAgICAgIGNhcHN1bGUuYWxsb2NhdGVkID0gdHJ1ZTtcbiAgICAgICAgICBjYXBzdWxlLmlzTmV3ID0gZmFsc2U7XG4gICAgICAgICAgc2VsZWN0ZWRDYXBzdWxlID0gY2Fwc3VsZTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChzZWxlY3RlZENhcHN1bGUgPT09IG51bGwpIHtcbiAgICAgIGNvdW50Kys7XG4gICAgICBzZWxlY3RlZENhcHN1bGUgPSB0aGlzLmFkZChuZXdUcmFjZXIpO1xuICAgIH1cblxuICAgIHNlbGVjdGVkQ2Fwc3VsZS5kZWZhdWx0TmFtZSA9IGAke25ld1RyYWNlci5uYW1lfSAke2NvdW50fWA7XG4gICAgc2VsZWN0ZWRDYXBzdWxlLm9yZGVyID0gdGhpcy5vcmRlcisrO1xuICAgIHJldHVybiBzZWxlY3RlZENhcHN1bGU7XG4gIH0sXG5cbiAgZGVhbGxvY2F0ZUFsbCgpIHtcbiAgICB0aGlzLm9yZGVyID0gMDtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgJC5lYWNoKHRoaXMuY2Fwc3VsZXMsIChpLCBjYXBzdWxlKSA9PiB7XG4gICAgICBjYXBzdWxlLmFsbG9jYXRlZCA9IGZhbHNlO1xuICAgIH0pO1xuICB9LFxuXG4gIHJlbW92ZVVuYWxsb2NhdGVkKCkge1xuICAgIGxldCBjaGFuZ2VkID0gZmFsc2U7XG5cbiAgICB0aGlzLmNhcHN1bGVzID0gJC5ncmVwKHRoaXMuY2Fwc3VsZXMsIChjYXBzdWxlKSA9PiB7XG4gICAgICBsZXQgcmVtb3ZlZCA9ICFjYXBzdWxlLmFsbG9jYXRlZDtcblxuICAgICAgaWYgKGNhcHN1bGUuaXNOZXcgfHwgcmVtb3ZlZCkge1xuICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICAgIGNhcHN1bGUuJGNvbnRhaW5lci5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICFyZW1vdmVkO1xuICAgIH0pO1xuXG4gICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgIHRoaXMucGxhY2UoKTtcbiAgICB9XG4gIH0sXG5cbiAgcGxhY2UoKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2Fwc3VsZXNcbiAgICB9ID0gdGhpcztcblxuICAgICQuZWFjaChjYXBzdWxlcywgKGksIGNhcHN1bGUpID0+IHtcbiAgICAgIGxldCB3aWR0aCA9IDEwMDtcbiAgICAgIGxldCBoZWlnaHQgPSAoMTAwIC8gY2Fwc3VsZXMubGVuZ3RoKTtcbiAgICAgIGxldCB0b3AgPSBoZWlnaHQgKiBjYXBzdWxlLm9yZGVyO1xuXG4gICAgICBjYXBzdWxlLiRjb250YWluZXIuY3NzKHtcbiAgICAgICAgdG9wOiBgJHt0b3B9JWAsXG4gICAgICAgIHdpZHRoOiBgJHt3aWR0aH0lYCxcbiAgICAgICAgaGVpZ2h0OiBgJHtoZWlnaHR9JWBcbiAgICAgIH0pO1xuXG4gICAgICBjYXBzdWxlLnRyYWNlci5yZXNpemUoKTtcbiAgICB9KTtcbiAgfSxcblxuICByZXNpemUoKSB7XG4gICAgdGhpcy5jb21tYW5kKCdyZXNpemUnKTtcbiAgfSxcblxuICBpc1BhdXNlKCkge1xuICAgIHJldHVybiB0aGlzLnBhdXNlO1xuICB9LFxuXG4gIHNldEludGVydmFsKGludGVydmFsKSB7XG4gICAgJCgnI2ludGVydmFsJykudmFsKGludGVydmFsKTtcbiAgfSxcblxuICByZXNldCgpIHtcbiAgICB0aGlzLnRyYWNlcyA9IFtdO1xuICAgIHRoaXMudHJhY2VJbmRleCA9IC0xO1xuICAgIHRoaXMuc3RlcENudCA9IDA7XG4gICAgaWYgKHRoaXMudGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcbiAgICB9XG4gICAgdGhpcy5jb21tYW5kKCdjbGVhcicpO1xuICB9LFxuXG4gIHB1c2hTdGVwKGNhcHN1bGUsIHN0ZXApIHtcbiAgICBpZiAodGhpcy5zdGVwQ250KysgPiBzdGVwTGltaXQpIHRocm93IFwiVHJhY2VyJ3Mgc3RhY2sgb3ZlcmZsb3dcIjtcbiAgICBsZXQgbGVuID0gdGhpcy50cmFjZXMubGVuZ3RoO1xuICAgIGxldCBsYXN0ID0gW107XG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgdGhpcy50cmFjZXMucHVzaChsYXN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGFzdCA9IHRoaXMudHJhY2VzW2xlbiAtIDFdO1xuICAgIH1cbiAgICBsYXN0LnB1c2goJC5leHRlbmQoc3RlcCwge1xuICAgICAgY2Fwc3VsZVxuICAgIH0pKTtcbiAgfSxcblxuICBuZXdTdGVwKCkge1xuICAgIHRoaXMudHJhY2VzLnB1c2goW10pO1xuICB9LFxuXG4gIHBhdXNlU3RlcCgpIHtcbiAgICBpZiAodGhpcy50cmFjZUluZGV4IDwgMCkgcmV0dXJuO1xuICAgIHRoaXMucGF1c2UgPSB0cnVlO1xuICAgIGlmICh0aGlzLnRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgfVxuICAgICQoJyNidG5fcGF1c2UnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gIH0sXG5cbiAgcmVzdW1lU3RlcCgpIHtcbiAgICB0aGlzLnBhdXNlID0gZmFsc2U7XG4gICAgdGhpcy5zdGVwKHRoaXMudHJhY2VJbmRleCArIDEpO1xuICAgICQoJyNidG5fcGF1c2UnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gIH0sXG5cbiAgc3RlcChpLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB0cmFjZXIgPSB0aGlzO1xuXG4gICAgaWYgKGlzTmFOKGkpIHx8IGkgPj0gdGhpcy50cmFjZXMubGVuZ3RoIHx8IGkgPCAwKSByZXR1cm47XG5cbiAgICB0aGlzLnRyYWNlSW5kZXggPSBpO1xuICAgIGNvbnN0IHRyYWNlID0gdGhpcy50cmFjZXNbaV07XG4gICAgdHJhY2UuZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgc3RlcC5jYXBzdWxlLnRyYWNlci5wcm9jZXNzU3RlcChzdGVwLCBvcHRpb25zKTtcbiAgICB9KTtcblxuICAgIGlmICghb3B0aW9ucy52aXJ0dWFsKSB7XG4gICAgICB0aGlzLmNvbW1hbmQoJ3JlZnJlc2gnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXVzZSkgcmV0dXJuO1xuXG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdHJhY2VyLnN0ZXAoaSArIDEsIG9wdGlvbnMpO1xuICAgIH0sIHRoaXMuaW50ZXJ2YWwpO1xuICB9LFxuXG4gIHByZXZTdGVwKCkge1xuICAgIHRoaXMuY29tbWFuZCgnY2xlYXInKTtcblxuICAgIGNvbnN0IGZpbmFsSW5kZXggPSB0aGlzLnRyYWNlSW5kZXggLSAxO1xuICAgIGlmIChmaW5hbEluZGV4IDwgMCkge1xuICAgICAgdGhpcy50cmFjZUluZGV4ID0gLTE7XG4gICAgICB0aGlzLmNvbW1hbmQoJ3JlZnJlc2gnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbmFsSW5kZXg7IGkrKykge1xuICAgICAgdGhpcy5zdGVwKGksIHtcbiAgICAgICAgdmlydHVhbDogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGVwKGZpbmFsSW5kZXgpO1xuICB9LFxuXG4gIG5leHRTdGVwKCkge1xuICAgIHRoaXMuc3RlcCh0aGlzLnRyYWNlSW5kZXggKyAxKTtcbiAgfSxcblxuICB2aXN1YWxpemUoKSB7XG4gICAgdGhpcy50cmFjZUluZGV4ID0gLTE7XG4gICAgdGhpcy5yZXN1bWVTdGVwKCk7XG4gIH0sXG5cbiAgY29tbWFuZCguLi5hcmdzKSB7XG4gICAgY29uc3QgZnVuY3Rpb25OYW1lID0gYXJncy5zaGlmdCgpO1xuICAgICQuZWFjaCh0aGlzLmNhcHN1bGVzLCAoaSwgY2Fwc3VsZSkgPT4ge1xuICAgICAgaWYgKGNhcHN1bGUuYWxsb2NhdGVkKSB7XG4gICAgICAgIGNhcHN1bGUudHJhY2VyLm1vZHVsZS5wcm90b3R5cGVbZnVuY3Rpb25OYW1lXS5hcHBseShjYXBzdWxlLnRyYWNlciwgYXJncyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgZmluZE93bmVyKGNvbnRhaW5lcikge1xuICAgIGxldCBzZWxlY3RlZENhcHN1bGUgPSBudWxsO1xuICAgICQuZWFjaCh0aGlzLmNhcHN1bGVzLCAoaSwgY2Fwc3VsZSkgPT4ge1xuICAgICAgaWYgKGNhcHN1bGUuJGNvbnRhaW5lclswXSA9PT0gY29udGFpbmVyKSB7XG4gICAgICAgIHNlbGVjdGVkQ2Fwc3VsZSA9IGNhcHN1bGU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc2VsZWN0ZWRDYXBzdWxlLnRyYWNlcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZXJNYW5hZ2VyOyIsImNvbnN0IHtcbiAgcGFyc2Vcbn0gPSBKU09OO1xuXG5jb25zdCBmcm9tSlNPTiA9IChvYmopID0+IHtcbiAgcmV0dXJuIHBhcnNlKG9iaiwgKGtleSwgdmFsdWUpID0+IHtcbiAgICByZXR1cm4gdmFsdWUgPT09ICdJbmZpbml0eScgPyBJbmZpbml0eSA6IHZhbHVlO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnJvbUpTT047IiwiY29uc3QgdG9KU09OID0gcmVxdWlyZSgnLi90b19qc29uJyk7XG5jb25zdCBmcm9tSlNPTiA9IHJlcXVpcmUoJy4vZnJvbV9qc29uJyk7XG5jb25zdCByZWZpbmVCeVR5cGUgPSByZXF1aXJlKCcuL3JlZmluZV9ieV90eXBlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB0b0pTT04sXG4gIGZyb21KU09OLFxuICByZWZpbmVCeVR5cGVcbn07IiwiY29uc3QgcmVmaW5lQnlUeXBlID0gKGl0ZW0pID0+IHtcbiAgcmV0dXJuIHR5cGVvZihpdGVtKSA9PT0gJ251bWJlcicgPyByZWZpbmVOdW1iZXIoaXRlbSkgOiByZWZpbmVTdHJpbmcoaXRlbSk7XG59O1xuXG5jb25zdCByZWZpbmVTdHJpbmcgPSAoc3RyKSA9PiB7XG4gIHJldHVybiBzdHIgPT09ICcnID8gJyAnIDogc3RyO1xufTtcblxuY29uc3QgcmVmaW5lTnVtYmVyID0gKG51bSkgPT4ge1xuICByZXR1cm4gbnVtID09PSBJbmZpbml0eSA/ICfiiJ4nIDogbnVtO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSByZWZpbmVCeVR5cGU7IiwiY29uc3Qge1xuICBzdHJpbmdpZnlcbn0gPSBKU09OO1xuXG5jb25zdCB0b0pTT04gPSAob2JqKSA9PiB7XG4gIHJldHVybiBzdHJpbmdpZnkob2JqLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gSW5maW5pdHkgPyAnSW5maW5pdHknIDogdmFsdWU7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0b0pTT047IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBpc1NjcmF0Y2hQYXBlciA9IChjYXRlZ29yeSwgYWxnb3JpdGhtKSA9PiB7XG4gIHJldHVybiBjYXRlZ29yeSA9PSAnc2NyYXRjaCc7XG59O1xuXG5jb25zdCBnZXRBbGdvcml0aG1EaXIgPSAoY2F0ZWdvcnksIGFsZ29yaXRobSkgPT4ge1xuICBpZiAoaXNTY3JhdGNoUGFwZXIoY2F0ZWdvcnkpKSByZXR1cm4gJy4vYWxnb3JpdGhtL3NjcmF0Y2hfcGFwZXIvJztcbiAgcmV0dXJuIGAuL2FsZ29yaXRobS8ke2NhdGVnb3J5fS8ke2FsZ29yaXRobX0vYDtcbn07XG5cbmNvbnN0IGdldEZpbGVEaXIgPSAoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSkgPT4ge1xuICBpZiAoaXNTY3JhdGNoUGFwZXIoY2F0ZWdvcnkpKSByZXR1cm4gJy4vYWxnb3JpdGhtL3NjcmF0Y2hfcGFwZXIvJztcbiAgcmV0dXJuIGAuL2FsZ29yaXRobS8ke2NhdGVnb3J5fS8ke2FsZ29yaXRobX0vJHtmaWxlfS9gO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzU2NyYXRjaFBhcGVyLFxuICBnZXRBbGdvcml0aG1EaXIsXG4gIGdldEZpbGVEaXJcbn07IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKiFcbiAqIEBvdmVydmlldyBSU1ZQIC0gYSB0aW55IGltcGxlbWVudGF0aW9uIG9mIFByb21pc2VzL0ErLlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTQgWWVodWRhIEthdHosIFRvbSBEYWxlLCBTdGVmYW4gUGVubmVyIGFuZCBjb250cmlidXRvcnNcbiAqIEBsaWNlbnNlICAgTGljZW5zZWQgdW5kZXIgTUlUIGxpY2Vuc2VcbiAqICAgICAgICAgICAgU2VlIGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS90aWxkZWlvL3JzdnAuanMvbWFzdGVyL0xJQ0VOU0VcbiAqIEB2ZXJzaW9uICAgMy4yLjFcbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkdXRpbHMkJG9iamVjdE9yRnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nIHx8ICh0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkdXRpbHMkJGlzRnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHV0aWxzJCRpc01heWJlVGhlbmFibGUoeCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsO1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCR1dGlscyQkX2lzQXJyYXk7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KSB7XG4gICAgICBsaWIkcnN2cCR1dGlscyQkX2lzQXJyYXkgPSBmdW5jdGlvbiAoeCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGliJHJzdnAkdXRpbHMkJF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkdXRpbHMkJGlzQXJyYXkgPSBsaWIkcnN2cCR1dGlscyQkX2lzQXJyYXk7XG5cbiAgICB2YXIgbGliJHJzdnAkdXRpbHMkJG5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7IH07XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCR1dGlscyQkRigpIHsgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJHV0aWxzJCRvX2NyZWF0ZSA9IChPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIChvKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZWNvbmQgYXJndW1lbnQgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBvICE9PSAnb2JqZWN0Jykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICAgICAgfVxuICAgICAgbGliJHJzdnAkdXRpbHMkJEYucHJvdG90eXBlID0gbztcbiAgICAgIHJldHVybiBuZXcgbGliJHJzdnAkdXRpbHMkJEYoKTtcbiAgICB9KTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRldmVudHMkJGluZGV4T2YoY2FsbGJhY2tzLCBjYWxsYmFjaykge1xuICAgICAgZm9yICh2YXIgaT0wLCBsPWNhbGxiYWNrcy5sZW5ndGg7IGk8bDsgaSsrKSB7XG4gICAgICAgIGlmIChjYWxsYmFja3NbaV0gPT09IGNhbGxiYWNrKSB7IHJldHVybiBpOyB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRldmVudHMkJGNhbGxiYWNrc0ZvcihvYmplY3QpIHtcbiAgICAgIHZhciBjYWxsYmFja3MgPSBvYmplY3QuX3Byb21pc2VDYWxsYmFja3M7XG5cbiAgICAgIGlmICghY2FsbGJhY2tzKSB7XG4gICAgICAgIGNhbGxiYWNrcyA9IG9iamVjdC5fcHJvbWlzZUNhbGxiYWNrcyA9IHt9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2FsbGJhY2tzO1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRldmVudHMkJGRlZmF1bHQgPSB7XG5cbiAgICAgIC8qKlxuICAgICAgICBgUlNWUC5FdmVudFRhcmdldC5taXhpbmAgZXh0ZW5kcyBhbiBvYmplY3Qgd2l0aCBFdmVudFRhcmdldCBtZXRob2RzLiBGb3JcbiAgICAgICAgRXhhbXBsZTpcblxuICAgICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICAgIHZhciBvYmplY3QgPSB7fTtcblxuICAgICAgICBSU1ZQLkV2ZW50VGFyZ2V0Lm1peGluKG9iamVjdCk7XG5cbiAgICAgICAgb2JqZWN0Lm9uKCdmaW5pc2hlZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgLy8gaGFuZGxlIGV2ZW50XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG9iamVjdC50cmlnZ2VyKCdmaW5pc2hlZCcsIHsgZGV0YWlsOiB2YWx1ZSB9KTtcbiAgICAgICAgYGBgXG5cbiAgICAgICAgYEV2ZW50VGFyZ2V0Lm1peGluYCBhbHNvIHdvcmtzIHdpdGggcHJvdG90eXBlczpcblxuICAgICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICAgIHZhciBQZXJzb24gPSBmdW5jdGlvbigpIHt9O1xuICAgICAgICBSU1ZQLkV2ZW50VGFyZ2V0Lm1peGluKFBlcnNvbi5wcm90b3R5cGUpO1xuXG4gICAgICAgIHZhciB5ZWh1ZGEgPSBuZXcgUGVyc29uKCk7XG4gICAgICAgIHZhciB0b20gPSBuZXcgUGVyc29uKCk7XG5cbiAgICAgICAgeWVodWRhLm9uKCdwb2tlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnWWVodWRhIHNheXMgT1cnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdG9tLm9uKCdwb2tlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnVG9tIHNheXMgT1cnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgeWVodWRhLnRyaWdnZXIoJ3Bva2UnKTtcbiAgICAgICAgdG9tLnRyaWdnZXIoJ3Bva2UnKTtcbiAgICAgICAgYGBgXG5cbiAgICAgICAgQG1ldGhvZCBtaXhpblxuICAgICAgICBAZm9yIFJTVlAuRXZlbnRUYXJnZXRcbiAgICAgICAgQHByaXZhdGVcbiAgICAgICAgQHBhcmFtIHtPYmplY3R9IG9iamVjdCBvYmplY3QgdG8gZXh0ZW5kIHdpdGggRXZlbnRUYXJnZXQgbWV0aG9kc1xuICAgICAgKi9cbiAgICAgICdtaXhpbic6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICBvYmplY3RbJ29uJ10gICAgICA9IHRoaXNbJ29uJ107XG4gICAgICAgIG9iamVjdFsnb2ZmJ10gICAgID0gdGhpc1snb2ZmJ107XG4gICAgICAgIG9iamVjdFsndHJpZ2dlciddID0gdGhpc1sndHJpZ2dlciddO1xuICAgICAgICBvYmplY3QuX3Byb21pc2VDYWxsYmFja3MgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAgUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgZXhlY3V0ZWQgd2hlbiBgZXZlbnROYW1lYCBpcyB0cmlnZ2VyZWRcblxuICAgICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICAgIG9iamVjdC5vbignZXZlbnQnLCBmdW5jdGlvbihldmVudEluZm8pe1xuICAgICAgICAgIC8vIGhhbmRsZSB0aGUgZXZlbnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ2V2ZW50Jyk7XG4gICAgICAgIGBgYFxuXG4gICAgICAgIEBtZXRob2Qgb25cbiAgICAgICAgQGZvciBSU1ZQLkV2ZW50VGFyZ2V0XG4gICAgICAgIEBwcml2YXRlXG4gICAgICAgIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gbGlzdGVuIGZvclxuICAgICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgICAgKi9cbiAgICAgICdvbic6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0NhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFsbENhbGxiYWNrcyA9IGxpYiRyc3ZwJGV2ZW50cyQkY2FsbGJhY2tzRm9yKHRoaXMpLCBjYWxsYmFja3M7XG5cbiAgICAgICAgY2FsbGJhY2tzID0gYWxsQ2FsbGJhY2tzW2V2ZW50TmFtZV07XG5cbiAgICAgICAgaWYgKCFjYWxsYmFja3MpIHtcbiAgICAgICAgICBjYWxsYmFja3MgPSBhbGxDYWxsYmFja3NbZXZlbnROYW1lXSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpYiRyc3ZwJGV2ZW50cyQkaW5kZXhPZihjYWxsYmFja3MsIGNhbGxiYWNrKSA9PT0gLTEpIHtcbiAgICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICBZb3UgY2FuIHVzZSBgb2ZmYCB0byBzdG9wIGZpcmluZyBhIHBhcnRpY3VsYXIgY2FsbGJhY2sgZm9yIGFuIGV2ZW50OlxuXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgZnVuY3Rpb24gZG9TdHVmZigpIHsgLy8gZG8gc3R1ZmYhIH1cbiAgICAgICAgb2JqZWN0Lm9uKCdzdHVmZicsIGRvU3R1ZmYpO1xuXG4gICAgICAgIG9iamVjdC50cmlnZ2VyKCdzdHVmZicpOyAvLyBkb1N0dWZmIHdpbGwgYmUgY2FsbGVkXG5cbiAgICAgICAgLy8gVW5yZWdpc3RlciBPTkxZIHRoZSBkb1N0dWZmIGNhbGxiYWNrXG4gICAgICAgIG9iamVjdC5vZmYoJ3N0dWZmJywgZG9TdHVmZik7XG4gICAgICAgIG9iamVjdC50cmlnZ2VyKCdzdHVmZicpOyAvLyBkb1N0dWZmIHdpbGwgTk9UIGJlIGNhbGxlZFxuICAgICAgICBgYGBcblxuICAgICAgICBJZiB5b3UgZG9uJ3QgcGFzcyBhIGBjYWxsYmFja2AgYXJndW1lbnQgdG8gYG9mZmAsIEFMTCBjYWxsYmFja3MgZm9yIHRoZVxuICAgICAgICBldmVudCB3aWxsIG5vdCBiZSBleGVjdXRlZCB3aGVuIHRoZSBldmVudCBmaXJlcy4gRm9yIGV4YW1wbGU6XG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICB2YXIgY2FsbGJhY2sxID0gZnVuY3Rpb24oKXt9O1xuICAgICAgICB2YXIgY2FsbGJhY2syID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgICAgIG9iamVjdC5vbignc3R1ZmYnLCBjYWxsYmFjazEpO1xuICAgICAgICBvYmplY3Qub24oJ3N0dWZmJywgY2FsbGJhY2syKTtcblxuICAgICAgICBvYmplY3QudHJpZ2dlcignc3R1ZmYnKTsgLy8gY2FsbGJhY2sxIGFuZCBjYWxsYmFjazIgd2lsbCBiZSBleGVjdXRlZC5cblxuICAgICAgICBvYmplY3Qub2ZmKCdzdHVmZicpO1xuICAgICAgICBvYmplY3QudHJpZ2dlcignc3R1ZmYnKTsgLy8gY2FsbGJhY2sxIGFuZCBjYWxsYmFjazIgd2lsbCBub3QgYmUgZXhlY3V0ZWQhXG4gICAgICAgIGBgYFxuXG4gICAgICAgIEBtZXRob2Qgb2ZmXG4gICAgICAgIEBmb3IgUlNWUC5FdmVudFRhcmdldFxuICAgICAgICBAcHJpdmF0ZVxuICAgICAgICBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIGV2ZW50IHRvIHN0b3AgbGlzdGVuaW5nIHRvXG4gICAgICAgIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIG9wdGlvbmFsIGFyZ3VtZW50LiBJZiBnaXZlbiwgb25seSB0aGUgZnVuY3Rpb25cbiAgICAgICAgZ2l2ZW4gd2lsbCBiZSByZW1vdmVkIGZyb20gdGhlIGV2ZW50J3MgY2FsbGJhY2sgcXVldWUuIElmIG5vIGBjYWxsYmFja2BcbiAgICAgICAgYXJndW1lbnQgaXMgZ2l2ZW4sIGFsbCBjYWxsYmFja3Mgd2lsbCBiZSByZW1vdmVkIGZyb20gdGhlIGV2ZW50J3MgY2FsbGJhY2tcbiAgICAgICAgcXVldWUuXG4gICAgICAqL1xuICAgICAgJ29mZic6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGFsbENhbGxiYWNrcyA9IGxpYiRyc3ZwJGV2ZW50cyQkY2FsbGJhY2tzRm9yKHRoaXMpLCBjYWxsYmFja3MsIGluZGV4O1xuXG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICBhbGxDYWxsYmFja3NbZXZlbnROYW1lXSA9IFtdO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrcyA9IGFsbENhbGxiYWNrc1tldmVudE5hbWVdO1xuXG4gICAgICAgIGluZGV4ID0gbGliJHJzdnAkZXZlbnRzJCRpbmRleE9mKGNhbGxiYWNrcywgY2FsbGJhY2spO1xuXG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHsgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7IH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICBVc2UgYHRyaWdnZXJgIHRvIGZpcmUgY3VzdG9tIGV2ZW50cy4gRm9yIGV4YW1wbGU6XG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICBvYmplY3Qub24oJ2ZvbycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2ZvbyBldmVudCBoYXBwZW5lZCEnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG9iamVjdC50cmlnZ2VyKCdmb28nKTtcbiAgICAgICAgLy8gJ2ZvbyBldmVudCBoYXBwZW5lZCEnIGxvZ2dlZCB0byB0aGUgY29uc29sZVxuICAgICAgICBgYGBcblxuICAgICAgICBZb3UgY2FuIGFsc28gcGFzcyBhIHZhbHVlIGFzIGEgc2Vjb25kIGFyZ3VtZW50IHRvIGB0cmlnZ2VyYCB0aGF0IHdpbGwgYmVcbiAgICAgICAgcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIGFsbCBldmVudCBsaXN0ZW5lcnMgZm9yIHRoZSBldmVudDpcblxuICAgICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICAgIG9iamVjdC5vbignZm9vJywgZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlLm5hbWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBvYmplY3QudHJpZ2dlcignZm9vJywgeyBuYW1lOiAnYmFyJyB9KTtcbiAgICAgICAgLy8gJ2JhcicgbG9nZ2VkIHRvIHRoZSBjb25zb2xlXG4gICAgICAgIGBgYFxuXG4gICAgICAgIEBtZXRob2QgdHJpZ2dlclxuICAgICAgICBAZm9yIFJTVlAuRXZlbnRUYXJnZXRcbiAgICAgICAgQHByaXZhdGVcbiAgICAgICAgQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBuYW1lIG9mIHRoZSBldmVudCB0byBiZSB0cmlnZ2VyZWRcbiAgICAgICAgQHBhcmFtIHsqfSBvcHRpb25zIG9wdGlvbmFsIHZhbHVlIHRvIGJlIHBhc3NlZCB0byBhbnkgZXZlbnQgaGFuZGxlcnMgZm9yXG4gICAgICAgIHRoZSBnaXZlbiBgZXZlbnROYW1lYFxuICAgICAgKi9cbiAgICAgICd0cmlnZ2VyJzogZnVuY3Rpb24oZXZlbnROYW1lLCBvcHRpb25zLCBsYWJlbCkge1xuICAgICAgICB2YXIgYWxsQ2FsbGJhY2tzID0gbGliJHJzdnAkZXZlbnRzJCRjYWxsYmFja3NGb3IodGhpcyksIGNhbGxiYWNrcywgY2FsbGJhY2s7XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrcyA9IGFsbENhbGxiYWNrc1tldmVudE5hbWVdKSB7XG4gICAgICAgICAgLy8gRG9uJ3QgY2FjaGUgdGhlIGNhbGxiYWNrcy5sZW5ndGggc2luY2UgaXQgbWF5IGdyb3dcbiAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8Y2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrc1tpXTtcblxuICAgICAgICAgICAgY2FsbGJhY2sob3B0aW9ucywgbGFiZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgbGliJHJzdnAkY29uZmlnJCRjb25maWcgPSB7XG4gICAgICBpbnN0cnVtZW50OiBmYWxzZVxuICAgIH07XG5cbiAgICBsaWIkcnN2cCRldmVudHMkJGRlZmF1bHRbJ21peGluJ10obGliJHJzdnAkY29uZmlnJCRjb25maWcpO1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkY29uZmlnJCRjb25maWd1cmUobmFtZSwgdmFsdWUpIHtcbiAgICAgIGlmIChuYW1lID09PSAnb25lcnJvcicpIHtcbiAgICAgICAgLy8gaGFuZGxlIGZvciBsZWdhY3kgdXNlcnMgdGhhdCBleHBlY3QgdGhlIGFjdHVhbFxuICAgICAgICAvLyBlcnJvciB0byBiZSBwYXNzZWQgdG8gdGhlaXIgZnVuY3Rpb24gYWRkZWQgdmlhXG4gICAgICAgIC8vIGBSU1ZQLmNvbmZpZ3VyZSgnb25lcnJvcicsIHNvbWVGdW5jdGlvbkhlcmUpO2BcbiAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWdbJ29uJ10oJ2Vycm9yJywgdmFsdWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnW25hbWVdID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbGliJHJzdnAkY29uZmlnJCRjb25maWdbbmFtZV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJGluc3RydW1lbnQkJHF1ZXVlID0gW107XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRpbnN0cnVtZW50JCRzY2hlZHVsZUZsdXNoKCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVudHJ5O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpYiRyc3ZwJGluc3RydW1lbnQkJHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZW50cnkgPSBsaWIkcnN2cCRpbnN0cnVtZW50JCRxdWV1ZVtpXTtcblxuICAgICAgICAgIHZhciBwYXlsb2FkID0gZW50cnkucGF5bG9hZDtcblxuICAgICAgICAgIHBheWxvYWQuZ3VpZCA9IHBheWxvYWQua2V5ICsgcGF5bG9hZC5pZDtcbiAgICAgICAgICBwYXlsb2FkLmNoaWxkR3VpZCA9IHBheWxvYWQua2V5ICsgcGF5bG9hZC5jaGlsZElkO1xuICAgICAgICAgIGlmIChwYXlsb2FkLmVycm9yKSB7XG4gICAgICAgICAgICBwYXlsb2FkLnN0YWNrID0gcGF5bG9hZC5lcnJvci5zdGFjaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1sndHJpZ2dlciddKGVudHJ5Lm5hbWUsIGVudHJ5LnBheWxvYWQpO1xuICAgICAgICB9XG4gICAgICAgIGxpYiRyc3ZwJGluc3RydW1lbnQkJHF1ZXVlLmxlbmd0aCA9IDA7XG4gICAgICB9LCA1MCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkaW5zdHJ1bWVudCQkaW5zdHJ1bWVudChldmVudE5hbWUsIHByb21pc2UsIGNoaWxkKSB7XG4gICAgICBpZiAoMSA9PT0gbGliJHJzdnAkaW5zdHJ1bWVudCQkcXVldWUucHVzaCh7XG4gICAgICAgIG5hbWU6IGV2ZW50TmFtZSxcbiAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgIGtleTogcHJvbWlzZS5fZ3VpZEtleSxcbiAgICAgICAgICBpZDogIHByb21pc2UuX2lkLFxuICAgICAgICAgIGV2ZW50TmFtZTogZXZlbnROYW1lLFxuICAgICAgICAgIGRldGFpbDogcHJvbWlzZS5fcmVzdWx0LFxuICAgICAgICAgIGNoaWxkSWQ6IGNoaWxkICYmIGNoaWxkLl9pZCxcbiAgICAgICAgICBsYWJlbDogcHJvbWlzZS5fbGFiZWwsXG4gICAgICAgICAgdGltZVN0YW1wOiBsaWIkcnN2cCR1dGlscyQkbm93KCksXG4gICAgICAgICAgZXJyb3I6IGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnW1wiaW5zdHJ1bWVudC13aXRoLXN0YWNrXCJdID8gbmV3IEVycm9yKHByb21pc2UuX2xhYmVsKSA6IG51bGxcbiAgICAgICAgfX0pKSB7XG4gICAgICAgICAgbGliJHJzdnAkaW5zdHJ1bWVudCQkc2NoZWR1bGVGbHVzaCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJGluc3RydW1lbnQkJGRlZmF1bHQgPSBsaWIkcnN2cCRpbnN0cnVtZW50JCRpbnN0cnVtZW50O1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHRoZW4kJHRoZW4ob25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24sIGxhYmVsKSB7XG4gICAgICB2YXIgcGFyZW50ID0gdGhpcztcbiAgICAgIHZhciBzdGF0ZSA9IHBhcmVudC5fc3RhdGU7XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQgJiYgIW9uRnVsZmlsbG1lbnQgfHwgc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURUQgJiYgIW9uUmVqZWN0aW9uKSB7XG4gICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmluc3RydW1lbnQgJiYgbGliJHJzdnAkaW5zdHJ1bWVudCQkZGVmYXVsdCgnY2hhaW5lZCcsIHBhcmVudCwgcGFyZW50KTtcbiAgICAgICAgcmV0dXJuIHBhcmVudDtcbiAgICAgIH1cblxuICAgICAgcGFyZW50Ll9vbkVycm9yID0gbnVsbDtcblxuICAgICAgdmFyIGNoaWxkID0gbmV3IHBhcmVudC5jb25zdHJ1Y3RvcihsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3AsIGxhYmVsKTtcbiAgICAgIHZhciByZXN1bHQgPSBwYXJlbnQuX3Jlc3VsdDtcblxuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuaW5zdHJ1bWVudCAmJiBsaWIkcnN2cCRpbnN0cnVtZW50JCRkZWZhdWx0KCdjaGFpbmVkJywgcGFyZW50LCBjaGlsZCk7XG5cbiAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbc3RhdGUgLSAxXTtcbiAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYXN5bmMoZnVuY3Rpb24oKXtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGludm9rZUNhbGxiYWNrKHN0YXRlLCBjaGlsZCwgY2FsbGJhY2ssIHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2hpbGQ7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCR0aGVuJCRkZWZhdWx0ID0gbGliJHJzdnAkdGhlbiQkdGhlbjtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJHJlc29sdmUkJHJlc29sdmUob2JqZWN0LCBsYWJlbCkge1xuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICAgIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0LmNvbnN0cnVjdG9yID09PSBDb25zdHJ1Y3Rvcikge1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfVxuXG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3AsIGxhYmVsKTtcbiAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCBvYmplY3QpO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQgPSBsaWIkcnN2cCRwcm9taXNlJHJlc29sdmUkJHJlc29sdmU7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkZW51bWVyYXRvciQkbWFrZVNldHRsZWRSZXN1bHQoc3RhdGUsIHBvc2l0aW9uLCB2YWx1ZSkge1xuICAgICAgaWYgKHN0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YXRlOiAnZnVsZmlsbGVkJyxcbiAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YXRlOiAncmVqZWN0ZWQnLFxuICAgICAgICAgIHJlYXNvbjogdmFsdWVcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yKENvbnN0cnVjdG9yLCBpbnB1dCwgYWJvcnRPblJlamVjdCwgbGFiZWwpIHtcbiAgICAgIHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcbiAgICAgIHRoaXMucHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3AsIGxhYmVsKTtcbiAgICAgIHRoaXMuX2Fib3J0T25SZWplY3QgPSBhYm9ydE9uUmVqZWN0O1xuXG4gICAgICBpZiAodGhpcy5fdmFsaWRhdGVJbnB1dChpbnB1dCkpIHtcbiAgICAgICAgdGhpcy5faW5wdXQgICAgID0gaW5wdXQ7XG4gICAgICAgIHRoaXMubGVuZ3RoICAgICA9IGlucHV0Lmxlbmd0aDtcbiAgICAgICAgdGhpcy5fcmVtYWluaW5nID0gaW5wdXQubGVuZ3RoO1xuXG4gICAgICAgIHRoaXMuX2luaXQoKTtcblxuICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5sZW5ndGggfHwgMDtcbiAgICAgICAgICB0aGlzLl9lbnVtZXJhdGUoKTtcbiAgICAgICAgICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QodGhpcy5wcm9taXNlLCB0aGlzLl92YWxpZGF0aW9uRXJyb3IoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQgPSBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yO1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3ZhbGlkYXRlSW5wdXQgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHV0aWxzJCRpc0FycmF5KGlucHV0KTtcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3ZhbGlkYXRpb25FcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignQXJyYXkgTWV0aG9kcyBtdXN0IGJlIHByb3ZpZGVkIGFuIEFycmF5Jyk7XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9yZXN1bHQgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGgpO1xuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fZW51bWVyYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGVuZ3RoICAgICA9IHRoaXMubGVuZ3RoO1xuICAgICAgdmFyIHByb21pc2UgICAgPSB0aGlzLnByb21pc2U7XG4gICAgICB2YXIgaW5wdXQgICAgICA9IHRoaXMuX2lucHV0O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgcHJvbWlzZS5fc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORyAmJiBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5fZWFjaEVudHJ5KGlucHV0W2ldLCBpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3NldHRsZU1heWJlVGhlbmFibGUgPSBmdW5jdGlvbihlbnRyeSwgaSkge1xuICAgICAgdmFyIGMgPSB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yO1xuICAgICAgdmFyIHJlc29sdmUgPSBjLnJlc29sdmU7XG5cbiAgICAgIGlmIChyZXNvbHZlID09PSBsaWIkcnN2cCRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQpIHtcbiAgICAgICAgdmFyIHRoZW4gPSBsaWIkcnN2cCQkaW50ZXJuYWwkJGdldFRoZW4oZW50cnkpO1xuXG4gICAgICAgIGlmICh0aGVuID09PSBsaWIkcnN2cCR0aGVuJCRkZWZhdWx0ICYmXG4gICAgICAgICAgICBlbnRyeS5fc3RhdGUgIT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORykge1xuICAgICAgICAgIGVudHJ5Ll9vbkVycm9yID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9zZXR0bGVkQXQoZW50cnkuX3N0YXRlLCBpLCBlbnRyeS5fcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhlbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuICAgICAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IHRoaXMuX21ha2VSZXN1bHQobGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQsIGksIGVudHJ5KTtcbiAgICAgICAgfSBlbHNlIGlmIChjID09PSBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0KSB7XG4gICAgICAgICAgdmFyIHByb21pc2UgPSBuZXcgYyhsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3ApO1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBlbnRyeSwgdGhlbik7XG4gICAgICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KHByb21pc2UsIGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChuZXcgYyhmdW5jdGlvbihyZXNvbHZlKSB7IHJlc29sdmUoZW50cnkpOyB9KSwgaSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChyZXNvbHZlKGVudHJ5KSwgaSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9lYWNoRW50cnkgPSBmdW5jdGlvbihlbnRyeSwgaSkge1xuICAgICAgaWYgKGxpYiRyc3ZwJHV0aWxzJCRpc01heWJlVGhlbmFibGUoZW50cnkpKSB7XG4gICAgICAgIHRoaXMuX3NldHRsZU1heWJlVGhlbmFibGUoZW50cnksIGkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcmVtYWluaW5nLS07XG4gICAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IHRoaXMuX21ha2VSZXN1bHQobGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQsIGksIGVudHJ5KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3NldHRsZWRBdCA9IGZ1bmN0aW9uKHN0YXRlLCBpLCB2YWx1ZSkge1xuICAgICAgdmFyIHByb21pc2UgPSB0aGlzLnByb21pc2U7XG5cbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HKSB7XG4gICAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuXG4gICAgICAgIGlmICh0aGlzLl9hYm9ydE9uUmVqZWN0ICYmIHN0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IHRoaXMuX21ha2VSZXN1bHQoc3RhdGUsIGksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fbWFrZVJlc3VsdCA9IGZ1bmN0aW9uKHN0YXRlLCBpLCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fd2lsbFNldHRsZUF0ID0gZnVuY3Rpb24ocHJvbWlzZSwgaSkge1xuICAgICAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuXG4gICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHN1YnNjcmliZShwcm9taXNlLCB1bmRlZmluZWQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGVudW1lcmF0b3IuX3NldHRsZWRBdChsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCwgaSwgdmFsdWUpO1xuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGVudW1lcmF0b3IuX3NldHRsZWRBdChsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVELCBpLCByZWFzb24pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJGFsbCQkYWxsKGVudHJpZXMsIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbmV3IGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQodGhpcywgZW50cmllcywgdHJ1ZSAvKiBhYm9ydCBvbiByZWplY3QgKi8sIGxhYmVsKS5wcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSRhbGwkJGRlZmF1bHQgPSBsaWIkcnN2cCRwcm9taXNlJGFsbCQkYWxsO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkcmFjZSQkcmFjZShlbnRyaWVzLCBsYWJlbCkge1xuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICAgIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCwgbGFiZWwpO1xuXG4gICAgICBpZiAoIWxpYiRyc3ZwJHV0aWxzJCRpc0FycmF5KGVudHJpZXMpKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gcmFjZS4nKSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgbGVuZ3RoID0gZW50cmllcy5sZW5ndGg7XG5cbiAgICAgIGZ1bmN0aW9uIG9uRnVsZmlsbG1lbnQodmFsdWUpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gb25SZWplY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBwcm9taXNlLl9zdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HICYmIGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHN1YnNjcmliZShDb25zdHJ1Y3Rvci5yZXNvbHZlKGVudHJpZXNbaV0pLCB1bmRlZmluZWQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJHJhY2UkJGRlZmF1bHQgPSBsaWIkcnN2cCRwcm9taXNlJHJhY2UkJHJhY2U7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcHJvbWlzZSRyZWplY3QkJHJlamVjdChyZWFzb24sIGxhYmVsKSB7XG4gICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCwgbGFiZWwpO1xuICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSRyZWplY3QkJGRlZmF1bHQgPSBsaWIkcnN2cCRwcm9taXNlJHJlamVjdCQkcmVqZWN0O1xuXG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkJGd1aWRLZXkgPSAncnN2cF8nICsgbGliJHJzdnAkdXRpbHMkJG5vdygpICsgJy0nO1xuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJCRjb3VudGVyID0gMDtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkJG5lZWRzUmVzb2x2ZXIoKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGEgcmVzb2x2ZXIgZnVuY3Rpb24gYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBwcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcHJvbWlzZSQkbmVlZHNOZXcoKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmFpbGVkIHRvIGNvbnN0cnVjdCAnUHJvbWlzZSc6IFBsZWFzZSB1c2UgdGhlICduZXcnIG9wZXJhdG9yLCB0aGlzIG9iamVjdCBjb25zdHJ1Y3RvciBjYW5ub3QgYmUgY2FsbGVkIGFzIGEgZnVuY3Rpb24uXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UocmVzb2x2ZXIsIGxhYmVsKSB7XG4gICAgICB0aGlzLl9pZCA9IGxpYiRyc3ZwJHByb21pc2UkJGNvdW50ZXIrKztcbiAgICAgIHRoaXMuX2xhYmVsID0gbGFiZWw7XG4gICAgICB0aGlzLl9zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX3Jlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX3N1YnNjcmliZXJzID0gW107XG5cbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmluc3RydW1lbnQgJiYgbGliJHJzdnAkaW5zdHJ1bWVudCQkZGVmYXVsdCgnY3JlYXRlZCcsIHRoaXMpO1xuXG4gICAgICBpZiAobGliJHJzdnAkJGludGVybmFsJCRub29wICE9PSByZXNvbHZlcikge1xuICAgICAgICB0eXBlb2YgcmVzb2x2ZXIgIT09ICdmdW5jdGlvbicgJiYgbGliJHJzdnAkcHJvbWlzZSQkbmVlZHNSZXNvbHZlcigpO1xuICAgICAgICB0aGlzIGluc3RhbmNlb2YgbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZSA/IGxpYiRyc3ZwJCRpbnRlcm5hbCQkaW5pdGlhbGl6ZVByb21pc2UodGhpcywgcmVzb2x2ZXIpIDogbGliJHJzdnAkcHJvbWlzZSQkbmVlZHNOZXcoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdCA9IGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2U7XG5cbiAgICAvLyBkZXByZWNhdGVkXG4gICAgbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZS5jYXN0ID0gbGliJHJzdnAkcHJvbWlzZSRyZXNvbHZlJCRkZWZhdWx0O1xuICAgIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UuYWxsID0gbGliJHJzdnAkcHJvbWlzZSRhbGwkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZS5yYWNlID0gbGliJHJzdnAkcHJvbWlzZSRyYWNlJCRkZWZhdWx0O1xuICAgIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UucmVzb2x2ZSA9IGxpYiRyc3ZwJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlLnJlamVjdCA9IGxpYiRyc3ZwJHByb21pc2UkcmVqZWN0JCRkZWZhdWx0O1xuXG4gICAgbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZS5wcm90b3R5cGUgPSB7XG4gICAgICBjb25zdHJ1Y3RvcjogbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZSxcblxuICAgICAgX2d1aWRLZXk6IGxpYiRyc3ZwJHByb21pc2UkJGd1aWRLZXksXG5cbiAgICAgIF9vbkVycm9yOiBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIHZhciBwcm9taXNlID0gdGhpcztcbiAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYWZ0ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHByb21pc2UuX29uRXJyb3IpIHtcbiAgICAgICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnWyd0cmlnZ2VyJ10oJ2Vycm9yJywgcmVhc29uLCBwcm9taXNlLl9sYWJlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAvKipcbiAgICAgIFRoZSBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLFxuICAgICAgd2hpY2ggcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGVcbiAgICAgIHJlYXNvbiB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgLy8gdXNlciBpcyBhdmFpbGFibGVcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIC8vIHVzZXIgaXMgdW5hdmFpbGFibGUsIGFuZCB5b3UgYXJlIGdpdmVuIHRoZSByZWFzb24gd2h5XG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBDaGFpbmluZ1xuICAgICAgLS0tLS0tLS1cblxuICAgICAgVGhlIHJldHVybiB2YWx1ZSBvZiBgdGhlbmAgaXMgaXRzZWxmIGEgcHJvbWlzZS4gIFRoaXMgc2Vjb25kLCAnZG93bnN0cmVhbSdcbiAgICAgIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmaXJzdCBwcm9taXNlJ3MgZnVsZmlsbG1lbnRcbiAgICAgIG9yIHJlamVjdGlvbiBoYW5kbGVyLCBvciByZWplY3RlZCBpZiB0aGUgaGFuZGxlciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHJldHVybiB1c2VyLm5hbWU7XG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIHJldHVybiAnZGVmYXVsdCBuYW1lJztcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHVzZXJOYW1lKSB7XG4gICAgICAgIC8vIElmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgdXNlck5hbWVgIHdpbGwgYmUgdGhlIHVzZXIncyBuYW1lLCBvdGhlcndpc2UgaXRcbiAgICAgICAgLy8gd2lsbCBiZSBgJ2RlZmF1bHQgbmFtZSdgXG4gICAgICB9KTtcblxuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jyk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIC8vIGlmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgcmVhc29uYCB3aWxsIGJlICdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScuXG4gICAgICAgIC8vIElmIGBmaW5kVXNlcmAgcmVqZWN0ZWQsIGByZWFzb25gIHdpbGwgYmUgJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknLlxuICAgICAgfSk7XG4gICAgICBgYGBcbiAgICAgIElmIHRoZSBkb3duc3RyZWFtIHByb21pc2UgZG9lcyBub3Qgc3BlY2lmeSBhIHJlamVjdGlvbiBoYW5kbGVyLCByZWplY3Rpb24gcmVhc29ucyB3aWxsIGJlIHByb3BhZ2F0ZWQgZnVydGhlciBkb3duc3RyZWFtLlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHRocm93IG5ldyBQZWRhZ29naWNhbEV4Y2VwdGlvbignVXBzdHJlYW0gZXJyb3InKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgLy8gVGhlIGBQZWRnYWdvY2lhbEV4Y2VwdGlvbmAgaXMgcHJvcGFnYXRlZCBhbGwgdGhlIHdheSBkb3duIHRvIGhlcmVcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIEFzc2ltaWxhdGlvblxuICAgICAgLS0tLS0tLS0tLS0tXG5cbiAgICAgIFNvbWV0aW1lcyB0aGUgdmFsdWUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIHRvIGEgZG93bnN0cmVhbSBwcm9taXNlIGNhbiBvbmx5IGJlXG4gICAgICByZXRyaWV2ZWQgYXN5bmNocm9ub3VzbHkuIFRoaXMgY2FuIGJlIGFjaGlldmVkIGJ5IHJldHVybmluZyBhIHByb21pc2UgaW4gdGhlXG4gICAgICBmdWxmaWxsbWVudCBvciByZWplY3Rpb24gaGFuZGxlci4gVGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIHRoZW4gYmUgcGVuZGluZ1xuICAgICAgdW50aWwgdGhlIHJldHVybmVkIHByb21pc2UgaXMgc2V0dGxlZC4gVGhpcyBpcyBjYWxsZWQgKmFzc2ltaWxhdGlvbiouXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgICAgLy8gVGhlIHVzZXIncyBjb21tZW50cyBhcmUgbm93IGF2YWlsYWJsZVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgSWYgdGhlIGFzc2ltbGlhdGVkIHByb21pc2UgcmVqZWN0cywgdGhlbiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgYWxzbyByZWplY3QuXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCBmdWxmaWxscywgd2UnbGwgaGF2ZSB0aGUgdmFsdWUgaGVyZVxuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIHJlamVjdHMsIHdlJ2xsIGhhdmUgdGhlIHJlYXNvbiBoZXJlXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBTaW1wbGUgRXhhbXBsZVxuICAgICAgLS0tLS0tLS0tLS0tLS1cblxuICAgICAgU3luY2hyb25vdXMgRXhhbXBsZVxuXG4gICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICB2YXIgcmVzdWx0O1xuXG4gICAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSBmaW5kUmVzdWx0KCk7XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH1cbiAgICAgIGBgYFxuXG4gICAgICBFcnJiYWNrIEV4YW1wbGVcblxuICAgICAgYGBganNcbiAgICAgIGZpbmRSZXN1bHQoZnVuY3Rpb24ocmVzdWx0LCBlcnIpe1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgUHJvbWlzZSBFeGFtcGxlO1xuXG4gICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICBmaW5kUmVzdWx0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBBZHZhbmNlZCBFeGFtcGxlXG4gICAgICAtLS0tLS0tLS0tLS0tLVxuXG4gICAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG5cbiAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgIHZhciBhdXRob3IsIGJvb2tzO1xuXG4gICAgICB0cnkge1xuICAgICAgICBhdXRob3IgPSBmaW5kQXV0aG9yKCk7XG4gICAgICAgIGJvb2tzICA9IGZpbmRCb29rc0J5QXV0aG9yKGF1dGhvcik7XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH1cbiAgICAgIGBgYFxuXG4gICAgICBFcnJiYWNrIEV4YW1wbGVcblxuICAgICAgYGBganNcblxuICAgICAgZnVuY3Rpb24gZm91bmRCb29rcyhib29rcykge1xuXG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGZhaWx1cmUocmVhc29uKSB7XG5cbiAgICAgIH1cblxuICAgICAgZmluZEF1dGhvcihmdW5jdGlvbihhdXRob3IsIGVycil7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmaW5kQm9vb2tzQnlBdXRob3IoYXV0aG9yLCBmdW5jdGlvbihib29rcywgZXJyKSB7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGZvdW5kQm9va3MoYm9va3MpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgICAgICAgICAgICBmYWlsdXJlKHJlYXNvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgUHJvbWlzZSBFeGFtcGxlO1xuXG4gICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICBmaW5kQXV0aG9yKCkuXG4gICAgICAgIHRoZW4oZmluZEJvb2tzQnlBdXRob3IpLlxuICAgICAgICB0aGVuKGZ1bmN0aW9uKGJvb2tzKXtcbiAgICAgICAgICAvLyBmb3VuZCBib29rc1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIEBtZXRob2QgdGhlblxuICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gb25GdWxmaWxsbWVudFxuICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3Rpb25cbiAgICAgIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGxhYmVsaW5nIHRoZSBwcm9taXNlLlxuICAgICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgICAgQHJldHVybiB7UHJvbWlzZX1cbiAgICAqL1xuICAgICAgdGhlbjogbGliJHJzdnAkdGhlbiQkZGVmYXVsdCxcblxuICAgIC8qKlxuICAgICAgYGNhdGNoYCBpcyBzaW1wbHkgc3VnYXIgZm9yIGB0aGVuKHVuZGVmaW5lZCwgb25SZWplY3Rpb24pYCB3aGljaCBtYWtlcyBpdCB0aGUgc2FtZVxuICAgICAgYXMgdGhlIGNhdGNoIGJsb2NrIG9mIGEgdHJ5L2NhdGNoIHN0YXRlbWVudC5cblxuICAgICAgYGBganNcbiAgICAgIGZ1bmN0aW9uIGZpbmRBdXRob3IoKXtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZG4ndCBmaW5kIHRoYXQgYXV0aG9yJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIHN5bmNocm9ub3VzXG4gICAgICB0cnkge1xuICAgICAgICBmaW5kQXV0aG9yKCk7XG4gICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgICAgfVxuXG4gICAgICAvLyBhc3luYyB3aXRoIHByb21pc2VzXG4gICAgICBmaW5kQXV0aG9yKCkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIEBtZXRob2QgY2F0Y2hcbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0aW9uXG4gICAgICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgb3B0aW9uYWwgc3RyaW5nIGZvciBsYWJlbGluZyB0aGUgcHJvbWlzZS5cbiAgICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICAgKi9cbiAgICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0aW9uLCBsYWJlbCkge1xuICAgICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3Rpb24sIGxhYmVsKTtcbiAgICAgIH0sXG5cbiAgICAvKipcbiAgICAgIGBmaW5hbGx5YCB3aWxsIGJlIGludm9rZWQgcmVnYXJkbGVzcyBvZiB0aGUgcHJvbWlzZSdzIGZhdGUganVzdCBhcyBuYXRpdmVcbiAgICAgIHRyeS9jYXRjaC9maW5hbGx5IGJlaGF2ZXNcblxuICAgICAgU3luY2hyb25vdXMgZXhhbXBsZTpcblxuICAgICAgYGBganNcbiAgICAgIGZpbmRBdXRob3IoKSB7XG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBBdXRob3IoKTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGZpbmRBdXRob3IoKTsgLy8gc3VjY2VlZCBvciBmYWlsXG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBmaW5kT3RoZXJBdXRoZXIoKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIC8vIGFsd2F5cyBydW5zXG4gICAgICAgIC8vIGRvZXNuJ3QgYWZmZWN0IHRoZSByZXR1cm4gdmFsdWVcbiAgICAgIH1cbiAgICAgIGBgYFxuXG4gICAgICBBc3luY2hyb25vdXMgZXhhbXBsZTpcblxuICAgICAgYGBganNcbiAgICAgIGZpbmRBdXRob3IoKS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICByZXR1cm4gZmluZE90aGVyQXV0aGVyKCk7XG4gICAgICB9KS5maW5hbGx5KGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIGF1dGhvciB3YXMgZWl0aGVyIGZvdW5kLCBvciBub3RcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIEBtZXRob2QgZmluYWxseVxuICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGxhYmVsaW5nIHRoZSBwcm9taXNlLlxuICAgICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgICAgQHJldHVybiB7UHJvbWlzZX1cbiAgICAqL1xuICAgICAgJ2ZpbmFsbHknOiBmdW5jdGlvbihjYWxsYmFjaywgbGFiZWwpIHtcbiAgICAgICAgdmFyIHByb21pc2UgPSB0aGlzO1xuICAgICAgICB2YXIgY29uc3RydWN0b3IgPSBwcm9taXNlLmNvbnN0cnVjdG9yO1xuXG4gICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3IucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3IucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlamVjdChyZWFzb24pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBsYWJlbCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBmdW5jdGlvbiAgbGliJHJzdnAkJGludGVybmFsJCR3aXRoT3duUHJvbWlzZSgpIHtcbiAgICAgIHJldHVybiBuZXcgVHlwZUVycm9yKCdBIHByb21pc2VzIGNhbGxiYWNrIGNhbm5vdCByZXR1cm4gdGhhdCBzYW1lIHByb21pc2UuJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRub29wKCkge31cblxuICAgIHZhciBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcgICA9IHZvaWQgMDtcbiAgICB2YXIgbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQgPSAxO1xuICAgIHZhciBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEICA9IDI7XG5cbiAgICB2YXIgbGliJHJzdnAkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUiA9IG5ldyBsaWIkcnN2cCQkaW50ZXJuYWwkJEVycm9yT2JqZWN0KCk7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJGdldFRoZW4ocHJvbWlzZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbjtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUi5lcnJvciA9IGVycm9yO1xuICAgICAgICByZXR1cm4gbGliJHJzdnAkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJHRyeVRoZW4odGhlbiwgdmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybiBlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlLCB0aGVuKSB7XG4gICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hc3luYyhmdW5jdGlvbihwcm9taXNlKSB7XG4gICAgICAgIHZhciBzZWFsZWQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGVycm9yID0gbGliJHJzdnAkJGludGVybmFsJCR0cnlUaGVuKHRoZW4sIHRoZW5hYmxlLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIGlmIChzZWFsZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAodGhlbmFibGUgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgICBpZiAoc2VhbGVkKSB7IHJldHVybjsgfVxuICAgICAgICAgIHNlYWxlZCA9IHRydWU7XG5cbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgICB9LCAnU2V0dGxlOiAnICsgKHByb21pc2UuX2xhYmVsIHx8ICcgdW5rbm93biBwcm9taXNlJykpO1xuXG4gICAgICAgIGlmICghc2VhbGVkICYmIGVycm9yKSB7XG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0sIHByb21pc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUpIHtcbiAgICAgIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgICAgIH0gZWxzZSBpZiAodGhlbmFibGUuX3N0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEKSB7XG4gICAgICAgIHRoZW5hYmxlLl9vbkVycm9yID0gbnVsbDtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHN1YnNjcmliZSh0aGVuYWJsZSwgdW5kZWZpbmVkLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIGlmICh0aGVuYWJsZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSwgdW5kZWZpbmVkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuKSB7XG4gICAgICBpZiAobWF5YmVUaGVuYWJsZS5jb25zdHJ1Y3RvciA9PT0gcHJvbWlzZS5jb25zdHJ1Y3RvciAmJlxuICAgICAgICAgIHRoZW4gPT09IGxpYiRyc3ZwJHRoZW4kJGRlZmF1bHQgJiZcbiAgICAgICAgICBjb25zdHJ1Y3Rvci5yZXNvbHZlID09PSBsaWIkcnN2cCRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGVuID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbGliJHJzdnAkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUi5lcnJvcik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhlbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGxpYiRyc3ZwJHV0aWxzJCRpc0Z1bmN0aW9uKHRoZW4pKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKSB7XG4gICAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAobGliJHJzdnAkdXRpbHMkJG9iamVjdE9yRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSwgbGliJHJzdnAkJGludGVybmFsJCRnZXRUaGVuKHZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcHVibGlzaFJlamVjdGlvbihwcm9taXNlKSB7XG4gICAgICBpZiAocHJvbWlzZS5fb25FcnJvcikge1xuICAgICAgICBwcm9taXNlLl9vbkVycm9yKHByb21pc2UuX3Jlc3VsdCk7XG4gICAgICB9XG5cbiAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcHVibGlzaChwcm9taXNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpIHtcbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HKSB7IHJldHVybjsgfVxuXG4gICAgICBwcm9taXNlLl9yZXN1bHQgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3N0YXRlID0gbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQ7XG5cbiAgICAgIGlmIChwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgaWYgKGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmluc3RydW1lbnQpIHtcbiAgICAgICAgICBsaWIkcnN2cCRpbnN0cnVtZW50JCRkZWZhdWx0KCdmdWxmaWxsZWQnLCBwcm9taXNlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYXN5bmMobGliJHJzdnAkJGludGVybmFsJCRwdWJsaXNoLCBwcm9taXNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pIHtcbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HKSB7IHJldHVybjsgfVxuICAgICAgcHJvbWlzZS5fc3RhdGUgPSBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEO1xuICAgICAgcHJvbWlzZS5fcmVzdWx0ID0gcmVhc29uO1xuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYXN5bmMobGliJHJzdnAkJGludGVybmFsJCRwdWJsaXNoUmVqZWN0aW9uLCBwcm9taXNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICAgICAgdmFyIHN1YnNjcmliZXJzID0gcGFyZW50Ll9zdWJzY3JpYmVycztcbiAgICAgIHZhciBsZW5ndGggPSBzdWJzY3JpYmVycy5sZW5ndGg7XG5cbiAgICAgIHBhcmVudC5fb25FcnJvciA9IG51bGw7XG5cbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aF0gPSBjaGlsZDtcbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aCArIGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEXSA9IG9uRnVsZmlsbG1lbnQ7XG4gICAgICBzdWJzY3JpYmVyc1tsZW5ndGggKyBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEXSAgPSBvblJlamVjdGlvbjtcblxuICAgICAgaWYgKGxlbmd0aCA9PT0gMCAmJiBwYXJlbnQuX3N0YXRlKSB7XG4gICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jKGxpYiRyc3ZwJCRpbnRlcm5hbCQkcHVibGlzaCwgcGFyZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJHB1Ymxpc2gocHJvbWlzZSkge1xuICAgICAgdmFyIHN1YnNjcmliZXJzID0gcHJvbWlzZS5fc3Vic2NyaWJlcnM7XG4gICAgICB2YXIgc2V0dGxlZCA9IHByb21pc2UuX3N0YXRlO1xuXG4gICAgICBpZiAobGliJHJzdnAkY29uZmlnJCRjb25maWcuaW5zdHJ1bWVudCkge1xuICAgICAgICBsaWIkcnN2cCRpbnN0cnVtZW50JCRkZWZhdWx0KHNldHRsZWQgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEID8gJ2Z1bGZpbGxlZCcgOiAncmVqZWN0ZWQnLCBwcm9taXNlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm47IH1cblxuICAgICAgdmFyIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsID0gcHJvbWlzZS5fcmVzdWx0O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICAgIGNoaWxkID0gc3Vic2NyaWJlcnNbaV07XG4gICAgICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xuXG4gICAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgY2hpbGQsIGNhbGxiYWNrLCBkZXRhaWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKGRldGFpbCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoID0gMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJEVycm9yT2JqZWN0KCkge1xuICAgICAgdGhpcy5lcnJvciA9IG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SID0gbmV3IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRXJyb3JPYmplY3QoKTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGRldGFpbCk7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1IuZXJyb3IgPSBlO1xuICAgICAgICByZXR1cm4gbGliJHJzdnAkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBwcm9taXNlLCBjYWxsYmFjaywgZGV0YWlsKSB7XG4gICAgICB2YXIgaGFzQ2FsbGJhY2sgPSBsaWIkcnN2cCR1dGlscyQkaXNGdW5jdGlvbihjYWxsYmFjayksXG4gICAgICAgICAgdmFsdWUsIGVycm9yLCBzdWNjZWVkZWQsIGZhaWxlZDtcblxuICAgICAgaWYgKGhhc0NhbGxiYWNrKSB7XG4gICAgICAgIHZhbHVlID0gbGliJHJzdnAkJGludGVybmFsJCR0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKTtcblxuICAgICAgICBpZiAodmFsdWUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SKSB7XG4gICAgICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgICBlcnJvciA9IHZhbHVlLmVycm9yO1xuICAgICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbGliJHJzdnAkJGludGVybmFsJCR3aXRoT3duUHJvbWlzZSgpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBkZXRhaWw7XG4gICAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HKSB7XG4gICAgICAgIC8vIG5vb3BcbiAgICAgIH0gZWxzZSBpZiAoaGFzQ2FsbGJhY2sgJiYgc3VjY2VlZGVkKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGZhaWxlZCkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURUQpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaW5pdGlhbGl6ZVByb21pc2UocHJvbWlzZSwgcmVzb2x2ZXIpIHtcbiAgICAgIHZhciByZXNvbHZlZCA9IGZhbHNlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzb2x2ZXIoZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UodmFsdWUpe1xuICAgICAgICAgIGlmIChyZXNvbHZlZCkgeyByZXR1cm47IH1cbiAgICAgICAgICByZXNvbHZlZCA9IHRydWU7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gcmVqZWN0UHJvbWlzZShyZWFzb24pIHtcbiAgICAgICAgICBpZiAocmVzb2x2ZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgcmVzb2x2ZWQgPSB0cnVlO1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRBbGxTZXR0bGVkKENvbnN0cnVjdG9yLCBlbnRyaWVzLCBsYWJlbCkge1xuICAgICAgdGhpcy5fc3VwZXJDb25zdHJ1Y3RvcihDb25zdHJ1Y3RvciwgZW50cmllcywgZmFsc2UgLyogZG9uJ3QgYWJvcnQgb24gcmVqZWN0ICovLCBsYWJlbCk7XG4gICAgfVxuXG4gICAgbGliJHJzdnAkYWxsJHNldHRsZWQkJEFsbFNldHRsZWQucHJvdG90eXBlID0gbGliJHJzdnAkdXRpbHMkJG9fY3JlYXRlKGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQucHJvdG90eXBlKTtcbiAgICBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkQWxsU2V0dGxlZC5wcm90b3R5cGUuX3N1cGVyQ29uc3RydWN0b3IgPSBsaWIkcnN2cCRlbnVtZXJhdG9yJCRkZWZhdWx0O1xuICAgIGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRBbGxTZXR0bGVkLnByb3RvdHlwZS5fbWFrZVJlc3VsdCA9IGxpYiRyc3ZwJGVudW1lcmF0b3IkJG1ha2VTZXR0bGVkUmVzdWx0O1xuICAgIGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRBbGxTZXR0bGVkLnByb3RvdHlwZS5fdmFsaWRhdGlvbkVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdhbGxTZXR0bGVkIG11c3QgYmUgY2FsbGVkIHdpdGggYW4gYXJyYXknKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYWxsJHNldHRsZWQkJGFsbFNldHRsZWQoZW50cmllcywgbGFiZWwpIHtcbiAgICAgIHJldHVybiBuZXcgbGliJHJzdnAkYWxsJHNldHRsZWQkJEFsbFNldHRsZWQobGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdCwgZW50cmllcywgbGFiZWwpLnByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkZGVmYXVsdCA9IGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRhbGxTZXR0bGVkO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFsbCQkYWxsKGFycmF5LCBsYWJlbCkge1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQuYWxsKGFycmF5LCBsYWJlbCk7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRhbGwkJGRlZmF1bHQgPSBsaWIkcnN2cCRhbGwkJGFsbDtcbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkbGVuID0gMDtcbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkdG9TdHJpbmcgPSB7fS50b1N0cmluZztcbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkdmVydHhOZXh0O1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJGFzYXAoY2FsbGJhY2ssIGFyZykge1xuICAgICAgbGliJHJzdnAkYXNhcCQkcXVldWVbbGliJHJzdnAkYXNhcCQkbGVuXSA9IGNhbGxiYWNrO1xuICAgICAgbGliJHJzdnAkYXNhcCQkcXVldWVbbGliJHJzdnAkYXNhcCQkbGVuICsgMV0gPSBhcmc7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRsZW4gKz0gMjtcbiAgICAgIGlmIChsaWIkcnN2cCRhc2FwJCRsZW4gPT09IDIpIHtcbiAgICAgICAgLy8gSWYgbGVuIGlzIDEsIHRoYXQgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIHNjaGVkdWxlIGFuIGFzeW5jIGZsdXNoLlxuICAgICAgICAvLyBJZiBhZGRpdGlvbmFsIGNhbGxiYWNrcyBhcmUgcXVldWVkIGJlZm9yZSB0aGUgcXVldWUgaXMgZmx1c2hlZCwgdGhleVxuICAgICAgICAvLyB3aWxsIGJlIHByb2Nlc3NlZCBieSB0aGlzIGZsdXNoIHRoYXQgd2UgYXJlIHNjaGVkdWxpbmcuXG4gICAgICAgIGxpYiRyc3ZwJGFzYXAkJHNjaGVkdWxlRmx1c2goKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkZGVmYXVsdCA9IGxpYiRyc3ZwJGFzYXAkJGFzYXA7XG5cbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkYnJvd3NlcldpbmRvdyA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgPyB3aW5kb3cgOiB1bmRlZmluZWQ7XG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJGJyb3dzZXJHbG9iYWwgPSBsaWIkcnN2cCRhc2FwJCRicm93c2VyV2luZG93IHx8IHt9O1xuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGxpYiRyc3ZwJGFzYXAkJGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBsaWIkcnN2cCRhc2FwJCRicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJGlzTm9kZSA9IHR5cGVvZiBzZWxmID09PSAndW5kZWZpbmVkJyAmJlxuICAgICAgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHt9LnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJztcblxuICAgIC8vIHRlc3QgZm9yIHdlYiB3b3JrZXIgYnV0IG5vdCBpbiBJRTEwXG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJGlzV29ya2VyID0gdHlwZW9mIFVpbnQ4Q2xhbXBlZEFycmF5ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgdHlwZW9mIGltcG9ydFNjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2YgTWVzc2FnZUNoYW5uZWwgIT09ICd1bmRlZmluZWQnO1xuXG4gICAgLy8gbm9kZVxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJHVzZU5leHRUaWNrKCkge1xuICAgICAgdmFyIG5leHRUaWNrID0gcHJvY2Vzcy5uZXh0VGljaztcbiAgICAgIC8vIG5vZGUgdmVyc2lvbiAwLjEwLnggZGlzcGxheXMgYSBkZXByZWNhdGlvbiB3YXJuaW5nIHdoZW4gbmV4dFRpY2sgaXMgdXNlZCByZWN1cnNpdmVseVxuICAgICAgLy8gc2V0SW1tZWRpYXRlIHNob3VsZCBiZSB1c2VkIGluc3RlYWQgaW5zdGVhZFxuICAgICAgdmFyIHZlcnNpb24gPSBwcm9jZXNzLnZlcnNpb25zLm5vZGUubWF0Y2goL14oPzooXFxkKylcXC4pPyg/OihcXGQrKVxcLik/KFxcKnxcXGQrKSQvKTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZlcnNpb24pICYmIHZlcnNpb25bMV0gPT09ICcwJyAmJiB2ZXJzaW9uWzJdID09PSAnMTAnKSB7XG4gICAgICAgIG5leHRUaWNrID0gc2V0SW1tZWRpYXRlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBuZXh0VGljayhsaWIkcnN2cCRhc2FwJCRmbHVzaCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIHZlcnR4XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkdXNlVmVydHhUaW1lcigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGliJHJzdnAkYXNhcCQkdmVydHhOZXh0KGxpYiRyc3ZwJGFzYXAkJGZsdXNoKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBsaWIkcnN2cCRhc2FwJCRCcm93c2VyTXV0YXRpb25PYnNlcnZlcihsaWIkcnN2cCRhc2FwJCRmbHVzaCk7XG4gICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICAgIG9ic2VydmVyLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pO1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIG5vZGUuZGF0YSA9IChpdGVyYXRpb25zID0gKytpdGVyYXRpb25zICUgMik7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIHdlYiB3b3JrZXJcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCR1c2VNZXNzYWdlQ2hhbm5lbCgpIHtcbiAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpYiRyc3ZwJGFzYXAkJGZsdXNoO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkdXNlU2V0VGltZW91dCgpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgc2V0VGltZW91dChsaWIkcnN2cCRhc2FwJCRmbHVzaCwgMSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRxdWV1ZSA9IG5ldyBBcnJheSgxMDAwKTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCRmbHVzaCgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGliJHJzdnAkYXNhcCQkbGVuOyBpKz0yKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGxpYiRyc3ZwJGFzYXAkJHF1ZXVlW2ldO1xuICAgICAgICB2YXIgYXJnID0gbGliJHJzdnAkYXNhcCQkcXVldWVbaSsxXTtcblxuICAgICAgICBjYWxsYmFjayhhcmcpO1xuXG4gICAgICAgIGxpYiRyc3ZwJGFzYXAkJHF1ZXVlW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICBsaWIkcnN2cCRhc2FwJCRxdWV1ZVtpKzFdID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBsaWIkcnN2cCRhc2FwJCRsZW4gPSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJGF0dGVtcHRWZXJ0ZXgoKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgciA9IHJlcXVpcmU7XG4gICAgICAgIHZhciB2ZXJ0eCA9IHIoJ3ZlcnR4Jyk7XG4gICAgICAgIGxpYiRyc3ZwJGFzYXAkJHZlcnR4TmV4dCA9IHZlcnR4LnJ1bk9uTG9vcCB8fCB2ZXJ0eC5ydW5PbkNvbnRleHQ7XG4gICAgICAgIHJldHVybiBsaWIkcnN2cCRhc2FwJCR1c2VWZXJ0eFRpbWVyKCk7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJGFzYXAkJHVzZVNldFRpbWVvdXQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaDtcbiAgICAvLyBEZWNpZGUgd2hhdCBhc3luYyBtZXRob2QgdG8gdXNlIHRvIHRyaWdnZXJpbmcgcHJvY2Vzc2luZyBvZiBxdWV1ZWQgY2FsbGJhY2tzOlxuICAgIGlmIChsaWIkcnN2cCRhc2FwJCRpc05vZGUpIHtcbiAgICAgIGxpYiRyc3ZwJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkcnN2cCRhc2FwJCR1c2VOZXh0VGljaygpO1xuICAgIH0gZWxzZSBpZiAobGliJHJzdnAkYXNhcCQkQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgICAgIGxpYiRyc3ZwJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkcnN2cCRhc2FwJCR1c2VNdXRhdGlvbk9ic2VydmVyKCk7XG4gICAgfSBlbHNlIGlmIChsaWIkcnN2cCRhc2FwJCRpc1dvcmtlcikge1xuICAgICAgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRyc3ZwJGFzYXAkJHVzZU1lc3NhZ2VDaGFubmVsKCk7XG4gICAgfSBlbHNlIGlmIChsaWIkcnN2cCRhc2FwJCRicm93c2VyV2luZG93ID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGxpYiRyc3ZwJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkcnN2cCRhc2FwJCRhdHRlbXB0VmVydGV4KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpYiRyc3ZwJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkcnN2cCRhc2FwJCR1c2VTZXRUaW1lb3V0KCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGRlZmVyJCRkZWZlcihsYWJlbCkge1xuICAgICAgdmFyIGRlZmVycmVkID0ge307XG5cbiAgICAgIGRlZmVycmVkWydwcm9taXNlJ10gPSBuZXcgbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZGVmZXJyZWRbJ3Jlc29sdmUnXSA9IHJlc29sdmU7XG4gICAgICAgIGRlZmVycmVkWydyZWplY3QnXSA9IHJlamVjdDtcbiAgICAgIH0sIGxhYmVsKTtcblxuICAgICAgcmV0dXJuIGRlZmVycmVkO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkZGVmZXIkJGRlZmF1bHQgPSBsaWIkcnN2cCRkZWZlciQkZGVmZXI7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkZmlsdGVyJCRmaWx0ZXIocHJvbWlzZXMsIGZpbHRlckZuLCBsYWJlbCkge1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQuYWxsKHByb21pc2VzLCBsYWJlbCkudGhlbihmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgICAgaWYgKCFsaWIkcnN2cCR1dGlscyQkaXNGdW5jdGlvbihmaWx0ZXJGbikpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiWW91IG11c3QgcGFzcyBhIGZ1bmN0aW9uIGFzIGZpbHRlcidzIHNlY29uZCBhcmd1bWVudC5cIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aDtcbiAgICAgICAgdmFyIGZpbHRlcmVkID0gbmV3IEFycmF5KGxlbmd0aCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgIGZpbHRlcmVkW2ldID0gZmlsdGVyRm4odmFsdWVzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LmFsbChmaWx0ZXJlZCwgbGFiZWwpLnRoZW4oZnVuY3Rpb24oZmlsdGVyZWQpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0cyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgICAgICAgIHZhciBuZXdMZW5ndGggPSAwO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZpbHRlcmVkW2ldKSB7XG4gICAgICAgICAgICAgIHJlc3VsdHNbbmV3TGVuZ3RoXSA9IHZhbHVlc1tpXTtcbiAgICAgICAgICAgICAgbmV3TGVuZ3RoKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzdWx0cy5sZW5ndGggPSBuZXdMZW5ndGg7XG5cbiAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJGZpbHRlciQkZGVmYXVsdCA9IGxpYiRyc3ZwJGZpbHRlciQkZmlsdGVyO1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaChDb25zdHJ1Y3Rvciwgb2JqZWN0LCBsYWJlbCkge1xuICAgICAgdGhpcy5fc3VwZXJDb25zdHJ1Y3RvcihDb25zdHJ1Y3Rvciwgb2JqZWN0LCB0cnVlLCBsYWJlbCk7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkZGVmYXVsdCA9IGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2g7XG5cbiAgICBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoLnByb3RvdHlwZSA9IGxpYiRyc3ZwJHV0aWxzJCRvX2NyZWF0ZShsaWIkcnN2cCRlbnVtZXJhdG9yJCRkZWZhdWx0LnByb3RvdHlwZSk7XG4gICAgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaC5wcm90b3R5cGUuX3N1cGVyQ29uc3RydWN0b3IgPSBsaWIkcnN2cCRlbnVtZXJhdG9yJCRkZWZhdWx0O1xuICAgIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2gucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9yZXN1bHQgPSB7fTtcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaC5wcm90b3R5cGUuX3ZhbGlkYXRlSW5wdXQgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgcmV0dXJuIGlucHV0ICYmIHR5cGVvZiBpbnB1dCA9PT0gJ29iamVjdCc7XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2gucHJvdG90eXBlLl92YWxpZGF0aW9uRXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ1Byb21pc2UuaGFzaCBtdXN0IGJlIGNhbGxlZCB3aXRoIGFuIG9iamVjdCcpO1xuICAgIH07XG5cbiAgICBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoLnByb3RvdHlwZS5fZW51bWVyYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG4gICAgICB2YXIgcHJvbWlzZSAgICA9IGVudW1lcmF0b3IucHJvbWlzZTtcbiAgICAgIHZhciBpbnB1dCAgICAgID0gZW51bWVyYXRvci5faW5wdXQ7XG4gICAgICB2YXIgcmVzdWx0cyAgICA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gaW5wdXQpIHtcbiAgICAgICAgaWYgKHByb21pc2UuX3N0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGlucHV0LCBrZXkpKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBrZXksXG4gICAgICAgICAgICBlbnRyeTogaW5wdXRba2V5XVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBsZW5ndGggPSByZXN1bHRzLmxlbmd0aDtcbiAgICAgIGVudW1lcmF0b3IuX3JlbWFpbmluZyA9IGxlbmd0aDtcbiAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBwcm9taXNlLl9zdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HICYmIGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICByZXN1bHQgPSByZXN1bHRzW2ldO1xuICAgICAgICBlbnVtZXJhdG9yLl9lYWNoRW50cnkocmVzdWx0LmVudHJ5LCByZXN1bHQucG9zaXRpb24pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJEhhc2hTZXR0bGVkKENvbnN0cnVjdG9yLCBvYmplY3QsIGxhYmVsKSB7XG4gICAgICB0aGlzLl9zdXBlckNvbnN0cnVjdG9yKENvbnN0cnVjdG9yLCBvYmplY3QsIGZhbHNlLCBsYWJlbCk7XG4gICAgfVxuXG4gICAgbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRIYXNoU2V0dGxlZC5wcm90b3R5cGUgPSBsaWIkcnN2cCR1dGlscyQkb19jcmVhdGUobGliJHJzdnAkcHJvbWlzZSRoYXNoJCRkZWZhdWx0LnByb3RvdHlwZSk7XG4gICAgbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRIYXNoU2V0dGxlZC5wcm90b3R5cGUuX3N1cGVyQ29uc3RydWN0b3IgPSBsaWIkcnN2cCRlbnVtZXJhdG9yJCRkZWZhdWx0O1xuICAgIGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkSGFzaFNldHRsZWQucHJvdG90eXBlLl9tYWtlUmVzdWx0ID0gbGliJHJzdnAkZW51bWVyYXRvciQkbWFrZVNldHRsZWRSZXN1bHQ7XG5cbiAgICBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJEhhc2hTZXR0bGVkLnByb3RvdHlwZS5fdmFsaWRhdGlvbkVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdoYXNoU2V0dGxlZCBtdXN0IGJlIGNhbGxlZCB3aXRoIGFuIG9iamVjdCcpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJGhhc2hTZXR0bGVkKG9iamVjdCwgbGFiZWwpIHtcbiAgICAgIHJldHVybiBuZXcgbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRIYXNoU2V0dGxlZChsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LCBvYmplY3QsIGxhYmVsKS5wcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRkZWZhdWx0ID0gbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRoYXNoU2V0dGxlZDtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRoYXNoJCRoYXNoKG9iamVjdCwgbGFiZWwpIHtcbiAgICAgIHJldHVybiBuZXcgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRkZWZhdWx0KGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQsIG9iamVjdCwgbGFiZWwpLnByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRoYXNoJCRkZWZhdWx0ID0gbGliJHJzdnAkaGFzaCQkaGFzaDtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRtYXAkJG1hcChwcm9taXNlcywgbWFwRm4sIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5hbGwocHJvbWlzZXMsIGxhYmVsKS50aGVuKGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgICBpZiAoIWxpYiRyc3ZwJHV0aWxzJCRpc0Z1bmN0aW9uKG1hcEZuKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJZb3UgbXVzdCBwYXNzIGEgZnVuY3Rpb24gYXMgbWFwJ3Mgc2Vjb25kIGFyZ3VtZW50LlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoO1xuICAgICAgICB2YXIgcmVzdWx0cyA9IG5ldyBBcnJheShsZW5ndGgpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICByZXN1bHRzW2ldID0gbWFwRm4odmFsdWVzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LmFsbChyZXN1bHRzLCBsYWJlbCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJG1hcCQkZGVmYXVsdCA9IGxpYiRyc3ZwJG1hcCQkbWFwO1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkUmVzdWx0KCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkbm9kZSQkRVJST1IgPSBuZXcgbGliJHJzdnAkbm9kZSQkUmVzdWx0KCk7XG4gICAgdmFyIGxpYiRyc3ZwJG5vZGUkJEdFVF9USEVOX0VSUk9SID0gbmV3IGxpYiRyc3ZwJG5vZGUkJFJlc3VsdCgpO1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkZ2V0VGhlbihvYmopIHtcbiAgICAgIHRyeSB7XG4gICAgICAgcmV0dXJuIG9iai50aGVuO1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsaWIkcnN2cCRub2RlJCRFUlJPUi52YWx1ZT0gZXJyb3I7XG4gICAgICAgIHJldHVybiBsaWIkcnN2cCRub2RlJCRFUlJPUjtcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJHRyeUFwcGx5KGYsIHMsIGEpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGYuYXBwbHkocywgYSk7XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIGxpYiRyc3ZwJG5vZGUkJEVSUk9SLnZhbHVlID0gZXJyb3I7XG4gICAgICAgIHJldHVybiBsaWIkcnN2cCRub2RlJCRFUlJPUjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRtYWtlT2JqZWN0KF8sIGFyZ3VtZW50TmFtZXMpIHtcbiAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgIHZhciBuYW1lO1xuICAgICAgdmFyIGk7XG4gICAgICB2YXIgbGVuZ3RoID0gXy5sZW5ndGg7XG4gICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShsZW5ndGgpO1xuXG4gICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGxlbmd0aDsgeCsrKSB7XG4gICAgICAgIGFyZ3NbeF0gPSBfW3hdO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYXJndW1lbnROYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBuYW1lID0gYXJndW1lbnROYW1lc1tpXTtcbiAgICAgICAgb2JqW25hbWVdID0gYXJnc1tpICsgMV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkYXJyYXlSZXN1bHQoXykge1xuICAgICAgdmFyIGxlbmd0aCA9IF8ubGVuZ3RoO1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkobGVuZ3RoIC0gMSk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYXJnc1tpIC0gMV0gPSBfW2ldO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYXJncztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCR3cmFwVGhlbmFibGUodGhlbiwgcHJvbWlzZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGhlbjogZnVuY3Rpb24ob25GdWxGaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm4gdGhlbi5jYWxsKHByb21pc2UsIG9uRnVsRmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRkZW5vZGVpZnkobm9kZUZ1bmMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBmbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBsID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkobCArIDEpO1xuICAgICAgICB2YXIgYXJnO1xuICAgICAgICB2YXIgcHJvbWlzZUlucHV0ID0gZmFsc2U7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICBhcmcgPSBhcmd1bWVudHNbaV07XG5cbiAgICAgICAgICBpZiAoIXByb21pc2VJbnB1dCkge1xuICAgICAgICAgICAgLy8gVE9ETzogY2xlYW4gdGhpcyB1cFxuICAgICAgICAgICAgcHJvbWlzZUlucHV0ID0gbGliJHJzdnAkbm9kZSQkbmVlZHNQcm9taXNlSW5wdXQoYXJnKTtcbiAgICAgICAgICAgIGlmIChwcm9taXNlSW5wdXQgPT09IGxpYiRyc3ZwJG5vZGUkJEdFVF9USEVOX0VSUk9SKSB7XG4gICAgICAgICAgICAgIHZhciBwID0gbmV3IGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQobGliJHJzdnAkJGludGVybmFsJCRub29wKTtcbiAgICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocCwgbGliJHJzdnAkbm9kZSQkR0VUX1RIRU5fRVJST1IudmFsdWUpO1xuICAgICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvbWlzZUlucHV0ICYmIHByb21pc2VJbnB1dCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICBhcmcgPSBsaWIkcnN2cCRub2RlJCR3cmFwVGhlbmFibGUocHJvbWlzZUlucHV0LCBhcmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBhcmdzW2ldID0gYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHByb21pc2UgPSBuZXcgbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdChsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3ApO1xuXG4gICAgICAgIGFyZ3NbbF0gPSBmdW5jdGlvbihlcnIsIHZhbCkge1xuICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlcnIpO1xuICAgICAgICAgIGVsc2UgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWwpO1xuICAgICAgICAgIGVsc2UgaWYgKG9wdGlvbnMgPT09IHRydWUpXG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgbGliJHJzdnAkbm9kZSQkYXJyYXlSZXN1bHQoYXJndW1lbnRzKSk7XG4gICAgICAgICAgZWxzZSBpZiAobGliJHJzdnAkdXRpbHMkJGlzQXJyYXkob3B0aW9ucykpXG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgbGliJHJzdnAkbm9kZSQkbWFrZU9iamVjdChhcmd1bWVudHMsIG9wdGlvbnMpKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAocHJvbWlzZUlucHV0KSB7XG4gICAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJG5vZGUkJGhhbmRsZVByb21pc2VJbnB1dChwcm9taXNlLCBhcmdzLCBub2RlRnVuYywgc2VsZik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJG5vZGUkJGhhbmRsZVZhbHVlSW5wdXQocHJvbWlzZSwgYXJncywgbm9kZUZ1bmMsIHNlbGYpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmbi5fX3Byb3RvX18gPSBub2RlRnVuYztcblxuICAgICAgcmV0dXJuIGZuO1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRub2RlJCRkZWZhdWx0ID0gbGliJHJzdnAkbm9kZSQkZGVub2RlaWZ5O1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkaGFuZGxlVmFsdWVJbnB1dChwcm9taXNlLCBhcmdzLCBub2RlRnVuYywgc2VsZikge1xuICAgICAgdmFyIHJlc3VsdCA9IGxpYiRyc3ZwJG5vZGUkJHRyeUFwcGx5KG5vZGVGdW5jLCBzZWxmLCBhcmdzKTtcbiAgICAgIGlmIChyZXN1bHQgPT09IGxpYiRyc3ZwJG5vZGUkJEVSUk9SKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlc3VsdC52YWx1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRoYW5kbGVQcm9taXNlSW5wdXQocHJvbWlzZSwgYXJncywgbm9kZUZ1bmMsIHNlbGYpe1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQuYWxsKGFyZ3MpLnRoZW4oZnVuY3Rpb24oYXJncyl7XG4gICAgICAgIHZhciByZXN1bHQgPSBsaWIkcnN2cCRub2RlJCR0cnlBcHBseShub2RlRnVuYywgc2VsZiwgYXJncyk7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IGxpYiRyc3ZwJG5vZGUkJEVSUk9SKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVzdWx0LnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJG5lZWRzUHJvbWlzZUlucHV0KGFyZykge1xuICAgICAgaWYgKGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0Jykge1xuICAgICAgICBpZiAoYXJnLmNvbnN0cnVjdG9yID09PSBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJG5vZGUkJGdldFRoZW4oYXJnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcGxhdGZvcm0kJHBsYXRmb3JtO1xuXG4gICAgLyogZ2xvYmFsIHNlbGYgKi9cbiAgICBpZiAodHlwZW9mIHNlbGYgPT09ICdvYmplY3QnKSB7XG4gICAgICBsaWIkcnN2cCRwbGF0Zm9ybSQkcGxhdGZvcm0gPSBzZWxmO1xuXG4gICAgLyogZ2xvYmFsIGdsb2JhbCAqL1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGxpYiRyc3ZwJHBsYXRmb3JtJCRwbGF0Zm9ybSA9IGdsb2JhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBnbG9iYWw6IGBzZWxmYCBvciBgZ2xvYmFsYCBmb3VuZCcpO1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRwbGF0Zm9ybSQkZGVmYXVsdCA9IGxpYiRyc3ZwJHBsYXRmb3JtJCRwbGF0Zm9ybTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRyYWNlJCRyYWNlKGFycmF5LCBsYWJlbCkge1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQucmFjZShhcnJheSwgbGFiZWwpO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcmFjZSQkZGVmYXVsdCA9IGxpYiRyc3ZwJHJhY2UkJHJhY2U7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcmVqZWN0JCRyZWplY3QocmVhc29uLCBsYWJlbCkge1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQucmVqZWN0KHJlYXNvbiwgbGFiZWwpO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcmVqZWN0JCRkZWZhdWx0ID0gbGliJHJzdnAkcmVqZWN0JCRyZWplY3Q7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcmVzb2x2ZSQkcmVzb2x2ZSh2YWx1ZSwgbGFiZWwpIHtcbiAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LnJlc29sdmUodmFsdWUsIGxhYmVsKTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHJlc29sdmUkJGRlZmF1bHQgPSBsaWIkcnN2cCRyZXNvbHZlJCRyZXNvbHZlO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHJldGhyb3ckJHJldGhyb3cocmVhc29uKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aHJvdyByZWFzb247XG4gICAgICB9KTtcbiAgICAgIHRocm93IHJlYXNvbjtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHJldGhyb3ckJGRlZmF1bHQgPSBsaWIkcnN2cCRyZXRocm93JCRyZXRocm93O1xuXG4gICAgLy8gZGVmYXVsdHNcbiAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hc3luYyA9IGxpYiRyc3ZwJGFzYXAkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYWZ0ZXIgPSBmdW5jdGlvbihjYikge1xuICAgICAgc2V0VGltZW91dChjYiwgMCk7XG4gICAgfTtcbiAgICB2YXIgbGliJHJzdnAkJGNhc3QgPSBsaWIkcnN2cCRyZXNvbHZlJCRkZWZhdWx0O1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRhc3luYyhjYWxsYmFjaywgYXJnKSB7XG4gICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hc3luYyhjYWxsYmFjaywgYXJnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkb24oKSB7XG4gICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1snb24nXS5hcHBseShsaWIkcnN2cCRjb25maWckJGNvbmZpZywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkb2ZmKCkge1xuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWdbJ29mZiddLmFwcGx5KGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8vIFNldCB1cCBpbnN0cnVtZW50YXRpb24gdGhyb3VnaCBgd2luZG93Ll9fUFJPTUlTRV9JTlRSVU1FTlRBVElPTl9fYFxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93WydfX1BST01JU0VfSU5TVFJVTUVOVEFUSU9OX18nXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHZhciBsaWIkcnN2cCQkY2FsbGJhY2tzID0gd2luZG93WydfX1BST01JU0VfSU5TVFJVTUVOVEFUSU9OX18nXTtcbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlndXJlKCdpbnN0cnVtZW50JywgdHJ1ZSk7XG4gICAgICBmb3IgKHZhciBsaWIkcnN2cCQkZXZlbnROYW1lIGluIGxpYiRyc3ZwJCRjYWxsYmFja3MpIHtcbiAgICAgICAgaWYgKGxpYiRyc3ZwJCRjYWxsYmFja3MuaGFzT3duUHJvcGVydHkobGliJHJzdnAkJGV2ZW50TmFtZSkpIHtcbiAgICAgICAgICBsaWIkcnN2cCQkb24obGliJHJzdnAkJGV2ZW50TmFtZSwgbGliJHJzdnAkJGNhbGxiYWNrc1tsaWIkcnN2cCQkZXZlbnROYW1lXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkdW1kJCRSU1ZQID0ge1xuICAgICAgJ3JhY2UnOiBsaWIkcnN2cCRyYWNlJCRkZWZhdWx0LFxuICAgICAgJ1Byb21pc2UnOiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LFxuICAgICAgJ2FsbFNldHRsZWQnOiBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkZGVmYXVsdCxcbiAgICAgICdoYXNoJzogbGliJHJzdnAkaGFzaCQkZGVmYXVsdCxcbiAgICAgICdoYXNoU2V0dGxlZCc6IGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkZGVmYXVsdCxcbiAgICAgICdkZW5vZGVpZnknOiBsaWIkcnN2cCRub2RlJCRkZWZhdWx0LFxuICAgICAgJ29uJzogbGliJHJzdnAkJG9uLFxuICAgICAgJ29mZic6IGxpYiRyc3ZwJCRvZmYsXG4gICAgICAnbWFwJzogbGliJHJzdnAkbWFwJCRkZWZhdWx0LFxuICAgICAgJ2ZpbHRlcic6IGxpYiRyc3ZwJGZpbHRlciQkZGVmYXVsdCxcbiAgICAgICdyZXNvbHZlJzogbGliJHJzdnAkcmVzb2x2ZSQkZGVmYXVsdCxcbiAgICAgICdyZWplY3QnOiBsaWIkcnN2cCRyZWplY3QkJGRlZmF1bHQsXG4gICAgICAnYWxsJzogbGliJHJzdnAkYWxsJCRkZWZhdWx0LFxuICAgICAgJ3JldGhyb3cnOiBsaWIkcnN2cCRyZXRocm93JCRkZWZhdWx0LFxuICAgICAgJ2RlZmVyJzogbGliJHJzdnAkZGVmZXIkJGRlZmF1bHQsXG4gICAgICAnRXZlbnRUYXJnZXQnOiBsaWIkcnN2cCRldmVudHMkJGRlZmF1bHQsXG4gICAgICAnY29uZmlndXJlJzogbGliJHJzdnAkY29uZmlnJCRjb25maWd1cmUsXG4gICAgICAnYXN5bmMnOiBsaWIkcnN2cCQkYXN5bmNcbiAgICB9O1xuXG4gICAgLyogZ2xvYmFsIGRlZmluZTp0cnVlIG1vZHVsZTp0cnVlIHdpbmRvdzogdHJ1ZSAqL1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZVsnYW1kJ10pIHtcbiAgICAgIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIGxpYiRyc3ZwJHVtZCQkUlNWUDsgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGVbJ2V4cG9ydHMnXSkge1xuICAgICAgbW9kdWxlWydleHBvcnRzJ10gPSBsaWIkcnN2cCR1bWQkJFJTVlA7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbGliJHJzdnAkcGxhdGZvcm0kJGRlZmF1bHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBsaWIkcnN2cCRwbGF0Zm9ybSQkZGVmYXVsdFsnUlNWUCddID0gbGliJHJzdnAkdW1kJCRSU1ZQO1xuICAgIH1cbn0pLmNhbGwodGhpcyk7XG5cbiJdfQ==

//# sourceMappingURL=algorithm_visualizer.js.map
