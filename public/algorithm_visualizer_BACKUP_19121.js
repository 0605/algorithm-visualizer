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

<<<<<<< HEAD
=======
var _require = require('../dom/loading_slider');

var showLoadingSlider = _require.showLoadingSlider;
var hideLoadingSlider = _require.hideLoadingSlider;

var _require2 = require('../utils');

var getFileDir = _require2.getFileDir;


>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
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

<<<<<<< HEAD
},{"../dom/setup":7,"../editor":25,"../tracer_manager":49,"./cache":1}],3:[function(require,module,exports){
=======
},{"../dom/loading_slider":5,"../dom/setup":6,"../editor":25,"../tracer_manager":49,"../utils":55,"./cache":1}],3:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
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

},{"../app":3,"../server":43,"./show_algorithm":18}],5:[function(require,module,exports){
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

},{"../server":43}],6:[function(require,module,exports){
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

<<<<<<< HEAD
},{"./add_categories":4,"./add_files":5,"./show_algorithm":18,"./show_description":19,"./show_first_algorithm":20,"./show_requested_algorithm":21}],7:[function(require,module,exports){
=======
},{"./show_algorithm":17,"./show_categories":18,"./show_description":19,"./show_files":20,"./show_first_algorithm":21}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
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

<<<<<<< HEAD
},{"./setup_dividers":8,"./setup_document":9,"./setup_files_bar":10,"./setup_interval":11,"./setup_module_container":12,"./setup_powered_by":13,"./setup_scratch_paper":14,"./setup_side_menu":15,"./setup_top_menu":16,"./setup_window":17}],8:[function(require,module,exports){
=======
},{"./setup_dividers":7,"./setup_document":8,"./setup_files_bar":9,"./setup_interval":10,"./setup_module_container":11,"./setup_powered_by":12,"./setup_scratch_paper":13,"./setup_side_menu":14,"./setup_top_menu":15,"./setup_window":16}],7:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
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

<<<<<<< HEAD
},{"../../app":3}],9:[function(require,module,exports){
=======
},{"../../app":3}],8:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
'use strict';

var app = require('../../app');

module.exports = function () {
  $(document).on('click', 'a', function (e) {
    e.preventDefault();

    if (!window.open($(undefined).attr('href'), '_blank')) {
      alert('Please allow popups for this site');
    }
  });

  $(document).mouseup(function (e) {
    app.getTracerManager().command('mouseup', e);
  });
};

<<<<<<< HEAD
},{"../../app":3}],10:[function(require,module,exports){
=======
},{"../../app":3}],9:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
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

<<<<<<< HEAD
},{}],11:[function(require,module,exports){
=======
},{}],10:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
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

<<<<<<< HEAD
},{"../../app":3,"../toast":22}],12:[function(require,module,exports){
=======
},{"../../app":3,"../toast":22}],11:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
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

<<<<<<< HEAD
},{"../../app":3}],13:[function(require,module,exports){
=======
},{"../../app":3}],12:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
'use strict';

module.exports = function () {
  $('#powered-by').click(function () {
    $('#powered-by-list button').toggleClass('collapse');
  });
};

<<<<<<< HEAD
},{}],14:[function(require,module,exports){
=======
},{}],13:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
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

<<<<<<< HEAD
},{"../../app":3,"../../server":43,"../show_algorithm":18}],15:[function(require,module,exports){
=======
},{"../../server":43,"../show_algorithm":17}],14:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
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

<<<<<<< HEAD
},{"../../app":3}],16:[function(require,module,exports){
=======
},{"../../app":3}],15:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
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

<<<<<<< HEAD
},{"../../app":3,"../../server":43,"../toast":22}],17:[function(require,module,exports){
=======
},{"../../app":3,"../../server":43,"../toast":22}],16:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
'use strict';

var app = require('../../app');

module.exports = function () {
  $(window).resize(function () {
    app.getTracerManager().resize();
  });
};

<<<<<<< HEAD
},{"../../app":3}],18:[function(require,module,exports){
=======
},{"../../app":3}],17:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
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

<<<<<<< HEAD
},{"../app":3,"../utils":55,"./add_files":5,"./show_description":19}],19:[function(require,module,exports){
=======
},{"../app":3,"../utils":55,"./show_description":19,"./show_files":20}],18:[function(require,module,exports){
'use strict';

var appInstance = require('../app');
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
  var _appInstance$getCateg = appInstance.getCategory(category);

  var categoryName = _appInstance$getCateg.name;
  var categorySubList = _appInstance$getCateg.list;


  var $category = $('<button class="category">').append('<i class="fa fa-fw fa-caret-right">').append(categoryName);

  $category.click(function () {
    $('[data-category="' + category + '"]').toggleClass('collapse');
    $(this).find('i.fa').toggleClass('fa-caret-right fa-caret-down');
  });

  $('#list').append($category);

  each(categorySubList, function (algorithm) {
    addAlgorithmToCategoryDOM(category, categorySubList, algorithm);
  });
};

module.exports = function () {
  each(appInstance.getCategories(), addCategoryToDOM);
};

},{"../app":3,"../server":43,"./show_algorithm":17}],19:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
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

},{}],20:[function(require,module,exports){
<<<<<<< HEAD
=======
'use strict';

var Server = require('../server');

var _$ = $;
var each = _$.each;


var addFileToDOM = function addFileToDOM(category, algorithm, file, explanation) {
  var $file = $('<button>').append(file).click(function () {
    Server.loadFile(category, algorithm, file, explanation);
    $('.files_bar > .wrapper > button').removeClass('active');
    $(this).addClass('active');
  });
  $('.files_bar > .wrapper').append($file);
};

module.exports = function (category, algorithm, files) {
  $('.files_bar > .wrapper').empty();

  each(files, function (file, explanation) {
    addFileToDOM(category, algorithm, file, explanation);
  });

  $('.files_bar > .wrapper > button').first().click();
  $('.files_bar > .wrapper').scroll();
};

},{"../server":43}],21:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
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

},{"../server":43,"./show_algorithm":18}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{"../app":3,"./create":23,"./executor":24}],26:[function(require,module,exports){
'use strict';

var RSVP = require('rsvp');
var appInstance = require('./app');
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
  var app = new AppConstructor();
  extend(true, appInstance, app);

  // load modules to the global scope so they can be evaled
  extend(true, window, modules);

  Server.loadCategories().then(function (data) {
    appInstance.setCategories(data);
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

<<<<<<< HEAD
},{"./app":3,"./app/constructor":2,"./dom":6,"./module":32,"./server":43,"./server/helpers":42,"./utils":55,"rsvp":57}],27:[function(require,module,exports){
=======
},{"./app":3,"./app/constructor":2,"./dom":4,"./module":32,"./server":43,"./server/helpers":42,"rsvp":57}],27:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
'use strict';

var _require = require('./array2d');

var Array2D = _require.Array2D;
var Array2DTracer = _require.Array2DTracer;


function Array1DTracer() {
    return Array2DTracer.apply(this, arguments);
}

Array1DTracer.prototype = $.extend(true, Object.create(Array2DTracer.prototype), {
    constructor: Array1DTracer,
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

var Array1D = {
    random: function random(N, min, max) {
        return Array2D.random(1, N, min, max)[0];
    },
    randomSorted: function randomSorted(N, min, max) {
        return Array2D.randomSorted(1, N, min, max)[0];
    }
};

module.exports = {
    Array1D: Array1D,
    Array1DTracer: Array1DTracer
};

},{"./array2d":28}],28:[function(require,module,exports){
'use strict';

var Tracer = require('./tracer');

var _require = require('../tracer_manager/util');

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
                if (step.v === 0 || step.v) {
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

var Array2D = {
    random: function random(N, M, min, max) {
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
    },
    randomSorted: function randomSorted(N, M, min, max) {
        return this.random(N, M, min, max).map(function (arr) {
            return arr.sort(function (a, b) {
                return a - b;
            });
        });
    }
};

module.exports = {
    Array2D: Array2D,
    Array2DTracer: Array2DTracer
};

},{"../tracer_manager/util":52,"./tracer":34}],29:[function(require,module,exports){
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
                if (step.v) {
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

},{"./tracer":34}],30:[function(require,module,exports){
'use strict';

var _require = require('./directed_graph');

var DirectedGraph = _require.DirectedGraph;
var DirectedGraphTracer = _require.DirectedGraphTracer;


function CoordinateSystemTracer() {
    if (DirectedGraphTracer.apply(this, arguments)) {
        CoordinateSystemTracer.prototype.init.call(this);
        return true;
    }
    return false;
}

CoordinateSystemTracer.prototype = $.extend(true, Object.create(DirectedGraphTracer.prototype), {
    constructor: CoordinateSystemTracer,
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

var CoordinateSystem = {
    random: function random(N, min, max) {
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
    }
};

module.exports = {
    CoordinateSystem: CoordinateSystem,
    CoordinateSystemTracer: CoordinateSystemTracer
};

},{"./directed_graph":31}],31:[function(require,module,exports){
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

var DirectedGraph = {
    random: function random(N, ratio) {
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
    }
};

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

module.exports = {
    DirectedGraph: DirectedGraph,
    DirectedGraphTracer: DirectedGraphTracer
};

},{"./tracer":34}],32:[function(require,module,exports){
'use strict';

var Tracer = require('./tracer');

var LogTracer = require('./log_tracer');

var _require = require('./array1d');

var Array1D = _require.Array1D;
var Array1DTracer = _require.Array1DTracer;

var _require2 = require('./array2d');

var Array2D = _require2.Array2D;
var Array2DTracer = _require2.Array2DTracer;


var ChartTracer = require('./chart');

var _require3 = require('./coordinate_system');

var CoordinateSystem = _require3.CoordinateSystem;
var CoordinateSystemTracer = _require3.CoordinateSystemTracer;

var _require4 = require('./directed_graph');

var DirectedGraph = _require4.DirectedGraph;
var DirectedGraphTracer = _require4.DirectedGraphTracer;

var _require5 = require('./undirected_graph');

var UndirectedGraph = _require5.UndirectedGraph;
var UndirectedGraphTracer = _require5.UndirectedGraphTracer;

var _require6 = require('./weighted_directed_graph');

var WeightedDirectedGraph = _require6.WeightedDirectedGraph;
var WeightedDirectedGraphTracer = _require6.WeightedDirectedGraphTracer;

var _require7 = require('./weighted_undirected_graph');

var WeightedUndirectedGraph = _require7.WeightedUndirectedGraph;
var WeightedUndirectedGraphTracer = _require7.WeightedUndirectedGraphTracer;


module.exports = {
  Tracer: Tracer,
  LogTracer: LogTracer,
  Array1D: Array1D,
  Array1DTracer: Array1DTracer,
  Array2D: Array2D,
  Array2DTracer: Array2DTracer,
  ChartTracer: ChartTracer,
  CoordinateSystem: CoordinateSystem,
  CoordinateSystemTracer: CoordinateSystemTracer,
  DirectedGraph: DirectedGraph,
  DirectedGraphTracer: DirectedGraphTracer,
  UndirectedGraph: UndirectedGraph,
  UndirectedGraphTracer: UndirectedGraphTracer,
  WeightedDirectedGraph: WeightedDirectedGraph,
  WeightedDirectedGraphTracer: WeightedDirectedGraphTracer,
  WeightedUndirectedGraph: WeightedUndirectedGraph,
  WeightedUndirectedGraphTracer: WeightedUndirectedGraphTracer
};

},{"./array1d":27,"./array2d":28,"./chart":29,"./coordinate_system":30,"./directed_graph":31,"./log_tracer":33,"./tracer":34,"./undirected_graph":35,"./weighted_directed_graph":36,"./weighted_undirected_graph":37}],33:[function(require,module,exports){
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

},{"./tracer":34}],34:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('../tracer_manager/util');

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

},{"../tracer_manager/util":52}],35:[function(require,module,exports){
'use strict';

var _require = require('./directed_graph');

var DirectedGraph = _require.DirectedGraph;
var DirectedGraphTracer = _require.DirectedGraphTracer;


function UndirectedGraphTracer() {
    if (DirectedGraphTracer.apply(this, arguments)) {
        UndirectedGraphTracer.prototype.init.call(this);
        return true;
    }
    return false;
}

UndirectedGraphTracer.prototype = $.extend(true, Object.create(DirectedGraphTracer.prototype), {
    constructor: UndirectedGraphTracer,
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

var UndirectedGraph = {
    random: function random(N, ratio) {
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
    }
};

module.exports = {
    UndirectedGraph: UndirectedGraph,
    UndirectedGraphTracer: UndirectedGraphTracer
};

},{"./directed_graph":31}],36:[function(require,module,exports){
'use strict';

var _require = require('./directed_graph');

var DirectedGraph = _require.DirectedGraph;
var DirectedGraphTracer = _require.DirectedGraphTracer;

var _require2 = require('../tracer_manager/util');

var refineByType = _require2.refineByType;


function WeightedDirectedGraphTracer() {
    if (DirectedGraphTracer.apply(this, arguments)) {
        WeightedDirectedGraphTracer.prototype.init.call(this);
        return true;
    }
    return false;
}

WeightedDirectedGraphTracer.prototype = $.extend(true, Object.create(DirectedGraphTracer.prototype), {
    constructor: WeightedDirectedGraphTracer,
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

var WeightedDirectedGraph = {
    random: function random(N, ratio, min, max) {
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
    }
};

module.exports = {
    WeightedDirectedGraph: WeightedDirectedGraph,
    WeightedDirectedGraphTracer: WeightedDirectedGraphTracer
};

},{"../tracer_manager/util":52,"./directed_graph":31}],37:[function(require,module,exports){
'use strict';

var _require = require('./weighted_directed_graph');

var WeightedDirectedGraph = _require.WeightedDirectedGraph;
var WeightedDirectedGraphTracer = _require.WeightedDirectedGraphTracer;

var _require2 = require('./undirected_graph');

var UndirectedGraphTracer = _require2.UndirectedGraphTracer;


function WeightedUndirectedGraphTracer() {
    if (WeightedDirectedGraphTracer.apply(this, arguments)) {
        WeightedUndirectedGraphTracer.prototype.init.call(this);
        return true;
    }
    return false;
}

WeightedUndirectedGraphTracer.prototype = $.extend(true, Object.create(WeightedDirectedGraphTracer.prototype), {
    constructor: WeightedUndirectedGraphTracer,
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

var WeightedUndirectedGraph = {
    random: function random(N, ratio, min, max) {
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
    }
};

module.exports = {
    WeightedUndirectedGraph: WeightedUndirectedGraph,
    WeightedUndirectedGraphTracer: WeightedUndirectedGraphTracer
};

},{"./undirected_graph":35,"./weighted_directed_graph":36}],38:[function(require,module,exports){
'use strict';

var request = require('./request');

module.exports = function (url) {

  return request(url, {
    type: 'GET'
  });
};

},{"./request":41}],39:[function(require,module,exports){
'use strict';

var request = require('./request');

module.exports = function (url) {
  return request(url, {
    dataType: 'json',
    type: 'GET'
  });
};

},{"./request":41}],40:[function(require,module,exports){
'use strict';

var request = require('./request');

module.exports = function (url, data) {
  return request(url, {
    dataType: 'json',
    type: 'POST',
    data: JSON.stringify(data)
  });
};

},{"./request":41}],41:[function(require,module,exports){
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

},{"../../app":3,"rsvp":57}],42:[function(require,module,exports){
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

},{"../app":3,"../dom/toast":22}],43:[function(require,module,exports){
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

},{"./load_algorithm":44,"./load_categories":45,"./load_file":46,"./load_scratch_paper":47,"./share_scratch_paper":48}],44:[function(require,module,exports){
'use strict';

var getJSON = require('./ajax/get_json');

var _require = require('../utils');

var getAlgorithmDir = _require.getAlgorithmDir;


module.exports = function (category, algorithm) {
  var dir = getAlgorithmDir(category, algorithm);
  return getJSON(dir + 'desc.json');
};

},{"../utils":55,"./ajax/get_json":39}],45:[function(require,module,exports){
'use strict';

var getJSON = require('./ajax/get_json');

module.exports = function () {
  return getJSON('./algorithm/category.json');
};

<<<<<<< HEAD
},{"./ajax/get_json":39}],46:[function(require,module,exports){
=======
},{"../app":3,"./ajax/get_json":39}],46:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
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

},{"../app":3,"../utils":55,"./ajax/get":38,"./helpers":42,"rsvp":57}],47:[function(require,module,exports){
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

},{"../app":3,"../utils":55,"./ajax/get_json":39,"./load_algorithm":44,"rsvp":57}],48:[function(require,module,exports){
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

<<<<<<< HEAD
},{"../app":3,"./ajax/post_json":40,"./helpers":42,"rsvp":57}],49:[function(require,module,exports){
=======
},{"../app":3,"./ajax/post_json":40,"rsvp":57}],49:[function(require,module,exports){
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969
'use strict';

var TracerManager = require('./manager');
var Tracer = require('../module/tracer');

module.exports = {
  init: function init() {
    var tm = new TracerManager();
    Tracer.prototype.manager = tm;
    return tm;
  }
};

},{"../module/tracer":34,"./manager":50}],50:[function(require,module,exports){
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

    selectedCapsule.defaultName = newTracer.constructor.name + ' ' + count;
    return selectedCapsule;
  },
  deallocateAll: function deallocateAll() {
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
      var top = height * i;

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

},{}],51:[function(require,module,exports){
'use strict';

var parse = JSON.parse;


var fromJSON = function fromJSON(obj) {
  return parse(obj, function (key, value) {
    return value === 'Infinity' ? Infinity : value;
  });
};

module.exports = fromJSON;

},{}],52:[function(require,module,exports){
'use strict';

var toJSON = require('./to_json');
var fromJSON = require('./from_json');
var refineByType = require('./refine_by_type');

module.exports = {
  toJSON: toJSON,
  fromJSON: fromJSON,
  refineByType: refineByType
};

},{"./from_json":51,"./refine_by_type":53,"./to_json":54}],53:[function(require,module,exports){
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

},{}],54:[function(require,module,exports){
'use strict';

var stringify = JSON.stringify;


var toJSON = function toJSON(obj) {
  return stringify(obj, function (key, value) {
    return value === Infinity ? 'Infinity' : value;
  });
};

module.exports = toJSON;

},{}],55:[function(require,module,exports){
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

},{}],56:[function(require,module,exports){
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

},{}],57:[function(require,module,exports){
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

},{"_process":56}]},{},[26])
<<<<<<< HEAD
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAvY2FjaGUuanMiLCJqcy9hcHAvY29uc3RydWN0b3IuanMiLCJqcy9hcHAvaW5kZXguanMiLCJqcy9kb20vYWRkX2NhdGVnb3JpZXMuanMiLCJqcy9kb20vYWRkX2ZpbGVzLmpzIiwianMvZG9tL2luZGV4LmpzIiwianMvZG9tL3NldHVwL2luZGV4LmpzIiwianMvZG9tL3NldHVwL3NldHVwX2RpdmlkZXJzLmpzIiwianMvZG9tL3NldHVwL3NldHVwX2RvY3VtZW50LmpzIiwianMvZG9tL3NldHVwL3NldHVwX2ZpbGVzX2Jhci5qcyIsImpzL2RvbS9zZXR1cC9zZXR1cF9pbnRlcnZhbC5qcyIsImpzL2RvbS9zZXR1cC9zZXR1cF9tb2R1bGVfY29udGFpbmVyLmpzIiwianMvZG9tL3NldHVwL3NldHVwX3Bvd2VyZWRfYnkuanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfc2NyYXRjaF9wYXBlci5qcyIsImpzL2RvbS9zZXR1cC9zZXR1cF9zaWRlX21lbnUuanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfdG9wX21lbnUuanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfd2luZG93LmpzIiwianMvZG9tL3Nob3dfYWxnb3JpdGhtLmpzIiwianMvZG9tL3Nob3dfZGVzY3JpcHRpb24uanMiLCJqcy9kb20vc2hvd19maXJzdF9hbGdvcml0aG0uanMiLCJqcy9kb20vc2hvd19yZXF1ZXN0ZWRfYWxnb3JpdGhtLmpzIiwianMvZG9tL3RvYXN0LmpzIiwianMvZWRpdG9yL2NyZWF0ZS5qcyIsImpzL2VkaXRvci9leGVjdXRvci5qcyIsImpzL2VkaXRvci9pbmRleC5qcyIsImpzL2luZGV4LmpzIiwianMvbW9kdWxlL2FycmF5MWQuanMiLCJqcy9tb2R1bGUvYXJyYXkyZC5qcyIsImpzL21vZHVsZS9jaGFydC5qcyIsImpzL21vZHVsZS9jb29yZGluYXRlX3N5c3RlbS5qcyIsImpzL21vZHVsZS9kaXJlY3RlZF9ncmFwaC5qcyIsImpzL21vZHVsZS9pbmRleC5qcyIsImpzL21vZHVsZS9sb2dfdHJhY2VyLmpzIiwianMvbW9kdWxlL3RyYWNlci5qcyIsImpzL21vZHVsZS91bmRpcmVjdGVkX2dyYXBoLmpzIiwianMvbW9kdWxlL3dlaWdodGVkX2RpcmVjdGVkX2dyYXBoLmpzIiwianMvbW9kdWxlL3dlaWdodGVkX3VuZGlyZWN0ZWRfZ3JhcGguanMiLCJqcy9zZXJ2ZXIvYWpheC9nZXQuanMiLCJqcy9zZXJ2ZXIvYWpheC9nZXRfanNvbi5qcyIsImpzL3NlcnZlci9hamF4L3Bvc3RfanNvbi5qcyIsImpzL3NlcnZlci9hamF4L3JlcXVlc3QuanMiLCJqcy9zZXJ2ZXIvaGVscGVycy5qcyIsImpzL3NlcnZlci9pbmRleC5qcyIsImpzL3NlcnZlci9sb2FkX2FsZ29yaXRobS5qcyIsImpzL3NlcnZlci9sb2FkX2NhdGVnb3JpZXMuanMiLCJqcy9zZXJ2ZXIvbG9hZF9maWxlLmpzIiwianMvc2VydmVyL2xvYWRfc2NyYXRjaF9wYXBlci5qcyIsImpzL3NlcnZlci9zaGFyZV9zY3JhdGNoX3BhcGVyLmpzIiwianMvdHJhY2VyX21hbmFnZXIvaW5kZXguanMiLCJqcy90cmFjZXJfbWFuYWdlci9tYW5hZ2VyLmpzIiwianMvdHJhY2VyX21hbmFnZXIvdXRpbC9mcm9tX2pzb24uanMiLCJqcy90cmFjZXJfbWFuYWdlci91dGlsL2luZGV4LmpzIiwianMvdHJhY2VyX21hbmFnZXIvdXRpbC9yZWZpbmVfYnlfdHlwZS5qcyIsImpzL3RyYWNlcl9tYW5hZ2VyL3V0aWwvdG9fanNvbi5qcyIsImpzL3V0aWxzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9yc3ZwL2Rpc3QvcnN2cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztTQUlJLEM7SUFERixNLE1BQUEsTTs7O0FBR0YsSUFBTSxRQUFRO0FBQ1osZ0JBQWMsRUFERjtBQUVaLFNB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qge1xuICBleHRlbmRcbn0gPSAkO1xuXG5jb25zdCBjYWNoZSA9IHtcbiAgbGFzdEZpbGVVc2VkOiAnJyxcbiAgZmlsZXM6IHt9XG59O1xuXG5jb25zdCBhc3NlcnRGaWxlTmFtZSA9IChuYW1lKSA9PiB7XG4gIGlmICghbmFtZSkge1xuICAgIHRocm93ICdNaXNzaW5nIGZpbGUgbmFtZSc7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBHbG9iYWwgYXBwbGljYXRpb24gY2FjaGVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgZ2V0Q2FjaGVkRmlsZShuYW1lKSB7XG4gICAgYXNzZXJ0RmlsZU5hbWUobmFtZSk7XG4gICAgcmV0dXJuIGNhY2hlLmZpbGVzW25hbWVdO1xuICB9LFxuXG4gIHVwZGF0ZUNhY2hlZEZpbGUobmFtZSwgdXBkYXRlcykge1xuICAgIGFzc2VydEZpbGVOYW1lKG5hbWUpO1xuICAgIGlmICghY2FjaGUuZmlsZXNbbmFtZV0pIHtcbiAgICAgIGNhY2hlLmZpbGVzW25hbWVdID0ge307XG4gICAgfVxuICAgIGV4dGVuZChjYWNoZS5maWxlc1tuYW1lXSwgdXBkYXRlcyk7XG4gIH0sXG5cbiAgZ2V0TGFzdEZpbGVVc2VkKCkge1xuICAgIHJldHVybiBjYWNoZS5sYXN0RmlsZVVzZWQ7XG4gIH0sXG5cbiAgc2V0TGFzdEZpbGVVc2VkKGZpbGUpIHtcbiAgICBjYWNoZS5sYXN0RmlsZVVzZWQgPSBmaWxlO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgRWRpdG9yID0gcmVxdWlyZSgnLi4vZWRpdG9yJyk7XG5jb25zdCBUcmFjZXJNYW5hZ2VyID0gcmVxdWlyZSgnLi4vdHJhY2VyX21hbmFnZXInKTtcbmNvbnN0IERPTSA9IHJlcXVpcmUoJy4uL2RvbS9zZXR1cCcpO1xuXG5jb25zdCBDYWNoZSA9IHJlcXVpcmUoJy4vY2FjaGUnKTtcblxuY29uc3Qgc3RhdGUgPSB7XG4gIGlzTG9hZGluZzogbnVsbCxcbiAgZWRpdG9yOiBudWxsLFxuICB0cmFjZXJNYW5hZ2VyOiBudWxsLFxuICBjYXRlZ29yaWVzOiBudWxsLFxuICBsb2FkZWRTY3JhdGNoOiBudWxsXG59O1xuXG5jb25zdCBpbml0U3RhdGUgPSAodHJhY2VyTWFuYWdlcikgPT4ge1xuICBzdGF0ZS5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgc3RhdGUuZWRpdG9yID0gbmV3IEVkaXRvcih0cmFjZXJNYW5hZ2VyKTtcbiAgc3RhdGUudHJhY2VyTWFuYWdlciA9IHRyYWNlck1hbmFnZXI7XG4gIHN0YXRlLmNhdGVnb3JpZXMgPSB7fTtcbiAgc3RhdGUubG9hZGVkU2NyYXRjaCA9IG51bGw7XG59O1xuXG4vKipcbiAqIEdsb2JhbCBhcHBsaWNhdGlvbiBzaW5nbGV0b24uXG4gKi9cbmNvbnN0IEFwcCA9IGZ1bmN0aW9uICgpIHtcblxuICB0aGlzLmdldElzTG9hZGluZyA9ICgpID0+IHtcbiAgICByZXR1cm4gc3RhdGUuaXNMb2FkaW5nO1xuICB9O1xuXG4gIHRoaXMuc2V0SXNMb2FkaW5nID0gKGxvYWRpbmcpID0+IHtcbiAgICBzdGF0ZS5pc0xvYWRpbmcgPSBsb2FkaW5nO1xuICAgIGlmIChsb2FkaW5nKSB7XG4gICAgICAkKCcjbG9hZGluZy1zbGlkZXInKS5yZW1vdmVDbGFzcygnbG9hZGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJyNsb2FkaW5nLXNsaWRlcicpLmFkZENsYXNzKCdsb2FkZWQnKTtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy5nZXRFZGl0b3IgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHN0YXRlLmVkaXRvcjtcbiAgfTtcblxuICB0aGlzLmdldENhdGVnb3JpZXMgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHN0YXRlLmNhdGVnb3JpZXM7XG4gIH07XG5cbiAgdGhpcy5nZXRDYXRlZ29yeSA9IChuYW1lKSA9PiB7XG4gICAgcmV0dXJuIHN0YXRlLmNhdGVnb3JpZXNbbmFtZV07XG4gIH07XG5cbiAgdGhpcy5zZXRDYXRlZ29yaWVzID0gKGNhdGVnb3JpZXMpID0+IHtcbiAgICBzdGF0ZS5jYXRlZ29yaWVzID0gY2F0ZWdvcmllcztcbiAgfTtcblxuICB0aGlzLnVwZGF0ZUNhdGVnb3J5ID0gKG5hbWUsIHVwZGF0ZXMpID0+IHtcbiAgICAkLmV4dGVuZChzdGF0ZS5jYXRlZ29yaWVzW25hbWVdLCB1cGRhdGVzKTtcbiAgfTtcblxuICB0aGlzLmdldFRyYWNlck1hbmFnZXIgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHN0YXRlLnRyYWNlck1hbmFnZXI7XG4gIH07XG5cbiAgdGhpcy5nZXRMb2FkZWRTY3JhdGNoID0gKCkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5sb2FkZWRTY3JhdGNoO1xuICB9O1xuXG4gIHRoaXMuc2V0TG9hZGVkU2NyYXRjaCA9IChsb2FkZWRTY3JhdGNoKSA9PiB7XG4gICAgc3RhdGUubG9hZGVkU2NyYXRjaCA9IGxvYWRlZFNjcmF0Y2g7XG4gIH07XG5cbiAgY29uc3QgdHJhY2VyTWFuYWdlciA9IFRyYWNlck1hbmFnZXIuaW5pdCgpO1xuXG4gIGluaXRTdGF0ZSh0cmFjZXJNYW5hZ2VyKTtcbiAgRE9NLnNldHVwKHRyYWNlck1hbmFnZXIpO1xuXG59O1xuXG5BcHAucHJvdG90eXBlID0gQ2FjaGU7XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwOyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBtYWluIGFwcGxpY2F0aW9uIGluc3RhbmNlLlxuICogR2V0cyBwb3B1bGF0ZWQgb24gcGFnZSBsb2FkLiBcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7fTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuY29uc3QgU2VydmVyID0gcmVxdWlyZSgnLi4vc2VydmVyJyk7XG5jb25zdCBzaG93QWxnb3JpdGhtID0gcmVxdWlyZSgnLi9zaG93X2FsZ29yaXRobScpO1xuXG5jb25zdCB7XG4gIGVhY2hcbn0gPSAkO1xuXG5jb25zdCBhZGRBbGdvcml0aG1Ub0NhdGVnb3J5RE9NID0gKGNhdGVnb3J5LCBzdWJMaXN0LCBhbGdvcml0aG0pID0+IHtcbiAgY29uc3QgJGFsZ29yaXRobSA9ICQoJzxidXR0b24gY2xhc3M9XCJpbmRlbnQgY29sbGFwc2VcIj4nKVxuICAgIC5hcHBlbmQoc3ViTGlzdFthbGdvcml0aG1dKVxuICAgIC5hdHRyKCdkYXRhLWFsZ29yaXRobScsIGFsZ29yaXRobSlcbiAgICAuYXR0cignZGF0YS1jYXRlZ29yeScsIGNhdGVnb3J5KVxuICAgIC5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBTZXJ2ZXIubG9hZEFsZ29yaXRobShjYXRlZ29yeSwgYWxnb3JpdGhtKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIHNob3dBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSwgZGF0YSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAkKCcjbGlzdCcpLmFwcGVuZCgkYWxnb3JpdGhtKTtcbn07XG5cbmNvbnN0IGFkZENhdGVnb3J5VG9ET00gPSAoY2F0ZWdvcnkpID0+IHtcblxuICBjb25zdCB7XG4gICAgbmFtZTogY2F0ZWdvcnlOYW1lLFxuICAgIGxpc3Q6IGNhdGVnb3J5U3ViTGlzdFxuICB9ID0gYXBwLmdldENhdGVnb3J5KGNhdGVnb3J5KTtcblxuICBjb25zdCAkY2F0ZWdvcnkgPSAkKCc8YnV0dG9uIGNsYXNzPVwiY2F0ZWdvcnlcIj4nKVxuICAgIC5hcHBlbmQoJzxpIGNsYXNzPVwiZmEgZmEtZncgZmEtY2FyZXQtcmlnaHRcIj4nKVxuICAgIC5hcHBlbmQoY2F0ZWdvcnlOYW1lKVxuICAgIC5hdHRyKCdkYXRhLWNhdGVnb3J5JywgY2F0ZWdvcnkpO1xuXG4gICRjYXRlZ29yeS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgJChgLmluZGVudFtkYXRhLWNhdGVnb3J5PVwiJHtjYXRlZ29yeX1cIl1gKS50b2dnbGVDbGFzcygnY29sbGFwc2UnKTtcbiAgICAkKHRoaXMpLmZpbmQoJ2kuZmEnKS50b2dnbGVDbGFzcygnZmEtY2FyZXQtcmlnaHQgZmEtY2FyZXQtZG93bicpO1xuICB9KTtcblxuICAkKCcjbGlzdCcpLmFwcGVuZCgkY2F0ZWdvcnkpO1xuXG4gIGVhY2goY2F0ZWdvcnlTdWJMaXN0LCAoYWxnb3JpdGhtKSA9PiB7XG4gICAgYWRkQWxnb3JpdGhtVG9DYXRlZ29yeURPTShjYXRlZ29yeSwgY2F0ZWdvcnlTdWJMaXN0LCBhbGdvcml0aG0pO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuICBlYWNoKGFwcC5nZXRDYXRlZ29yaWVzKCksIGFkZENhdGVnb3J5VG9ET00pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFNlcnZlciA9IHJlcXVpcmUoJy4uL3NlcnZlcicpO1xuXG5jb25zdCB7XG4gIGVhY2hcbn0gPSAkO1xuXG5jb25zdCBhZGRGaWxlVG9ET00gPSAoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSwgZXhwbGFuYXRpb24pID0+IHtcbiAgdmFyICRmaWxlID0gJCgnPGJ1dHRvbj4nKVxuICAgIC5hcHBlbmQoZmlsZSlcbiAgICAuYXR0cignZGF0YS1maWxlJywgZmlsZSlcbiAgICAuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgU2VydmVyLmxvYWRGaWxlKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUsIGV4cGxhbmF0aW9uKTtcbiAgICAgICQoJy5maWxlc19iYXIgPiAud3JhcHBlciA+IGJ1dHRvbicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH0pO1xuICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKS5hcHBlbmQoJGZpbGUpO1xuICByZXR1cm4gJGZpbGU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IChjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlcywgcmVxdWVzdGVkRmlsZSkgPT4ge1xuICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKS5lbXB0eSgpO1xuXG4gIGVhY2goZmlsZXMsIChmaWxlLCBleHBsYW5hdGlvbikgPT4ge1xuICAgIHZhciAkZmlsZSA9IGFkZEZpbGVUb0RPTShjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlLCBleHBsYW5hdGlvbik7XG4gICAgaWYgKHJlcXVlc3RlZEZpbGUgJiYgcmVxdWVzdGVkRmlsZSA9PSBmaWxlKSAkZmlsZS5jbGljaygpO1xuICB9KTtcblxuICBpZiAoIXJlcXVlc3RlZEZpbGUpICQoJy5maWxlc19iYXIgPiAud3JhcHBlciA+IGJ1dHRvbicpLmZpcnN0KCkuY2xpY2soKTtcbiAgJCgnLmZpbGVzX2JhciA+IC53cmFwcGVyJykuc2Nyb2xsKCk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc2hvd0FsZ29yaXRobSA9IHJlcXVpcmUoJy4vc2hvd19hbGdvcml0aG0nKTtcbmNvbnN0IGFkZENhdGVnb3JpZXMgPSByZXF1aXJlKCcuL2FkZF9jYXRlZ29yaWVzJyk7XG5jb25zdCBzaG93RGVzY3JpcHRpb24gPSByZXF1aXJlKCcuL3Nob3dfZGVzY3JpcHRpb24nKTtcbmNvbnN0IGFkZEZpbGVzID0gcmVxdWlyZSgnLi9hZGRfZmlsZXMnKTtcbmNvbnN0IHNob3dGaXJzdEFsZ29yaXRobSA9IHJlcXVpcmUoJy4vc2hvd19maXJzdF9hbGdvcml0aG0nKTtcbmNvbnN0IHNob3dSZXF1ZXN0ZWRBbGdvcml0aG0gPSByZXF1aXJlKCcuL3Nob3dfcmVxdWVzdGVkX2FsZ29yaXRobScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2hvd0FsZ29yaXRobSxcbiAgYWRkQ2F0ZWdvcmllcyxcbiAgc2hvd0Rlc2NyaXB0aW9uLFxuICBhZGRGaWxlcyxcbiAgc2hvd0ZpcnN0QWxnb3JpdGhtLFxuICBzaG93UmVxdWVzdGVkQWxnb3JpdGhtXG59OyIsImNvbnN0IHNldHVwRGl2aWRlcnMgPSByZXF1aXJlKCcuL3NldHVwX2RpdmlkZXJzJyk7XG5jb25zdCBzZXR1cERvY3VtZW50ID0gcmVxdWlyZSgnLi9zZXR1cF9kb2N1bWVudCcpO1xuY29uc3Qgc2V0dXBGaWxlc0JhciA9IHJlcXVpcmUoJy4vc2V0dXBfZmlsZXNfYmFyJyk7XG5jb25zdCBzZXR1cEludGVydmFsID0gcmVxdWlyZSgnLi9zZXR1cF9pbnRlcnZhbCcpO1xuY29uc3Qgc2V0dXBNb2R1bGVDb250YWluZXIgPSByZXF1aXJlKCcuL3NldHVwX21vZHVsZV9jb250YWluZXInKTtcbmNvbnN0IHNldHVwUG93ZXJlZEJ5ID0gcmVxdWlyZSgnLi9zZXR1cF9wb3dlcmVkX2J5Jyk7XG5jb25zdCBzZXR1cFNjcmF0Y2hQYXBlciA9IHJlcXVpcmUoJy4vc2V0dXBfc2NyYXRjaF9wYXBlcicpO1xuY29uc3Qgc2V0dXBTaWRlTWVudSA9IHJlcXVpcmUoJy4vc2V0dXBfc2lkZV9tZW51Jyk7XG5jb25zdCBzZXR1cFRvcE1lbnUgPSByZXF1aXJlKCcuL3NldHVwX3RvcF9tZW51Jyk7XG5jb25zdCBzZXR1cFdpbmRvdyA9IHJlcXVpcmUoJy4vc2V0dXBfd2luZG93Jyk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgZWxlbWVudHMgb25jZSB0aGUgYXBwIGxvYWRzIGluIHRoZSBET00uIFxuICovXG5jb25zdCBzZXR1cCA9ICgpID0+IHtcblxuICAkKCcuYnRuIGlucHV0JykuY2xpY2soKGUpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICB9KTtcblxuICAvLyBkaXZpZGVyc1xuICBzZXR1cERpdmlkZXJzKCk7XG5cbiAgLy8gZG9jdW1lbnRcbiAgc2V0dXBEb2N1bWVudCgpO1xuXG4gIC8vIGZpbGVzIGJhclxuICBzZXR1cEZpbGVzQmFyKCk7XG5cbiAgLy8gaW50ZXJ2YWxcbiAgc2V0dXBJbnRlcnZhbCgpO1xuXG4gIC8vIG1vZHVsZSBjb250YWluZXJcbiAgc2V0dXBNb2R1bGVDb250YWluZXIoKTtcblxuICAvLyBwb3dlcmVkIGJ5XG4gIHNldHVwUG93ZXJlZEJ5KCk7XG5cbiAgLy8gc2NyYXRjaCBwYXBlclxuICBzZXR1cFNjcmF0Y2hQYXBlcigpO1xuXG4gIC8vIHNpZGUgbWVudVxuICBzZXR1cFNpZGVNZW51KCk7XG5cbiAgLy8gdG9wIG1lbnVcbiAgc2V0dXBUb3BNZW51KCk7XG5cbiAgLy8gd2luZG93XG4gIHNldHVwV2luZG93KCk7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXR1cFxufTsiLCJjb25zdCBhcHAgPSByZXF1aXJlKCcuLi8uLi9hcHAnKTtcblxuY29uc3QgYWRkRGl2aWRlclRvRG9tID0gKGRpdmlkZXIpID0+IHtcbiAgY29uc3QgW3ZlcnRpY2FsLCAkZmlyc3QsICRzZWNvbmRdID0gZGl2aWRlcjtcbiAgY29uc3QgJHBhcmVudCA9ICRmaXJzdC5wYXJlbnQoKTtcbiAgY29uc3QgdGhpY2tuZXNzID0gNTtcblxuICBjb25zdCAkZGl2aWRlciA9ICQoJzxkaXYgY2xhc3M9XCJkaXZpZGVyXCI+Jyk7XG5cbiAgbGV0IGRyYWdnaW5nID0gZmFsc2U7XG4gIGlmICh2ZXJ0aWNhbCkge1xuICAgICRkaXZpZGVyLmFkZENsYXNzKCd2ZXJ0aWNhbCcpO1xuXG4gICAgbGV0IF9sZWZ0ID0gLXRoaWNrbmVzcyAvIDI7XG4gICAgJGRpdmlkZXIuY3NzKHtcbiAgICAgIHRvcDogMCxcbiAgICAgIGJvdHRvbTogMCxcbiAgICAgIGxlZnQ6IF9sZWZ0LFxuICAgICAgd2lkdGg6IHRoaWNrbmVzc1xuICAgIH0pO1xuXG4gICAgbGV0IHg7XG4gICAgJGRpdmlkZXIubW91c2Vkb3duKCh7XG4gICAgICBwYWdlWFxuICAgIH0pID0+IHtcbiAgICAgIHggPSBwYWdlWDtcbiAgICAgIGRyYWdnaW5nID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm1vdXNlbW92ZSgoe1xuICAgICAgcGFnZVhcbiAgICB9KSA9PiB7XG4gICAgICBpZiAoZHJhZ2dpbmcpIHtcbiAgICAgICAgY29uc3QgbmV3X2xlZnQgPSAkc2Vjb25kLnBvc2l0aW9uKCkubGVmdCArIHBhZ2VYIC0geDtcbiAgICAgICAgbGV0IHBlcmNlbnQgPSBuZXdfbGVmdCAvICRwYXJlbnQud2lkdGgoKSAqIDEwMDtcbiAgICAgICAgcGVyY2VudCA9IE1hdGgubWluKDkwLCBNYXRoLm1heCgxMCwgcGVyY2VudCkpO1xuICAgICAgICAkZmlyc3QuY3NzKCdyaWdodCcsICgxMDAgLSBwZXJjZW50KSArICclJyk7XG4gICAgICAgICRzZWNvbmQuY3NzKCdsZWZ0JywgcGVyY2VudCArICclJyk7XG4gICAgICAgIHggPSBwYWdlWDtcbiAgICAgICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5yZXNpemUoKTtcbiAgICAgICAgJCgnLmZpbGVzX2JhciA+IC53cmFwcGVyJykuc2Nyb2xsKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5tb3VzZXVwKGZ1bmN0aW9uKGUpIHtcbiAgICAgIGRyYWdnaW5nID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgfSBlbHNlIHtcblxuICAgICRkaXZpZGVyLmFkZENsYXNzKCdob3Jpem9udGFsJyk7XG4gICAgY29uc3QgX3RvcCA9IC10aGlja25lc3MgLyAyO1xuICAgICRkaXZpZGVyLmNzcyh7XG4gICAgICB0b3A6IF90b3AsXG4gICAgICBoZWlnaHQ6IHRoaWNrbmVzcyxcbiAgICAgIGxlZnQ6IDAsXG4gICAgICByaWdodDogMFxuICAgIH0pO1xuXG4gICAgbGV0IHk7XG4gICAgJGRpdmlkZXIubW91c2Vkb3duKGZ1bmN0aW9uKHtcbiAgICAgIHBhZ2VZXG4gICAgfSkge1xuICAgICAgeSA9IHBhZ2VZO1xuICAgICAgZHJhZ2dpbmcgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkubW91c2Vtb3ZlKGZ1bmN0aW9uKHtcbiAgICAgIHBhZ2VZXG4gICAgfSkge1xuICAgICAgaWYgKGRyYWdnaW5nKSB7XG4gICAgICAgIGNvbnN0IG5ld190b3AgPSAkc2Vjb25kLnBvc2l0aW9uKCkudG9wICsgcGFnZVkgLSB5O1xuICAgICAgICBsZXQgcGVyY2VudCA9IG5ld190b3AgLyAkcGFyZW50LmhlaWdodCgpICogMTAwO1xuICAgICAgICBwZXJjZW50ID0gTWF0aC5taW4oOTAsIE1hdGgubWF4KDEwLCBwZXJjZW50KSk7XG4gICAgICAgICRmaXJzdC5jc3MoJ2JvdHRvbScsICgxMDAgLSBwZXJjZW50KSArICclJyk7XG4gICAgICAgICRzZWNvbmQuY3NzKCd0b3AnLCBwZXJjZW50ICsgJyUnKTtcbiAgICAgICAgeSA9IHBhZ2VZO1xuICAgICAgICBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpLnJlc2l6ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbihlKSB7XG4gICAgICBkcmFnZ2luZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgJHNlY29uZC5hcHBlbmQoJGRpdmlkZXIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG4gIGNvbnN0IGRpdmlkZXJzID0gW1xuICAgIFsndicsICQoJy5zaWRlbWVudScpLCAkKCcud29ya3NwYWNlJyldLFxuICAgIFsndicsICQoJy52aWV3ZXJfY29udGFpbmVyJyksICQoJy5lZGl0b3JfY29udGFpbmVyJyldLFxuICAgIFsnaCcsICQoJy5kYXRhX2NvbnRhaW5lcicpLCAkKCcuY29kZV9jb250YWluZXInKV1cbiAgXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXZpZGVycy5sZW5ndGg7IGkrKykge1xuICAgIGFkZERpdmlkZXJUb0RvbShkaXZpZGVyc1tpXSk7XG4gIH1cbn0iLCJjb25zdCBhcHAgPSByZXF1aXJlKCcuLi8uLi9hcHAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG4gICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdhJywgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZiAoIXdpbmRvdy5vcGVuKCQodGhpcykuYXR0cignaHJlZicpLCAnX2JsYW5rJykpIHtcbiAgICAgIGFsZXJ0KCdQbGVhc2UgYWxsb3cgcG9wdXBzIGZvciB0aGlzIHNpdGUnKTtcbiAgICB9XG4gIH0pO1xuXG4gICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24oZSkge1xuICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkuY29tbWFuZCgnbW91c2V1cCcsIGUpO1xuICB9KTtcbn07IiwiY29uc3QgZGVmaW5pdGVseUJpZ2dlciA9ICh4LCB5KSA9PiB4ID4gKHkgKyAyKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG5cbiAgJCgnLmZpbGVzX2JhciA+IC5idG4tbGVmdCcpLmNsaWNrKCgpID0+IHtcbiAgICBjb25zdCAkd3JhcHBlciA9ICQoJy5maWxlc19iYXIgPiAud3JhcHBlcicpO1xuICAgIGNvbnN0IGNsaXBXaWR0aCA9ICR3cmFwcGVyLndpZHRoKCk7XG4gICAgY29uc3Qgc2Nyb2xsTGVmdCA9ICR3cmFwcGVyLnNjcm9sbExlZnQoKTtcblxuICAgICQoJHdyYXBwZXIuY2hpbGRyZW4oJ2J1dHRvbicpLmdldCgpLnJldmVyc2UoKSkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGxlZnQgPSAkKHRoaXMpLnBvc2l0aW9uKCkubGVmdDtcbiAgICAgIGNvbnN0IHJpZ2h0ID0gbGVmdCArICQodGhpcykub3V0ZXJXaWR0aCgpO1xuICAgICAgaWYgKDAgPiBsZWZ0KSB7XG4gICAgICAgICR3cmFwcGVyLnNjcm9sbExlZnQoc2Nyb2xsTGVmdCArIHJpZ2h0IC0gY2xpcFdpZHRoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICAkKCcuZmlsZXNfYmFyID4gLmJ0bi1yaWdodCcpLmNsaWNrKCgpID0+IHtcbiAgICBjb25zdCAkd3JhcHBlciA9ICQoJy5maWxlc19iYXIgPiAud3JhcHBlcicpO1xuICAgIGNvbnN0IGNsaXBXaWR0aCA9ICR3cmFwcGVyLndpZHRoKCk7XG4gICAgY29uc3Qgc2Nyb2xsTGVmdCA9ICR3cmFwcGVyLnNjcm9sbExlZnQoKTtcblxuICAgICR3cmFwcGVyLmNoaWxkcmVuKCdidXR0b24nKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbGVmdCA9ICQodGhpcykucG9zaXRpb24oKS5sZWZ0O1xuICAgICAgY29uc3QgcmlnaHQgPSBsZWZ0ICsgJCh0aGlzKS5vdXRlcldpZHRoKCk7XG4gICAgICBpZiAoY2xpcFdpZHRoIDwgcmlnaHQpIHtcbiAgICAgICAgJHdyYXBwZXIuc2Nyb2xsTGVmdChzY3JvbGxMZWZ0ICsgbGVmdCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgJCgnLmZpbGVzX2JhciA+IC53cmFwcGVyJykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuXG4gICAgY29uc3QgJHdyYXBwZXIgPSAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKTtcbiAgICBjb25zdCBjbGlwV2lkdGggPSAkd3JhcHBlci53aWR0aCgpO1xuICAgIGNvbnN0ICRsZWZ0ID0gJHdyYXBwZXIuY2hpbGRyZW4oJ2J1dHRvbjpmaXJzdC1jaGlsZCcpO1xuICAgIGNvbnN0ICRyaWdodCA9ICR3cmFwcGVyLmNoaWxkcmVuKCdidXR0b246bGFzdC1jaGlsZCcpO1xuICAgIGNvbnN0IGxlZnQgPSAkbGVmdC5wb3NpdGlvbigpLmxlZnQ7XG4gICAgY29uc3QgcmlnaHQgPSAkcmlnaHQucG9zaXRpb24oKS5sZWZ0ICsgJHJpZ2h0Lm91dGVyV2lkdGgoKTtcblxuICAgIGlmIChkZWZpbml0ZWx5QmlnZ2VyKDAsIGxlZnQpICYmIGRlZmluaXRlbHlCaWdnZXIoY2xpcFdpZHRoLCByaWdodCkpIHtcbiAgICAgIGNvbnN0IHNjcm9sbExlZnQgPSAkd3JhcHBlci5zY3JvbGxMZWZ0KCk7XG4gICAgICAkd3JhcHBlci5zY3JvbGxMZWZ0KHNjcm9sbExlZnQgKyBjbGlwV2lkdGggLSByaWdodCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGVmdGVyID0gZGVmaW5pdGVseUJpZ2dlcigwLCBsZWZ0KTtcbiAgICBjb25zdCByaWdodGVyID0gZGVmaW5pdGVseUJpZ2dlcihyaWdodCwgY2xpcFdpZHRoKTtcbiAgICAkd3JhcHBlci50b2dnbGVDbGFzcygnc2hhZG93LWxlZnQnLCBsZWZ0ZXIpO1xuICAgICR3cmFwcGVyLnRvZ2dsZUNsYXNzKCdzaGFkb3ctcmlnaHQnLCByaWdodGVyKTtcbiAgICAkKCcuZmlsZXNfYmFyID4gLmJ0bi1sZWZ0JykuYXR0cignZGlzYWJsZWQnLCAhbGVmdGVyKTtcbiAgICAkKCcuZmlsZXNfYmFyID4gLmJ0bi1yaWdodCcpLmF0dHIoJ2Rpc2FibGVkJywgIXJpZ2h0ZXIpO1xuICB9KTtcbn0iLCJjb25zdCBhcHAgPSByZXF1aXJlKCcuLi8uLi9hcHAnKTtcbmNvbnN0IFRvYXN0ID0gcmVxdWlyZSgnLi4vdG9hc3QnKTtcblxuY29uc3Qge1xuICBwYXJzZUZsb2F0XG59ID0gTnVtYmVyO1xuXG5jb25zdCBtaW5JbnRlcnZhbCA9IDAuMTtcbmNvbnN0IG1heEludGVydmFsID0gMTA7XG5jb25zdCBzdGFydEludGVydmFsID0gMC41O1xuY29uc3Qgc3RlcEludGVydmFsID0gMC4xO1xuXG5jb25zdCBub3JtYWxpemUgPSAoc2VjKSA9PiB7XG5cblxuICBsZXQgaW50ZXJ2YWw7XG4gIGxldCBtZXNzYWdlO1xuICBpZiAoc2VjIDwgbWluSW50ZXJ2YWwpIHtcbiAgICBpbnRlcnZhbCA9IG1pbkludGVydmFsO1xuICAgIG1lc3NhZ2UgPSBgSW50ZXJ2YWwgb2YgJHtzZWN9IHNlY29uZHMgaXMgdG9vIGxvdy4gU2V0dGluZyB0byBtaW4gYWxsb3dlZCBpbnRlcnZhbCBvZiAke21pbkludGVydmFsfSBzZWNvbmQocykuYDtcbiAgfSBlbHNlIGlmIChzZWMgPiBtYXhJbnRlcnZhbCkge1xuICAgIGludGVydmFsID0gbWF4SW50ZXJ2YWw7XG4gICAgbWVzc2FnZSA9IGBJbnRlcnZhbCBvZiAke3NlY30gc2Vjb25kcyBpcyB0b28gaGlnaC4gU2V0dGluZyB0byBtYXggYWxsb3dlZCBpbnRlcnZhbCBvZiAke21heEludGVydmFsfSBzZWNvbmQocykuYDtcbiAgfSBlbHNlIHtcbiAgICBpbnRlcnZhbCA9IHNlYztcbiAgICBtZXNzYWdlID0gYEludGVydmFsIGhhcyBiZWVuIHNldCB0byAke3NlY30gc2Vjb25kKHMpLmBcbiAgfVxuXG4gIHJldHVybiBbaW50ZXJ2YWwsIG1lc3NhZ2VdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG5cbiAgY29uc3QgJGludGVydmFsID0gJCgnI2ludGVydmFsJyk7XG4gICRpbnRlcnZhbC52YWwoc3RhcnRJbnRlcnZhbCk7XG4gICRpbnRlcnZhbC5hdHRyKHtcbiAgICBtYXg6IG1heEludGVydmFsLFxuICAgIG1pbjogbWluSW50ZXJ2YWwsXG4gICAgc3RlcDogc3RlcEludGVydmFsXG4gIH0pO1xuXG4gICQoJyNpbnRlcnZhbCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCB0cmFjZXJNYW5hZ2VyID0gYXBwLmdldFRyYWNlck1hbmFnZXIoKTtcbiAgICBjb25zdCBbc2Vjb25kcywgbWVzc2FnZV0gPSBub3JtYWxpemUocGFyc2VGbG9hdCgkKHRoaXMpLnZhbCgpKSk7XG5cbiAgICAkKHRoaXMpLnZhbChzZWNvbmRzKTtcbiAgICB0cmFjZXJNYW5hZ2VyLmludGVydmFsID0gc2Vjb25kcyAqIDEwMDA7XG4gICAgVG9hc3Quc2hvd0luZm9Ub2FzdChtZXNzYWdlKTtcbiAgfSk7XG59OyIsImNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uLy4uL2FwcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcblxuICBjb25zdCAkbW9kdWxlX2NvbnRhaW5lciA9ICQoJy5tb2R1bGVfY29udGFpbmVyJyk7XG5cbiAgJG1vZHVsZV9jb250YWluZXIub24oJ21vdXNlZG93bicsICcubW9kdWxlX3dyYXBwZXInLCBmdW5jdGlvbihlKSB7XG4gICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5maW5kT3duZXIodGhpcykubW91c2Vkb3duKGUpO1xuICB9KTtcblxuICAkbW9kdWxlX2NvbnRhaW5lci5vbignbW91c2Vtb3ZlJywgJy5tb2R1bGVfd3JhcHBlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpLmZpbmRPd25lcih0aGlzKS5tb3VzZW1vdmUoZSk7XG4gIH0pO1xuXG4gICRtb2R1bGVfY29udGFpbmVyLm9uKCdET01Nb3VzZVNjcm9sbCBtb3VzZXdoZWVsJywgJy5tb2R1bGVfd3JhcHBlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICBhcHAuZ2V0VHJhY2VyTWFuYWdlcigpLmZpbmRPd25lcih0aGlzKS5tb3VzZXdoZWVsKGUpO1xuICB9KTtcbn0iLCJtb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgJCgnI3Bvd2VyZWQtYnknKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAkKCcjcG93ZXJlZC1ieS1saXN0IGJ1dHRvbicpLnRvZ2dsZUNsYXNzKCdjb2xsYXBzZScpO1xuICB9KTtcbn07IiwiY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XG5jb25zdCBTZXJ2ZXIgPSByZXF1aXJlKCcuLi8uLi9zZXJ2ZXInKTtcbmNvbnN0IHNob3dBbGdvcml0aG0gPSByZXF1aXJlKCcuLi9zaG93X2FsZ29yaXRobScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgJCgnI3NjcmF0Y2gtcGFwZXInKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICBjb25zdCBjYXRlZ29yeSA9ICdzY3JhdGNoJztcbiAgICBjb25zdCBhbGdvcml0aG0gPSBhcHAuZ2V0TG9hZGVkU2NyYXRjaCgpO1xuICAgIFNlcnZlci5sb2FkQWxnb3JpdGhtKGNhdGVnb3J5LCBhbGdvcml0aG0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIHNob3dBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSwgZGF0YSk7XG4gICAgfSk7XG4gIH0pO1xufTsiLCJjb25zdCBhcHAgPSByZXF1aXJlKCcuLi8uLi9hcHAnKTtcblxubGV0IHNpZGVtZW51X3BlcmNlbnQ7XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuICAkKCcjbmF2aWdhdGlvbicpLmNsaWNrKCgpID0+IHtcbiAgICBjb25zdCAkc2lkZW1lbnUgPSAkKCcuc2lkZW1lbnUnKTtcbiAgICBjb25zdCAkd29ya3NwYWNlID0gJCgnLndvcmtzcGFjZScpO1xuXG4gICAgJHNpZGVtZW51LnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCcubmF2LWRyb3Bkb3duJykudG9nZ2xlQ2xhc3MoJ2ZhLWNhcmV0LWRvd24gZmEtY2FyZXQtdXAnKTtcblxuICAgIGlmICgkc2lkZW1lbnUuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG4gICAgICAkc2lkZW1lbnUuY3NzKCdyaWdodCcsICgxMDAgLSBzaWRlbWVudV9wZXJjZW50KSArICclJyk7XG4gICAgICAkd29ya3NwYWNlLmNzcygnbGVmdCcsIHNpZGVtZW51X3BlcmNlbnQgKyAnJScpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHNpZGVtZW51X3BlcmNlbnQgPSAkd29ya3NwYWNlLnBvc2l0aW9uKCkubGVmdCAvICQoJ2JvZHknKS53aWR0aCgpICogMTAwO1xuICAgICAgJHNpZGVtZW51LmNzcygncmlnaHQnLCAwKTtcbiAgICAgICR3b3Jrc3BhY2UuY3NzKCdsZWZ0JywgMCk7XG4gICAgfVxuXG4gICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5yZXNpemUoKTtcbiAgfSk7XG59IiwiY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XG5jb25zdCBTZXJ2ZXIgPSByZXF1aXJlKCcuLi8uLi9zZXJ2ZXInKTtcbmNvbnN0IFRvYXN0ID0gcmVxdWlyZSgnLi4vdG9hc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG5cbiAgLy8gc2hhcmVkXG4gICQoJyNzaGFyZWQnKS5tb3VzZXVwKGZ1bmN0aW9uKCkge1xuICAgICQodGhpcykuc2VsZWN0KCk7XG4gIH0pO1xuXG4gICQoJyNidG5fc2hhcmUnKS5jbGljayhmdW5jdGlvbigpIHtcblxuICAgIGNvbnN0ICRpY29uID0gJCh0aGlzKS5maW5kKCcuZmEtc2hhcmUnKTtcbiAgICAkaWNvbi5hZGRDbGFzcygnZmEtc3BpbiBmYS1zcGluLWZhc3RlcicpO1xuXG4gICAgU2VydmVyLnNoYXJlU2NyYXRjaFBhcGVyKCkudGhlbigodXJsKSA9PiB7XG4gICAgICAkaWNvbi5yZW1vdmVDbGFzcygnZmEtc3BpbiBmYS1zcGluLWZhc3RlcicpO1xuICAgICAgJCgnI3NoYXJlZCcpLnJlbW92ZUNsYXNzKCdjb2xsYXBzZScpO1xuICAgICAgJCgnI3NoYXJlZCcpLnZhbCh1cmwpO1xuICAgICAgVG9hc3Quc2hvd0luZm9Ub2FzdCgnU2hhcmVhYmxlIGxpbmsgaXMgY3JlYXRlZC4nKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gY29udHJvbFxuXG4gICQoJyNidG5fcnVuJykuY2xpY2soKCkgPT4ge1xuICAgICQoJyNidG5fdHJhY2UnKS5jbGljaygpO1xuICAgIHZhciBlcnIgPSBhcHAuZ2V0RWRpdG9yKCkuZXhlY3V0ZSgpO1xuICAgIGlmIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIFRvYXN0LnNob3dFcnJvclRvYXN0KGVycik7XG4gICAgfVxuICB9KTtcbiAgJCgnI2J0bl9wYXVzZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgIGlmIChhcHAuZ2V0VHJhY2VyTWFuYWdlcigpLmlzUGF1c2UoKSkge1xuICAgICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5yZXN1bWVTdGVwKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkucGF1c2VTdGVwKCk7XG4gICAgfVxuICB9KTtcbiAgJCgnI2J0bl9wcmV2JykuY2xpY2soKCkgPT4ge1xuICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkucGF1c2VTdGVwKCk7XG4gICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5wcmV2U3RlcCgpO1xuICB9KTtcbiAgJCgnI2J0bl9uZXh0JykuY2xpY2soKCkgPT4ge1xuICAgIGFwcC5nZXRUcmFjZXJNYW5hZ2VyKCkucGF1c2VTdGVwKCk7XG4gICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5uZXh0U3RlcCgpO1xuICB9KTtcblxuICAvLyBkZXNjcmlwdGlvbiAmIHRyYWNlXG5cbiAgJCgnI2J0bl9kZXNjJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgJCgnLnRhYl9jb250YWluZXIgPiAudGFiJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQoJyN0YWJfZGVzYycpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCcudGFiX2JhciA+IGJ1dHRvbicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgfSk7XG5cbiAgJCgnI2J0bl90cmFjZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICQoJy50YWJfY29udGFpbmVyID4gLnRhYicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCcjdGFiX21vZHVsZScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCcudGFiX2JhciA+IGJ1dHRvbicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgfSk7XG5cbn07IiwiY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XG4gICAgYXBwLmdldFRyYWNlck1hbmFnZXIoKS5yZXNpemUoKTtcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vYXBwJyk7XG5cbmNvbnN0IHtcbiAgaXNTY3JhdGNoUGFwZXJcbn0gPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5jb25zdCBzaG93RGVzY3JpcHRpb24gPSByZXF1aXJlKCcuL3Nob3dfZGVzY3JpcHRpb24nKTtcbmNvbnN0IGFkZEZpbGVzID0gcmVxdWlyZSgnLi9hZGRfZmlsZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoY2F0ZWdvcnksIGFsZ29yaXRobSwgZGF0YSwgcmVxdWVzdGVkRmlsZSkgPT4ge1xuICBsZXQgJG1lbnU7XG4gIGxldCBjYXRlZ29yeV9uYW1lO1xuICBsZXQgYWxnb3JpdGhtX25hbWU7XG5cbiAgaWYgKGlzU2NyYXRjaFBhcGVyKGNhdGVnb3J5KSkge1xuICAgICRtZW51ID0gJCgnI3NjcmF0Y2gtcGFwZXInKTtcbiAgICBjYXRlZ29yeV9uYW1lID0gJ1NjcmF0Y2ggUGFwZXInO1xuICAgIGFsZ29yaXRobV9uYW1lID0gYWxnb3JpdGhtID8gJ1NoYXJlZCcgOiAnVGVtcG9yYXJ5JztcbiAgfSBlbHNlIHtcbiAgICAkbWVudSA9ICQoYFtkYXRhLWNhdGVnb3J5PVwiJHtjYXRlZ29yeX1cIl1bZGF0YS1hbGdvcml0aG09XCIke2FsZ29yaXRobX1cIl1gKTtcbiAgICBjb25zdCBjYXRlZ29yeU9iaiA9IGFwcC5nZXRDYXRlZ29yeShjYXRlZ29yeSk7XG4gICAgY2F0ZWdvcnlfbmFtZSA9IGNhdGVnb3J5T2JqLm5hbWU7XG4gICAgYWxnb3JpdGhtX25hbWUgPSBjYXRlZ29yeU9iai5saXN0W2FsZ29yaXRobV07XG4gIH1cblxuICAkKCcuc2lkZW1lbnUgYnV0dG9uJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAkbWVudS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgJCgnI2NhdGVnb3J5JykuaHRtbChjYXRlZ29yeV9uYW1lKTtcbiAgJCgnI2FsZ29yaXRobScpLmh0bWwoYWxnb3JpdGhtX25hbWUpO1xuICAkKCcjdGFiX2Rlc2MgPiAud3JhcHBlcicpLmVtcHR5KCk7XG4gICQoJy5maWxlc19iYXIgPiAud3JhcHBlcicpLmVtcHR5KCk7XG4gICQoJyNleHBsYW5hdGlvbicpLmh0bWwoJycpO1xuXG4gIGFwcC5zZXRMYXN0RmlsZVVzZWQobnVsbCk7XG4gIGFwcC5nZXRFZGl0b3IoKS5jbGVhckNvbnRlbnQoKTtcblxuICBjb25zdCB7XG4gICAgZmlsZXNcbiAgfSA9IGRhdGE7XG5cbiAgZGVsZXRlIGRhdGEuZmlsZXM7XG5cbiAgc2hvd0Rlc2NyaXB0aW9uKGRhdGEpO1xuICBhZGRGaWxlcyhjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlcywgcmVxdWVzdGVkRmlsZSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qge1xuICBpc0FycmF5XG59ID0gQXJyYXk7XG5cbmNvbnN0IHtcbiAgZWFjaFxufSA9ICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gKGRhdGEpID0+IHtcbiAgY29uc3QgJGNvbnRhaW5lciA9ICQoJyN0YWJfZGVzYyA+IC53cmFwcGVyJyk7XG4gICRjb250YWluZXIuZW1wdHkoKTtcblxuICBlYWNoKGRhdGEsIChrZXksIHZhbHVlKSA9PiB7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICAkY29udGFpbmVyLmFwcGVuZCgkKCc8aDM+JykuaHRtbChrZXkpKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgJGNvbnRhaW5lci5hcHBlbmQoJCgnPHA+JykuaHRtbCh2YWx1ZSkpO1xuXG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xuXG4gICAgICBjb25zdCAkdWwgPSAkKCc8dWw+Jyk7XG4gICAgICAkY29udGFpbmVyLmFwcGVuZCgkdWwpO1xuXG4gICAgICB2YWx1ZS5mb3JFYWNoKChsaSkgPT4ge1xuICAgICAgICAkdWwuYXBwZW5kKCQoJzxsaT4nKS5odG1sKGxpKSk7XG4gICAgICB9KTtcblxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuXG4gICAgICBjb25zdCAkdWwgPSAkKCc8dWw+Jyk7XG4gICAgICAkY29udGFpbmVyLmFwcGVuZCgkdWwpO1xuXG4gICAgICBlYWNoKHZhbHVlLCAocHJvcCkgPT4ge1xuICAgICAgICAkdWwuYXBwZW5kKCQoJzxsaT4nKS5hcHBlbmQoJCgnPHN0cm9uZz4nKS5odG1sKHByb3ApKS5hcHBlbmQoYCAke3ZhbHVlW3Byb3BdfWApKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLy8gY2xpY2sgdGhlIGZpcnN0IGFsZ29yaXRobSBpbiB0aGUgZmlyc3QgY2F0ZWdvcnlcbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuICAkKCcjbGlzdCBidXR0b24uY2F0ZWdvcnknKS5maXJzdCgpLmNsaWNrKCk7XG4gICQoJyNsaXN0IGJ1dHRvbi5jYXRlZ29yeSArIC5pbmRlbnQnKS5maXJzdCgpLmNsaWNrKCk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgU2VydmVyID0gcmVxdWlyZSgnLi4vc2VydmVyJyk7XG5jb25zdCBzaG93QWxnb3JpdGhtID0gcmVxdWlyZSgnLi9zaG93X2FsZ29yaXRobScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlKSA9PiB7XG4gICQoYC5jYXRlZ29yeVtkYXRhLWNhdGVnb3J5PVwiJHtjYXRlZ29yeX1cIl1gKS5jbGljaygpO1xuICBTZXJ2ZXIubG9hZEFsZ29yaXRobShjYXRlZ29yeSwgYWxnb3JpdGhtKS50aGVuKChkYXRhKSA9PiB7XG4gICAgc2hvd0FsZ29yaXRobShjYXRlZ29yeSwgYWxnb3JpdGhtLCBkYXRhLCBmaWxlKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBzaG93VG9hc3QgPSAoZGF0YSwgdHlwZSkgPT4ge1xuICBjb25zdCAkdG9hc3QgPSAkKGA8ZGl2IGNsYXNzPVwidG9hc3QgJHt0eXBlfVwiPmApLmFwcGVuZChkYXRhKTtcblxuICAkKCcudG9hc3RfY29udGFpbmVyJykuYXBwZW5kKCR0b2FzdCk7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICR0b2FzdC5mYWRlT3V0KCgpID0+IHtcbiAgICAgICR0b2FzdC5yZW1vdmUoKTtcbiAgICB9KTtcbiAgfSwgMzAwMCk7XG59O1xuXG5jb25zdCBzaG93RXJyb3JUb2FzdCA9IChlcnIpID0+IHtcbiAgc2hvd1RvYXN0KGVyciwgJ2Vycm9yJyk7XG59O1xuXG5jb25zdCBzaG93SW5mb1RvYXN0ID0gKGVycikgPT4ge1xuICBzaG93VG9hc3QoZXJyLCAnaW5mbycpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNob3dFcnJvclRvYXN0LFxuICBzaG93SW5mb1RvYXN0XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpZCkge1xuICBjb25zdCBlZGl0b3IgPSBhY2UuZWRpdChpZCk7XG5cbiAgZWRpdG9yLnNldE9wdGlvbnMoe1xuICAgIGVuYWJsZUJhc2ljQXV0b2NvbXBsZXRpb246IHRydWUsXG4gICAgZW5hYmxlU25pcHBldHM6IHRydWUsXG4gICAgZW5hYmxlTGl2ZUF1dG9jb21wbGV0aW9uOiB0cnVlXG4gIH0pO1xuXG4gIGVkaXRvci5zZXRUaGVtZSgnYWNlL3RoZW1lL3RvbW9ycm93X25pZ2h0X2VpZ2h0aWVzJyk7XG4gIGVkaXRvci5zZXNzaW9uLnNldE1vZGUoJ2FjZS9tb2RlL2phdmFzY3JpcHQnKTtcbiAgZWRpdG9yLiRibG9ja1Njcm9sbGluZyA9IEluZmluaXR5O1xuXG4gIHJldHVybiBlZGl0b3I7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZXhlY3V0ZSA9ICh0cmFjZXJNYW5hZ2VyLCBjb2RlKSA9PiB7XG4gIC8vIGFsbCBtb2R1bGVzIGF2YWlsYWJsZSB0byBldmFsIGFyZSBvYnRhaW5lZCBmcm9tIHdpbmRvd1xuICB0cnkge1xuICAgIHRyYWNlck1hbmFnZXIuZGVhbGxvY2F0ZUFsbCgpO1xuICAgIGV2YWwoY29kZSk7XG4gICAgdHJhY2VyTWFuYWdlci52aXN1YWxpemUoKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIGVycjtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cmFjZXJNYW5hZ2VyLnJlbW92ZVVuYWxsb2NhdGVkKCk7XG4gIH1cbn07XG5cbmNvbnN0IGV4ZWN1dGVEYXRhID0gKHRyYWNlck1hbmFnZXIsIGFsZ29EYXRhKSA9PiB7XG4gIHJldHVybiBleGVjdXRlKHRyYWNlck1hbmFnZXIsIGFsZ29EYXRhKTtcbn07XG5cbmNvbnN0IGV4ZWN1dGVEYXRhQW5kQ29kZSA9ICh0cmFjZXJNYW5hZ2VyLCBhbGdvRGF0YSwgYWxnb0NvZGUpID0+IHtcbiAgcmV0dXJuIGV4ZWN1dGUodHJhY2VyTWFuYWdlciwgYCR7YWxnb0RhdGF9OyR7YWxnb0NvZGV9YCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZXhlY3V0ZURhdGEsXG4gIGV4ZWN1dGVEYXRhQW5kQ29kZVxufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuY29uc3QgY3JlYXRlRWRpdG9yID0gcmVxdWlyZSgnLi9jcmVhdGUnKTtcbmNvbnN0IEV4ZWN1dG9yID0gcmVxdWlyZSgnLi9leGVjdXRvcicpO1xuXG5mdW5jdGlvbiBFZGl0b3IodHJhY2VyTWFuYWdlcikge1xuICBpZiAoIXRyYWNlck1hbmFnZXIpIHtcbiAgICB0aHJvdyAnQ2Fubm90IGNyZWF0ZSBFZGl0b3IuIE1pc3NpbmcgdGhlIHRyYWNlck1hbmFnZXInO1xuICB9XG5cbiAgYWNlLnJlcXVpcmUoJ2FjZS9leHQvbGFuZ3VhZ2VfdG9vbHMnKTtcblxuICB0aGlzLmRhdGFFZGl0b3IgPSBjcmVhdGVFZGl0b3IoJ2RhdGEnKTtcbiAgdGhpcy5jb2RlRWRpdG9yID0gY3JlYXRlRWRpdG9yKCdjb2RlJyk7XG5cbiAgLy8gU2V0dGluZyBkYXRhXG5cbiAgdGhpcy5zZXREYXRhID0gKGRhdGEpID0+IHtcbiAgICB0aGlzLmRhdGFFZGl0b3Iuc2V0VmFsdWUoZGF0YSwgLTEpO1xuICB9O1xuXG4gIHRoaXMuc2V0Q29kZSA9IChjb2RlKSA9PiB7XG4gICAgdGhpcy5jb2RlRWRpdG9yLnNldFZhbHVlKGNvZGUsIC0xKTtcbiAgfTtcblxuICB0aGlzLnNldENvbnRlbnQgPSAoKHtcbiAgICBkYXRhLFxuICAgIGNvZGVcbiAgfSkgPT4ge1xuICAgIHRoaXMuc2V0RGF0YShkYXRhKTtcbiAgICB0aGlzLnNldENvZGUoY29kZSk7XG4gIH0pO1xuXG4gIC8vIENsZWFyaW5nIGRhdGFcblxuICB0aGlzLmNsZWFyRGF0YSA9ICgpID0+IHtcbiAgICB0aGlzLmRhdGFFZGl0b3Iuc2V0VmFsdWUoJycpO1xuICB9O1xuXG4gIHRoaXMuY2xlYXJDb2RlID0gKCkgPT4ge1xuICAgIHRoaXMuY29kZUVkaXRvci5zZXRWYWx1ZSgnJyk7XG4gIH07XG5cbiAgdGhpcy5jbGVhckNvbnRlbnQgPSAoKSA9PiB7XG4gICAgdGhpcy5jbGVhckRhdGEoKTtcbiAgICB0aGlzLmNsZWFyQ29kZSgpO1xuICB9O1xuXG4gIHRoaXMuZXhlY3V0ZSA9ICgpID0+IHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5kYXRhRWRpdG9yLmdldFZhbHVlKCk7XG4gICAgY29uc3QgY29kZSA9IHRoaXMuY29kZUVkaXRvci5nZXRWYWx1ZSgpO1xuICAgIHJldHVybiBFeGVjdXRvci5leGVjdXRlRGF0YUFuZENvZGUodHJhY2VyTWFuYWdlciwgZGF0YSwgY29kZSk7XG4gIH07XG5cbiAgLy8gbGlzdGVuZXJzXG5cbiAgdGhpcy5kYXRhRWRpdG9yLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZGF0YUVkaXRvci5nZXRWYWx1ZSgpO1xuICAgIGNvbnN0IGxhc3RGaWxlVXNlZCA9IGFwcC5nZXRMYXN0RmlsZVVzZWQoKTtcbiAgICBpZiAobGFzdEZpbGVVc2VkKSB7XG4gICAgICBhcHAudXBkYXRlQ2FjaGVkRmlsZShsYXN0RmlsZVVzZWQsIHtcbiAgICAgICAgZGF0YVxuICAgICAgfSk7XG4gICAgfVxuICAgIEV4ZWN1dG9yLmV4ZWN1dGVEYXRhKHRyYWNlck1hbmFnZXIsIGRhdGEpO1xuICB9KTtcblxuICB0aGlzLmNvZGVFZGl0b3Iub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICBjb25zdCBjb2RlID0gdGhpcy5jb2RlRWRpdG9yLmdldFZhbHVlKCk7XG4gICAgY29uc3QgbGFzdEZpbGVVc2VkID0gYXBwLmdldExhc3RGaWxlVXNlZCgpO1xuICAgIGlmIChsYXN0RmlsZVVzZWQpIHtcbiAgICAgIGFwcC51cGRhdGVDYWNoZWRGaWxlKGxhc3RGaWxlVXNlZCwge1xuICAgICAgICBjb2RlXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFZGl0b3I7IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBSU1ZQID0gcmVxdWlyZSgncnN2cCcpO1xuY29uc3QgYXBwSW5zdGFuY2UgPSByZXF1aXJlKCcuL2FwcCcpO1xuY29uc3QgQXBwQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL2FwcC9jb25zdHJ1Y3RvcicpO1xuY29uc3QgRE9NID0gcmVxdWlyZSgnLi9kb20nKTtcbmNvbnN0IFNlcnZlciA9IHJlcXVpcmUoJy4vc2VydmVyJyk7XG5cbmNvbnN0IG1vZHVsZXMgPSByZXF1aXJlKCcuL21vZHVsZScpO1xuXG5jb25zdCB7XG4gIGV4dGVuZFxufSA9ICQ7XG5cbiQuYWpheFNldHVwKHtcbiAgY2FjaGU6IGZhbHNlLFxuICBkYXRhVHlwZTogJ3RleHQnXG59KTtcblxuY29uc3Qge1xuICBpc1NjcmF0Y2hQYXBlclxufSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuY29uc3Qge1xuICBnZXRQYXRoXG59ID0gcmVxdWlyZSgnLi9zZXJ2ZXIvaGVscGVycycpO1xuXG4vLyBzZXQgZ2xvYmFsIHByb21pc2UgZXJyb3IgaGFuZGxlclxuUlNWUC5vbignZXJyb3InLCBmdW5jdGlvbiAocmVhc29uKSB7XG4gIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCByZWFzb24pO1xufSk7XG5cbiQoKCkgPT4ge1xuXG4gIC8vIGluaXRpYWxpemUgdGhlIGFwcGxpY2F0aW9uIGFuZCBhdHRhY2ggaW4gdG8gdGhlIGluc3RhbmNlIG1vZHVsZVxuICBjb25zdCBhcHAgPSBuZXcgQXBwQ29uc3RydWN0b3IoKTtcbiAgZXh0ZW5kKHRydWUsIGFwcEluc3RhbmNlLCBhcHApO1xuXG4gIC8vIGxvYWQgbW9kdWxlcyB0byB0aGUgZ2xvYmFsIHNjb3BlIHNvIHRoZXkgY2FuIGJlIGV2YWxlZFxuICBleHRlbmQodHJ1ZSwgd2luZG93LCBtb2R1bGVzKTtcblxuICBTZXJ2ZXIubG9hZENhdGVnb3JpZXMoKS50aGVuKChkYXRhKSA9PiB7XG4gICAgYXBwSW5zdGFuY2Uuc2V0Q2F0ZWdvcmllcyhkYXRhKTtcbiAgICBET00uYWRkQ2F0ZWdvcmllcygpO1xuXG4gICAgLy8gZGV0ZXJtaW5lIGlmIHRoZSBhcHAgaXMgbG9hZGluZyBhIHByZS1leGlzdGluZyBzY3JhdGNoLXBhZFxuICAgIC8vIG9yIHRoZSBob21lIHBhZ2VcbiAgICBjb25zdCB7XG4gICAgICBjYXRlZ29yeSxcbiAgICAgIGFsZ29yaXRobSxcbiAgICAgIGZpbGVcbiAgICB9ID0gZ2V0UGF0aCgpO1xuICAgIGlmIChpc1NjcmF0Y2hQYXBlcihjYXRlZ29yeSkpIHtcbiAgICAgIGlmIChhbGdvcml0aG0pIHtcbiAgICAgICAgU2VydmVyLmxvYWRTY3JhdGNoUGFwZXIoYWxnb3JpdGhtKS50aGVuKCh7Y2F0ZWdvcnksIGFsZ29yaXRobSwgZGF0YX0pID0+IHtcbiAgICAgICAgICBET00uc2hvd0FsZ29yaXRobShjYXRlZ29yeSwgYWxnb3JpdGhtLCBkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTZXJ2ZXIubG9hZEFsZ29yaXRobShjYXRlZ29yeSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIERPTS5zaG93QWxnb3JpdGhtKGNhdGVnb3J5LCBudWxsLCBkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjYXRlZ29yeSAmJiBhbGdvcml0aG0pIHtcbiAgICAgIERPTS5zaG93UmVxdWVzdGVkQWxnb3JpdGhtKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBET00uc2hvd0ZpcnN0QWxnb3JpdGhtKCk7XG4gICAgfVxuXG4gIH0pO1xufSk7IiwiY29uc3Qge1xuICAgIEFycmF5MkQsXG4gICAgQXJyYXkyRFRyYWNlclxufSA9IHJlcXVpcmUoJy4vYXJyYXkyZCcpO1xuXG5mdW5jdGlvbiBBcnJheTFEVHJhY2VyKCkge1xuICAgIHJldHVybiBBcnJheTJEVHJhY2VyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbkFycmF5MURUcmFjZXIucHJvdG90eXBlID0gJC5leHRlbmQodHJ1ZSwgT2JqZWN0LmNyZWF0ZShBcnJheTJEVHJhY2VyLnByb3RvdHlwZSksIHtcbiAgICBjb25zdHJ1Y3RvcjogQXJyYXkxRFRyYWNlcixcbiAgICBfbm90aWZ5OiBmdW5jdGlvbihpZHgsIHYpIHtcbiAgICAgICAgQXJyYXkyRFRyYWNlci5wcm90b3R5cGUuX25vdGlmeS5jYWxsKHRoaXMsIDAsIGlkeCwgdik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX2Rlbm90aWZ5OiBmdW5jdGlvbihpZHgpIHtcbiAgICAgICAgQXJyYXkyRFRyYWNlci5wcm90b3R5cGUuX2Rlbm90aWZ5LmNhbGwodGhpcywgMCwgaWR4KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfc2VsZWN0OiBmdW5jdGlvbihzLCBlKSB7XG4gICAgICAgIGlmIChlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIEFycmF5MkRUcmFjZXIucHJvdG90eXBlLl9zZWxlY3QuY2FsbCh0aGlzLCAwLCBzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEFycmF5MkRUcmFjZXIucHJvdG90eXBlLl9zZWxlY3RSb3cuY2FsbCh0aGlzLCAwLCBzLCBlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9kZXNlbGVjdDogZnVuY3Rpb24ocywgZSkge1xuICAgICAgICBpZiAoZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBBcnJheTJEVHJhY2VyLnByb3RvdHlwZS5fZGVzZWxlY3QuY2FsbCh0aGlzLCAwLCBzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEFycmF5MkRUcmFjZXIucHJvdG90eXBlLl9kZXNlbGVjdFJvdy5jYWxsKHRoaXMsIDAsIHMsIGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0RGF0YTogZnVuY3Rpb24oRCkge1xuICAgICAgICByZXR1cm4gQXJyYXkyRFRyYWNlci5wcm90b3R5cGUuc2V0RGF0YS5jYWxsKHRoaXMsIFtEXSk7XG4gICAgfVxufSk7XG5cbnZhciBBcnJheTFEID0ge1xuICAgIHJhbmRvbTogZnVuY3Rpb24oTiwgbWluLCBtYXgpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5MkQucmFuZG9tKDEsIE4sIG1pbiwgbWF4KVswXTtcbiAgICB9LFxuICAgIHJhbmRvbVNvcnRlZDogZnVuY3Rpb24oTiwgbWluLCBtYXgpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5MkQucmFuZG9tU29ydGVkKDEsIE4sIG1pbiwgbWF4KVswXTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBBcnJheTFELFxuICAgIEFycmF5MURUcmFjZXJcbn07IiwiY29uc3QgVHJhY2VyID0gcmVxdWlyZSgnLi90cmFjZXInKTtcbmNvbnN0IHtcbiAgICByZWZpbmVCeVR5cGVcbn0gPSByZXF1aXJlKCcuLi90cmFjZXJfbWFuYWdlci91dGlsJyk7XG5cbmZ1bmN0aW9uIEFycmF5MkRUcmFjZXIoKSB7XG4gICAgaWYgKFRyYWNlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSB7XG4gICAgICAgIEFycmF5MkRUcmFjZXIucHJvdG90eXBlLmluaXQuY2FsbCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuQXJyYXkyRFRyYWNlci5wcm90b3R5cGUgPSAkLmV4dGVuZCh0cnVlLCBPYmplY3QuY3JlYXRlKFRyYWNlci5wcm90b3R5cGUpLCB7XG4gICAgY29uc3RydWN0b3I6IEFycmF5MkRUcmFjZXIsXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJHRhYmxlID0gdGhpcy5jYXBzdWxlLiR0YWJsZSA9ICQoJzxkaXYgY2xhc3M9XCJtdGJsLXRhYmxlXCI+Jyk7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5hcHBlbmQodGhpcy4kdGFibGUpO1xuICAgIH0sXG4gICAgX25vdGlmeTogZnVuY3Rpb24oeCwgeSwgdikge1xuICAgICAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICAgICAgICB0eXBlOiAnbm90aWZ5JyxcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5LFxuICAgICAgICAgICAgdjogdlxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfZGVub3RpZnk6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgICAgICAgdHlwZTogJ2Rlbm90aWZ5JyxcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9zZWxlY3Q6IGZ1bmN0aW9uKHN4LCBzeSwgZXgsIGV5KSB7XG4gICAgICAgIHRoaXMucHVzaFNlbGVjdGluZ1N0ZXAoJ3NlbGVjdCcsIG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX3NlbGVjdFJvdzogZnVuY3Rpb24oeCwgc3ksIGV5KSB7XG4gICAgICAgIHRoaXMucHVzaFNlbGVjdGluZ1N0ZXAoJ3NlbGVjdCcsICdyb3cnLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9zZWxlY3RDb2w6IGZ1bmN0aW9uKHksIHN4LCBleCkge1xuICAgICAgICB0aGlzLnB1c2hTZWxlY3RpbmdTdGVwKCdzZWxlY3QnLCAnY29sJywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfZGVzZWxlY3Q6IGZ1bmN0aW9uKHN4LCBzeSwgZXgsIGV5KSB7XG4gICAgICAgIHRoaXMucHVzaFNlbGVjdGluZ1N0ZXAoJ2Rlc2VsZWN0JywgbnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfZGVzZWxlY3RSb3c6IGZ1bmN0aW9uKHgsIHN5LCBleSkge1xuICAgICAgICB0aGlzLnB1c2hTZWxlY3RpbmdTdGVwKCdkZXNlbGVjdCcsICdyb3cnLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9kZXNlbGVjdENvbDogZnVuY3Rpb24oeSwgc3gsIGV4KSB7XG4gICAgICAgIHRoaXMucHVzaFNlbGVjdGluZ1N0ZXAoJ2Rlc2VsZWN0JywgJ2NvbCcsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX3NlcGFyYXRlOiBmdW5jdGlvbih4LCB5KSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICdzZXBhcmF0ZScsXG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfc2VwYXJhdGVSb3c6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgdGhpcy5fc2VwYXJhdGUoeCwgLTEpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9zZXBhcmF0ZUNvbDogZnVuY3Rpb24oeSkge1xuICAgICAgICB0aGlzLl9zZXBhcmF0ZSgtMSwgeSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX2Rlc2VwYXJhdGU6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgICAgICAgdHlwZTogJ2Rlc2VwYXJhdGUnLFxuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHlcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX2Rlc2VwYXJhdGVSb3c6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgdGhpcy5fZGVzZXBhcmF0ZSh4LCAtMSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX2Rlc2VwYXJhdGVDb2w6IGZ1bmN0aW9uKHkpIHtcbiAgICAgICAgdGhpcy5fZGVzZXBhcmF0ZSgtMSwgeSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgcHVzaFNlbGVjdGluZ1N0ZXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIHZhciB0eXBlID0gYXJncy5zaGlmdCgpO1xuICAgICAgICB2YXIgbW9kZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3Muc2hpZnQoKSk7XG4gICAgICAgIHZhciBjb29yZDtcbiAgICAgICAgc3dpdGNoIChtb2RlKSB7XG4gICAgICAgICAgICBjYXNlICdyb3cnOlxuICAgICAgICAgICAgICAgIGNvb3JkID0ge1xuICAgICAgICAgICAgICAgICAgICB4OiBhcmdzWzBdLFxuICAgICAgICAgICAgICAgICAgICBzeTogYXJnc1sxXSxcbiAgICAgICAgICAgICAgICAgICAgZXk6IGFyZ3NbMl1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY29sJzpcbiAgICAgICAgICAgICAgICBjb29yZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgeTogYXJnc1swXSxcbiAgICAgICAgICAgICAgICAgICAgc3g6IGFyZ3NbMV0sXG4gICAgICAgICAgICAgICAgICAgIGV4OiBhcmdzWzJdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3NbMl0gPT09IHVuZGVmaW5lZCAmJiBhcmdzWzNdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29vcmQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4OiBhcmdzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogYXJnc1sxXVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvb3JkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3g6IGFyZ3NbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzeTogYXJnc1sxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4OiBhcmdzWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXk6IGFyZ3NbM11cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0ZXAgPSB7XG4gICAgICAgICAgICB0eXBlOiB0eXBlXG4gICAgICAgIH07XG4gICAgICAgICQuZXh0ZW5kKHN0ZXAsIGNvb3JkKTtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwgc3RlcCk7XG4gICAgfSxcbiAgICBwcm9jZXNzU3RlcDogZnVuY3Rpb24oc3RlcCwgb3B0aW9ucykge1xuICAgICAgICBzd2l0Y2ggKHN0ZXAudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnbm90aWZ5JzpcbiAgICAgICAgICAgICAgICBpZiAoc3RlcC52ID09PSAwIHx8IHN0ZXAudikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJHJvdyA9IHRoaXMuJHRhYmxlLmZpbmQoJy5tdGJsLXJvdycpLmVxKHN0ZXAueCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkY29sID0gJHJvdy5maW5kKCcubXRibC1jb2wnKS5lcShzdGVwLnkpO1xuICAgICAgICAgICAgICAgICAgICAkY29sLnRleHQocmVmaW5lQnlUeXBlKHN0ZXAudikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ2Rlbm90aWZ5JzpcbiAgICAgICAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgICAgICBjYXNlICdkZXNlbGVjdCc6XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yQ2xhc3MgPSBzdGVwLnR5cGUgPT0gJ3NlbGVjdCcgfHwgc3RlcC50eXBlID09ICdkZXNlbGVjdCcgPyB0aGlzLmNvbG9yQ2xhc3Muc2VsZWN0ZWQgOiB0aGlzLmNvbG9yQ2xhc3Mubm90aWZpZWQ7XG4gICAgICAgICAgICAgICAgdmFyIGFkZENsYXNzID0gc3RlcC50eXBlID09ICdzZWxlY3QnIHx8IHN0ZXAudHlwZSA9PSAnbm90aWZ5JztcbiAgICAgICAgICAgICAgICB2YXIgc3ggPSBzdGVwLnN4O1xuICAgICAgICAgICAgICAgIHZhciBzeSA9IHN0ZXAuc3k7XG4gICAgICAgICAgICAgICAgdmFyIGV4ID0gc3RlcC5leDtcbiAgICAgICAgICAgICAgICB2YXIgZXkgPSBzdGVwLmV5O1xuICAgICAgICAgICAgICAgIGlmIChzeCA9PT0gdW5kZWZpbmVkKSBzeCA9IHN0ZXAueDtcbiAgICAgICAgICAgICAgICBpZiAoc3kgPT09IHVuZGVmaW5lZCkgc3kgPSBzdGVwLnk7XG4gICAgICAgICAgICAgICAgaWYgKGV4ID09PSB1bmRlZmluZWQpIGV4ID0gc3RlcC54O1xuICAgICAgICAgICAgICAgIGlmIChleSA9PT0gdW5kZWZpbmVkKSBleSA9IHN0ZXAueTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhaW50Q29sb3Ioc3gsIHN5LCBleCwgZXksIGNvbG9yQ2xhc3MsIGFkZENsYXNzKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3NlcGFyYXRlJzpcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2VwYXJhdGUoc3RlcC54LCBzdGVwLnkpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VwYXJhdGUoc3RlcC54LCBzdGVwLnkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGVzZXBhcmF0ZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5kZXNlcGFyYXRlKHN0ZXAueCwgc3RlcC55KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5wcm9jZXNzU3RlcC5jYWxsKHRoaXMsIHN0ZXAsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXREYXRhOiBmdW5jdGlvbihEKSB7XG4gICAgICAgIHRoaXMudmlld1ggPSB0aGlzLnZpZXdZID0gMDtcbiAgICAgICAgdGhpcy5wYWRkaW5nSCA9IDY7XG4gICAgICAgIHRoaXMucGFkZGluZ1YgPSAzO1xuICAgICAgICB0aGlzLmZvbnRTaXplID0gMTY7XG5cbiAgICAgICAgaWYgKFRyYWNlci5wcm90b3R5cGUuc2V0RGF0YS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSB7XG4gICAgICAgICAgICB0aGlzLiR0YWJsZS5maW5kKCcubXRibC1yb3cnKS5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5tdGJsLWNvbCcpLmVhY2goZnVuY3Rpb24oaikge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnRleHQocmVmaW5lQnlUeXBlKERbaV1bal0pKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiR0YWJsZS5lbXB0eSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciAkcm93ID0gJCgnPGRpdiBjbGFzcz1cIm10Ymwtcm93XCI+Jyk7XG4gICAgICAgICAgICB0aGlzLiR0YWJsZS5hcHBlbmQoJHJvdyk7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IERbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgJGNvbCA9ICQoJzxkaXYgY2xhc3M9XCJtdGJsLWNvbFwiPicpXG4gICAgICAgICAgICAgICAgICAgIC5jc3ModGhpcy5nZXRDZWxsQ3NzKCkpXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0KHJlZmluZUJ5VHlwZShEW2ldW2pdKSk7XG4gICAgICAgICAgICAgICAgJHJvdy5hcHBlbmQoJGNvbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXNpemUoKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICByZXNpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBUcmFjZXIucHJvdG90eXBlLnJlc2l6ZS5jYWxsKHRoaXMpO1xuXG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgIH0sXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBUcmFjZXIucHJvdG90eXBlLmNsZWFyLmNhbGwodGhpcyk7XG5cbiAgICAgICAgdGhpcy5jbGVhckNvbG9yKCk7XG4gICAgICAgIHRoaXMuZGVzZXBhcmF0ZUFsbCgpO1xuICAgIH0sXG4gICAgZ2V0Q2VsbENzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYWRkaW5nOiB0aGlzLnBhZGRpbmdWLnRvRml4ZWQoMSkgKyAncHggJyArIHRoaXMucGFkZGluZ0gudG9GaXhlZCgxKSArICdweCcsXG4gICAgICAgICAgICAnZm9udC1zaXplJzogdGhpcy5mb250U2l6ZS50b0ZpeGVkKDEpICsgJ3B4J1xuICAgICAgICB9O1xuICAgIH0sXG4gICAgcmVmcmVzaDogZnVuY3Rpb24oKSB7XG4gICAgICAgIFRyYWNlci5wcm90b3R5cGUucmVmcmVzaC5jYWxsKHRoaXMpO1xuXG4gICAgICAgIHZhciAkcGFyZW50ID0gdGhpcy4kdGFibGUucGFyZW50KCk7XG4gICAgICAgIHZhciB0b3AgPSAkcGFyZW50LmhlaWdodCgpIC8gMiAtIHRoaXMuJHRhYmxlLmhlaWdodCgpIC8gMiArIHRoaXMudmlld1k7XG4gICAgICAgIHZhciBsZWZ0ID0gJHBhcmVudC53aWR0aCgpIC8gMiAtIHRoaXMuJHRhYmxlLndpZHRoKCkgLyAyICsgdGhpcy52aWV3WDtcbiAgICAgICAgdGhpcy4kdGFibGUuY3NzKCdtYXJnaW4tdG9wJywgdG9wKTtcbiAgICAgICAgdGhpcy4kdGFibGUuY3NzKCdtYXJnaW4tbGVmdCcsIGxlZnQpO1xuICAgIH0sXG4gICAgbW91c2Vkb3duOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIFRyYWNlci5wcm90b3R5cGUubW91c2Vkb3duLmNhbGwodGhpcywgZSk7XG5cbiAgICAgICAgdGhpcy5kcmFnWCA9IGUucGFnZVg7XG4gICAgICAgIHRoaXMuZHJhZ1kgPSBlLnBhZ2VZO1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcbiAgICB9LFxuICAgIG1vdXNlbW92ZTogZnVuY3Rpb24oZSkge1xuICAgICAgICBUcmFjZXIucHJvdG90eXBlLm1vdXNlbW92ZS5jYWxsKHRoaXMsIGUpO1xuXG4gICAgICAgIGlmICh0aGlzLmRyYWdnaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXdYICs9IGUucGFnZVggLSB0aGlzLmRyYWdYO1xuICAgICAgICAgICAgdGhpcy52aWV3WSArPSBlLnBhZ2VZIC0gdGhpcy5kcmFnWTtcbiAgICAgICAgICAgIHRoaXMuZHJhZ1ggPSBlLnBhZ2VYO1xuICAgICAgICAgICAgdGhpcy5kcmFnWSA9IGUucGFnZVk7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbW91c2V1cDogZnVuY3Rpb24oZSkge1xuICAgICAgICBUcmFjZXIucHJvdG90eXBlLm1vdXNldXAuY2FsbCh0aGlzLCBlKTtcblxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG4gICAgfSxcbiAgICBtb3VzZXdoZWVsOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIFRyYWNlci5wcm90b3R5cGUubW91c2V3aGVlbC5jYWxsKHRoaXMsIGUpO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZSA9IGUub3JpZ2luYWxFdmVudDtcbiAgICAgICAgdmFyIGRlbHRhID0gKGUud2hlZWxEZWx0YSAhPT0gdW5kZWZpbmVkICYmIGUud2hlZWxEZWx0YSkgfHxcbiAgICAgICAgICAgIChlLmRldGFpbCAhPT0gdW5kZWZpbmVkICYmIC1lLmRldGFpbCk7XG4gICAgICAgIHZhciB3ZWlnaHQgPSAxLjAxO1xuICAgICAgICB2YXIgcmF0aW8gPSBkZWx0YSA+IDAgPyAxIC8gd2VpZ2h0IDogd2VpZ2h0O1xuICAgICAgICBpZiAodGhpcy5mb250U2l6ZSA8IDQgJiYgcmF0aW8gPCAxKSByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLmZvbnRTaXplID4gNDAgJiYgcmF0aW8gPiAxKSByZXR1cm47XG4gICAgICAgIHRoaXMucGFkZGluZ1YgKj0gcmF0aW87XG4gICAgICAgIHRoaXMucGFkZGluZ0ggKj0gcmF0aW87XG4gICAgICAgIHRoaXMuZm9udFNpemUgKj0gcmF0aW87XG4gICAgICAgIHRoaXMuJHRhYmxlLmZpbmQoJy5tdGJsLWNvbCcpLmNzcyh0aGlzLmdldENlbGxDc3MoKSk7XG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgIH0sXG4gICAgcGFpbnRDb2xvcjogZnVuY3Rpb24oc3gsIHN5LCBleCwgZXksIGNvbG9yQ2xhc3MsIGFkZENsYXNzKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSBzeDsgaSA8PSBleDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgJHJvdyA9IHRoaXMuJHRhYmxlLmZpbmQoJy5tdGJsLXJvdycpLmVxKGkpO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IHN5OyBqIDw9IGV5OyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgJGNvbCA9ICRyb3cuZmluZCgnLm10YmwtY29sJykuZXEoaik7XG4gICAgICAgICAgICAgICAgaWYgKGFkZENsYXNzKSAkY29sLmFkZENsYXNzKGNvbG9yQ2xhc3MpO1xuICAgICAgICAgICAgICAgIGVsc2UgJGNvbC5yZW1vdmVDbGFzcyhjb2xvckNsYXNzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgY2xlYXJDb2xvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJHRhYmxlLmZpbmQoJy5tdGJsLWNvbCcpLnJlbW92ZUNsYXNzKE9iamVjdC5rZXlzKHRoaXMuY29sb3JDbGFzcykuam9pbignICcpKTtcbiAgICB9LFxuICAgIGNvbG9yQ2xhc3M6IHtcbiAgICAgICAgc2VsZWN0ZWQ6ICdzZWxlY3RlZCcsXG4gICAgICAgIG5vdGlmaWVkOiAnbm90aWZpZWQnXG4gICAgfSxcbiAgICBzZXBhcmF0ZTogZnVuY3Rpb24oeCwgeSkge1xuICAgICAgICB0aGlzLiR0YWJsZS5maW5kKCcubXRibC1yb3cnKS5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgIHZhciAkcm93ID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGlmIChpID09IHgpIHtcbiAgICAgICAgICAgICAgICAkcm93LmFmdGVyKCQoJzxkaXYgY2xhc3M9XCJtdGJsLWVtcHR5LXJvd1wiPicpLmF0dHIoJ2RhdGEtcm93JywgaSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkcm93LmZpbmQoJy5tdGJsLWNvbCcpLmVhY2goZnVuY3Rpb24oaikge1xuICAgICAgICAgICAgICAgIHZhciAkY29sID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICBpZiAoaiA9PSB5KSB7XG4gICAgICAgICAgICAgICAgICAgICRjb2wuYWZ0ZXIoJCgnPGRpdiBjbGFzcz1cIm10YmwtZW1wdHktY29sXCI+JykuYXR0cignZGF0YS1jb2wnLCBqKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZGVzZXBhcmF0ZTogZnVuY3Rpb24oeCwgeSkge1xuICAgICAgICB0aGlzLiR0YWJsZS5maW5kKCdbZGF0YS1yb3c9JyArIHggKyAnXScpLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLiR0YWJsZS5maW5kKCdbZGF0YS1jb2w9JyArIHkgKyAnXScpLnJlbW92ZSgpO1xuICAgIH0sXG4gICAgZGVzZXBhcmF0ZUFsbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJHRhYmxlLmZpbmQoJy5tdGJsLWVtcHR5LXJvdywgLm10YmwtZW1wdHktY29sJykucmVtb3ZlKCk7XG4gICAgfVxufSk7XG5cbnZhciBBcnJheTJEID0ge1xuICAgIHJhbmRvbTogZnVuY3Rpb24oTiwgTSwgbWluLCBtYXgpIHtcbiAgICAgICAgaWYgKCFOKSBOID0gMTA7XG4gICAgICAgIGlmICghTSkgTSA9IDEwO1xuICAgICAgICBpZiAobWluID09PSB1bmRlZmluZWQpIG1pbiA9IDE7XG4gICAgICAgIGlmIChtYXggPT09IHVuZGVmaW5lZCkgbWF4ID0gOTtcbiAgICAgICAgdmFyIEQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIHtcbiAgICAgICAgICAgIEQucHVzaChbXSk7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE07IGorKykge1xuICAgICAgICAgICAgICAgIERbaV0ucHVzaCgoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSB8IDApICsgbWluKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRDtcbiAgICB9LFxuICAgIHJhbmRvbVNvcnRlZDogZnVuY3Rpb24oTiwgTSwgbWluLCBtYXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmFuZG9tKE4sIE0sIG1pbiwgbWF4KS5tYXAoZnVuY3Rpb24oYXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBBcnJheTJELFxuICAgIEFycmF5MkRUcmFjZXJcbn07IiwiY29uc3QgVHJhY2VyID0gcmVxdWlyZSgnLi90cmFjZXInKTtcblxuZnVuY3Rpb24gQ2hhcnRUcmFjZXIoKSB7XG4gICAgaWYgKFRyYWNlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSB7XG4gICAgICAgIENoYXJ0VHJhY2VyLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuQ2hhcnRUcmFjZXIucHJvdG90eXBlID0gJC5leHRlbmQodHJ1ZSwgT2JqZWN0LmNyZWF0ZShUcmFjZXIucHJvdG90eXBlKSwge1xuICAgIGNvbnN0cnVjdG9yOiBDaGFydFRyYWNlcixcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy4kd3JhcHBlciA9IHRoaXMuY2Fwc3VsZS4kd3JhcHBlciA9ICQoJzxjYW52YXMgaWQ9XCJjaGFydFwiPicpO1xuICAgICAgICB0aGlzLiRjb250YWluZXIuYXBwZW5kKHRoaXMuJHdyYXBwZXIpO1xuICAgIH0sXG4gICAgc2V0RGF0YTogZnVuY3Rpb24oQykge1xuICAgICAgICBpZiAoVHJhY2VyLnByb3RvdHlwZS5zZXREYXRhLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHJldHVybiB0cnVlO1xuICAgICAgICB2YXIgdHJhY2VyID0gdGhpcztcbiAgICAgICAgdmFyIGNvbG9yID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgQy5sZW5ndGg7IGkrKykgY29sb3IucHVzaCgncmdiYSgxMzYsIDEzNiwgMTM2LCAxKScpO1xuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdiYXInLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGxhYmVsczogQy5tYXAoU3RyaW5nKSxcbiAgICAgICAgICAgICAgICBkYXRhc2V0czogW3tcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjb2xvcixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogQ1xuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHNjYWxlczoge1xuICAgICAgICAgICAgICAgICAgICB5QXhlczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2tzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVnaW5BdFplcm86IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2hhcnQgPSB0aGlzLmNhcHN1bGUuY2hhcnQgPSBuZXcgQ2hhcnQodGhpcy4kd3JhcHBlciwgZGF0YSk7XG4gICAgfSxcbiAgICBfbm90aWZ5OiBmdW5jdGlvbihzLCB2KSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICdub3RpZnknLFxuICAgICAgICAgICAgczogcyxcbiAgICAgICAgICAgIHY6IHZcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX2Rlbm90aWZ5OiBmdW5jdGlvbihzKSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICdkZW5vdGlmeScsXG4gICAgICAgICAgICBzOiBzXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9zZWxlY3Q6IGZ1bmN0aW9uKHMsIGUpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgICAgICAgdHlwZTogJ3NlbGVjdCcsXG4gICAgICAgICAgICBzOiBzLFxuICAgICAgICAgICAgZTogZVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfZGVzZWxlY3Q6IGZ1bmN0aW9uKHMsIGUpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgICAgICAgdHlwZTogJ2Rlc2VsZWN0JyxcbiAgICAgICAgICAgIHM6IHMsXG4gICAgICAgICAgICBlOiBlXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHByb2Nlc3NTdGVwOiBmdW5jdGlvbihzdGVwLCBvcHRpb25zKSB7XG4gICAgICAgIHN3aXRjaCAoc3RlcC50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdub3RpZnknOlxuICAgICAgICAgICAgICAgIGlmIChzdGVwLnYpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFydC5jb25maWcuZGF0YS5kYXRhc2V0c1swXS5kYXRhW3N0ZXAuc10gPSBzdGVwLnY7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcnQuY29uZmlnLmRhdGEubGFiZWxzW3N0ZXAuc10gPSBzdGVwLnYudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICdkZW5vdGlmeSc6XG4gICAgICAgICAgICBjYXNlICdkZXNlbGVjdCc6XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gc3RlcC50eXBlID09ICdkZW5vdGlmeScgfHwgc3RlcC50eXBlID09ICdkZXNlbGVjdCcgPyAncmdiYSgxMzYsIDEzNiwgMTM2LCAxKScgOiAncmdiYSgyNTUsIDAsIDAsIDEpJztcbiAgICAgICAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgICAgICAgICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIHZhciBjb2xvciA9ICdyZ2JhKDAsIDAsIDI1NSwgMSknO1xuICAgICAgICAgICAgICAgIGlmIChzdGVwLmUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHN0ZXAuczsgaSA8PSBzdGVwLmU7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcnQuY29uZmlnLmRhdGEuZGF0YXNldHNbMF0uYmFja2dyb3VuZENvbG9yW2ldID0gY29sb3I7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0LmNvbmZpZy5kYXRhLmRhdGFzZXRzWzBdLmJhY2tncm91bmRDb2xvcltzdGVwLnNdID0gY29sb3I7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFydC51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5wcm9jZXNzU3RlcC5jYWxsKHRoaXMsIHN0ZXAsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXJ0VHJhY2VyOyIsImNvbnN0IHtcbiAgICBEaXJlY3RlZEdyYXBoLFxuICAgIERpcmVjdGVkR3JhcGhUcmFjZXJcbn0gPSByZXF1aXJlKCcuL2RpcmVjdGVkX2dyYXBoJyk7XG5cbmZ1bmN0aW9uIENvb3JkaW5hdGVTeXN0ZW1UcmFjZXIoKSB7XG4gICAgaWYgKERpcmVjdGVkR3JhcGhUcmFjZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICBDb29yZGluYXRlU3lzdGVtVHJhY2VyLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbkNvb3JkaW5hdGVTeXN0ZW1UcmFjZXIucHJvdG90eXBlID0gJC5leHRlbmQodHJ1ZSwgT2JqZWN0LmNyZWF0ZShEaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZSksIHtcbiAgICBjb25zdHJ1Y3RvcjogQ29vcmRpbmF0ZVN5c3RlbVRyYWNlcixcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0cmFjZXIgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMucy5zZXR0aW5ncyh7XG4gICAgICAgICAgICBkZWZhdWx0RWRnZVR5cGU6ICdkZWYnLFxuICAgICAgICAgICAgZnVuY0VkZ2VzRGVmOiBmdW5jdGlvbiAoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gdHJhY2VyLmdldENvbG9yKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgdHJhY2VyLmRyYXdFZGdlKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHNldERhdGE6IGZ1bmN0aW9uIChDKSB7XG4gICAgICAgIGlmIChUcmFjZXIucHJvdG90eXBlLnNldERhdGEuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgdGhpcy5ncmFwaC5jbGVhcigpO1xuICAgICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgICAgdmFyIGVkZ2VzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgQy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIG5vZGVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGlkOiB0aGlzLm4oaSksXG4gICAgICAgICAgICAgICAgeDogQ1tpXVswXSxcbiAgICAgICAgICAgICAgICB5OiBDW2ldWzFdLFxuICAgICAgICAgICAgICAgIGxhYmVsOiAnJyArIGkgLFxuICAgICAgICAgICAgICAgIHNpemU6IDEsXG4gICAgICAgICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdFxuICAgICAgICAgICAgfSk7ICAgIFxuICAgICAgICB0aGlzLmdyYXBoLnJlYWQoe1xuICAgICAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICAgICAgZWRnZXM6IGVkZ2VzXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnMuY2FtZXJhLmdvVG8oe1xuICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgICBhbmdsZTogMCxcbiAgICAgICAgICAgIHJhdGlvOiAxXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlZnJlc2goKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICBwcm9jZXNzU3RlcDogZnVuY3Rpb24oc3RlcCwgb3B0aW9ucykge1xuICAgICAgICBzd2l0Y2ggKHN0ZXAudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAndmlzaXQnOlxuICAgICAgICAgICAgY2FzZSAnbGVhdmUnOlxuICAgICAgICAgICAgICAgIHZhciB2aXNpdCA9IHN0ZXAudHlwZSA9PSAndmlzaXQnO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXROb2RlID0gdGhpcy5ncmFwaC5ub2Rlcyh0aGlzLm4oc3RlcC50YXJnZXQpKTtcbiAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSB2aXNpdCA/IHRoaXMuY29sb3IudmlzaXRlZCA6IHRoaXMuY29sb3IubGVmdDtcbiAgICAgICAgICAgICAgICB0YXJnZXROb2RlLmNvbG9yID0gY29sb3I7XG4gICAgICAgICAgICAgICAgaWYgKHN0ZXAuc291cmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVkZ2VJZCA9IHRoaXMuZShzdGVwLnNvdXJjZSwgc3RlcC50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ncmFwaC5lZGdlcyhlZGdlSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWRnZSA9IHRoaXMuZ3JhcGguZWRnZXMoZWRnZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2UuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGguZHJvcEVkZ2UoZWRnZUlkKS5hZGRFZGdlKGVkZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmFwaC5hZGRFZGdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy5lKHN0ZXAudGFyZ2V0LCBzdGVwLnNvdXJjZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLm4oc3RlcC5zb3VyY2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcy5uKHN0ZXAudGFyZ2V0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogMVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubG9nVHJhY2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBzdGVwLnNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZSA9PT0gdW5kZWZpbmVkKSBzb3VyY2UgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dUcmFjZXIucHJpbnQodmlzaXQgPyBzb3VyY2UgKyAnIC0+ICcgKyBzdGVwLnRhcmdldCA6IHNvdXJjZSArICcgPC0gJyArIHN0ZXAudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIFRyYWNlci5wcm90b3R5cGUucHJvY2Vzc1N0ZXAuY2FsbCh0aGlzLCBzdGVwLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZTogZnVuY3Rpb24odjEsIHYyKSB7XG4gICAgICAgIGlmICh2MSA+IHYyKSB7XG4gICAgICAgICAgICB2YXIgdGVtcCA9IHYxO1xuICAgICAgICAgICAgdjEgPSB2MjtcbiAgICAgICAgICAgIHYyID0gdGVtcDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ2UnICsgdjEgKyAnXycgKyB2MjtcbiAgICB9LFxuICAgIGRyYXdPbkhvdmVyOiBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncywgbmV4dCkge1xuICAgICAgICB2YXIgdHJhY2VyID0gdGhpcztcblxuICAgICAgICBjb250ZXh0LnNldExpbmVEYXNoKFs1LCA1XSk7XG4gICAgICAgIHZhciBub2RlSWR4ID0gbm9kZS5pZC5zdWJzdHJpbmcoMSk7XG4gICAgICAgIHRoaXMuZ3JhcGguZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2UpIHtcbiAgICAgICAgICAgIHZhciBlbmRzID0gZWRnZS5pZC5zdWJzdHJpbmcoMSkuc3BsaXQoXCJfXCIpO1xuICAgICAgICAgICAgaWYgKGVuZHNbMF0gPT0gbm9kZUlkeCkge1xuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9ICcjMGZmJztcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gbm9kZTtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gdHJhY2VyLmdyYXBoLm5vZGVzKCduJyArIGVuZHNbMV0pO1xuICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3RWRnZShlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICBpZiAobmV4dCkgbmV4dChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZW5kc1sxXSA9PSBub2RlSWR4KSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gJyMwZmYnO1xuICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSB0cmFjZXIuZ3JhcGgubm9kZXMoJ24nICsgZW5kc1swXSk7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IG5vZGU7XG4gICAgICAgICAgICAgICAgdHJhY2VyLmRyYXdFZGdlKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIGlmIChuZXh0KSBuZXh0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGRyYXdFZGdlOiBmdW5jdGlvbihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJycsXG4gICAgICAgICAgICBzaXplID0gZWRnZVtwcmVmaXggKyAnc2l6ZSddIHx8IDE7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHNpemU7XG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQubW92ZVRvKFxuICAgICAgICAgICAgc291cmNlW3ByZWZpeCArICd4J10sXG4gICAgICAgICAgICBzb3VyY2VbcHJlZml4ICsgJ3knXVxuICAgICAgICApO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhcbiAgICAgICAgICAgIHRhcmdldFtwcmVmaXggKyAneCddLFxuICAgICAgICAgICAgdGFyZ2V0W3ByZWZpeCArICd5J11cbiAgICAgICAgKTtcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICB9XG59KTtcblxudmFyIENvb3JkaW5hdGVTeXN0ZW0gPSB7XG4gICAgcmFuZG9tOiBmdW5jdGlvbiAoTiwgbWluLCBtYXgpIHtcbiAgICAgICAgaWYgKCFOKSBOID0gNztcbiAgICAgICAgaWYgKCFtaW4pIG1pbiA9IDE7XG4gICAgICAgIGlmICghbWF4KSBtYXggPSAxMDtcbiAgICAgICAgdmFyIEMgPSBuZXcgQXJyYXkoTik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSBDW2ldID0gbmV3IEFycmF5KDIpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE47IGkrKylcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgQ1tpXS5sZW5ndGg7IGorKylcbiAgICAgICAgICAgICAgICBDW2ldW2pdID0gKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgfCAwKSArIG1pbjtcbiAgICAgICAgcmV0dXJuIEM7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENvb3JkaW5hdGVTeXN0ZW0sXG4gIENvb3JkaW5hdGVTeXN0ZW1UcmFjZXJcbn07IiwiY29uc3QgVHJhY2VyID0gcmVxdWlyZSgnLi90cmFjZXInKTtcblxuZnVuY3Rpb24gRGlyZWN0ZWRHcmFwaFRyYWNlcigpIHtcbiAgICBpZiAoVHJhY2VyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUuaW5pdC5jYWxsKHRoaXMpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5EaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHRydWUsIE9iamVjdC5jcmVhdGUoVHJhY2VyLnByb3RvdHlwZSksIHtcbiAgICBjb25zdHJ1Y3RvcjogRGlyZWN0ZWRHcmFwaFRyYWNlcixcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHRyYWNlciA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5zID0gdGhpcy5jYXBzdWxlLnMgPSBuZXcgc2lnbWEoe1xuICAgICAgICAgICAgcmVuZGVyZXI6IHtcbiAgICAgICAgICAgICAgICBjb250YWluZXI6IHRoaXMuJGNvbnRhaW5lclswXSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnY2FudmFzJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgbWluQXJyb3dTaXplOiA4LFxuICAgICAgICAgICAgICAgIGRlZmF1bHRFZGdlVHlwZTogJ2Fycm93JyxcbiAgICAgICAgICAgICAgICBtYXhFZGdlU2l6ZTogMi41LFxuICAgICAgICAgICAgICAgIGxhYmVsVGhyZXNob2xkOiA0LFxuICAgICAgICAgICAgICAgIGZvbnQ6ICdSb2JvdG8nLFxuICAgICAgICAgICAgICAgIGRlZmF1bHRMYWJlbENvbG9yOiAnI2ZmZicsXG4gICAgICAgICAgICAgICAgem9vbU1pbjogMC42LFxuICAgICAgICAgICAgICAgIHpvb21NYXg6IDEuMixcbiAgICAgICAgICAgICAgICBza2lwRXJyb3JzOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1pbk5vZGVTaXplOiAuNSxcbiAgICAgICAgICAgICAgICBtYXhOb2RlU2l6ZTogMTIsXG4gICAgICAgICAgICAgICAgbGFiZWxTaXplOiAncHJvcG9ydGlvbmFsJyxcbiAgICAgICAgICAgICAgICBsYWJlbFNpemVSYXRpbzogMS4zLFxuICAgICAgICAgICAgICAgIGZ1bmNMYWJlbHNEZWY6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3TGFiZWwobm9kZSwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY0hvdmVyc0RlZjogZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MsIG5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhY2VyLmRyYXdPbkhvdmVyKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzLCBuZXh0KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmNFZGdlc0Fycm93OiBmdW5jdGlvbihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gdHJhY2VyLmdldENvbG9yKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3QXJyb3coZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc2lnbWEucGx1Z2lucy5kcmFnTm9kZXModGhpcy5zLCB0aGlzLnMucmVuZGVyZXJzWzBdKTtcbiAgICAgICAgdGhpcy5ncmFwaCA9IHRoaXMuY2Fwc3VsZS5ncmFwaCA9IHRoaXMucy5ncmFwaDtcbiAgICB9LFxuICAgIF9zZXRUcmVlRGF0YTogZnVuY3Rpb24oRywgcm9vdCkge1xuICAgICAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICAgICAgICB0eXBlOiAnc2V0VHJlZURhdGEnLFxuICAgICAgICAgICAgYXJndW1lbnRzOiBhcmd1bWVudHNcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX3Zpc2l0OiBmdW5jdGlvbih0YXJnZXQsIHNvdXJjZSkge1xuICAgICAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICAgICAgICB0eXBlOiAndmlzaXQnLFxuICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgICBzb3VyY2U6IHNvdXJjZVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfbGVhdmU6IGZ1bmN0aW9uKHRhcmdldCwgc291cmNlKSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICdsZWF2ZScsXG4gICAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICAgIHNvdXJjZTogc291cmNlXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHByb2Nlc3NTdGVwOiBmdW5jdGlvbihzdGVwLCBvcHRpb25zKSB7XG4gICAgICAgIHN3aXRjaCAoc3RlcC50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdzZXRUcmVlRGF0YSc6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUcmVlRGF0YS5hcHBseSh0aGlzLCBzdGVwLmFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd2aXNpdCc6XG4gICAgICAgICAgICBjYXNlICdsZWF2ZSc6XG4gICAgICAgICAgICAgICAgdmFyIHZpc2l0ID0gc3RlcC50eXBlID09ICd2aXNpdCc7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldE5vZGUgPSB0aGlzLmdyYXBoLm5vZGVzKHRoaXMubihzdGVwLnRhcmdldCkpO1xuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IHZpc2l0ID8gdGhpcy5jb2xvci52aXNpdGVkIDogdGhpcy5jb2xvci5sZWZ0O1xuICAgICAgICAgICAgICAgIHRhcmdldE5vZGUuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgICAgICAgICBpZiAoc3RlcC5zb3VyY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWRnZUlkID0gdGhpcy5lKHN0ZXAuc291cmNlLCBzdGVwLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlZGdlID0gdGhpcy5ncmFwaC5lZGdlcyhlZGdlSWQpO1xuICAgICAgICAgICAgICAgICAgICBlZGdlLmNvbG9yID0gY29sb3I7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGguZHJvcEVkZ2UoZWRnZUlkKS5hZGRFZGdlKGVkZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sb2dUcmFjZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9IHN0ZXAuc291cmNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc291cmNlID09PSB1bmRlZmluZWQpIHNvdXJjZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ1RyYWNlci5wcmludCh2aXNpdCA/IHNvdXJjZSArICcgLT4gJyArIHN0ZXAudGFyZ2V0IDogc291cmNlICsgJyA8LSAnICsgc3RlcC50YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5wcm9jZXNzU3RlcC5jYWxsKHRoaXMsIHN0ZXAsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRUcmVlRGF0YTogZnVuY3Rpb24oRywgcm9vdCkge1xuICAgICAgICB2YXIgdHJhY2VyID0gdGhpcztcblxuICAgICAgICByb290ID0gcm9vdCB8fCAwO1xuICAgICAgICB2YXIgbWF4RGVwdGggPSAtMTtcblxuICAgICAgICB2YXIgY2hrID0gbmV3IEFycmF5KEcubGVuZ3RoKTtcbiAgICAgICAgdmFyIGdldERlcHRoID0gZnVuY3Rpb24obm9kZSwgZGVwdGgpIHtcbiAgICAgICAgICAgIGlmIChjaGtbbm9kZV0pIHRocm93IFwidGhlIGdpdmVuIGdyYXBoIGlzIG5vdCBhIHRyZWUgYmVjYXVzZSBpdCBmb3JtcyBhIGNpcmN1aXRcIjtcbiAgICAgICAgICAgIGNoa1tub2RlXSA9IHRydWU7XG4gICAgICAgICAgICBpZiAobWF4RGVwdGggPCBkZXB0aCkgbWF4RGVwdGggPSBkZXB0aDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgR1tub2RlXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChHW25vZGVdW2ldKSBnZXREZXB0aChpLCBkZXB0aCArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBnZXREZXB0aChyb290LCAxKTtcblxuICAgICAgICBpZiAodGhpcy5zZXREYXRhLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHJldHVybiB0cnVlO1xuXG4gICAgICAgIHZhciBwbGFjZSA9IGZ1bmN0aW9uKG5vZGUsIHgsIHkpIHtcbiAgICAgICAgICAgIHZhciB0ZW1wID0gdHJhY2VyLmdyYXBoLm5vZGVzKHRyYWNlci5uKG5vZGUpKTtcbiAgICAgICAgICAgIHRlbXAueCA9IHg7XG4gICAgICAgICAgICB0ZW1wLnkgPSB5O1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciB3Z2FwID0gMSAvIChtYXhEZXB0aCAtIDEpO1xuICAgICAgICB2YXIgZGZzID0gZnVuY3Rpb24obm9kZSwgZGVwdGgsIHRvcCwgYm90dG9tKSB7XG4gICAgICAgICAgICBwbGFjZShub2RlLCB0b3AgKyBib3R0b20sIGRlcHRoICogd2dhcCk7XG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBHW25vZGVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKEdbbm9kZV1baV0pIGNoaWxkcmVuKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmdhcCA9IChib3R0b20gLSB0b3ApIC8gY2hpbGRyZW47XG4gICAgICAgICAgICB2YXIgY250ID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgR1tub2RlXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChHW25vZGVdW2ldKSBkZnMoaSwgZGVwdGggKyAxLCB0b3AgKyB2Z2FwICogY250LCB0b3AgKyB2Z2FwICogKytjbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBkZnMocm9vdCwgMCwgMCwgMSk7XG5cbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgfSxcbiAgICBzZXREYXRhOiBmdW5jdGlvbihHKSB7XG4gICAgICAgIGlmIChUcmFjZXIucHJvdG90eXBlLnNldERhdGEuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgdGhpcy5ncmFwaC5jbGVhcigpO1xuICAgICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgICAgdmFyIGVkZ2VzID0gW107XG4gICAgICAgIHZhciB1bml0QW5nbGUgPSAyICogTWF0aC5QSSAvIEcubGVuZ3RoO1xuICAgICAgICB2YXIgY3VycmVudEFuZ2xlID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBHLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjdXJyZW50QW5nbGUgKz0gdW5pdEFuZ2xlO1xuICAgICAgICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMubihpKSxcbiAgICAgICAgICAgICAgICBsYWJlbDogJycgKyBpLFxuICAgICAgICAgICAgICAgIHg6IC41ICsgTWF0aC5zaW4oY3VycmVudEFuZ2xlKSAvIDIsXG4gICAgICAgICAgICAgICAgeTogLjUgKyBNYXRoLmNvcyhjdXJyZW50QW5nbGUpIC8gMixcbiAgICAgICAgICAgICAgICBzaXplOiAxLFxuICAgICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLmRlZmF1bHRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBHW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKEdbaV1bal0pIHtcbiAgICAgICAgICAgICAgICAgICAgZWRnZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy5lKGksIGopLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLm4oaSksXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRoaXMubihqKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLmRlZmF1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplOiAxXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ3JhcGgucmVhZCh7XG4gICAgICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgICAgICBlZGdlczogZWRnZXNcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucy5jYW1lcmEuZ29Ubyh7XG4gICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgeTogMCxcbiAgICAgICAgICAgIGFuZ2xlOiAwLFxuICAgICAgICAgICAgcmF0aW86IDFcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIHJlc2l6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIFRyYWNlci5wcm90b3R5cGUucmVzaXplLmNhbGwodGhpcyk7XG5cbiAgICAgICAgdGhpcy5zLnJlbmRlcmVyc1swXS5yZXNpemUoKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgfSxcbiAgICByZWZyZXNoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5yZWZyZXNoLmNhbGwodGhpcyk7XG5cbiAgICAgICAgdGhpcy5zLnJlZnJlc2goKTtcbiAgICB9LFxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5jbGVhci5jYWxsKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuY2xlYXJHcmFwaENvbG9yKCk7XG4gICAgfSxcbiAgICBjb2xvcjoge1xuICAgICAgICB2aXNpdGVkOiAnI2YwMCcsXG4gICAgICAgIGxlZnQ6ICcjMDAwJyxcbiAgICAgICAgZGVmYXVsdDogJyM4ODgnXG4gICAgfSxcbiAgICBjbGVhckdyYXBoQ29sb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdHJhY2VyID0gdGhpcztcblxuICAgICAgICB0aGlzLmdyYXBoLm5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICBub2RlLmNvbG9yID0gdHJhY2VyLmNvbG9yLmRlZmF1bHQ7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmdyYXBoLmVkZ2VzKCkuZm9yRWFjaChmdW5jdGlvbihlZGdlKSB7XG4gICAgICAgICAgICBlZGdlLmNvbG9yID0gdHJhY2VyLmNvbG9yLmRlZmF1bHQ7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgbjogZnVuY3Rpb24odikge1xuICAgICAgICByZXR1cm4gJ24nICsgdjtcbiAgICB9LFxuICAgIGU6IGZ1bmN0aW9uKHYxLCB2Mikge1xuICAgICAgICByZXR1cm4gJ2UnICsgdjEgKyAnXycgKyB2MjtcbiAgICB9LFxuICAgIGdldENvbG9yOiBmdW5jdGlvbihlZGdlLCBzb3VyY2UsIHRhcmdldCwgc2V0dGluZ3MpIHtcbiAgICAgICAgdmFyIGNvbG9yID0gZWRnZS5jb2xvcixcbiAgICAgICAgICAgIGVkZ2VDb2xvciA9IHNldHRpbmdzKCdlZGdlQ29sb3InKSxcbiAgICAgICAgICAgIGRlZmF1bHROb2RlQ29sb3IgPSBzZXR0aW5ncygnZGVmYXVsdE5vZGVDb2xvcicpLFxuICAgICAgICAgICAgZGVmYXVsdEVkZ2VDb2xvciA9IHNldHRpbmdzKCdkZWZhdWx0RWRnZUNvbG9yJyk7XG4gICAgICAgIGlmICghY29sb3IpXG4gICAgICAgICAgICBzd2l0Y2ggKGVkZ2VDb2xvcikge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NvdXJjZSc6XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yID0gc291cmNlLmNvbG9yIHx8IGRlZmF1bHROb2RlQ29sb3I7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RhcmdldCc6XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yID0gdGFyZ2V0LmNvbG9yIHx8IGRlZmF1bHROb2RlQ29sb3I7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yID0gZGVmYXVsdEVkZ2VDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbG9yO1xuICAgIH0sXG4gICAgZHJhd0xhYmVsOiBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICB2YXIgZm9udFNpemUsXG4gICAgICAgICAgICBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJycsXG4gICAgICAgICAgICBzaXplID0gbm9kZVtwcmVmaXggKyAnc2l6ZSddO1xuXG4gICAgICAgIGlmIChzaXplIDwgc2V0dGluZ3MoJ2xhYmVsVGhyZXNob2xkJykpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgaWYgKCFub2RlLmxhYmVsIHx8IHR5cGVvZiBub2RlLmxhYmVsICE9PSAnc3RyaW5nJylcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBmb250U2l6ZSA9IChzZXR0aW5ncygnbGFiZWxTaXplJykgPT09ICdmaXhlZCcpID9cbiAgICAgICAgICAgIHNldHRpbmdzKCdkZWZhdWx0TGFiZWxTaXplJykgOlxuICAgICAgICAgICAgc2V0dGluZ3MoJ2xhYmVsU2l6ZVJhdGlvJykgKiBzaXplO1xuXG4gICAgICAgIGNvbnRleHQuZm9udCA9IChzZXR0aW5ncygnZm9udFN0eWxlJykgPyBzZXR0aW5ncygnZm9udFN0eWxlJykgKyAnICcgOiAnJykgK1xuICAgICAgICAgICAgZm9udFNpemUgKyAncHggJyArIHNldHRpbmdzKCdmb250Jyk7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gKHNldHRpbmdzKCdsYWJlbENvbG9yJykgPT09ICdub2RlJykgP1xuICAgICAgICAgICAgKG5vZGUuY29sb3IgfHwgc2V0dGluZ3MoJ2RlZmF1bHROb2RlQ29sb3InKSkgOlxuICAgICAgICAgICAgc2V0dGluZ3MoJ2RlZmF1bHRMYWJlbENvbG9yJyk7XG5cbiAgICAgICAgY29udGV4dC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgY29udGV4dC5maWxsVGV4dChcbiAgICAgICAgICAgIG5vZGUubGFiZWwsXG4gICAgICAgICAgICBNYXRoLnJvdW5kKG5vZGVbcHJlZml4ICsgJ3gnXSksXG4gICAgICAgICAgICBNYXRoLnJvdW5kKG5vZGVbcHJlZml4ICsgJ3knXSArIGZvbnRTaXplIC8gMylcbiAgICAgICAgKTtcbiAgICB9LFxuICAgIGRyYXdBcnJvdzogZnVuY3Rpb24oZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICB2YXIgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnLFxuICAgICAgICAgICAgc2l6ZSA9IGVkZ2VbcHJlZml4ICsgJ3NpemUnXSB8fCAxLFxuICAgICAgICAgICAgdFNpemUgPSB0YXJnZXRbcHJlZml4ICsgJ3NpemUnXSxcbiAgICAgICAgICAgIHNYID0gc291cmNlW3ByZWZpeCArICd4J10sXG4gICAgICAgICAgICBzWSA9IHNvdXJjZVtwcmVmaXggKyAneSddLFxuICAgICAgICAgICAgdFggPSB0YXJnZXRbcHJlZml4ICsgJ3gnXSxcbiAgICAgICAgICAgIHRZID0gdGFyZ2V0W3ByZWZpeCArICd5J10sXG4gICAgICAgICAgICBhbmdsZSA9IE1hdGguYXRhbjIodFkgLSBzWSwgdFggLSBzWCksXG4gICAgICAgICAgICBkaXN0ID0gMztcbiAgICAgICAgc1ggKz0gTWF0aC5zaW4oYW5nbGUpICogZGlzdDtcbiAgICAgICAgdFggKz0gTWF0aC5zaW4oYW5nbGUpICogZGlzdDtcbiAgICAgICAgc1kgKz0gLU1hdGguY29zKGFuZ2xlKSAqIGRpc3Q7XG4gICAgICAgIHRZICs9IC1NYXRoLmNvcyhhbmdsZSkgKiBkaXN0O1xuICAgICAgICB2YXIgYVNpemUgPSBNYXRoLm1heChzaXplICogMi41LCBzZXR0aW5ncygnbWluQXJyb3dTaXplJykpLFxuICAgICAgICAgICAgZCA9IE1hdGguc3FydChNYXRoLnBvdyh0WCAtIHNYLCAyKSArIE1hdGgucG93KHRZIC0gc1ksIDIpKSxcbiAgICAgICAgICAgIGFYID0gc1ggKyAodFggLSBzWCkgKiAoZCAtIGFTaXplIC0gdFNpemUpIC8gZCxcbiAgICAgICAgICAgIGFZID0gc1kgKyAodFkgLSBzWSkgKiAoZCAtIGFTaXplIC0gdFNpemUpIC8gZCxcbiAgICAgICAgICAgIHZYID0gKHRYIC0gc1gpICogYVNpemUgLyBkLFxuICAgICAgICAgICAgdlkgPSAodFkgLSBzWSkgKiBhU2l6ZSAvIGQ7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHNpemU7XG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQubW92ZVRvKHNYLCBzWSk7XG4gICAgICAgIGNvbnRleHQubGluZVRvKFxuICAgICAgICAgICAgYVgsXG4gICAgICAgICAgICBhWVxuICAgICAgICApO1xuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQubW92ZVRvKGFYICsgdlgsIGFZICsgdlkpO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhhWCArIHZZICogMC42LCBhWSAtIHZYICogMC42KTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oYVggLSB2WSAqIDAuNiwgYVkgKyB2WCAqIDAuNik7XG4gICAgICAgIGNvbnRleHQubGluZVRvKGFYICsgdlgsIGFZICsgdlkpO1xuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICB9LFxuICAgIGRyYXdPbkhvdmVyOiBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncywgbmV4dCkge1xuICAgICAgICB2YXIgdHJhY2VyID0gdGhpcztcblxuICAgICAgICBjb250ZXh0LnNldExpbmVEYXNoKFs1LCA1XSk7XG4gICAgICAgIHZhciBub2RlSWR4ID0gbm9kZS5pZC5zdWJzdHJpbmcoMSk7XG4gICAgICAgIHRoaXMuZ3JhcGguZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2UpIHtcbiAgICAgICAgICAgIHZhciBlbmRzID0gZWRnZS5pZC5zdWJzdHJpbmcoMSkuc3BsaXQoXCJfXCIpO1xuICAgICAgICAgICAgaWYgKGVuZHNbMF0gPT0gbm9kZUlkeCkge1xuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9ICcjMGZmJztcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gbm9kZTtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gdHJhY2VyLmdyYXBoLm5vZGVzKCduJyArIGVuZHNbMV0pO1xuICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3QXJyb3coZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgaWYgKG5leHQpIG5leHQoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVuZHNbMV0gPT0gbm9kZUlkeCkge1xuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9ICcjZmYwJztcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gdHJhY2VyLmdyYXBoLm5vZGVzKCduJyArIGVuZHNbMF0pO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBub2RlO1xuICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3QXJyb3coZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgaWYgKG5leHQpIG5leHQoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG52YXIgRGlyZWN0ZWRHcmFwaCA9IHtcbiAgICByYW5kb206IGZ1bmN0aW9uKE4sIHJhdGlvKSB7XG4gICAgICAgIGlmICghTikgTiA9IDU7XG4gICAgICAgIGlmICghcmF0aW8pIHJhdGlvID0gLjM7XG4gICAgICAgIHZhciBHID0gbmV3IEFycmF5KE4pO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE47IGkrKykge1xuICAgICAgICAgICAgR1tpXSA9IG5ldyBBcnJheShOKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgTjsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgIT0gaikge1xuICAgICAgICAgICAgICAgICAgICBHW2ldW2pdID0gKE1hdGgucmFuZG9tKCkgKiAoMSAvIHJhdGlvKSB8IDApID09IDAgPyAxIDogMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEc7XG4gICAgfVxufTtcblxuc2lnbWEuY2FudmFzLmxhYmVscy5kZWYgPSBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgIHZhciBmdW5jID0gc2V0dGluZ3MoJ2Z1bmNMYWJlbHNEZWYnKTtcbiAgICBpZiAoZnVuYykge1xuICAgICAgICBmdW5jKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICB9XG59O1xuc2lnbWEuY2FudmFzLmhvdmVycy5kZWYgPSBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgIHZhciBmdW5jID0gc2V0dGluZ3MoJ2Z1bmNIb3ZlcnNEZWYnKTtcbiAgICBpZiAoZnVuYykge1xuICAgICAgICBmdW5jKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICB9XG59O1xuc2lnbWEuY2FudmFzLmVkZ2VzLmRlZiA9IGZ1bmN0aW9uKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgIHZhciBmdW5jID0gc2V0dGluZ3MoJ2Z1bmNFZGdlc0RlZicpO1xuICAgIGlmIChmdW5jKSB7XG4gICAgICAgIGZ1bmMoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICB9XG59O1xuc2lnbWEuY2FudmFzLmVkZ2VzLmFycm93ID0gZnVuY3Rpb24oZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgdmFyIGZ1bmMgPSBzZXR0aW5ncygnZnVuY0VkZ2VzQXJyb3cnKTtcbiAgICBpZiAoZnVuYykge1xuICAgICAgICBmdW5jKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgRGlyZWN0ZWRHcmFwaCxcbiAgICBEaXJlY3RlZEdyYXBoVHJhY2VyXG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgVHJhY2VyID0gcmVxdWlyZSgnLi90cmFjZXInKTtcblxuY29uc3QgTG9nVHJhY2VyID0gcmVxdWlyZSgnLi9sb2dfdHJhY2VyJyk7XG5cbmNvbnN0IHtcbiAgQXJyYXkxRCxcbiAgQXJyYXkxRFRyYWNlclxufSA9IHJlcXVpcmUoJy4vYXJyYXkxZCcpO1xuY29uc3Qge1xuICBBcnJheTJELFxuICBBcnJheTJEVHJhY2VyXG59ID0gcmVxdWlyZSgnLi9hcnJheTJkJyk7XG5cbmNvbnN0IENoYXJ0VHJhY2VyID0gcmVxdWlyZSgnLi9jaGFydCcpO1xuXG5jb25zdCB7XG4gIENvb3JkaW5hdGVTeXN0ZW0sXG4gIENvb3JkaW5hdGVTeXN0ZW1UcmFjZXJcbn0gPSByZXF1aXJlKCcuL2Nvb3JkaW5hdGVfc3lzdGVtJyk7XG5cbmNvbnN0IHtcbiAgRGlyZWN0ZWRHcmFwaCxcbiAgRGlyZWN0ZWRHcmFwaFRyYWNlclxufSA9IHJlcXVpcmUoJy4vZGlyZWN0ZWRfZ3JhcGgnKTtcbmNvbnN0IHtcbiAgVW5kaXJlY3RlZEdyYXBoLFxuICBVbmRpcmVjdGVkR3JhcGhUcmFjZXJcbn0gPSByZXF1aXJlKCcuL3VuZGlyZWN0ZWRfZ3JhcGgnKTtcblxuY29uc3Qge1xuICBXZWlnaHRlZERpcmVjdGVkR3JhcGgsXG4gIFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlclxufSA9IHJlcXVpcmUoJy4vd2VpZ2h0ZWRfZGlyZWN0ZWRfZ3JhcGgnKTtcbmNvbnN0IHtcbiAgV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGgsXG4gIFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoVHJhY2VyXG59ID0gcmVxdWlyZSgnLi93ZWlnaHRlZF91bmRpcmVjdGVkX2dyYXBoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBUcmFjZXIsXG4gIExvZ1RyYWNlcixcbiAgQXJyYXkxRCxcbiAgQXJyYXkxRFRyYWNlcixcbiAgQXJyYXkyRCxcbiAgQXJyYXkyRFRyYWNlcixcbiAgQ2hhcnRUcmFjZXIsXG4gIENvb3JkaW5hdGVTeXN0ZW0sXG4gIENvb3JkaW5hdGVTeXN0ZW1UcmFjZXIsXG4gIERpcmVjdGVkR3JhcGgsXG4gIERpcmVjdGVkR3JhcGhUcmFjZXIsXG4gIFVuZGlyZWN0ZWRHcmFwaCxcbiAgVW5kaXJlY3RlZEdyYXBoVHJhY2VyLFxuICBXZWlnaHRlZERpcmVjdGVkR3JhcGgsXG4gIFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlcixcbiAgV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGgsXG4gIFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoVHJhY2VyXG59OyIsImNvbnN0IFRyYWNlciA9IHJlcXVpcmUoJy4vdHJhY2VyJyk7XG5cbmZ1bmN0aW9uIExvZ1RyYWNlcigpIHtcbiAgICBpZiAoVHJhY2VyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgTG9nVHJhY2VyLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbkxvZ1RyYWNlci5wcm90b3R5cGUgPSAkLmV4dGVuZCh0cnVlLCBPYmplY3QuY3JlYXRlKFRyYWNlci5wcm90b3R5cGUpLCB7XG4gICAgY29uc3RydWN0b3I6IExvZ1RyYWNlcixcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy4kd3JhcHBlciA9IHRoaXMuY2Fwc3VsZS4kd3JhcHBlciA9ICQoJzxkaXYgY2xhc3M9XCJ3cmFwcGVyXCI+Jyk7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5hcHBlbmQodGhpcy4kd3JhcHBlcik7XG4gICAgfSxcbiAgICBfcHJpbnQ6IGZ1bmN0aW9uKG1zZykge1xuICAgICAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICAgICAgICB0eXBlOiAncHJpbnQnLFxuICAgICAgICAgICAgbXNnOiBtc2dcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgcHJvY2Vzc1N0ZXA6IGZ1bmN0aW9uKHN0ZXAsIG9wdGlvbnMpIHtcbiAgICAgICAgc3dpdGNoIChzdGVwLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3ByaW50JzpcbiAgICAgICAgICAgICAgICB0aGlzLnByaW50KHN0ZXAubXNnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVmcmVzaDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9FbmQoTWF0aC5taW4oNTAsIHRoaXMuaW50ZXJ2YWwpKTtcbiAgICB9LFxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5jbGVhci5jYWxsKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuJHdyYXBwZXIuZW1wdHkoKTtcbiAgICB9LFxuICAgIHByaW50OiBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICAgIHRoaXMuJHdyYXBwZXIuYXBwZW5kKCQoJzxzcGFuPicpLmFwcGVuZChtZXNzYWdlICsgJzxici8+JykpO1xuICAgIH0sXG4gICAgc2Nyb2xsVG9FbmQ6IGZ1bmN0aW9uKGR1cmF0aW9uKSB7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5hbmltYXRlKHtcbiAgICAgICAgICAgIHNjcm9sbFRvcDogdGhpcy4kY29udGFpbmVyWzBdLnNjcm9sbEhlaWdodFxuICAgICAgICB9LCBkdXJhdGlvbik7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9nVHJhY2VyOyIsImNvbnN0IHtcbiAgICB0b0pTT04sXG4gICAgZnJvbUpTT05cbn0gPSByZXF1aXJlKCcuLi90cmFjZXJfbWFuYWdlci91dGlsJyk7XG5cbmZ1bmN0aW9uIFRyYWNlcihuYW1lKSB7XG4gICAgdGhpcy5tb2R1bGUgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgIHRoaXMuY2Fwc3VsZSA9IHRoaXMubWFuYWdlci5hbGxvY2F0ZSh0aGlzKTtcbiAgICAkLmV4dGVuZCh0aGlzLCB0aGlzLmNhcHN1bGUpO1xuICAgIHRoaXMuc2V0TmFtZShuYW1lKTtcbiAgICByZXR1cm4gdGhpcy5pc05ldztcbn1cblxuVHJhY2VyLnByb3RvdHlwZSA9IHtcblxuICAgIGNvbnN0cnVjdG9yOiBUcmFjZXIsXG4gICAgbWFuYWdlcjogbnVsbCxcblxuICAgIF9zZXREYXRhKC4uLmFyZ3MpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgICAgICAgdHlwZTogJ3NldERhdGEnLFxuICAgICAgICAgICAgYXJnczogdG9KU09OKGFyZ3MpXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgX2NsZWFyKCkge1xuICAgICAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICAgICAgICB0eXBlOiAnY2xlYXInXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgX3dhaXQoKSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5uZXdTdGVwKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBwcm9jZXNzU3RlcChzdGVwLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICBhcmdzXG4gICAgICAgIH0gPSBzdGVwO1xuXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnc2V0RGF0YSc6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhKC4uLmZyb21KU09OKGFyZ3MpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2NsZWFyJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0TmFtZShuYW1lKSB7XG4gICAgICAgIGxldCAkbmFtZTtcbiAgICAgICAgaWYgKHRoaXMuaXNOZXcpIHtcbiAgICAgICAgICAgICRuYW1lID0gJCgnPHNwYW4gY2xhc3M9XCJuYW1lXCI+Jyk7XG4gICAgICAgICAgICB0aGlzLiRjb250YWluZXIuYXBwZW5kKCRuYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRuYW1lID0gdGhpcy4kY29udGFpbmVyLmZpbmQoJ3NwYW4ubmFtZScpO1xuICAgICAgICB9XG4gICAgICAgICRuYW1lLnRleHQobmFtZSB8fCB0aGlzLmRlZmF1bHROYW1lKTtcbiAgICB9LFxuXG4gICAgc2V0RGF0YSgpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRvSlNPTihhcmd1bWVudHMpO1xuICAgICAgICBpZiAoIXRoaXMuaXNOZXcgJiYgdGhpcy5sYXN0RGF0YSA9PT0gZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc05ldyA9IHRoaXMuY2Fwc3VsZS5pc05ldyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxhc3REYXRhID0gdGhpcy5jYXBzdWxlLmxhc3REYXRhID0gZGF0YTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICByZXNpemUoKSB7fSxcbiAgICByZWZyZXNoKCkge30sXG4gICAgY2xlYXIoKSB7fSxcblxuICAgIGF0dGFjaCh0cmFjZXIpIHtcbiAgICAgICAgaWYgKHRyYWNlci5tb2R1bGUgPT09IExvZ1RyYWNlcikge1xuICAgICAgICAgICAgdGhpcy5sb2dUcmFjZXIgPSB0cmFjZXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIG1vdXNlZG93bihlKSB7fSxcbiAgICBtb3VzZW1vdmUoZSkge30sXG4gICAgbW91c2V1cChlKSB7fSxcbiAgICBtb3VzZXdoZWVsKGUpIHt9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlcjsiLCJjb25zdCB7XG4gICAgRGlyZWN0ZWRHcmFwaCxcbiAgICBEaXJlY3RlZEdyYXBoVHJhY2VyXG59ID0gcmVxdWlyZSgnLi9kaXJlY3RlZF9ncmFwaCcpO1xuXG5mdW5jdGlvbiBVbmRpcmVjdGVkR3JhcGhUcmFjZXIoKSB7XG4gICAgaWYgKERpcmVjdGVkR3JhcGhUcmFjZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICBVbmRpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlLmluaXQuY2FsbCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuVW5kaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHRydWUsIE9iamVjdC5jcmVhdGUoRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUpLCB7XG4gICAgY29uc3RydWN0b3I6IFVuZGlyZWN0ZWRHcmFwaFRyYWNlcixcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHRyYWNlciA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5zLnNldHRpbmdzKHtcbiAgICAgICAgICAgIGRlZmF1bHRFZGdlVHlwZTogJ2RlZicsXG4gICAgICAgICAgICBmdW5jRWRnZXNEZWY6IGZ1bmN0aW9uKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IHRyYWNlci5nZXRDb2xvcihlZGdlLCBzb3VyY2UsIHRhcmdldCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3RWRnZShlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBzZXREYXRhOiBmdW5jdGlvbihHKSB7XG4gICAgICAgIGlmIChUcmFjZXIucHJvdG90eXBlLnNldERhdGEuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgdGhpcy5ncmFwaC5jbGVhcigpO1xuICAgICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgICAgdmFyIGVkZ2VzID0gW107XG4gICAgICAgIHZhciB1bml0QW5nbGUgPSAyICogTWF0aC5QSSAvIEcubGVuZ3RoO1xuICAgICAgICB2YXIgY3VycmVudEFuZ2xlID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBHLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjdXJyZW50QW5nbGUgKz0gdW5pdEFuZ2xlO1xuICAgICAgICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMubihpKSxcbiAgICAgICAgICAgICAgICBsYWJlbDogJycgKyBpLFxuICAgICAgICAgICAgICAgIHg6IC41ICsgTWF0aC5zaW4oY3VycmVudEFuZ2xlKSAvIDIsXG4gICAgICAgICAgICAgICAgeTogLjUgKyBNYXRoLmNvcyhjdXJyZW50QW5nbGUpIC8gMixcbiAgICAgICAgICAgICAgICBzaXplOiAxLFxuICAgICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLmRlZmF1bHRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgRy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPD0gaTsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKEdbaV1bal0gfHwgR1tqXVtpXSkge1xuICAgICAgICAgICAgICAgICAgICBlZGdlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLmUoaSwgaiksXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMubihpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcy5uKGopLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IDFcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ncmFwaC5yZWFkKHtcbiAgICAgICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgICAgIGVkZ2VzOiBlZGdlc1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zLmNhbWVyYS5nb1RvKHtcbiAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICByYXRpbzogMVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgZTogZnVuY3Rpb24odjEsIHYyKSB7XG4gICAgICAgIGlmICh2MSA+IHYyKSB7XG4gICAgICAgICAgICB2YXIgdGVtcCA9IHYxO1xuICAgICAgICAgICAgdjEgPSB2MjtcbiAgICAgICAgICAgIHYyID0gdGVtcDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ2UnICsgdjEgKyAnXycgKyB2MjtcbiAgICB9LFxuICAgIGRyYXdPbkhvdmVyOiBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncywgbmV4dCkge1xuICAgICAgICB2YXIgdHJhY2VyID0gdGhpcztcblxuICAgICAgICBjb250ZXh0LnNldExpbmVEYXNoKFs1LCA1XSk7XG4gICAgICAgIHZhciBub2RlSWR4ID0gbm9kZS5pZC5zdWJzdHJpbmcoMSk7XG4gICAgICAgIHRoaXMuZ3JhcGguZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2UpIHtcbiAgICAgICAgICAgIHZhciBlbmRzID0gZWRnZS5pZC5zdWJzdHJpbmcoMSkuc3BsaXQoXCJfXCIpO1xuICAgICAgICAgICAgaWYgKGVuZHNbMF0gPT0gbm9kZUlkeCkge1xuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9ICcjMGZmJztcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gbm9kZTtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gdHJhY2VyLmdyYXBoLm5vZGVzKCduJyArIGVuZHNbMV0pO1xuICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3RWRnZShlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICBpZiAobmV4dCkgbmV4dChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZW5kc1sxXSA9PSBub2RlSWR4KSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gJyMwZmYnO1xuICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSB0cmFjZXIuZ3JhcGgubm9kZXMoJ24nICsgZW5kc1swXSk7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IG5vZGU7XG4gICAgICAgICAgICAgICAgdHJhY2VyLmRyYXdFZGdlKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIGlmIChuZXh0KSBuZXh0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGRyYXdFZGdlOiBmdW5jdGlvbihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJycsXG4gICAgICAgICAgICBzaXplID0gZWRnZVtwcmVmaXggKyAnc2l6ZSddIHx8IDE7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHNpemU7XG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQubW92ZVRvKFxuICAgICAgICAgICAgc291cmNlW3ByZWZpeCArICd4J10sXG4gICAgICAgICAgICBzb3VyY2VbcHJlZml4ICsgJ3knXVxuICAgICAgICApO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhcbiAgICAgICAgICAgIHRhcmdldFtwcmVmaXggKyAneCddLFxuICAgICAgICAgICAgdGFyZ2V0W3ByZWZpeCArICd5J11cbiAgICAgICAgKTtcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICB9XG59KTtcblxudmFyIFVuZGlyZWN0ZWRHcmFwaCA9IHtcbiAgICByYW5kb206IGZ1bmN0aW9uKE4sIHJhdGlvKSB7XG4gICAgICAgIGlmICghTikgTiA9IDU7XG4gICAgICAgIGlmICghcmF0aW8pIHJhdGlvID0gLjM7XG4gICAgICAgIHZhciBHID0gbmV3IEFycmF5KE4pO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE47IGkrKykgR1tpXSA9IG5ldyBBcnJheShOKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgTjsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPiBqKSB7XG4gICAgICAgICAgICAgICAgICAgIEdbaV1bal0gPSBHW2pdW2ldID0gKE1hdGgucmFuZG9tKCkgKiAoMSAvIHJhdGlvKSB8IDApID09IDAgPyAxIDogMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEc7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgVW5kaXJlY3RlZEdyYXBoLFxuICAgIFVuZGlyZWN0ZWRHcmFwaFRyYWNlclxufTsiLCJjb25zdCB7XG4gICAgRGlyZWN0ZWRHcmFwaCxcbiAgICBEaXJlY3RlZEdyYXBoVHJhY2VyXG59ID0gcmVxdWlyZSgnLi9kaXJlY3RlZF9ncmFwaCcpO1xuXG5jb25zdCB7XG4gICAgcmVmaW5lQnlUeXBlXG59ID0gcmVxdWlyZSgnLi4vdHJhY2VyX21hbmFnZXIvdXRpbCcpO1xuXG5mdW5jdGlvbiBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXIoKSB7XG4gICAgaWYgKERpcmVjdGVkR3JhcGhUcmFjZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlLmluaXQuY2FsbCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuV2VpZ2h0ZWREaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHRydWUsIE9iamVjdC5jcmVhdGUoRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUpLCB7XG4gICAgY29uc3RydWN0b3I6IFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlcixcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHRyYWNlciA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5zLnNldHRpbmdzKHtcbiAgICAgICAgICAgIGVkZ2VMYWJlbFNpemU6ICdwcm9wb3J0aW9uYWwnLFxuICAgICAgICAgICAgZGVmYXVsdEVkZ2VMYWJlbFNpemU6IDIwLFxuICAgICAgICAgICAgZWRnZUxhYmVsU2l6ZVBvd1JhdGlvOiAwLjgsXG4gICAgICAgICAgICBmdW5jTGFiZWxzRGVmOiBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3Tm9kZVdlaWdodChub2RlLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgdHJhY2VyLmRyYXdMYWJlbChub2RlLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY0hvdmVyc0RlZjogZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICB0cmFjZXIuZHJhd09uSG92ZXIobm9kZSwgY29udGV4dCwgc2V0dGluZ3MsIHRyYWNlci5kcmF3RWRnZVdlaWdodCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY0VkZ2VzQXJyb3c6IGZ1bmN0aW9uKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IHRyYWNlci5nZXRDb2xvcihlZGdlLCBzb3VyY2UsIHRhcmdldCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3QXJyb3coZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgdHJhY2VyLmRyYXdFZGdlV2VpZ2h0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIF93ZWlnaHQ6IGZ1bmN0aW9uKHRhcmdldCwgd2VpZ2h0KSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICd3ZWlnaHQnLFxuICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgICB3ZWlnaHQ6IHdlaWdodFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfdmlzaXQ6IGZ1bmN0aW9uKHRhcmdldCwgc291cmNlLCB3ZWlnaHQpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgICAgICAgdHlwZTogJ3Zpc2l0JyxcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgICAgICB3ZWlnaHQ6IHdlaWdodFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfbGVhdmU6IGZ1bmN0aW9uKHRhcmdldCwgc291cmNlLCB3ZWlnaHQpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgICAgICAgdHlwZTogJ2xlYXZlJyxcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgICAgICB3ZWlnaHQ6IHdlaWdodFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBwcm9jZXNzU3RlcDogZnVuY3Rpb24oc3RlcCwgb3B0aW9ucykge1xuICAgICAgICBzd2l0Y2ggKHN0ZXAudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnd2VpZ2h0JzpcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0Tm9kZSA9IHRoaXMuZ3JhcGgubm9kZXModGhpcy5uKHN0ZXAudGFyZ2V0KSk7XG4gICAgICAgICAgICAgICAgaWYgKHN0ZXAud2VpZ2h0ICE9PSB1bmRlZmluZWQpIHRhcmdldE5vZGUud2VpZ2h0ID0gcmVmaW5lQnlUeXBlKHN0ZXAud2VpZ2h0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2l0JzpcbiAgICAgICAgICAgIGNhc2UgJ2xlYXZlJzpcbiAgICAgICAgICAgICAgICB2YXIgdmlzaXQgPSBzdGVwLnR5cGUgPT0gJ3Zpc2l0JztcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0Tm9kZSA9IHRoaXMuZ3JhcGgubm9kZXModGhpcy5uKHN0ZXAudGFyZ2V0KSk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gdmlzaXQgPyB0aGlzLmNvbG9yLnZpc2l0ZWQgOiB0aGlzLmNvbG9yLmxlZnQ7XG4gICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZS5jb2xvciA9IGNvbG9yO1xuICAgICAgICAgICAgICAgIGlmIChzdGVwLndlaWdodCAhPT0gdW5kZWZpbmVkKSB0YXJnZXROb2RlLndlaWdodCA9IHJlZmluZUJ5VHlwZShzdGVwLndlaWdodCk7XG4gICAgICAgICAgICAgICAgaWYgKHN0ZXAuc291cmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVkZ2VJZCA9IHRoaXMuZShzdGVwLnNvdXJjZSwgc3RlcC50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWRnZSA9IHRoaXMuZ3JhcGguZWRnZXMoZWRnZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgZWRnZS5jb2xvciA9IGNvbG9yO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYXBoLmRyb3BFZGdlKGVkZ2VJZCkuYWRkRWRnZShlZGdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubG9nVHJhY2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBzdGVwLnNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZSA9PT0gdW5kZWZpbmVkKSBzb3VyY2UgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dUcmFjZXIucHJpbnQodmlzaXQgPyBzb3VyY2UgKyAnIC0+ICcgKyBzdGVwLnRhcmdldCA6IHNvdXJjZSArICcgPC0gJyArIHN0ZXAudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIERpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlLnByb2Nlc3NTdGVwLmNhbGwodGhpcywgc3RlcCwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldERhdGE6IGZ1bmN0aW9uKEcpIHtcbiAgICAgICAgaWYgKFRyYWNlci5wcm90b3R5cGUuc2V0RGF0YS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB0aGlzLmdyYXBoLmNsZWFyKCk7XG4gICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICB2YXIgZWRnZXMgPSBbXTtcbiAgICAgICAgdmFyIHVuaXRBbmdsZSA9IDIgKiBNYXRoLlBJIC8gRy5sZW5ndGg7XG4gICAgICAgIHZhciBjdXJyZW50QW5nbGUgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGN1cnJlbnRBbmdsZSArPSB1bml0QW5nbGU7XG4gICAgICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5uKGkpLFxuICAgICAgICAgICAgICAgIGxhYmVsOiAnJyArIGksXG4gICAgICAgICAgICAgICAgeDogLjUgKyBNYXRoLnNpbihjdXJyZW50QW5nbGUpIC8gMixcbiAgICAgICAgICAgICAgICB5OiAuNSArIE1hdGguY29zKGN1cnJlbnRBbmdsZSkgLyAyLFxuICAgICAgICAgICAgICAgIHNpemU6IDEsXG4gICAgICAgICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdCxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBHW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKEdbaV1bal0pIHtcbiAgICAgICAgICAgICAgICAgICAgZWRnZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy5lKGksIGopLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLm4oaSksXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRoaXMubihqKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLmRlZmF1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiByZWZpbmVCeVR5cGUoR1tpXVtqXSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ncmFwaC5yZWFkKHtcbiAgICAgICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgICAgIGVkZ2VzOiBlZGdlc1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zLmNhbWVyYS5nb1RvKHtcbiAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICByYXRpbzogMVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBEaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZS5jbGVhci5jYWxsKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuY2xlYXJXZWlnaHRzKCk7XG4gICAgfSxcbiAgICBjbGVhcldlaWdodHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmdyYXBoLm5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICBub2RlLndlaWdodCA9IDA7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZHJhd0VkZ2VXZWlnaHQ6IGZ1bmN0aW9uKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHNvdXJjZSA9PSB0YXJnZXQpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJyxcbiAgICAgICAgICAgIHNpemUgPSBlZGdlW3ByZWZpeCArICdzaXplJ10gfHwgMTtcblxuICAgICAgICBpZiAoc2l6ZSA8IHNldHRpbmdzKCdlZGdlTGFiZWxUaHJlc2hvbGQnKSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBpZiAoMCA9PT0gc2V0dGluZ3MoJ2VkZ2VMYWJlbFNpemVQb3dSYXRpbycpKVxuICAgICAgICAgICAgdGhyb3cgJ1wiZWRnZUxhYmVsU2l6ZVBvd1JhdGlvXCIgbXVzdCBub3QgYmUgMC4nO1xuXG4gICAgICAgIHZhciBmb250U2l6ZSxcbiAgICAgICAgICAgIHggPSAoc291cmNlW3ByZWZpeCArICd4J10gKyB0YXJnZXRbcHJlZml4ICsgJ3gnXSkgLyAyLFxuICAgICAgICAgICAgeSA9IChzb3VyY2VbcHJlZml4ICsgJ3knXSArIHRhcmdldFtwcmVmaXggKyAneSddKSAvIDIsXG4gICAgICAgICAgICBkWCA9IHRhcmdldFtwcmVmaXggKyAneCddIC0gc291cmNlW3ByZWZpeCArICd4J10sXG4gICAgICAgICAgICBkWSA9IHRhcmdldFtwcmVmaXggKyAneSddIC0gc291cmNlW3ByZWZpeCArICd5J10sXG4gICAgICAgICAgICBhbmdsZSA9IE1hdGguYXRhbjIoZFksIGRYKTtcblxuICAgICAgICBmb250U2l6ZSA9IChzZXR0aW5ncygnZWRnZUxhYmVsU2l6ZScpID09PSAnZml4ZWQnKSA/XG4gICAgICAgICAgICBzZXR0aW5ncygnZGVmYXVsdEVkZ2VMYWJlbFNpemUnKSA6XG4gICAgICAgICAgICBzZXR0aW5ncygnZGVmYXVsdEVkZ2VMYWJlbFNpemUnKSAqXG4gICAgICAgICAgICBzaXplICpcbiAgICAgICAgICAgIE1hdGgucG93KHNpemUsIC0xIC8gc2V0dGluZ3MoJ2VkZ2VMYWJlbFNpemVQb3dSYXRpbycpKTtcblxuICAgICAgICBjb250ZXh0LnNhdmUoKTtcblxuICAgICAgICBpZiAoZWRnZS5hY3RpdmUpIHtcbiAgICAgICAgICAgIGNvbnRleHQuZm9udCA9IFtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncygnYWN0aXZlRm9udFN0eWxlJyksXG4gICAgICAgICAgICAgICAgZm9udFNpemUgKyAncHgnLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzKCdhY3RpdmVGb250JykgfHwgc2V0dGluZ3MoJ2ZvbnQnKVxuICAgICAgICAgICAgXS5qb2luKCcgJyk7XG5cbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250ZXh0LmZvbnQgPSBbXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MoJ2ZvbnRTdHlsZScpLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplICsgJ3B4JyxcbiAgICAgICAgICAgICAgICBzZXR0aW5ncygnZm9udCcpXG4gICAgICAgICAgICBdLmpvaW4oJyAnKTtcblxuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIGNvbnRleHQudGV4dEJhc2VsaW5lID0gJ2FscGhhYmV0aWMnO1xuXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKHgsIHkpO1xuICAgICAgICBjb250ZXh0LnJvdGF0ZShhbmdsZSk7XG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQoXG4gICAgICAgICAgICBlZGdlLndlaWdodCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAoLXNpemUgLyAyKSAtIDNcbiAgICAgICAgKTtcblxuICAgICAgICBjb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9LFxuICAgIGRyYXdOb2RlV2VpZ2h0OiBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICB2YXIgZm9udFNpemUsXG4gICAgICAgICAgICBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJycsXG4gICAgICAgICAgICBzaXplID0gbm9kZVtwcmVmaXggKyAnc2l6ZSddO1xuXG4gICAgICAgIGlmIChzaXplIDwgc2V0dGluZ3MoJ2xhYmVsVGhyZXNob2xkJykpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgZm9udFNpemUgPSAoc2V0dGluZ3MoJ2xhYmVsU2l6ZScpID09PSAnZml4ZWQnKSA/XG4gICAgICAgICAgICBzZXR0aW5ncygnZGVmYXVsdExhYmVsU2l6ZScpIDpcbiAgICAgICAgICAgIHNldHRpbmdzKCdsYWJlbFNpemVSYXRpbycpICogc2l6ZTtcblxuICAgICAgICBjb250ZXh0LmZvbnQgPSAoc2V0dGluZ3MoJ2ZvbnRTdHlsZScpID8gc2V0dGluZ3MoJ2ZvbnRTdHlsZScpICsgJyAnIDogJycpICtcbiAgICAgICAgICAgIGZvbnRTaXplICsgJ3B4ICcgKyBzZXR0aW5ncygnZm9udCcpO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IChzZXR0aW5ncygnbGFiZWxDb2xvcicpID09PSAnbm9kZScpID9cbiAgICAgICAgICAgIChub2RlLmNvbG9yIHx8IHNldHRpbmdzKCdkZWZhdWx0Tm9kZUNvbG9yJykpIDpcbiAgICAgICAgICAgIHNldHRpbmdzKCdkZWZhdWx0TGFiZWxDb2xvcicpO1xuXG4gICAgICAgIGNvbnRleHQudGV4dEFsaWduID0gJ2xlZnQnO1xuICAgICAgICBjb250ZXh0LmZpbGxUZXh0KFxuICAgICAgICAgICAgbm9kZS53ZWlnaHQsXG4gICAgICAgICAgICBNYXRoLnJvdW5kKG5vZGVbcHJlZml4ICsgJ3gnXSArIHNpemUgKiAxLjUpLFxuICAgICAgICAgICAgTWF0aC5yb3VuZChub2RlW3ByZWZpeCArICd5J10gKyBmb250U2l6ZSAvIDMpXG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbnZhciBXZWlnaHRlZERpcmVjdGVkR3JhcGggPSB7XG4gICAgcmFuZG9tOiBmdW5jdGlvbihOLCByYXRpbywgbWluLCBtYXgpIHtcbiAgICAgICAgaWYgKCFOKSBOID0gNTtcbiAgICAgICAgaWYgKCFyYXRpbykgcmF0aW8gPSAuMztcbiAgICAgICAgaWYgKCFtaW4pIG1pbiA9IDE7XG4gICAgICAgIGlmICghbWF4KSBtYXggPSA1O1xuICAgICAgICB2YXIgRyA9IG5ldyBBcnJheShOKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIHtcbiAgICAgICAgICAgIEdbaV0gPSBuZXcgQXJyYXkoTik7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE47IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChpICE9IGogJiYgKE1hdGgucmFuZG9tKCkgKiAoMSAvIHJhdGlvKSB8IDApID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgR1tpXVtqXSA9IChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpIHwgMCkgKyBtaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBHO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFdlaWdodGVkRGlyZWN0ZWRHcmFwaCxcbiAgICBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXJcbn07IiwiY29uc3Qge1xuICAgIFdlaWdodGVkRGlyZWN0ZWRHcmFwaCxcbiAgICBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXJcbn0gPSByZXF1aXJlKCcuL3dlaWdodGVkX2RpcmVjdGVkX2dyYXBoJyk7XG5cbmNvbnN0IHtcbiAgICBVbmRpcmVjdGVkR3JhcGhUcmFjZXJcbn0gPSByZXF1aXJlKCcuL3VuZGlyZWN0ZWRfZ3JhcGgnKTtcblxuZnVuY3Rpb24gV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGhUcmFjZXIoKSB7XG4gICAgaWYgKFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSB7XG4gICAgICAgIFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbldlaWdodGVkVW5kaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHRydWUsIE9iamVjdC5jcmVhdGUoV2VpZ2h0ZWREaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZSksIHtcbiAgICBjb25zdHJ1Y3RvcjogV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGhUcmFjZXIsXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0cmFjZXIgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMucy5zZXR0aW5ncyh7XG4gICAgICAgICAgICBkZWZhdWx0RWRnZVR5cGU6ICdkZWYnLFxuICAgICAgICAgICAgZnVuY0VkZ2VzRGVmOiBmdW5jdGlvbihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSB0cmFjZXIuZ2V0Q29sb3IoZWRnZSwgc291cmNlLCB0YXJnZXQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICB0cmFjZXIuZHJhd0VkZ2UoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgdHJhY2VyLmRyYXdFZGdlV2VpZ2h0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHNldERhdGE6IGZ1bmN0aW9uKEcpIHtcbiAgICAgICAgaWYgKFRyYWNlci5wcm90b3R5cGUuc2V0RGF0YS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB0aGlzLmdyYXBoLmNsZWFyKCk7XG4gICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICB2YXIgZWRnZXMgPSBbXTtcbiAgICAgICAgdmFyIHVuaXRBbmdsZSA9IDIgKiBNYXRoLlBJIC8gRy5sZW5ndGg7XG4gICAgICAgIHZhciBjdXJyZW50QW5nbGUgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGN1cnJlbnRBbmdsZSArPSB1bml0QW5nbGU7XG4gICAgICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5uKGkpLFxuICAgICAgICAgICAgICAgIGxhYmVsOiAnJyArIGksXG4gICAgICAgICAgICAgICAgeDogLjUgKyBNYXRoLnNpbihjdXJyZW50QW5nbGUpIC8gMixcbiAgICAgICAgICAgICAgICB5OiAuNSArIE1hdGguY29zKGN1cnJlbnRBbmdsZSkgLyAyLFxuICAgICAgICAgICAgICAgIHNpemU6IDEsXG4gICAgICAgICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdCxcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgRy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPD0gaTsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKEdbaV1bal0gfHwgR1tqXVtpXSkge1xuICAgICAgICAgICAgICAgICAgICBlZGdlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLmUoaSwgaiksXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMubihpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcy5uKGopLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IuZGVmYXVsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHQ6IEdbaV1bal1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ncmFwaC5yZWFkKHtcbiAgICAgICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgICAgIGVkZ2VzOiBlZGdlc1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zLmNhbWVyYS5nb1RvKHtcbiAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICByYXRpbzogMVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgZTogVW5kaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZS5lLFxuICAgIGRyYXdPbkhvdmVyOiBVbmRpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlLmRyYXdPbkhvdmVyLFxuICAgIGRyYXdFZGdlOiBVbmRpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlLmRyYXdFZGdlLFxuICAgIGRyYXdFZGdlV2VpZ2h0OiBmdW5jdGlvbihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJyc7XG4gICAgICAgIGlmIChzb3VyY2VbcHJlZml4ICsgJ3gnXSA+IHRhcmdldFtwcmVmaXggKyAneCddKSB7XG4gICAgICAgICAgICB2YXIgdGVtcCA9IHNvdXJjZTtcbiAgICAgICAgICAgIHNvdXJjZSA9IHRhcmdldDtcbiAgICAgICAgICAgIHRhcmdldCA9IHRlbXA7XG4gICAgICAgIH1cbiAgICAgICAgV2VpZ2h0ZWREaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZS5kcmF3RWRnZVdlaWdodC5jYWxsKHRoaXMsIGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgIH1cbn0pO1xuXG52YXIgV2VpZ2h0ZWRVbmRpcmVjdGVkR3JhcGggPSB7XG4gICAgcmFuZG9tOiBmdW5jdGlvbihOLCByYXRpbywgbWluLCBtYXgpIHtcbiAgICAgICAgaWYgKCFOKSBOID0gNTtcbiAgICAgICAgaWYgKCFyYXRpbykgcmF0aW8gPSAuMztcbiAgICAgICAgaWYgKCFtaW4pIG1pbiA9IDE7XG4gICAgICAgIGlmICghbWF4KSBtYXggPSA1O1xuICAgICAgICB2YXIgRyA9IG5ldyBBcnJheShOKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIEdbaV0gPSBuZXcgQXJyYXkoTik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE47IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChpID4gaiAmJiAoTWF0aC5yYW5kb20oKSAqICgxIC8gcmF0aW8pIHwgMCkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBHW2ldW2pdID0gR1tqXVtpXSA9IChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpIHwgMCkgKyBtaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBHO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoLFxuICAgIFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoVHJhY2VyXG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICh1cmwpID0+IHtcblxuICByZXR1cm4gcmVxdWVzdCh1cmwsIHtcbiAgICB0eXBlOiAnR0VUJ1xuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgnLi9yZXF1ZXN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJsKSB7XG4gIHJldHVybiByZXF1ZXN0KHVybCwge1xuICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgdHlwZTogJ0dFVCdcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCwgZGF0YSkge1xuICByZXR1cm4gcmVxdWVzdCh1cmwsIHtcbiAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgIHR5cGU6ICdQT1NUJyxcbiAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgUlNWUCA9IHJlcXVpcmUoJ3JzdnAnKTtcbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uLy4uL2FwcCcpO1xuXG5jb25zdCB7XG4gIGFqYXgsXG4gIGV4dGVuZFxufSA9ICQ7XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCwgb3B0aW9ucyA9IHt9KSB7XG4gIGFwcC5zZXRJc0xvYWRpbmcodHJ1ZSk7XG5cbiAgcmV0dXJuIG5ldyBSU1ZQLlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IHtcbiAgICAgIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgYXBwLnNldElzTG9hZGluZyhmYWxzZSk7XG4gICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSxcbiAgICAgIGVycm9yKHJlYXNvbikge1xuICAgICAgICBhcHAuc2V0SXNMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgcmVqZWN0KHJlYXNvbik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IG9wdHMgPSBleHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zLCBjYWxsYmFja3MsIHtcbiAgICAgIHVybFxuICAgIH0pO1xuXG4gICAgYWpheChvcHRzKTtcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vYXBwJyk7XG5jb25zdCBUb2FzdCA9IHJlcXVpcmUoJy4uL2RvbS90b2FzdCcpO1xuXG5jb25zdCBjaGVja0xvYWRpbmcgPSAoKSA9PiB7XG4gIGlmIChhcHAuZ2V0SXNMb2FkaW5nKCkpIHtcbiAgICBUb2FzdC5zaG93RXJyb3JUb2FzdCgnV2FpdCB1bnRpbCBpdCBjb21wbGV0ZXMgbG9hZGluZyBvZiBwcmV2aW91cyBmaWxlLicpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IGdldFBhcmFtZXRlckJ5TmFtZSA9IChuYW1lKSA9PiB7XG4gIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYFs/Jl0ke25hbWV9KD0oW14mI10qKXwmfCN8JClgKTtcblxuICBjb25zdCByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xuXG4gIGlmICghcmVzdWx0cyB8fCByZXN1bHRzLmxlbmd0aCAhPT0gMykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgWywgLCBpZF0gPSByZXN1bHRzO1xuXG4gIHJldHVybiBpZDtcbn07XG5cbmNvbnN0IGdldEhhc2hWYWx1ZSA9IChrZXkpPT4ge1xuICBpZiAoIWtleSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHIoMSk7XG4gIGNvbnN0IHBhcmFtcyA9IGhhc2ggPyBoYXNoLnNwbGl0KCcmJykgOiBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJhbXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwYWlyID0gcGFyYW1zW2ldLnNwbGl0KCc9Jyk7XG4gICAgaWYgKHBhaXJbMF0gPT09IGtleSkge1xuICAgICAgcmV0dXJuIHBhaXJbMV07XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuY29uc3Qgc2V0SGFzaFZhbHVlID0gKGtleSwgdmFsdWUpPT4ge1xuICBpZiAoIWtleSB8fCAhdmFsdWUpIHJldHVybjtcbiAgY29uc3QgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKTtcbiAgY29uc3QgcGFyYW1zID0gaGFzaCA/IGhhc2guc3BsaXQoJyYnKSA6IFtdO1xuXG4gIGxldCBmb3VuZCA9IGZhbHNlO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmFtcy5sZW5ndGggJiYgIWZvdW5kOyBpKyspIHtcbiAgICBjb25zdCBwYWlyID0gcGFyYW1zW2ldLnNwbGl0KCc9Jyk7XG4gICAgaWYgKHBhaXJbMF0gPT09IGtleSkge1xuICAgICAgcGFpclsxXSA9IHZhbHVlO1xuICAgICAgcGFyYW1zW2ldID0gcGFpci5qb2luKCc9Jyk7XG4gICAgICBmb3VuZCA9IHRydWU7XG4gICAgfVxuICB9XG4gIGlmICghZm91bmQpIHtcbiAgICBwYXJhbXMucHVzaChba2V5LCB2YWx1ZV0uam9pbignPScpKTtcbiAgfVxuXG4gIGNvbnN0IG5ld0hhc2ggPSBwYXJhbXMuam9pbignJicpO1xuICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcjJyArIG5ld0hhc2g7XG59O1xuXG5jb25zdCByZW1vdmVIYXNoVmFsdWUgPSAoa2V5KSA9PiB7XG4gIGlmICgha2V5KSByZXR1cm47XG4gIGNvbnN0IGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHIoMSk7XG4gIGNvbnN0IHBhcmFtcyA9IGhhc2ggPyBoYXNoLnNwbGl0KCcmJykgOiBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmFtcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHBhaXIgPSBwYXJhbXNbaV0uc3BsaXQoJz0nKTtcbiAgICBpZiAocGFpclswXSA9PT0ga2V5KSB7XG4gICAgICBwYXJhbXMuc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgbmV3SGFzaCA9IHBhcmFtcy5qb2luKCcmJyk7XG4gIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJyMnICsgbmV3SGFzaDtcbn07XG5cbmNvbnN0IHNldFBhdGggPSAoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSkgPT4ge1xuICBjb25zdCBwYXRoID0gY2F0ZWdvcnkgPyBjYXRlZ29yeSArIChhbGdvcml0aG0gPyAnLycgKyBhbGdvcml0aG0gKyAoZmlsZSA/ICcvJyArIGZpbGUgOiAnJykgOiAnJykgOiAnJztcbiAgc2V0SGFzaFZhbHVlKCdwYXRoJywgcGF0aCk7XG59O1xuXG5jb25zdCBnZXRQYXRoID0gKCkgPT4ge1xuICBjb25zdCBoYXNoID0gZ2V0SGFzaFZhbHVlKCdwYXRoJyk7XG4gIGlmIChoYXNoKSB7XG4gICAgY29uc3QgcGFydHMgPSBoYXNoLnNwbGl0KCcvJyk7XG4gICAgcmV0dXJuIHtjYXRlZ29yeTogcGFydHNbMF0sIGFsZ29yaXRobTogcGFydHNbMV0sIGZpbGU6IHBhcnRzWzJdfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjaGVja0xvYWRpbmcsXG4gIGdldFBhcmFtZXRlckJ5TmFtZSxcbiAgZ2V0SGFzaFZhbHVlLFxuICBzZXRIYXNoVmFsdWUsXG4gIHJlbW92ZUhhc2hWYWx1ZSxcbiAgc2V0UGF0aCxcbiAgZ2V0UGF0aFxufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGxvYWRBbGdvcml0aG0gPSByZXF1aXJlKCcuL2xvYWRfYWxnb3JpdGhtJyk7XG5jb25zdCBsb2FkQ2F0ZWdvcmllcyA9IHJlcXVpcmUoJy4vbG9hZF9jYXRlZ29yaWVzJyk7XG5jb25zdCBsb2FkRmlsZSA9IHJlcXVpcmUoJy4vbG9hZF9maWxlJyk7XG5jb25zdCBsb2FkU2NyYXRjaFBhcGVyID0gcmVxdWlyZSgnLi9sb2FkX3NjcmF0Y2hfcGFwZXInKTtcbmNvbnN0IHNoYXJlU2NyYXRjaFBhcGVyID0gcmVxdWlyZSgnLi9zaGFyZV9zY3JhdGNoX3BhcGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBsb2FkQWxnb3JpdGhtLFxuICBsb2FkQ2F0ZWdvcmllcyxcbiAgbG9hZEZpbGUsXG4gIGxvYWRTY3JhdGNoUGFwZXIsXG4gIHNoYXJlU2NyYXRjaFBhcGVyXG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZ2V0SlNPTiA9IHJlcXVpcmUoJy4vYWpheC9nZXRfanNvbicpO1xuXG5jb25zdCB7XG4gIGdldEFsZ29yaXRobURpclxufSA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGNhdGVnb3J5LCBhbGdvcml0aG0pID0+IHtcbiAgY29uc3QgZGlyID0gZ2V0QWxnb3JpdGhtRGlyKGNhdGVnb3J5LCBhbGdvcml0aG0pO1xuICByZXR1cm4gZ2V0SlNPTihgJHtkaXJ9ZGVzYy5qc29uYCk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZ2V0SlNPTiA9IHJlcXVpcmUoJy4vYWpheC9nZXRfanNvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgcmV0dXJuIGdldEpTT04oJy4vYWxnb3JpdGhtL2NhdGVnb3J5Lmpzb24nKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBSU1ZQID0gcmVxdWlyZSgncnN2cCcpO1xuXG5jb25zdCBhcHAgPSByZXF1aXJlKCcuLi9hcHAnKTtcblxuY29uc3Qge1xuICBnZXRGaWxlRGlyLFxuICBpc1NjcmF0Y2hQYXBlclxufSA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbmNvbnN0IHtcbiAgY2hlY2tMb2FkaW5nLFxuICBzZXRQYXRoXG59ID0gcmVxdWlyZSgnLi9oZWxwZXJzJyk7XG5cbmNvbnN0IGdldCA9IHJlcXVpcmUoJy4vYWpheC9nZXQnKTtcblxuY29uc3QgbG9hZERhdGFBbmRDb2RlID0gKGRpcikgPT4ge1xuICByZXR1cm4gUlNWUC5oYXNoKHtcbiAgICBkYXRhOiBnZXQoYCR7ZGlyfWRhdGEuanNgKSxcbiAgICBjb2RlOiBnZXQoYCR7ZGlyfWNvZGUuanNgKVxuICB9KTtcbn07XG5cbmNvbnN0IGxvYWRGaWxlQW5kVXBkYXRlQ29udGVudCA9IChkaXIpID0+IHtcbiAgYXBwLmdldEVkaXRvcigpLmNsZWFyQ29udGVudCgpO1xuXG4gIHJldHVybiBsb2FkRGF0YUFuZENvZGUoZGlyKS50aGVuKChjb250ZW50KSA9PiB7XG4gICAgYXBwLnVwZGF0ZUNhY2hlZEZpbGUoZGlyLCBjb250ZW50KTtcbiAgICBhcHAuZ2V0RWRpdG9yKCkuc2V0Q29udGVudChjb250ZW50KTtcbiAgfSk7XG59O1xuXG5jb25zdCBjYWNoZWRDb250ZW50RXhpc3RzID0gKGNhY2hlZEZpbGUpID0+IHtcbiAgcmV0dXJuIGNhY2hlZEZpbGUgJiZcbiAgICBjYWNoZWRGaWxlLmRhdGEgIT09IHVuZGVmaW5lZCAmJlxuICAgIGNhY2hlZEZpbGUuY29kZSAhPT0gdW5kZWZpbmVkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSAoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSwgZXhwbGFuYXRpb24pID0+IHtcbiAgcmV0dXJuIG5ldyBSU1ZQLlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGlmIChjaGVja0xvYWRpbmcoKSkge1xuICAgICAgcmVqZWN0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NjcmF0Y2hQYXBlcihjYXRlZ29yeSkpIHtcbiAgICAgICAgc2V0UGF0aChjYXRlZ29yeSwgYXBwLmdldExvYWRlZFNjcmF0Y2goKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRQYXRoKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUpO1xuICAgICAgfVxuICAgICAgJCgnI2V4cGxhbmF0aW9uJykuaHRtbChleHBsYW5hdGlvbik7XG5cbiAgICAgIGxldCBkaXIgPSBnZXRGaWxlRGlyKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUpO1xuICAgICAgYXBwLnNldExhc3RGaWxlVXNlZChkaXIpO1xuICAgICAgY29uc3QgY2FjaGVkRmlsZSA9IGFwcC5nZXRDYWNoZWRGaWxlKGRpcik7XG5cbiAgICAgIGlmIChjYWNoZWRDb250ZW50RXhpc3RzKGNhY2hlZEZpbGUpKSB7XG4gICAgICAgIGFwcC5nZXRFZGl0b3IoKS5zZXRDb250ZW50KGNhY2hlZEZpbGUpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2FkRmlsZUFuZFVwZGF0ZUNvbnRlbnQoZGlyKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBSU1ZQID0gcmVxdWlyZSgncnN2cCcpO1xuY29uc3QgYXBwID0gcmVxdWlyZSgnLi4vYXBwJyk7XG5cbmNvbnN0IHtcbiAgZ2V0RmlsZURpclxufSA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbmNvbnN0IGdldEpTT04gPSByZXF1aXJlKCcuL2FqYXgvZ2V0X2pzb24nKTtcbmNvbnN0IGxvYWRBbGdvcml0aG0gPSByZXF1aXJlKCcuL2xvYWRfYWxnb3JpdGhtJyk7XG5cbmNvbnN0IGV4dHJhY3RHaXN0Q29kZSA9IChmaWxlcywgbmFtZSkgPT4gZmlsZXNbYCR7bmFtZX0uanNgXS5jb250ZW50O1xuXG5tb2R1bGUuZXhwb3J0cyA9IChnaXN0SUQpID0+IHtcbiAgcmV0dXJuIG5ldyBSU1ZQLlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGFwcC5zZXRMb2FkZWRTY3JhdGNoKGdpc3RJRCk7XG5cbiAgICBnZXRKU09OKGBodHRwczovL2FwaS5naXRodWIuY29tL2dpc3RzLyR7Z2lzdElEfWApLnRoZW4oKHtcbiAgICAgIGZpbGVzXG4gICAgfSkgPT4ge1xuXG4gICAgICBjb25zdCBjYXRlZ29yeSA9ICdzY3JhdGNoJztcbiAgICAgIGNvbnN0IGFsZ29yaXRobSA9IGdpc3RJRDtcblxuICAgICAgbG9hZEFsZ29yaXRobShjYXRlZ29yeSwgYWxnb3JpdGhtKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgY29uc3QgYWxnb0RhdGEgPSBleHRyYWN0R2lzdENvZGUoZmlsZXMsICdkYXRhJyk7XG4gICAgICAgIGNvbnN0IGFsZ29Db2RlID0gZXh0cmFjdEdpc3RDb2RlKGZpbGVzLCAnY29kZScpO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBzY3JhdGNoIHBhcGVyIGFsZ28gY29kZSB3aXRoIHRoZSBsb2FkZWQgZ2lzdCBjb2RlXG4gICAgICAgIGNvbnN0IGRpciA9IGdldEZpbGVEaXIoY2F0ZWdvcnksIGFsZ29yaXRobSwgJ3NjcmF0Y2hfcGFwZXInKTtcbiAgICAgICAgYXBwLnVwZGF0ZUNhY2hlZEZpbGUoZGlyLCB7XG4gICAgICAgICAgZGF0YTogYWxnb0RhdGEsXG4gICAgICAgICAgY29kZTogYWxnb0NvZGUsXG4gICAgICAgICAgJ0NSRURJVC5tZCc6ICdTaGFyZWQgYnkgYW4gYW5vbnltb3VzIHVzZXIgZnJvbSBodHRwOi8vcGFya2pzODE0LmdpdGh1Yi5pby9BbGdvcml0aG1WaXN1YWxpemVyJ1xuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICBjYXRlZ29yeSxcbiAgICAgICAgICBhbGdvcml0aG0sXG4gICAgICAgICAgZGF0YVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFJTVlAgPSByZXF1aXJlKCdyc3ZwJyk7XG5jb25zdCBhcHAgPSByZXF1aXJlKCcuLi9hcHAnKTtcblxuY29uc3QgcG9zdEpTT04gPSByZXF1aXJlKCcuL2FqYXgvcG9zdF9qc29uJyk7XG5cbmNvbnN0IHtcbiAgc2V0UGF0aFxufSA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgcmV0dXJuIG5ldyBSU1ZQLlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgY29uc3Qge1xuICAgICAgZGF0YUVkaXRvcixcbiAgICAgIGNvZGVFZGl0b3JcbiAgICB9ID0gYXBwLmdldEVkaXRvcigpO1xuXG4gICAgY29uc3QgZ2lzdCA9IHtcbiAgICAgICdkZXNjcmlwdGlvbic6ICd0ZW1wJyxcbiAgICAgICdwdWJsaWMnOiB0cnVlLFxuICAgICAgJ2ZpbGVzJzoge1xuICAgICAgICAnZGF0YS5qcyc6IHtcbiAgICAgICAgICAnY29udGVudCc6IGRhdGFFZGl0b3IuZ2V0VmFsdWUoKVxuICAgICAgICB9LFxuICAgICAgICAnY29kZS5qcyc6IHtcbiAgICAgICAgICAnY29udGVudCc6IGNvZGVFZGl0b3IuZ2V0VmFsdWUoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBvc3RKU09OKCdodHRwczovL2FwaS5naXRodWIuY29tL2dpc3RzJywgZ2lzdCkudGhlbigoe1xuICAgICAgaWRcbiAgICB9KSA9PiB7XG4gICAgICBhcHAuc2V0TG9hZGVkU2NyYXRjaChpZCk7XG4gICAgICBzZXRQYXRoKCdzY3JhdGNoJywgaWQpO1xuICAgICAgY29uc3Qge1xuICAgICAgICBocmVmXG4gICAgICB9ID0gbG9jYXRpb247XG4gICAgICAkKCcjYWxnb3JpdGhtJykuaHRtbCgnU2hhcmVkJyk7XG4gICAgICByZXNvbHZlKGhyZWYpO1xuICAgIH0pO1xuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBUcmFjZXJNYW5hZ2VyID0gcmVxdWlyZSgnLi9tYW5hZ2VyJyk7XG5jb25zdCBUcmFjZXIgPSByZXF1aXJlKCcuLi9tb2R1bGUvdHJhY2VyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGluaXQoKSB7XG4gICAgY29uc3QgdG0gPSBuZXcgVHJhY2VyTWFuYWdlcigpO1xuICAgIFRyYWNlci5wcm90b3R5cGUubWFuYWdlciA9IHRtO1xuICAgIHJldHVybiB0bTtcbiAgfVxuXG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc3RlcExpbWl0ID0gMWU2O1xuXG5jb25zdCBUcmFjZXJNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudGltZXIgPSBudWxsO1xuICB0aGlzLnBhdXNlID0gZmFsc2U7XG4gIHRoaXMuY2Fwc3VsZXMgPSBbXTtcbiAgdGhpcy5pbnRlcnZhbCA9IDUwMDtcbn07XG5cblRyYWNlck1hbmFnZXIucHJvdG90eXBlID0ge1xuXG4gIGFkZCh0cmFjZXIpIHtcblxuICAgIGNvbnN0ICRjb250YWluZXIgPSAkKCc8c2VjdGlvbiBjbGFzcz1cIm1vZHVsZV93cmFwcGVyXCI+Jyk7XG4gICAgJCgnLm1vZHVsZV9jb250YWluZXInKS5hcHBlbmQoJGNvbnRhaW5lcik7XG5cbiAgICBjb25zdCBjYXBzdWxlID0ge1xuICAgICAgbW9kdWxlOiB0cmFjZXIubW9kdWxlLFxuICAgICAgdHJhY2VyLFxuICAgICAgYWxsb2NhdGVkOiB0cnVlLFxuICAgICAgZGVmYXVsdE5hbWU6IG51bGwsXG4gICAgICAkY29udGFpbmVyLFxuICAgICAgaXNOZXc6IHRydWVcbiAgICB9O1xuXG4gICAgdGhpcy5jYXBzdWxlcy5wdXNoKGNhcHN1bGUpO1xuICAgIHJldHVybiBjYXBzdWxlO1xuICB9LFxuXG4gIGFsbG9jYXRlKG5ld1RyYWNlcikge1xuICAgIGxldCBzZWxlY3RlZENhcHN1bGUgPSBudWxsO1xuICAgIGxldCBjb3VudCA9IDA7XG5cbiAgICAkLmVhY2godGhpcy5jYXBzdWxlcywgKGksIGNhcHN1bGUpID0+IHtcbiAgICAgIGlmIChjYXBzdWxlLm1vZHVsZSA9PT0gbmV3VHJhY2VyLm1vZHVsZSkge1xuICAgICAgICBjb3VudCsrO1xuICAgICAgICBpZiAoIWNhcHN1bGUuYWxsb2NhdGVkKSB7XG4gICAgICAgICAgY2Fwc3VsZS50cmFjZXIgPSBuZXdUcmFjZXI7XG4gICAgICAgICAgY2Fwc3VsZS5hbGxvY2F0ZWQgPSB0cnVlO1xuICAgICAgICAgIGNhcHN1bGUuaXNOZXcgPSBmYWxzZTtcbiAgICAgICAgICBzZWxlY3RlZENhcHN1bGUgPSBjYXBzdWxlO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHNlbGVjdGVkQ2Fwc3VsZSA9PT0gbnVsbCkge1xuICAgICAgY291bnQrKztcbiAgICAgIHNlbGVjdGVkQ2Fwc3VsZSA9IHRoaXMuYWRkKG5ld1RyYWNlcik7XG4gICAgfVxuXG4gICAgc2VsZWN0ZWRDYXBzdWxlLmRlZmF1bHROYW1lID0gYCR7bmV3VHJhY2VyLmNvbnN0cnVjdG9yLm5hbWV9ICR7Y291bnR9YDtcbiAgICByZXR1cm4gc2VsZWN0ZWRDYXBzdWxlO1xuICB9LFxuXG4gIGRlYWxsb2NhdGVBbGwoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICAgICQuZWFjaCh0aGlzLmNhcHN1bGVzLCAoaSwgY2Fwc3VsZSkgPT4ge1xuICAgICAgY2Fwc3VsZS5hbGxvY2F0ZWQgPSBmYWxzZTtcbiAgICB9KTtcbiAgfSxcblxuICByZW1vdmVVbmFsbG9jYXRlZCgpIHtcbiAgICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5jYXBzdWxlcyA9ICQuZ3JlcCh0aGlzLmNhcHN1bGVzLCAoY2Fwc3VsZSkgPT4ge1xuICAgICAgbGV0IHJlbW92ZWQgPSAhY2Fwc3VsZS5hbGxvY2F0ZWQ7XG5cbiAgICAgIGlmIChjYXBzdWxlLmlzTmV3IHx8IHJlbW92ZWQpIHtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgICBjYXBzdWxlLiRjb250YWluZXIucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAhcmVtb3ZlZDtcbiAgICB9KTtcblxuICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICB0aGlzLnBsYWNlKCk7XG4gICAgfVxuICB9LFxuXG4gIHBsYWNlKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNhcHN1bGVzXG4gICAgfSA9IHRoaXM7XG5cbiAgICAkLmVhY2goY2Fwc3VsZXMsIChpLCBjYXBzdWxlKSA9PiB7XG4gICAgICBsZXQgd2lkdGggPSAxMDA7XG4gICAgICBsZXQgaGVpZ2h0ID0gKDEwMCAvIGNhcHN1bGVzLmxlbmd0aCk7XG4gICAgICBsZXQgdG9wID0gaGVpZ2h0ICogaTtcblxuICAgICAgY2Fwc3VsZS4kY29udGFpbmVyLmNzcyh7XG4gICAgICAgIHRvcDogYCR7dG9wfSVgLFxuICAgICAgICB3aWR0aDogYCR7d2lkdGh9JWAsXG4gICAgICAgIGhlaWdodDogYCR7aGVpZ2h0fSVgXG4gICAgICB9KTtcblxuICAgICAgY2Fwc3VsZS50cmFjZXIucmVzaXplKCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgcmVzaXplKCkge1xuICAgIHRoaXMuY29tbWFuZCgncmVzaXplJyk7XG4gIH0sXG5cbiAgaXNQYXVzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXVzZTtcbiAgfSxcblxuICBzZXRJbnRlcnZhbChpbnRlcnZhbCkge1xuICAgICQoJyNpbnRlcnZhbCcpLnZhbChpbnRlcnZhbCk7XG4gIH0sXG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50cmFjZXMgPSBbXTtcbiAgICB0aGlzLnRyYWNlSW5kZXggPSAtMTtcbiAgICB0aGlzLnN0ZXBDbnQgPSAwO1xuICAgIGlmICh0aGlzLnRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgfVxuICAgIHRoaXMuY29tbWFuZCgnY2xlYXInKTtcbiAgfSxcblxuICBwdXNoU3RlcChjYXBzdWxlLCBzdGVwKSB7XG4gICAgaWYgKHRoaXMuc3RlcENudCsrID4gc3RlcExpbWl0KSB0aHJvdyBcIlRyYWNlcidzIHN0YWNrIG92ZXJmbG93XCI7XG4gICAgbGV0IGxlbiA9IHRoaXMudHJhY2VzLmxlbmd0aDtcbiAgICBsZXQgbGFzdCA9IFtdO1xuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHRoaXMudHJhY2VzLnB1c2gobGFzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxhc3QgPSB0aGlzLnRyYWNlc1tsZW4gLSAxXTtcbiAgICB9XG4gICAgbGFzdC5wdXNoKCQuZXh0ZW5kKHN0ZXAsIHtcbiAgICAgIGNhcHN1bGVcbiAgICB9KSk7XG4gIH0sXG5cbiAgbmV3U3RlcCgpIHtcbiAgICB0aGlzLnRyYWNlcy5wdXNoKFtdKTtcbiAgfSxcblxuICBwYXVzZVN0ZXAoKSB7XG4gICAgaWYgKHRoaXMudHJhY2VJbmRleCA8IDApIHJldHVybjtcbiAgICB0aGlzLnBhdXNlID0gdHJ1ZTtcbiAgICBpZiAodGhpcy50aW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgIH1cbiAgICAkKCcjYnRuX3BhdXNlJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICB9LFxuXG4gIHJlc3VtZVN0ZXAoKSB7XG4gICAgdGhpcy5wYXVzZSA9IGZhbHNlO1xuICAgIHRoaXMuc3RlcCh0aGlzLnRyYWNlSW5kZXggKyAxKTtcbiAgICAkKCcjYnRuX3BhdXNlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9LFxuXG4gIHN0ZXAoaSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgdHJhY2VyID0gdGhpcztcblxuICAgIGlmIChpc05hTihpKSB8fCBpID49IHRoaXMudHJhY2VzLmxlbmd0aCB8fCBpIDwgMCkgcmV0dXJuO1xuXG4gICAgdGhpcy50cmFjZUluZGV4ID0gaTtcbiAgICBjb25zdCB0cmFjZSA9IHRoaXMudHJhY2VzW2ldO1xuICAgIHRyYWNlLmZvckVhY2goKHN0ZXApID0+IHtcbiAgICAgIHN0ZXAuY2Fwc3VsZS50cmFjZXIucHJvY2Vzc1N0ZXAoc3RlcCwgb3B0aW9ucyk7XG4gICAgfSk7XG5cbiAgICBpZiAoIW9wdGlvbnMudmlydHVhbCkge1xuICAgICAgdGhpcy5jb21tYW5kKCdyZWZyZXNoJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGF1c2UpIHJldHVybjtcblxuICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRyYWNlci5zdGVwKGkgKyAxLCBvcHRpb25zKTtcbiAgICB9LCB0aGlzLmludGVydmFsKTtcbiAgfSxcblxuICBwcmV2U3RlcCgpIHtcbiAgICB0aGlzLmNvbW1hbmQoJ2NsZWFyJyk7XG5cbiAgICBjb25zdCBmaW5hbEluZGV4ID0gdGhpcy50cmFjZUluZGV4IC0gMTtcbiAgICBpZiAoZmluYWxJbmRleCA8IDApIHtcbiAgICAgIHRoaXMudHJhY2VJbmRleCA9IC0xO1xuICAgICAgdGhpcy5jb21tYW5kKCdyZWZyZXNoJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaW5hbEluZGV4OyBpKyspIHtcbiAgICAgIHRoaXMuc3RlcChpLCB7XG4gICAgICAgIHZpcnR1YWw6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuc3RlcChmaW5hbEluZGV4KTtcbiAgfSxcblxuICBuZXh0U3RlcCgpIHtcbiAgICB0aGlzLnN0ZXAodGhpcy50cmFjZUluZGV4ICsgMSk7XG4gIH0sXG5cbiAgdmlzdWFsaXplKCkge1xuICAgIHRoaXMudHJhY2VJbmRleCA9IC0xO1xuICAgIHRoaXMucmVzdW1lU3RlcCgpO1xuICB9LFxuXG4gIGNvbW1hbmQoLi4uYXJncykge1xuICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICAkLmVhY2godGhpcy5jYXBzdWxlcywgKGksIGNhcHN1bGUpID0+IHtcbiAgICAgIGlmIChjYXBzdWxlLmFsbG9jYXRlZCkge1xuICAgICAgICBjYXBzdWxlLnRyYWNlci5tb2R1bGUucHJvdG90eXBlW2Z1bmN0aW9uTmFtZV0uYXBwbHkoY2Fwc3VsZS50cmFjZXIsIGFyZ3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIGZpbmRPd25lcihjb250YWluZXIpIHtcbiAgICBsZXQgc2VsZWN0ZWRDYXBzdWxlID0gbnVsbDtcbiAgICAkLmVhY2godGhpcy5jYXBzdWxlcywgKGksIGNhcHN1bGUpID0+IHtcbiAgICAgIGlmIChjYXBzdWxlLiRjb250YWluZXJbMF0gPT09IGNvbnRhaW5lcikge1xuICAgICAgICBzZWxlY3RlZENhcHN1bGUgPSBjYXBzdWxlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHNlbGVjdGVkQ2Fwc3VsZS50cmFjZXI7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2VyTWFuYWdlcjsiLCJjb25zdCB7XG4gIHBhcnNlXG59ID0gSlNPTjtcblxuY29uc3QgZnJvbUpTT04gPSAob2JqKSA9PiB7XG4gIHJldHVybiBwYXJzZShvYmosIChrZXksIHZhbHVlKSA9PiB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAnSW5maW5pdHknID8gSW5maW5pdHkgOiB2YWx1ZTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyb21KU09OOyIsImNvbnN0IHRvSlNPTiA9IHJlcXVpcmUoJy4vdG9fanNvbicpO1xuY29uc3QgZnJvbUpTT04gPSByZXF1aXJlKCcuL2Zyb21fanNvbicpO1xuY29uc3QgcmVmaW5lQnlUeXBlID0gcmVxdWlyZSgnLi9yZWZpbmVfYnlfdHlwZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdG9KU09OLFxuICBmcm9tSlNPTixcbiAgcmVmaW5lQnlUeXBlXG59OyIsImNvbnN0IHJlZmluZUJ5VHlwZSA9IChpdGVtKSA9PiB7XG4gIHJldHVybiB0eXBlb2YoaXRlbSkgPT09ICdudW1iZXInID8gcmVmaW5lTnVtYmVyKGl0ZW0pIDogcmVmaW5lU3RyaW5nKGl0ZW0pO1xufTtcblxuY29uc3QgcmVmaW5lU3RyaW5nID0gKHN0cikgPT4ge1xuICByZXR1cm4gc3RyID09PSAnJyA/ICcgJyA6IHN0cjtcbn07XG5cbmNvbnN0IHJlZmluZU51bWJlciA9IChudW0pID0+IHtcbiAgcmV0dXJuIG51bSA9PT0gSW5maW5pdHkgPyAn4oieJyA6IG51bTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcmVmaW5lQnlUeXBlOyIsImNvbnN0IHtcbiAgc3RyaW5naWZ5XG59ID0gSlNPTjtcblxuY29uc3QgdG9KU09OID0gKG9iaikgPT4ge1xuICByZXR1cm4gc3RyaW5naWZ5KG9iaiwgKGtleSwgdmFsdWUpID0+IHtcbiAgICByZXR1cm4gdmFsdWUgPT09IEluZmluaXR5ID8gJ0luZmluaXR5JyA6IHZhbHVlO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdG9KU09OOyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgaXNTY3JhdGNoUGFwZXIgPSAoY2F0ZWdvcnksIGFsZ29yaXRobSkgPT4ge1xuICByZXR1cm4gY2F0ZWdvcnkgPT0gJ3NjcmF0Y2gnO1xufTtcblxuY29uc3QgZ2V0QWxnb3JpdGhtRGlyID0gKGNhdGVnb3J5LCBhbGdvcml0aG0pID0+IHtcbiAgaWYgKGlzU2NyYXRjaFBhcGVyKGNhdGVnb3J5KSkgcmV0dXJuICcuL2FsZ29yaXRobS9zY3JhdGNoX3BhcGVyLyc7XG4gIHJldHVybiBgLi9hbGdvcml0aG0vJHtjYXRlZ29yeX0vJHthbGdvcml0aG19L2A7XG59O1xuXG5jb25zdCBnZXRGaWxlRGlyID0gKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUpID0+IHtcbiAgaWYgKGlzU2NyYXRjaFBhcGVyKGNhdGVnb3J5KSkgcmV0dXJuICcuL2FsZ29yaXRobS9zY3JhdGNoX3BhcGVyLyc7XG4gIHJldHVybiBgLi9hbGdvcml0aG0vJHtjYXRlZ29yeX0vJHthbGdvcml0aG19LyR7ZmlsZX0vYDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc1NjcmF0Y2hQYXBlcixcbiAgZ2V0QWxnb3JpdGhtRGlyLFxuICBnZXRGaWxlRGlyXG59OyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyohXG4gKiBAb3ZlcnZpZXcgUlNWUCAtIGEgdGlueSBpbXBsZW1lbnRhdGlvbiBvZiBQcm9taXNlcy9BKy5cbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE0IFllaHVkYSBLYXR6LCBUb20gRGFsZSwgU3RlZmFuIFBlbm5lciBhbmQgY29udHJpYnV0b3JzXG4gKiBAbGljZW5zZSAgIExpY2Vuc2VkIHVuZGVyIE1JVCBsaWNlbnNlXG4gKiAgICAgICAgICAgIFNlZSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vdGlsZGVpby9yc3ZwLmpzL21hc3Rlci9MSUNFTlNFXG4gKiBAdmVyc2lvbiAgIDMuMi4xXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHV0aWxzJCRvYmplY3RPckZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJyB8fCAodHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGwpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHV0aWxzJCRpc0Z1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCR1dGlscyQkaXNNYXliZVRoZW5hYmxlKHgpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkdXRpbHMkJF9pc0FycmF5O1xuICAgIGlmICghQXJyYXkuaXNBcnJheSkge1xuICAgICAgbGliJHJzdnAkdXRpbHMkJF9pc0FycmF5ID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpYiRyc3ZwJHV0aWxzJCRfaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJHV0aWxzJCRpc0FycmF5ID0gbGliJHJzdnAkdXRpbHMkJF9pc0FycmF5O1xuXG4gICAgdmFyIGxpYiRyc3ZwJHV0aWxzJCRub3cgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpOyB9O1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkdXRpbHMkJEYoKSB7IH1cblxuICAgIHZhciBsaWIkcnN2cCR1dGlscyQkb19jcmVhdGUgPSAoT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiAobykge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU2Vjb25kIGFyZ3VtZW50IG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgICAgIH1cbiAgICAgIGxpYiRyc3ZwJHV0aWxzJCRGLnByb3RvdHlwZSA9IG87XG4gICAgICByZXR1cm4gbmV3IGxpYiRyc3ZwJHV0aWxzJCRGKCk7XG4gICAgfSk7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkZXZlbnRzJCRpbmRleE9mKGNhbGxiYWNrcywgY2FsbGJhY2spIHtcbiAgICAgIGZvciAodmFyIGk9MCwgbD1jYWxsYmFja3MubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgICAgICBpZiAoY2FsbGJhY2tzW2ldID09PSBjYWxsYmFjaykgeyByZXR1cm4gaTsgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkZXZlbnRzJCRjYWxsYmFja3NGb3Iob2JqZWN0KSB7XG4gICAgICB2YXIgY2FsbGJhY2tzID0gb2JqZWN0Ll9wcm9taXNlQ2FsbGJhY2tzO1xuXG4gICAgICBpZiAoIWNhbGxiYWNrcykge1xuICAgICAgICBjYWxsYmFja3MgPSBvYmplY3QuX3Byb21pc2VDYWxsYmFja3MgPSB7fTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNhbGxiYWNrcztcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkZXZlbnRzJCRkZWZhdWx0ID0ge1xuXG4gICAgICAvKipcbiAgICAgICAgYFJTVlAuRXZlbnRUYXJnZXQubWl4aW5gIGV4dGVuZHMgYW4gb2JqZWN0IHdpdGggRXZlbnRUYXJnZXQgbWV0aG9kcy4gRm9yXG4gICAgICAgIEV4YW1wbGU6XG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICB2YXIgb2JqZWN0ID0ge307XG5cbiAgICAgICAgUlNWUC5FdmVudFRhcmdldC5taXhpbihvYmplY3QpO1xuXG4gICAgICAgIG9iamVjdC5vbignZmluaXNoZWQnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIC8vIGhhbmRsZSBldmVudFxuICAgICAgICB9KTtcblxuICAgICAgICBvYmplY3QudHJpZ2dlcignZmluaXNoZWQnLCB7IGRldGFpbDogdmFsdWUgfSk7XG4gICAgICAgIGBgYFxuXG4gICAgICAgIGBFdmVudFRhcmdldC5taXhpbmAgYWxzbyB3b3JrcyB3aXRoIHByb3RvdHlwZXM6XG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICB2YXIgUGVyc29uID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgICAgUlNWUC5FdmVudFRhcmdldC5taXhpbihQZXJzb24ucHJvdG90eXBlKTtcblxuICAgICAgICB2YXIgeWVodWRhID0gbmV3IFBlcnNvbigpO1xuICAgICAgICB2YXIgdG9tID0gbmV3IFBlcnNvbigpO1xuXG4gICAgICAgIHllaHVkYS5vbigncG9rZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1llaHVkYSBzYXlzIE9XJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRvbS5vbigncG9rZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1RvbSBzYXlzIE9XJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHllaHVkYS50cmlnZ2VyKCdwb2tlJyk7XG4gICAgICAgIHRvbS50cmlnZ2VyKCdwb2tlJyk7XG4gICAgICAgIGBgYFxuXG4gICAgICAgIEBtZXRob2QgbWl4aW5cbiAgICAgICAgQGZvciBSU1ZQLkV2ZW50VGFyZ2V0XG4gICAgICAgIEBwcml2YXRlXG4gICAgICAgIEBwYXJhbSB7T2JqZWN0fSBvYmplY3Qgb2JqZWN0IHRvIGV4dGVuZCB3aXRoIEV2ZW50VGFyZ2V0IG1ldGhvZHNcbiAgICAgICovXG4gICAgICAnbWl4aW4nOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgb2JqZWN0WydvbiddICAgICAgPSB0aGlzWydvbiddO1xuICAgICAgICBvYmplY3RbJ29mZiddICAgICA9IHRoaXNbJ29mZiddO1xuICAgICAgICBvYmplY3RbJ3RyaWdnZXInXSA9IHRoaXNbJ3RyaWdnZXInXTtcbiAgICAgICAgb2JqZWN0Ll9wcm9taXNlQ2FsbGJhY2tzID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIHdoZW4gYGV2ZW50TmFtZWAgaXMgdHJpZ2dlcmVkXG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICBvYmplY3Qub24oJ2V2ZW50JywgZnVuY3Rpb24oZXZlbnRJbmZvKXtcbiAgICAgICAgICAvLyBoYW5kbGUgdGhlIGV2ZW50XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG9iamVjdC50cmlnZ2VyKCdldmVudCcpO1xuICAgICAgICBgYGBcblxuICAgICAgICBAbWV0aG9kIG9uXG4gICAgICAgIEBmb3IgUlNWUC5FdmVudFRhcmdldFxuICAgICAgICBAcHJpdmF0ZVxuICAgICAgICBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIG5hbWUgb2YgdGhlIGV2ZW50IHRvIGxpc3RlbiBmb3JcbiAgICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICAgICovXG4gICAgICAnb24nOiBmdW5jdGlvbihldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbGxDYWxsYmFja3MgPSBsaWIkcnN2cCRldmVudHMkJGNhbGxiYWNrc0Zvcih0aGlzKSwgY2FsbGJhY2tzO1xuXG4gICAgICAgIGNhbGxiYWNrcyA9IGFsbENhbGxiYWNrc1tldmVudE5hbWVdO1xuXG4gICAgICAgIGlmICghY2FsbGJhY2tzKSB7XG4gICAgICAgICAgY2FsbGJhY2tzID0gYWxsQ2FsbGJhY2tzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaWIkcnN2cCRldmVudHMkJGluZGV4T2YoY2FsbGJhY2tzLCBjYWxsYmFjaykgPT09IC0xKSB7XG4gICAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAgWW91IGNhbiB1c2UgYG9mZmAgdG8gc3RvcCBmaXJpbmcgYSBwYXJ0aWN1bGFyIGNhbGxiYWNrIGZvciBhbiBldmVudDpcblxuICAgICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICAgIGZ1bmN0aW9uIGRvU3R1ZmYoKSB7IC8vIGRvIHN0dWZmISB9XG4gICAgICAgIG9iamVjdC5vbignc3R1ZmYnLCBkb1N0dWZmKTtcblxuICAgICAgICBvYmplY3QudHJpZ2dlcignc3R1ZmYnKTsgLy8gZG9TdHVmZiB3aWxsIGJlIGNhbGxlZFxuXG4gICAgICAgIC8vIFVucmVnaXN0ZXIgT05MWSB0aGUgZG9TdHVmZiBjYWxsYmFja1xuICAgICAgICBvYmplY3Qub2ZmKCdzdHVmZicsIGRvU3R1ZmYpO1xuICAgICAgICBvYmplY3QudHJpZ2dlcignc3R1ZmYnKTsgLy8gZG9TdHVmZiB3aWxsIE5PVCBiZSBjYWxsZWRcbiAgICAgICAgYGBgXG5cbiAgICAgICAgSWYgeW91IGRvbid0IHBhc3MgYSBgY2FsbGJhY2tgIGFyZ3VtZW50IHRvIGBvZmZgLCBBTEwgY2FsbGJhY2tzIGZvciB0aGVcbiAgICAgICAgZXZlbnQgd2lsbCBub3QgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgZXZlbnQgZmlyZXMuIEZvciBleGFtcGxlOlxuXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgdmFyIGNhbGxiYWNrMSA9IGZ1bmN0aW9uKCl7fTtcbiAgICAgICAgdmFyIGNhbGxiYWNrMiA9IGZ1bmN0aW9uKCl7fTtcblxuICAgICAgICBvYmplY3Qub24oJ3N0dWZmJywgY2FsbGJhY2sxKTtcbiAgICAgICAgb2JqZWN0Lm9uKCdzdHVmZicsIGNhbGxiYWNrMik7XG5cbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ3N0dWZmJyk7IC8vIGNhbGxiYWNrMSBhbmQgY2FsbGJhY2syIHdpbGwgYmUgZXhlY3V0ZWQuXG5cbiAgICAgICAgb2JqZWN0Lm9mZignc3R1ZmYnKTtcbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ3N0dWZmJyk7IC8vIGNhbGxiYWNrMSBhbmQgY2FsbGJhY2syIHdpbGwgbm90IGJlIGV4ZWN1dGVkIVxuICAgICAgICBgYGBcblxuICAgICAgICBAbWV0aG9kIG9mZlxuICAgICAgICBAZm9yIFJTVlAuRXZlbnRUYXJnZXRcbiAgICAgICAgQHByaXZhdGVcbiAgICAgICAgQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBldmVudCB0byBzdG9wIGxpc3RlbmluZyB0b1xuICAgICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBvcHRpb25hbCBhcmd1bWVudC4gSWYgZ2l2ZW4sIG9ubHkgdGhlIGZ1bmN0aW9uXG4gICAgICAgIGdpdmVuIHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBldmVudCdzIGNhbGxiYWNrIHF1ZXVlLiBJZiBubyBgY2FsbGJhY2tgXG4gICAgICAgIGFyZ3VtZW50IGlzIGdpdmVuLCBhbGwgY2FsbGJhY2tzIHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBldmVudCdzIGNhbGxiYWNrXG4gICAgICAgIHF1ZXVlLlxuICAgICAgKi9cbiAgICAgICdvZmYnOiBmdW5jdGlvbihldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBhbGxDYWxsYmFja3MgPSBsaWIkcnN2cCRldmVudHMkJGNhbGxiYWNrc0Zvcih0aGlzKSwgY2FsbGJhY2tzLCBpbmRleDtcblxuICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgYWxsQ2FsbGJhY2tzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFja3MgPSBhbGxDYWxsYmFja3NbZXZlbnROYW1lXTtcblxuICAgICAgICBpbmRleCA9IGxpYiRyc3ZwJGV2ZW50cyQkaW5kZXhPZihjYWxsYmFja3MsIGNhbGxiYWNrKTtcblxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7IGNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpOyB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAgVXNlIGB0cmlnZ2VyYCB0byBmaXJlIGN1c3RvbSBldmVudHMuIEZvciBleGFtcGxlOlxuXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgb2JqZWN0Lm9uKCdmb28nLCBmdW5jdGlvbigpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdmb28gZXZlbnQgaGFwcGVuZWQhJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBvYmplY3QudHJpZ2dlcignZm9vJyk7XG4gICAgICAgIC8vICdmb28gZXZlbnQgaGFwcGVuZWQhJyBsb2dnZWQgdG8gdGhlIGNvbnNvbGVcbiAgICAgICAgYGBgXG5cbiAgICAgICAgWW91IGNhbiBhbHNvIHBhc3MgYSB2YWx1ZSBhcyBhIHNlY29uZCBhcmd1bWVudCB0byBgdHJpZ2dlcmAgdGhhdCB3aWxsIGJlXG4gICAgICAgIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byBhbGwgZXZlbnQgbGlzdGVuZXJzIGZvciB0aGUgZXZlbnQ6XG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICBvYmplY3Qub24oJ2ZvbycsIGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZS5uYW1lKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ2ZvbycsIHsgbmFtZTogJ2JhcicgfSk7XG4gICAgICAgIC8vICdiYXInIGxvZ2dlZCB0byB0aGUgY29uc29sZVxuICAgICAgICBgYGBcblxuICAgICAgICBAbWV0aG9kIHRyaWdnZXJcbiAgICAgICAgQGZvciBSU1ZQLkV2ZW50VGFyZ2V0XG4gICAgICAgIEBwcml2YXRlXG4gICAgICAgIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gYmUgdHJpZ2dlcmVkXG4gICAgICAgIEBwYXJhbSB7Kn0gb3B0aW9ucyBvcHRpb25hbCB2YWx1ZSB0byBiZSBwYXNzZWQgdG8gYW55IGV2ZW50IGhhbmRsZXJzIGZvclxuICAgICAgICB0aGUgZ2l2ZW4gYGV2ZW50TmFtZWBcbiAgICAgICovXG4gICAgICAndHJpZ2dlcic6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgb3B0aW9ucywgbGFiZWwpIHtcbiAgICAgICAgdmFyIGFsbENhbGxiYWNrcyA9IGxpYiRyc3ZwJGV2ZW50cyQkY2FsbGJhY2tzRm9yKHRoaXMpLCBjYWxsYmFja3MsIGNhbGxiYWNrO1xuXG4gICAgICAgIGlmIChjYWxsYmFja3MgPSBhbGxDYWxsYmFja3NbZXZlbnROYW1lXSkge1xuICAgICAgICAgIC8vIERvbid0IGNhY2hlIHRoZSBjYWxsYmFja3MubGVuZ3RoIHNpbmNlIGl0IG1heSBncm93XG4gICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFja3NbaV07XG5cbiAgICAgICAgICAgIGNhbGxiYWNrKG9wdGlvbnMsIGxhYmVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnID0ge1xuICAgICAgaW5zdHJ1bWVudDogZmFsc2VcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZXZlbnRzJCRkZWZhdWx0WydtaXhpbiddKGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnKTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlndXJlKG5hbWUsIHZhbHVlKSB7XG4gICAgICBpZiAobmFtZSA9PT0gJ29uZXJyb3InKSB7XG4gICAgICAgIC8vIGhhbmRsZSBmb3IgbGVnYWN5IHVzZXJzIHRoYXQgZXhwZWN0IHRoZSBhY3R1YWxcbiAgICAgICAgLy8gZXJyb3IgdG8gYmUgcGFzc2VkIHRvIHRoZWlyIGZ1bmN0aW9uIGFkZGVkIHZpYVxuICAgICAgICAvLyBgUlNWUC5jb25maWd1cmUoJ29uZXJyb3InLCBzb21lRnVuY3Rpb25IZXJlKTtgXG4gICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnWydvbiddKCdlcnJvcicsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1tuYW1lXSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnW25hbWVdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRpbnN0cnVtZW50JCRxdWV1ZSA9IFtdO1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkaW5zdHJ1bWVudCQkc2NoZWR1bGVGbHVzaCgpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbnRyeTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaWIkcnN2cCRpbnN0cnVtZW50JCRxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGVudHJ5ID0gbGliJHJzdnAkaW5zdHJ1bWVudCQkcXVldWVbaV07XG5cbiAgICAgICAgICB2YXIgcGF5bG9hZCA9IGVudHJ5LnBheWxvYWQ7XG5cbiAgICAgICAgICBwYXlsb2FkLmd1aWQgPSBwYXlsb2FkLmtleSArIHBheWxvYWQuaWQ7XG4gICAgICAgICAgcGF5bG9hZC5jaGlsZEd1aWQgPSBwYXlsb2FkLmtleSArIHBheWxvYWQuY2hpbGRJZDtcbiAgICAgICAgICBpZiAocGF5bG9hZC5lcnJvcikge1xuICAgICAgICAgICAgcGF5bG9hZC5zdGFjayA9IHBheWxvYWQuZXJyb3Iuc3RhY2s7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWdbJ3RyaWdnZXInXShlbnRyeS5uYW1lLCBlbnRyeS5wYXlsb2FkKTtcbiAgICAgICAgfVxuICAgICAgICBsaWIkcnN2cCRpbnN0cnVtZW50JCRxdWV1ZS5sZW5ndGggPSAwO1xuICAgICAgfSwgNTApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGluc3RydW1lbnQkJGluc3RydW1lbnQoZXZlbnROYW1lLCBwcm9taXNlLCBjaGlsZCkge1xuICAgICAgaWYgKDEgPT09IGxpYiRyc3ZwJGluc3RydW1lbnQkJHF1ZXVlLnB1c2goe1xuICAgICAgICBuYW1lOiBldmVudE5hbWUsXG4gICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICBrZXk6IHByb21pc2UuX2d1aWRLZXksXG4gICAgICAgICAgaWQ6ICBwcm9taXNlLl9pZCxcbiAgICAgICAgICBldmVudE5hbWU6IGV2ZW50TmFtZSxcbiAgICAgICAgICBkZXRhaWw6IHByb21pc2UuX3Jlc3VsdCxcbiAgICAgICAgICBjaGlsZElkOiBjaGlsZCAmJiBjaGlsZC5faWQsXG4gICAgICAgICAgbGFiZWw6IHByb21pc2UuX2xhYmVsLFxuICAgICAgICAgIHRpbWVTdGFtcDogbGliJHJzdnAkdXRpbHMkJG5vdygpLFxuICAgICAgICAgIGVycm9yOiBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1tcImluc3RydW1lbnQtd2l0aC1zdGFja1wiXSA/IG5ldyBFcnJvcihwcm9taXNlLl9sYWJlbCkgOiBudWxsXG4gICAgICAgIH19KSkge1xuICAgICAgICAgIGxpYiRyc3ZwJGluc3RydW1lbnQkJHNjaGVkdWxlRmx1c2goKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIHZhciBsaWIkcnN2cCRpbnN0cnVtZW50JCRkZWZhdWx0ID0gbGliJHJzdnAkaW5zdHJ1bWVudCQkaW5zdHJ1bWVudDtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCR0aGVuJCR0aGVuKG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uLCBsYWJlbCkge1xuICAgICAgdmFyIHBhcmVudCA9IHRoaXM7XG4gICAgICB2YXIgc3RhdGUgPSBwYXJlbnQuX3N0YXRlO1xuXG4gICAgICBpZiAoc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEICYmICFvbkZ1bGZpbGxtZW50IHx8IHN0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEICYmICFvblJlamVjdGlvbikge1xuICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5pbnN0cnVtZW50ICYmIGxpYiRyc3ZwJGluc3RydW1lbnQkJGRlZmF1bHQoJ2NoYWluZWQnLCBwYXJlbnQsIHBhcmVudCk7XG4gICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIHBhcmVudC5fb25FcnJvciA9IG51bGw7XG5cbiAgICAgIHZhciBjaGlsZCA9IG5ldyBwYXJlbnQuY29uc3RydWN0b3IobGliJHJzdnAkJGludGVybmFsJCRub29wLCBsYWJlbCk7XG4gICAgICB2YXIgcmVzdWx0ID0gcGFyZW50Ll9yZXN1bHQ7XG5cbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmluc3RydW1lbnQgJiYgbGliJHJzdnAkaW5zdHJ1bWVudCQkZGVmYXVsdCgnY2hhaW5lZCcsIHBhcmVudCwgY2hpbGQpO1xuXG4gICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzW3N0YXRlIC0gMV07XG4gICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRpbnZva2VDYWxsYmFjayhzdGF0ZSwgY2hpbGQsIGNhbGxiYWNrLCByZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNoaWxkO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkdGhlbiQkZGVmYXVsdCA9IGxpYiRyc3ZwJHRoZW4kJHRoZW47XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcHJvbWlzZSRyZXNvbHZlJCRyZXNvbHZlKG9iamVjdCwgbGFiZWwpIHtcbiAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgICBpZiAob2JqZWN0ICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdC5jb25zdHJ1Y3RvciA9PT0gQ29uc3RydWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgIH1cblxuICAgICAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3IobGliJHJzdnAkJGludGVybmFsJCRub29wLCBsYWJlbCk7XG4gICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgb2JqZWN0KTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSRyZXNvbHZlJCRkZWZhdWx0ID0gbGliJHJzdnAkcHJvbWlzZSRyZXNvbHZlJCRyZXNvbHZlO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGVudW1lcmF0b3IkJG1ha2VTZXR0bGVkUmVzdWx0KHN0YXRlLCBwb3NpdGlvbiwgdmFsdWUpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0ZTogJ2Z1bGZpbGxlZCcsXG4gICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0ZTogJ3JlamVjdGVkJyxcbiAgICAgICAgICByZWFzb246IHZhbHVlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvcihDb25zdHJ1Y3RvciwgaW5wdXQsIGFib3J0T25SZWplY3QsIGxhYmVsKSB7XG4gICAgICB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yID0gQ29uc3RydWN0b3I7XG4gICAgICB0aGlzLnByb21pc2UgPSBuZXcgQ29uc3RydWN0b3IobGliJHJzdnAkJGludGVybmFsJCRub29wLCBsYWJlbCk7XG4gICAgICB0aGlzLl9hYm9ydE9uUmVqZWN0ID0gYWJvcnRPblJlamVjdDtcblxuICAgICAgaWYgKHRoaXMuX3ZhbGlkYXRlSW5wdXQoaW5wdXQpKSB7XG4gICAgICAgIHRoaXMuX2lucHV0ICAgICA9IGlucHV0O1xuICAgICAgICB0aGlzLmxlbmd0aCAgICAgPSBpbnB1dC5sZW5ndGg7XG4gICAgICAgIHRoaXMuX3JlbWFpbmluZyA9IGlucHV0Lmxlbmd0aDtcblxuICAgICAgICB0aGlzLl9pbml0KCk7XG5cbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMubGVuZ3RoIHx8IDA7XG4gICAgICAgICAgdGhpcy5fZW51bWVyYXRlKCk7XG4gICAgICAgICAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHRoaXMucHJvbWlzZSwgdGhpcy5fdmFsaWRhdGlvbkVycm9yKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRlbnVtZXJhdG9yJCRkZWZhdWx0ID0gbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvcjtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl92YWxpZGF0ZUlucHV0ID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgIHJldHVybiBsaWIkcnN2cCR1dGlscyQkaXNBcnJheShpbnB1dCk7XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl92YWxpZGF0aW9uRXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0FycmF5IE1ldGhvZHMgbXVzdCBiZSBwcm92aWRlZCBhbiBBcnJheScpO1xuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fcmVzdWx0ID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoKTtcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX2VudW1lcmF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGxlbmd0aCAgICAgPSB0aGlzLmxlbmd0aDtcbiAgICAgIHZhciBwcm9taXNlICAgID0gdGhpcy5wcm9taXNlO1xuICAgICAgdmFyIGlucHV0ICAgICAgPSB0aGlzLl9pbnB1dDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IHByb21pc2UuX3N0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuX2VhY2hFbnRyeShpbnB1dFtpXSwgaSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9zZXR0bGVNYXliZVRoZW5hYmxlID0gZnVuY3Rpb24oZW50cnksIGkpIHtcbiAgICAgIHZhciBjID0gdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvcjtcbiAgICAgIHZhciByZXNvbHZlID0gYy5yZXNvbHZlO1xuXG4gICAgICBpZiAocmVzb2x2ZSA9PT0gbGliJHJzdnAkcHJvbWlzZSRyZXNvbHZlJCRkZWZhdWx0KSB7XG4gICAgICAgIHZhciB0aGVuID0gbGliJHJzdnAkJGludGVybmFsJCRnZXRUaGVuKGVudHJ5KTtcblxuICAgICAgICBpZiAodGhlbiA9PT0gbGliJHJzdnAkdGhlbiQkZGVmYXVsdCAmJlxuICAgICAgICAgICAgZW50cnkuX3N0YXRlICE9PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcpIHtcbiAgICAgICAgICBlbnRyeS5fb25FcnJvciA9IG51bGw7XG4gICAgICAgICAgdGhpcy5fc2V0dGxlZEF0KGVudHJ5Ll9zdGF0ZSwgaSwgZW50cnkuX3Jlc3VsdCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoZW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aGlzLl9yZW1haW5pbmctLTtcbiAgICAgICAgICB0aGlzLl9yZXN1bHRbaV0gPSB0aGlzLl9tYWtlUmVzdWx0KGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVELCBpLCBlbnRyeSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdCkge1xuICAgICAgICAgIHZhciBwcm9taXNlID0gbmV3IGMobGliJHJzdnAkJGludGVybmFsJCRub29wKTtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgZW50cnksIHRoZW4pO1xuICAgICAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChwcm9taXNlLCBpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl93aWxsU2V0dGxlQXQobmV3IGMoZnVuY3Rpb24ocmVzb2x2ZSkgeyByZXNvbHZlKGVudHJ5KTsgfSksIGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl93aWxsU2V0dGxlQXQocmVzb2x2ZShlbnRyeSksIGkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fZWFjaEVudHJ5ID0gZnVuY3Rpb24oZW50cnksIGkpIHtcbiAgICAgIGlmIChsaWIkcnN2cCR1dGlscyQkaXNNYXliZVRoZW5hYmxlKGVudHJ5KSkge1xuICAgICAgICB0aGlzLl9zZXR0bGVNYXliZVRoZW5hYmxlKGVudHJ5LCBpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuICAgICAgICB0aGlzLl9yZXN1bHRbaV0gPSB0aGlzLl9tYWtlUmVzdWx0KGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVELCBpLCBlbnRyeSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9zZXR0bGVkQXQgPSBmdW5jdGlvbihzdGF0ZSwgaSwgdmFsdWUpIHtcbiAgICAgIHZhciBwcm9taXNlID0gdGhpcy5wcm9taXNlO1xuXG4gICAgICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORykge1xuICAgICAgICB0aGlzLl9yZW1haW5pbmctLTtcblxuICAgICAgICBpZiAodGhpcy5fYWJvcnRPblJlamVjdCAmJiBzdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRSRUpFQ1RFRCkge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9yZXN1bHRbaV0gPSB0aGlzLl9tYWtlUmVzdWx0KHN0YXRlLCBpLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX21ha2VSZXN1bHQgPSBmdW5jdGlvbihzdGF0ZSwgaSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3dpbGxTZXR0bGVBdCA9IGZ1bmN0aW9uKHByb21pc2UsIGkpIHtcbiAgICAgIHZhciBlbnVtZXJhdG9yID0gdGhpcztcblxuICAgICAgbGliJHJzdnAkJGludGVybmFsJCRzdWJzY3JpYmUocHJvbWlzZSwgdW5kZWZpbmVkLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBlbnVtZXJhdG9yLl9zZXR0bGVkQXQobGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQsIGksIHZhbHVlKTtcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICBlbnVtZXJhdG9yLl9zZXR0bGVkQXQobGliJHJzdnAkJGludGVybmFsJCRSRUpFQ1RFRCwgaSwgcmVhc29uKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcHJvbWlzZSRhbGwkJGFsbChlbnRyaWVzLCBsYWJlbCkge1xuICAgICAgcmV0dXJuIG5ldyBsaWIkcnN2cCRlbnVtZXJhdG9yJCRkZWZhdWx0KHRoaXMsIGVudHJpZXMsIHRydWUgLyogYWJvcnQgb24gcmVqZWN0ICovLCBsYWJlbCkucHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkYWxsJCRkZWZhdWx0ID0gbGliJHJzdnAkcHJvbWlzZSRhbGwkJGFsbDtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJHJhY2UkJHJhY2UoZW50cmllcywgbGFiZWwpIHtcbiAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3AsIGxhYmVsKTtcblxuICAgICAgaWYgKCFsaWIkcnN2cCR1dGlscyQkaXNBcnJheShlbnRyaWVzKSkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGFuIGFycmF5IHRvIHJhY2UuJykpO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGxlbmd0aCA9IGVudHJpZXMubGVuZ3RoO1xuXG4gICAgICBmdW5jdGlvbiBvbkZ1bGZpbGxtZW50KHZhbHVlKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG9uUmVqZWN0aW9uKHJlYXNvbikge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgcHJvbWlzZS5fc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORyAmJiBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRzdWJzY3JpYmUoQ29uc3RydWN0b3IucmVzb2x2ZShlbnRyaWVzW2ldKSwgdW5kZWZpbmVkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSRyYWNlJCRkZWZhdWx0ID0gbGliJHJzdnAkcHJvbWlzZSRyYWNlJCRyYWNlO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkcmVqZWN0JCRyZWplY3QocmVhc29uLCBsYWJlbCkge1xuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3AsIGxhYmVsKTtcbiAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkcmVqZWN0JCRkZWZhdWx0ID0gbGliJHJzdnAkcHJvbWlzZSRyZWplY3QkJHJlamVjdDtcblxuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJCRndWlkS2V5ID0gJ3JzdnBfJyArIGxpYiRyc3ZwJHV0aWxzJCRub3coKSArICctJztcbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSQkY291bnRlciA9IDA7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJCRuZWVkc1Jlc29sdmVyKCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhIHJlc29sdmVyIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkJG5lZWRzTmV3KCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBjb25zdHJ1Y3QgJ1Byb21pc2UnOiBQbGVhc2UgdXNlIHRoZSAnbmV3JyBvcGVyYXRvciwgdGhpcyBvYmplY3QgY29uc3RydWN0b3IgY2Fubm90IGJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLlwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlKHJlc29sdmVyLCBsYWJlbCkge1xuICAgICAgdGhpcy5faWQgPSBsaWIkcnN2cCRwcm9taXNlJCRjb3VudGVyKys7XG4gICAgICB0aGlzLl9sYWJlbCA9IGxhYmVsO1xuICAgICAgdGhpcy5fc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9yZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9zdWJzY3JpYmVycyA9IFtdO1xuXG4gICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5pbnN0cnVtZW50ICYmIGxpYiRyc3ZwJGluc3RydW1lbnQkJGRlZmF1bHQoJ2NyZWF0ZWQnLCB0aGlzKTtcblxuICAgICAgaWYgKGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCAhPT0gcmVzb2x2ZXIpIHtcbiAgICAgICAgdHlwZW9mIHJlc29sdmVyICE9PSAnZnVuY3Rpb24nICYmIGxpYiRyc3ZwJHByb21pc2UkJG5lZWRzUmVzb2x2ZXIoKTtcbiAgICAgICAgdGhpcyBpbnN0YW5jZW9mIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UgPyBsaWIkcnN2cCQkaW50ZXJuYWwkJGluaXRpYWxpemVQcm9taXNlKHRoaXMsIHJlc29sdmVyKSA6IGxpYiRyc3ZwJHByb21pc2UkJG5lZWRzTmV3KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQgPSBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlO1xuXG4gICAgLy8gZGVwcmVjYXRlZFxuICAgIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UuY2FzdCA9IGxpYiRyc3ZwJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlLmFsbCA9IGxpYiRyc3ZwJHByb21pc2UkYWxsJCRkZWZhdWx0O1xuICAgIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UucmFjZSA9IGxpYiRyc3ZwJHByb21pc2UkcmFjZSQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlLnJlc29sdmUgPSBsaWIkcnN2cCRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZS5yZWplY3QgPSBsaWIkcnN2cCRwcm9taXNlJHJlamVjdCQkZGVmYXVsdDtcblxuICAgIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UucHJvdG90eXBlID0ge1xuICAgICAgY29uc3RydWN0b3I6IGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UsXG5cbiAgICAgIF9ndWlkS2V5OiBsaWIkcnN2cCRwcm9taXNlJCRndWlkS2V5LFxuXG4gICAgICBfb25FcnJvcjogZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFmdGVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChwcm9taXNlLl9vbkVycm9yKSB7XG4gICAgICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1sndHJpZ2dlciddKCdlcnJvcicsIHJlYXNvbiwgcHJvbWlzZS5fbGFiZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgLyoqXG4gICAgICBUaGUgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCxcbiAgICAgIHdoaWNoIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlXG4gICAgICByZWFzb24gd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgICAgIC8vIHVzZXIgaXMgYXZhaWxhYmxlXG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAvLyB1c2VyIGlzIHVuYXZhaWxhYmxlLCBhbmQgeW91IGFyZSBnaXZlbiB0aGUgcmVhc29uIHdoeVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQ2hhaW5pbmdcbiAgICAgIC0tLS0tLS0tXG5cbiAgICAgIFRoZSByZXR1cm4gdmFsdWUgb2YgYHRoZW5gIGlzIGl0c2VsZiBhIHByb21pc2UuICBUaGlzIHNlY29uZCwgJ2Rvd25zdHJlYW0nXG4gICAgICBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZmlyc3QgcHJvbWlzZSdzIGZ1bGZpbGxtZW50XG4gICAgICBvciByZWplY3Rpb24gaGFuZGxlciwgb3IgcmVqZWN0ZWQgaWYgdGhlIGhhbmRsZXIgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICByZXR1cm4gdXNlci5uYW1lO1xuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICByZXR1cm4gJ2RlZmF1bHQgbmFtZSc7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh1c2VyTmFtZSkge1xuICAgICAgICAvLyBJZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHVzZXJOYW1lYCB3aWxsIGJlIHRoZSB1c2VyJ3MgbmFtZSwgb3RoZXJ3aXNlIGl0XG4gICAgICAgIC8vIHdpbGwgYmUgYCdkZWZhdWx0IG5hbWUnYFxuICAgICAgfSk7XG5cbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jyk7XG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAvLyBpZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHJlYXNvbmAgd2lsbCBiZSAnRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknLlxuICAgICAgICAvLyBJZiBgZmluZFVzZXJgIHJlamVjdGVkLCBgcmVhc29uYCB3aWxsIGJlICdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jy5cbiAgICAgIH0pO1xuICAgICAgYGBgXG4gICAgICBJZiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIGRvZXMgbm90IHNwZWNpZnkgYSByZWplY3Rpb24gaGFuZGxlciwgcmVqZWN0aW9uIHJlYXNvbnMgd2lsbCBiZSBwcm9wYWdhdGVkIGZ1cnRoZXIgZG93bnN0cmVhbS5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICB0aHJvdyBuZXcgUGVkYWdvZ2ljYWxFeGNlcHRpb24oJ1Vwc3RyZWFtIGVycm9yJyk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIC8vIFRoZSBgUGVkZ2Fnb2NpYWxFeGNlcHRpb25gIGlzIHByb3BhZ2F0ZWQgYWxsIHRoZSB3YXkgZG93biB0byBoZXJlXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBBc3NpbWlsYXRpb25cbiAgICAgIC0tLS0tLS0tLS0tLVxuXG4gICAgICBTb21ldGltZXMgdGhlIHZhbHVlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSB0byBhIGRvd25zdHJlYW0gcHJvbWlzZSBjYW4gb25seSBiZVxuICAgICAgcmV0cmlldmVkIGFzeW5jaHJvbm91c2x5LiBUaGlzIGNhbiBiZSBhY2hpZXZlZCBieSByZXR1cm5pbmcgYSBwcm9taXNlIGluIHRoZVxuICAgICAgZnVsZmlsbG1lbnQgb3IgcmVqZWN0aW9uIGhhbmRsZXIuIFRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCB0aGVuIGJlIHBlbmRpbmdcbiAgICAgIHVudGlsIHRoZSByZXR1cm5lZCBwcm9taXNlIGlzIHNldHRsZWQuIFRoaXMgaXMgY2FsbGVkICphc3NpbWlsYXRpb24qLlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAgIC8vIFRoZSB1c2VyJ3MgY29tbWVudHMgYXJlIG5vdyBhdmFpbGFibGVcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIElmIHRoZSBhc3NpbWxpYXRlZCBwcm9taXNlIHJlamVjdHMsIHRoZW4gdGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIGFsc28gcmVqZWN0LlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgZnVsZmlsbHMsIHdlJ2xsIGhhdmUgdGhlIHZhbHVlIGhlcmVcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCByZWplY3RzLCB3ZSdsbCBoYXZlIHRoZSByZWFzb24gaGVyZVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgU2ltcGxlIEV4YW1wbGVcbiAgICAgIC0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgdmFyIHJlc3VsdDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gZmluZFJlc3VsdCgpO1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9XG4gICAgICBgYGBcblxuICAgICAgRXJyYmFjayBFeGFtcGxlXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kUmVzdWx0KGZ1bmN0aW9uKHJlc3VsdCwgZXJyKXtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIC8vIGZhaWx1cmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBzdWNjZXNzXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIFByb21pc2UgRXhhbXBsZTtcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgZmluZFJlc3VsdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQWR2YW5jZWQgRXhhbXBsZVxuICAgICAgLS0tLS0tLS0tLS0tLS1cblxuICAgICAgU3luY2hyb25vdXMgRXhhbXBsZVxuXG4gICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICB2YXIgYXV0aG9yLCBib29rcztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgYXV0aG9yID0gZmluZEF1dGhvcigpO1xuICAgICAgICBib29rcyAgPSBmaW5kQm9va3NCeUF1dGhvcihhdXRob3IpO1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9XG4gICAgICBgYGBcblxuICAgICAgRXJyYmFjayBFeGFtcGxlXG5cbiAgICAgIGBgYGpzXG5cbiAgICAgIGZ1bmN0aW9uIGZvdW5kQm9va3MoYm9va3MpIHtcblxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBmYWlsdXJlKHJlYXNvbikge1xuXG4gICAgICB9XG5cbiAgICAgIGZpbmRBdXRob3IoZnVuY3Rpb24oYXV0aG9yLCBlcnIpe1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgIC8vIGZhaWx1cmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmluZEJvb29rc0J5QXV0aG9yKGF1dGhvciwgZnVuY3Rpb24oYm9va3MsIGVycikge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBmb3VuZEJvb2tzKGJvb2tzKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAgICAgICAgICAgZmFpbHVyZShyZWFzb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBzdWNjZXNzXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIFByb21pc2UgRXhhbXBsZTtcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgZmluZEF1dGhvcigpLlxuICAgICAgICB0aGVuKGZpbmRCb29rc0J5QXV0aG9yKS5cbiAgICAgICAgdGhlbihmdW5jdGlvbihib29rcyl7XG4gICAgICAgICAgLy8gZm91bmQgYm9va3NcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBAbWV0aG9kIHRoZW5cbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uRnVsZmlsbG1lbnRcbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0aW9uXG4gICAgICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgb3B0aW9uYWwgc3RyaW5nIGZvciBsYWJlbGluZyB0aGUgcHJvbWlzZS5cbiAgICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICAgKi9cbiAgICAgIHRoZW46IGxpYiRyc3ZwJHRoZW4kJGRlZmF1bHQsXG5cbiAgICAvKipcbiAgICAgIGBjYXRjaGAgaXMgc2ltcGx5IHN1Z2FyIGZvciBgdGhlbih1bmRlZmluZWQsIG9uUmVqZWN0aW9uKWAgd2hpY2ggbWFrZXMgaXQgdGhlIHNhbWVcbiAgICAgIGFzIHRoZSBjYXRjaCBibG9jayBvZiBhIHRyeS9jYXRjaCBzdGF0ZW1lbnQuXG5cbiAgICAgIGBgYGpzXG4gICAgICBmdW5jdGlvbiBmaW5kQXV0aG9yKCl7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGRuJ3QgZmluZCB0aGF0IGF1dGhvcicpO1xuICAgICAgfVxuXG4gICAgICAvLyBzeW5jaHJvbm91c1xuICAgICAgdHJ5IHtcbiAgICAgICAgZmluZEF1dGhvcigpO1xuICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAgIH1cblxuICAgICAgLy8gYXN5bmMgd2l0aCBwcm9taXNlc1xuICAgICAgZmluZEF1dGhvcigpLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBAbWV0aG9kIGNhdGNoXG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGlvblxuICAgICAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgbGFiZWxpbmcgdGhlIHByb21pc2UuXG4gICAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAgICovXG4gICAgICAnY2F0Y2gnOiBmdW5jdGlvbihvblJlamVjdGlvbiwgbGFiZWwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0aW9uLCBsYWJlbCk7XG4gICAgICB9LFxuXG4gICAgLyoqXG4gICAgICBgZmluYWxseWAgd2lsbCBiZSBpbnZva2VkIHJlZ2FyZGxlc3Mgb2YgdGhlIHByb21pc2UncyBmYXRlIGp1c3QgYXMgbmF0aXZlXG4gICAgICB0cnkvY2F0Y2gvZmluYWxseSBiZWhhdmVzXG5cbiAgICAgIFN5bmNocm9ub3VzIGV4YW1wbGU6XG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kQXV0aG9yKCkge1xuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQXV0aG9yKCk7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBmaW5kQXV0aG9yKCk7IC8vIHN1Y2NlZWQgb3IgZmFpbFxuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICByZXR1cm4gZmluZE90aGVyQXV0aGVyKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICAvLyBhbHdheXMgcnVuc1xuICAgICAgICAvLyBkb2Vzbid0IGFmZmVjdCB0aGUgcmV0dXJuIHZhbHVlXG4gICAgICB9XG4gICAgICBgYGBcblxuICAgICAgQXN5bmNocm9ub3VzIGV4YW1wbGU6XG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kQXV0aG9yKCkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgcmV0dXJuIGZpbmRPdGhlckF1dGhlcigpO1xuICAgICAgfSkuZmluYWxseShmdW5jdGlvbigpe1xuICAgICAgICAvLyBhdXRob3Igd2FzIGVpdGhlciBmb3VuZCwgb3Igbm90XG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBAbWV0aG9kIGZpbmFsbHlcbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgb3B0aW9uYWwgc3RyaW5nIGZvciBsYWJlbGluZyB0aGUgcHJvbWlzZS5cbiAgICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICAgKi9cbiAgICAgICdmaW5hbGx5JzogZnVuY3Rpb24oY2FsbGJhY2ssIGxhYmVsKSB7XG4gICAgICAgIHZhciBwcm9taXNlID0gdGhpcztcbiAgICAgICAgdmFyIGNvbnN0cnVjdG9yID0gcHJvbWlzZS5jb25zdHJ1Y3RvcjtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZWplY3QocmVhc29uKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgbGFiZWwpO1xuICAgICAgfVxuICAgIH07XG4gICAgZnVuY3Rpb24gIGxpYiRyc3ZwJCRpbnRlcm5hbCQkd2l0aE93blByb21pc2UoKSB7XG4gICAgICByZXR1cm4gbmV3IFR5cGVFcnJvcignQSBwcm9taXNlcyBjYWxsYmFjayBjYW5ub3QgcmV0dXJuIHRoYXQgc2FtZSBwcm9taXNlLicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCgpIHt9XG5cbiAgICB2YXIgbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HICAgPSB2b2lkIDA7XG4gICAgdmFyIGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEID0gMTtcbiAgICB2YXIgbGliJHJzdnAkJGludGVybmFsJCRSRUpFQ1RFRCAgPSAyO1xuXG4gICAgdmFyIGxpYiRyc3ZwJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1IgPSBuZXcgbGliJHJzdnAkJGludGVybmFsJCRFcnJvck9iamVjdCgpO1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRnZXRUaGVuKHByb21pc2UpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlLnRoZW47XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1IuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCR0cnlUaGVuKHRoZW4sIHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICByZXR1cm4gZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSwgdGhlbikge1xuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYXN5bmMoZnVuY3Rpb24ocHJvbWlzZSkge1xuICAgICAgICB2YXIgc2VhbGVkID0gZmFsc2U7XG4gICAgICAgIHZhciBlcnJvciA9IGxpYiRyc3ZwJCRpbnRlcm5hbCQkdHJ5VGhlbih0aGVuLCB0aGVuYWJsZSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBpZiAoc2VhbGVkKSB7IHJldHVybjsgfVxuICAgICAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICAgICAgaWYgKHRoZW5hYmxlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlLCB1bmRlZmluZWQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgICAgaWYgKHNlYWxlZCkgeyByZXR1cm47IH1cbiAgICAgICAgICBzZWFsZWQgPSB0cnVlO1xuXG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICAgICAgfSwgJ1NldHRsZTogJyArIChwcm9taXNlLl9sYWJlbCB8fCAnIHVua25vd24gcHJvbWlzZScpKTtcblxuICAgICAgICBpZiAoIXNlYWxlZCAmJiBlcnJvcikge1xuICAgICAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9LCBwcm9taXNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlKSB7XG4gICAgICBpZiAodGhlbmFibGUuX3N0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gICAgICB9IGVsc2UgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRSRUpFQ1RFRCkge1xuICAgICAgICB0aGVuYWJsZS5fb25FcnJvciA9IG51bGw7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRzdWJzY3JpYmUodGhlbmFibGUsIHVuZGVmaW5lZCwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBpZiAodGhlbmFibGUgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbikge1xuICAgICAgaWYgKG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IgPT09IHByb21pc2UuY29uc3RydWN0b3IgJiZcbiAgICAgICAgICB0aGVuID09PSBsaWIkcnN2cCR0aGVuJCRkZWZhdWx0ICYmXG4gICAgICAgICAgY29uc3RydWN0b3IucmVzb2x2ZSA9PT0gbGliJHJzdnAkcHJvbWlzZSRyZXNvbHZlJCRkZWZhdWx0KSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhlbiA9PT0gbGliJHJzdnAkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUikge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGxpYiRyc3ZwJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1IuZXJyb3IpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoZW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICAgICAgfSBlbHNlIGlmIChsaWIkcnN2cCR1dGlscyQkaXNGdW5jdGlvbih0aGVuKSkge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSkge1xuICAgICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGxpYiRyc3ZwJHV0aWxzJCRvYmplY3RPckZ1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgdmFsdWUsIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZ2V0VGhlbih2YWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJHB1Ymxpc2hSZWplY3Rpb24ocHJvbWlzZSkge1xuICAgICAgaWYgKHByb21pc2UuX29uRXJyb3IpIHtcbiAgICAgICAgcHJvbWlzZS5fb25FcnJvcihwcm9taXNlLl9yZXN1bHQpO1xuICAgICAgfVxuXG4gICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHB1Ymxpc2gocHJvbWlzZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKSB7XG4gICAgICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORykgeyByZXR1cm47IH1cblxuICAgICAgcHJvbWlzZS5fcmVzdWx0ID0gdmFsdWU7XG4gICAgICBwcm9taXNlLl9zdGF0ZSA9IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEO1xuXG4gICAgICBpZiAocHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGlmIChsaWIkcnN2cCRjb25maWckJGNvbmZpZy5pbnN0cnVtZW50KSB7XG4gICAgICAgICAgbGliJHJzdnAkaW5zdHJ1bWVudCQkZGVmYXVsdCgnZnVsZmlsbGVkJywgcHJvbWlzZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jKGxpYiRyc3ZwJCRpbnRlcm5hbCQkcHVibGlzaCwgcHJvbWlzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKSB7XG4gICAgICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORykgeyByZXR1cm47IH1cbiAgICAgIHByb21pc2UuX3N0YXRlID0gbGliJHJzdnAkJGludGVybmFsJCRSRUpFQ1RFRDtcbiAgICAgIHByb21pc2UuX3Jlc3VsdCA9IHJlYXNvbjtcbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jKGxpYiRyc3ZwJCRpbnRlcm5hbCQkcHVibGlzaFJlamVjdGlvbiwgcHJvbWlzZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgICAgIHZhciBzdWJzY3JpYmVycyA9IHBhcmVudC5fc3Vic2NyaWJlcnM7XG4gICAgICB2YXIgbGVuZ3RoID0gc3Vic2NyaWJlcnMubGVuZ3RoO1xuXG4gICAgICBwYXJlbnQuX29uRXJyb3IgPSBudWxsO1xuXG4gICAgICBzdWJzY3JpYmVyc1tsZW5ndGhdID0gY2hpbGQ7XG4gICAgICBzdWJzY3JpYmVyc1tsZW5ndGggKyBsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRF0gPSBvbkZ1bGZpbGxtZW50O1xuICAgICAgc3Vic2NyaWJlcnNbbGVuZ3RoICsgbGliJHJzdnAkJGludGVybmFsJCRSRUpFQ1RFRF0gID0gb25SZWplY3Rpb247XG5cbiAgICAgIGlmIChsZW5ndGggPT09IDAgJiYgcGFyZW50Ll9zdGF0ZSkge1xuICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hc3luYyhsaWIkcnN2cCQkaW50ZXJuYWwkJHB1Ymxpc2gsIHBhcmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRwdWJsaXNoKHByb21pc2UpIHtcbiAgICAgIHZhciBzdWJzY3JpYmVycyA9IHByb21pc2UuX3N1YnNjcmliZXJzO1xuICAgICAgdmFyIHNldHRsZWQgPSBwcm9taXNlLl9zdGF0ZTtcblxuICAgICAgaWYgKGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmluc3RydW1lbnQpIHtcbiAgICAgICAgbGliJHJzdnAkaW5zdHJ1bWVudCQkZGVmYXVsdChzZXR0bGVkID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCA/ICdmdWxmaWxsZWQnIDogJ3JlamVjdGVkJywgcHJvbWlzZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdWJzY3JpYmVycy5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XG5cbiAgICAgIHZhciBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCA9IHByb21pc2UuX3Jlc3VsdDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMykge1xuICAgICAgICBjaGlsZCA9IHN1YnNjcmliZXJzW2ldO1xuICAgICAgICBjYWxsYmFjayA9IHN1YnNjcmliZXJzW2kgKyBzZXR0bGVkXTtcblxuICAgICAgICBpZiAoY2hpbGQpIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGludm9rZUNhbGxiYWNrKHNldHRsZWQsIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhkZXRhaWwpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCA9IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRFcnJvck9iamVjdCgpIHtcbiAgICAgIHRoaXMuZXJyb3IgPSBudWxsO1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCQkaW50ZXJuYWwkJFRSWV9DQVRDSF9FUlJPUiA9IG5ldyBsaWIkcnN2cCQkaW50ZXJuYWwkJEVycm9yT2JqZWN0KCk7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhkZXRhaWwpO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SLmVycm9yID0gZTtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgcHJvbWlzZSwgY2FsbGJhY2ssIGRldGFpbCkge1xuICAgICAgdmFyIGhhc0NhbGxiYWNrID0gbGliJHJzdnAkdXRpbHMkJGlzRnVuY3Rpb24oY2FsbGJhY2spLFxuICAgICAgICAgIHZhbHVlLCBlcnJvciwgc3VjY2VlZGVkLCBmYWlsZWQ7XG5cbiAgICAgIGlmIChoYXNDYWxsYmFjaykge1xuICAgICAgICB2YWx1ZSA9IGxpYiRyc3ZwJCRpbnRlcm5hbCQkdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCk7XG5cbiAgICAgICAgaWYgKHZhbHVlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFRSWV9DQVRDSF9FUlJPUikge1xuICAgICAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICAgICAgZXJyb3IgPSB2YWx1ZS5lcnJvcjtcbiAgICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGxpYiRyc3ZwJCRpbnRlcm5hbCQkd2l0aE93blByb21pc2UoKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gZGV0YWlsO1xuICAgICAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORykge1xuICAgICAgICAvLyBub29wXG4gICAgICB9IGVsc2UgaWYgKGhhc0NhbGxiYWNrICYmIHN1Y2NlZWRlZCkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChmYWlsZWQpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJGluaXRpYWxpemVQcm9taXNlKHByb21pc2UsIHJlc29sdmVyKSB7XG4gICAgICB2YXIgcmVzb2x2ZWQgPSBmYWxzZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc29sdmVyKGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHZhbHVlKXtcbiAgICAgICAgICBpZiAocmVzb2x2ZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgcmVzb2x2ZWQgPSB0cnVlO1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIHJlamVjdFByb21pc2UocmVhc29uKSB7XG4gICAgICAgICAgaWYgKHJlc29sdmVkKSB7IHJldHVybjsgfVxuICAgICAgICAgIHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkQWxsU2V0dGxlZChDb25zdHJ1Y3RvciwgZW50cmllcywgbGFiZWwpIHtcbiAgICAgIHRoaXMuX3N1cGVyQ29uc3RydWN0b3IoQ29uc3RydWN0b3IsIGVudHJpZXMsIGZhbHNlIC8qIGRvbid0IGFib3J0IG9uIHJlamVjdCAqLywgbGFiZWwpO1xuICAgIH1cblxuICAgIGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRBbGxTZXR0bGVkLnByb3RvdHlwZSA9IGxpYiRyc3ZwJHV0aWxzJCRvX2NyZWF0ZShsaWIkcnN2cCRlbnVtZXJhdG9yJCRkZWZhdWx0LnByb3RvdHlwZSk7XG4gICAgbGliJHJzdnAkYWxsJHNldHRsZWQkJEFsbFNldHRsZWQucHJvdG90eXBlLl9zdXBlckNvbnN0cnVjdG9yID0gbGliJHJzdnAkZW51bWVyYXRvciQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkQWxsU2V0dGxlZC5wcm90b3R5cGUuX21ha2VSZXN1bHQgPSBsaWIkcnN2cCRlbnVtZXJhdG9yJCRtYWtlU2V0dGxlZFJlc3VsdDtcbiAgICBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkQWxsU2V0dGxlZC5wcm90b3R5cGUuX3ZhbGlkYXRpb25FcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignYWxsU2V0dGxlZCBtdXN0IGJlIGNhbGxlZCB3aXRoIGFuIGFycmF5Jyk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRhbGxTZXR0bGVkKGVudHJpZXMsIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbmV3IGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRBbGxTZXR0bGVkKGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQsIGVudHJpZXMsIGxhYmVsKS5wcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkYWxsJHNldHRsZWQkJGRlZmF1bHQgPSBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkYWxsU2V0dGxlZDtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhbGwkJGFsbChhcnJheSwgbGFiZWwpIHtcbiAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LmFsbChhcnJheSwgbGFiZWwpO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkYWxsJCRkZWZhdWx0ID0gbGliJHJzdnAkYWxsJCRhbGw7XG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJGxlbiA9IDA7XG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJHZlcnR4TmV4dDtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCRhc2FwKGNhbGxiYWNrLCBhcmcpIHtcbiAgICAgIGxpYiRyc3ZwJGFzYXAkJHF1ZXVlW2xpYiRyc3ZwJGFzYXAkJGxlbl0gPSBjYWxsYmFjaztcbiAgICAgIGxpYiRyc3ZwJGFzYXAkJHF1ZXVlW2xpYiRyc3ZwJGFzYXAkJGxlbiArIDFdID0gYXJnO1xuICAgICAgbGliJHJzdnAkYXNhcCQkbGVuICs9IDI7XG4gICAgICBpZiAobGliJHJzdnAkYXNhcCQkbGVuID09PSAyKSB7XG4gICAgICAgIC8vIElmIGxlbiBpcyAxLCB0aGF0IG1lYW5zIHRoYXQgd2UgbmVlZCB0byBzY2hlZHVsZSBhbiBhc3luYyBmbHVzaC5cbiAgICAgICAgLy8gSWYgYWRkaXRpb25hbCBjYWxsYmFja3MgYXJlIHF1ZXVlZCBiZWZvcmUgdGhlIHF1ZXVlIGlzIGZsdXNoZWQsIHRoZXlcbiAgICAgICAgLy8gd2lsbCBiZSBwcm9jZXNzZWQgYnkgdGhpcyBmbHVzaCB0aGF0IHdlIGFyZSBzY2hlZHVsaW5nLlxuICAgICAgICBsaWIkcnN2cCRhc2FwJCRzY2hlZHVsZUZsdXNoKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJGRlZmF1bHQgPSBsaWIkcnN2cCRhc2FwJCRhc2FwO1xuXG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJGJyb3dzZXJXaW5kb3cgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpID8gd2luZG93IDogdW5kZWZpbmVkO1xuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRicm93c2VyR2xvYmFsID0gbGliJHJzdnAkYXNhcCQkYnJvd3NlcldpbmRvdyB8fCB7fTtcbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBsaWIkcnN2cCRhc2FwJCRicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgbGliJHJzdnAkYXNhcCQkYnJvd3Nlckdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRpc05vZGUgPSB0eXBlb2Ygc2VsZiA9PT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiB7fS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXSc7XG5cbiAgICAvLyB0ZXN0IGZvciB3ZWIgd29ya2VyIGJ1dCBub3QgaW4gSUUxMFxuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRpc1dvcmtlciA9IHR5cGVvZiBVaW50OENsYW1wZWRBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIHR5cGVvZiBpbXBvcnRTY3JpcHRzICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgdHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSAndW5kZWZpbmVkJztcblxuICAgIC8vIG5vZGVcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCR1c2VOZXh0VGljaygpIHtcbiAgICAgIHZhciBuZXh0VGljayA9IHByb2Nlc3MubmV4dFRpY2s7XG4gICAgICAvLyBub2RlIHZlcnNpb24gMC4xMC54IGRpc3BsYXlzIGEgZGVwcmVjYXRpb24gd2FybmluZyB3aGVuIG5leHRUaWNrIGlzIHVzZWQgcmVjdXJzaXZlbHlcbiAgICAgIC8vIHNldEltbWVkaWF0ZSBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkIGluc3RlYWRcbiAgICAgIHZhciB2ZXJzaW9uID0gcHJvY2Vzcy52ZXJzaW9ucy5ub2RlLm1hdGNoKC9eKD86KFxcZCspXFwuKT8oPzooXFxkKylcXC4pPyhcXCp8XFxkKykkLyk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2ZXJzaW9uKSAmJiB2ZXJzaW9uWzFdID09PSAnMCcgJiYgdmVyc2lvblsyXSA9PT0gJzEwJykge1xuICAgICAgICBuZXh0VGljayA9IHNldEltbWVkaWF0ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgbmV4dFRpY2sobGliJHJzdnAkYXNhcCQkZmx1c2gpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyB2ZXJ0eFxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJHVzZVZlcnR4VGltZXIoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGxpYiRyc3ZwJGFzYXAkJHZlcnR4TmV4dChsaWIkcnN2cCRhc2FwJCRmbHVzaCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgbGliJHJzdnAkYXNhcCQkQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIobGliJHJzdnAkYXNhcCQkZmx1c2gpO1xuICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTtcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBub2RlLmRhdGEgPSAoaXRlcmF0aW9ucyA9ICsraXRlcmF0aW9ucyAlIDIpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyB3ZWIgd29ya2VyXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkdXNlTWVzc2FnZUNoYW5uZWwoKSB7XG4gICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaWIkcnN2cCRhc2FwJCRmbHVzaDtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJHVzZVNldFRpbWVvdXQoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNldFRpbWVvdXQobGliJHJzdnAkYXNhcCQkZmx1c2gsIDEpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkcXVldWUgPSBuZXcgQXJyYXkoMTAwMCk7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkZmx1c2goKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpYiRyc3ZwJGFzYXAkJGxlbjsgaSs9Mikge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBsaWIkcnN2cCRhc2FwJCRxdWV1ZVtpXTtcbiAgICAgICAgdmFyIGFyZyA9IGxpYiRyc3ZwJGFzYXAkJHF1ZXVlW2krMV07XG5cbiAgICAgICAgY2FsbGJhY2soYXJnKTtcblxuICAgICAgICBsaWIkcnN2cCRhc2FwJCRxdWV1ZVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGliJHJzdnAkYXNhcCQkcXVldWVbaSsxXSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgbGliJHJzdnAkYXNhcCQkbGVuID0gMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCRhdHRlbXB0VmVydGV4KCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHIgPSByZXF1aXJlO1xuICAgICAgICB2YXIgdmVydHggPSByKCd2ZXJ0eCcpO1xuICAgICAgICBsaWIkcnN2cCRhc2FwJCR2ZXJ0eE5leHQgPSB2ZXJ0eC5ydW5Pbkxvb3AgfHwgdmVydHgucnVuT25Db250ZXh0O1xuICAgICAgICByZXR1cm4gbGliJHJzdnAkYXNhcCQkdXNlVmVydHhUaW1lcigpO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybiBsaWIkcnN2cCRhc2FwJCR1c2VTZXRUaW1lb3V0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJHNjaGVkdWxlRmx1c2g7XG4gICAgLy8gRGVjaWRlIHdoYXQgYXN5bmMgbWV0aG9kIHRvIHVzZSB0byB0cmlnZ2VyaW5nIHByb2Nlc3Npbmcgb2YgcXVldWVkIGNhbGxiYWNrczpcbiAgICBpZiAobGliJHJzdnAkYXNhcCQkaXNOb2RlKSB7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJHJzdnAkYXNhcCQkdXNlTmV4dFRpY2soKTtcbiAgICB9IGVsc2UgaWYgKGxpYiRyc3ZwJGFzYXAkJEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKSB7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJHJzdnAkYXNhcCQkdXNlTXV0YXRpb25PYnNlcnZlcigpO1xuICAgIH0gZWxzZSBpZiAobGliJHJzdnAkYXNhcCQkaXNXb3JrZXIpIHtcbiAgICAgIGxpYiRyc3ZwJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkcnN2cCRhc2FwJCR1c2VNZXNzYWdlQ2hhbm5lbCgpO1xuICAgIH0gZWxzZSBpZiAobGliJHJzdnAkYXNhcCQkYnJvd3NlcldpbmRvdyA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJHJzdnAkYXNhcCQkYXR0ZW1wdFZlcnRleCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJHJzdnAkYXNhcCQkdXNlU2V0VGltZW91dCgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRkZWZlciQkZGVmZXIobGFiZWwpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9IHt9O1xuXG4gICAgICBkZWZlcnJlZFsncHJvbWlzZSddID0gbmV3IGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGRlZmVycmVkWydyZXNvbHZlJ10gPSByZXNvbHZlO1xuICAgICAgICBkZWZlcnJlZFsncmVqZWN0J10gPSByZWplY3Q7XG4gICAgICB9LCBsYWJlbCk7XG5cbiAgICAgIHJldHVybiBkZWZlcnJlZDtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJGRlZmVyJCRkZWZhdWx0ID0gbGliJHJzdnAkZGVmZXIkJGRlZmVyO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGZpbHRlciQkZmlsdGVyKHByb21pc2VzLCBmaWx0ZXJGbiwgbGFiZWwpIHtcbiAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LmFsbChwcm9taXNlcywgbGFiZWwpLnRoZW4oZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICAgIGlmICghbGliJHJzdnAkdXRpbHMkJGlzRnVuY3Rpb24oZmlsdGVyRm4pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIllvdSBtdXN0IHBhc3MgYSBmdW5jdGlvbiBhcyBmaWx0ZXIncyBzZWNvbmQgYXJndW1lbnQuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGg7XG4gICAgICAgIHZhciBmaWx0ZXJlZCA9IG5ldyBBcnJheShsZW5ndGgpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBmaWx0ZXJlZFtpXSA9IGZpbHRlckZuKHZhbHVlc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5hbGwoZmlsdGVyZWQsIGxhYmVsKS50aGVuKGZ1bmN0aW9uKGZpbHRlcmVkKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdHMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICAgICAgICB2YXIgbmV3TGVuZ3RoID0gMDtcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXJlZFtpXSkge1xuICAgICAgICAgICAgICByZXN1bHRzW25ld0xlbmd0aF0gPSB2YWx1ZXNbaV07XG4gICAgICAgICAgICAgIG5ld0xlbmd0aCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc3VsdHMubGVuZ3RoID0gbmV3TGVuZ3RoO1xuXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRmaWx0ZXIkJGRlZmF1bHQgPSBsaWIkcnN2cCRmaWx0ZXIkJGZpbHRlcjtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2goQ29uc3RydWN0b3IsIG9iamVjdCwgbGFiZWwpIHtcbiAgICAgIHRoaXMuX3N1cGVyQ29uc3RydWN0b3IoQ29uc3RydWN0b3IsIG9iamVjdCwgdHJ1ZSwgbGFiZWwpO1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJGRlZmF1bHQgPSBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoO1xuXG4gICAgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaC5wcm90b3R5cGUgPSBsaWIkcnN2cCR1dGlscyQkb19jcmVhdGUobGliJHJzdnAkZW51bWVyYXRvciQkZGVmYXVsdC5wcm90b3R5cGUpO1xuICAgIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2gucHJvdG90eXBlLl9zdXBlckNvbnN0cnVjdG9yID0gbGliJHJzdnAkZW51bWVyYXRvciQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fcmVzdWx0ID0ge307XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2gucHJvdG90eXBlLl92YWxpZGF0ZUlucHV0ID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgIHJldHVybiBpbnB1dCAmJiB0eXBlb2YgaW5wdXQgPT09ICdvYmplY3QnO1xuICAgIH07XG5cbiAgICBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoLnByb3RvdHlwZS5fdmFsaWRhdGlvbkVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdQcm9taXNlLmhhc2ggbXVzdCBiZSBjYWxsZWQgd2l0aCBhbiBvYmplY3QnKTtcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaC5wcm90b3R5cGUuX2VudW1lcmF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuICAgICAgdmFyIHByb21pc2UgICAgPSBlbnVtZXJhdG9yLnByb21pc2U7XG4gICAgICB2YXIgaW5wdXQgICAgICA9IGVudW1lcmF0b3IuX2lucHV0O1xuICAgICAgdmFyIHJlc3VsdHMgICAgPSBbXTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIGlucHV0KSB7XG4gICAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChpbnB1dCwga2V5KSkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICBwb3NpdGlvbjoga2V5LFxuICAgICAgICAgICAgZW50cnk6IGlucHV0W2tleV1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgbGVuZ3RoID0gcmVzdWx0cy5sZW5ndGg7XG4gICAgICBlbnVtZXJhdG9yLl9yZW1haW5pbmcgPSBsZW5ndGg7XG4gICAgICB2YXIgcmVzdWx0O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgcHJvbWlzZS5fc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORyAmJiBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0c1tpXTtcbiAgICAgICAgZW51bWVyYXRvci5fZWFjaEVudHJ5KHJlc3VsdC5lbnRyeSwgcmVzdWx0LnBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRIYXNoU2V0dGxlZChDb25zdHJ1Y3Rvciwgb2JqZWN0LCBsYWJlbCkge1xuICAgICAgdGhpcy5fc3VwZXJDb25zdHJ1Y3RvcihDb25zdHJ1Y3Rvciwgb2JqZWN0LCBmYWxzZSwgbGFiZWwpO1xuICAgIH1cblxuICAgIGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkSGFzaFNldHRsZWQucHJvdG90eXBlID0gbGliJHJzdnAkdXRpbHMkJG9fY3JlYXRlKGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkZGVmYXVsdC5wcm90b3R5cGUpO1xuICAgIGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkSGFzaFNldHRsZWQucHJvdG90eXBlLl9zdXBlckNvbnN0cnVjdG9yID0gbGliJHJzdnAkZW51bWVyYXRvciQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJEhhc2hTZXR0bGVkLnByb3RvdHlwZS5fbWFrZVJlc3VsdCA9IGxpYiRyc3ZwJGVudW1lcmF0b3IkJG1ha2VTZXR0bGVkUmVzdWx0O1xuXG4gICAgbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRIYXNoU2V0dGxlZC5wcm90b3R5cGUuX3ZhbGlkYXRpb25FcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignaGFzaFNldHRsZWQgbXVzdCBiZSBjYWxsZWQgd2l0aCBhbiBvYmplY3QnKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRoYXNoU2V0dGxlZChvYmplY3QsIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbmV3IGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkSGFzaFNldHRsZWQobGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdCwgb2JqZWN0LCBsYWJlbCkucHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkZGVmYXVsdCA9IGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkaGFzaFNldHRsZWQ7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkaGFzaCQkaGFzaChvYmplY3QsIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbmV3IGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkZGVmYXVsdChsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LCBvYmplY3QsIGxhYmVsKS5wcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkaGFzaCQkZGVmYXVsdCA9IGxpYiRyc3ZwJGhhc2gkJGhhc2g7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbWFwJCRtYXAocHJvbWlzZXMsIG1hcEZuLCBsYWJlbCkge1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQuYWxsKHByb21pc2VzLCBsYWJlbCkudGhlbihmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgICAgaWYgKCFsaWIkcnN2cCR1dGlscyQkaXNGdW5jdGlvbihtYXBGbikpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiWW91IG11c3QgcGFzcyBhIGZ1bmN0aW9uIGFzIG1hcCdzIHNlY29uZCBhcmd1bWVudC5cIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aDtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgcmVzdWx0c1tpXSA9IG1hcEZuKHZhbHVlc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5hbGwocmVzdWx0cywgbGFiZWwpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRtYXAkJGRlZmF1bHQgPSBsaWIkcnN2cCRtYXAkJG1hcDtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJFJlc3VsdCgpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJG5vZGUkJEVSUk9SID0gbmV3IGxpYiRyc3ZwJG5vZGUkJFJlc3VsdCgpO1xuICAgIHZhciBsaWIkcnN2cCRub2RlJCRHRVRfVEhFTl9FUlJPUiA9IG5ldyBsaWIkcnN2cCRub2RlJCRSZXN1bHQoKTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJGdldFRoZW4ob2JqKSB7XG4gICAgICB0cnkge1xuICAgICAgIHJldHVybiBvYmoudGhlbjtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgbGliJHJzdnAkbm9kZSQkRVJST1IudmFsdWU9IGVycm9yO1xuICAgICAgICByZXR1cm4gbGliJHJzdnAkbm9kZSQkRVJST1I7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCR0cnlBcHBseShmLCBzLCBhKSB7XG4gICAgICB0cnkge1xuICAgICAgICBmLmFwcGx5KHMsIGEpO1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsaWIkcnN2cCRub2RlJCRFUlJPUi52YWx1ZSA9IGVycm9yO1xuICAgICAgICByZXR1cm4gbGliJHJzdnAkbm9kZSQkRVJST1I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkbWFrZU9iamVjdChfLCBhcmd1bWVudE5hbWVzKSB7XG4gICAgICB2YXIgb2JqID0ge307XG4gICAgICB2YXIgbmFtZTtcbiAgICAgIHZhciBpO1xuICAgICAgdmFyIGxlbmd0aCA9IF8ubGVuZ3RoO1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkobGVuZ3RoKTtcblxuICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBsZW5ndGg7IHgrKykge1xuICAgICAgICBhcmdzW3hdID0gX1t4XTtcbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gMDsgaSA8IGFyZ3VtZW50TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbmFtZSA9IGFyZ3VtZW50TmFtZXNbaV07XG4gICAgICAgIG9ialtuYW1lXSA9IGFyZ3NbaSArIDFdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJGFycmF5UmVzdWx0KF8pIHtcbiAgICAgIHZhciBsZW5ndGggPSBfLmxlbmd0aDtcbiAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGxlbmd0aCAtIDEpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFyZ3NbaSAtIDFdID0gX1tpXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFyZ3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkd3JhcFRoZW5hYmxlKHRoZW4sIHByb21pc2UpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRoZW46IGZ1bmN0aW9uKG9uRnVsRmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIHRoZW4uY2FsbChwcm9taXNlLCBvbkZ1bEZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkZGVub2RlaWZ5KG5vZGVGdW5jLCBvcHRpb25zKSB7XG4gICAgICB2YXIgZm4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgbCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGwgKyAxKTtcbiAgICAgICAgdmFyIGFyZztcbiAgICAgICAgdmFyIHByb21pc2VJbnB1dCA9IGZhbHNlO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgYXJnID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICAgICAgaWYgKCFwcm9taXNlSW5wdXQpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IGNsZWFuIHRoaXMgdXBcbiAgICAgICAgICAgIHByb21pc2VJbnB1dCA9IGxpYiRyc3ZwJG5vZGUkJG5lZWRzUHJvbWlzZUlucHV0KGFyZyk7XG4gICAgICAgICAgICBpZiAocHJvbWlzZUlucHV0ID09PSBsaWIkcnN2cCRub2RlJCRHRVRfVEhFTl9FUlJPUikge1xuICAgICAgICAgICAgICB2YXIgcCA9IG5ldyBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0KGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCk7XG4gICAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHAsIGxpYiRyc3ZwJG5vZGUkJEdFVF9USEVOX0VSUk9SLnZhbHVlKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb21pc2VJbnB1dCAmJiBwcm9taXNlSW5wdXQgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgYXJnID0gbGliJHJzdnAkbm9kZSQkd3JhcFRoZW5hYmxlKHByb21pc2VJbnB1dCwgYXJnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwcm9taXNlID0gbmV3IGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQobGliJHJzdnAkJGludGVybmFsJCRub29wKTtcblxuICAgICAgICBhcmdzW2xdID0gZnVuY3Rpb24oZXJyLCB2YWwpIHtcbiAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgZXJyKTtcbiAgICAgICAgICBlbHNlIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsKTtcbiAgICAgICAgICBlbHNlIGlmIChvcHRpb25zID09PSB0cnVlKVxuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIGxpYiRyc3ZwJG5vZGUkJGFycmF5UmVzdWx0KGFyZ3VtZW50cykpO1xuICAgICAgICAgIGVsc2UgaWYgKGxpYiRyc3ZwJHV0aWxzJCRpc0FycmF5KG9wdGlvbnMpKVxuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIGxpYiRyc3ZwJG5vZGUkJG1ha2VPYmplY3QoYXJndW1lbnRzLCBvcHRpb25zKSk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHByb21pc2VJbnB1dCkge1xuICAgICAgICAgIHJldHVybiBsaWIkcnN2cCRub2RlJCRoYW5kbGVQcm9taXNlSW5wdXQocHJvbWlzZSwgYXJncywgbm9kZUZ1bmMsIHNlbGYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBsaWIkcnN2cCRub2RlJCRoYW5kbGVWYWx1ZUlucHV0KHByb21pc2UsIGFyZ3MsIG5vZGVGdW5jLCBzZWxmKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZm4uX19wcm90b19fID0gbm9kZUZ1bmM7XG5cbiAgICAgIHJldHVybiBmbjtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkbm9kZSQkZGVmYXVsdCA9IGxpYiRyc3ZwJG5vZGUkJGRlbm9kZWlmeTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJGhhbmRsZVZhbHVlSW5wdXQocHJvbWlzZSwgYXJncywgbm9kZUZ1bmMsIHNlbGYpIHtcbiAgICAgIHZhciByZXN1bHQgPSBsaWIkcnN2cCRub2RlJCR0cnlBcHBseShub2RlRnVuYywgc2VsZiwgYXJncyk7XG4gICAgICBpZiAocmVzdWx0ID09PSBsaWIkcnN2cCRub2RlJCRFUlJPUikge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZXN1bHQudmFsdWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkaGFuZGxlUHJvbWlzZUlucHV0KHByb21pc2UsIGFyZ3MsIG5vZGVGdW5jLCBzZWxmKXtcbiAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LmFsbChhcmdzKS50aGVuKGZ1bmN0aW9uKGFyZ3Mpe1xuICAgICAgICB2YXIgcmVzdWx0ID0gbGliJHJzdnAkbm9kZSQkdHJ5QXBwbHkobm9kZUZ1bmMsIHNlbGYsIGFyZ3MpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBsaWIkcnN2cCRub2RlJCRFUlJPUikge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlc3VsdC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRuZWVkc1Byb21pc2VJbnB1dChhcmcpIHtcbiAgICAgIGlmIChhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgaWYgKGFyZy5jb25zdHJ1Y3RvciA9PT0gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBsaWIkcnN2cCRub2RlJCRnZXRUaGVuKGFyZyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHBsYXRmb3JtJCRwbGF0Zm9ybTtcblxuICAgIC8qIGdsb2JhbCBzZWxmICovXG4gICAgaWYgKHR5cGVvZiBzZWxmID09PSAnb2JqZWN0Jykge1xuICAgICAgbGliJHJzdnAkcGxhdGZvcm0kJHBsYXRmb3JtID0gc2VsZjtcblxuICAgIC8qIGdsb2JhbCBnbG9iYWwgKi9cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgPT09ICdvYmplY3QnKSB7XG4gICAgICBsaWIkcnN2cCRwbGF0Zm9ybSQkcGxhdGZvcm0gPSBnbG9iYWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gZ2xvYmFsOiBgc2VsZmAgb3IgYGdsb2JhbGAgZm91bmQnKTtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkcGxhdGZvcm0kJGRlZmF1bHQgPSBsaWIkcnN2cCRwbGF0Zm9ybSQkcGxhdGZvcm07XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcmFjZSQkcmFjZShhcnJheSwgbGFiZWwpIHtcbiAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LnJhY2UoYXJyYXksIGxhYmVsKTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHJhY2UkJGRlZmF1bHQgPSBsaWIkcnN2cCRyYWNlJCRyYWNlO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHJlamVjdCQkcmVqZWN0KHJlYXNvbiwgbGFiZWwpIHtcbiAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LnJlamVjdChyZWFzb24sIGxhYmVsKTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHJlamVjdCQkZGVmYXVsdCA9IGxpYiRyc3ZwJHJlamVjdCQkcmVqZWN0O1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHJlc29sdmUkJHJlc29sdmUodmFsdWUsIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5yZXNvbHZlKHZhbHVlLCBsYWJlbCk7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRyZXNvbHZlJCRkZWZhdWx0ID0gbGliJHJzdnAkcmVzb2x2ZSQkcmVzb2x2ZTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRyZXRocm93JCRyZXRocm93KHJlYXNvbikge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdGhyb3cgcmVhc29uO1xuICAgICAgfSk7XG4gICAgICB0aHJvdyByZWFzb247XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRyZXRocm93JCRkZWZhdWx0ID0gbGliJHJzdnAkcmV0aHJvdyQkcmV0aHJvdztcblxuICAgIC8vIGRlZmF1bHRzXG4gICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYXN5bmMgPSBsaWIkcnN2cCRhc2FwJCRkZWZhdWx0O1xuICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFmdGVyID0gZnVuY3Rpb24oY2IpIHtcbiAgICAgIHNldFRpbWVvdXQoY2IsIDApO1xuICAgIH07XG4gICAgdmFyIGxpYiRyc3ZwJCRjYXN0ID0gbGliJHJzdnAkcmVzb2x2ZSQkZGVmYXVsdDtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkYXN5bmMoY2FsbGJhY2ssIGFyZykge1xuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYXN5bmMoY2FsbGJhY2ssIGFyZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJG9uKCkge1xuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWdbJ29uJ10uYXBwbHkobGliJHJzdnAkY29uZmlnJCRjb25maWcsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJG9mZigpIHtcbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnWydvZmYnXS5hcHBseShsaWIkcnN2cCRjb25maWckJGNvbmZpZywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdXAgaW5zdHJ1bWVudGF0aW9uIHRocm91Z2ggYHdpbmRvdy5fX1BST01JU0VfSU5UUlVNRU5UQVRJT05fX2BcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvd1snX19QUk9NSVNFX0lOU1RSVU1FTlRBVElPTl9fJ10gPT09ICdvYmplY3QnKSB7XG4gICAgICB2YXIgbGliJHJzdnAkJGNhbGxiYWNrcyA9IHdpbmRvd1snX19QUk9NSVNFX0lOU1RSVU1FTlRBVElPTl9fJ107XG4gICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZ3VyZSgnaW5zdHJ1bWVudCcsIHRydWUpO1xuICAgICAgZm9yICh2YXIgbGliJHJzdnAkJGV2ZW50TmFtZSBpbiBsaWIkcnN2cCQkY2FsbGJhY2tzKSB7XG4gICAgICAgIGlmIChsaWIkcnN2cCQkY2FsbGJhY2tzLmhhc093blByb3BlcnR5KGxpYiRyc3ZwJCRldmVudE5hbWUpKSB7XG4gICAgICAgICAgbGliJHJzdnAkJG9uKGxpYiRyc3ZwJCRldmVudE5hbWUsIGxpYiRyc3ZwJCRjYWxsYmFja3NbbGliJHJzdnAkJGV2ZW50TmFtZV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJHVtZCQkUlNWUCA9IHtcbiAgICAgICdyYWNlJzogbGliJHJzdnAkcmFjZSQkZGVmYXVsdCxcbiAgICAgICdQcm9taXNlJzogbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdCxcbiAgICAgICdhbGxTZXR0bGVkJzogbGliJHJzdnAkYWxsJHNldHRsZWQkJGRlZmF1bHQsXG4gICAgICAnaGFzaCc6IGxpYiRyc3ZwJGhhc2gkJGRlZmF1bHQsXG4gICAgICAnaGFzaFNldHRsZWQnOiBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJGRlZmF1bHQsXG4gICAgICAnZGVub2RlaWZ5JzogbGliJHJzdnAkbm9kZSQkZGVmYXVsdCxcbiAgICAgICdvbic6IGxpYiRyc3ZwJCRvbixcbiAgICAgICdvZmYnOiBsaWIkcnN2cCQkb2ZmLFxuICAgICAgJ21hcCc6IGxpYiRyc3ZwJG1hcCQkZGVmYXVsdCxcbiAgICAgICdmaWx0ZXInOiBsaWIkcnN2cCRmaWx0ZXIkJGRlZmF1bHQsXG4gICAgICAncmVzb2x2ZSc6IGxpYiRyc3ZwJHJlc29sdmUkJGRlZmF1bHQsXG4gICAgICAncmVqZWN0JzogbGliJHJzdnAkcmVqZWN0JCRkZWZhdWx0LFxuICAgICAgJ2FsbCc6IGxpYiRyc3ZwJGFsbCQkZGVmYXVsdCxcbiAgICAgICdyZXRocm93JzogbGliJHJzdnAkcmV0aHJvdyQkZGVmYXVsdCxcbiAgICAgICdkZWZlcic6IGxpYiRyc3ZwJGRlZmVyJCRkZWZhdWx0LFxuICAgICAgJ0V2ZW50VGFyZ2V0JzogbGliJHJzdnAkZXZlbnRzJCRkZWZhdWx0LFxuICAgICAgJ2NvbmZpZ3VyZSc6IGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlndXJlLFxuICAgICAgJ2FzeW5jJzogbGliJHJzdnAkJGFzeW5jXG4gICAgfTtcblxuICAgIC8qIGdsb2JhbCBkZWZpbmU6dHJ1ZSBtb2R1bGU6dHJ1ZSB3aW5kb3c6IHRydWUgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmVbJ2FtZCddKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBsaWIkcnN2cCR1bWQkJFJTVlA7IH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlWydleHBvcnRzJ10pIHtcbiAgICAgIG1vZHVsZVsnZXhwb3J0cyddID0gbGliJHJzdnAkdW1kJCRSU1ZQO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGxpYiRyc3ZwJHBsYXRmb3JtJCRkZWZhdWx0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgbGliJHJzdnAkcGxhdGZvcm0kJGRlZmF1bHRbJ1JTVlAnXSA9IGxpYiRyc3ZwJHVtZCQkUlNWUDtcbiAgICB9XG59KS5jYWxsKHRoaXMpO1xuXG4iXX0=
=======
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAvY2FjaGUuanMiLCJqcy9hcHAvY29uc3RydWN0b3IuanMiLCJqcy9hcHAvaW5kZXguanMiLCJqcy9kb20vaW5kZXguanMiLCJqcy9kb20vbG9hZGluZ19zbGlkZXIuanMiLCJqcy9kb20vc2V0dXAvaW5kZXguanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfZGl2aWRlcnMuanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfZG9jdW1lbnQuanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfZmlsZXNfYmFyLmpzIiwianMvZG9tL3NldHVwL3NldHVwX2ludGVydmFsLmpzIiwianMvZG9tL3NldHVwL3NldHVwX21vZHVsZV9jb250YWluZXIuanMiLCJqcy9kb20vc2V0dXAvc2V0dXBfcG93ZXJlZF9ieS5qcyIsImpzL2RvbS9zZXR1cC9zZXR1cF9zY3JhdGNoX3BhcGVyLmpzIiwianMvZG9tL3NldHVwL3NldHVwX3NpZGVfbWVudS5qcyIsImpzL2RvbS9zZXR1cC9zZXR1cF90b3BfbWVudS5qcyIsImpzL2RvbS9zZXR1cC9zZXR1cF93aW5kb3cuanMiLCJqcy9kb20vc2hvd19hbGdvcml0aG0uanMiLCJqcy9kb20vc2hvd19jYXRlZ29yaWVzLmpzIiwianMvZG9tL3Nob3dfZGVzY3JpcHRpb24uanMiLCJqcy9kb20vc2hvd19maWxlcy5qcyIsImpzL2RvbS9zaG93X2ZpcnN0X2FsZ29yaXRobS5qcyIsImpzL2RvbS90b2FzdC5qcyIsImpzL2VkaXRvci9jcmVhdGUuanMiLCJqcy9lZGl0b3IvZXhlY3V0b3IuanMiLCJqcy9lZGl0b3IvaW5kZXguanMiLCJqcy9pbmRleC5qcyIsImpzL21vZHVsZS9hcnJheTFkLmpzIiwianMvbW9kdWxlL2FycmF5MmQuanMiLCJqcy9tb2R1bGUvY2hhcnQuanMiLCJqcy9tb2R1bGUvY29vcmRpbmF0ZV9zeXN0ZW0uanMiLCJqcy9tb2R1bGUvZGlyZWN0ZWRfZ3JhcGguanMiLCJqcy9tb2R1bGUvaW5kZXguanMiLCJqcy9tb2R1bGUvbG9nX3RyYWNlci5qcyIsImpzL21vZHVsZS90cmFjZXIuanMiLCJqcy9tb2R1bGUvdW5kaXJlY3RlZF9ncmFwaC5qcyIsImpzL21vZHVsZS93ZWlnaHRlZF9kaXJlY3RlZF9ncmFwaC5qcyIsImpzL21vZHVsZS93ZWlnaHRlZF91bmRpcmVjdGVkX2dyYXBoLmpzIiwianMvc2VydmVyL2FqYXgvZ2V0LmpzIiwianMvc2VydmVyL2FqYXgvZ2V0X2pzb24uanMiLCJqcy9zZXJ2ZXIvYWpheC9wb3N0X2pzb24uanMiLCJqcy9zZXJ2ZXIvYWpheC9yZXF1ZXN0LmpzIiwianMvc2VydmVyL2hlbHBlcnMuanMiLCJqcy9zZXJ2ZXIvaW5kZXguanMiLCJqcy9zZXJ2ZXIvbG9hZF9hbGdvcml0aG0uanMiLCJqcy9zZXJ2ZXIvbG9hZF9jYXRlZ29yaWVzLmpzIiwianMvc2VydmVyL2xvYWRfZmlsZS5qcyIsImpzL3NlcnZlci9sb2FkX3NjcmF0Y2hfcGFwZXIuanMiLCJqcy9zZXJ2ZXIvc2hhcmVfc2NyYXRjaF9wYXBlci5qcyIsImpzL3RyYWNlcl9tYW5hZ2VyL2luZGV4LmpzIiwianMvdHJhY2VyX21hbmFnZXIvbWFuYWdlci5qcyIsImpzL3RyYWNlcl9tYW5hZ2VyL3V0aWwvZnJvbV9qc29uLmpzIiwianMvdHJhY2VyX21hbmFnZXIvdXRpbC9pbmRleC5qcyIsImpzL3RyYWNlcl9tYW5hZ2VyL3V0aWwvcmVmaW5lX2J5X3R5cGUuanMiLCJqcy90cmFjZXJfbWFuYWdlci91dGlsL3RvX2pzb24uanMiLCJqcy91dGlscy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcnN2cC9kaXN0L3JzdnAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7U0FJSSxDO0lBREYsTSxNQUFBLE07OztBQUdGLElBQU0sUUFBUTtBQUNaLGdCQUFjLEVBREY7QUFFWixTQUFPO0FBRkss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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHtcbiAgZXh0ZW5kXG59ID0gJDtcblxuY29uc3QgY2FjaGUgPSB7XG4gIGxhc3RGaWxlVXNlZDogJycsXG4gIGZpbGVzOiB7fVxufTtcblxuY29uc3QgYXNzZXJ0RmlsZU5hbWUgPSAobmFtZSkgPT4ge1xuICBpZiAoIW5hbWUpIHtcbiAgICB0aHJvdyAnTWlzc2luZyBmaWxlIG5hbWUnO1xuICB9XG59O1xuXG5cbi8qKlxuICogR2xvYmFsIGFwcGxpY2F0aW9uIGNhY2hlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGdldENhY2hlZEZpbGUobmFtZSkge1xuICAgIGFzc2VydEZpbGVOYW1lKG5hbWUpO1xuICAgIHJldHVybiBjYWNoZS5maWxlc1tuYW1lXTtcbiAgfSxcblxuICB1cGRhdGVDYWNoZWRGaWxlKG5hbWUsIHVwZGF0ZXMpIHtcbiAgICBhc3NlcnRGaWxlTmFtZShuYW1lKTtcbiAgICBpZiAoIWNhY2hlLmZpbGVzW25hbWVdKSB7XG4gICAgICBjYWNoZS5maWxlc1tuYW1lXSA9IHt9O1xuICAgIH1cbiAgICBleHRlbmQoY2FjaGUuZmlsZXNbbmFtZV0sIHVwZGF0ZXMpO1xuICB9LFxuXG4gIGdldExhc3RGaWxlVXNlZCgpIHtcbiAgICByZXR1cm4gY2FjaGUubGFzdEZpbGVVc2VkO1xuICB9LFxuXG4gIHNldExhc3RGaWxlVXNlZChmaWxlKSB7XG4gICAgY2FjaGUubGFzdEZpbGVVc2VkID0gZmlsZTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IEVkaXRvciA9IHJlcXVpcmUoJy4uL2VkaXRvcicpO1xuY29uc3QgVHJhY2VyTWFuYWdlciA9IHJlcXVpcmUoJy4uL3RyYWNlcl9tYW5hZ2VyJyk7XG5jb25zdCBET00gPSByZXF1aXJlKCcuLi9kb20vc2V0dXAnKTtcblxuY29uc3Qge1xuICBzaG93TG9hZGluZ1NsaWRlcixcbiAgaGlkZUxvYWRpbmdTbGlkZXJcbn0gPSByZXF1aXJlKCcuLi9kb20vbG9hZGluZ19zbGlkZXInKTtcblxuY29uc3Qge1xuICBnZXRGaWxlRGlyXG59ID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuY29uc3QgQ2FjaGUgPSByZXF1aXJlKCcuL2NhY2hlJyk7XG5cbmNvbnN0IHtcbiAgZWFjaFxufSA9ICQ7XG5cbmNvbnN0IHN0YXRlID0ge1xuICBpc0xvYWRpbmc6IG51bGwsXG4gIGVkaXRvcjogbnVsbCxcbiAgdHJhY2VyTWFuYWdlcjogbnVsbCxcbiAgY2F0ZWdvcmllczogbnVsbFxufTtcblxuY29uc3QgaW5pdFN0YXRlID0gKHRyYWNlck1hbmFnZXIpID0+IHtcbiAgc3RhdGUuaXNMb2FkaW5nID0gZmFsc2U7XG4gIHN0YXRlLmVkaXRvciA9IG5ldyBFZGl0b3IodHJhY2VyTWFuYWdlcik7XG4gIHN0YXRlLnRyYWNlck1hbmFnZXIgPSB0cmFjZXJNYW5hZ2VyO1xuICBzdGF0ZS5jYXRlZ29yaWVzID0ge307XG59O1xuXG4vKipcbiAqIEdsb2JhbCBhcHBsaWNhdGlvbiBzaW5nbGV0b24uXG4gKi9cbmNvbnN0IEFwcCA9IGZ1bmN0aW9uKCkge1xuXG4gIHRoaXMuZ2V0SXNMb2FkaW5nID0gKCkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5pc0xvYWRpbmc7XG4gIH07XG5cbiAgdGhpcy5zZXRJc0xvYWRpbmcgPSAobG9hZGluZykgPT4ge1xuICAgIHN0YXRlLmlzTG9hZGluZyA9IGxvYWRpbmc7XG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHNob3dMb2FkaW5nU2xpZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhpZGVMb2FkaW5nU2xpZGVyKCk7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuZ2V0RWRpdG9yID0gKCkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5lZGl0b3I7XG4gIH07XG5cbiAgdGhpcy5nZXRDYXRlZ29yaWVzID0gKCkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5jYXRlZ29yaWVzO1xuICB9O1xuXG4gIHRoaXMuZ2V0Q2F0ZWdvcnkgPSAobmFtZSkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5jYXRlZ29yaWVzW25hbWVdO1xuICB9O1xuXG4gIHRoaXMuc2V0Q2F0ZWdvcmllcyA9IChjYXRlZ29yaWVzKSA9PiB7XG4gICAgc3RhdGUuY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG4gIH07XG5cbiAgdGhpcy51cGRhdGVDYXRlZ29yeSA9IChuYW1lLCB1cGRhdGVzKSA9PiB7XG4gICAgJC5leHRlbmQoc3RhdGUuY2F0ZWdvcmllc1tuYW1lXSwgdXBkYXRlcyk7XG4gIH07XG5cbiAgdGhpcy5nZXRUcmFjZXJNYW5hZ2VyID0gKCkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS50cmFjZXJNYW5hZ2VyO1xuICB9O1xuXG4gIGNvbnN0IHRyYWNlck1hbmFnZXIgPSBUcmFjZXJNYW5hZ2VyLmluaXQoKTtcblxuICBpbml0U3RhdGUodHJhY2VyTWFuYWdlcik7XG4gIERPTS5zZXR1cCh0cmFjZXJNYW5hZ2VyKTtcblxufTtcblxuQXBwLnByb3RvdHlwZSA9IENhY2hlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcDtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBtYWluIGFwcGxpY2F0aW9uIGluc3RhbmNlLlxuICogR2V0cyBwb3B1bGF0ZWQgb24gcGFnZSBsb2FkLiBcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7fTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHNob3dBbGdvcml0aG0gPSByZXF1aXJlKCcuL3Nob3dfYWxnb3JpdGhtJyk7XG5jb25zdCBzaG93Q2F0ZWdvcmllcyA9IHJlcXVpcmUoJy4vc2hvd19jYXRlZ29yaWVzJyk7XG5jb25zdCBzaG93RGVzY3JpcHRpb24gPSByZXF1aXJlKCcuL3Nob3dfZGVzY3JpcHRpb24nKTtcbmNvbnN0IHNob3dGaWxlcyA9IHJlcXVpcmUoJy4vc2hvd19maWxlcycpO1xuY29uc3Qgc2hvd0ZpcnN0QWxnb3JpdGhtID0gcmVxdWlyZSgnLi9zaG93X2ZpcnN0X2FsZ29yaXRobScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2hvd0FsZ29yaXRobSxcbiAgc2hvd0NhdGVnb3JpZXMsXG4gIHNob3dEZXNjcmlwdGlvbixcbiAgc2hvd0ZpbGVzLFxuICBzaG93Rmlyc3RBbGdvcml0aG1cbn07XG4iLCJcbmNvbnN0IHNob3dMb2FkaW5nU2xpZGVyID0gKCkgPT4ge1xuICAkKCcjbG9hZGluZy1zbGlkZXInKS5yZW1vdmVDbGFzcygnbG9hZGVkJyk7XG59O1xuXG5jb25zdCBoaWRlTG9hZGluZ1NsaWRlciA9ICgpID0+IHtcbiAgJCgnI2xvYWRpbmctc2xpZGVyJykuYWRkQ2xhc3MoJ2xvYWRlZCcpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNob3dMb2FkaW5nU2xpZGVyLFxuICBoaWRlTG9hZGluZ1NsaWRlclxufTtcbiIsImNvbnN0IHNldHVwRGl2aWRlcnMgPSByZXF1aXJlKCcuL3NldHVwX2RpdmlkZXJzJyk7XG5jb25zdCBzZXR1cERvY3VtZW50ID0gcmVxdWlyZSgnLi9zZXR1cF9kb2N1bWVudCcpO1xuY29uc3Qgc2V0dXBGaWxlc0JhciA9IHJlcXVpcmUoJy4vc2V0dXBfZmlsZXNfYmFyJyk7XG5jb25zdCBzZXR1cEludGVydmFsID0gcmVxdWlyZSgnLi9zZXR1cF9pbnRlcnZhbCcpO1xuY29uc3Qgc2V0dXBNb2R1bGVDb250YWluZXIgPSByZXF1aXJlKCcuL3NldHVwX21vZHVsZV9jb250YWluZXInKTtcbmNvbnN0IHNldHVwUG93ZXJlZEJ5ID0gcmVxdWlyZSgnLi9zZXR1cF9wb3dlcmVkX2J5Jyk7XG5jb25zdCBzZXR1cFNjcmF0Y2hQYXBlciA9IHJlcXVpcmUoJy4vc2V0dXBfc2NyYXRjaF9wYXBlcicpO1xuY29uc3Qgc2V0dXBTaWRlTWVudSA9IHJlcXVpcmUoJy4vc2V0dXBfc2lkZV9tZW51Jyk7XG5jb25zdCBzZXR1cFRvcE1lbnUgPSByZXF1aXJlKCcuL3NldHVwX3RvcF9tZW51Jyk7XG5jb25zdCBzZXR1cFdpbmRvdyA9IHJlcXVpcmUoJy4vc2V0dXBfd2luZG93Jyk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgZWxlbWVudHMgb25jZSB0aGUgYXBwIGxvYWRzIGluIHRoZSBET00uIFxuICovXG5jb25zdCBzZXR1cCA9ICgpID0+IHtcblxuICAkKCcuYnRuIGlucHV0JykuY2xpY2soKGUpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICB9KTtcblxuICAvLyBkaXZpZGVyc1xuICBzZXR1cERpdmlkZXJzKCk7XG5cbiAgLy8gZG9jdW1lbnRcbiAgc2V0dXBEb2N1bWVudCgpO1xuXG4gIC8vIGZpbGVzIGJhclxuICBzZXR1cEZpbGVzQmFyKCk7XG5cbiAgLy8gaW50ZXJ2YWxcbiAgc2V0dXBJbnRlcnZhbCgpO1xuXG4gIC8vIG1vZHVsZSBjb250YWluZXJcbiAgc2V0dXBNb2R1bGVDb250YWluZXIoKTtcblxuICAvLyBwb3dlcmVkIGJ5XG4gIHNldHVwUG93ZXJlZEJ5KCk7XG5cbiAgLy8gc2NyYXRjaCBwYXBlclxuICBzZXR1cFNjcmF0Y2hQYXBlcigpO1xuXG4gIC8vIHNpZGUgbWVudVxuICBzZXR1cFNpZGVNZW51KCk7XG5cbiAgLy8gdG9wIG1lbnVcbiAgc2V0dXBUb3BNZW51KCk7XG5cbiAgLy8gd2luZG93XG4gIHNldHVwV2luZG93KCk7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXR1cFxufTsiLCJjb25zdCBhcHBJbnN0YW5jZSA9IHJlcXVpcmUoJy4uLy4uL2FwcCcpO1xuXG5jb25zdCBhZGREaXZpZGVyVG9Eb20gPSAoZGl2aWRlcikgPT4ge1xuICBjb25zdCBbdmVydGljYWwsICRmaXJzdCwgJHNlY29uZF0gPSBkaXZpZGVyO1xuICBjb25zdCAkcGFyZW50ID0gJGZpcnN0LnBhcmVudCgpO1xuICBjb25zdCB0aGlja25lc3MgPSA1O1xuXG4gIGNvbnN0ICRkaXZpZGVyID0gJCgnPGRpdiBjbGFzcz1cImRpdmlkZXJcIj4nKTtcblxuICBsZXQgZHJhZ2dpbmcgPSBmYWxzZTtcbiAgaWYgKHZlcnRpY2FsKSB7XG4gICAgJGRpdmlkZXIuYWRkQ2xhc3MoJ3ZlcnRpY2FsJyk7XG5cbiAgICBsZXQgX2xlZnQgPSAtdGhpY2tuZXNzIC8gMjtcbiAgICAkZGl2aWRlci5jc3Moe1xuICAgICAgdG9wOiAwLFxuICAgICAgYm90dG9tOiAwLFxuICAgICAgbGVmdDogX2xlZnQsXG4gICAgICB3aWR0aDogdGhpY2tuZXNzXG4gICAgfSk7XG5cbiAgICBsZXQgeDtcbiAgICAkZGl2aWRlci5tb3VzZWRvd24oKHtcbiAgICAgIHBhZ2VYXG4gICAgfSkgPT4ge1xuICAgICAgeCA9IHBhZ2VYO1xuICAgICAgZHJhZ2dpbmcgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkubW91c2Vtb3ZlKCh7XG4gICAgICBwYWdlWFxuICAgIH0pID0+IHtcbiAgICAgIGlmIChkcmFnZ2luZykge1xuICAgICAgICBjb25zdCBuZXdfbGVmdCA9ICRzZWNvbmQucG9zaXRpb24oKS5sZWZ0ICsgcGFnZVggLSB4O1xuICAgICAgICBsZXQgcGVyY2VudCA9IG5ld19sZWZ0IC8gJHBhcmVudC53aWR0aCgpICogMTAwO1xuICAgICAgICBwZXJjZW50ID0gTWF0aC5taW4oOTAsIE1hdGgubWF4KDEwLCBwZXJjZW50KSk7XG4gICAgICAgICRmaXJzdC5jc3MoJ3JpZ2h0JywgKDEwMCAtIHBlcmNlbnQpICsgJyUnKTtcbiAgICAgICAgJHNlY29uZC5jc3MoJ2xlZnQnLCBwZXJjZW50ICsgJyUnKTtcbiAgICAgICAgeCA9IHBhZ2VYO1xuICAgICAgICBhcHBJbnN0YW5jZS5nZXRUcmFjZXJNYW5hZ2VyKCkucmVzaXplKCk7XG4gICAgICAgICQoJy5maWxlc19iYXIgPiAud3JhcHBlcicpLnNjcm9sbCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbihlKSB7XG4gICAgICBkcmFnZ2luZyA9IGZhbHNlO1xuICAgIH0pO1xuXG4gIH0gZWxzZSB7XG5cbiAgICAkZGl2aWRlci5hZGRDbGFzcygnaG9yaXpvbnRhbCcpO1xuICAgIGNvbnN0IF90b3AgPSAtdGhpY2tuZXNzIC8gMjtcbiAgICAkZGl2aWRlci5jc3Moe1xuICAgICAgdG9wOiBfdG9wLFxuICAgICAgaGVpZ2h0OiB0aGlja25lc3MsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgcmlnaHQ6IDBcbiAgICB9KTtcblxuICAgIGxldCB5O1xuICAgICRkaXZpZGVyLm1vdXNlZG93bihmdW5jdGlvbih7XG4gICAgICBwYWdlWVxuICAgIH0pIHtcbiAgICAgIHkgPSBwYWdlWTtcbiAgICAgIGRyYWdnaW5nID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm1vdXNlbW92ZShmdW5jdGlvbih7XG4gICAgICBwYWdlWVxuICAgIH0pIHtcbiAgICAgIGlmIChkcmFnZ2luZykge1xuICAgICAgICBjb25zdCBuZXdfdG9wID0gJHNlY29uZC5wb3NpdGlvbigpLnRvcCArIHBhZ2VZIC0geTtcbiAgICAgICAgbGV0IHBlcmNlbnQgPSBuZXdfdG9wIC8gJHBhcmVudC5oZWlnaHQoKSAqIDEwMDtcbiAgICAgICAgcGVyY2VudCA9IE1hdGgubWluKDkwLCBNYXRoLm1heCgxMCwgcGVyY2VudCkpO1xuICAgICAgICAkZmlyc3QuY3NzKCdib3R0b20nLCAoMTAwIC0gcGVyY2VudCkgKyAnJScpO1xuICAgICAgICAkc2Vjb25kLmNzcygndG9wJywgcGVyY2VudCArICclJyk7XG4gICAgICAgIHkgPSBwYWdlWTtcbiAgICAgICAgYXBwSW5zdGFuY2UuZ2V0VHJhY2VyTWFuYWdlcigpLnJlc2l6ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbihlKSB7XG4gICAgICBkcmFnZ2luZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgJHNlY29uZC5hcHBlbmQoJGRpdmlkZXIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG4gIGNvbnN0IGRpdmlkZXJzID0gW1xuICAgIFsndicsICQoJy5zaWRlbWVudScpLCAkKCcud29ya3NwYWNlJyldLFxuICAgIFsndicsICQoJy52aWV3ZXJfY29udGFpbmVyJyksICQoJy5lZGl0b3JfY29udGFpbmVyJyldLFxuICAgIFsnaCcsICQoJy5kYXRhX2NvbnRhaW5lcicpLCAkKCcuY29kZV9jb250YWluZXInKV1cbiAgXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXZpZGVycy5sZW5ndGg7IGkrKykge1xuICAgIGFkZERpdmlkZXJUb0RvbShkaXZpZGVyc1tpXSk7XG4gIH1cbn0iLCJjb25zdCBhcHBJbnN0YW5jZSA9IHJlcXVpcmUoJy4uLy4uL2FwcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJ2EnLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmICghd2luZG93Lm9wZW4oJCh0aGlzKS5hdHRyKCdocmVmJyksICdfYmxhbmsnKSkge1xuICAgICAgYWxlcnQoJ1BsZWFzZSBhbGxvdyBwb3B1cHMgZm9yIHRoaXMgc2l0ZScpO1xuICAgIH1cbiAgfSk7XG5cbiAgJChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbihlKSB7XG4gICAgYXBwSW5zdGFuY2UuZ2V0VHJhY2VyTWFuYWdlcigpLmNvbW1hbmQoJ21vdXNldXAnLCBlKTtcbiAgfSk7XG59OyIsImNvbnN0IGRlZmluaXRlbHlCaWdnZXIgPSAoeCwgeSkgPT4geCA+ICh5ICsgMik7XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuXG4gICQoJy5maWxlc19iYXIgPiAuYnRuLWxlZnQnKS5jbGljaygoKSA9PiB7XG4gICAgY29uc3QgJHdyYXBwZXIgPSAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKTtcbiAgICBjb25zdCBjbGlwV2lkdGggPSAkd3JhcHBlci53aWR0aCgpO1xuICAgIGNvbnN0IHNjcm9sbExlZnQgPSAkd3JhcHBlci5zY3JvbGxMZWZ0KCk7XG5cbiAgICAkKCR3cmFwcGVyLmNoaWxkcmVuKCdidXR0b24nKS5nZXQoKS5yZXZlcnNlKCkpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBsZWZ0ID0gJCh0aGlzKS5wb3NpdGlvbigpLmxlZnQ7XG4gICAgICBjb25zdCByaWdodCA9IGxlZnQgKyAkKHRoaXMpLm91dGVyV2lkdGgoKTtcbiAgICAgIGlmICgwID4gbGVmdCkge1xuICAgICAgICAkd3JhcHBlci5zY3JvbGxMZWZ0KHNjcm9sbExlZnQgKyByaWdodCAtIGNsaXBXaWR0aCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgJCgnLmZpbGVzX2JhciA+IC5idG4tcmlnaHQnKS5jbGljaygoKSA9PiB7XG4gICAgY29uc3QgJHdyYXBwZXIgPSAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKTtcbiAgICBjb25zdCBjbGlwV2lkdGggPSAkd3JhcHBlci53aWR0aCgpO1xuICAgIGNvbnN0IHNjcm9sbExlZnQgPSAkd3JhcHBlci5zY3JvbGxMZWZ0KCk7XG5cbiAgICAkd3JhcHBlci5jaGlsZHJlbignYnV0dG9uJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGxlZnQgPSAkKHRoaXMpLnBvc2l0aW9uKCkubGVmdDtcbiAgICAgIGNvbnN0IHJpZ2h0ID0gbGVmdCArICQodGhpcykub3V0ZXJXaWR0aCgpO1xuICAgICAgaWYgKGNsaXBXaWR0aCA8IHJpZ2h0KSB7XG4gICAgICAgICR3cmFwcGVyLnNjcm9sbExlZnQoc2Nyb2xsTGVmdCArIGxlZnQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gICQoJy5maWxlc19iYXIgPiAud3JhcHBlcicpLnNjcm9sbChmdW5jdGlvbigpIHtcblxuICAgIGNvbnN0ICR3cmFwcGVyID0gJCgnLmZpbGVzX2JhciA+IC53cmFwcGVyJyk7XG4gICAgY29uc3QgY2xpcFdpZHRoID0gJHdyYXBwZXIud2lkdGgoKTtcbiAgICBjb25zdCAkbGVmdCA9ICR3cmFwcGVyLmNoaWxkcmVuKCdidXR0b246Zmlyc3QtY2hpbGQnKTtcbiAgICBjb25zdCAkcmlnaHQgPSAkd3JhcHBlci5jaGlsZHJlbignYnV0dG9uOmxhc3QtY2hpbGQnKTtcbiAgICBjb25zdCBsZWZ0ID0gJGxlZnQucG9zaXRpb24oKS5sZWZ0O1xuICAgIGNvbnN0IHJpZ2h0ID0gJHJpZ2h0LnBvc2l0aW9uKCkubGVmdCArICRyaWdodC5vdXRlcldpZHRoKCk7XG5cbiAgICBpZiAoZGVmaW5pdGVseUJpZ2dlcigwLCBsZWZ0KSAmJiBkZWZpbml0ZWx5QmlnZ2VyKGNsaXBXaWR0aCwgcmlnaHQpKSB7XG4gICAgICBjb25zdCBzY3JvbGxMZWZ0ID0gJHdyYXBwZXIuc2Nyb2xsTGVmdCgpO1xuICAgICAgJHdyYXBwZXIuc2Nyb2xsTGVmdChzY3JvbGxMZWZ0ICsgY2xpcFdpZHRoIC0gcmlnaHQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxlZnRlciA9IGRlZmluaXRlbHlCaWdnZXIoMCwgbGVmdCk7XG4gICAgY29uc3QgcmlnaHRlciA9IGRlZmluaXRlbHlCaWdnZXIocmlnaHQsIGNsaXBXaWR0aCk7XG4gICAgJHdyYXBwZXIudG9nZ2xlQ2xhc3MoJ3NoYWRvdy1sZWZ0JywgbGVmdGVyKTtcbiAgICAkd3JhcHBlci50b2dnbGVDbGFzcygnc2hhZG93LXJpZ2h0JywgcmlnaHRlcik7XG4gICAgJCgnLmZpbGVzX2JhciA+IC5idG4tbGVmdCcpLmF0dHIoJ2Rpc2FibGVkJywgIWxlZnRlcik7XG4gICAgJCgnLmZpbGVzX2JhciA+IC5idG4tcmlnaHQnKS5hdHRyKCdkaXNhYmxlZCcsICFyaWdodGVyKTtcbiAgfSk7XG59IiwiY29uc3QgYXBwSW5zdGFuY2UgPSByZXF1aXJlKCcuLi8uLi9hcHAnKTtcbmNvbnN0IFRvYXN0ID0gcmVxdWlyZSgnLi4vdG9hc3QnKTtcblxuY29uc3Qge1xuICBwYXJzZUZsb2F0XG59ID0gTnVtYmVyO1xuXG5jb25zdCBtaW5JbnRlcnZhbCA9IDAuMTtcbmNvbnN0IG1heEludGVydmFsID0gMTA7XG5jb25zdCBzdGFydEludGVydmFsID0gMC41O1xuY29uc3Qgc3RlcEludGVydmFsID0gMC4xO1xuXG5jb25zdCBub3JtYWxpemUgPSAoc2VjKSA9PiB7XG5cblxuICBsZXQgaW50ZXJ2YWw7XG4gIGxldCBtZXNzYWdlO1xuICBpZiAoc2VjIDwgbWluSW50ZXJ2YWwpIHtcbiAgICBpbnRlcnZhbCA9IG1pbkludGVydmFsO1xuICAgIG1lc3NhZ2UgPSBgSW50ZXJ2YWwgb2YgJHtzZWN9IHNlY29uZHMgaXMgdG9vIGxvdy4gU2V0dGluZyB0byBtaW4gYWxsb3dlZCBpbnRlcnZhbCBvZiAke21pbkludGVydmFsfSBzZWNvbmQocykuYDtcbiAgfSBlbHNlIGlmIChzZWMgPiBtYXhJbnRlcnZhbCkge1xuICAgIGludGVydmFsID0gbWF4SW50ZXJ2YWw7XG4gICAgbWVzc2FnZSA9IGBJbnRlcnZhbCBvZiAke3NlY30gc2Vjb25kcyBpcyB0b28gaGlnaC4gU2V0dGluZyB0byBtYXggYWxsb3dlZCBpbnRlcnZhbCBvZiAke21heEludGVydmFsfSBzZWNvbmQocykuYDtcbiAgfSBlbHNlIHtcbiAgICBpbnRlcnZhbCA9IHNlYztcbiAgICBtZXNzYWdlID0gYEludGVydmFsIGhhcyBiZWVuIHNldCB0byAke3NlY30gc2Vjb25kKHMpLmBcbiAgfVxuXG4gIHJldHVybiBbaW50ZXJ2YWwsIG1lc3NhZ2VdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG5cbiAgY29uc3QgJGludGVydmFsID0gJCgnI2ludGVydmFsJyk7XG4gICRpbnRlcnZhbC52YWwoc3RhcnRJbnRlcnZhbCk7XG4gICRpbnRlcnZhbC5hdHRyKHtcbiAgICBtYXg6IG1heEludGVydmFsLFxuICAgIG1pbjogbWluSW50ZXJ2YWwsXG4gICAgc3RlcDogc3RlcEludGVydmFsXG4gIH0pO1xuXG4gICQoJyNpbnRlcnZhbCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCB0cmFjZXJNYW5hZ2VyID0gYXBwSW5zdGFuY2UuZ2V0VHJhY2VyTWFuYWdlcigpO1xuICAgIGNvbnN0IFtzZWNvbmRzLCBtZXNzYWdlXSA9IG5vcm1hbGl6ZShwYXJzZUZsb2F0KCQodGhpcykudmFsKCkpKTtcblxuICAgICQodGhpcykudmFsKHNlY29uZHMpO1xuICAgIHRyYWNlck1hbmFnZXIuaW50ZXJ2YWwgPSBzZWNvbmRzICogMTAwMDtcbiAgICBUb2FzdC5zaG93SW5mb1RvYXN0KG1lc3NhZ2UpO1xuICB9KTtcbn07IiwiY29uc3QgYXBwSW5zdGFuY2UgPSByZXF1aXJlKCcuLi8uLi9hcHAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG5cbiAgY29uc3QgJG1vZHVsZV9jb250YWluZXIgPSAkKCcubW9kdWxlX2NvbnRhaW5lcicpO1xuXG4gICRtb2R1bGVfY29udGFpbmVyLm9uKCdtb3VzZWRvd24nLCAnLm1vZHVsZV93cmFwcGVyJywgZnVuY3Rpb24oZSkge1xuICAgIGFwcEluc3RhbmNlLmdldFRyYWNlck1hbmFnZXIoKS5maW5kT3duZXIodGhpcykubW91c2Vkb3duKGUpO1xuICB9KTtcblxuICAkbW9kdWxlX2NvbnRhaW5lci5vbignbW91c2Vtb3ZlJywgJy5tb2R1bGVfd3JhcHBlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICBhcHBJbnN0YW5jZS5nZXRUcmFjZXJNYW5hZ2VyKCkuZmluZE93bmVyKHRoaXMpLm1vdXNlbW92ZShlKTtcbiAgfSk7XG5cbiAgJG1vZHVsZV9jb250YWluZXIub24oJ0RPTU1vdXNlU2Nyb2xsIG1vdXNld2hlZWwnLCAnLm1vZHVsZV93cmFwcGVyJywgZnVuY3Rpb24oZSkge1xuICAgIGFwcEluc3RhbmNlLmdldFRyYWNlck1hbmFnZXIoKS5maW5kT3duZXIodGhpcykubW91c2V3aGVlbChlKTtcbiAgfSk7XG59IiwibW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG4gICQoJyNwb3dlcmVkLWJ5JykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgJCgnI3Bvd2VyZWQtYnktbGlzdCBidXR0b24nKS50b2dnbGVDbGFzcygnY29sbGFwc2UnKTtcbiAgfSk7XG59OyIsImNvbnN0IFNlcnZlciA9IHJlcXVpcmUoJy4uLy4uL3NlcnZlcicpO1xuY29uc3Qgc2hvd0FsZ29yaXRobSA9IHJlcXVpcmUoJy4uL3Nob3dfYWxnb3JpdGhtJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuICAkKCcjc2NyYXRjaC1wYXBlcicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGNhdGVnb3J5ID0gbnVsbDtcbiAgICBjb25zdCBhbGdvcml0aG0gPSAnc2NyYXRjaF9wYXBlcic7XG4gICAgU2VydmVyLmxvYWRBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgc2hvd0FsZ29yaXRobShjYXRlZ29yeSwgYWxnb3JpdGhtLCBkYXRhKTtcbiAgICB9KTtcbiAgfSk7XG59OyIsImNvbnN0IGFwcEluc3RhbmNlID0gcmVxdWlyZSgnLi4vLi4vYXBwJyk7XG5cbmxldCBzaWRlbWVudV9wZXJjZW50O1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgJCgnI25hdmlnYXRpb24nKS5jbGljaygoKSA9PiB7XG4gICAgY29uc3QgJHNpZGVtZW51ID0gJCgnLnNpZGVtZW51Jyk7XG4gICAgY29uc3QgJHdvcmtzcGFjZSA9ICQoJy53b3Jrc3BhY2UnKTtcblxuICAgICRzaWRlbWVudS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgnLm5hdi1kcm9wZG93bicpLnRvZ2dsZUNsYXNzKCdmYS1jYXJldC1kb3duIGZhLWNhcmV0LXVwJyk7XG5cbiAgICBpZiAoJHNpZGVtZW51Lmhhc0NsYXNzKCdhY3RpdmUnKSkge1xuICAgICAgJHNpZGVtZW51LmNzcygncmlnaHQnLCAoMTAwIC0gc2lkZW1lbnVfcGVyY2VudCkgKyAnJScpO1xuICAgICAgJHdvcmtzcGFjZS5jc3MoJ2xlZnQnLCBzaWRlbWVudV9wZXJjZW50ICsgJyUnKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBzaWRlbWVudV9wZXJjZW50ID0gJHdvcmtzcGFjZS5wb3NpdGlvbigpLmxlZnQgLyAkKCdib2R5Jykud2lkdGgoKSAqIDEwMDtcbiAgICAgICRzaWRlbWVudS5jc3MoJ3JpZ2h0JywgMCk7XG4gICAgICAkd29ya3NwYWNlLmNzcygnbGVmdCcsIDApO1xuICAgIH1cblxuICAgIGFwcEluc3RhbmNlLmdldFRyYWNlck1hbmFnZXIoKS5yZXNpemUoKTtcbiAgfSk7XG59IiwiY29uc3QgYXBwSW5zdGFuY2UgPSByZXF1aXJlKCcuLi8uLi9hcHAnKTtcbmNvbnN0IFNlcnZlciA9IHJlcXVpcmUoJy4uLy4uL3NlcnZlcicpO1xuY29uc3QgVG9hc3QgPSByZXF1aXJlKCcuLi90b2FzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcblxuICAvLyBzaGFyZWRcbiAgJCgnI3NoYXJlZCcpLm1vdXNldXAoZnVuY3Rpb24oKSB7XG4gICAgJCh0aGlzKS5zZWxlY3QoKTtcbiAgfSk7XG5cbiAgJCgnI2J0bl9zaGFyZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuXG4gICAgY29uc3QgJGljb24gPSAkKHRoaXMpLmZpbmQoJy5mYS1zaGFyZScpO1xuICAgICRpY29uLmFkZENsYXNzKCdmYS1zcGluIGZhLXNwaW4tZmFzdGVyJyk7XG5cbiAgICBTZXJ2ZXIuc2hhcmVTY3JhdGNoUGFwZXIoKS50aGVuKCh1cmwpID0+IHtcbiAgICAgICRpY29uLnJlbW92ZUNsYXNzKCdmYS1zcGluIGZhLXNwaW4tZmFzdGVyJyk7XG4gICAgICAkKCcjc2hhcmVkJykucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlJyk7XG4gICAgICAkKCcjc2hhcmVkJykudmFsKHVybCk7XG4gICAgICBUb2FzdC5zaG93SW5mb1RvYXN0KCdTaGFyZWFibGUgbGluayBpcyBjcmVhdGVkLicpO1xuICAgIH0pO1xuICB9KTtcblxuICAvLyBjb250cm9sXG5cbiAgJCgnI2J0bl9ydW4nKS5jbGljaygoKSA9PiB7XG4gICAgJCgnI2J0bl90cmFjZScpLmNsaWNrKCk7XG4gICAgdmFyIGVyciA9IGFwcEluc3RhbmNlLmdldEVkaXRvcigpLmV4ZWN1dGUoKTtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICBUb2FzdC5zaG93RXJyb3JUb2FzdChlcnIpO1xuICAgIH1cbiAgfSk7XG4gICQoJyNidG5fcGF1c2UnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICBpZiAoYXBwSW5zdGFuY2UuZ2V0VHJhY2VyTWFuYWdlcigpLmlzUGF1c2UoKSkge1xuICAgICAgYXBwSW5zdGFuY2UuZ2V0VHJhY2VyTWFuYWdlcigpLnJlc3VtZVN0ZXAoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBwSW5zdGFuY2UuZ2V0VHJhY2VyTWFuYWdlcigpLnBhdXNlU3RlcCgpO1xuICAgIH1cbiAgfSk7XG4gICQoJyNidG5fcHJldicpLmNsaWNrKCgpID0+IHtcbiAgICBhcHBJbnN0YW5jZS5nZXRUcmFjZXJNYW5hZ2VyKCkucGF1c2VTdGVwKCk7XG4gICAgYXBwSW5zdGFuY2UuZ2V0VHJhY2VyTWFuYWdlcigpLnByZXZTdGVwKCk7XG4gIH0pO1xuICAkKCcjYnRuX25leHQnKS5jbGljaygoKSA9PiB7XG4gICAgYXBwSW5zdGFuY2UuZ2V0VHJhY2VyTWFuYWdlcigpLnBhdXNlU3RlcCgpO1xuICAgIGFwcEluc3RhbmNlLmdldFRyYWNlck1hbmFnZXIoKS5uZXh0U3RlcCgpO1xuICB9KTtcblxuICAvLyBkZXNjcmlwdGlvbiAmIHRyYWNlXG5cbiAgJCgnI2J0bl9kZXNjJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgJCgnLnRhYl9jb250YWluZXIgPiAudGFiJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQoJyN0YWJfZGVzYycpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCcudGFiX2JhciA+IGJ1dHRvbicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgfSk7XG5cbiAgJCgnI2J0bl90cmFjZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICQoJy50YWJfY29udGFpbmVyID4gLnRhYicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCcjdGFiX21vZHVsZScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCcudGFiX2JhciA+IGJ1dHRvbicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgfSk7XG5cbn07IiwiY29uc3QgYXBwSW5zdGFuY2UgPSByZXF1aXJlKCcuLi8uLi9hcHAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcbiAgICBhcHBJbnN0YW5jZS5nZXRUcmFjZXJNYW5hZ2VyKCkucmVzaXplKCk7XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGFwcEluc3RhbmNlID0gcmVxdWlyZSgnLi4vYXBwJyk7XG5jb25zdCB7XG4gIGlzU2NyYXRjaFBhcGVyXG59ID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuY29uc3Qgc2hvd0Rlc2NyaXB0aW9uID0gcmVxdWlyZSgnLi9zaG93X2Rlc2NyaXB0aW9uJyk7XG5jb25zdCBzaG93RmlsZXMgPSByZXF1aXJlKCcuL3Nob3dfZmlsZXMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IChjYXRlZ29yeSwgYWxnb3JpdGhtLCBkYXRhKSA9PiB7XG4gIGxldCAkbWVudTtcbiAgbGV0IGNhdGVnb3J5X25hbWU7XG4gIGxldCBhbGdvcml0aG1fbmFtZTtcblxuICBpZiAoaXNTY3JhdGNoUGFwZXIoY2F0ZWdvcnksIGFsZ29yaXRobSkpIHtcbiAgICAkbWVudSA9ICQoJyNzY3JhdGNoLXBhcGVyJyk7XG4gICAgY2F0ZWdvcnlfbmFtZSA9ICcnO1xuICAgIGFsZ29yaXRobV9uYW1lID0gJ1NjcmF0Y2ggUGFwZXInO1xuICB9IGVsc2Uge1xuICAgICRtZW51ID0gJChgW2RhdGEtY2F0ZWdvcnk9XCIke2NhdGVnb3J5fVwiXVtkYXRhLWFsZ29yaXRobT1cIiR7YWxnb3JpdGhtfVwiXWApO1xuICAgIGNvbnN0IGNhdGVnb3J5T2JqID0gYXBwSW5zdGFuY2UuZ2V0Q2F0ZWdvcnkoY2F0ZWdvcnkpO1xuICAgIGNhdGVnb3J5X25hbWUgPSBjYXRlZ29yeU9iai5uYW1lO1xuICAgIGFsZ29yaXRobV9uYW1lID0gY2F0ZWdvcnlPYmoubGlzdFthbGdvcml0aG1dO1xuICB9XG5cbiAgJCgnLnNpZGVtZW51IGJ1dHRvbicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgJG1lbnUuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAkKCcjYnRuX2Rlc2MnKS5jbGljaygpO1xuXG4gICQoJyNjYXRlZ29yeScpLmh0bWwoY2F0ZWdvcnlfbmFtZSk7XG4gICQoJyNhbGdvcml0aG0nKS5odG1sKGFsZ29yaXRobV9uYW1lKTtcbiAgJCgnI3RhYl9kZXNjID4gLndyYXBwZXInKS5lbXB0eSgpO1xuICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKS5lbXB0eSgpO1xuICAkKCcjZXhwbGFuYXRpb24nKS5odG1sKCcnKTtcblxuICBhcHBJbnN0YW5jZS5zZXRMYXN0RmlsZVVzZWQobnVsbCk7XG4gIGFwcEluc3RhbmNlLmdldEVkaXRvcigpLmNsZWFyQ29udGVudCgpO1xuXG4gIGNvbnN0IHtcbiAgICBmaWxlc1xuICB9ID0gZGF0YTtcblxuICBkZWxldGUgZGF0YS5maWxlcztcblxuICBzaG93RGVzY3JpcHRpb24oZGF0YSk7XG4gIHNob3dGaWxlcyhjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlcyk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgYXBwSW5zdGFuY2UgPSByZXF1aXJlKCcuLi9hcHAnKTtcbmNvbnN0IFNlcnZlciA9IHJlcXVpcmUoJy4uL3NlcnZlcicpO1xuY29uc3Qgc2hvd0FsZ29yaXRobSA9IHJlcXVpcmUoJy4vc2hvd19hbGdvcml0aG0nKTtcblxuY29uc3Qge1xuICBlYWNoXG59ID0gJDtcblxuY29uc3QgYWRkQWxnb3JpdGhtVG9DYXRlZ29yeURPTSA9IChjYXRlZ29yeSwgc3ViTGlzdCwgYWxnb3JpdGhtKSA9PiB7XG4gIGNvbnN0ICRhbGdvcml0aG0gPSAkKCc8YnV0dG9uIGNsYXNzPVwiaW5kZW50IGNvbGxhcHNlXCI+JylcbiAgICAuYXBwZW5kKHN1Ykxpc3RbYWxnb3JpdGhtXSlcbiAgICAuYXR0cignZGF0YS1hbGdvcml0aG0nLCBhbGdvcml0aG0pXG4gICAgLmF0dHIoJ2RhdGEtY2F0ZWdvcnknLCBjYXRlZ29yeSlcbiAgICAuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICBTZXJ2ZXIubG9hZEFsZ29yaXRobShjYXRlZ29yeSwgYWxnb3JpdGhtKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIHNob3dBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSwgZGF0YSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAkKCcjbGlzdCcpLmFwcGVuZCgkYWxnb3JpdGhtKTtcbn07XG5cbmNvbnN0IGFkZENhdGVnb3J5VG9ET00gPSAoY2F0ZWdvcnkpID0+IHtcblxuICBjb25zdCB7XG4gICAgbmFtZTogY2F0ZWdvcnlOYW1lLFxuICAgIGxpc3Q6IGNhdGVnb3J5U3ViTGlzdFxuICB9ID0gYXBwSW5zdGFuY2UuZ2V0Q2F0ZWdvcnkoY2F0ZWdvcnkpO1xuXG4gIGNvbnN0ICRjYXRlZ29yeSA9ICQoJzxidXR0b24gY2xhc3M9XCJjYXRlZ29yeVwiPicpXG4gICAgLmFwcGVuZCgnPGkgY2xhc3M9XCJmYSBmYS1mdyBmYS1jYXJldC1yaWdodFwiPicpXG4gICAgLmFwcGVuZChjYXRlZ29yeU5hbWUpO1xuXG4gICRjYXRlZ29yeS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAkKGBbZGF0YS1jYXRlZ29yeT1cIiR7Y2F0ZWdvcnl9XCJdYCkudG9nZ2xlQ2xhc3MoJ2NvbGxhcHNlJyk7XG4gICAgJCh0aGlzKS5maW5kKCdpLmZhJykudG9nZ2xlQ2xhc3MoJ2ZhLWNhcmV0LXJpZ2h0IGZhLWNhcmV0LWRvd24nKTtcbiAgfSk7XG5cbiAgJCgnI2xpc3QnKS5hcHBlbmQoJGNhdGVnb3J5KTtcblxuICBlYWNoKGNhdGVnb3J5U3ViTGlzdCwgKGFsZ29yaXRobSkgPT4ge1xuICAgIGFkZEFsZ29yaXRobVRvQ2F0ZWdvcnlET00oY2F0ZWdvcnksIGNhdGVnb3J5U3ViTGlzdCwgYWxnb3JpdGhtKTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgZWFjaChhcHBJbnN0YW5jZS5nZXRDYXRlZ29yaWVzKCksIGFkZENhdGVnb3J5VG9ET00pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHtcbiAgaXNBcnJheVxufSA9IEFycmF5O1xuXG5jb25zdCB7XG4gIGVhY2hcbn0gPSAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChkYXRhKSA9PiB7XG4gIGNvbnN0ICRjb250YWluZXIgPSAkKCcjdGFiX2Rlc2MgPiAud3JhcHBlcicpO1xuICAkY29udGFpbmVyLmVtcHR5KCk7XG5cbiAgZWFjaChkYXRhLCAoa2V5LCB2YWx1ZSkgPT4ge1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgJGNvbnRhaW5lci5hcHBlbmQoJCgnPGgzPicpLmh0bWwoa2V5KSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICRjb250YWluZXIuYXBwZW5kKCQoJzxwPicpLmh0bWwodmFsdWUpKTtcblxuICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcblxuICAgICAgY29uc3QgJHVsID0gJCgnPHVsPicpO1xuICAgICAgJGNvbnRhaW5lci5hcHBlbmQoJHVsKTtcblxuICAgICAgdmFsdWUuZm9yRWFjaCgobGkpID0+IHtcbiAgICAgICAgJHVsLmFwcGVuZCgkKCc8bGk+JykuaHRtbChsaSkpO1xuICAgICAgfSk7XG5cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcblxuICAgICAgY29uc3QgJHVsID0gJCgnPHVsPicpO1xuICAgICAgJGNvbnRhaW5lci5hcHBlbmQoJHVsKTtcblxuICAgICAgZWFjaCh2YWx1ZSwgKHByb3ApID0+IHtcbiAgICAgICAgJHVsLmFwcGVuZCgkKCc8bGk+JykuYXBwZW5kKCQoJzxzdHJvbmc+JykuaHRtbChwcm9wKSkuYXBwZW5kKGAgJHt2YWx1ZVtwcm9wXX1gKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFNlcnZlciA9IHJlcXVpcmUoJy4uL3NlcnZlcicpO1xuXG5jb25zdCB7XG4gIGVhY2hcbn0gPSAkO1xuXG5jb25zdCBhZGRGaWxlVG9ET00gPSAoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSwgZXhwbGFuYXRpb24pID0+IHtcbiAgdmFyICRmaWxlID0gJCgnPGJ1dHRvbj4nKS5hcHBlbmQoZmlsZSkuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgU2VydmVyLmxvYWRGaWxlKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUsIGV4cGxhbmF0aW9uKTtcbiAgICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXIgPiBidXR0b24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gIH0pO1xuICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXInKS5hcHBlbmQoJGZpbGUpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSAoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZXMpID0+IHtcbiAgJCgnLmZpbGVzX2JhciA+IC53cmFwcGVyJykuZW1wdHkoKTtcblxuICBlYWNoKGZpbGVzLCAoZmlsZSwgZXhwbGFuYXRpb24pID0+IHtcbiAgICBhZGRGaWxlVG9ET00oY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSwgZXhwbGFuYXRpb24pO1xuICB9KTtcblxuICAkKCcuZmlsZXNfYmFyID4gLndyYXBwZXIgPiBidXR0b24nKS5maXJzdCgpLmNsaWNrKCk7XG4gICQoJy5maWxlc19iYXIgPiAud3JhcHBlcicpLnNjcm9sbCgpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8vIGNsaWNrIHRoZSBmaXJzdCBhbGdvcml0aG0gaW4gdGhlIGZpcnN0IGNhdGVnb3J5XG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgJCgnI2xpc3QgYnV0dG9uLmNhdGVnb3J5JykuZmlyc3QoKS5jbGljaygpO1xuICAkKCcjbGlzdCBidXR0b24uY2F0ZWdvcnkgKyAuaW5kZW50JykuZmlyc3QoKS5jbGljaygpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHNob3dUb2FzdCA9IChkYXRhLCB0eXBlKSA9PiB7XG4gIGNvbnN0ICR0b2FzdCA9ICQoYDxkaXYgY2xhc3M9XCJ0b2FzdCAke3R5cGV9XCI+YCkuYXBwZW5kKGRhdGEpO1xuXG4gICQoJy50b2FzdF9jb250YWluZXInKS5hcHBlbmQoJHRvYXN0KTtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgJHRvYXN0LmZhZGVPdXQoKCkgPT4ge1xuICAgICAgJHRvYXN0LnJlbW92ZSgpO1xuICAgIH0pO1xuICB9LCAzMDAwKTtcbn07XG5cbmNvbnN0IHNob3dFcnJvclRvYXN0ID0gKGVycikgPT4ge1xuICBzaG93VG9hc3QoZXJyLCAnZXJyb3InKTtcbn07XG5cbmNvbnN0IHNob3dJbmZvVG9hc3QgPSAoZXJyKSA9PiB7XG4gIHNob3dUb2FzdChlcnIsICdpbmZvJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2hvd0Vycm9yVG9hc3QsXG4gIHNob3dJbmZvVG9hc3Rcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlkKSB7XG4gIGNvbnN0IGVkaXRvciA9IGFjZS5lZGl0KGlkKTtcblxuICBlZGl0b3Iuc2V0T3B0aW9ucyh7XG4gICAgZW5hYmxlQmFzaWNBdXRvY29tcGxldGlvbjogdHJ1ZSxcbiAgICBlbmFibGVTbmlwcGV0czogdHJ1ZSxcbiAgICBlbmFibGVMaXZlQXV0b2NvbXBsZXRpb246IHRydWVcbiAgfSk7XG5cbiAgZWRpdG9yLnNldFRoZW1lKCdhY2UvdGhlbWUvdG9tb3Jyb3dfbmlnaHRfZWlnaHRpZXMnKTtcbiAgZWRpdG9yLnNlc3Npb24uc2V0TW9kZSgnYWNlL21vZGUvamF2YXNjcmlwdCcpO1xuICBlZGl0b3IuJGJsb2NrU2Nyb2xsaW5nID0gSW5maW5pdHk7XG5cbiAgcmV0dXJuIGVkaXRvcjtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBleGVjdXRlID0gKHRyYWNlck1hbmFnZXIsIGNvZGUpID0+IHtcbiAgLy8gYWxsIG1vZHVsZXMgYXZhaWxhYmxlIHRvIGV2YWwgYXJlIG9idGFpbmVkIGZyb20gd2luZG93XG4gIHRyeSB7XG4gICAgdHJhY2VyTWFuYWdlci5kZWFsbG9jYXRlQWxsKCk7XG4gICAgZXZhbChjb2RlKTtcbiAgICB0cmFjZXJNYW5hZ2VyLnZpc3VhbGl6ZSgpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gZXJyO1xuICB9IGZpbmFsbHkge1xuICAgIHRyYWNlck1hbmFnZXIucmVtb3ZlVW5hbGxvY2F0ZWQoKTtcbiAgfVxufTtcblxuY29uc3QgZXhlY3V0ZURhdGEgPSAodHJhY2VyTWFuYWdlciwgYWxnb0RhdGEpID0+IHtcbiAgcmV0dXJuIGV4ZWN1dGUodHJhY2VyTWFuYWdlciwgYWxnb0RhdGEpO1xufTtcblxuY29uc3QgZXhlY3V0ZURhdGFBbmRDb2RlID0gKHRyYWNlck1hbmFnZXIsIGFsZ29EYXRhLCBhbGdvQ29kZSkgPT4ge1xuICByZXR1cm4gZXhlY3V0ZSh0cmFjZXJNYW5hZ2VyLCBgJHthbGdvRGF0YX07JHthbGdvQ29kZX1gKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBleGVjdXRlRGF0YSxcbiAgZXhlY3V0ZURhdGFBbmRDb2RlXG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgYXBwSW5zdGFuY2UgPSByZXF1aXJlKCcuLi9hcHAnKTtcbmNvbnN0IGNyZWF0ZUVkaXRvciA9IHJlcXVpcmUoJy4vY3JlYXRlJyk7XG5jb25zdCBFeGVjdXRvciA9IHJlcXVpcmUoJy4vZXhlY3V0b3InKTtcblxuZnVuY3Rpb24gRWRpdG9yKHRyYWNlck1hbmFnZXIpIHtcbiAgaWYgKCF0cmFjZXJNYW5hZ2VyKSB7XG4gICAgdGhyb3cgJ0Nhbm5vdCBjcmVhdGUgRWRpdG9yLiBNaXNzaW5nIHRoZSB0cmFjZXJNYW5hZ2VyJztcbiAgfVxuXG4gIGFjZS5yZXF1aXJlKCdhY2UvZXh0L2xhbmd1YWdlX3Rvb2xzJyk7XG5cbiAgdGhpcy5kYXRhRWRpdG9yID0gY3JlYXRlRWRpdG9yKCdkYXRhJyk7XG4gIHRoaXMuY29kZUVkaXRvciA9IGNyZWF0ZUVkaXRvcignY29kZScpO1xuXG4gIC8vIFNldHRpbmcgZGF0YVxuXG4gIHRoaXMuc2V0RGF0YSA9IChkYXRhKSA9PiB7XG4gICAgdGhpcy5kYXRhRWRpdG9yLnNldFZhbHVlKGRhdGEsIC0xKTtcbiAgfTtcblxuICB0aGlzLnNldENvZGUgPSAoY29kZSkgPT4ge1xuICAgIHRoaXMuY29kZUVkaXRvci5zZXRWYWx1ZShjb2RlLCAtMSk7XG4gIH07XG5cbiAgdGhpcy5zZXRDb250ZW50ID0gKCh7XG4gICAgZGF0YSxcbiAgICBjb2RlXG4gIH0pID0+IHtcbiAgICB0aGlzLnNldERhdGEoZGF0YSk7XG4gICAgdGhpcy5zZXRDb2RlKGNvZGUpO1xuICB9KTtcblxuICAvLyBDbGVhcmluZyBkYXRhXG5cbiAgdGhpcy5jbGVhckRhdGEgPSAoKSA9PiB7XG4gICAgdGhpcy5kYXRhRWRpdG9yLnNldFZhbHVlKCcnKTtcbiAgfTtcblxuICB0aGlzLmNsZWFyQ29kZSA9ICgpID0+IHtcbiAgICB0aGlzLmNvZGVFZGl0b3Iuc2V0VmFsdWUoJycpO1xuICB9O1xuXG4gIHRoaXMuY2xlYXJDb250ZW50ID0gKCkgPT4ge1xuICAgIHRoaXMuY2xlYXJEYXRhKCk7XG4gICAgdGhpcy5jbGVhckNvZGUoKTtcbiAgfTtcblxuICB0aGlzLmV4ZWN1dGUgPSAoKSA9PiB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZGF0YUVkaXRvci5nZXRWYWx1ZSgpO1xuICAgIGNvbnN0IGNvZGUgPSB0aGlzLmNvZGVFZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICByZXR1cm4gRXhlY3V0b3IuZXhlY3V0ZURhdGFBbmRDb2RlKHRyYWNlck1hbmFnZXIsIGRhdGEsIGNvZGUpO1xuICB9O1xuXG4gIC8vIGxpc3RlbmVyc1xuXG4gIHRoaXMuZGF0YUVkaXRvci5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmRhdGFFZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICBjb25zdCBsYXN0RmlsZVVzZWQgPSBhcHBJbnN0YW5jZS5nZXRMYXN0RmlsZVVzZWQoKTtcbiAgICBpZiAobGFzdEZpbGVVc2VkKSB7XG4gICAgICBhcHBJbnN0YW5jZS51cGRhdGVDYWNoZWRGaWxlKGxhc3RGaWxlVXNlZCwge1xuICAgICAgICBkYXRhXG4gICAgICB9KTtcbiAgICB9XG4gICAgRXhlY3V0b3IuZXhlY3V0ZURhdGEodHJhY2VyTWFuYWdlciwgZGF0YSk7XG4gIH0pO1xuXG4gIHRoaXMuY29kZUVkaXRvci5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgIGNvbnN0IGNvZGUgPSB0aGlzLmNvZGVFZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICBjb25zdCBsYXN0RmlsZVVzZWQgPSBhcHBJbnN0YW5jZS5nZXRMYXN0RmlsZVVzZWQoKTtcbiAgICBpZiAobGFzdEZpbGVVc2VkKSB7XG4gICAgICBhcHBJbnN0YW5jZS51cGRhdGVDYWNoZWRGaWxlKGxhc3RGaWxlVXNlZCwge1xuICAgICAgICBjb2RlXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFZGl0b3I7IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBSU1ZQID0gcmVxdWlyZSgncnN2cCcpO1xuY29uc3QgYXBwSW5zdGFuY2UgPSByZXF1aXJlKCcuL2FwcCcpO1xuY29uc3QgQXBwQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL2FwcC9jb25zdHJ1Y3RvcicpO1xuY29uc3QgRE9NID0gcmVxdWlyZSgnLi9kb20nKTtcbmNvbnN0IFNlcnZlciA9IHJlcXVpcmUoJy4vc2VydmVyJyk7XG5jb25zdCBIZWxwZXJzID0gcmVxdWlyZSgnLi9zZXJ2ZXIvaGVscGVycycpO1xuXG5jb25zdCBtb2R1bGVzID0gcmVxdWlyZSgnLi9tb2R1bGUnKTtcblxuY29uc3Qge1xuICBleHRlbmRcbn0gPSAkO1xuXG4kLmFqYXhTZXR1cCh7XG4gIGNhY2hlOiBmYWxzZSxcbiAgZGF0YVR5cGU6ICd0ZXh0J1xufSk7XG5cbi8vIHNldCBnbG9iYWwgcHJvbWlzZSBlcnJvciBoYW5kbGVyXG5SU1ZQLm9uKCdlcnJvcicsIGZ1bmN0aW9uKHJlYXNvbikge1xuICBjb25zb2xlLmFzc2VydChmYWxzZSwgcmVhc29uKTtcbn0pO1xuXG4kKCgpID0+IHtcblxuICAvLyBpbml0aWFsaXplIHRoZSBhcHBsaWNhdGlvbiBhbmQgYXR0YWNoIGluIHRvIHRoZSBpbnN0YW5jZSBtb2R1bGVcbiAgY29uc3QgYXBwID0gbmV3IEFwcENvbnN0cnVjdG9yKCk7XG4gIGV4dGVuZCh0cnVlLCBhcHBJbnN0YW5jZSwgYXBwKTtcblxuICAvLyBsb2FkIG1vZHVsZXMgdG8gdGhlIGdsb2JhbCBzY29wZSBzbyB0aGV5IGNhbiBiZSBldmFsZWRcbiAgZXh0ZW5kKHRydWUsIHdpbmRvdywgbW9kdWxlcyk7XG5cbiAgU2VydmVyLmxvYWRDYXRlZ29yaWVzKCkudGhlbigoZGF0YSkgPT4ge1xuICAgIGFwcEluc3RhbmNlLnNldENhdGVnb3JpZXMoZGF0YSk7XG4gICAgRE9NLnNob3dDYXRlZ29yaWVzKCk7XG5cbiAgICAvLyBkZXRlcm1pbmUgaWYgdGhlIGFwcCBpcyBsb2FkaW5nIGEgcHJlLWV4aXN0aW5nIHNjcmF0Y2gtcGFkXG4gICAgLy8gb3IgdGhlIGhvbWUgcGFnZVxuICAgIGNvbnN0IGdpc3RJRCA9IEhlbHBlcnMuZ2V0UGFyYW1ldGVyQnlOYW1lKCdzY3JhdGNoLXBhcGVyJyk7XG4gICAgaWYgKGdpc3RJRCkge1xuICAgICAgU2VydmVyLmxvYWRTY3JhdGNoUGFwZXIoZ2lzdElEKS50aGVuKCh7XG4gICAgICAgIGNhdGVnb3J5LFxuICAgICAgICBhbGdvcml0aG0sXG4gICAgICAgIGRhdGFcbiAgICAgIH0pID0+IHtcbiAgICAgICAgRE9NLnNob3dBbGdvcml0aG0oY2F0ZWdvcnksIGFsZ29yaXRobSwgZGF0YSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgRE9NLnNob3dGaXJzdEFsZ29yaXRobSgpO1xuICAgIH1cblxuICB9KTtcbn0pOyIsImNvbnN0IHtcbiAgICBBcnJheTJELFxuICAgIEFycmF5MkRUcmFjZXJcbn0gPSByZXF1aXJlKCcuL2FycmF5MmQnKTtcblxuZnVuY3Rpb24gQXJyYXkxRFRyYWNlcigpIHtcbiAgICByZXR1cm4gQXJyYXkyRFRyYWNlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5BcnJheTFEVHJhY2VyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHRydWUsIE9iamVjdC5jcmVhdGUoQXJyYXkyRFRyYWNlci5wcm90b3R5cGUpLCB7XG4gICAgY29uc3RydWN0b3I6IEFycmF5MURUcmFjZXIsXG4gICAgX25vdGlmeTogZnVuY3Rpb24oaWR4LCB2KSB7XG4gICAgICAgIEFycmF5MkRUcmFjZXIucHJvdG90eXBlLl9ub3RpZnkuY2FsbCh0aGlzLCAwLCBpZHgsIHYpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9kZW5vdGlmeTogZnVuY3Rpb24oaWR4KSB7XG4gICAgICAgIEFycmF5MkRUcmFjZXIucHJvdG90eXBlLl9kZW5vdGlmeS5jYWxsKHRoaXMsIDAsIGlkeCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX3NlbGVjdDogZnVuY3Rpb24ocywgZSkge1xuICAgICAgICBpZiAoZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBBcnJheTJEVHJhY2VyLnByb3RvdHlwZS5fc2VsZWN0LmNhbGwodGhpcywgMCwgcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBBcnJheTJEVHJhY2VyLnByb3RvdHlwZS5fc2VsZWN0Um93LmNhbGwodGhpcywgMCwgcywgZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfZGVzZWxlY3Q6IGZ1bmN0aW9uKHMsIGUpIHtcbiAgICAgICAgaWYgKGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgQXJyYXkyRFRyYWNlci5wcm90b3R5cGUuX2Rlc2VsZWN0LmNhbGwodGhpcywgMCwgcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBBcnJheTJEVHJhY2VyLnByb3RvdHlwZS5fZGVzZWxlY3RSb3cuY2FsbCh0aGlzLCAwLCBzLCBlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldERhdGE6IGZ1bmN0aW9uKEQpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5MkRUcmFjZXIucHJvdG90eXBlLnNldERhdGEuY2FsbCh0aGlzLCBbRF0pO1xuICAgIH1cbn0pO1xuXG52YXIgQXJyYXkxRCA9IHtcbiAgICByYW5kb206IGZ1bmN0aW9uKE4sIG1pbiwgbWF4KSB7XG4gICAgICAgIHJldHVybiBBcnJheTJELnJhbmRvbSgxLCBOLCBtaW4sIG1heClbMF07XG4gICAgfSxcbiAgICByYW5kb21Tb3J0ZWQ6IGZ1bmN0aW9uKE4sIG1pbiwgbWF4KSB7XG4gICAgICAgIHJldHVybiBBcnJheTJELnJhbmRvbVNvcnRlZCgxLCBOLCBtaW4sIG1heClbMF07XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgQXJyYXkxRCxcbiAgICBBcnJheTFEVHJhY2VyXG59OyIsImNvbnN0IFRyYWNlciA9IHJlcXVpcmUoJy4vdHJhY2VyJyk7XG5jb25zdCB7XG4gICAgcmVmaW5lQnlUeXBlXG59ID0gcmVxdWlyZSgnLi4vdHJhY2VyX21hbmFnZXIvdXRpbCcpO1xuXG5mdW5jdGlvbiBBcnJheTJEVHJhY2VyKCkge1xuICAgIGlmIChUcmFjZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICBBcnJheTJEVHJhY2VyLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbkFycmF5MkRUcmFjZXIucHJvdG90eXBlID0gJC5leHRlbmQodHJ1ZSwgT2JqZWN0LmNyZWF0ZShUcmFjZXIucHJvdG90eXBlKSwge1xuICAgIGNvbnN0cnVjdG9yOiBBcnJheTJEVHJhY2VyLFxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiR0YWJsZSA9IHRoaXMuY2Fwc3VsZS4kdGFibGUgPSAkKCc8ZGl2IGNsYXNzPVwibXRibC10YWJsZVwiPicpO1xuICAgICAgICB0aGlzLiRjb250YWluZXIuYXBwZW5kKHRoaXMuJHRhYmxlKTtcbiAgICB9LFxuICAgIF9ub3RpZnk6IGZ1bmN0aW9uKHgsIHksIHYpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgICAgICAgdHlwZTogJ25vdGlmeScsXG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeSxcbiAgICAgICAgICAgIHY6IHZcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX2Rlbm90aWZ5OiBmdW5jdGlvbih4LCB5KSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICdkZW5vdGlmeScsXG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfc2VsZWN0OiBmdW5jdGlvbihzeCwgc3ksIGV4LCBleSkge1xuICAgICAgICB0aGlzLnB1c2hTZWxlY3RpbmdTdGVwKCdzZWxlY3QnLCBudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9zZWxlY3RSb3c6IGZ1bmN0aW9uKHgsIHN5LCBleSkge1xuICAgICAgICB0aGlzLnB1c2hTZWxlY3RpbmdTdGVwKCdzZWxlY3QnLCAncm93JywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfc2VsZWN0Q29sOiBmdW5jdGlvbih5LCBzeCwgZXgpIHtcbiAgICAgICAgdGhpcy5wdXNoU2VsZWN0aW5nU3RlcCgnc2VsZWN0JywgJ2NvbCcsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX2Rlc2VsZWN0OiBmdW5jdGlvbihzeCwgc3ksIGV4LCBleSkge1xuICAgICAgICB0aGlzLnB1c2hTZWxlY3RpbmdTdGVwKCdkZXNlbGVjdCcsIG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX2Rlc2VsZWN0Um93OiBmdW5jdGlvbih4LCBzeSwgZXkpIHtcbiAgICAgICAgdGhpcy5wdXNoU2VsZWN0aW5nU3RlcCgnZGVzZWxlY3QnLCAncm93JywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfZGVzZWxlY3RDb2w6IGZ1bmN0aW9uKHksIHN4LCBleCkge1xuICAgICAgICB0aGlzLnB1c2hTZWxlY3RpbmdTdGVwKCdkZXNlbGVjdCcsICdjb2wnLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9zZXBhcmF0ZTogZnVuY3Rpb24oeCwgeSkge1xuICAgICAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICAgICAgICB0eXBlOiAnc2VwYXJhdGUnLFxuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHlcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX3NlcGFyYXRlUm93OiBmdW5jdGlvbih4KSB7XG4gICAgICAgIHRoaXMuX3NlcGFyYXRlKHgsIC0xKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfc2VwYXJhdGVDb2w6IGZ1bmN0aW9uKHkpIHtcbiAgICAgICAgdGhpcy5fc2VwYXJhdGUoLTEsIHkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9kZXNlcGFyYXRlOiBmdW5jdGlvbih4LCB5KSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICdkZXNlcGFyYXRlJyxcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9kZXNlcGFyYXRlUm93OiBmdW5jdGlvbih4KSB7XG4gICAgICAgIHRoaXMuX2Rlc2VwYXJhdGUoeCwgLTEpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9kZXNlcGFyYXRlQ29sOiBmdW5jdGlvbih5KSB7XG4gICAgICAgIHRoaXMuX2Rlc2VwYXJhdGUoLTEsIHkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHB1c2hTZWxlY3RpbmdTdGVwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICB2YXIgdHlwZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgICAgdmFyIG1vZGUgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzLnNoaWZ0KCkpO1xuICAgICAgICB2YXIgY29vcmQ7XG4gICAgICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgICAgICAgY2FzZSAncm93JzpcbiAgICAgICAgICAgICAgICBjb29yZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgeDogYXJnc1swXSxcbiAgICAgICAgICAgICAgICAgICAgc3k6IGFyZ3NbMV0sXG4gICAgICAgICAgICAgICAgICAgIGV5OiBhcmdzWzJdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2NvbCc6XG4gICAgICAgICAgICAgICAgY29vcmQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHk6IGFyZ3NbMF0sXG4gICAgICAgICAgICAgICAgICAgIHN4OiBhcmdzWzFdLFxuICAgICAgICAgICAgICAgICAgICBleDogYXJnc1syXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGlmIChhcmdzWzJdID09PSB1bmRlZmluZWQgJiYgYXJnc1szXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvb3JkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDogYXJnc1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IGFyZ3NbMV1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb29yZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN4OiBhcmdzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3k6IGFyZ3NbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBleDogYXJnc1syXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV5OiBhcmdzWzNdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBzdGVwID0ge1xuICAgICAgICAgICAgdHlwZTogdHlwZVxuICAgICAgICB9O1xuICAgICAgICAkLmV4dGVuZChzdGVwLCBjb29yZCk7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHN0ZXApO1xuICAgIH0sXG4gICAgcHJvY2Vzc1N0ZXA6IGZ1bmN0aW9uKHN0ZXAsIG9wdGlvbnMpIHtcbiAgICAgICAgc3dpdGNoIChzdGVwLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ25vdGlmeSc6XG4gICAgICAgICAgICAgICAgaWYgKHN0ZXAudiA9PT0gMCB8fCBzdGVwLnYpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRyb3cgPSB0aGlzLiR0YWJsZS5maW5kKCcubXRibC1yb3cnKS5lcShzdGVwLngpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgJGNvbCA9ICRyb3cuZmluZCgnLm10YmwtY29sJykuZXEoc3RlcC55KTtcbiAgICAgICAgICAgICAgICAgICAgJGNvbC50ZXh0KHJlZmluZUJ5VHlwZShzdGVwLnYpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICdkZW5vdGlmeSc6XG4gICAgICAgICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICAgICAgY2FzZSAnZGVzZWxlY3QnOlxuICAgICAgICAgICAgICAgIHZhciBjb2xvckNsYXNzID0gc3RlcC50eXBlID09ICdzZWxlY3QnIHx8IHN0ZXAudHlwZSA9PSAnZGVzZWxlY3QnID8gdGhpcy5jb2xvckNsYXNzLnNlbGVjdGVkIDogdGhpcy5jb2xvckNsYXNzLm5vdGlmaWVkO1xuICAgICAgICAgICAgICAgIHZhciBhZGRDbGFzcyA9IHN0ZXAudHlwZSA9PSAnc2VsZWN0JyB8fCBzdGVwLnR5cGUgPT0gJ25vdGlmeSc7XG4gICAgICAgICAgICAgICAgdmFyIHN4ID0gc3RlcC5zeDtcbiAgICAgICAgICAgICAgICB2YXIgc3kgPSBzdGVwLnN5O1xuICAgICAgICAgICAgICAgIHZhciBleCA9IHN0ZXAuZXg7XG4gICAgICAgICAgICAgICAgdmFyIGV5ID0gc3RlcC5leTtcbiAgICAgICAgICAgICAgICBpZiAoc3ggPT09IHVuZGVmaW5lZCkgc3ggPSBzdGVwLng7XG4gICAgICAgICAgICAgICAgaWYgKHN5ID09PSB1bmRlZmluZWQpIHN5ID0gc3RlcC55O1xuICAgICAgICAgICAgICAgIGlmIChleCA9PT0gdW5kZWZpbmVkKSBleCA9IHN0ZXAueDtcbiAgICAgICAgICAgICAgICBpZiAoZXkgPT09IHVuZGVmaW5lZCkgZXkgPSBzdGVwLnk7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWludENvbG9yKHN4LCBzeSwgZXgsIGV5LCBjb2xvckNsYXNzLCBhZGRDbGFzcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzZXBhcmF0ZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5kZXNlcGFyYXRlKHN0ZXAueCwgc3RlcC55KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcGFyYXRlKHN0ZXAueCwgc3RlcC55KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Rlc2VwYXJhdGUnOlxuICAgICAgICAgICAgICAgIHRoaXMuZGVzZXBhcmF0ZShzdGVwLngsIHN0ZXAueSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIFRyYWNlci5wcm90b3R5cGUucHJvY2Vzc1N0ZXAuY2FsbCh0aGlzLCBzdGVwLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0RGF0YTogZnVuY3Rpb24oRCkge1xuICAgICAgICB0aGlzLnZpZXdYID0gdGhpcy52aWV3WSA9IDA7XG4gICAgICAgIHRoaXMucGFkZGluZ0ggPSA2O1xuICAgICAgICB0aGlzLnBhZGRpbmdWID0gMztcbiAgICAgICAgdGhpcy5mb250U2l6ZSA9IDE2O1xuXG4gICAgICAgIGlmIChUcmFjZXIucHJvdG90eXBlLnNldERhdGEuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgdGhpcy4kdGFibGUuZmluZCgnLm10Ymwtcm93JykuZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcubXRibC1jb2wnKS5lYWNoKGZ1bmN0aW9uKGopIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50ZXh0KHJlZmluZUJ5VHlwZShEW2ldW2pdKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kdGFibGUuZW1wdHkoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBELmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgJHJvdyA9ICQoJzxkaXYgY2xhc3M9XCJtdGJsLXJvd1wiPicpO1xuICAgICAgICAgICAgdGhpcy4kdGFibGUuYXBwZW5kKCRyb3cpO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBEW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyICRjb2wgPSAkKCc8ZGl2IGNsYXNzPVwibXRibC1jb2xcIj4nKVxuICAgICAgICAgICAgICAgICAgICAuY3NzKHRoaXMuZ2V0Q2VsbENzcygpKVxuICAgICAgICAgICAgICAgICAgICAudGV4dChyZWZpbmVCeVR5cGUoRFtpXVtqXSkpO1xuICAgICAgICAgICAgICAgICRyb3cuYXBwZW5kKCRjb2wpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgcmVzaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5yZXNpemUuY2FsbCh0aGlzKTtcblxuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB9LFxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5jbGVhci5jYWxsKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuY2xlYXJDb2xvcigpO1xuICAgICAgICB0aGlzLmRlc2VwYXJhdGVBbGwoKTtcbiAgICB9LFxuICAgIGdldENlbGxDc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGFkZGluZzogdGhpcy5wYWRkaW5nVi50b0ZpeGVkKDEpICsgJ3B4ICcgKyB0aGlzLnBhZGRpbmdILnRvRml4ZWQoMSkgKyAncHgnLFxuICAgICAgICAgICAgJ2ZvbnQtc2l6ZSc6IHRoaXMuZm9udFNpemUudG9GaXhlZCgxKSArICdweCdcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHJlZnJlc2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICBUcmFjZXIucHJvdG90eXBlLnJlZnJlc2guY2FsbCh0aGlzKTtcblxuICAgICAgICB2YXIgJHBhcmVudCA9IHRoaXMuJHRhYmxlLnBhcmVudCgpO1xuICAgICAgICB2YXIgdG9wID0gJHBhcmVudC5oZWlnaHQoKSAvIDIgLSB0aGlzLiR0YWJsZS5oZWlnaHQoKSAvIDIgKyB0aGlzLnZpZXdZO1xuICAgICAgICB2YXIgbGVmdCA9ICRwYXJlbnQud2lkdGgoKSAvIDIgLSB0aGlzLiR0YWJsZS53aWR0aCgpIC8gMiArIHRoaXMudmlld1g7XG4gICAgICAgIHRoaXMuJHRhYmxlLmNzcygnbWFyZ2luLXRvcCcsIHRvcCk7XG4gICAgICAgIHRoaXMuJHRhYmxlLmNzcygnbWFyZ2luLWxlZnQnLCBsZWZ0KTtcbiAgICB9LFxuICAgIG1vdXNlZG93bjogZnVuY3Rpb24oZSkge1xuICAgICAgICBUcmFjZXIucHJvdG90eXBlLm1vdXNlZG93bi5jYWxsKHRoaXMsIGUpO1xuXG4gICAgICAgIHRoaXMuZHJhZ1ggPSBlLnBhZ2VYO1xuICAgICAgICB0aGlzLmRyYWdZID0gZS5wYWdlWTtcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XG4gICAgfSxcbiAgICBtb3VzZW1vdmU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5tb3VzZW1vdmUuY2FsbCh0aGlzLCBlKTtcblxuICAgICAgICBpZiAodGhpcy5kcmFnZ2luZykge1xuICAgICAgICAgICAgdGhpcy52aWV3WCArPSBlLnBhZ2VYIC0gdGhpcy5kcmFnWDtcbiAgICAgICAgICAgIHRoaXMudmlld1kgKz0gZS5wYWdlWSAtIHRoaXMuZHJhZ1k7XG4gICAgICAgICAgICB0aGlzLmRyYWdYID0gZS5wYWdlWDtcbiAgICAgICAgICAgIHRoaXMuZHJhZ1kgPSBlLnBhZ2VZO1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1vdXNldXA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgVHJhY2VyLnByb3RvdHlwZS5tb3VzZXVwLmNhbGwodGhpcywgZSk7XG5cbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuICAgIH0sXG4gICAgbW91c2V3aGVlbDogZnVuY3Rpb24oZSkge1xuICAgICAgICBUcmFjZXIucHJvdG90eXBlLm1vdXNld2hlZWwuY2FsbCh0aGlzLCBlKTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUgPSBlLm9yaWdpbmFsRXZlbnQ7XG4gICAgICAgIHZhciBkZWx0YSA9IChlLndoZWVsRGVsdGEgIT09IHVuZGVmaW5lZCAmJiBlLndoZWVsRGVsdGEpIHx8XG4gICAgICAgICAgICAoZS5kZXRhaWwgIT09IHVuZGVmaW5lZCAmJiAtZS5kZXRhaWwpO1xuICAgICAgICB2YXIgd2VpZ2h0ID0gMS4wMTtcbiAgICAgICAgdmFyIHJhdGlvID0gZGVsdGEgPiAwID8gMSAvIHdlaWdodCA6IHdlaWdodDtcbiAgICAgICAgaWYgKHRoaXMuZm9udFNpemUgPCA0ICYmIHJhdGlvIDwgMSkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5mb250U2l6ZSA+IDQwICYmIHJhdGlvID4gMSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnBhZGRpbmdWICo9IHJhdGlvO1xuICAgICAgICB0aGlzLnBhZGRpbmdIICo9IHJhdGlvO1xuICAgICAgICB0aGlzLmZvbnRTaXplICo9IHJhdGlvO1xuICAgICAgICB0aGlzLiR0YWJsZS5maW5kKCcubXRibC1jb2wnKS5jc3ModGhpcy5nZXRDZWxsQ3NzKCkpO1xuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB9LFxuICAgIHBhaW50Q29sb3I6IGZ1bmN0aW9uKHN4LCBzeSwgZXgsIGV5LCBjb2xvckNsYXNzLCBhZGRDbGFzcykge1xuICAgICAgICBmb3IgKHZhciBpID0gc3g7IGkgPD0gZXg7IGkrKykge1xuICAgICAgICAgICAgdmFyICRyb3cgPSB0aGlzLiR0YWJsZS5maW5kKCcubXRibC1yb3cnKS5lcShpKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSBzeTsgaiA8PSBleTsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyICRjb2wgPSAkcm93LmZpbmQoJy5tdGJsLWNvbCcpLmVxKGopO1xuICAgICAgICAgICAgICAgIGlmIChhZGRDbGFzcykgJGNvbC5hZGRDbGFzcyhjb2xvckNsYXNzKTtcbiAgICAgICAgICAgICAgICBlbHNlICRjb2wucmVtb3ZlQ2xhc3MoY29sb3JDbGFzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNsZWFyQ29sb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiR0YWJsZS5maW5kKCcubXRibC1jb2wnKS5yZW1vdmVDbGFzcyhPYmplY3Qua2V5cyh0aGlzLmNvbG9yQ2xhc3MpLmpvaW4oJyAnKSk7XG4gICAgfSxcbiAgICBjb2xvckNsYXNzOiB7XG4gICAgICAgIHNlbGVjdGVkOiAnc2VsZWN0ZWQnLFxuICAgICAgICBub3RpZmllZDogJ25vdGlmaWVkJ1xuICAgIH0sXG4gICAgc2VwYXJhdGU6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgdGhpcy4kdGFibGUuZmluZCgnLm10Ymwtcm93JykuZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICB2YXIgJHJvdyA9ICQodGhpcyk7XG4gICAgICAgICAgICBpZiAoaSA9PSB4KSB7XG4gICAgICAgICAgICAgICAgJHJvdy5hZnRlcigkKCc8ZGl2IGNsYXNzPVwibXRibC1lbXB0eS1yb3dcIj4nKS5hdHRyKCdkYXRhLXJvdycsIGkpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHJvdy5maW5kKCcubXRibC1jb2wnKS5lYWNoKGZ1bmN0aW9uKGopIHtcbiAgICAgICAgICAgICAgICB2YXIgJGNvbCA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgaWYgKGogPT0geSkge1xuICAgICAgICAgICAgICAgICAgICAkY29sLmFmdGVyKCQoJzxkaXYgY2xhc3M9XCJtdGJsLWVtcHR5LWNvbFwiPicpLmF0dHIoJ2RhdGEtY29sJywgaikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGRlc2VwYXJhdGU6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgdGhpcy4kdGFibGUuZmluZCgnW2RhdGEtcm93PScgKyB4ICsgJ10nKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy4kdGFibGUuZmluZCgnW2RhdGEtY29sPScgKyB5ICsgJ10nKS5yZW1vdmUoKTtcbiAgICB9LFxuICAgIGRlc2VwYXJhdGVBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiR0YWJsZS5maW5kKCcubXRibC1lbXB0eS1yb3csIC5tdGJsLWVtcHR5LWNvbCcpLnJlbW92ZSgpO1xuICAgIH1cbn0pO1xuXG52YXIgQXJyYXkyRCA9IHtcbiAgICByYW5kb206IGZ1bmN0aW9uKE4sIE0sIG1pbiwgbWF4KSB7XG4gICAgICAgIGlmICghTikgTiA9IDEwO1xuICAgICAgICBpZiAoIU0pIE0gPSAxMDtcbiAgICAgICAgaWYgKG1pbiA9PT0gdW5kZWZpbmVkKSBtaW4gPSAxO1xuICAgICAgICBpZiAobWF4ID09PSB1bmRlZmluZWQpIG1heCA9IDk7XG4gICAgICAgIHZhciBEID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XG4gICAgICAgICAgICBELnB1c2goW10pO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBNOyBqKyspIHtcbiAgICAgICAgICAgICAgICBEW2ldLnB1c2goKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgfCAwKSArIG1pbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEQ7XG4gICAgfSxcbiAgICByYW5kb21Tb3J0ZWQ6IGZ1bmN0aW9uKE4sIE0sIG1pbiwgbWF4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJhbmRvbShOLCBNLCBtaW4sIG1heCkubWFwKGZ1bmN0aW9uKGFycikge1xuICAgICAgICAgICAgcmV0dXJuIGFyci5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgQXJyYXkyRCxcbiAgICBBcnJheTJEVHJhY2VyXG59OyIsImNvbnN0IFRyYWNlciA9IHJlcXVpcmUoJy4vdHJhY2VyJyk7XG5cbmZ1bmN0aW9uIENoYXJ0VHJhY2VyKCkge1xuICAgIGlmIChUcmFjZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICBDaGFydFRyYWNlci5wcm90b3R5cGUuaW5pdC5jYWxsKHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbkNoYXJ0VHJhY2VyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHRydWUsIE9iamVjdC5jcmVhdGUoVHJhY2VyLnByb3RvdHlwZSksIHtcbiAgICBjb25zdHJ1Y3RvcjogQ2hhcnRUcmFjZXIsXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJHdyYXBwZXIgPSB0aGlzLmNhcHN1bGUuJHdyYXBwZXIgPSAkKCc8Y2FudmFzIGlkPVwiY2hhcnRcIj4nKTtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLmFwcGVuZCh0aGlzLiR3cmFwcGVyKTtcbiAgICB9LFxuICAgIHNldERhdGE6IGZ1bmN0aW9uKEMpIHtcbiAgICAgICAgaWYgKFRyYWNlci5wcm90b3R5cGUuc2V0RGF0YS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgdmFyIHRyYWNlciA9IHRoaXM7XG4gICAgICAgIHZhciBjb2xvciA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEMubGVuZ3RoOyBpKyspIGNvbG9yLnB1c2goJ3JnYmEoMTM2LCAxMzYsIDEzNiwgMSknKTtcbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBsYWJlbHM6IEMubWFwKFN0cmluZyksXG4gICAgICAgICAgICAgICAgZGF0YXNldHM6IFt7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3IsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IENcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBzY2FsZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgeUF4ZXM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlZ2luQXRaZXJvOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNoYXJ0ID0gdGhpcy5jYXBzdWxlLmNoYXJ0ID0gbmV3IENoYXJ0KHRoaXMuJHdyYXBwZXIsIGRhdGEpO1xuICAgIH0sXG4gICAgX25vdGlmeTogZnVuY3Rpb24ocywgdikge1xuICAgICAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICAgICAgICB0eXBlOiAnbm90aWZ5JyxcbiAgICAgICAgICAgIHM6IHMsXG4gICAgICAgICAgICB2OiB2XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF9kZW5vdGlmeTogZnVuY3Rpb24ocykge1xuICAgICAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICAgICAgICB0eXBlOiAnZGVub3RpZnknLFxuICAgICAgICAgICAgczogc1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBfc2VsZWN0OiBmdW5jdGlvbihzLCBlKSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgICAgICAgczogcyxcbiAgICAgICAgICAgIGU6IGVcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX2Rlc2VsZWN0OiBmdW5jdGlvbihzLCBlKSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICdkZXNlbGVjdCcsXG4gICAgICAgICAgICBzOiBzLFxuICAgICAgICAgICAgZTogZVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBwcm9jZXNzU3RlcDogZnVuY3Rpb24oc3RlcCwgb3B0aW9ucykge1xuICAgICAgICBzd2l0Y2ggKHN0ZXAudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnbm90aWZ5JzpcbiAgICAgICAgICAgICAgICBpZiAoc3RlcC52KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcnQuY29uZmlnLmRhdGEuZGF0YXNldHNbMF0uZGF0YVtzdGVwLnNdID0gc3RlcC52O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0LmNvbmZpZy5kYXRhLmxhYmVsc1tzdGVwLnNdID0gc3RlcC52LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnZGVub3RpZnknOlxuICAgICAgICAgICAgY2FzZSAnZGVzZWxlY3QnOlxuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IHN0ZXAudHlwZSA9PSAnZGVub3RpZnknIHx8IHN0ZXAudHlwZSA9PSAnZGVzZWxlY3QnID8gJ3JnYmEoMTM2LCAxMzYsIDEzNiwgMSknIDogJ3JnYmEoMjU1LCAwLCAwLCAxKSc7XG4gICAgICAgICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICAgICAgICAgIGlmIChjb2xvciA9PT0gdW5kZWZpbmVkKSB2YXIgY29sb3IgPSAncmdiYSgwLCAwLCAyNTUsIDEpJztcbiAgICAgICAgICAgICAgICBpZiAoc3RlcC5lICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBzdGVwLnM7IGkgPD0gc3RlcC5lOyBpKyspXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0LmNvbmZpZy5kYXRhLmRhdGFzZXRzWzBdLmJhY2tncm91bmRDb2xvcltpXSA9IGNvbG9yO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFydC5jb25maWcuZGF0YS5kYXRhc2V0c1swXS5iYWNrZ3JvdW5kQ29sb3Jbc3RlcC5zXSA9IGNvbG9yO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhcnQudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIFRyYWNlci5wcm90b3R5cGUucHJvY2Vzc1N0ZXAuY2FsbCh0aGlzLCBzdGVwLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaGFydFRyYWNlcjsiLCJjb25zdCB7XG4gICAgRGlyZWN0ZWRHcmFwaCxcbiAgICBEaXJlY3RlZEdyYXBoVHJhY2VyXG59ID0gcmVxdWlyZSgnLi9kaXJlY3RlZF9ncmFwaCcpO1xuXG5mdW5jdGlvbiBDb29yZGluYXRlU3lzdGVtVHJhY2VyKCkge1xuICAgIGlmIChEaXJlY3RlZEdyYXBoVHJhY2VyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgQ29vcmRpbmF0ZVN5c3RlbVRyYWNlci5wcm90b3R5cGUuaW5pdC5jYWxsKHRoaXMpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5Db29yZGluYXRlU3lzdGVtVHJhY2VyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHRydWUsIE9iamVjdC5jcmVhdGUoRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUpLCB7XG4gICAgY29uc3RydWN0b3I6IENvb3JkaW5hdGVTeXN0ZW1UcmFjZXIsXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdHJhY2VyID0gdGhpcztcblxuICAgICAgICB0aGlzLnMuc2V0dGluZ3Moe1xuICAgICAgICAgICAgZGVmYXVsdEVkZ2VUeXBlOiAnZGVmJyxcbiAgICAgICAgICAgIGZ1bmNFZGdlc0RlZjogZnVuY3Rpb24gKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IHRyYWNlci5nZXRDb2xvcihlZGdlLCBzb3VyY2UsIHRhcmdldCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3RWRnZShlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBzZXREYXRhOiBmdW5jdGlvbiAoQykge1xuICAgICAgICBpZiAoVHJhY2VyLnByb3RvdHlwZS5zZXREYXRhLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHJldHVybiB0cnVlO1xuXG4gICAgICAgIHRoaXMuZ3JhcGguY2xlYXIoKTtcbiAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgIHZhciBlZGdlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5uKGkpLFxuICAgICAgICAgICAgICAgIHg6IENbaV1bMF0sXG4gICAgICAgICAgICAgICAgeTogQ1tpXVsxXSxcbiAgICAgICAgICAgICAgICBsYWJlbDogJycgKyBpICxcbiAgICAgICAgICAgICAgICBzaXplOiAxLFxuICAgICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLmRlZmF1bHRcbiAgICAgICAgICAgIH0pOyAgICBcbiAgICAgICAgdGhpcy5ncmFwaC5yZWFkKHtcbiAgICAgICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgICAgIGVkZ2VzOiBlZGdlc1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zLmNhbWVyYS5nb1RvKHtcbiAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICByYXRpbzogMVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgcHJvY2Vzc1N0ZXA6IGZ1bmN0aW9uKHN0ZXAsIG9wdGlvbnMpIHtcbiAgICAgICAgc3dpdGNoIChzdGVwLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2l0JzpcbiAgICAgICAgICAgIGNhc2UgJ2xlYXZlJzpcbiAgICAgICAgICAgICAgICB2YXIgdmlzaXQgPSBzdGVwLnR5cGUgPT0gJ3Zpc2l0JztcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0Tm9kZSA9IHRoaXMuZ3JhcGgubm9kZXModGhpcy5uKHN0ZXAudGFyZ2V0KSk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gdmlzaXQgPyB0aGlzLmNvbG9yLnZpc2l0ZWQgOiB0aGlzLmNvbG9yLmxlZnQ7XG4gICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZS5jb2xvciA9IGNvbG9yO1xuICAgICAgICAgICAgICAgIGlmIChzdGVwLnNvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlZGdlSWQgPSB0aGlzLmUoc3RlcC5zb3VyY2UsIHN0ZXAudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JhcGguZWRnZXMoZWRnZUlkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkZ2UgPSB0aGlzLmdyYXBoLmVkZ2VzKGVkZ2VJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlLmNvbG9yID0gY29sb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYXBoLmRyb3BFZGdlKGVkZ2VJZCkuYWRkRWRnZShlZGdlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGguYWRkRWRnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHRoaXMuZShzdGVwLnRhcmdldCwgc3RlcC5zb3VyY2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5uKHN0ZXAuc291cmNlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRoaXMubihzdGVwLnRhcmdldCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxvZ1RyYWNlcikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gc3RlcC5zb3VyY2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2UgPT09IHVuZGVmaW5lZCkgc291cmNlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nVHJhY2VyLnByaW50KHZpc2l0ID8gc291cmNlICsgJyAtPiAnICsgc3RlcC50YXJnZXQgOiBzb3VyY2UgKyAnIDwtICcgKyBzdGVwLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBUcmFjZXIucHJvdG90eXBlLnByb2Nlc3NTdGVwLmNhbGwodGhpcywgc3RlcCwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGU6IGZ1bmN0aW9uKHYxLCB2Mikge1xuICAgICAgICBpZiAodjEgPiB2Mikge1xuICAgICAgICAgICAgdmFyIHRlbXAgPSB2MTtcbiAgICAgICAgICAgIHYxID0gdjI7XG4gICAgICAgICAgICB2MiA9IHRlbXA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdlJyArIHYxICsgJ18nICsgdjI7XG4gICAgfSxcbiAgICBkcmF3T25Ib3ZlcjogZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MsIG5leHQpIHtcbiAgICAgICAgdmFyIHRyYWNlciA9IHRoaXM7XG5cbiAgICAgICAgY29udGV4dC5zZXRMaW5lRGFzaChbNSwgNV0pO1xuICAgICAgICB2YXIgbm9kZUlkeCA9IG5vZGUuaWQuc3Vic3RyaW5nKDEpO1xuICAgICAgICB0aGlzLmdyYXBoLmVkZ2VzKCkuZm9yRWFjaChmdW5jdGlvbihlZGdlKSB7XG4gICAgICAgICAgICB2YXIgZW5kcyA9IGVkZ2UuaWQuc3Vic3RyaW5nKDEpLnNwbGl0KFwiX1wiKTtcbiAgICAgICAgICAgIGlmIChlbmRzWzBdID09IG5vZGVJZHgpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSAnIzBmZic7XG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9IG5vZGU7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IHRyYWNlci5ncmFwaC5ub2RlcygnbicgKyBlbmRzWzFdKTtcbiAgICAgICAgICAgICAgICB0cmFjZXIuZHJhd0VkZ2UoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgaWYgKG5leHQpIG5leHQoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVuZHNbMV0gPT0gbm9kZUlkeCkge1xuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9ICcjMGZmJztcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gdHJhY2VyLmdyYXBoLm5vZGVzKCduJyArIGVuZHNbMF0pO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBub2RlO1xuICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3RWRnZShlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICBpZiAobmV4dCkgbmV4dChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBkcmF3RWRnZTogZnVuY3Rpb24oZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICB2YXIgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnLFxuICAgICAgICAgICAgc2l6ZSA9IGVkZ2VbcHJlZml4ICsgJ3NpemUnXSB8fCAxO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSBzaXplO1xuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0Lm1vdmVUbyhcbiAgICAgICAgICAgIHNvdXJjZVtwcmVmaXggKyAneCddLFxuICAgICAgICAgICAgc291cmNlW3ByZWZpeCArICd5J11cbiAgICAgICAgKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oXG4gICAgICAgICAgICB0YXJnZXRbcHJlZml4ICsgJ3gnXSxcbiAgICAgICAgICAgIHRhcmdldFtwcmVmaXggKyAneSddXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxufSk7XG5cbnZhciBDb29yZGluYXRlU3lzdGVtID0ge1xuICAgIHJhbmRvbTogZnVuY3Rpb24gKE4sIG1pbiwgbWF4KSB7XG4gICAgICAgIGlmICghTikgTiA9IDc7XG4gICAgICAgIGlmICghbWluKSBtaW4gPSAxO1xuICAgICAgICBpZiAoIW1heCkgbWF4ID0gMTA7XG4gICAgICAgIHZhciBDID0gbmV3IEFycmF5KE4pO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE47IGkrKykgQ1tpXSA9IG5ldyBBcnJheSgyKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IENbaV0ubGVuZ3RoOyBqKyspXG4gICAgICAgICAgICAgICAgQ1tpXVtqXSA9IChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpIHwgMCkgKyBtaW47XG4gICAgICAgIHJldHVybiBDO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDb29yZGluYXRlU3lzdGVtLFxuICBDb29yZGluYXRlU3lzdGVtVHJhY2VyXG59OyIsImNvbnN0IFRyYWNlciA9IHJlcXVpcmUoJy4vdHJhY2VyJyk7XG5cbmZ1bmN0aW9uIERpcmVjdGVkR3JhcGhUcmFjZXIoKSB7XG4gICAgaWYgKFRyYWNlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSB7XG4gICAgICAgIERpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlLmluaXQuY2FsbCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUgPSAkLmV4dGVuZCh0cnVlLCBPYmplY3QuY3JlYXRlKFRyYWNlci5wcm90b3R5cGUpLCB7XG4gICAgY29uc3RydWN0b3I6IERpcmVjdGVkR3JhcGhUcmFjZXIsXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0cmFjZXIgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMucyA9IHRoaXMuY2Fwc3VsZS5zID0gbmV3IHNpZ21hKHtcbiAgICAgICAgICAgIHJlbmRlcmVyOiB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyOiB0aGlzLiRjb250YWluZXJbMF0sXG4gICAgICAgICAgICAgICAgdHlwZTogJ2NhbnZhcydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgIG1pbkFycm93U2l6ZTogOCxcbiAgICAgICAgICAgICAgICBkZWZhdWx0RWRnZVR5cGU6ICdhcnJvdycsXG4gICAgICAgICAgICAgICAgbWF4RWRnZVNpemU6IDIuNSxcbiAgICAgICAgICAgICAgICBsYWJlbFRocmVzaG9sZDogNCxcbiAgICAgICAgICAgICAgICBmb250OiAnUm9ib3RvJyxcbiAgICAgICAgICAgICAgICBkZWZhdWx0TGFiZWxDb2xvcjogJyNmZmYnLFxuICAgICAgICAgICAgICAgIHpvb21NaW46IDAuNixcbiAgICAgICAgICAgICAgICB6b29tTWF4OiAxLjIsXG4gICAgICAgICAgICAgICAgc2tpcEVycm9yczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtaW5Ob2RlU2l6ZTogLjUsXG4gICAgICAgICAgICAgICAgbWF4Tm9kZVNpemU6IDEyLFxuICAgICAgICAgICAgICAgIGxhYmVsU2l6ZTogJ3Byb3BvcnRpb25hbCcsXG4gICAgICAgICAgICAgICAgbGFiZWxTaXplUmF0aW86IDEuMyxcbiAgICAgICAgICAgICAgICBmdW5jTGFiZWxzRGVmOiBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgICAgICB0cmFjZXIuZHJhd0xhYmVsKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmNIb3ZlcnNEZWY6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzLCBuZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3T25Ib3Zlcihub2RlLCBjb250ZXh0LCBzZXR0aW5ncywgbmV4dCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmdW5jRWRnZXNBcnJvdzogZnVuY3Rpb24oZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IHRyYWNlci5nZXRDb2xvcihlZGdlLCBzb3VyY2UsIHRhcmdldCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICB0cmFjZXIuZHJhd0Fycm93KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHNpZ21hLnBsdWdpbnMuZHJhZ05vZGVzKHRoaXMucywgdGhpcy5zLnJlbmRlcmVyc1swXSk7XG4gICAgICAgIHRoaXMuZ3JhcGggPSB0aGlzLmNhcHN1bGUuZ3JhcGggPSB0aGlzLnMuZ3JhcGg7XG4gICAgfSxcbiAgICBfc2V0VHJlZURhdGE6IGZ1bmN0aW9uKEcsIHJvb3QpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgICAgICAgdHlwZTogJ3NldFRyZWVEYXRhJyxcbiAgICAgICAgICAgIGFyZ3VtZW50czogYXJndW1lbnRzXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIF92aXNpdDogZnVuY3Rpb24odGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgICAgICAgdHlwZTogJ3Zpc2l0JyxcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgICAgc291cmNlOiBzb3VyY2VcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX2xlYXZlOiBmdW5jdGlvbih0YXJnZXQsIHNvdXJjZSkge1xuICAgICAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICAgICAgICB0eXBlOiAnbGVhdmUnLFxuICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgICBzb3VyY2U6IHNvdXJjZVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBwcm9jZXNzU3RlcDogZnVuY3Rpb24oc3RlcCwgb3B0aW9ucykge1xuICAgICAgICBzd2l0Y2ggKHN0ZXAudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnc2V0VHJlZURhdGEnOlxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VHJlZURhdGEuYXBwbHkodGhpcywgc3RlcC5hcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndmlzaXQnOlxuICAgICAgICAgICAgY2FzZSAnbGVhdmUnOlxuICAgICAgICAgICAgICAgIHZhciB2aXNpdCA9IHN0ZXAudHlwZSA9PSAndmlzaXQnO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXROb2RlID0gdGhpcy5ncmFwaC5ub2Rlcyh0aGlzLm4oc3RlcC50YXJnZXQpKTtcbiAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSB2aXNpdCA/IHRoaXMuY29sb3IudmlzaXRlZCA6IHRoaXMuY29sb3IubGVmdDtcbiAgICAgICAgICAgICAgICB0YXJnZXROb2RlLmNvbG9yID0gY29sb3I7XG4gICAgICAgICAgICAgICAgaWYgKHN0ZXAuc291cmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVkZ2VJZCA9IHRoaXMuZShzdGVwLnNvdXJjZSwgc3RlcC50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWRnZSA9IHRoaXMuZ3JhcGguZWRnZXMoZWRnZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgZWRnZS5jb2xvciA9IGNvbG9yO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYXBoLmRyb3BFZGdlKGVkZ2VJZCkuYWRkRWRnZShlZGdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubG9nVHJhY2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBzdGVwLnNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZSA9PT0gdW5kZWZpbmVkKSBzb3VyY2UgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dUcmFjZXIucHJpbnQodmlzaXQgPyBzb3VyY2UgKyAnIC0+ICcgKyBzdGVwLnRhcmdldCA6IHNvdXJjZSArICcgPC0gJyArIHN0ZXAudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIFRyYWNlci5wcm90b3R5cGUucHJvY2Vzc1N0ZXAuY2FsbCh0aGlzLCBzdGVwLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0VHJlZURhdGE6IGZ1bmN0aW9uKEcsIHJvb3QpIHtcbiAgICAgICAgdmFyIHRyYWNlciA9IHRoaXM7XG5cbiAgICAgICAgcm9vdCA9IHJvb3QgfHwgMDtcbiAgICAgICAgdmFyIG1heERlcHRoID0gLTE7XG5cbiAgICAgICAgdmFyIGNoayA9IG5ldyBBcnJheShHLmxlbmd0aCk7XG4gICAgICAgIHZhciBnZXREZXB0aCA9IGZ1bmN0aW9uKG5vZGUsIGRlcHRoKSB7XG4gICAgICAgICAgICBpZiAoY2hrW25vZGVdKSB0aHJvdyBcInRoZSBnaXZlbiBncmFwaCBpcyBub3QgYSB0cmVlIGJlY2F1c2UgaXQgZm9ybXMgYSBjaXJjdWl0XCI7XG4gICAgICAgICAgICBjaGtbbm9kZV0gPSB0cnVlO1xuICAgICAgICAgICAgaWYgKG1heERlcHRoIDwgZGVwdGgpIG1heERlcHRoID0gZGVwdGg7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEdbbm9kZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoR1tub2RlXVtpXSkgZ2V0RGVwdGgoaSwgZGVwdGggKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgZ2V0RGVwdGgocm9vdCwgMSk7XG5cbiAgICAgICAgaWYgKHRoaXMuc2V0RGF0YS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB2YXIgcGxhY2UgPSBmdW5jdGlvbihub2RlLCB4LCB5KSB7XG4gICAgICAgICAgICB2YXIgdGVtcCA9IHRyYWNlci5ncmFwaC5ub2Rlcyh0cmFjZXIubihub2RlKSk7XG4gICAgICAgICAgICB0ZW1wLnggPSB4O1xuICAgICAgICAgICAgdGVtcC55ID0geTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgd2dhcCA9IDEgLyAobWF4RGVwdGggLSAxKTtcbiAgICAgICAgdmFyIGRmcyA9IGZ1bmN0aW9uKG5vZGUsIGRlcHRoLCB0b3AsIGJvdHRvbSkge1xuICAgICAgICAgICAgcGxhY2Uobm9kZSwgdG9wICsgYm90dG9tLCBkZXB0aCAqIHdnYXApO1xuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgR1tub2RlXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChHW25vZGVdW2ldKSBjaGlsZHJlbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHZnYXAgPSAoYm90dG9tIC0gdG9wKSAvIGNoaWxkcmVuO1xuICAgICAgICAgICAgdmFyIGNudCA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEdbbm9kZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoR1tub2RlXVtpXSkgZGZzKGksIGRlcHRoICsgMSwgdG9wICsgdmdhcCAqIGNudCwgdG9wICsgdmdhcCAqICsrY250KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgZGZzKHJvb3QsIDAsIDAsIDEpO1xuXG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgIH0sXG4gICAgc2V0RGF0YTogZnVuY3Rpb24oRykge1xuICAgICAgICBpZiAoVHJhY2VyLnByb3RvdHlwZS5zZXREYXRhLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHJldHVybiB0cnVlO1xuXG4gICAgICAgIHRoaXMuZ3JhcGguY2xlYXIoKTtcbiAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgIHZhciBlZGdlcyA9IFtdO1xuICAgICAgICB2YXIgdW5pdEFuZ2xlID0gMiAqIE1hdGguUEkgLyBHLmxlbmd0aDtcbiAgICAgICAgdmFyIGN1cnJlbnRBbmdsZSA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgRy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY3VycmVudEFuZ2xlICs9IHVuaXRBbmdsZTtcbiAgICAgICAgICAgIG5vZGVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGlkOiB0aGlzLm4oaSksXG4gICAgICAgICAgICAgICAgbGFiZWw6ICcnICsgaSxcbiAgICAgICAgICAgICAgICB4OiAuNSArIE1hdGguc2luKGN1cnJlbnRBbmdsZSkgLyAyLFxuICAgICAgICAgICAgICAgIHk6IC41ICsgTWF0aC5jb3MoY3VycmVudEFuZ2xlKSAvIDIsXG4gICAgICAgICAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvci5kZWZhdWx0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgR1tpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChHW2ldW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgIGVkZ2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHRoaXMuZShpLCBqKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5uKGkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLm4oaiksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvci5kZWZhdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogMVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdyYXBoLnJlYWQoe1xuICAgICAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICAgICAgZWRnZXM6IGVkZ2VzXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnMuY2FtZXJhLmdvVG8oe1xuICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgICBhbmdsZTogMCxcbiAgICAgICAgICAgIHJhdGlvOiAxXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlZnJlc2goKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICByZXNpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBUcmFjZXIucHJvdG90eXBlLnJlc2l6ZS5jYWxsKHRoaXMpO1xuXG4gICAgICAgIHRoaXMucy5yZW5kZXJlcnNbMF0ucmVzaXplKCk7XG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgIH0sXG4gICAgcmVmcmVzaDogZnVuY3Rpb24oKSB7XG4gICAgICAgIFRyYWNlci5wcm90b3R5cGUucmVmcmVzaC5jYWxsKHRoaXMpO1xuXG4gICAgICAgIHRoaXMucy5yZWZyZXNoKCk7XG4gICAgfSxcbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIFRyYWNlci5wcm90b3R5cGUuY2xlYXIuY2FsbCh0aGlzKTtcblxuICAgICAgICB0aGlzLmNsZWFyR3JhcGhDb2xvcigpO1xuICAgIH0sXG4gICAgY29sb3I6IHtcbiAgICAgICAgdmlzaXRlZDogJyNmMDAnLFxuICAgICAgICBsZWZ0OiAnIzAwMCcsXG4gICAgICAgIGRlZmF1bHQ6ICcjODg4J1xuICAgIH0sXG4gICAgY2xlYXJHcmFwaENvbG9yOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHRyYWNlciA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5ncmFwaC5ub2RlcygpLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgbm9kZS5jb2xvciA9IHRyYWNlci5jb2xvci5kZWZhdWx0O1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5ncmFwaC5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24oZWRnZSkge1xuICAgICAgICAgICAgZWRnZS5jb2xvciA9IHRyYWNlci5jb2xvci5kZWZhdWx0O1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIG46IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgcmV0dXJuICduJyArIHY7XG4gICAgfSxcbiAgICBlOiBmdW5jdGlvbih2MSwgdjIpIHtcbiAgICAgICAgcmV0dXJuICdlJyArIHYxICsgJ18nICsgdjI7XG4gICAgfSxcbiAgICBnZXRDb2xvcjogZnVuY3Rpb24oZWRnZSwgc291cmNlLCB0YXJnZXQsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBjb2xvciA9IGVkZ2UuY29sb3IsXG4gICAgICAgICAgICBlZGdlQ29sb3IgPSBzZXR0aW5ncygnZWRnZUNvbG9yJyksXG4gICAgICAgICAgICBkZWZhdWx0Tm9kZUNvbG9yID0gc2V0dGluZ3MoJ2RlZmF1bHROb2RlQ29sb3InKSxcbiAgICAgICAgICAgIGRlZmF1bHRFZGdlQ29sb3IgPSBzZXR0aW5ncygnZGVmYXVsdEVkZ2VDb2xvcicpO1xuICAgICAgICBpZiAoIWNvbG9yKVxuICAgICAgICAgICAgc3dpdGNoIChlZGdlQ29sb3IpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdzb3VyY2UnOlxuICAgICAgICAgICAgICAgICAgICBjb2xvciA9IHNvdXJjZS5jb2xvciB8fCBkZWZhdWx0Tm9kZUNvbG9yO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd0YXJnZXQnOlxuICAgICAgICAgICAgICAgICAgICBjb2xvciA9IHRhcmdldC5jb2xvciB8fCBkZWZhdWx0Tm9kZUNvbG9yO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb2xvciA9IGRlZmF1bHRFZGdlQ29sb3I7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb2xvcjtcbiAgICB9LFxuICAgIGRyYXdMYWJlbDogZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICAgdmFyIGZvbnRTaXplLFxuICAgICAgICAgICAgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnLFxuICAgICAgICAgICAgc2l6ZSA9IG5vZGVbcHJlZml4ICsgJ3NpemUnXTtcblxuICAgICAgICBpZiAoc2l6ZSA8IHNldHRpbmdzKCdsYWJlbFRocmVzaG9sZCcpKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGlmICghbm9kZS5sYWJlbCB8fCB0eXBlb2Ygbm9kZS5sYWJlbCAhPT0gJ3N0cmluZycpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgZm9udFNpemUgPSAoc2V0dGluZ3MoJ2xhYmVsU2l6ZScpID09PSAnZml4ZWQnKSA/XG4gICAgICAgICAgICBzZXR0aW5ncygnZGVmYXVsdExhYmVsU2l6ZScpIDpcbiAgICAgICAgICAgIHNldHRpbmdzKCdsYWJlbFNpemVSYXRpbycpICogc2l6ZTtcblxuICAgICAgICBjb250ZXh0LmZvbnQgPSAoc2V0dGluZ3MoJ2ZvbnRTdHlsZScpID8gc2V0dGluZ3MoJ2ZvbnRTdHlsZScpICsgJyAnIDogJycpICtcbiAgICAgICAgICAgIGZvbnRTaXplICsgJ3B4ICcgKyBzZXR0aW5ncygnZm9udCcpO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IChzZXR0aW5ncygnbGFiZWxDb2xvcicpID09PSAnbm9kZScpID9cbiAgICAgICAgICAgIChub2RlLmNvbG9yIHx8IHNldHRpbmdzKCdkZWZhdWx0Tm9kZUNvbG9yJykpIDpcbiAgICAgICAgICAgIHNldHRpbmdzKCdkZWZhdWx0TGFiZWxDb2xvcicpO1xuXG4gICAgICAgIGNvbnRleHQudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQoXG4gICAgICAgICAgICBub2RlLmxhYmVsLFxuICAgICAgICAgICAgTWF0aC5yb3VuZChub2RlW3ByZWZpeCArICd4J10pLFxuICAgICAgICAgICAgTWF0aC5yb3VuZChub2RlW3ByZWZpeCArICd5J10gKyBmb250U2l6ZSAvIDMpXG4gICAgICAgICk7XG4gICAgfSxcbiAgICBkcmF3QXJyb3c6IGZ1bmN0aW9uKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJyxcbiAgICAgICAgICAgIHNpemUgPSBlZGdlW3ByZWZpeCArICdzaXplJ10gfHwgMSxcbiAgICAgICAgICAgIHRTaXplID0gdGFyZ2V0W3ByZWZpeCArICdzaXplJ10sXG4gICAgICAgICAgICBzWCA9IHNvdXJjZVtwcmVmaXggKyAneCddLFxuICAgICAgICAgICAgc1kgPSBzb3VyY2VbcHJlZml4ICsgJ3knXSxcbiAgICAgICAgICAgIHRYID0gdGFyZ2V0W3ByZWZpeCArICd4J10sXG4gICAgICAgICAgICB0WSA9IHRhcmdldFtwcmVmaXggKyAneSddLFxuICAgICAgICAgICAgYW5nbGUgPSBNYXRoLmF0YW4yKHRZIC0gc1ksIHRYIC0gc1gpLFxuICAgICAgICAgICAgZGlzdCA9IDM7XG4gICAgICAgIHNYICs9IE1hdGguc2luKGFuZ2xlKSAqIGRpc3Q7XG4gICAgICAgIHRYICs9IE1hdGguc2luKGFuZ2xlKSAqIGRpc3Q7XG4gICAgICAgIHNZICs9IC1NYXRoLmNvcyhhbmdsZSkgKiBkaXN0O1xuICAgICAgICB0WSArPSAtTWF0aC5jb3MoYW5nbGUpICogZGlzdDtcbiAgICAgICAgdmFyIGFTaXplID0gTWF0aC5tYXgoc2l6ZSAqIDIuNSwgc2V0dGluZ3MoJ21pbkFycm93U2l6ZScpKSxcbiAgICAgICAgICAgIGQgPSBNYXRoLnNxcnQoTWF0aC5wb3codFggLSBzWCwgMikgKyBNYXRoLnBvdyh0WSAtIHNZLCAyKSksXG4gICAgICAgICAgICBhWCA9IHNYICsgKHRYIC0gc1gpICogKGQgLSBhU2l6ZSAtIHRTaXplKSAvIGQsXG4gICAgICAgICAgICBhWSA9IHNZICsgKHRZIC0gc1kpICogKGQgLSBhU2l6ZSAtIHRTaXplKSAvIGQsXG4gICAgICAgICAgICB2WCA9ICh0WCAtIHNYKSAqIGFTaXplIC8gZCxcbiAgICAgICAgICAgIHZZID0gKHRZIC0gc1kpICogYVNpemUgLyBkO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSBzaXplO1xuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0Lm1vdmVUbyhzWCwgc1kpO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhcbiAgICAgICAgICAgIGFYLFxuICAgICAgICAgICAgYVlcbiAgICAgICAgKTtcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0Lm1vdmVUbyhhWCArIHZYLCBhWSArIHZZKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oYVggKyB2WSAqIDAuNiwgYVkgLSB2WCAqIDAuNik7XG4gICAgICAgIGNvbnRleHQubGluZVRvKGFYIC0gdlkgKiAwLjYsIGFZICsgdlggKiAwLjYpO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhhWCArIHZYLCBhWSArIHZZKTtcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgfSxcbiAgICBkcmF3T25Ib3ZlcjogZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MsIG5leHQpIHtcbiAgICAgICAgdmFyIHRyYWNlciA9IHRoaXM7XG5cbiAgICAgICAgY29udGV4dC5zZXRMaW5lRGFzaChbNSwgNV0pO1xuICAgICAgICB2YXIgbm9kZUlkeCA9IG5vZGUuaWQuc3Vic3RyaW5nKDEpO1xuICAgICAgICB0aGlzLmdyYXBoLmVkZ2VzKCkuZm9yRWFjaChmdW5jdGlvbihlZGdlKSB7XG4gICAgICAgICAgICB2YXIgZW5kcyA9IGVkZ2UuaWQuc3Vic3RyaW5nKDEpLnNwbGl0KFwiX1wiKTtcbiAgICAgICAgICAgIGlmIChlbmRzWzBdID09IG5vZGVJZHgpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSAnIzBmZic7XG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9IG5vZGU7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IHRyYWNlci5ncmFwaC5ub2RlcygnbicgKyBlbmRzWzFdKTtcbiAgICAgICAgICAgICAgICB0cmFjZXIuZHJhd0Fycm93KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIGlmIChuZXh0KSBuZXh0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbmRzWzFdID09IG5vZGVJZHgpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSAnI2ZmMCc7XG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9IHRyYWNlci5ncmFwaC5ub2RlcygnbicgKyBlbmRzWzBdKTtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gbm9kZTtcbiAgICAgICAgICAgICAgICB0cmFjZXIuZHJhd0Fycm93KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIGlmIChuZXh0KSBuZXh0KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxudmFyIERpcmVjdGVkR3JhcGggPSB7XG4gICAgcmFuZG9tOiBmdW5jdGlvbihOLCByYXRpbykge1xuICAgICAgICBpZiAoIU4pIE4gPSA1O1xuICAgICAgICBpZiAoIXJhdGlvKSByYXRpbyA9IC4zO1xuICAgICAgICB2YXIgRyA9IG5ldyBBcnJheShOKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIHtcbiAgICAgICAgICAgIEdbaV0gPSBuZXcgQXJyYXkoTik7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE47IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChpICE9IGopIHtcbiAgICAgICAgICAgICAgICAgICAgR1tpXVtqXSA9IChNYXRoLnJhbmRvbSgpICogKDEgLyByYXRpbykgfCAwKSA9PSAwID8gMSA6IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBHO1xuICAgIH1cbn07XG5cbnNpZ21hLmNhbnZhcy5sYWJlbHMuZGVmID0gZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICB2YXIgZnVuYyA9IHNldHRpbmdzKCdmdW5jTGFiZWxzRGVmJyk7XG4gICAgaWYgKGZ1bmMpIHtcbiAgICAgICAgZnVuYyhub2RlLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgfVxufTtcbnNpZ21hLmNhbnZhcy5ob3ZlcnMuZGVmID0gZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICB2YXIgZnVuYyA9IHNldHRpbmdzKCdmdW5jSG92ZXJzRGVmJyk7XG4gICAgaWYgKGZ1bmMpIHtcbiAgICAgICAgZnVuYyhub2RlLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgfVxufTtcbnNpZ21hLmNhbnZhcy5lZGdlcy5kZWYgPSBmdW5jdGlvbihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICB2YXIgZnVuYyA9IHNldHRpbmdzKCdmdW5jRWRnZXNEZWYnKTtcbiAgICBpZiAoZnVuYykge1xuICAgICAgICBmdW5jKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgfVxufTtcbnNpZ21hLmNhbnZhcy5lZGdlcy5hcnJvdyA9IGZ1bmN0aW9uKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgIHZhciBmdW5jID0gc2V0dGluZ3MoJ2Z1bmNFZGdlc0Fycm93Jyk7XG4gICAgaWYgKGZ1bmMpIHtcbiAgICAgICAgZnVuYyhlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIERpcmVjdGVkR3JhcGgsXG4gICAgRGlyZWN0ZWRHcmFwaFRyYWNlclxufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFRyYWNlciA9IHJlcXVpcmUoJy4vdHJhY2VyJyk7XG5cbmNvbnN0IExvZ1RyYWNlciA9IHJlcXVpcmUoJy4vbG9nX3RyYWNlcicpO1xuXG5jb25zdCB7XG4gIEFycmF5MUQsXG4gIEFycmF5MURUcmFjZXJcbn0gPSByZXF1aXJlKCcuL2FycmF5MWQnKTtcbmNvbnN0IHtcbiAgQXJyYXkyRCxcbiAgQXJyYXkyRFRyYWNlclxufSA9IHJlcXVpcmUoJy4vYXJyYXkyZCcpO1xuXG5jb25zdCBDaGFydFRyYWNlciA9IHJlcXVpcmUoJy4vY2hhcnQnKTtcblxuY29uc3Qge1xuICBDb29yZGluYXRlU3lzdGVtLFxuICBDb29yZGluYXRlU3lzdGVtVHJhY2VyXG59ID0gcmVxdWlyZSgnLi9jb29yZGluYXRlX3N5c3RlbScpO1xuXG5jb25zdCB7XG4gIERpcmVjdGVkR3JhcGgsXG4gIERpcmVjdGVkR3JhcGhUcmFjZXJcbn0gPSByZXF1aXJlKCcuL2RpcmVjdGVkX2dyYXBoJyk7XG5jb25zdCB7XG4gIFVuZGlyZWN0ZWRHcmFwaCxcbiAgVW5kaXJlY3RlZEdyYXBoVHJhY2VyXG59ID0gcmVxdWlyZSgnLi91bmRpcmVjdGVkX2dyYXBoJyk7XG5cbmNvbnN0IHtcbiAgV2VpZ2h0ZWREaXJlY3RlZEdyYXBoLFxuICBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXJcbn0gPSByZXF1aXJlKCcuL3dlaWdodGVkX2RpcmVjdGVkX2dyYXBoJyk7XG5jb25zdCB7XG4gIFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoLFxuICBXZWlnaHRlZFVuZGlyZWN0ZWRHcmFwaFRyYWNlclxufSA9IHJlcXVpcmUoJy4vd2VpZ2h0ZWRfdW5kaXJlY3RlZF9ncmFwaCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgVHJhY2VyLFxuICBMb2dUcmFjZXIsXG4gIEFycmF5MUQsXG4gIEFycmF5MURUcmFjZXIsXG4gIEFycmF5MkQsXG4gIEFycmF5MkRUcmFjZXIsXG4gIENoYXJ0VHJhY2VyLFxuICBDb29yZGluYXRlU3lzdGVtLFxuICBDb29yZGluYXRlU3lzdGVtVHJhY2VyLFxuICBEaXJlY3RlZEdyYXBoLFxuICBEaXJlY3RlZEdyYXBoVHJhY2VyLFxuICBVbmRpcmVjdGVkR3JhcGgsXG4gIFVuZGlyZWN0ZWRHcmFwaFRyYWNlcixcbiAgV2VpZ2h0ZWREaXJlY3RlZEdyYXBoLFxuICBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXIsXG4gIFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoLFxuICBXZWlnaHRlZFVuZGlyZWN0ZWRHcmFwaFRyYWNlclxufTsiLCJjb25zdCBUcmFjZXIgPSByZXF1aXJlKCcuL3RyYWNlcicpO1xuXG5mdW5jdGlvbiBMb2dUcmFjZXIoKSB7XG4gICAgaWYgKFRyYWNlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSB7XG4gICAgICAgIExvZ1RyYWNlci5wcm90b3R5cGUuaW5pdC5jYWxsKHRoaXMpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5Mb2dUcmFjZXIucHJvdG90eXBlID0gJC5leHRlbmQodHJ1ZSwgT2JqZWN0LmNyZWF0ZShUcmFjZXIucHJvdG90eXBlKSwge1xuICAgIGNvbnN0cnVjdG9yOiBMb2dUcmFjZXIsXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJHdyYXBwZXIgPSB0aGlzLmNhcHN1bGUuJHdyYXBwZXIgPSAkKCc8ZGl2IGNsYXNzPVwid3JhcHBlclwiPicpO1xuICAgICAgICB0aGlzLiRjb250YWluZXIuYXBwZW5kKHRoaXMuJHdyYXBwZXIpO1xuICAgIH0sXG4gICAgX3ByaW50OiBmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgICAgICAgdHlwZTogJ3ByaW50JyxcbiAgICAgICAgICAgIG1zZzogbXNnXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHByb2Nlc3NTdGVwOiBmdW5jdGlvbihzdGVwLCBvcHRpb25zKSB7XG4gICAgICAgIHN3aXRjaCAoc3RlcC50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdwcmludCc6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmludChzdGVwLm1zZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlZnJlc2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNjcm9sbFRvRW5kKE1hdGgubWluKDUwLCB0aGlzLmludGVydmFsKSk7XG4gICAgfSxcbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIFRyYWNlci5wcm90b3R5cGUuY2xlYXIuY2FsbCh0aGlzKTtcblxuICAgICAgICB0aGlzLiR3cmFwcGVyLmVtcHR5KCk7XG4gICAgfSxcbiAgICBwcmludDogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICB0aGlzLiR3cmFwcGVyLmFwcGVuZCgkKCc8c3Bhbj4nKS5hcHBlbmQobWVzc2FnZSArICc8YnIvPicpKTtcbiAgICB9LFxuICAgIHNjcm9sbFRvRW5kOiBmdW5jdGlvbihkdXJhdGlvbikge1xuICAgICAgICB0aGlzLiRjb250YWluZXIuYW5pbWF0ZSh7XG4gICAgICAgICAgICBzY3JvbGxUb3A6IHRoaXMuJGNvbnRhaW5lclswXS5zY3JvbGxIZWlnaHRcbiAgICAgICAgfSwgZHVyYXRpb24pO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ1RyYWNlcjsiLCJjb25zdCB7XG4gICAgdG9KU09OLFxuICAgIGZyb21KU09OXG59ID0gcmVxdWlyZSgnLi4vdHJhY2VyX21hbmFnZXIvdXRpbCcpO1xuXG5mdW5jdGlvbiBUcmFjZXIobmFtZSkge1xuICAgIHRoaXMubW9kdWxlID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICB0aGlzLmNhcHN1bGUgPSB0aGlzLm1hbmFnZXIuYWxsb2NhdGUodGhpcyk7XG4gICAgJC5leHRlbmQodGhpcywgdGhpcy5jYXBzdWxlKTtcbiAgICB0aGlzLnNldE5hbWUobmFtZSk7XG4gICAgcmV0dXJuIHRoaXMuaXNOZXc7XG59XG5cblRyYWNlci5wcm90b3R5cGUgPSB7XG5cbiAgICBjb25zdHJ1Y3RvcjogVHJhY2VyLFxuICAgIG1hbmFnZXI6IG51bGwsXG5cbiAgICBfc2V0RGF0YSguLi5hcmdzKSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICdzZXREYXRhJyxcbiAgICAgICAgICAgIGFyZ3M6IHRvSlNPTihhcmdzKVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIF9jbGVhcigpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnB1c2hTdGVwKHRoaXMuY2Fwc3VsZSwge1xuICAgICAgICAgICAgdHlwZTogJ2NsZWFyJ1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIF93YWl0KCkge1xuICAgICAgICB0aGlzLm1hbmFnZXIubmV3U3RlcCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgcHJvY2Vzc1N0ZXAoc3RlcCwgb3B0aW9ucykge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgYXJnc1xuICAgICAgICB9ID0gc3RlcDtcblxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3NldERhdGEnOlxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSguLi5mcm9tSlNPTihhcmdzKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjbGVhcic6XG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNldE5hbWUobmFtZSkge1xuICAgICAgICBsZXQgJG5hbWU7XG4gICAgICAgIGlmICh0aGlzLmlzTmV3KSB7XG4gICAgICAgICAgICAkbmFtZSA9ICQoJzxzcGFuIGNsYXNzPVwibmFtZVwiPicpO1xuICAgICAgICAgICAgdGhpcy4kY29udGFpbmVyLmFwcGVuZCgkbmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkbmFtZSA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCdzcGFuLm5hbWUnKTtcbiAgICAgICAgfVxuICAgICAgICAkbmFtZS50ZXh0KG5hbWUgfHwgdGhpcy5kZWZhdWx0TmFtZSk7XG4gICAgfSxcblxuICAgIHNldERhdGEoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0b0pTT04oYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzTmV3ICYmIHRoaXMubGFzdERhdGEgPT09IGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNOZXcgPSB0aGlzLmNhcHN1bGUuaXNOZXcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sYXN0RGF0YSA9IHRoaXMuY2Fwc3VsZS5sYXN0RGF0YSA9IGRhdGE7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgcmVzaXplKCkge30sXG4gICAgcmVmcmVzaCgpIHt9LFxuICAgIGNsZWFyKCkge30sXG5cbiAgICBhdHRhY2godHJhY2VyKSB7XG4gICAgICAgIGlmICh0cmFjZXIubW9kdWxlID09PSBMb2dUcmFjZXIpIHtcbiAgICAgICAgICAgIHRoaXMubG9nVHJhY2VyID0gdHJhY2VyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBtb3VzZWRvd24oZSkge30sXG4gICAgbW91c2Vtb3ZlKGUpIHt9LFxuICAgIG1vdXNldXAoZSkge30sXG4gICAgbW91c2V3aGVlbChlKSB7fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZXI7IiwiY29uc3Qge1xuICAgIERpcmVjdGVkR3JhcGgsXG4gICAgRGlyZWN0ZWRHcmFwaFRyYWNlclxufSA9IHJlcXVpcmUoJy4vZGlyZWN0ZWRfZ3JhcGgnKTtcblxuZnVuY3Rpb24gVW5kaXJlY3RlZEdyYXBoVHJhY2VyKCkge1xuICAgIGlmIChEaXJlY3RlZEdyYXBoVHJhY2VyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgVW5kaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cblVuZGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUgPSAkLmV4dGVuZCh0cnVlLCBPYmplY3QuY3JlYXRlKERpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlKSwge1xuICAgIGNvbnN0cnVjdG9yOiBVbmRpcmVjdGVkR3JhcGhUcmFjZXIsXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0cmFjZXIgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMucy5zZXR0aW5ncyh7XG4gICAgICAgICAgICBkZWZhdWx0RWRnZVR5cGU6ICdkZWYnLFxuICAgICAgICAgICAgZnVuY0VkZ2VzRGVmOiBmdW5jdGlvbihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSB0cmFjZXIuZ2V0Q29sb3IoZWRnZSwgc291cmNlLCB0YXJnZXQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICB0cmFjZXIuZHJhd0VkZ2UoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgc2V0RGF0YTogZnVuY3Rpb24oRykge1xuICAgICAgICBpZiAoVHJhY2VyLnByb3RvdHlwZS5zZXREYXRhLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHJldHVybiB0cnVlO1xuXG4gICAgICAgIHRoaXMuZ3JhcGguY2xlYXIoKTtcbiAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgIHZhciBlZGdlcyA9IFtdO1xuICAgICAgICB2YXIgdW5pdEFuZ2xlID0gMiAqIE1hdGguUEkgLyBHLmxlbmd0aDtcbiAgICAgICAgdmFyIGN1cnJlbnRBbmdsZSA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgRy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY3VycmVudEFuZ2xlICs9IHVuaXRBbmdsZTtcbiAgICAgICAgICAgIG5vZGVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGlkOiB0aGlzLm4oaSksXG4gICAgICAgICAgICAgICAgbGFiZWw6ICcnICsgaSxcbiAgICAgICAgICAgICAgICB4OiAuNSArIE1hdGguc2luKGN1cnJlbnRBbmdsZSkgLyAyLFxuICAgICAgICAgICAgICAgIHk6IC41ICsgTWF0aC5jb3MoY3VycmVudEFuZ2xlKSAvIDIsXG4gICAgICAgICAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvci5kZWZhdWx0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDw9IGk7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChHW2ldW2pdIHx8IEdbal1baV0pIHtcbiAgICAgICAgICAgICAgICAgICAgZWRnZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy5lKGksIGopLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLm4oaSksXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRoaXMubihqKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLmRlZmF1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplOiAxXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ3JhcGgucmVhZCh7XG4gICAgICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgICAgICBlZGdlczogZWRnZXNcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucy5jYW1lcmEuZ29Ubyh7XG4gICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgeTogMCxcbiAgICAgICAgICAgIGFuZ2xlOiAwLFxuICAgICAgICAgICAgcmF0aW86IDFcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIGU6IGZ1bmN0aW9uKHYxLCB2Mikge1xuICAgICAgICBpZiAodjEgPiB2Mikge1xuICAgICAgICAgICAgdmFyIHRlbXAgPSB2MTtcbiAgICAgICAgICAgIHYxID0gdjI7XG4gICAgICAgICAgICB2MiA9IHRlbXA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdlJyArIHYxICsgJ18nICsgdjI7XG4gICAgfSxcbiAgICBkcmF3T25Ib3ZlcjogZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MsIG5leHQpIHtcbiAgICAgICAgdmFyIHRyYWNlciA9IHRoaXM7XG5cbiAgICAgICAgY29udGV4dC5zZXRMaW5lRGFzaChbNSwgNV0pO1xuICAgICAgICB2YXIgbm9kZUlkeCA9IG5vZGUuaWQuc3Vic3RyaW5nKDEpO1xuICAgICAgICB0aGlzLmdyYXBoLmVkZ2VzKCkuZm9yRWFjaChmdW5jdGlvbihlZGdlKSB7XG4gICAgICAgICAgICB2YXIgZW5kcyA9IGVkZ2UuaWQuc3Vic3RyaW5nKDEpLnNwbGl0KFwiX1wiKTtcbiAgICAgICAgICAgIGlmIChlbmRzWzBdID09IG5vZGVJZHgpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSAnIzBmZic7XG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9IG5vZGU7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IHRyYWNlci5ncmFwaC5ub2RlcygnbicgKyBlbmRzWzFdKTtcbiAgICAgICAgICAgICAgICB0cmFjZXIuZHJhd0VkZ2UoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgaWYgKG5leHQpIG5leHQoZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVuZHNbMV0gPT0gbm9kZUlkeCkge1xuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9ICcjMGZmJztcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gdHJhY2VyLmdyYXBoLm5vZGVzKCduJyArIGVuZHNbMF0pO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBub2RlO1xuICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3RWRnZShlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICBpZiAobmV4dCkgbmV4dChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBkcmF3RWRnZTogZnVuY3Rpb24oZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICB2YXIgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnLFxuICAgICAgICAgICAgc2l6ZSA9IGVkZ2VbcHJlZml4ICsgJ3NpemUnXSB8fCAxO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSBzaXplO1xuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0Lm1vdmVUbyhcbiAgICAgICAgICAgIHNvdXJjZVtwcmVmaXggKyAneCddLFxuICAgICAgICAgICAgc291cmNlW3ByZWZpeCArICd5J11cbiAgICAgICAgKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oXG4gICAgICAgICAgICB0YXJnZXRbcHJlZml4ICsgJ3gnXSxcbiAgICAgICAgICAgIHRhcmdldFtwcmVmaXggKyAneSddXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxufSk7XG5cbnZhciBVbmRpcmVjdGVkR3JhcGggPSB7XG4gICAgcmFuZG9tOiBmdW5jdGlvbihOLCByYXRpbykge1xuICAgICAgICBpZiAoIU4pIE4gPSA1O1xuICAgICAgICBpZiAoIXJhdGlvKSByYXRpbyA9IC4zO1xuICAgICAgICB2YXIgRyA9IG5ldyBBcnJheShOKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIEdbaV0gPSBuZXcgQXJyYXkoTik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE47IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChpID4gaikge1xuICAgICAgICAgICAgICAgICAgICBHW2ldW2pdID0gR1tqXVtpXSA9IChNYXRoLnJhbmRvbSgpICogKDEgLyByYXRpbykgfCAwKSA9PSAwID8gMSA6IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBHO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFVuZGlyZWN0ZWRHcmFwaCxcbiAgICBVbmRpcmVjdGVkR3JhcGhUcmFjZXJcbn07IiwiY29uc3Qge1xuICAgIERpcmVjdGVkR3JhcGgsXG4gICAgRGlyZWN0ZWRHcmFwaFRyYWNlclxufSA9IHJlcXVpcmUoJy4vZGlyZWN0ZWRfZ3JhcGgnKTtcblxuY29uc3Qge1xuICAgIHJlZmluZUJ5VHlwZVxufSA9IHJlcXVpcmUoJy4uL3RyYWNlcl9tYW5hZ2VyL3V0aWwnKTtcblxuZnVuY3Rpb24gV2VpZ2h0ZWREaXJlY3RlZEdyYXBoVHJhY2VyKCkge1xuICAgIGlmIChEaXJlY3RlZEdyYXBoVHJhY2VyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgV2VpZ2h0ZWREaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbldlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUgPSAkLmV4dGVuZCh0cnVlLCBPYmplY3QuY3JlYXRlKERpcmVjdGVkR3JhcGhUcmFjZXIucHJvdG90eXBlKSwge1xuICAgIGNvbnN0cnVjdG9yOiBXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXIsXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0cmFjZXIgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMucy5zZXR0aW5ncyh7XG4gICAgICAgICAgICBlZGdlTGFiZWxTaXplOiAncHJvcG9ydGlvbmFsJyxcbiAgICAgICAgICAgIGRlZmF1bHRFZGdlTGFiZWxTaXplOiAyMCxcbiAgICAgICAgICAgIGVkZ2VMYWJlbFNpemVQb3dSYXRpbzogMC44LFxuICAgICAgICAgICAgZnVuY0xhYmVsc0RlZjogZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICB0cmFjZXIuZHJhd05vZGVXZWlnaHQobm9kZSwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3TGFiZWwobm9kZSwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmNIb3ZlcnNEZWY6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgdHJhY2VyLmRyYXdPbkhvdmVyKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzLCB0cmFjZXIuZHJhd0VkZ2VXZWlnaHQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmNFZGdlc0Fycm93OiBmdW5jdGlvbihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSB0cmFjZXIuZ2V0Q29sb3IoZWRnZSwgc291cmNlLCB0YXJnZXQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICB0cmFjZXIuZHJhd0Fycm93KGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3RWRnZVdlaWdodChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBfd2VpZ2h0OiBmdW5jdGlvbih0YXJnZXQsIHdlaWdodCkge1xuICAgICAgICB0aGlzLm1hbmFnZXIucHVzaFN0ZXAodGhpcy5jYXBzdWxlLCB7XG4gICAgICAgICAgICB0eXBlOiAnd2VpZ2h0JyxcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgICAgd2VpZ2h0OiB3ZWlnaHRcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX3Zpc2l0OiBmdW5jdGlvbih0YXJnZXQsIHNvdXJjZSwgd2VpZ2h0KSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICd2aXNpdCcsXG4gICAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgICAgd2VpZ2h0OiB3ZWlnaHRcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgX2xlYXZlOiBmdW5jdGlvbih0YXJnZXQsIHNvdXJjZSwgd2VpZ2h0KSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5wdXNoU3RlcCh0aGlzLmNhcHN1bGUsIHtcbiAgICAgICAgICAgIHR5cGU6ICdsZWF2ZScsXG4gICAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgICAgd2VpZ2h0OiB3ZWlnaHRcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgcHJvY2Vzc1N0ZXA6IGZ1bmN0aW9uKHN0ZXAsIG9wdGlvbnMpIHtcbiAgICAgICAgc3dpdGNoIChzdGVwLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3dlaWdodCc6XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldE5vZGUgPSB0aGlzLmdyYXBoLm5vZGVzKHRoaXMubihzdGVwLnRhcmdldCkpO1xuICAgICAgICAgICAgICAgIGlmIChzdGVwLndlaWdodCAhPT0gdW5kZWZpbmVkKSB0YXJnZXROb2RlLndlaWdodCA9IHJlZmluZUJ5VHlwZShzdGVwLndlaWdodCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd2aXNpdCc6XG4gICAgICAgICAgICBjYXNlICdsZWF2ZSc6XG4gICAgICAgICAgICAgICAgdmFyIHZpc2l0ID0gc3RlcC50eXBlID09ICd2aXNpdCc7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldE5vZGUgPSB0aGlzLmdyYXBoLm5vZGVzKHRoaXMubihzdGVwLnRhcmdldCkpO1xuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IHZpc2l0ID8gdGhpcy5jb2xvci52aXNpdGVkIDogdGhpcy5jb2xvci5sZWZ0O1xuICAgICAgICAgICAgICAgIHRhcmdldE5vZGUuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgICAgICAgICBpZiAoc3RlcC53ZWlnaHQgIT09IHVuZGVmaW5lZCkgdGFyZ2V0Tm9kZS53ZWlnaHQgPSByZWZpbmVCeVR5cGUoc3RlcC53ZWlnaHQpO1xuICAgICAgICAgICAgICAgIGlmIChzdGVwLnNvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlZGdlSWQgPSB0aGlzLmUoc3RlcC5zb3VyY2UsIHN0ZXAudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVkZ2UgPSB0aGlzLmdyYXBoLmVkZ2VzKGVkZ2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIGVkZ2UuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmFwaC5kcm9wRWRnZShlZGdlSWQpLmFkZEVkZ2UoZWRnZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxvZ1RyYWNlcikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gc3RlcC5zb3VyY2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2UgPT09IHVuZGVmaW5lZCkgc291cmNlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nVHJhY2VyLnByaW50KHZpc2l0ID8gc291cmNlICsgJyAtPiAnICsgc3RlcC50YXJnZXQgOiBzb3VyY2UgKyAnIDwtICcgKyBzdGVwLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBEaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZS5wcm9jZXNzU3RlcC5jYWxsKHRoaXMsIHN0ZXAsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXREYXRhOiBmdW5jdGlvbihHKSB7XG4gICAgICAgIGlmIChUcmFjZXIucHJvdG90eXBlLnNldERhdGEuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgdGhpcy5ncmFwaC5jbGVhcigpO1xuICAgICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgICAgdmFyIGVkZ2VzID0gW107XG4gICAgICAgIHZhciB1bml0QW5nbGUgPSAyICogTWF0aC5QSSAvIEcubGVuZ3RoO1xuICAgICAgICB2YXIgY3VycmVudEFuZ2xlID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBHLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjdXJyZW50QW5nbGUgKz0gdW5pdEFuZ2xlO1xuICAgICAgICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMubihpKSxcbiAgICAgICAgICAgICAgICBsYWJlbDogJycgKyBpLFxuICAgICAgICAgICAgICAgIHg6IC41ICsgTWF0aC5zaW4oY3VycmVudEFuZ2xlKSAvIDIsXG4gICAgICAgICAgICAgICAgeTogLjUgKyBNYXRoLmNvcyhjdXJyZW50QW5nbGUpIC8gMixcbiAgICAgICAgICAgICAgICBzaXplOiAxLFxuICAgICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLmRlZmF1bHQsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgR1tpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChHW2ldW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgIGVkZ2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHRoaXMuZShpLCBqKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5uKGkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLm4oaiksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvci5kZWZhdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodDogcmVmaW5lQnlUeXBlKEdbaV1bal0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ3JhcGgucmVhZCh7XG4gICAgICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgICAgICBlZGdlczogZWRnZXNcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucy5jYW1lcmEuZ29Ubyh7XG4gICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgeTogMCxcbiAgICAgICAgICAgIGFuZ2xlOiAwLFxuICAgICAgICAgICAgcmF0aW86IDFcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUuY2xlYXIuY2FsbCh0aGlzKTtcblxuICAgICAgICB0aGlzLmNsZWFyV2VpZ2h0cygpO1xuICAgIH0sXG4gICAgY2xlYXJXZWlnaHRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5ncmFwaC5ub2RlcygpLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgbm9kZS53ZWlnaHQgPSAwO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGRyYXdFZGdlV2VpZ2h0OiBmdW5jdGlvbihlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICAgIGlmIChzb3VyY2UgPT0gdGFyZ2V0KVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJycsXG4gICAgICAgICAgICBzaXplID0gZWRnZVtwcmVmaXggKyAnc2l6ZSddIHx8IDE7XG5cbiAgICAgICAgaWYgKHNpemUgPCBzZXR0aW5ncygnZWRnZUxhYmVsVGhyZXNob2xkJykpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgaWYgKDAgPT09IHNldHRpbmdzKCdlZGdlTGFiZWxTaXplUG93UmF0aW8nKSlcbiAgICAgICAgICAgIHRocm93ICdcImVkZ2VMYWJlbFNpemVQb3dSYXRpb1wiIG11c3Qgbm90IGJlIDAuJztcblxuICAgICAgICB2YXIgZm9udFNpemUsXG4gICAgICAgICAgICB4ID0gKHNvdXJjZVtwcmVmaXggKyAneCddICsgdGFyZ2V0W3ByZWZpeCArICd4J10pIC8gMixcbiAgICAgICAgICAgIHkgPSAoc291cmNlW3ByZWZpeCArICd5J10gKyB0YXJnZXRbcHJlZml4ICsgJ3knXSkgLyAyLFxuICAgICAgICAgICAgZFggPSB0YXJnZXRbcHJlZml4ICsgJ3gnXSAtIHNvdXJjZVtwcmVmaXggKyAneCddLFxuICAgICAgICAgICAgZFkgPSB0YXJnZXRbcHJlZml4ICsgJ3knXSAtIHNvdXJjZVtwcmVmaXggKyAneSddLFxuICAgICAgICAgICAgYW5nbGUgPSBNYXRoLmF0YW4yKGRZLCBkWCk7XG5cbiAgICAgICAgZm9udFNpemUgPSAoc2V0dGluZ3MoJ2VkZ2VMYWJlbFNpemUnKSA9PT0gJ2ZpeGVkJykgP1xuICAgICAgICAgICAgc2V0dGluZ3MoJ2RlZmF1bHRFZGdlTGFiZWxTaXplJykgOlxuICAgICAgICAgICAgc2V0dGluZ3MoJ2RlZmF1bHRFZGdlTGFiZWxTaXplJykgKlxuICAgICAgICAgICAgc2l6ZSAqXG4gICAgICAgICAgICBNYXRoLnBvdyhzaXplLCAtMSAvIHNldHRpbmdzKCdlZGdlTGFiZWxTaXplUG93UmF0aW8nKSk7XG5cbiAgICAgICAgY29udGV4dC5zYXZlKCk7XG5cbiAgICAgICAgaWYgKGVkZ2UuYWN0aXZlKSB7XG4gICAgICAgICAgICBjb250ZXh0LmZvbnQgPSBbXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MoJ2FjdGl2ZUZvbnRTdHlsZScpLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplICsgJ3B4JyxcbiAgICAgICAgICAgICAgICBzZXR0aW5ncygnYWN0aXZlRm9udCcpIHx8IHNldHRpbmdzKCdmb250JylcbiAgICAgICAgICAgIF0uam9pbignICcpO1xuXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGV4dC5mb250ID0gW1xuICAgICAgICAgICAgICAgIHNldHRpbmdzKCdmb250U3R5bGUnKSxcbiAgICAgICAgICAgICAgICBmb250U2l6ZSArICdweCcsXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MoJ2ZvbnQnKVxuICAgICAgICAgICAgXS5qb2luKCcgJyk7XG5cbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICBjb250ZXh0LnRleHRCYXNlbGluZSA9ICdhbHBoYWJldGljJztcblxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSh4LCB5KTtcbiAgICAgICAgY29udGV4dC5yb3RhdGUoYW5nbGUpO1xuICAgICAgICBjb250ZXh0LmZpbGxUZXh0KFxuICAgICAgICAgICAgZWRnZS53ZWlnaHQsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgKC1zaXplIC8gMikgLSAzXG4gICAgICAgICk7XG5cbiAgICAgICAgY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfSxcbiAgICBkcmF3Tm9kZVdlaWdodDogZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICAgdmFyIGZvbnRTaXplLFxuICAgICAgICAgICAgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnLFxuICAgICAgICAgICAgc2l6ZSA9IG5vZGVbcHJlZml4ICsgJ3NpemUnXTtcblxuICAgICAgICBpZiAoc2l6ZSA8IHNldHRpbmdzKCdsYWJlbFRocmVzaG9sZCcpKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGZvbnRTaXplID0gKHNldHRpbmdzKCdsYWJlbFNpemUnKSA9PT0gJ2ZpeGVkJykgP1xuICAgICAgICAgICAgc2V0dGluZ3MoJ2RlZmF1bHRMYWJlbFNpemUnKSA6XG4gICAgICAgICAgICBzZXR0aW5ncygnbGFiZWxTaXplUmF0aW8nKSAqIHNpemU7XG5cbiAgICAgICAgY29udGV4dC5mb250ID0gKHNldHRpbmdzKCdmb250U3R5bGUnKSA/IHNldHRpbmdzKCdmb250U3R5bGUnKSArICcgJyA6ICcnKSArXG4gICAgICAgICAgICBmb250U2l6ZSArICdweCAnICsgc2V0dGluZ3MoJ2ZvbnQnKTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAoc2V0dGluZ3MoJ2xhYmVsQ29sb3InKSA9PT0gJ25vZGUnKSA/XG4gICAgICAgICAgICAobm9kZS5jb2xvciB8fCBzZXR0aW5ncygnZGVmYXVsdE5vZGVDb2xvcicpKSA6XG4gICAgICAgICAgICBzZXR0aW5ncygnZGVmYXVsdExhYmVsQ29sb3InKTtcblxuICAgICAgICBjb250ZXh0LnRleHRBbGlnbiA9ICdsZWZ0JztcbiAgICAgICAgY29udGV4dC5maWxsVGV4dChcbiAgICAgICAgICAgIG5vZGUud2VpZ2h0LFxuICAgICAgICAgICAgTWF0aC5yb3VuZChub2RlW3ByZWZpeCArICd4J10gKyBzaXplICogMS41KSxcbiAgICAgICAgICAgIE1hdGgucm91bmQobm9kZVtwcmVmaXggKyAneSddICsgZm9udFNpemUgLyAzKVxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG52YXIgV2VpZ2h0ZWREaXJlY3RlZEdyYXBoID0ge1xuICAgIHJhbmRvbTogZnVuY3Rpb24oTiwgcmF0aW8sIG1pbiwgbWF4KSB7XG4gICAgICAgIGlmICghTikgTiA9IDU7XG4gICAgICAgIGlmICghcmF0aW8pIHJhdGlvID0gLjM7XG4gICAgICAgIGlmICghbWluKSBtaW4gPSAxO1xuICAgICAgICBpZiAoIW1heCkgbWF4ID0gNTtcbiAgICAgICAgdmFyIEcgPSBuZXcgQXJyYXkoTik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XG4gICAgICAgICAgICBHW2ldID0gbmV3IEFycmF5KE4pO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBOOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSAhPSBqICYmIChNYXRoLnJhbmRvbSgpICogKDEgLyByYXRpbykgfCAwKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIEdbaV1bal0gPSAoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSB8IDApICsgbWluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRztcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBXZWlnaHRlZERpcmVjdGVkR3JhcGgsXG4gICAgV2VpZ2h0ZWREaXJlY3RlZEdyYXBoVHJhY2VyXG59OyIsImNvbnN0IHtcbiAgICBXZWlnaHRlZERpcmVjdGVkR3JhcGgsXG4gICAgV2VpZ2h0ZWREaXJlY3RlZEdyYXBoVHJhY2VyXG59ID0gcmVxdWlyZSgnLi93ZWlnaHRlZF9kaXJlY3RlZF9ncmFwaCcpO1xuXG5jb25zdCB7XG4gICAgVW5kaXJlY3RlZEdyYXBoVHJhY2VyXG59ID0gcmVxdWlyZSgnLi91bmRpcmVjdGVkX2dyYXBoJyk7XG5cbmZ1bmN0aW9uIFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoVHJhY2VyKCkge1xuICAgIGlmIChXZWlnaHRlZERpcmVjdGVkR3JhcGhUcmFjZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICBXZWlnaHRlZFVuZGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUuaW5pdC5jYWxsKHRoaXMpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5XZWlnaHRlZFVuZGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUgPSAkLmV4dGVuZCh0cnVlLCBPYmplY3QuY3JlYXRlKFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUpLCB7XG4gICAgY29uc3RydWN0b3I6IFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoVHJhY2VyLFxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdHJhY2VyID0gdGhpcztcblxuICAgICAgICB0aGlzLnMuc2V0dGluZ3Moe1xuICAgICAgICAgICAgZGVmYXVsdEVkZ2VUeXBlOiAnZGVmJyxcbiAgICAgICAgICAgIGZ1bmNFZGdlc0RlZjogZnVuY3Rpb24oZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gdHJhY2VyLmdldENvbG9yKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgdHJhY2VyLmRyYXdFZGdlKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb2xvciwgY29udGV4dCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIHRyYWNlci5kcmF3RWRnZVdlaWdodChlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBzZXREYXRhOiBmdW5jdGlvbihHKSB7XG4gICAgICAgIGlmIChUcmFjZXIucHJvdG90eXBlLnNldERhdGEuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgdGhpcy5ncmFwaC5jbGVhcigpO1xuICAgICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgICAgdmFyIGVkZ2VzID0gW107XG4gICAgICAgIHZhciB1bml0QW5nbGUgPSAyICogTWF0aC5QSSAvIEcubGVuZ3RoO1xuICAgICAgICB2YXIgY3VycmVudEFuZ2xlID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBHLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjdXJyZW50QW5nbGUgKz0gdW5pdEFuZ2xlO1xuICAgICAgICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMubihpKSxcbiAgICAgICAgICAgICAgICBsYWJlbDogJycgKyBpLFxuICAgICAgICAgICAgICAgIHg6IC41ICsgTWF0aC5zaW4oY3VycmVudEFuZ2xlKSAvIDIsXG4gICAgICAgICAgICAgICAgeTogLjUgKyBNYXRoLmNvcyhjdXJyZW50QW5nbGUpIC8gMixcbiAgICAgICAgICAgICAgICBzaXplOiAxLFxuICAgICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLmRlZmF1bHQsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDw9IGk7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChHW2ldW2pdIHx8IEdbal1baV0pIHtcbiAgICAgICAgICAgICAgICAgICAgZWRnZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy5lKGksIGopLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLm4oaSksXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRoaXMubihqKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLmRlZmF1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiBHW2ldW2pdXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ3JhcGgucmVhZCh7XG4gICAgICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgICAgICBlZGdlczogZWRnZXNcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucy5jYW1lcmEuZ29Ubyh7XG4gICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgeTogMCxcbiAgICAgICAgICAgIGFuZ2xlOiAwLFxuICAgICAgICAgICAgcmF0aW86IDFcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIGU6IFVuZGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUuZSxcbiAgICBkcmF3T25Ib3ZlcjogVW5kaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZS5kcmF3T25Ib3ZlcixcbiAgICBkcmF3RWRnZTogVW5kaXJlY3RlZEdyYXBoVHJhY2VyLnByb3RvdHlwZS5kcmF3RWRnZSxcbiAgICBkcmF3RWRnZVdlaWdodDogZnVuY3Rpb24oZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbG9yLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgICB2YXIgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnO1xuICAgICAgICBpZiAoc291cmNlW3ByZWZpeCArICd4J10gPiB0YXJnZXRbcHJlZml4ICsgJ3gnXSkge1xuICAgICAgICAgICAgdmFyIHRlbXAgPSBzb3VyY2U7XG4gICAgICAgICAgICBzb3VyY2UgPSB0YXJnZXQ7XG4gICAgICAgICAgICB0YXJnZXQgPSB0ZW1wO1xuICAgICAgICB9XG4gICAgICAgIFdlaWdodGVkRGlyZWN0ZWRHcmFwaFRyYWNlci5wcm90b3R5cGUuZHJhd0VkZ2VXZWlnaHQuY2FsbCh0aGlzLCBlZGdlLCBzb3VyY2UsIHRhcmdldCwgY29sb3IsIGNvbnRleHQsIHNldHRpbmdzKTtcbiAgICB9XG59KTtcblxudmFyIFdlaWdodGVkVW5kaXJlY3RlZEdyYXBoID0ge1xuICAgIHJhbmRvbTogZnVuY3Rpb24oTiwgcmF0aW8sIG1pbiwgbWF4KSB7XG4gICAgICAgIGlmICghTikgTiA9IDU7XG4gICAgICAgIGlmICghcmF0aW8pIHJhdGlvID0gLjM7XG4gICAgICAgIGlmICghbWluKSBtaW4gPSAxO1xuICAgICAgICBpZiAoIW1heCkgbWF4ID0gNTtcbiAgICAgICAgdmFyIEcgPSBuZXcgQXJyYXkoTik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSBHW2ldID0gbmV3IEFycmF5KE4pO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE47IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBOOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA+IGogJiYgKE1hdGgucmFuZG9tKCkgKiAoMSAvIHJhdGlvKSB8IDApID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgR1tpXVtqXSA9IEdbal1baV0gPSAoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSB8IDApICsgbWluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRztcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBXZWlnaHRlZFVuZGlyZWN0ZWRHcmFwaCxcbiAgICBXZWlnaHRlZFVuZGlyZWN0ZWRHcmFwaFRyYWNlclxufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHJlcXVlc3QgPSByZXF1aXJlKCcuL3JlcXVlc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAodXJsKSA9PiB7XG5cbiAgcmV0dXJuIHJlcXVlc3QodXJsLCB7XG4gICAgdHlwZTogJ0dFVCdcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCkge1xuICByZXR1cm4gcmVxdWVzdCh1cmwsIHtcbiAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgIHR5cGU6ICdHRVQnXG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHJlcXVlc3QgPSByZXF1aXJlKCcuL3JlcXVlc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cmwsIGRhdGEpIHtcbiAgcmV0dXJuIHJlcXVlc3QodXJsLCB7XG4gICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICB0eXBlOiAnUE9TVCcsXG4gICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFJTVlAgPSByZXF1aXJlKCdyc3ZwJyk7XG5jb25zdCBhcHBJbnN0YW5jZSA9IHJlcXVpcmUoJy4uLy4uL2FwcCcpO1xuXG5jb25zdCB7XG4gIGFqYXgsXG4gIGV4dGVuZFxufSA9ICQ7XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCwgb3B0aW9ucyA9IHt9KSB7XG4gIGFwcEluc3RhbmNlLnNldElzTG9hZGluZyh0cnVlKTtcblxuICByZXR1cm4gbmV3IFJTVlAuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgY2FsbGJhY2tzID0ge1xuICAgICAgc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICBhcHBJbnN0YW5jZS5zZXRJc0xvYWRpbmcoZmFsc2UpO1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcihyZWFzb24pIHtcbiAgICAgICAgYXBwSW5zdGFuY2Uuc2V0SXNMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgcmVqZWN0KHJlYXNvbik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IG9wdHMgPSBleHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zLCBjYWxsYmFja3MsIHtcbiAgICAgIHVybFxuICAgIH0pO1xuXG4gICAgYWpheChvcHRzKTtcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgYXBwSW5zdGFuY2UgPSByZXF1aXJlKCcuLi9hcHAnKTtcbmNvbnN0IFRvYXN0ID0gcmVxdWlyZSgnLi4vZG9tL3RvYXN0Jyk7XG5cbmNvbnN0IGNoZWNrTG9hZGluZyA9ICgpID0+IHtcbiAgaWYgKGFwcEluc3RhbmNlLmdldElzTG9hZGluZygpKSB7XG4gICAgVG9hc3Quc2hvd0Vycm9yVG9hc3QoJ1dhaXQgdW50aWwgaXQgY29tcGxldGVzIGxvYWRpbmcgb2YgcHJldmlvdXMgZmlsZS4nKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5jb25zdCBnZXRQYXJhbWV0ZXJCeU5hbWUgPSAobmFtZSkgPT4ge1xuICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgY29uc3QgY2xlYW5OYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCAnXFxcXCQmJyk7XG4gIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgWz8mXSR7bmFtZX0oPShbXiYjXSopfCZ8I3wkKWApO1xuXG4gIGNvbnN0IHJlc3VsdHMgPSByZWdleC5leGVjKHVybCk7XG5cbiAgaWYgKCFyZXN1bHRzIHx8IHJlc3VsdHMubGVuZ3RoICE9PSAzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBbLCAsIGlkXSA9IHJlc3VsdHM7XG5cbiAgcmV0dXJuIGlkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNoZWNrTG9hZGluZyxcbiAgZ2V0UGFyYW1ldGVyQnlOYW1lXG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgbG9hZEFsZ29yaXRobSA9IHJlcXVpcmUoJy4vbG9hZF9hbGdvcml0aG0nKTtcbmNvbnN0IGxvYWRDYXRlZ29yaWVzID0gcmVxdWlyZSgnLi9sb2FkX2NhdGVnb3JpZXMnKTtcbmNvbnN0IGxvYWRGaWxlID0gcmVxdWlyZSgnLi9sb2FkX2ZpbGUnKTtcbmNvbnN0IGxvYWRTY3JhdGNoUGFwZXIgPSByZXF1aXJlKCcuL2xvYWRfc2NyYXRjaF9wYXBlcicpO1xuY29uc3Qgc2hhcmVTY3JhdGNoUGFwZXIgPSByZXF1aXJlKCcuL3NoYXJlX3NjcmF0Y2hfcGFwZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGxvYWRBbGdvcml0aG0sXG4gIGxvYWRDYXRlZ29yaWVzLFxuICBsb2FkRmlsZSxcbiAgbG9hZFNjcmF0Y2hQYXBlcixcbiAgc2hhcmVTY3JhdGNoUGFwZXJcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBVdGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5jb25zdCBnZXRKU09OID0gcmVxdWlyZSgnLi9hamF4L2dldF9qc29uJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGNhdGVnb3J5LCBhbGdvcml0aG0pID0+IHtcbiAgY29uc3QgZGlyID0gVXRpbHMuZ2V0QWxnb3JpdGhtRGlyKGNhdGVnb3J5LCBhbGdvcml0aG0pO1xuICByZXR1cm4gZ2V0SlNPTihgJHtkaXJ9ZGVzYy5qc29uYCk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgYXBwSW5zdGFuY2UgPSByZXF1aXJlKCcuLi9hcHAnKTtcbmNvbnN0IGdldEpTT04gPSByZXF1aXJlKCcuL2FqYXgvZ2V0X2pzb24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG4gIHJldHVybiBnZXRKU09OKCcuL2FsZ29yaXRobS9jYXRlZ29yeS5qc29uJyk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgUlNWUCA9IHJlcXVpcmUoJ3JzdnAnKTtcblxuY29uc3QgYXBwSW5zdGFuY2UgPSByZXF1aXJlKCcuLi9hcHAnKTtcbmNvbnN0IFV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuY29uc3Qge1xuICBjaGVja0xvYWRpbmdcbn0gPSByZXF1aXJlKCcuL2hlbHBlcnMnKTtcblxuY29uc3QgZ2V0ID0gcmVxdWlyZSgnLi9hamF4L2dldCcpO1xuXG5jb25zdCBsb2FkRGF0YUFuZENvZGUgPSAoZGlyKSA9PiB7XG4gIHJldHVybiBSU1ZQLmhhc2goe1xuICAgIGRhdGE6IGdldChgJHtkaXJ9ZGF0YS5qc2ApLFxuICAgIGNvZGU6IGdldChgJHtkaXJ9Y29kZS5qc2ApXG4gIH0pO1xufTtcblxuY29uc3QgbG9hZEZpbGVBbmRVcGRhdGVDb250ZW50ID0gKGRpcikgPT4ge1xuICBhcHBJbnN0YW5jZS5nZXRFZGl0b3IoKS5jbGVhckNvbnRlbnQoKTtcblxuICByZXR1cm4gbG9hZERhdGFBbmRDb2RlKGRpcikudGhlbigoY29udGVudCkgPT4ge1xuICAgIGFwcEluc3RhbmNlLnVwZGF0ZUNhY2hlZEZpbGUoZGlyLCBjb250ZW50KTtcbiAgICBhcHBJbnN0YW5jZS5nZXRFZGl0b3IoKS5zZXRDb250ZW50KGNvbnRlbnQpO1xuICB9KTtcbn07XG5cbmNvbnN0IGNhY2hlZENvbnRlbnRFeGlzdHMgPSAoY2FjaGVkRmlsZSkgPT4ge1xuICByZXR1cm4gY2FjaGVkRmlsZSAmJlxuICAgIGNhY2hlZEZpbGUuZGF0YSAhPT0gdW5kZWZpbmVkICYmXG4gICAgY2FjaGVkRmlsZS5jb2RlICE9PSB1bmRlZmluZWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IChjYXRlZ29yeSwgYWxnb3JpdGhtLCBmaWxlLCBleHBsYW5hdGlvbikgPT4ge1xuICByZXR1cm4gbmV3IFJTVlAuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICBpZiAoY2hlY2tMb2FkaW5nKCkpIHtcbiAgICAgIHJlamVjdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcjZXhwbGFuYXRpb24nKS5odG1sKGV4cGxhbmF0aW9uKTtcblxuICAgICAgbGV0IGRpciA9IFV0aWxzLmdldEZpbGVEaXIoY2F0ZWdvcnksIGFsZ29yaXRobSwgZmlsZSk7XG4gICAgICBhcHBJbnN0YW5jZS5zZXRMYXN0RmlsZVVzZWQoZGlyKTtcbiAgICAgIGNvbnN0IGNhY2hlZEZpbGUgPSBhcHBJbnN0YW5jZS5nZXRDYWNoZWRGaWxlKGRpcik7XG5cbiAgICAgIGlmIChjYWNoZWRDb250ZW50RXhpc3RzKGNhY2hlZEZpbGUpKSB7XG4gICAgICAgIGFwcEluc3RhbmNlLmdldEVkaXRvcigpLnNldENvbnRlbnQoY2FjaGVkRmlsZSk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvYWRGaWxlQW5kVXBkYXRlQ29udGVudChkaXIpLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFJTVlAgPSByZXF1aXJlKCdyc3ZwJyk7XG5cbmNvbnN0IFV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbmNvbnN0IGFwcEluc3RhbmNlID0gcmVxdWlyZSgnLi4vYXBwJyk7XG5cbmNvbnN0IGdldEpTT04gPSByZXF1aXJlKCcuL2FqYXgvZ2V0X2pzb24nKTtcbmNvbnN0IGxvYWRBbGdvcml0aG0gPSByZXF1aXJlKCcuL2xvYWRfYWxnb3JpdGhtJyk7XG5cbmNvbnN0IGV4dHJhY3RHaXN0Q29kZSA9IChmaWxlcywgbmFtZSkgPT4gZmlsZXNbYCR7bmFtZX0uanNgXS5jb250ZW50O1xuXG5tb2R1bGUuZXhwb3J0cyA9IChnaXN0SUQpID0+IHtcbiAgcmV0dXJuIG5ldyBSU1ZQLlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGdldEpTT04oYGh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vZ2lzdHMvJHtnaXN0SUR9YCkudGhlbigoe1xuICAgICAgZmlsZXNcbiAgICB9KSA9PiB7XG5cbiAgICAgIGNvbnN0IGFsZ29yaXRobSA9ICdzY3JhdGNoX3BhcGVyJztcbiAgICAgIGNvbnN0IGNhdGVnb3J5ID0gbnVsbDtcblxuICAgICAgbG9hZEFsZ29yaXRobShjYXRlZ29yeSwgYWxnb3JpdGhtKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgY29uc3QgYWxnb0RhdGEgPSBleHRyYWN0R2lzdENvZGUoZmlsZXMsICdkYXRhJyk7XG4gICAgICAgIGNvbnN0IGFsZ29Db2RlID0gZXh0cmFjdEdpc3RDb2RlKGZpbGVzLCAnY29kZScpO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBzY3JhdGNoIHBhcGVyIGFsZ28gY29kZSB3aXRoIHRoZSBsb2FkZWQgZ2lzdCBjb2RlXG4gICAgICAgIGNvbnN0IGRpciA9IFV0aWxzLmdldEZpbGVEaXIoY2F0ZWdvcnksIGFsZ29yaXRobSwgJ3NjcmF0Y2hfcGFwZXInKTtcbiAgICAgICAgYXBwSW5zdGFuY2UudXBkYXRlQ2FjaGVkRmlsZShkaXIsIHtcbiAgICAgICAgICBkYXRhOiBhbGdvRGF0YSxcbiAgICAgICAgICBjb2RlOiBhbGdvQ29kZSxcbiAgICAgICAgICAnQ1JFRElULm1kJzogJ1NoYXJlZCBieSBhbiBhbm9ueW1vdXMgdXNlciBmcm9tIGh0dHA6Ly9wYXJranM4MTQuZ2l0aHViLmlvL0FsZ29yaXRobVZpc3VhbGl6ZXInXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgIGNhdGVnb3J5LFxuICAgICAgICAgIGFsZ29yaXRobSxcbiAgICAgICAgICBkYXRhXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgUlNWUCA9IHJlcXVpcmUoJ3JzdnAnKTtcbmNvbnN0IGFwcEluc3RhbmNlID0gcmVxdWlyZSgnLi4vYXBwJyk7XG5cbmNvbnN0IHBvc3RKU09OID0gcmVxdWlyZSgnLi9hamF4L3Bvc3RfanNvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IHtcbiAgcmV0dXJuIG5ldyBSU1ZQLlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgY29uc3Qge1xuICAgICAgZGF0YUVkaXRvcixcbiAgICAgIGNvZGVFZGl0b3JcbiAgICB9ID0gYXBwSW5zdGFuY2UuZ2V0RWRpdG9yKCk7XG5cbiAgICBjb25zdCBnaXN0ID0ge1xuICAgICAgJ2Rlc2NyaXB0aW9uJzogJ3RlbXAnLFxuICAgICAgJ3B1YmxpYyc6IHRydWUsXG4gICAgICAnZmlsZXMnOiB7XG4gICAgICAgICdkYXRhLmpzJzoge1xuICAgICAgICAgICdjb250ZW50JzogZGF0YUVkaXRvci5nZXRWYWx1ZSgpXG4gICAgICAgIH0sXG4gICAgICAgICdjb2RlLmpzJzoge1xuICAgICAgICAgICdjb250ZW50JzogY29kZUVkaXRvci5nZXRWYWx1ZSgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcG9zdEpTT04oJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vZ2lzdHMnLCBnaXN0KS50aGVuKCh7XG4gICAgICBpZFxuICAgIH0pID0+IHtcblxuICAgICAgY29uc3Qge1xuICAgICAgICBwcm90b2NvbCxcbiAgICAgICAgaG9zdCxcbiAgICAgICAgcGF0aG5hbWVcbiAgICAgIH0gPSBsb2NhdGlvbjtcblxuICAgICAgY29uc3QgdXJsID0gYCR7cHJvdG9jb2x9Ly8ke2hvc3R9JHtwYXRobmFtZX0/c2NyYXRjaC1wYXBlcj0ke2lkfWA7XG4gICAgICByZXNvbHZlKHVybCk7XG4gICAgfSk7XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFRyYWNlck1hbmFnZXIgPSByZXF1aXJlKCcuL21hbmFnZXInKTtcbmNvbnN0IFRyYWNlciA9IHJlcXVpcmUoJy4uL21vZHVsZS90cmFjZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgaW5pdCgpIHtcbiAgICBjb25zdCB0bSA9IG5ldyBUcmFjZXJNYW5hZ2VyKCk7XG4gICAgVHJhY2VyLnByb3RvdHlwZS5tYW5hZ2VyID0gdG07XG4gICAgcmV0dXJuIHRtO1xuICB9XG5cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBzdGVwTGltaXQgPSAxZTY7XG5cbmNvbnN0IFRyYWNlck1hbmFnZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy50aW1lciA9IG51bGw7XG4gIHRoaXMucGF1c2UgPSBmYWxzZTtcbiAgdGhpcy5jYXBzdWxlcyA9IFtdO1xuICB0aGlzLmludGVydmFsID0gNTAwO1xufTtcblxuVHJhY2VyTWFuYWdlci5wcm90b3R5cGUgPSB7XG5cbiAgYWRkKHRyYWNlcikge1xuXG4gICAgY29uc3QgJGNvbnRhaW5lciA9ICQoJzxzZWN0aW9uIGNsYXNzPVwibW9kdWxlX3dyYXBwZXJcIj4nKTtcbiAgICAkKCcubW9kdWxlX2NvbnRhaW5lcicpLmFwcGVuZCgkY29udGFpbmVyKTtcblxuICAgIGNvbnN0IGNhcHN1bGUgPSB7XG4gICAgICBtb2R1bGU6IHRyYWNlci5tb2R1bGUsXG4gICAgICB0cmFjZXIsXG4gICAgICBhbGxvY2F0ZWQ6IHRydWUsXG4gICAgICBkZWZhdWx0TmFtZTogbnVsbCxcbiAgICAgICRjb250YWluZXIsXG4gICAgICBpc05ldzogdHJ1ZVxuICAgIH07XG5cbiAgICB0aGlzLmNhcHN1bGVzLnB1c2goY2Fwc3VsZSk7XG4gICAgcmV0dXJuIGNhcHN1bGU7XG4gIH0sXG5cbiAgYWxsb2NhdGUobmV3VHJhY2VyKSB7XG4gICAgbGV0IHNlbGVjdGVkQ2Fwc3VsZSA9IG51bGw7XG4gICAgbGV0IGNvdW50ID0gMDtcblxuICAgICQuZWFjaCh0aGlzLmNhcHN1bGVzLCAoaSwgY2Fwc3VsZSkgPT4ge1xuICAgICAgaWYgKGNhcHN1bGUubW9kdWxlID09PSBuZXdUcmFjZXIubW9kdWxlKSB7XG4gICAgICAgIGNvdW50Kys7XG4gICAgICAgIGlmICghY2Fwc3VsZS5hbGxvY2F0ZWQpIHtcbiAgICAgICAgICBjYXBzdWxlLnRyYWNlciA9IG5ld1RyYWNlcjtcbiAgICAgICAgICBjYXBzdWxlLmFsbG9jYXRlZCA9IHRydWU7XG4gICAgICAgICAgY2Fwc3VsZS5pc05ldyA9IGZhbHNlO1xuICAgICAgICAgIHNlbGVjdGVkQ2Fwc3VsZSA9IGNhcHN1bGU7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoc2VsZWN0ZWRDYXBzdWxlID09PSBudWxsKSB7XG4gICAgICBjb3VudCsrO1xuICAgICAgc2VsZWN0ZWRDYXBzdWxlID0gdGhpcy5hZGQobmV3VHJhY2VyKTtcbiAgICB9XG5cbiAgICBzZWxlY3RlZENhcHN1bGUuZGVmYXVsdE5hbWUgPSBgJHtuZXdUcmFjZXIuY29uc3RydWN0b3IubmFtZX0gJHtjb3VudH1gO1xuICAgIHJldHVybiBzZWxlY3RlZENhcHN1bGU7XG4gIH0sXG5cbiAgZGVhbGxvY2F0ZUFsbCgpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgJC5lYWNoKHRoaXMuY2Fwc3VsZXMsIChpLCBjYXBzdWxlKSA9PiB7XG4gICAgICBjYXBzdWxlLmFsbG9jYXRlZCA9IGZhbHNlO1xuICAgIH0pO1xuICB9LFxuXG4gIHJlbW92ZVVuYWxsb2NhdGVkKCkge1xuICAgIGxldCBjaGFuZ2VkID0gZmFsc2U7XG5cbiAgICB0aGlzLmNhcHN1bGVzID0gJC5ncmVwKHRoaXMuY2Fwc3VsZXMsIChjYXBzdWxlKSA9PiB7XG4gICAgICBsZXQgcmVtb3ZlZCA9ICFjYXBzdWxlLmFsbG9jYXRlZDtcblxuICAgICAgaWYgKGNhcHN1bGUuaXNOZXcgfHwgcmVtb3ZlZCkge1xuICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICAgIGNhcHN1bGUuJGNvbnRhaW5lci5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICFyZW1vdmVkO1xuICAgIH0pO1xuXG4gICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgIHRoaXMucGxhY2UoKTtcbiAgICB9XG4gIH0sXG5cbiAgcGxhY2UoKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2Fwc3VsZXNcbiAgICB9ID0gdGhpcztcblxuICAgICQuZWFjaChjYXBzdWxlcywgKGksIGNhcHN1bGUpID0+IHtcbiAgICAgIGxldCB3aWR0aCA9IDEwMDtcbiAgICAgIGxldCBoZWlnaHQgPSAoMTAwIC8gY2Fwc3VsZXMubGVuZ3RoKTtcbiAgICAgIGxldCB0b3AgPSBoZWlnaHQgKiBpO1xuXG4gICAgICBjYXBzdWxlLiRjb250YWluZXIuY3NzKHtcbiAgICAgICAgdG9wOiBgJHt0b3B9JWAsXG4gICAgICAgIHdpZHRoOiBgJHt3aWR0aH0lYCxcbiAgICAgICAgaGVpZ2h0OiBgJHtoZWlnaHR9JWBcbiAgICAgIH0pO1xuXG4gICAgICBjYXBzdWxlLnRyYWNlci5yZXNpemUoKTtcbiAgICB9KTtcbiAgfSxcblxuICByZXNpemUoKSB7XG4gICAgdGhpcy5jb21tYW5kKCdyZXNpemUnKTtcbiAgfSxcblxuICBpc1BhdXNlKCkge1xuICAgIHJldHVybiB0aGlzLnBhdXNlO1xuICB9LFxuXG4gIHNldEludGVydmFsKGludGVydmFsKSB7XG4gICAgJCgnI2ludGVydmFsJykudmFsKGludGVydmFsKTtcbiAgfSxcblxuICByZXNldCgpIHtcbiAgICB0aGlzLnRyYWNlcyA9IFtdO1xuICAgIHRoaXMudHJhY2VJbmRleCA9IC0xO1xuICAgIHRoaXMuc3RlcENudCA9IDA7XG4gICAgaWYgKHRoaXMudGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcbiAgICB9XG4gICAgdGhpcy5jb21tYW5kKCdjbGVhcicpO1xuICB9LFxuXG4gIHB1c2hTdGVwKGNhcHN1bGUsIHN0ZXApIHtcbiAgICBpZiAodGhpcy5zdGVwQ250KysgPiBzdGVwTGltaXQpIHRocm93IFwiVHJhY2VyJ3Mgc3RhY2sgb3ZlcmZsb3dcIjtcbiAgICBsZXQgbGVuID0gdGhpcy50cmFjZXMubGVuZ3RoO1xuICAgIGxldCBsYXN0ID0gW107XG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgdGhpcy50cmFjZXMucHVzaChsYXN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGFzdCA9IHRoaXMudHJhY2VzW2xlbiAtIDFdO1xuICAgIH1cbiAgICBsYXN0LnB1c2goJC5leHRlbmQoc3RlcCwge1xuICAgICAgY2Fwc3VsZVxuICAgIH0pKTtcbiAgfSxcblxuICBuZXdTdGVwKCkge1xuICAgIHRoaXMudHJhY2VzLnB1c2goW10pO1xuICB9LFxuXG4gIHBhdXNlU3RlcCgpIHtcbiAgICBpZiAodGhpcy50cmFjZUluZGV4IDwgMCkgcmV0dXJuO1xuICAgIHRoaXMucGF1c2UgPSB0cnVlO1xuICAgIGlmICh0aGlzLnRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgfVxuICAgICQoJyNidG5fcGF1c2UnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gIH0sXG5cbiAgcmVzdW1lU3RlcCgpIHtcbiAgICB0aGlzLnBhdXNlID0gZmFsc2U7XG4gICAgdGhpcy5zdGVwKHRoaXMudHJhY2VJbmRleCArIDEpO1xuICAgICQoJyNidG5fcGF1c2UnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gIH0sXG5cbiAgc3RlcChpLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB0cmFjZXIgPSB0aGlzO1xuXG4gICAgaWYgKGlzTmFOKGkpIHx8IGkgPj0gdGhpcy50cmFjZXMubGVuZ3RoIHx8IGkgPCAwKSByZXR1cm47XG5cbiAgICB0aGlzLnRyYWNlSW5kZXggPSBpO1xuICAgIGNvbnN0IHRyYWNlID0gdGhpcy50cmFjZXNbaV07XG4gICAgdHJhY2UuZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgc3RlcC5jYXBzdWxlLnRyYWNlci5wcm9jZXNzU3RlcChzdGVwLCBvcHRpb25zKTtcbiAgICB9KTtcblxuICAgIGlmICghb3B0aW9ucy52aXJ0dWFsKSB7XG4gICAgICB0aGlzLmNvbW1hbmQoJ3JlZnJlc2gnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXVzZSkgcmV0dXJuO1xuXG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdHJhY2VyLnN0ZXAoaSArIDEsIG9wdGlvbnMpO1xuICAgIH0sIHRoaXMuaW50ZXJ2YWwpO1xuICB9LFxuXG4gIHByZXZTdGVwKCkge1xuICAgIHRoaXMuY29tbWFuZCgnY2xlYXInKTtcblxuICAgIGNvbnN0IGZpbmFsSW5kZXggPSB0aGlzLnRyYWNlSW5kZXggLSAxO1xuICAgIGlmIChmaW5hbEluZGV4IDwgMCkge1xuICAgICAgdGhpcy50cmFjZUluZGV4ID0gLTE7XG4gICAgICB0aGlzLmNvbW1hbmQoJ3JlZnJlc2gnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbmFsSW5kZXg7IGkrKykge1xuICAgICAgdGhpcy5zdGVwKGksIHtcbiAgICAgICAgdmlydHVhbDogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGVwKGZpbmFsSW5kZXgpO1xuICB9LFxuXG4gIG5leHRTdGVwKCkge1xuICAgIHRoaXMuc3RlcCh0aGlzLnRyYWNlSW5kZXggKyAxKTtcbiAgfSxcblxuICB2aXN1YWxpemUoKSB7XG4gICAgdGhpcy50cmFjZUluZGV4ID0gLTE7XG4gICAgdGhpcy5yZXN1bWVTdGVwKCk7XG4gIH0sXG5cbiAgY29tbWFuZCguLi5hcmdzKSB7XG4gICAgY29uc3QgZnVuY3Rpb25OYW1lID0gYXJncy5zaGlmdCgpO1xuICAgICQuZWFjaCh0aGlzLmNhcHN1bGVzLCAoaSwgY2Fwc3VsZSkgPT4ge1xuICAgICAgaWYgKGNhcHN1bGUuYWxsb2NhdGVkKSB7XG4gICAgICAgIGNhcHN1bGUudHJhY2VyLm1vZHVsZS5wcm90b3R5cGVbZnVuY3Rpb25OYW1lXS5hcHBseShjYXBzdWxlLnRyYWNlciwgYXJncyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgZmluZE93bmVyKGNvbnRhaW5lcikge1xuICAgIGxldCBzZWxlY3RlZENhcHN1bGUgPSBudWxsO1xuICAgICQuZWFjaCh0aGlzLmNhcHN1bGVzLCAoaSwgY2Fwc3VsZSkgPT4ge1xuICAgICAgaWYgKGNhcHN1bGUuJGNvbnRhaW5lclswXSA9PT0gY29udGFpbmVyKSB7XG4gICAgICAgIHNlbGVjdGVkQ2Fwc3VsZSA9IGNhcHN1bGU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc2VsZWN0ZWRDYXBzdWxlLnRyYWNlcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZXJNYW5hZ2VyOyIsImNvbnN0IHtcbiAgcGFyc2Vcbn0gPSBKU09OO1xuXG5jb25zdCBmcm9tSlNPTiA9IChvYmopID0+IHtcbiAgcmV0dXJuIHBhcnNlKG9iaiwgKGtleSwgdmFsdWUpID0+IHtcbiAgICByZXR1cm4gdmFsdWUgPT09ICdJbmZpbml0eScgPyBJbmZpbml0eSA6IHZhbHVlO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnJvbUpTT047IiwiY29uc3QgdG9KU09OID0gcmVxdWlyZSgnLi90b19qc29uJyk7XG5jb25zdCBmcm9tSlNPTiA9IHJlcXVpcmUoJy4vZnJvbV9qc29uJyk7XG5jb25zdCByZWZpbmVCeVR5cGUgPSByZXF1aXJlKCcuL3JlZmluZV9ieV90eXBlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB0b0pTT04sXG4gIGZyb21KU09OLFxuICByZWZpbmVCeVR5cGVcbn07IiwiY29uc3QgcmVmaW5lQnlUeXBlID0gKGl0ZW0pID0+IHtcbiAgcmV0dXJuIHR5cGVvZihpdGVtKSA9PT0gJ251bWJlcicgPyByZWZpbmVOdW1iZXIoaXRlbSkgOiByZWZpbmVTdHJpbmcoaXRlbSk7XG59O1xuXG5jb25zdCByZWZpbmVTdHJpbmcgPSAoc3RyKSA9PiB7XG4gIHJldHVybiBzdHIgPT09ICcnID8gJyAnIDogc3RyO1xufTtcblxuY29uc3QgcmVmaW5lTnVtYmVyID0gKG51bSkgPT4ge1xuICByZXR1cm4gbnVtID09PSBJbmZpbml0eSA/ICfiiJ4nIDogbnVtO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSByZWZpbmVCeVR5cGU7IiwiY29uc3Qge1xuICBzdHJpbmdpZnlcbn0gPSBKU09OO1xuXG5jb25zdCB0b0pTT04gPSAob2JqKSA9PiB7XG4gIHJldHVybiBzdHJpbmdpZnkob2JqLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gSW5maW5pdHkgPyAnSW5maW5pdHknIDogdmFsdWU7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0b0pTT047IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBpc1NjcmF0Y2hQYXBlciA9IChjYXRlZ29yeSwgYWxnb3JpdGhtKSA9PiB7XG4gIHJldHVybiBjYXRlZ29yeSA9PT0gbnVsbCAmJiBhbGdvcml0aG0gPT09ICdzY3JhdGNoX3BhcGVyJztcbn07XG5cbmNvbnN0IGdldEFsZ29yaXRobURpciA9IChjYXRlZ29yeSwgYWxnb3JpdGhtKSA9PiB7XG4gIGlmIChpc1NjcmF0Y2hQYXBlcihjYXRlZ29yeSwgYWxnb3JpdGhtKSkge1xuICAgIHJldHVybiAnLi9hbGdvcml0aG0vc2NyYXRjaF9wYXBlci8nO1xuICB9XG4gIHJldHVybiBgLi9hbGdvcml0aG0vJHtjYXRlZ29yeX0vJHthbGdvcml0aG19L2A7XG59O1xuXG5jb25zdCBnZXRGaWxlRGlyID0gKGNhdGVnb3J5LCBhbGdvcml0aG0sIGZpbGUpID0+IHtcbiAgaWYgKGlzU2NyYXRjaFBhcGVyKGNhdGVnb3J5LCBhbGdvcml0aG0pKSB7XG4gICAgcmV0dXJuICcuL2FsZ29yaXRobS9zY3JhdGNoX3BhcGVyLyc7XG4gIH1cblxuICByZXR1cm4gYC4vYWxnb3JpdGhtLyR7Y2F0ZWdvcnl9LyR7YWxnb3JpdGhtfS8ke2ZpbGV9L2A7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNTY3JhdGNoUGFwZXIsXG4gIGdldEFsZ29yaXRobURpcixcbiAgZ2V0RmlsZURpclxufTsiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8qIVxuICogQG92ZXJ2aWV3IFJTVlAgLSBhIHRpbnkgaW1wbGVtZW50YXRpb24gb2YgUHJvbWlzZXMvQSsuXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNCBZZWh1ZGEgS2F0eiwgVG9tIERhbGUsIFN0ZWZhbiBQZW5uZXIgYW5kIGNvbnRyaWJ1dG9yc1xuICogQGxpY2Vuc2UgICBMaWNlbnNlZCB1bmRlciBNSVQgbGljZW5zZVxuICogICAgICAgICAgICBTZWUgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3RpbGRlaW8vcnN2cC5qcy9tYXN0ZXIvTElDRU5TRVxuICogQHZlcnNpb24gICAzLjIuMVxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCR1dGlscyQkb2JqZWN0T3JGdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbicgfHwgKHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCR1dGlscyQkaXNGdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkdXRpbHMkJGlzTWF5YmVUaGVuYWJsZSh4KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJHV0aWxzJCRfaXNBcnJheTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkpIHtcbiAgICAgIGxpYiRyc3ZwJHV0aWxzJCRfaXNBcnJheSA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBsaWIkcnN2cCR1dGlscyQkX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCR1dGlscyQkaXNBcnJheSA9IGxpYiRyc3ZwJHV0aWxzJCRfaXNBcnJheTtcblxuICAgIHZhciBsaWIkcnN2cCR1dGlscyQkbm93ID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24oKSB7IHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTsgfTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHV0aWxzJCRGKCkgeyB9XG5cbiAgICB2YXIgbGliJHJzdnAkdXRpbHMkJG9fY3JlYXRlID0gKE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gKG8pIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NlY29uZCBhcmd1bWVudCBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIG8gIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYW4gb2JqZWN0Jyk7XG4gICAgICB9XG4gICAgICBsaWIkcnN2cCR1dGlscyQkRi5wcm90b3R5cGUgPSBvO1xuICAgICAgcmV0dXJuIG5ldyBsaWIkcnN2cCR1dGlscyQkRigpO1xuICAgIH0pO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGV2ZW50cyQkaW5kZXhPZihjYWxsYmFja3MsIGNhbGxiYWNrKSB7XG4gICAgICBmb3IgKHZhciBpPTAsIGw9Y2FsbGJhY2tzLmxlbmd0aDsgaTxsOyBpKyspIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrc1tpXSA9PT0gY2FsbGJhY2spIHsgcmV0dXJuIGk7IH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGV2ZW50cyQkY2FsbGJhY2tzRm9yKG9iamVjdCkge1xuICAgICAgdmFyIGNhbGxiYWNrcyA9IG9iamVjdC5fcHJvbWlzZUNhbGxiYWNrcztcblxuICAgICAgaWYgKCFjYWxsYmFja3MpIHtcbiAgICAgICAgY2FsbGJhY2tzID0gb2JqZWN0Ll9wcm9taXNlQ2FsbGJhY2tzID0ge307XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjYWxsYmFja3M7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJGV2ZW50cyQkZGVmYXVsdCA9IHtcblxuICAgICAgLyoqXG4gICAgICAgIGBSU1ZQLkV2ZW50VGFyZ2V0Lm1peGluYCBleHRlbmRzIGFuIG9iamVjdCB3aXRoIEV2ZW50VGFyZ2V0IG1ldGhvZHMuIEZvclxuICAgICAgICBFeGFtcGxlOlxuXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgdmFyIG9iamVjdCA9IHt9O1xuXG4gICAgICAgIFJTVlAuRXZlbnRUYXJnZXQubWl4aW4ob2JqZWN0KTtcblxuICAgICAgICBvYmplY3Qub24oJ2ZpbmlzaGVkJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAvLyBoYW5kbGUgZXZlbnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ2ZpbmlzaGVkJywgeyBkZXRhaWw6IHZhbHVlIH0pO1xuICAgICAgICBgYGBcblxuICAgICAgICBgRXZlbnRUYXJnZXQubWl4aW5gIGFsc28gd29ya3Mgd2l0aCBwcm90b3R5cGVzOlxuXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgdmFyIFBlcnNvbiA9IGZ1bmN0aW9uKCkge307XG4gICAgICAgIFJTVlAuRXZlbnRUYXJnZXQubWl4aW4oUGVyc29uLnByb3RvdHlwZSk7XG5cbiAgICAgICAgdmFyIHllaHVkYSA9IG5ldyBQZXJzb24oKTtcbiAgICAgICAgdmFyIHRvbSA9IG5ldyBQZXJzb24oKTtcblxuICAgICAgICB5ZWh1ZGEub24oJ3Bva2UnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdZZWh1ZGEgc2F5cyBPVycpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0b20ub24oJ3Bva2UnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdUb20gc2F5cyBPVycpO1xuICAgICAgICB9KTtcblxuICAgICAgICB5ZWh1ZGEudHJpZ2dlcigncG9rZScpO1xuICAgICAgICB0b20udHJpZ2dlcigncG9rZScpO1xuICAgICAgICBgYGBcblxuICAgICAgICBAbWV0aG9kIG1peGluXG4gICAgICAgIEBmb3IgUlNWUC5FdmVudFRhcmdldFxuICAgICAgICBAcHJpdmF0ZVxuICAgICAgICBAcGFyYW0ge09iamVjdH0gb2JqZWN0IG9iamVjdCB0byBleHRlbmQgd2l0aCBFdmVudFRhcmdldCBtZXRob2RzXG4gICAgICAqL1xuICAgICAgJ21peGluJzogZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgIG9iamVjdFsnb24nXSAgICAgID0gdGhpc1snb24nXTtcbiAgICAgICAgb2JqZWN0WydvZmYnXSAgICAgPSB0aGlzWydvZmYnXTtcbiAgICAgICAgb2JqZWN0Wyd0cmlnZ2VyJ10gPSB0aGlzWyd0cmlnZ2VyJ107XG4gICAgICAgIG9iamVjdC5fcHJvbWlzZUNhbGxiYWNrcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSBleGVjdXRlZCB3aGVuIGBldmVudE5hbWVgIGlzIHRyaWdnZXJlZFxuXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgb2JqZWN0Lm9uKCdldmVudCcsIGZ1bmN0aW9uKGV2ZW50SW5mbyl7XG4gICAgICAgICAgLy8gaGFuZGxlIHRoZSBldmVudFxuICAgICAgICB9KTtcblxuICAgICAgICBvYmplY3QudHJpZ2dlcignZXZlbnQnKTtcbiAgICAgICAgYGBgXG5cbiAgICAgICAgQG1ldGhvZCBvblxuICAgICAgICBAZm9yIFJTVlAuRXZlbnRUYXJnZXRcbiAgICAgICAgQHByaXZhdGVcbiAgICAgICAgQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBuYW1lIG9mIHRoZSBldmVudCB0byBsaXN0ZW4gZm9yXG4gICAgICAgIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAgICAqL1xuICAgICAgJ29uJzogZnVuY3Rpb24oZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWxsQ2FsbGJhY2tzID0gbGliJHJzdnAkZXZlbnRzJCRjYWxsYmFja3NGb3IodGhpcyksIGNhbGxiYWNrcztcblxuICAgICAgICBjYWxsYmFja3MgPSBhbGxDYWxsYmFja3NbZXZlbnROYW1lXTtcblxuICAgICAgICBpZiAoIWNhbGxiYWNrcykge1xuICAgICAgICAgIGNhbGxiYWNrcyA9IGFsbENhbGxiYWNrc1tldmVudE5hbWVdID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGliJHJzdnAkZXZlbnRzJCRpbmRleE9mKGNhbGxiYWNrcywgY2FsbGJhY2spID09PSAtMSkge1xuICAgICAgICAgIGNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgIFlvdSBjYW4gdXNlIGBvZmZgIHRvIHN0b3AgZmlyaW5nIGEgcGFydGljdWxhciBjYWxsYmFjayBmb3IgYW4gZXZlbnQ6XG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICBmdW5jdGlvbiBkb1N0dWZmKCkgeyAvLyBkbyBzdHVmZiEgfVxuICAgICAgICBvYmplY3Qub24oJ3N0dWZmJywgZG9TdHVmZik7XG5cbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ3N0dWZmJyk7IC8vIGRvU3R1ZmYgd2lsbCBiZSBjYWxsZWRcblxuICAgICAgICAvLyBVbnJlZ2lzdGVyIE9OTFkgdGhlIGRvU3R1ZmYgY2FsbGJhY2tcbiAgICAgICAgb2JqZWN0Lm9mZignc3R1ZmYnLCBkb1N0dWZmKTtcbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ3N0dWZmJyk7IC8vIGRvU3R1ZmYgd2lsbCBOT1QgYmUgY2FsbGVkXG4gICAgICAgIGBgYFxuXG4gICAgICAgIElmIHlvdSBkb24ndCBwYXNzIGEgYGNhbGxiYWNrYCBhcmd1bWVudCB0byBgb2ZmYCwgQUxMIGNhbGxiYWNrcyBmb3IgdGhlXG4gICAgICAgIGV2ZW50IHdpbGwgbm90IGJlIGV4ZWN1dGVkIHdoZW4gdGhlIGV2ZW50IGZpcmVzLiBGb3IgZXhhbXBsZTpcblxuICAgICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICAgIHZhciBjYWxsYmFjazEgPSBmdW5jdGlvbigpe307XG4gICAgICAgIHZhciBjYWxsYmFjazIgPSBmdW5jdGlvbigpe307XG5cbiAgICAgICAgb2JqZWN0Lm9uKCdzdHVmZicsIGNhbGxiYWNrMSk7XG4gICAgICAgIG9iamVjdC5vbignc3R1ZmYnLCBjYWxsYmFjazIpO1xuXG4gICAgICAgIG9iamVjdC50cmlnZ2VyKCdzdHVmZicpOyAvLyBjYWxsYmFjazEgYW5kIGNhbGxiYWNrMiB3aWxsIGJlIGV4ZWN1dGVkLlxuXG4gICAgICAgIG9iamVjdC5vZmYoJ3N0dWZmJyk7XG4gICAgICAgIG9iamVjdC50cmlnZ2VyKCdzdHVmZicpOyAvLyBjYWxsYmFjazEgYW5kIGNhbGxiYWNrMiB3aWxsIG5vdCBiZSBleGVjdXRlZCFcbiAgICAgICAgYGBgXG5cbiAgICAgICAgQG1ldGhvZCBvZmZcbiAgICAgICAgQGZvciBSU1ZQLkV2ZW50VGFyZ2V0XG4gICAgICAgIEBwcml2YXRlXG4gICAgICAgIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgZXZlbnQgdG8gc3RvcCBsaXN0ZW5pbmcgdG9cbiAgICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgb3B0aW9uYWwgYXJndW1lbnQuIElmIGdpdmVuLCBvbmx5IHRoZSBmdW5jdGlvblxuICAgICAgICBnaXZlbiB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgZXZlbnQncyBjYWxsYmFjayBxdWV1ZS4gSWYgbm8gYGNhbGxiYWNrYFxuICAgICAgICBhcmd1bWVudCBpcyBnaXZlbiwgYWxsIGNhbGxiYWNrcyB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgZXZlbnQncyBjYWxsYmFja1xuICAgICAgICBxdWV1ZS5cbiAgICAgICovXG4gICAgICAnb2ZmJzogZnVuY3Rpb24oZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgYWxsQ2FsbGJhY2tzID0gbGliJHJzdnAkZXZlbnRzJCRjYWxsYmFja3NGb3IodGhpcyksIGNhbGxiYWNrcywgaW5kZXg7XG5cbiAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgIGFsbENhbGxiYWNrc1tldmVudE5hbWVdID0gW107XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2tzID0gYWxsQ2FsbGJhY2tzW2V2ZW50TmFtZV07XG5cbiAgICAgICAgaW5kZXggPSBsaWIkcnN2cCRldmVudHMkJGluZGV4T2YoY2FsbGJhY2tzLCBjYWxsYmFjayk7XG5cbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkgeyBjYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTsgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgIFVzZSBgdHJpZ2dlcmAgdG8gZmlyZSBjdXN0b20gZXZlbnRzLiBGb3IgZXhhbXBsZTpcblxuICAgICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICAgIG9iamVjdC5vbignZm9vJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZm9vIGV2ZW50IGhhcHBlbmVkIScpO1xuICAgICAgICB9KTtcbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ2ZvbycpO1xuICAgICAgICAvLyAnZm9vIGV2ZW50IGhhcHBlbmVkIScgbG9nZ2VkIHRvIHRoZSBjb25zb2xlXG4gICAgICAgIGBgYFxuXG4gICAgICAgIFlvdSBjYW4gYWxzbyBwYXNzIGEgdmFsdWUgYXMgYSBzZWNvbmQgYXJndW1lbnQgdG8gYHRyaWdnZXJgIHRoYXQgd2lsbCBiZVxuICAgICAgICBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gYWxsIGV2ZW50IGxpc3RlbmVycyBmb3IgdGhlIGV2ZW50OlxuXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgb2JqZWN0Lm9uKCdmb28nLCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgY29uc29sZS5sb2codmFsdWUubmFtZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG9iamVjdC50cmlnZ2VyKCdmb28nLCB7IG5hbWU6ICdiYXInIH0pO1xuICAgICAgICAvLyAnYmFyJyBsb2dnZWQgdG8gdGhlIGNvbnNvbGVcbiAgICAgICAgYGBgXG5cbiAgICAgICAgQG1ldGhvZCB0cmlnZ2VyXG4gICAgICAgIEBmb3IgUlNWUC5FdmVudFRhcmdldFxuICAgICAgICBAcHJpdmF0ZVxuICAgICAgICBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIG5hbWUgb2YgdGhlIGV2ZW50IHRvIGJlIHRyaWdnZXJlZFxuICAgICAgICBAcGFyYW0geyp9IG9wdGlvbnMgb3B0aW9uYWwgdmFsdWUgdG8gYmUgcGFzc2VkIHRvIGFueSBldmVudCBoYW5kbGVycyBmb3JcbiAgICAgICAgdGhlIGdpdmVuIGBldmVudE5hbWVgXG4gICAgICAqL1xuICAgICAgJ3RyaWdnZXInOiBmdW5jdGlvbihldmVudE5hbWUsIG9wdGlvbnMsIGxhYmVsKSB7XG4gICAgICAgIHZhciBhbGxDYWxsYmFja3MgPSBsaWIkcnN2cCRldmVudHMkJGNhbGxiYWNrc0Zvcih0aGlzKSwgY2FsbGJhY2tzLCBjYWxsYmFjaztcblxuICAgICAgICBpZiAoY2FsbGJhY2tzID0gYWxsQ2FsbGJhY2tzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAvLyBEb24ndCBjYWNoZSB0aGUgY2FsbGJhY2tzLmxlbmd0aCBzaW5jZSBpdCBtYXkgZ3Jvd1xuICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2tzW2ldO1xuXG4gICAgICAgICAgICBjYWxsYmFjayhvcHRpb25zLCBsYWJlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBsaWIkcnN2cCRjb25maWckJGNvbmZpZyA9IHtcbiAgICAgIGluc3RydW1lbnQ6IGZhbHNlXG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGV2ZW50cyQkZGVmYXVsdFsnbWl4aW4nXShsaWIkcnN2cCRjb25maWckJGNvbmZpZyk7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRjb25maWckJGNvbmZpZ3VyZShuYW1lLCB2YWx1ZSkge1xuICAgICAgaWYgKG5hbWUgPT09ICdvbmVycm9yJykge1xuICAgICAgICAvLyBoYW5kbGUgZm9yIGxlZ2FjeSB1c2VycyB0aGF0IGV4cGVjdCB0aGUgYWN0dWFsXG4gICAgICAgIC8vIGVycm9yIHRvIGJlIHBhc3NlZCB0byB0aGVpciBmdW5jdGlvbiBhZGRlZCB2aWFcbiAgICAgICAgLy8gYFJTVlAuY29uZmlndXJlKCdvbmVycm9yJywgc29tZUZ1bmN0aW9uSGVyZSk7YFxuICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1snb24nXSgnZXJyb3InLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWdbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1tuYW1lXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkaW5zdHJ1bWVudCQkcXVldWUgPSBbXTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGluc3RydW1lbnQkJHNjaGVkdWxlRmx1c2goKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZW50cnk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGliJHJzdnAkaW5zdHJ1bWVudCQkcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBlbnRyeSA9IGxpYiRyc3ZwJGluc3RydW1lbnQkJHF1ZXVlW2ldO1xuXG4gICAgICAgICAgdmFyIHBheWxvYWQgPSBlbnRyeS5wYXlsb2FkO1xuXG4gICAgICAgICAgcGF5bG9hZC5ndWlkID0gcGF5bG9hZC5rZXkgKyBwYXlsb2FkLmlkO1xuICAgICAgICAgIHBheWxvYWQuY2hpbGRHdWlkID0gcGF5bG9hZC5rZXkgKyBwYXlsb2FkLmNoaWxkSWQ7XG4gICAgICAgICAgaWYgKHBheWxvYWQuZXJyb3IpIHtcbiAgICAgICAgICAgIHBheWxvYWQuc3RhY2sgPSBwYXlsb2FkLmVycm9yLnN0YWNrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnWyd0cmlnZ2VyJ10oZW50cnkubmFtZSwgZW50cnkucGF5bG9hZCk7XG4gICAgICAgIH1cbiAgICAgICAgbGliJHJzdnAkaW5zdHJ1bWVudCQkcXVldWUubGVuZ3RoID0gMDtcbiAgICAgIH0sIDUwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRpbnN0cnVtZW50JCRpbnN0cnVtZW50KGV2ZW50TmFtZSwgcHJvbWlzZSwgY2hpbGQpIHtcbiAgICAgIGlmICgxID09PSBsaWIkcnN2cCRpbnN0cnVtZW50JCRxdWV1ZS5wdXNoKHtcbiAgICAgICAgbmFtZTogZXZlbnROYW1lLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAga2V5OiBwcm9taXNlLl9ndWlkS2V5LFxuICAgICAgICAgIGlkOiAgcHJvbWlzZS5faWQsXG4gICAgICAgICAgZXZlbnROYW1lOiBldmVudE5hbWUsXG4gICAgICAgICAgZGV0YWlsOiBwcm9taXNlLl9yZXN1bHQsXG4gICAgICAgICAgY2hpbGRJZDogY2hpbGQgJiYgY2hpbGQuX2lkLFxuICAgICAgICAgIGxhYmVsOiBwcm9taXNlLl9sYWJlbCxcbiAgICAgICAgICB0aW1lU3RhbXA6IGxpYiRyc3ZwJHV0aWxzJCRub3coKSxcbiAgICAgICAgICBlcnJvcjogbGliJHJzdnAkY29uZmlnJCRjb25maWdbXCJpbnN0cnVtZW50LXdpdGgtc3RhY2tcIl0gPyBuZXcgRXJyb3IocHJvbWlzZS5fbGFiZWwpIDogbnVsbFxuICAgICAgICB9fSkpIHtcbiAgICAgICAgICBsaWIkcnN2cCRpbnN0cnVtZW50JCRzY2hlZHVsZUZsdXNoKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB2YXIgbGliJHJzdnAkaW5zdHJ1bWVudCQkZGVmYXVsdCA9IGxpYiRyc3ZwJGluc3RydW1lbnQkJGluc3RydW1lbnQ7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkdGhlbiQkdGhlbihvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbiwgbGFiZWwpIHtcbiAgICAgIHZhciBwYXJlbnQgPSB0aGlzO1xuICAgICAgdmFyIHN0YXRlID0gcGFyZW50Ll9zdGF0ZTtcblxuICAgICAgaWYgKHN0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCAmJiAhb25GdWxmaWxsbWVudCB8fCBzdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRSRUpFQ1RFRCAmJiAhb25SZWplY3Rpb24pIHtcbiAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuaW5zdHJ1bWVudCAmJiBsaWIkcnN2cCRpbnN0cnVtZW50JCRkZWZhdWx0KCdjaGFpbmVkJywgcGFyZW50LCBwYXJlbnQpO1xuICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgfVxuXG4gICAgICBwYXJlbnQuX29uRXJyb3IgPSBudWxsO1xuXG4gICAgICB2YXIgY2hpbGQgPSBuZXcgcGFyZW50LmNvbnN0cnVjdG9yKGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCwgbGFiZWwpO1xuICAgICAgdmFyIHJlc3VsdCA9IHBhcmVudC5fcmVzdWx0O1xuXG4gICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5pbnN0cnVtZW50ICYmIGxpYiRyc3ZwJGluc3RydW1lbnQkJGRlZmF1bHQoJ2NoYWluZWQnLCBwYXJlbnQsIGNoaWxkKTtcblxuICAgICAgaWYgKHN0YXRlKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50c1tzdGF0ZSAtIDFdO1xuICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hc3luYyhmdW5jdGlvbigpe1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaW52b2tlQ2FsbGJhY2soc3RhdGUsIGNoaWxkLCBjYWxsYmFjaywgcmVzdWx0KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHRoZW4kJGRlZmF1bHQgPSBsaWIkcnN2cCR0aGVuJCR0aGVuO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkcmVzb2x2ZSQkcmVzb2x2ZShvYmplY3QsIGxhYmVsKSB7XG4gICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuICAgICAgaWYgKG9iamVjdCAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QuY29uc3RydWN0b3IgPT09IENvbnN0cnVjdG9yKSB7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICB9XG5cbiAgICAgIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCwgbGFiZWwpO1xuICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIG9iamVjdCk7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdCA9IGxpYiRyc3ZwJHByb21pc2UkcmVzb2x2ZSQkcmVzb2x2ZTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRlbnVtZXJhdG9yJCRtYWtlU2V0dGxlZFJlc3VsdChzdGF0ZSwgcG9zaXRpb24sIHZhbHVlKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdGU6ICdmdWxmaWxsZWQnLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdGU6ICdyZWplY3RlZCcsXG4gICAgICAgICAgcmVhc29uOiB2YWx1ZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IoQ29uc3RydWN0b3IsIGlucHV0LCBhYm9ydE9uUmVqZWN0LCBsYWJlbCkge1xuICAgICAgdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvciA9IENvbnN0cnVjdG9yO1xuICAgICAgdGhpcy5wcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCwgbGFiZWwpO1xuICAgICAgdGhpcy5fYWJvcnRPblJlamVjdCA9IGFib3J0T25SZWplY3Q7XG5cbiAgICAgIGlmICh0aGlzLl92YWxpZGF0ZUlucHV0KGlucHV0KSkge1xuICAgICAgICB0aGlzLl9pbnB1dCAgICAgPSBpbnB1dDtcbiAgICAgICAgdGhpcy5sZW5ndGggICAgID0gaW5wdXQubGVuZ3RoO1xuICAgICAgICB0aGlzLl9yZW1haW5pbmcgPSBpbnB1dC5sZW5ndGg7XG5cbiAgICAgICAgdGhpcy5faW5pdCgpO1xuXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLmxlbmd0aCB8fCAwO1xuICAgICAgICAgIHRoaXMuX2VudW1lcmF0ZSgpO1xuICAgICAgICAgIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdCh0aGlzLnByb21pc2UsIHRoaXMuX3ZhbGlkYXRpb25FcnJvcigpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkZW51bWVyYXRvciQkZGVmYXVsdCA9IGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3I7XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fdmFsaWRhdGVJbnB1dCA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkdXRpbHMkJGlzQXJyYXkoaW5wdXQpO1xuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fdmFsaWRhdGlvbkVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdBcnJheSBNZXRob2RzIG11c3QgYmUgcHJvdmlkZWQgYW4gQXJyYXknKTtcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX3Jlc3VsdCA9IG5ldyBBcnJheSh0aGlzLmxlbmd0aCk7XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9lbnVtZXJhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsZW5ndGggICAgID0gdGhpcy5sZW5ndGg7XG4gICAgICB2YXIgcHJvbWlzZSAgICA9IHRoaXMucHJvbWlzZTtcbiAgICAgIHZhciBpbnB1dCAgICAgID0gdGhpcy5faW5wdXQ7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBwcm9taXNlLl9zdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HICYmIGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLl9lYWNoRW50cnkoaW5wdXRbaV0sIGkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fc2V0dGxlTWF5YmVUaGVuYWJsZSA9IGZ1bmN0aW9uKGVudHJ5LCBpKSB7XG4gICAgICB2YXIgYyA9IHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3I7XG4gICAgICB2YXIgcmVzb2x2ZSA9IGMucmVzb2x2ZTtcblxuICAgICAgaWYgKHJlc29sdmUgPT09IGxpYiRyc3ZwJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdCkge1xuICAgICAgICB2YXIgdGhlbiA9IGxpYiRyc3ZwJCRpbnRlcm5hbCQkZ2V0VGhlbihlbnRyeSk7XG5cbiAgICAgICAgaWYgKHRoZW4gPT09IGxpYiRyc3ZwJHRoZW4kJGRlZmF1bHQgJiZcbiAgICAgICAgICAgIGVudHJ5Ll9zdGF0ZSAhPT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HKSB7XG4gICAgICAgICAgZW50cnkuX29uRXJyb3IgPSBudWxsO1xuICAgICAgICAgIHRoaXMuX3NldHRsZWRBdChlbnRyeS5fc3RhdGUsIGksIGVudHJ5Ll9yZXN1bHQpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGVuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhpcy5fcmVtYWluaW5nLS07XG4gICAgICAgICAgdGhpcy5fcmVzdWx0W2ldID0gdGhpcy5fbWFrZVJlc3VsdChsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCwgaSwgZW50cnkpO1xuICAgICAgICB9IGVsc2UgaWYgKGMgPT09IGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQpIHtcbiAgICAgICAgICB2YXIgcHJvbWlzZSA9IG5ldyBjKGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCk7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIGVudHJ5LCB0aGVuKTtcbiAgICAgICAgICB0aGlzLl93aWxsU2V0dGxlQXQocHJvbWlzZSwgaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KG5ldyBjKGZ1bmN0aW9uKHJlc29sdmUpIHsgcmVzb2x2ZShlbnRyeSk7IH0pLCBpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KHJlc29sdmUoZW50cnkpLCBpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX2VhY2hFbnRyeSA9IGZ1bmN0aW9uKGVudHJ5LCBpKSB7XG4gICAgICBpZiAobGliJHJzdnAkdXRpbHMkJGlzTWF5YmVUaGVuYWJsZShlbnRyeSkpIHtcbiAgICAgICAgdGhpcy5fc2V0dGxlTWF5YmVUaGVuYWJsZShlbnRyeSwgaSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZW1haW5pbmctLTtcbiAgICAgICAgdGhpcy5fcmVzdWx0W2ldID0gdGhpcy5fbWFrZVJlc3VsdChsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCwgaSwgZW50cnkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fc2V0dGxlZEF0ID0gZnVuY3Rpb24oc3RhdGUsIGksIHZhbHVlKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IHRoaXMucHJvbWlzZTtcblxuICAgICAgaWYgKHByb21pc2UuX3N0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcpIHtcbiAgICAgICAgdGhpcy5fcmVtYWluaW5nLS07XG5cbiAgICAgICAgaWYgKHRoaXMuX2Fib3J0T25SZWplY3QgJiYgc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURUQpIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fcmVzdWx0W2ldID0gdGhpcy5fbWFrZVJlc3VsdChzdGF0ZSwgaSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9tYWtlUmVzdWx0ID0gZnVuY3Rpb24oc3RhdGUsIGksIHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl93aWxsU2V0dGxlQXQgPSBmdW5jdGlvbihwcm9taXNlLCBpKSB7XG4gICAgICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG5cbiAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHByb21pc2UsIHVuZGVmaW5lZCwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgZW51bWVyYXRvci5fc2V0dGxlZEF0KGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVELCBpLCB2YWx1ZSk7XG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgZW51bWVyYXRvci5fc2V0dGxlZEF0KGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURUQsIGksIHJlYXNvbik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkYWxsJCRhbGwoZW50cmllcywgbGFiZWwpIHtcbiAgICAgIHJldHVybiBuZXcgbGliJHJzdnAkZW51bWVyYXRvciQkZGVmYXVsdCh0aGlzLCBlbnRyaWVzLCB0cnVlIC8qIGFib3J0IG9uIHJlamVjdCAqLywgbGFiZWwpLnByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJGFsbCQkZGVmYXVsdCA9IGxpYiRyc3ZwJHByb21pc2UkYWxsJCRhbGw7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcHJvbWlzZSRyYWNlJCRyYWNlKGVudHJpZXMsIGxhYmVsKSB7XG4gICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuICAgICAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3IobGliJHJzdnAkJGludGVybmFsJCRub29wLCBsYWJlbCk7XG5cbiAgICAgIGlmICghbGliJHJzdnAkdXRpbHMkJGlzQXJyYXkoZW50cmllcykpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhbiBhcnJheSB0byByYWNlLicpKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciBsZW5ndGggPSBlbnRyaWVzLmxlbmd0aDtcblxuICAgICAgZnVuY3Rpb24gb25GdWxmaWxsbWVudCh2YWx1ZSkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBvblJlamVjdGlvbihyZWFzb24pIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IHByb21pc2UuX3N0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkc3Vic2NyaWJlKENvbnN0cnVjdG9yLnJlc29sdmUoZW50cmllc1tpXSksIHVuZGVmaW5lZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkcmFjZSQkZGVmYXVsdCA9IGxpYiRyc3ZwJHByb21pc2UkcmFjZSQkcmFjZTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJHJlamVjdCQkcmVqZWN0KHJlYXNvbiwgbGFiZWwpIHtcbiAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuICAgICAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3IobGliJHJzdnAkJGludGVybmFsJCRub29wLCBsYWJlbCk7XG4gICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJHJlamVjdCQkZGVmYXVsdCA9IGxpYiRyc3ZwJHByb21pc2UkcmVqZWN0JCRyZWplY3Q7XG5cbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSQkZ3VpZEtleSA9ICdyc3ZwXycgKyBsaWIkcnN2cCR1dGlscyQkbm93KCkgKyAnLSc7XG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkJGNvdW50ZXIgPSAwO1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcHJvbWlzZSQkbmVlZHNSZXNvbHZlcigpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYSByZXNvbHZlciBmdW5jdGlvbiBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIHByb21pc2UgY29uc3RydWN0b3InKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJCRuZWVkc05ldygpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGYWlsZWQgdG8gY29uc3RydWN0ICdQcm9taXNlJzogUGxlYXNlIHVzZSB0aGUgJ25ldycgb3BlcmF0b3IsIHRoaXMgb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi5cIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZShyZXNvbHZlciwgbGFiZWwpIHtcbiAgICAgIHRoaXMuX2lkID0gbGliJHJzdnAkcHJvbWlzZSQkY291bnRlcisrO1xuICAgICAgdGhpcy5fbGFiZWwgPSBsYWJlbDtcbiAgICAgIHRoaXMuX3N0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcblxuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuaW5zdHJ1bWVudCAmJiBsaWIkcnN2cCRpbnN0cnVtZW50JCRkZWZhdWx0KCdjcmVhdGVkJywgdGhpcyk7XG5cbiAgICAgIGlmIChsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3AgIT09IHJlc29sdmVyKSB7XG4gICAgICAgIHR5cGVvZiByZXNvbHZlciAhPT0gJ2Z1bmN0aW9uJyAmJiBsaWIkcnN2cCRwcm9taXNlJCRuZWVkc1Jlc29sdmVyKCk7XG4gICAgICAgIHRoaXMgaW5zdGFuY2VvZiBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlID8gbGliJHJzdnAkJGludGVybmFsJCRpbml0aWFsaXplUHJvbWlzZSh0aGlzLCByZXNvbHZlcikgOiBsaWIkcnN2cCRwcm9taXNlJCRuZWVkc05ldygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0ID0gbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZTtcblxuICAgIC8vIGRlcHJlY2F0ZWRcbiAgICBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlLmNhc3QgPSBsaWIkcnN2cCRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZS5hbGwgPSBsaWIkcnN2cCRwcm9taXNlJGFsbCQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlLnJhY2UgPSBsaWIkcnN2cCRwcm9taXNlJHJhY2UkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZS5yZXNvbHZlID0gbGliJHJzdnAkcHJvbWlzZSRyZXNvbHZlJCRkZWZhdWx0O1xuICAgIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UucmVqZWN0ID0gbGliJHJzdnAkcHJvbWlzZSRyZWplY3QkJGRlZmF1bHQ7XG5cbiAgICBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlLnByb3RvdHlwZSA9IHtcbiAgICAgIGNvbnN0cnVjdG9yOiBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlLFxuXG4gICAgICBfZ3VpZEtleTogbGliJHJzdnAkcHJvbWlzZSQkZ3VpZEtleSxcblxuICAgICAgX29uRXJyb3I6IGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgdmFyIHByb21pc2UgPSB0aGlzO1xuICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hZnRlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAocHJvbWlzZS5fb25FcnJvcikge1xuICAgICAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWdbJ3RyaWdnZXInXSgnZXJyb3InLCByZWFzb24sIHByb21pc2UuX2xhYmVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgIC8qKlxuICAgICAgVGhlIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsXG4gICAgICB3aGljaCByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZVxuICAgICAgcmVhc29uIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAvLyB1c2VyIGlzIGF2YWlsYWJsZVxuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgLy8gdXNlciBpcyB1bmF2YWlsYWJsZSwgYW5kIHlvdSBhcmUgZ2l2ZW4gdGhlIHJlYXNvbiB3aHlcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIENoYWluaW5nXG4gICAgICAtLS0tLS0tLVxuXG4gICAgICBUaGUgcmV0dXJuIHZhbHVlIG9mIGB0aGVuYCBpcyBpdHNlbGYgYSBwcm9taXNlLiAgVGhpcyBzZWNvbmQsICdkb3duc3RyZWFtJ1xuICAgICAgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZpcnN0IHByb21pc2UncyBmdWxmaWxsbWVudFxuICAgICAgb3IgcmVqZWN0aW9uIGhhbmRsZXIsIG9yIHJlamVjdGVkIGlmIHRoZSBoYW5kbGVyIHRocm93cyBhbiBleGNlcHRpb24uXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHVzZXIubmFtZTtcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgcmV0dXJuICdkZWZhdWx0IG5hbWUnO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAodXNlck5hbWUpIHtcbiAgICAgICAgLy8gSWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGB1c2VyTmFtZWAgd2lsbCBiZSB0aGUgdXNlcidzIG5hbWUsIG90aGVyd2lzZSBpdFxuICAgICAgICAvLyB3aWxsIGJlIGAnZGVmYXVsdCBuYW1lJ2BcbiAgICAgIH0pO1xuXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScpO1xuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgLy8gaWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGByZWFzb25gIHdpbGwgYmUgJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jy5cbiAgICAgICAgLy8gSWYgYGZpbmRVc2VyYCByZWplY3RlZCwgYHJlYXNvbmAgd2lsbCBiZSAnYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScuXG4gICAgICB9KTtcbiAgICAgIGBgYFxuICAgICAgSWYgdGhlIGRvd25zdHJlYW0gcHJvbWlzZSBkb2VzIG5vdCBzcGVjaWZ5IGEgcmVqZWN0aW9uIGhhbmRsZXIsIHJlamVjdGlvbiByZWFzb25zIHdpbGwgYmUgcHJvcGFnYXRlZCBmdXJ0aGVyIGRvd25zdHJlYW0uXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IFBlZGFnb2dpY2FsRXhjZXB0aW9uKCdVcHN0cmVhbSBlcnJvcicpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAvLyBUaGUgYFBlZGdhZ29jaWFsRXhjZXB0aW9uYCBpcyBwcm9wYWdhdGVkIGFsbCB0aGUgd2F5IGRvd24gdG8gaGVyZVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQXNzaW1pbGF0aW9uXG4gICAgICAtLS0tLS0tLS0tLS1cblxuICAgICAgU29tZXRpbWVzIHRoZSB2YWx1ZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgdG8gYSBkb3duc3RyZWFtIHByb21pc2UgY2FuIG9ubHkgYmVcbiAgICAgIHJldHJpZXZlZCBhc3luY2hyb25vdXNseS4gVGhpcyBjYW4gYmUgYWNoaWV2ZWQgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiB0aGVcbiAgICAgIGZ1bGZpbGxtZW50IG9yIHJlamVjdGlvbiBoYW5kbGVyLiBUaGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgdGhlbiBiZSBwZW5kaW5nXG4gICAgICB1bnRpbCB0aGUgcmV0dXJuZWQgcHJvbWlzZSBpcyBzZXR0bGVkLiBUaGlzIGlzIGNhbGxlZCAqYXNzaW1pbGF0aW9uKi5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgICAvLyBUaGUgdXNlcidzIGNvbW1lbnRzIGFyZSBub3cgYXZhaWxhYmxlXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBJZiB0aGUgYXNzaW1saWF0ZWQgcHJvbWlzZSByZWplY3RzLCB0aGVuIHRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCBhbHNvIHJlamVjdC5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIGZ1bGZpbGxzLCB3ZSdsbCBoYXZlIHRoZSB2YWx1ZSBoZXJlXG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgcmVqZWN0cywgd2UnbGwgaGF2ZSB0aGUgcmVhc29uIGhlcmVcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIFNpbXBsZSBFeGFtcGxlXG4gICAgICAtLS0tLS0tLS0tLS0tLVxuXG4gICAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG5cbiAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IGZpbmRSZXN1bHQoKTtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfVxuICAgICAgYGBgXG5cbiAgICAgIEVycmJhY2sgRXhhbXBsZVxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFJlc3VsdChmdW5jdGlvbihyZXN1bHQsIGVycil7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAvLyBmYWlsdXJlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBQcm9taXNlIEV4YW1wbGU7XG5cbiAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgIGZpbmRSZXN1bHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIEFkdmFuY2VkIEV4YW1wbGVcbiAgICAgIC0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgdmFyIGF1dGhvciwgYm9va3M7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGF1dGhvciA9IGZpbmRBdXRob3IoKTtcbiAgICAgICAgYm9va3MgID0gZmluZEJvb2tzQnlBdXRob3IoYXV0aG9yKTtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfVxuICAgICAgYGBgXG5cbiAgICAgIEVycmJhY2sgRXhhbXBsZVxuXG4gICAgICBgYGBqc1xuXG4gICAgICBmdW5jdGlvbiBmb3VuZEJvb2tzKGJvb2tzKSB7XG5cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZmFpbHVyZShyZWFzb24pIHtcblxuICAgICAgfVxuXG4gICAgICBmaW5kQXV0aG9yKGZ1bmN0aW9uKGF1dGhvciwgZXJyKXtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICAvLyBmYWlsdXJlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZpbmRCb29va3NCeUF1dGhvcihhdXRob3IsIGZ1bmN0aW9uKGJvb2tzLCBlcnIpIHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgZm91bmRCb29rcyhib29rcyk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgICAgICAgICAgIGZhaWx1cmUocmVhc29uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBQcm9taXNlIEV4YW1wbGU7XG5cbiAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgIGZpbmRBdXRob3IoKS5cbiAgICAgICAgdGhlbihmaW5kQm9va3NCeUF1dGhvcikuXG4gICAgICAgIHRoZW4oZnVuY3Rpb24oYm9va3Mpe1xuICAgICAgICAgIC8vIGZvdW5kIGJvb2tzXG4gICAgICB9KS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQG1ldGhvZCB0aGVuXG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvbkZ1bGZpbGxtZW50XG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGlvblxuICAgICAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgbGFiZWxpbmcgdGhlIHByb21pc2UuXG4gICAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAgICovXG4gICAgICB0aGVuOiBsaWIkcnN2cCR0aGVuJCRkZWZhdWx0LFxuXG4gICAgLyoqXG4gICAgICBgY2F0Y2hgIGlzIHNpbXBseSBzdWdhciBmb3IgYHRoZW4odW5kZWZpbmVkLCBvblJlamVjdGlvbilgIHdoaWNoIG1ha2VzIGl0IHRoZSBzYW1lXG4gICAgICBhcyB0aGUgY2F0Y2ggYmxvY2sgb2YgYSB0cnkvY2F0Y2ggc3RhdGVtZW50LlxuXG4gICAgICBgYGBqc1xuICAgICAgZnVuY3Rpb24gZmluZEF1dGhvcigpe1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkbid0IGZpbmQgdGhhdCBhdXRob3InKTtcbiAgICAgIH1cblxuICAgICAgLy8gc3luY2hyb25vdXNcbiAgICAgIHRyeSB7XG4gICAgICAgIGZpbmRBdXRob3IoKTtcbiAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICB9XG5cbiAgICAgIC8vIGFzeW5jIHdpdGggcHJvbWlzZXNcbiAgICAgIGZpbmRBdXRob3IoKS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQG1ldGhvZCBjYXRjaFxuICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3Rpb25cbiAgICAgIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGxhYmVsaW5nIHRoZSBwcm9taXNlLlxuICAgICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgICAgQHJldHVybiB7UHJvbWlzZX1cbiAgICAqL1xuICAgICAgJ2NhdGNoJzogZnVuY3Rpb24ob25SZWplY3Rpb24sIGxhYmVsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGlvbiwgbGFiZWwpO1xuICAgICAgfSxcblxuICAgIC8qKlxuICAgICAgYGZpbmFsbHlgIHdpbGwgYmUgaW52b2tlZCByZWdhcmRsZXNzIG9mIHRoZSBwcm9taXNlJ3MgZmF0ZSBqdXN0IGFzIG5hdGl2ZVxuICAgICAgdHJ5L2NhdGNoL2ZpbmFsbHkgYmVoYXZlc1xuXG4gICAgICBTeW5jaHJvbm91cyBleGFtcGxlOlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZEF1dGhvcigpIHtcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEF1dGhvcigpO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gZmluZEF1dGhvcigpOyAvLyBzdWNjZWVkIG9yIGZhaWxcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGZpbmRPdGhlckF1dGhlcigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgLy8gYWx3YXlzIHJ1bnNcbiAgICAgICAgLy8gZG9lc24ndCBhZmZlY3QgdGhlIHJldHVybiB2YWx1ZVxuICAgICAgfVxuICAgICAgYGBgXG5cbiAgICAgIEFzeW5jaHJvbm91cyBleGFtcGxlOlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZEF1dGhvcigpLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIHJldHVybiBmaW5kT3RoZXJBdXRoZXIoKTtcbiAgICAgIH0pLmZpbmFsbHkoZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gYXV0aG9yIHdhcyBlaXRoZXIgZm91bmQsIG9yIG5vdFxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQG1ldGhvZCBmaW5hbGx5XG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgbGFiZWxpbmcgdGhlIHByb21pc2UuXG4gICAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAgICovXG4gICAgICAnZmluYWxseSc6IGZ1bmN0aW9uKGNhbGxiYWNrLCBsYWJlbCkge1xuICAgICAgICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gICAgICAgIHZhciBjb25zdHJ1Y3RvciA9IHByb21pc2UuY29uc3RydWN0b3I7XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3IucmVqZWN0KHJlYXNvbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIGxhYmVsKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGZ1bmN0aW9uICBsaWIkcnN2cCQkaW50ZXJuYWwkJHdpdGhPd25Qcm9taXNlKCkge1xuICAgICAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZXMgY2FsbGJhY2sgY2Fubm90IHJldHVybiB0aGF0IHNhbWUgcHJvbWlzZS4nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3AoKSB7fVxuXG4gICAgdmFyIGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORyAgID0gdm9pZCAwO1xuICAgIHZhciBsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCA9IDE7XG4gICAgdmFyIGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURUQgID0gMjtcblxuICAgIHZhciBsaWIkcnN2cCQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SID0gbmV3IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRXJyb3JPYmplY3QoKTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZ2V0VGhlbihwcm9taXNlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuO1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SLmVycm9yID0gZXJyb3I7XG4gICAgICAgIHJldHVybiBsaWIkcnN2cCQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkdHJ5VGhlbih0aGVuLCB2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcik7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUsIHRoZW4pIHtcbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jKGZ1bmN0aW9uKHByb21pc2UpIHtcbiAgICAgICAgdmFyIHNlYWxlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgZXJyb3IgPSBsaWIkcnN2cCQkaW50ZXJuYWwkJHRyeVRoZW4odGhlbiwgdGhlbmFibGUsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKHNlYWxlZCkgeyByZXR1cm47IH1cbiAgICAgICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgICAgIGlmICh0aGVuYWJsZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSwgdW5kZWZpbmVkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAgIGlmIChzZWFsZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcblxuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICAgIH0sICdTZXR0bGU6ICcgKyAocHJvbWlzZS5fbGFiZWwgfHwgJyB1bmtub3duIHByb21pc2UnKSk7XG5cbiAgICAgICAgaWYgKCFzZWFsZWQgJiYgZXJyb3IpIHtcbiAgICAgICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSwgcHJvbWlzZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSkge1xuICAgICAgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICAgICAgfSBlbHNlIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURUQpIHtcbiAgICAgICAgdGhlbmFibGUuX29uRXJyb3IgPSBudWxsO1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHRoZW5hYmxlLCB1bmRlZmluZWQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKHRoZW5hYmxlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlLCB1bmRlZmluZWQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4pIHtcbiAgICAgIGlmIChtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yID09PSBwcm9taXNlLmNvbnN0cnVjdG9yICYmXG4gICAgICAgICAgdGhlbiA9PT0gbGliJHJzdnAkdGhlbiQkZGVmYXVsdCAmJlxuICAgICAgICAgIGNvbnN0cnVjdG9yLnJlc29sdmUgPT09IGxpYiRyc3ZwJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdCkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoZW4gPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1IpIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBsaWIkcnN2cCQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SLmVycm9yKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGVuID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobGliJHJzdnAkdXRpbHMkJGlzRnVuY3Rpb24odGhlbikpIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpIHtcbiAgICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChsaWIkcnN2cCR1dGlscyQkb2JqZWN0T3JGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlLCBsaWIkcnN2cCQkaW50ZXJuYWwkJGdldFRoZW4odmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRwdWJsaXNoUmVqZWN0aW9uKHByb21pc2UpIHtcbiAgICAgIGlmIChwcm9taXNlLl9vbkVycm9yKSB7XG4gICAgICAgIHByb21pc2UuX29uRXJyb3IocHJvbWlzZS5fcmVzdWx0KTtcbiAgICAgIH1cblxuICAgICAgbGliJHJzdnAkJGludGVybmFsJCRwdWJsaXNoKHByb21pc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSkge1xuICAgICAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHByb21pc2UuX3Jlc3VsdCA9IHZhbHVlO1xuICAgICAgcHJvbWlzZS5fc3RhdGUgPSBsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRDtcblxuICAgICAgaWYgKHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBpZiAobGliJHJzdnAkY29uZmlnJCRjb25maWcuaW5zdHJ1bWVudCkge1xuICAgICAgICAgIGxpYiRyc3ZwJGluc3RydW1lbnQkJGRlZmF1bHQoJ2Z1bGZpbGxlZCcsIHByb21pc2UpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hc3luYyhsaWIkcnN2cCQkaW50ZXJuYWwkJHB1Ymxpc2gsIHByb21pc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbikge1xuICAgICAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcpIHsgcmV0dXJuOyB9XG4gICAgICBwcm9taXNlLl9zdGF0ZSA9IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURUQ7XG4gICAgICBwcm9taXNlLl9yZXN1bHQgPSByZWFzb247XG4gICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hc3luYyhsaWIkcnN2cCQkaW50ZXJuYWwkJHB1Ymxpc2hSZWplY3Rpb24sIHByb21pc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gICAgICB2YXIgc3Vic2NyaWJlcnMgPSBwYXJlbnQuX3N1YnNjcmliZXJzO1xuICAgICAgdmFyIGxlbmd0aCA9IHN1YnNjcmliZXJzLmxlbmd0aDtcblxuICAgICAgcGFyZW50Ll9vbkVycm9yID0gbnVsbDtcblxuICAgICAgc3Vic2NyaWJlcnNbbGVuZ3RoXSA9IGNoaWxkO1xuICAgICAgc3Vic2NyaWJlcnNbbGVuZ3RoICsgbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRURdID0gb25GdWxmaWxsbWVudDtcbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aCArIGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURURdICA9IG9uUmVqZWN0aW9uO1xuXG4gICAgICBpZiAobGVuZ3RoID09PSAwICYmIHBhcmVudC5fc3RhdGUpIHtcbiAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYXN5bmMobGliJHJzdnAkJGludGVybmFsJCRwdWJsaXNoLCBwYXJlbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcHVibGlzaChwcm9taXNlKSB7XG4gICAgICB2YXIgc3Vic2NyaWJlcnMgPSBwcm9taXNlLl9zdWJzY3JpYmVycztcbiAgICAgIHZhciBzZXR0bGVkID0gcHJvbWlzZS5fc3RhdGU7XG5cbiAgICAgIGlmIChsaWIkcnN2cCRjb25maWckJGNvbmZpZy5pbnN0cnVtZW50KSB7XG4gICAgICAgIGxpYiRyc3ZwJGluc3RydW1lbnQkJGRlZmF1bHQoc2V0dGxlZCA9PT0gbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQgPyAnZnVsZmlsbGVkJyA6ICdyZWplY3RlZCcsIHByb21pc2UpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSB7IHJldHVybjsgfVxuXG4gICAgICB2YXIgY2hpbGQsIGNhbGxiYWNrLCBkZXRhaWwgPSBwcm9taXNlLl9yZXN1bHQ7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICAgICAgY2hpbGQgPSBzdWJzY3JpYmVyc1tpXTtcbiAgICAgICAgY2FsbGJhY2sgPSBzdWJzY3JpYmVyc1tpICsgc2V0dGxlZF07XG5cbiAgICAgICAgaWYgKGNoaWxkKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2soZGV0YWlsKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkRXJyb3JPYmplY3QoKSB7XG4gICAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1IgPSBuZXcgbGliJHJzdnAkJGludGVybmFsJCRFcnJvck9iamVjdCgpO1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCR0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZGV0YWlsKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJFRSWV9DQVRDSF9FUlJPUi5lcnJvciA9IGU7XG4gICAgICAgIHJldHVybiBsaWIkcnN2cCQkaW50ZXJuYWwkJFRSWV9DQVRDSF9FUlJPUjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJGludm9rZUNhbGxiYWNrKHNldHRsZWQsIHByb21pc2UsIGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgICAgIHZhciBoYXNDYWxsYmFjayA9IGxpYiRyc3ZwJHV0aWxzJCRpc0Z1bmN0aW9uKGNhbGxiYWNrKSxcbiAgICAgICAgICB2YWx1ZSwgZXJyb3IsIHN1Y2NlZWRlZCwgZmFpbGVkO1xuXG4gICAgICBpZiAoaGFzQ2FsbGJhY2spIHtcbiAgICAgICAgdmFsdWUgPSBsaWIkcnN2cCQkaW50ZXJuYWwkJHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpO1xuXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1IpIHtcbiAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgICAgIGVycm9yID0gdmFsdWUuZXJyb3I7XG4gICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBsaWIkcnN2cCQkaW50ZXJuYWwkJHdpdGhPd25Qcm9taXNlKCkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGRldGFpbDtcbiAgICAgICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcpIHtcbiAgICAgICAgLy8gbm9vcFxuICAgICAgfSBlbHNlIGlmIChoYXNDYWxsYmFjayAmJiBzdWNjZWVkZWQpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoZmFpbGVkKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gbGliJHJzdnAkJGludGVybmFsJCRSRUpFQ1RFRCkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRpbml0aWFsaXplUHJvbWlzZShwcm9taXNlLCByZXNvbHZlcikge1xuICAgICAgdmFyIHJlc29sdmVkID0gZmFsc2U7XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlcihmdW5jdGlvbiByZXNvbHZlUHJvbWlzZSh2YWx1ZSl7XG4gICAgICAgICAgaWYgKHJlc29sdmVkKSB7IHJldHVybjsgfVxuICAgICAgICAgIHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgICB9LCBmdW5jdGlvbiByZWplY3RQcm9taXNlKHJlYXNvbikge1xuICAgICAgICAgIGlmIChyZXNvbHZlZCkgeyByZXR1cm47IH1cbiAgICAgICAgICByZXNvbHZlZCA9IHRydWU7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYWxsJHNldHRsZWQkJEFsbFNldHRsZWQoQ29uc3RydWN0b3IsIGVudHJpZXMsIGxhYmVsKSB7XG4gICAgICB0aGlzLl9zdXBlckNvbnN0cnVjdG9yKENvbnN0cnVjdG9yLCBlbnRyaWVzLCBmYWxzZSAvKiBkb24ndCBhYm9ydCBvbiByZWplY3QgKi8sIGxhYmVsKTtcbiAgICB9XG5cbiAgICBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkQWxsU2V0dGxlZC5wcm90b3R5cGUgPSBsaWIkcnN2cCR1dGlscyQkb19jcmVhdGUobGliJHJzdnAkZW51bWVyYXRvciQkZGVmYXVsdC5wcm90b3R5cGUpO1xuICAgIGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRBbGxTZXR0bGVkLnByb3RvdHlwZS5fc3VwZXJDb25zdHJ1Y3RvciA9IGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkYWxsJHNldHRsZWQkJEFsbFNldHRsZWQucHJvdG90eXBlLl9tYWtlUmVzdWx0ID0gbGliJHJzdnAkZW51bWVyYXRvciQkbWFrZVNldHRsZWRSZXN1bHQ7XG4gICAgbGliJHJzdnAkYWxsJHNldHRsZWQkJEFsbFNldHRsZWQucHJvdG90eXBlLl92YWxpZGF0aW9uRXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ2FsbFNldHRsZWQgbXVzdCBiZSBjYWxsZWQgd2l0aCBhbiBhcnJheScpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkYWxsU2V0dGxlZChlbnRyaWVzLCBsYWJlbCkge1xuICAgICAgcmV0dXJuIG5ldyBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkQWxsU2V0dGxlZChsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LCBlbnRyaWVzLCBsYWJlbCkucHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRkZWZhdWx0ID0gbGliJHJzdnAkYWxsJHNldHRsZWQkJGFsbFNldHRsZWQ7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYWxsJCRhbGwoYXJyYXksIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5hbGwoYXJyYXksIGxhYmVsKTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJGFsbCQkZGVmYXVsdCA9IGxpYiRyc3ZwJGFsbCQkYWxsO1xuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRsZW4gPSAwO1xuICAgIHZhciBsaWIkcnN2cCRhc2FwJCR0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuICAgIHZhciBsaWIkcnN2cCRhc2FwJCR2ZXJ0eE5leHQ7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkYXNhcChjYWxsYmFjaywgYXJnKSB7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRxdWV1ZVtsaWIkcnN2cCRhc2FwJCRsZW5dID0gY2FsbGJhY2s7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRxdWV1ZVtsaWIkcnN2cCRhc2FwJCRsZW4gKyAxXSA9IGFyZztcbiAgICAgIGxpYiRyc3ZwJGFzYXAkJGxlbiArPSAyO1xuICAgICAgaWYgKGxpYiRyc3ZwJGFzYXAkJGxlbiA9PT0gMikge1xuICAgICAgICAvLyBJZiBsZW4gaXMgMSwgdGhhdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gc2NoZWR1bGUgYW4gYXN5bmMgZmx1c2guXG4gICAgICAgIC8vIElmIGFkZGl0aW9uYWwgY2FsbGJhY2tzIGFyZSBxdWV1ZWQgYmVmb3JlIHRoZSBxdWV1ZSBpcyBmbHVzaGVkLCB0aGV5XG4gICAgICAgIC8vIHdpbGwgYmUgcHJvY2Vzc2VkIGJ5IHRoaXMgZmx1c2ggdGhhdCB3ZSBhcmUgc2NoZWR1bGluZy5cbiAgICAgICAgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRkZWZhdWx0ID0gbGliJHJzdnAkYXNhcCQkYXNhcDtcblxuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRicm93c2VyV2luZG93ID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSA/IHdpbmRvdyA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkYnJvd3Nlckdsb2JhbCA9IGxpYiRyc3ZwJGFzYXAkJGJyb3dzZXJXaW5kb3cgfHwge307XG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gbGliJHJzdnAkYXNhcCQkYnJvd3Nlckdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGxpYiRyc3ZwJGFzYXAkJGJyb3dzZXJHbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkaXNOb2RlID0gdHlwZW9mIHNlbGYgPT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYge30udG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nO1xuXG4gICAgLy8gdGVzdCBmb3Igd2ViIHdvcmtlciBidXQgbm90IGluIElFMTBcbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkaXNXb3JrZXIgPSB0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2YgaW1wb3J0U2NyaXB0cyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIHR5cGVvZiBNZXNzYWdlQ2hhbm5lbCAhPT0gJ3VuZGVmaW5lZCc7XG5cbiAgICAvLyBub2RlXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkdXNlTmV4dFRpY2soKSB7XG4gICAgICB2YXIgbmV4dFRpY2sgPSBwcm9jZXNzLm5leHRUaWNrO1xuICAgICAgLy8gbm9kZSB2ZXJzaW9uIDAuMTAueCBkaXNwbGF5cyBhIGRlcHJlY2F0aW9uIHdhcm5pbmcgd2hlbiBuZXh0VGljayBpcyB1c2VkIHJlY3Vyc2l2ZWx5XG4gICAgICAvLyBzZXRJbW1lZGlhdGUgc2hvdWxkIGJlIHVzZWQgaW5zdGVhZCBpbnN0ZWFkXG4gICAgICB2YXIgdmVyc2lvbiA9IHByb2Nlc3MudmVyc2lvbnMubm9kZS5tYXRjaCgvXig/OihcXGQrKVxcLik/KD86KFxcZCspXFwuKT8oXFwqfFxcZCspJC8pO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmVyc2lvbikgJiYgdmVyc2lvblsxXSA9PT0gJzAnICYmIHZlcnNpb25bMl0gPT09ICcxMCcpIHtcbiAgICAgICAgbmV4dFRpY2sgPSBzZXRJbW1lZGlhdGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIG5leHRUaWNrKGxpYiRyc3ZwJGFzYXAkJGZsdXNoKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gdmVydHhcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCR1c2VWZXJ0eFRpbWVyKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBsaWIkcnN2cCRhc2FwJCR2ZXJ0eE5leHQobGliJHJzdnAkYXNhcCQkZmx1c2gpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCR1c2VNdXRhdGlvbk9ic2VydmVyKCkge1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgdmFyIG9ic2VydmVyID0gbmV3IGxpYiRyc3ZwJGFzYXAkJEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGxpYiRyc3ZwJGFzYXAkJGZsdXNoKTtcbiAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7IGNoYXJhY3RlckRhdGE6IHRydWUgfSk7XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgbm9kZS5kYXRhID0gKGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gd2ViIHdvcmtlclxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJHVzZU1lc3NhZ2VDaGFubmVsKCkge1xuICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGliJHJzdnAkYXNhcCQkZmx1c2g7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCR1c2VTZXRUaW1lb3V0KCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGxpYiRyc3ZwJGFzYXAkJGZsdXNoLCAxKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJHF1ZXVlID0gbmV3IEFycmF5KDEwMDApO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJGZsdXNoKCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaWIkcnN2cCRhc2FwJCRsZW47IGkrPTIpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gbGliJHJzdnAkYXNhcCQkcXVldWVbaV07XG4gICAgICAgIHZhciBhcmcgPSBsaWIkcnN2cCRhc2FwJCRxdWV1ZVtpKzFdO1xuXG4gICAgICAgIGNhbGxiYWNrKGFyZyk7XG5cbiAgICAgICAgbGliJHJzdnAkYXNhcCQkcXVldWVbaV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIGxpYiRyc3ZwJGFzYXAkJHF1ZXVlW2krMV0gPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGxpYiRyc3ZwJGFzYXAkJGxlbiA9IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkYXR0ZW1wdFZlcnRleCgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciByID0gcmVxdWlyZTtcbiAgICAgICAgdmFyIHZlcnR4ID0gcigndmVydHgnKTtcbiAgICAgICAgbGliJHJzdnAkYXNhcCQkdmVydHhOZXh0ID0gdmVydHgucnVuT25Mb29wIHx8IHZlcnR4LnJ1bk9uQ29udGV4dDtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJGFzYXAkJHVzZVZlcnR4VGltZXIoKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICByZXR1cm4gbGliJHJzdnAkYXNhcCQkdXNlU2V0VGltZW91dCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRzY2hlZHVsZUZsdXNoO1xuICAgIC8vIERlY2lkZSB3aGF0IGFzeW5jIG1ldGhvZCB0byB1c2UgdG8gdHJpZ2dlcmluZyBwcm9jZXNzaW5nIG9mIHF1ZXVlZCBjYWxsYmFja3M6XG4gICAgaWYgKGxpYiRyc3ZwJGFzYXAkJGlzTm9kZSkge1xuICAgICAgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRyc3ZwJGFzYXAkJHVzZU5leHRUaWNrKCk7XG4gICAgfSBlbHNlIGlmIChsaWIkcnN2cCRhc2FwJCRCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICAgICAgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRyc3ZwJGFzYXAkJHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbiAgICB9IGVsc2UgaWYgKGxpYiRyc3ZwJGFzYXAkJGlzV29ya2VyKSB7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJHJzdnAkYXNhcCQkdXNlTWVzc2FnZUNoYW5uZWwoKTtcbiAgICB9IGVsc2UgaWYgKGxpYiRyc3ZwJGFzYXAkJGJyb3dzZXJXaW5kb3cgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRyc3ZwJGFzYXAkJGF0dGVtcHRWZXJ0ZXgoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRyc3ZwJGFzYXAkJHVzZVNldFRpbWVvdXQoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkZGVmZXIkJGRlZmVyKGxhYmVsKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSB7fTtcblxuICAgICAgZGVmZXJyZWRbJ3Byb21pc2UnXSA9IG5ldyBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0KGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkZWZlcnJlZFsncmVzb2x2ZSddID0gcmVzb2x2ZTtcbiAgICAgICAgZGVmZXJyZWRbJ3JlamVjdCddID0gcmVqZWN0O1xuICAgICAgfSwgbGFiZWwpO1xuXG4gICAgICByZXR1cm4gZGVmZXJyZWQ7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRkZWZlciQkZGVmYXVsdCA9IGxpYiRyc3ZwJGRlZmVyJCRkZWZlcjtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRmaWx0ZXIkJGZpbHRlcihwcm9taXNlcywgZmlsdGVyRm4sIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5hbGwocHJvbWlzZXMsIGxhYmVsKS50aGVuKGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgICBpZiAoIWxpYiRyc3ZwJHV0aWxzJCRpc0Z1bmN0aW9uKGZpbHRlckZuKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJZb3UgbXVzdCBwYXNzIGEgZnVuY3Rpb24gYXMgZmlsdGVyJ3Mgc2Vjb25kIGFyZ3VtZW50LlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoO1xuICAgICAgICB2YXIgZmlsdGVyZWQgPSBuZXcgQXJyYXkobGVuZ3RoKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZmlsdGVyZWRbaV0gPSBmaWx0ZXJGbih2YWx1ZXNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQuYWxsKGZpbHRlcmVkLCBsYWJlbCkudGhlbihmdW5jdGlvbihmaWx0ZXJlZCkge1xuICAgICAgICAgIHZhciByZXN1bHRzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgICAgICAgdmFyIG5ld0xlbmd0aCA9IDA7XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyZWRbaV0pIHtcbiAgICAgICAgICAgICAgcmVzdWx0c1tuZXdMZW5ndGhdID0gdmFsdWVzW2ldO1xuICAgICAgICAgICAgICBuZXdMZW5ndGgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXN1bHRzLmxlbmd0aCA9IG5ld0xlbmd0aDtcblxuICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkZmlsdGVyJCRkZWZhdWx0ID0gbGliJHJzdnAkZmlsdGVyJCRmaWx0ZXI7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoKENvbnN0cnVjdG9yLCBvYmplY3QsIGxhYmVsKSB7XG4gICAgICB0aGlzLl9zdXBlckNvbnN0cnVjdG9yKENvbnN0cnVjdG9yLCBvYmplY3QsIHRydWUsIGxhYmVsKTtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRkZWZhdWx0ID0gbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaDtcblxuICAgIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2gucHJvdG90eXBlID0gbGliJHJzdnAkdXRpbHMkJG9fY3JlYXRlKGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQucHJvdG90eXBlKTtcbiAgICBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoLnByb3RvdHlwZS5fc3VwZXJDb25zdHJ1Y3RvciA9IGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaC5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX3Jlc3VsdCA9IHt9O1xuICAgIH07XG5cbiAgICBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoLnByb3RvdHlwZS5fdmFsaWRhdGVJbnB1dCA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICByZXR1cm4gaW5wdXQgJiYgdHlwZW9mIGlucHV0ID09PSAnb2JqZWN0JztcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaC5wcm90b3R5cGUuX3ZhbGlkYXRpb25FcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignUHJvbWlzZS5oYXNoIG11c3QgYmUgY2FsbGVkIHdpdGggYW4gb2JqZWN0Jyk7XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2gucHJvdG90eXBlLl9lbnVtZXJhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbnVtZXJhdG9yID0gdGhpcztcbiAgICAgIHZhciBwcm9taXNlICAgID0gZW51bWVyYXRvci5wcm9taXNlO1xuICAgICAgdmFyIGlucHV0ICAgICAgPSBlbnVtZXJhdG9yLl9pbnB1dDtcbiAgICAgIHZhciByZXN1bHRzICAgID0gW107XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBpbnB1dCkge1xuICAgICAgICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORyAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaW5wdXQsIGtleSkpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgcG9zaXRpb246IGtleSxcbiAgICAgICAgICAgIGVudHJ5OiBpbnB1dFtrZXldXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGxlbmd0aCA9IHJlc3VsdHMubGVuZ3RoO1xuICAgICAgZW51bWVyYXRvci5fcmVtYWluaW5nID0gbGVuZ3RoO1xuICAgICAgdmFyIHJlc3VsdDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IHByb21pc2UuX3N0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdHNbaV07XG4gICAgICAgIGVudW1lcmF0b3IuX2VhY2hFbnRyeShyZXN1bHQuZW50cnksIHJlc3VsdC5wb3NpdGlvbik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkSGFzaFNldHRsZWQoQ29uc3RydWN0b3IsIG9iamVjdCwgbGFiZWwpIHtcbiAgICAgIHRoaXMuX3N1cGVyQ29uc3RydWN0b3IoQ29uc3RydWN0b3IsIG9iamVjdCwgZmFsc2UsIGxhYmVsKTtcbiAgICB9XG5cbiAgICBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJEhhc2hTZXR0bGVkLnByb3RvdHlwZSA9IGxpYiRyc3ZwJHV0aWxzJCRvX2NyZWF0ZShsaWIkcnN2cCRwcm9taXNlJGhhc2gkJGRlZmF1bHQucHJvdG90eXBlKTtcbiAgICBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJEhhc2hTZXR0bGVkLnByb3RvdHlwZS5fc3VwZXJDb25zdHJ1Y3RvciA9IGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRIYXNoU2V0dGxlZC5wcm90b3R5cGUuX21ha2VSZXN1bHQgPSBsaWIkcnN2cCRlbnVtZXJhdG9yJCRtYWtlU2V0dGxlZFJlc3VsdDtcblxuICAgIGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkSGFzaFNldHRsZWQucHJvdG90eXBlLl92YWxpZGF0aW9uRXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ2hhc2hTZXR0bGVkIG11c3QgYmUgY2FsbGVkIHdpdGggYW4gb2JqZWN0Jyk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkaGFzaFNldHRsZWQob2JqZWN0LCBsYWJlbCkge1xuICAgICAgcmV0dXJuIG5ldyBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJEhhc2hTZXR0bGVkKGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQsIG9iamVjdCwgbGFiZWwpLnByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJGRlZmF1bHQgPSBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJGhhc2hTZXR0bGVkO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGhhc2gkJGhhc2gob2JqZWN0LCBsYWJlbCkge1xuICAgICAgcmV0dXJuIG5ldyBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJGRlZmF1bHQobGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdCwgb2JqZWN0LCBsYWJlbCkucHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJGhhc2gkJGRlZmF1bHQgPSBsaWIkcnN2cCRoYXNoJCRoYXNoO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG1hcCQkbWFwKHByb21pc2VzLCBtYXBGbiwgbGFiZWwpIHtcbiAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LmFsbChwcm9taXNlcywgbGFiZWwpLnRoZW4oZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICAgIGlmICghbGliJHJzdnAkdXRpbHMkJGlzRnVuY3Rpb24obWFwRm4pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIllvdSBtdXN0IHBhc3MgYSBmdW5jdGlvbiBhcyBtYXAncyBzZWNvbmQgYXJndW1lbnQuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGg7XG4gICAgICAgIHZhciByZXN1bHRzID0gbmV3IEFycmF5KGxlbmd0aCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgIHJlc3VsdHNbaV0gPSBtYXBGbih2YWx1ZXNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQuYWxsKHJlc3VsdHMsIGxhYmVsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkbWFwJCRkZWZhdWx0ID0gbGliJHJzdnAkbWFwJCRtYXA7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRSZXN1bHQoKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRub2RlJCRFUlJPUiA9IG5ldyBsaWIkcnN2cCRub2RlJCRSZXN1bHQoKTtcbiAgICB2YXIgbGliJHJzdnAkbm9kZSQkR0VUX1RIRU5fRVJST1IgPSBuZXcgbGliJHJzdnAkbm9kZSQkUmVzdWx0KCk7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRnZXRUaGVuKG9iaikge1xuICAgICAgdHJ5IHtcbiAgICAgICByZXR1cm4gb2JqLnRoZW47XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIGxpYiRyc3ZwJG5vZGUkJEVSUk9SLnZhbHVlPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJG5vZGUkJEVSUk9SO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkdHJ5QXBwbHkoZiwgcywgYSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZi5hcHBseShzLCBhKTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgbGliJHJzdnAkbm9kZSQkRVJST1IudmFsdWUgPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJG5vZGUkJEVSUk9SO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJG1ha2VPYmplY3QoXywgYXJndW1lbnROYW1lcykge1xuICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgdmFyIG5hbWU7XG4gICAgICB2YXIgaTtcbiAgICAgIHZhciBsZW5ndGggPSBfLmxlbmd0aDtcbiAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGxlbmd0aCk7XG5cbiAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbGVuZ3RoOyB4KyspIHtcbiAgICAgICAgYXJnc1t4XSA9IF9beF07XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhcmd1bWVudE5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG5hbWUgPSBhcmd1bWVudE5hbWVzW2ldO1xuICAgICAgICBvYmpbbmFtZV0gPSBhcmdzW2kgKyAxXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRhcnJheVJlc3VsdChfKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gXy5sZW5ndGg7XG4gICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShsZW5ndGggLSAxKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBhcmdzW2kgLSAxXSA9IF9baV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhcmdzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJHdyYXBUaGVuYWJsZSh0aGVuLCBwcm9taXNlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aGVuOiBmdW5jdGlvbihvbkZ1bEZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICAgICAgICAgIHJldHVybiB0aGVuLmNhbGwocHJvbWlzZSwgb25GdWxGaWxsbWVudCwgb25SZWplY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJGRlbm9kZWlmeShub2RlRnVuYywgb3B0aW9ucykge1xuICAgICAgdmFyIGZuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGwgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShsICsgMSk7XG4gICAgICAgIHZhciBhcmc7XG4gICAgICAgIHZhciBwcm9taXNlSW5wdXQgPSBmYWxzZTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgIGFyZyA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgICAgIGlmICghcHJvbWlzZUlucHV0KSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBjbGVhbiB0aGlzIHVwXG4gICAgICAgICAgICBwcm9taXNlSW5wdXQgPSBsaWIkcnN2cCRub2RlJCRuZWVkc1Byb21pc2VJbnB1dChhcmcpO1xuICAgICAgICAgICAgaWYgKHByb21pc2VJbnB1dCA9PT0gbGliJHJzdnAkbm9kZSQkR0VUX1RIRU5fRVJST1IpIHtcbiAgICAgICAgICAgICAgdmFyIHAgPSBuZXcgbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdChsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3ApO1xuICAgICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwLCBsaWIkcnN2cCRub2RlJCRHRVRfVEhFTl9FUlJPUi52YWx1ZSk7XG4gICAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9taXNlSW5wdXQgJiYgcHJvbWlzZUlucHV0ICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgIGFyZyA9IGxpYiRyc3ZwJG5vZGUkJHdyYXBUaGVuYWJsZShwcm9taXNlSW5wdXQsIGFyZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGFyZ3NbaV0gPSBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcHJvbWlzZSA9IG5ldyBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0KGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCk7XG5cbiAgICAgICAgYXJnc1tsXSA9IGZ1bmN0aW9uKGVyciwgdmFsKSB7XG4gICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGVycik7XG4gICAgICAgICAgZWxzZSBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbCk7XG4gICAgICAgICAgZWxzZSBpZiAob3B0aW9ucyA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCBsaWIkcnN2cCRub2RlJCRhcnJheVJlc3VsdChhcmd1bWVudHMpKTtcbiAgICAgICAgICBlbHNlIGlmIChsaWIkcnN2cCR1dGlscyQkaXNBcnJheShvcHRpb25zKSlcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCBsaWIkcnN2cCRub2RlJCRtYWtlT2JqZWN0KGFyZ3VtZW50cywgb3B0aW9ucykpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWwpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChwcm9taXNlSW5wdXQpIHtcbiAgICAgICAgICByZXR1cm4gbGliJHJzdnAkbm9kZSQkaGFuZGxlUHJvbWlzZUlucHV0KHByb21pc2UsIGFyZ3MsIG5vZGVGdW5jLCBzZWxmKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbGliJHJzdnAkbm9kZSQkaGFuZGxlVmFsdWVJbnB1dChwcm9taXNlLCBhcmdzLCBub2RlRnVuYywgc2VsZik7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGZuLl9fcHJvdG9fXyA9IG5vZGVGdW5jO1xuXG4gICAgICByZXR1cm4gZm47XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJG5vZGUkJGRlZmF1bHQgPSBsaWIkcnN2cCRub2RlJCRkZW5vZGVpZnk7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRoYW5kbGVWYWx1ZUlucHV0KHByb21pc2UsIGFyZ3MsIG5vZGVGdW5jLCBzZWxmKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gbGliJHJzdnAkbm9kZSQkdHJ5QXBwbHkobm9kZUZ1bmMsIHNlbGYsIGFyZ3MpO1xuICAgICAgaWYgKHJlc3VsdCA9PT0gbGliJHJzdnAkbm9kZSQkRVJST1IpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVzdWx0LnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJGhhbmRsZVByb21pc2VJbnB1dChwcm9taXNlLCBhcmdzLCBub2RlRnVuYywgc2VsZil7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5hbGwoYXJncykudGhlbihmdW5jdGlvbihhcmdzKXtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGxpYiRyc3ZwJG5vZGUkJHRyeUFwcGx5KG5vZGVGdW5jLCBzZWxmLCBhcmdzKTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gbGliJHJzdnAkbm9kZSQkRVJST1IpIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZXN1bHQudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkbmVlZHNQcm9taXNlSW5wdXQoYXJnKSB7XG4gICAgICBpZiAoYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGlmIChhcmcuY29uc3RydWN0b3IgPT09IGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbGliJHJzdnAkbm9kZSQkZ2V0VGhlbihhcmcpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRwbGF0Zm9ybSQkcGxhdGZvcm07XG5cbiAgICAvKiBnbG9iYWwgc2VsZiAqL1xuICAgIGlmICh0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGxpYiRyc3ZwJHBsYXRmb3JtJCRwbGF0Zm9ybSA9IHNlbGY7XG5cbiAgICAvKiBnbG9iYWwgZ2xvYmFsICovXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgbGliJHJzdnAkcGxhdGZvcm0kJHBsYXRmb3JtID0gZ2xvYmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGdsb2JhbDogYHNlbGZgIG9yIGBnbG9iYWxgIGZvdW5kJyk7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJHBsYXRmb3JtJCRkZWZhdWx0ID0gbGliJHJzdnAkcGxhdGZvcm0kJHBsYXRmb3JtO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHJhY2UkJHJhY2UoYXJyYXksIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5yYWNlKGFycmF5LCBsYWJlbCk7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRyYWNlJCRkZWZhdWx0ID0gbGliJHJzdnAkcmFjZSQkcmFjZTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRyZWplY3QkJHJlamVjdChyZWFzb24sIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5yZWplY3QocmVhc29uLCBsYWJlbCk7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRyZWplY3QkJGRlZmF1bHQgPSBsaWIkcnN2cCRyZWplY3QkJHJlamVjdDtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRyZXNvbHZlJCRyZXNvbHZlKHZhbHVlLCBsYWJlbCkge1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQucmVzb2x2ZSh2YWx1ZSwgbGFiZWwpO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcmVzb2x2ZSQkZGVmYXVsdCA9IGxpYiRyc3ZwJHJlc29sdmUkJHJlc29sdmU7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcmV0aHJvdyQkcmV0aHJvdyhyZWFzb24pIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRocm93IHJlYXNvbjtcbiAgICAgIH0pO1xuICAgICAgdGhyb3cgcmVhc29uO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcmV0aHJvdyQkZGVmYXVsdCA9IGxpYiRyc3ZwJHJldGhyb3ckJHJldGhyb3c7XG5cbiAgICAvLyBkZWZhdWx0c1xuICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jID0gbGliJHJzdnAkYXNhcCQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hZnRlciA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgICBzZXRUaW1lb3V0KGNiLCAwKTtcbiAgICB9O1xuICAgIHZhciBsaWIkcnN2cCQkY2FzdCA9IGxpYiRyc3ZwJHJlc29sdmUkJGRlZmF1bHQ7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGFzeW5jKGNhbGxiYWNrLCBhcmcpIHtcbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jKGNhbGxiYWNrLCBhcmcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRvbigpIHtcbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnWydvbiddLmFwcGx5KGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRvZmYoKSB7XG4gICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1snb2ZmJ10uYXBwbHkobGliJHJzdnAkY29uZmlnJCRjb25maWcsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHVwIGluc3RydW1lbnRhdGlvbiB0aHJvdWdoIGB3aW5kb3cuX19QUk9NSVNFX0lOVFJVTUVOVEFUSU9OX19gXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3dbJ19fUFJPTUlTRV9JTlNUUlVNRU5UQVRJT05fXyddID09PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGxpYiRyc3ZwJCRjYWxsYmFja3MgPSB3aW5kb3dbJ19fUFJPTUlTRV9JTlNUUlVNRU5UQVRJT05fXyddO1xuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWd1cmUoJ2luc3RydW1lbnQnLCB0cnVlKTtcbiAgICAgIGZvciAodmFyIGxpYiRyc3ZwJCRldmVudE5hbWUgaW4gbGliJHJzdnAkJGNhbGxiYWNrcykge1xuICAgICAgICBpZiAobGliJHJzdnAkJGNhbGxiYWNrcy5oYXNPd25Qcm9wZXJ0eShsaWIkcnN2cCQkZXZlbnROYW1lKSkge1xuICAgICAgICAgIGxpYiRyc3ZwJCRvbihsaWIkcnN2cCQkZXZlbnROYW1lLCBsaWIkcnN2cCQkY2FsbGJhY2tzW2xpYiRyc3ZwJCRldmVudE5hbWVdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCR1bWQkJFJTVlAgPSB7XG4gICAgICAncmFjZSc6IGxpYiRyc3ZwJHJhY2UkJGRlZmF1bHQsXG4gICAgICAnUHJvbWlzZSc6IGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQsXG4gICAgICAnYWxsU2V0dGxlZCc6IGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRkZWZhdWx0LFxuICAgICAgJ2hhc2gnOiBsaWIkcnN2cCRoYXNoJCRkZWZhdWx0LFxuICAgICAgJ2hhc2hTZXR0bGVkJzogbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRkZWZhdWx0LFxuICAgICAgJ2Rlbm9kZWlmeSc6IGxpYiRyc3ZwJG5vZGUkJGRlZmF1bHQsXG4gICAgICAnb24nOiBsaWIkcnN2cCQkb24sXG4gICAgICAnb2ZmJzogbGliJHJzdnAkJG9mZixcbiAgICAgICdtYXAnOiBsaWIkcnN2cCRtYXAkJGRlZmF1bHQsXG4gICAgICAnZmlsdGVyJzogbGliJHJzdnAkZmlsdGVyJCRkZWZhdWx0LFxuICAgICAgJ3Jlc29sdmUnOiBsaWIkcnN2cCRyZXNvbHZlJCRkZWZhdWx0LFxuICAgICAgJ3JlamVjdCc6IGxpYiRyc3ZwJHJlamVjdCQkZGVmYXVsdCxcbiAgICAgICdhbGwnOiBsaWIkcnN2cCRhbGwkJGRlZmF1bHQsXG4gICAgICAncmV0aHJvdyc6IGxpYiRyc3ZwJHJldGhyb3ckJGRlZmF1bHQsXG4gICAgICAnZGVmZXInOiBsaWIkcnN2cCRkZWZlciQkZGVmYXVsdCxcbiAgICAgICdFdmVudFRhcmdldCc6IGxpYiRyc3ZwJGV2ZW50cyQkZGVmYXVsdCxcbiAgICAgICdjb25maWd1cmUnOiBsaWIkcnN2cCRjb25maWckJGNvbmZpZ3VyZSxcbiAgICAgICdhc3luYyc6IGxpYiRyc3ZwJCRhc3luY1xuICAgIH07XG5cbiAgICAvKiBnbG9iYWwgZGVmaW5lOnRydWUgbW9kdWxlOnRydWUgd2luZG93OiB0cnVlICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lWydhbWQnXSkge1xuICAgICAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gbGliJHJzdnAkdW1kJCRSU1ZQOyB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZVsnZXhwb3J0cyddKSB7XG4gICAgICBtb2R1bGVbJ2V4cG9ydHMnXSA9IGxpYiRyc3ZwJHVtZCQkUlNWUDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBsaWIkcnN2cCRwbGF0Zm9ybSQkZGVmYXVsdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGxpYiRyc3ZwJHBsYXRmb3JtJCRkZWZhdWx0WydSU1ZQJ10gPSBsaWIkcnN2cCR1bWQkJFJTVlA7XG4gICAgfVxufSkuY2FsbCh0aGlzKTtcblxuIl19
>>>>>>> 26732c1dbf00f39bb7f1f99b621190b69f827969

//# sourceMappingURL=algorithm_visualizer.js.map
