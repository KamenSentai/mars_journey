(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Audio = function () {
  function Audio() {
    _classCallCheck(this, Audio);

    this.play();
  }

  _createClass(Audio, [{
    key: 'play',
    value: function play() {
      var $sound = new Howl({
        src: ['assets/audios/travel.mp3'],
        autoplay: true,
        loop: true,
        volume: 0.08,
        orientation: [-1, -1, -1]
      });

      var $motor = new Howl({
        src: ['assets/audios/vroum.mp3'],
        autoplay: true,
        loop: true,
        volume: 0.09,
        orientation: [-1, -1, -1]
      });

      var $people = new Howl({
        src: ['assets/audios/people.m4a'],
        autoplay: true,
        loop: true,
        volume: 0.8
      });

      var $radio = new Howl({
        src: ['assets/audios/radio.mp3'],
        autoplay: true,
        loop: true,
        volume: 1,
        orientation: [0, 0, 0]
      });

      var x = -100,
          y = 0,
          z = -20,
          a = 100,
          b = 0,
          c = 40,
          z2 = 10;

      var music = function music() {
        window.requestAnimationFrame(music);
        // Radio and people sound switching side
        if (a > -100 && x < 100) {
          $people.pos(x, y, z);
          x += 0.5;
          $radio.pos(a, b, c);
          a -= 0.5;
        } else if (a == -100 && x == 100) {
          a = 100;
          x = -100;
        }
        // Motor going behind us
        if (z2 > -2) {
          z2 -= 0.01;
          $motor.pos(0, 0, z2);
        }
      };
      music();
    }
  }]);

  return Audio;
}();

exports.default = Audio;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _main = require('../main');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Circle = function () {
  function Circle(x, y, c, r, t) {
    _classCallCheck(this, Circle);

    this.x = x;
    this.y = y;
    this.c = c;
    this.r = r;
    this.t = t;
  }

  _createClass(Circle, [{
    key: 'create',
    value: function create() {
      // Get audio
      var $audio = document.querySelector('audio.tick');

      // Get element
      var $circles = document.querySelector('.circles');

      // Set circle
      var $circle = document.createElement('div');
      $circle.classList.add('circle');
      $circle.classList.add('pos-' + this.x + '-' + this.y);
      $circle.classList.add('slide-' + this.c + '-' + this.r);
      $circle.style.left = this.x + '%';
      $circle.style.top = this.y + '%';

      // Set components
      var $stick_1 = document.createElement('div');
      var $stick_2 = document.createElement('div');
      var $text = document.createElement('p');
      $stick_1.classList.add('stick-1');
      $stick_2.classList.add('stick-2');
      $text.classList.add('text');
      $text.textContent = this.t;

      if (this.x > 50) {
        $circle.classList.add('return');
        $text.style.transformOrigin = '50% 50%';
        $text.style.transform = 'rotateZ(180deg)';
        $text.style.direction = 'rtl';
      }

      // Add circle
      $stick_2.appendChild($text);
      $stick_1.appendChild($stick_2);
      $circle.appendChild($stick_1);
      $circles.appendChild($circle);

      // Move
      var posX = $circle.offsetLeft + $circle.offsetWidth / 2;
      var posY = $circle.offsetTop + $circle.offsetHeight / 2;
      var posCircle = {
        x: posX,
        y: posY
      };

      var moveCircle = function moveCircle(event) {
        if ($circle.classList.contains('shown')) {
          var deltaX = event.clientX - posX;
          var deltaY = event.clientY - posY;

          if (Math.abs(deltaX) <= $circle.offsetWidth * 2.5 && Math.abs(deltaY) <= $circle.offsetHeight * 2.5) {
            $circle.style.transform = 'scale(1.25) translate(' + deltaX * 0.125 + 'px, ' + deltaY * 0.125 + 'px) rotateZ(' + (!$circle.classList.contains('return') ? 0 : 180) + 'deg)';
          } else {
            $circle.style.transform = 'scale(1) translate(0) rotateZ(' + (!$circle.classList.contains('return') ? 0 : 180) + 'deg)';
          }
        }
      };

      var usermove = !Modernizr.touchevents ? 'mousemove' : 'touchmove';
      var userenter = !Modernizr.touchevents ? 'mouseenter' : 'touchstart';
      var userout = !Modernizr.touchevents ? 'mouseout' : 'touchend';

      window.addEventListener(usermove, function (event) {
        moveCircle(event);
      });

      // Play Audio
      $circle.addEventListener(userenter, function () {
        _main.cursor.isMouseDown = true;
        $audio.play();
        $audio.volume = 0.1;

        // Hide other circles
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Array.from($circles.querySelectorAll('.circle'))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var otherCircle = _step.value;

            if (otherCircle.classList.contains('shown') && otherCircle != $circle) {
              otherCircle.style.opacity = '0.125';
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      });
      $circle.addEventListener(userout, function () {
        _main.cursor.isMouseDown = false;

        // Show other circles
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Array.from($circles.querySelectorAll('.circle'))[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var otherCircle = _step2.value;

            if (otherCircle.classList.contains('shown') && otherCircle != $circle) {
              otherCircle.style.opacity = '1';
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      });
    }
  }, {
    key: 'display',
    value: function display() {
      // Display circle
      var $circle = document.querySelector('.pos-' + this.x + '-' + this.y + '.slide-' + this.c + '-' + this.r);
      $circle.classList.add('shown');
      $circle.style.transform = 'scale(1) translate(0) rotateZ(' + (!$circle.classList.contains('return') ? 0 : 180) + 'deg)';
    }
  }, {
    key: 'hide',
    value: function hide() {
      // Hide circle
      var $circle = document.querySelector('.pos-' + this.x + '-' + this.y + '.slide-' + this.c + '-' + this.r);
      $circle.classList.remove('shown');
      $circle.style.transform = 'scale(0) translate(0) rotateZ(' + (!$circle.classList.contains('return') ? 0 : 180) + 'deg)';
    }
  }]);

  return Circle;
}();

exports.default = Circle;

},{"../main":8}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cursor = function () {
  function Cursor() {
    _classCallCheck(this, Cursor);

    this.draw();
  }

  _createClass(Cursor, [{
    key: 'draw',
    value: function draw() {
      var _this = this;

      // Get elements
      var $canvas = document.querySelector('canvas');
      var context = $canvas.getContext('2d');

      // Resize canvas
      var resize = function resize() {
        $canvas.width = window.innerWidth;
        $canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resize);
      resize();

      // Define variables
      this.isMouseDown = false;
      var subDown = 0;
      var radius = 30;
      var width = 0.5;
      var moving = false;

      // Define positions
      var mouse = {
        x: $canvas.width,
        y: $canvas.height
      };
      var circleCoords = {
        x: mouse.x,
        y: mouse.y
      };

      if (!Modernizr.touchevents) {
        // Listen to events
        document.addEventListener('mousedown', function () {
          _this.isMouseDown = true;
        });
        document.addEventListener('mouseup', function () {
          _this.isMouseDown = false;
          radius = 30;
        });
        document.addEventListener('mousemove', function (event) {
          mouse.x = event.clientX;
          mouse.y = event.clientY;
          moving = true;
        });
      } else {
        window.addEventListener('touchmove', function (event) {
          mouse.x = event.touches[0].clientX;
          mouse.y = event.touches[0].clientY;
          moving = true;
        });
      }

      // Animate cursor
      var loopCanvas = function loopCanvas() {
        window.requestAnimationFrame(loopCanvas);

        if (moving) {
          if (radius < 100) radius += 0.5;
          if (width < 1) width += 0.5;
        } else {
          if (radius > 30) radius -= 3;
          if (width > 1) radius -= 0.1;
        }
        moving = false;

        if (_this.isMouseDown) {
          subDown += 0.1;
          radius = Math.max(15, radius - subDown);
        } else {
          subDown = 0;
        }

        // Reset
        context.clearRect(0, 0, $canvas.width, $canvas.height);

        circleCoords.x += (mouse.x - circleCoords.x) * 0.12;
        circleCoords.y += (mouse.y - circleCoords.y) * 0.12;

        // Draw circle
        context.beginPath();
        context.arc(circleCoords.x, circleCoords.y, radius, 0, Math.PI * 2);
        context.strokeStyle = '#FFFFFFA0';
        context.lineWidth = width;
        context.stroke();

        //Draw dot
        context.beginPath();
        context.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        context.fillStyle = '#FFFFFF';
        context.fill();
      };
      loopCanvas();
    }
  }]);

  return Cursor;
}();

exports.default = Cursor;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Frame = function () {
  function Frame() {
    _classCallCheck(this, Frame);

    this.update();
  }

  _createClass(Frame, [{
    key: 'update',
    value: function update() {
      // Get elements
      var $frame = document.querySelector('.frame');
      var $hours = $frame.querySelector('.hours');
      var $minutes = $frame.querySelector('.minutes');
      var $seconds = $frame.querySelector('.seconds');
      var $posA = $frame.querySelector('.pos-a');
      var $posO = $frame.querySelector('.pos-o');

      // Define variables
      var posA = 48.856614;
      var posO = 2.287592;

      // Update time
      setInterval(function () {
        var date = new Date();
        $hours.textContent = '' + (date.getHours() > 9 ? '' : 0) + date.getHours();
        $minutes.textContent = '' + (date.getMinutes() > 9 ? '' : 0) + date.getMinutes();
        $seconds.textContent = '' + (date.getSeconds() > 9 ? '' : 0) + date.getSeconds();
      }, 1000);

      // Update position
      setInterval(function () {
        $posA.textContent = posA.toPrecision(7);
        $posO.textContent = posO.toPrecision(6);
      }, 100);

      if (!Modernizr.touchevents) {
        // Mousemove event
        window.addEventListener('mousemove', function (event) {
          posA += (event.clientX - window.innerWidth / 2) / 100000;
          posO += (event.clientY - window.innerHeight / 2) / 100000;
        });
      } else {
        // Device orientation
        window.addEventListener('deviceorientation', function (event) {
          posA += ((event.alpha + 90) / 180 - 0.5) / 100;
          posO += (event.beta / 90 - 0.5) / 100;
        });
      }
    }
  }]);

  return Frame;
}();

exports.default = Frame;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Loading = function () {
  function Loading() {
    _classCallCheck(this, Loading);

    this.animate();
  }

  _createClass(Loading, [{
    key: 'animate',
    value: function animate() {
      // Get element
      var $loadingPage = document.querySelector('.loadingPage');

      // Set data
      var animData = {
        container: document.getElementById('bodymovin'),
        renderer: 'svg',
        loop: false,
        prerender: false,
        autoplay: true,
        autoloadSegments: false,
        path: 'assets/lottie/v1.json'
      };
      var anim = bodymovin.loadAnimation(animData);

      // Hide loading page
      var hideLoader = function hideLoader() {
        $loadingPage.style.top = '-100%';
      };
      setTimeout(hideLoader, 5000);
    }
  }]);

  return Loading;
}();

exports.default = Loading;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parallax = function () {
  function Parallax() {
    _classCallCheck(this, Parallax);

    this.move();
  }

  _createClass(Parallax, [{
    key: 'move',
    value: function move() {
      // Get elements
      var $parallax = document.querySelectorAll('.parallax');

      // Get elements
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = $parallax[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var $element = _step.value;

          $element.parallaxX = 0;
          $element.parallaxY = 0;
        }

        // Define delta
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var delta = {
        x: 0,
        y: 0
      };

      if (!Modernizr.touchevents) {
        // Mousemove event
        window.addEventListener('mousemove', function (event) {
          delta.x = -(event.clientX / window.innerWidth - 0.5);
          delta.y = -(event.clientY / window.innerHeight - 0.5);
        });
      } else {
        // Device orientation
        window.addEventListener('deviceorientation', function (event) {
          delta.x = -((event.alpha + 90) / 180 - 0.5);
          delta.y = -(event.beta / 90 - 0.5);
        });
      }

      // Animate parallax
      var loop = function loop() {
        window.requestAnimationFrame(loop);

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = $parallax[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _$element = _step2.value;

            _$element.parallaxX += (delta.x / _$element.dataset.depth * 100 - _$element.parallaxX) * 0.1;
            _$element.parallaxY += (delta.y / _$element.dataset.depth * 100 - _$element.parallaxY) * 0.1;

            _$element.style.transform = 'translate(' + _$element.parallaxX + 'px, ' + _$element.parallaxY + 'px)';
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      };
      loop();
    }
  }]);

  return Parallax;
}();

exports.default = Parallax;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Circle = require('./Circle');

var _Circle2 = _interopRequireDefault(_Circle);

var _main = require('../main');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slider = function () {
  function Slider() {
    _classCallCheck(this, Slider);

    this.build();
  }

  _createClass(Slider, [{
    key: 'build',
    value: function build() {
      // Slider elements
      var $slider = document.querySelector('.slider');
      var $slides = Array.from($slider.querySelectorAll('.slide'));
      var $frame = document.querySelector('.frame');
      var $title = $frame.querySelector('.title');
      var $titleChapter = $frame.querySelector('.title-chapter');
      var $textChapter = $frame.querySelector('.text-chapter');
      var $circles = document.querySelector('.circles');
      var $dots = document.querySelector('.dots');

      var dots = new Array();
      var isScrolling = false;
      var isScrolled = false;
      var isClicked = false;
      var isPositive = true;
      var deltaScroll = 0;
      var row = 0;
      var col = 0;
      var move = void 0;
      var blocs = void 0;

      // Responsive
      var isFirefox = /Firefox/i.test(navigator.userAgent);
      var mouseWheelEvent = !isFirefox ? 'mousewheel' : 'DOMMouseScroll';

      // Create indicator when a slide has multple blocs
      var indicateScroll = function indicateScroll() {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = $slides[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var $slide = _step.value;

            var $blocs = Array.from($slide.querySelectorAll('.bloc'));
            if ($blocs.length > 1) {
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = $blocs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var $bloc = _step2.value;

                  var $scroll = document.createElement('span');
                  var $barTop = document.createElement('div');
                  var $barDown = document.createElement('div');

                  $scroll.classList.add('scroll');
                  $barTop.classList.add('top');
                  $barDown.classList.add('down');
                  $scroll.textContent = 'Scroll';

                  $scroll.appendChild($barTop);
                  $scroll.appendChild($barDown);
                  $bloc.appendChild($scroll);
                }
              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      };
      indicateScroll();

      // Create dots
      var createDots = function createDots() {
        for (var index = 0; index < $slides.length; index++) {
          var $dot = document.createElement('div');
          $dot.classList.add('dot');
          $dot.dataset.index = index;
          $dots.appendChild($dot);
          dots.push($dot);
        }

        // Set active dot
        var $activeSlide = $slides.find(function ($slide) {
          return $slide.classList.contains('active');
        });
        var indexActive = $slides.indexOf($activeSlide);
        var $activeDot = Array.from($dots.querySelectorAll('.dot')).find(function ($dot) {
          return $dot.dataset.index == indexActive;
        });
        $activeDot.classList.add('active');
      };
      createDots();

      // Change slide on mousewheel
      window.addEventListener(mouseWheelEvent, function (event) {
        // Update scrolling
        if (!isFirefox) {
          if (event.deltaY >= 0 != isPositive) {
            isPositive = !isPositive;
            deltaScroll = 0;
          }
          deltaScroll += event.deltaY;
        } else if (event.detail >= 0 != isPositive) {
          isPositive = !isPositive;
          deltaScroll = 0;
        }
        deltaScroll += event.detail;

        // Prevent multiple scroll
        if (!isScrolled && !isClicked) {
          // Get active slide
          var $activeSlide = $slides.find(function ($slide) {
            return $slide.classList.contains('active');
          });
          var $blocs = Array.from($activeSlide.querySelectorAll('.bloc'));
          var $activeBloc = $blocs[row];
          blocs = $blocs.length;

          // Scroll down
          if (deltaScroll > 0) {
            // Below bloc
            if (row < blocs - 1) slideDown($activeSlide, $activeBloc);

            // Right slide
            else if (row == blocs - 1) slideRight($activeSlide, $activeBloc);
          }

          // Scoll up
          else if (deltaScroll < 0) {
              // Uppon bloc
              if (row > 0) slideUp($activeSlide, $activeBloc);

              // Left slide
              else if (row == 0) slideLeft($activeSlide, $activeBloc);
            }

          updateSlide();

          isScrolled = true;
          setTimeout(function () {
            isScrolled = false;
          }, 1500);
        }
      });

      // Change slide on keypress
      window.addEventListener('keydown', function (event) {
        // Prevent multiple simultaneous scroll
        if (!isScrolling && !isClicked && (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40)) {
          var $activeSlide = $slides.find(function ($slide) {
            return $slide.classList.contains('active');
          });
          var $blocs = Array.from($activeSlide.querySelectorAll('.bloc'));
          var $activeBloc = $blocs[row];
          blocs = $blocs.length;
          if (event.keyCode == 37 || event.keyCode == 38) {
            isScrolling = true;
            if (row == 0) slideLeft($activeSlide, $activeBloc);else slideUp($activeSlide, $activeBloc);
          }
          if (event.keyCode == 39 || event.keyCode == 40) {
            isScrolling = true;
            if (row == blocs - 1) slideRight($activeSlide, $activeBloc);else slideDown($activeSlide, $activeBloc);
          }
          updateSlide();

          // Resset slide change permission
          setTimeout(function () {
            isScrolling = false;
          }, 1500);
        }
      });

      // Slide to the top
      var slideUp = function slideUp(currentSlide, currentBloc) {
        currentSlide.style.transform = 'translateY(-' + --row * window.innerHeight + 'px)';
        currentBloc.classList.remove('active');
        Array.from(currentSlide.querySelectorAll('.bloc'))[row].classList.add('active');
        move = 'up';
      };

      // Slide to the down
      var slideDown = function slideDown(currentSlide, currentBloc) {
        currentSlide.style.transform = 'translateY(-' + ++row * 100 + '%)';
        currentBloc.classList.remove('active');
        Array.from(currentSlide.querySelectorAll('.bloc'))[row].classList.add('active');
        move = 'down';
      };

      // Slide to the left
      var slideLeft = function slideLeft(currentSlide, currentBloc) {
        // Not first slide
        if (col > 0) {
          col--;
          row = Array.from($slides[col].querySelectorAll('.bloc')).length - 1;
          currentSlide.classList.remove('active');
          currentSlide.style.transform = 'translateX(100%)';
          $slides[col].classList.add('active');
          $slides[col].style.transform = 'translateX(0%) translateY(-' + row * 100 + '%)';
          currentBloc.classList.remove('active');
          Array.from($slides[col].querySelectorAll('.bloc'))[row].classList.add('active');
          move = 'left';

          // Update dots
          dots[col + 1].classList.remove('active');
          dots[col].classList.add('active');
        }
      };

      // Slide to the right
      var slideRight = function slideRight(currentSlide, currentBloc) {
        // Not last slide
        if (col < $slides.length - 1) {
          col++;
          currentSlide.classList.remove('active');
          currentSlide.style.transform = 'translateX(-100%) translateY(-' + row * 100 + '%)';
          $slides[col].classList.add('active');
          $slides[col].style.transform = 'translateX(0%)';
          row = 0;
          currentBloc.classList.remove('active');
          Array.from($slides[col].querySelectorAll('.bloc'))[row].classList.add('active');
          move = 'right';

          // Update dots
          dots[col - 1].classList.remove('active');
          dots[col].classList.add('active');
        }
      };

      // Delete last character of a string
      var reduceString = function reduceString(string) {
        return string.substring(0, string.length - 1);
      };

      var eraseString = function eraseString(element, rewrite, string, speed) {
        element.textContent = '';
        element.style.opacity = '0';
        if (rewrite) {
          writeString(element, string, 0, speed * 2, false);
        }
      };

      // Write a string
      var writeString = function writeString(element, string, index, speed, immediateErase) {
        var content = element.textContent;
        element.style.opacity = '1';
        if (content.length < string.length && !immediateErase) {
          setTimeout(function () {
            if (string[index] != undefined) {
              element.textContent += string[index];
              index++;
              writeString(element, string, index, speed, immediateErase);
            }
          }, speed);
        }
      };

      // Update elements
      var updateCircles = function updateCircles() {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = circlesObjects[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var circleObject = _step3.value;

            if (circleObject.r == row && circleObject.c == col) circleObject.display();else circleObject.hide();
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      };

      var updateSlide = function updateSlide() {
        updateCircles();

        // Exit slide 1
        if (row == 0 && col == 1 && move == 'right') {
          $title.classList.add('hidden');
          setTimeout(function () {
            writeString($titleChapter, titlesChapters[0], 0, 50, false);
            $textChapter.textContent = textsChapters[0][0];
          }, 500);
        }

        // Enter slide 1
        else if (row == 0 && col == 0 && move == 'left') {
            $title.classList.remove('hidden');
            eraseString($titleChapter, false, '', 0);
            $textChapter.textContent = '';
          } else if (move == 'left' || move == 'right') {
            eraseString($titleChapter, true, titlesChapters[col - 1], 25);
            $textChapter.textContent = textsChapters[col - 1][row];
          } else if (move == 'up' || move == 'down' && col != $slides.length - 1 && row != blocs - 1 || move == 'down' && $textChapter.textContent != textsChapters[textsChapters.length - 1][textsChapters[textsChapters.length - 1].length - 1]) {
            $textChapter.textContent = textsChapters[col - 1][row];
          }
      };

      // Title of each chapter
      var titlesChapters = new Array('Take-off', 'On board', 'The journey', 'The risks', 'Welcome to Mars');

      // Text of each chapter
      var textsChapters = new Array(['It\'s time to take off. Let\'s board for 6 months of travel before arriving to the promised land.', 'For your trip, you will embark on the BFR. The new spaceship of Space X. It replaces the Falcon 9, Falcon Heavy and the Dragon capsule used to refuel the International Space Station.'], ['Welcome aboard. This shuttle will be your inhabitant for the next 6 months. It\'s time to learn more about the shuttle.', 'Your life on board will be completely different from the one you lived on land. Pressurization greather than a A380.'], ['You will be free during your days but you must respect the instructions and activity for the good of your body.', 'The daily physical activity that is mandatory for the station\'s long-duration passengers is done with blood, as are the various bodily needs. For food too, habits are changing.'], ['It\'s not without risk of conquering space. That\'s why you\'re forced to be really careful.', 'Many problems may occure because of the lack of gravity.'], ['We have arrived. After 6 months of travel, you will be the first to put your foot on Mars.', 'Your mission of colonization begins, you will have to carry out the tasks of the role entrusted to you and build a new life and a new population.']);

      // Create circles
      var circlesObjects = new Array();

      var t00_1 = 'According to plans unveiled in September 2016, the first flight to Mars would take place in 2024. The project, which would be developed thanks to the profits made by SpaceX and the personal wealth of its founder Elon Musk, will eventually lead to the establishment of a permanent colony on Mars.';
      var c00_1 = new _Circle2.default(20, 60, 0, 0, t00_1);
      circlesObjects.push(c00_1);

      var t00_2 = 'Moon and Mars. This single system—one booster and one ship will eventually replace Falcon 9, Falcon Heavy and Dragon.';
      var c00_2 = new _Circle2.default(80, 70, 0, 0, t00_2);
      circlesObjects.push(c00_2);

      var t10_1 = 'Methane fuel & Tank';
      var c10_1 = new _Circle2.default(10, 70, 1, 0, t10_1);
      circlesObjects.push(c10_1);

      var t10_2 = 'Cabin for up to 100 people and cargo cabin tank';
      var c10_2 = new _Circle2.default(70, 30, 1, 0, t10_2);
      circlesObjects.push(c10_2);

      var t10_3 = 'Liquid oxygen Tank for 6 month of Oxygen';
      var c10_3 = new _Circle2.default(70, 60, 1, 0, t10_3);
      circlesObjects.push(c10_3);

      var t10_4 = 'Built with 9 Raptor engines';
      var c10_4 = new _Circle2.default(75, 75, 1, 0, t10_4);
      circlesObjects.push(c10_4);

      var t20_1 = 'The Earth is a planet of the Solar System, the third closest to the Sun and the fifth largest, both in size and mass, of this planetary system of which it is also the most massive of the Earth.';
      var c20_1 = new _Circle2.default(15, 50, 2, 0, t20_1);
      circlesObjects.push(c20_1);

      var t20_2 = 'The International Space Station is a low-Earth orbiting space station, permanently occupied by an international crew dedicated to scientific research in the space environment. This program, launched and piloted by NASA, is being developed jointly with the Russian Federal Space Agency (FKA), with the participation of European, Japanese and Canadian space agencies.';
      var c20_2 = new _Circle2.default(70, 50, 2, 0, t20_2);
      circlesObjects.push(c20_2);

      var t21_1 = 'Cabins';
      var c21_1 = new _Circle2.default(70, 70, 2, 1, t21_1);
      circlesObjects.push(c21_1);

      var t21_2 = 'Cargo tank';
      var c21_2 = new _Circle2.default(80, 55, 2, 1, t21_2);
      circlesObjects.push(c21_2);

      var t21_3 = 'Liquid oxygen Tank';
      var c21_3 = new _Circle2.default(90, 65, 2, 1, t21_3);
      circlesObjects.push(c21_3);

      var t30_1 = 'In astronomy, the narrower scientific meaning of a star is that of a plasma celestial body that radiates its own light through nuclear fusion reactions, or bodies that have been in this state at a stage in their life cycle, such as white dwarfs or neutron stars.';
      var c30_1 = new _Circle2.default(15, 45, 3, 0, t30_1);
      circlesObjects.push(c30_1);

      var t30_2 = 'Space refers to the areas of the Universe beyond the atmospheres and celestial bodies. This is the almost zero density range that separates the stars. It is also called a space vacuum1. Depending on the designated space locations, it is sometimes referred to as parliamentary, interplanetary, interstellar (or interstellar) and intergalactic space to more precisely designate the space vacuum that is bounded by the Earth-Moon system, planets, stars and galaxies, respectively.';
      var c30_2 = new _Circle2.default(75, 65, 3, 0, t30_2);
      circlesObjects.push(c30_2);

      var t50_1 = 'The Martian relief is characterized by craters, resulting from meteorite impacts, volcanoes, faults, dunes and valleys that are very similar to the terrestrial river valleys. These are the main indication of the presence of water on Mars a long time ago.';
      var c50_1 = new _Circle2.default(25, 55, 5, 0, t50_1);
      circlesObjects.push(c50_1);

      var t50_2 = 'The soil is red because it contains many iron oxides Martian rocks consist of about three times as much iron as earth rocks.';
      var c50_2 = new _Circle2.default(80, 45, 5, 0, t50_2);
      circlesObjects.push(c50_2);

      // Init circles
      var initCircles = function initCircles() {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = circlesObjects[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var circleObject = _step4.value;

            circleObject.create();
            circleObject.hide();
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        c00_1.display();
        c00_2.display();
      };
      initCircles();

      // Update when arrive to destination
      var slideDestination = function slideDestination(destination) {
        if (destination != 0) {
          $titleChapter.style.opacity = '1';
          eraseString($titleChapter, true, titlesChapters[destination - 1], 25);
          $textChapter.textContent = textsChapters[destination - 1][0];
        } else {
          $title.classList.remove('hidden');
          eraseString($titleChapter, false, '', 0);
          $textChapter.textContent = '';
        }
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = $slides[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var slide = _step5.value;

            slide.style.transitionDuration = '0.75s';
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        setTimeout(function () {
          isClicked = false;
        }, 500);
      };

      // Slide to aside
      var slideNext = function slideNext(current, destination) {
        if (current < destination) {
          dots[current].classList.remove('active');
          $slides[current].classList.remove('active');
          $slides[current].style.transform = 'translateX(-100%) translateY(-' + row * 100 + '%)';
          Array.from($slides[current].querySelectorAll('.bloc'))[row].classList.remove('active');
          current++;
          row = 0;
          dots[current].classList.add('active');
          $slides[current].classList.add('active');
          $slides[current].style.transform = 'translateX(0%)';
          Array.from($slides[current].querySelectorAll('.bloc'))[row].classList.add('active');

          setTimeout(function () {
            slideNext(current, destination);
          }, 375);
        } else {
          slideDestination(destination);
          updateCircles();
        }
      };

      // Slide to aside
      var slidePrevious = function slidePrevious(current, destination) {
        if (current > destination) {
          dots[current].classList.remove('active');
          $slides[current].classList.remove('active');
          $slides[current].style.transform = 'translateX(100%) translateY(-' + row * 100 + '%)';
          Array.from($slides[current].querySelectorAll('.bloc'))[row].classList.remove('active');
          current--;
          row = 0;
          dots[current].classList.add('active');
          $slides[current].classList.add('active');
          $slides[current].style.transform = 'translateX(0%)';
          Array.from($slides[current].querySelectorAll('.bloc'))[row].classList.add('active');

          setTimeout(function () {
            slidePrevious(current, destination);
          }, 375);
        } else {
          slideDestination(destination);
          updateCircles();
        }
      };

      // Listen on dots events

      var _loop = function _loop($dot) {
        // Listen on click
        $dot.addEventListener('click', function () {
          var $activeDot = dots.find(function (dot) {
            return dot.classList.contains('active');
          });
          if ($activeDot != $dot && !isClicked) {
            if ($dot != dots[0]) {
              $title.classList.add('hidden');
            }
            $titleChapter.style.opacity = '0';
            $titleChapter.textContent = '';
            $textChapter.textContent = '';
            var _iteratorNormalCompletion18 = true;
            var _didIteratorError18 = false;
            var _iteratorError18 = undefined;

            try {
              for (var _iterator18 = circlesObjects[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
                var circleObject = _step18.value;

                circleObject.hide();
              }
            } catch (err) {
              _didIteratorError18 = true;
              _iteratorError18 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion18 && _iterator18.return) {
                  _iterator18.return();
                }
              } finally {
                if (_didIteratorError18) {
                  throw _iteratorError18;
                }
              }
            }

            isClicked = true;
            if (col < dots.indexOf($dot)) {
              var _iteratorNormalCompletion19 = true;
              var _didIteratorError19 = false;
              var _iteratorError19 = undefined;

              try {
                for (var _iterator19 = $slides[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
                  var slide = _step19.value;

                  slide.style.transitionDuration = '0.125s';
                  if (!slide.classList.contains('active')) {
                    slide.style.transform = 'translateX(100%)';
                  }
                }
              } catch (err) {
                _didIteratorError19 = true;
                _iteratorError19 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion19 && _iterator19.return) {
                    _iterator19.return();
                  }
                } finally {
                  if (_didIteratorError19) {
                    throw _iteratorError19;
                  }
                }
              }

              slideNext(col, dots.indexOf($dot));
              col = dots.indexOf($dot);
              move = 'right';
            } else {
              $textChapter.textContent = '';
              var _iteratorNormalCompletion20 = true;
              var _didIteratorError20 = false;
              var _iteratorError20 = undefined;

              try {
                for (var _iterator20 = $slides[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
                  var _slide = _step20.value;

                  _slide.style.transitionDuration = '0.125s';
                  if (!_slide.classList.contains('active')) {
                    _slide.style.transform = 'translateX(-100%)';
                  }
                }
              } catch (err) {
                _didIteratorError20 = true;
                _iteratorError20 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion20 && _iterator20.return) {
                    _iterator20.return();
                  }
                } finally {
                  if (_didIteratorError20) {
                    throw _iteratorError20;
                  }
                }
              }

              slidePrevious(col, dots.indexOf($dot));
              col = dots.indexOf($dot);
              move = 'left';
            }
          }
        });

        if (!Modernizr.touchevents) {
          // Listen on hover
          $dot.addEventListener('mouseenter', function () {
            _main.cursor.isMouseDown = true;
          });
          $dot.addEventListener('mouseout', function () {
            _main.cursor.isMouseDown = false;
          });
        } else {
          $dot.addEventListener('touchstart', function () {
            _main.cursor.isMouseDown = true;
          });
          $dot.addEventListener('touchend', function () {
            _main.cursor.isMouseDown = false;
          });
        }
      };

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = dots[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var $dot = _step6.value;

          _loop($dot);
        }

        // Replace circles if no match with the background
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      var windowSize = {
        x: window.innerWidth,
        y: window.innerHeight
      };
      var match10 = new Array();
      var match21 = new Array();

      var $c10 = Array.from($circles.querySelectorAll('.slide-1-0'));
      var $c21 = Array.from($circles.querySelectorAll('.slide-2-1'));

      match10.push([$c10[0], c10_1]);
      match10.push([$c10[1], c10_2]);
      match10.push([$c10[2], c10_3]);
      match10.push([$c10[3], c10_4]);
      match21.push([$c21[0], c21_1]);
      match21.push([$c21[1], c21_2]);
      match21.push([$c21[2], c21_3]);

      var replaceCircles = function replaceCircles() {
        windowSize.x = window.innerWidth;
        windowSize.y = window.innerHeight;
        var ratio = windowSize.x / windowSize.y;

        if (ratio < 0.8) {
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = match10[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var c10 = _step7.value;

              c10[0].style.left = c10[1].x + 10 + '%';
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }

          match10[0][0].style.left = match10[0][1].x - 10 + '%';
        }

        if (ratio < 0.9) {
          var _iteratorNormalCompletion8 = true;
          var _didIteratorError8 = false;
          var _iteratorError8 = undefined;

          try {
            for (var _iterator8 = match10[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
              var _c = _step8.value;

              _c[0].style.left = _c[1].x + 5 + '%';
            }
          } catch (err) {
            _didIteratorError8 = true;
            _iteratorError8 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion8 && _iterator8.return) {
                _iterator8.return();
              }
            } finally {
              if (_didIteratorError8) {
                throw _iteratorError8;
              }
            }
          }

          match21[0][0].style.top = match21[0][1].y + 7.5 + '%';
          match21[1][0].style.top = match21[1][1].y + 12.5 + '%';
        }

        if (ratio < 1) {
          var _iteratorNormalCompletion9 = true;
          var _didIteratorError9 = false;
          var _iteratorError9 = undefined;

          try {
            for (var _iterator9 = match21[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
              var c21 = _step9.value;

              c21[0].style.top = c21[1].y + 10 + '%';
            }
          } catch (err) {
            _didIteratorError9 = true;
            _iteratorError9 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion9 && _iterator9.return) {
                _iterator9.return();
              }
            } finally {
              if (_didIteratorError9) {
                throw _iteratorError9;
              }
            }
          }
        }

        if (ratio >= 1 && ratio <= 1.7) {
          var _iteratorNormalCompletion10 = true;
          var _didIteratorError10 = false;
          var _iteratorError10 = undefined;

          try {
            for (var _iterator10 = match10[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
              var _c2 = _step10.value;

              _c2[0].style.left = _c2[1].x + '%';
            }
          } catch (err) {
            _didIteratorError10 = true;
            _iteratorError10 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion10 && _iterator10.return) {
                _iterator10.return();
              }
            } finally {
              if (_didIteratorError10) {
                throw _iteratorError10;
              }
            }
          }

          var _iteratorNormalCompletion11 = true;
          var _didIteratorError11 = false;
          var _iteratorError11 = undefined;

          try {
            for (var _iterator11 = match21[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
              var _c3 = _step11.value;

              _c3[0].style.top = _c3[1].y + '%';
            }
          } catch (err) {
            _didIteratorError11 = true;
            _iteratorError11 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion11 && _iterator11.return) {
                _iterator11.return();
              }
            } finally {
              if (_didIteratorError11) {
                throw _iteratorError11;
              }
            }
          }
        }

        if (ratio > 1.7) {
          var _iteratorNormalCompletion12 = true;
          var _didIteratorError12 = false;
          var _iteratorError12 = undefined;

          try {
            for (var _iterator12 = match10[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
              var _c4 = _step12.value;

              _c4[0].style.left = _c4[1].x - 5 + '%';
            }
          } catch (err) {
            _didIteratorError12 = true;
            _iteratorError12 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion12 && _iterator12.return) {
                _iterator12.return();
              }
            } finally {
              if (_didIteratorError12) {
                throw _iteratorError12;
              }
            }
          }

          match10[0][0].style.left = match10[0][1].x + 5 + '%';
          var _iteratorNormalCompletion13 = true;
          var _didIteratorError13 = false;
          var _iteratorError13 = undefined;

          try {
            for (var _iterator13 = match21[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
              var _c5 = _step13.value;

              _c5[0].style.top = _c5[1].y - 5 + '%';
            }
          } catch (err) {
            _didIteratorError13 = true;
            _iteratorError13 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion13 && _iterator13.return) {
                _iterator13.return();
              }
            } finally {
              if (_didIteratorError13) {
                throw _iteratorError13;
              }
            }
          }
        }

        if (ratio > 2) {
          var _iteratorNormalCompletion14 = true;
          var _didIteratorError14 = false;
          var _iteratorError14 = undefined;

          try {
            for (var _iterator14 = match21[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
              var _c6 = _step14.value;

              _c6[0].style.top = _c6[1].y - 10 + '%';
            }
          } catch (err) {
            _didIteratorError14 = true;
            _iteratorError14 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion14 && _iterator14.return) {
                _iterator14.return();
              }
            } finally {
              if (_didIteratorError14) {
                throw _iteratorError14;
              }
            }
          }
        }

        if (ratio > 2.3) {
          var _iteratorNormalCompletion15 = true;
          var _didIteratorError15 = false;
          var _iteratorError15 = undefined;

          try {
            for (var _iterator15 = match21[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
              var _c7 = _step15.value;

              _c7[0].style.top = _c7[1].y - 15 + '%';
            }
          } catch (err) {
            _didIteratorError15 = true;
            _iteratorError15 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion15 && _iterator15.return) {
                _iterator15.return();
              }
            } finally {
              if (_didIteratorError15) {
                throw _iteratorError15;
              }
            }
          }
        }

        if (ratio > 2.6) {
          var _iteratorNormalCompletion16 = true;
          var _didIteratorError16 = false;
          var _iteratorError16 = undefined;

          try {
            for (var _iterator16 = match21[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
              var _c8 = _step16.value;

              _c8[0].style.top = _c8[1].y - 20 + '%';
            }
          } catch (err) {
            _didIteratorError16 = true;
            _iteratorError16 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion16 && _iterator16.return) {
                _iterator16.return();
              }
            } finally {
              if (_didIteratorError16) {
                throw _iteratorError16;
              }
            }
          }
        }

        if (ratio < 1.2) {
          var _iteratorNormalCompletion17 = true;
          var _didIteratorError17 = false;
          var _iteratorError17 = undefined;

          try {
            for (var _iterator17 = match21[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
              var _c9 = _step17.value;

              _c9[0].style.top = _c9[1].y + 5 + '%';
            }
          } catch (err) {
            _didIteratorError17 = true;
            _iteratorError17 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion17 && _iterator17.return) {
                _iterator17.return();
              }
            } finally {
              if (_didIteratorError17) {
                throw _iteratorError17;
              }
            }
          }
        }
      };
      replaceCircles();

      window.addEventListener('resize', replaceCircles);
    }
  }]);

  return Slider;
}();

exports.default = Slider;

},{"../main":8,"./Circle":2}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cursor = undefined;

var _Loading = require('./components/Loading');

var _Loading2 = _interopRequireDefault(_Loading);

var _Audio = require('./components/Audio');

var _Audio2 = _interopRequireDefault(_Audio);

var _Parallax = require('./components/Parallax');

var _Parallax2 = _interopRequireDefault(_Parallax);

var _Frame = require('./components/Frame');

var _Frame2 = _interopRequireDefault(_Frame);

var _Cursor = require('./components/Cursor');

var _Cursor2 = _interopRequireDefault(_Cursor);

var _Slider = require('./components/Slider');

var _Slider2 = _interopRequireDefault(_Slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loading = new _Loading2.default();
var audio = new _Audio2.default();
var parallax = new _Parallax2.default();
var frame = new _Frame2.default();
var cursor = new _Cursor2.default();
var slider = new _Slider2.default();

exports.cursor = cursor;

},{"./components/Audio":1,"./components/Cursor":3,"./components/Frame":4,"./components/Loading":5,"./components/Parallax":6,"./components/Slider":7}]},{},[8])

//# sourceMappingURL=app.js.map
