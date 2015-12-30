
quizWidget = {

  /**
   * Settings object. this will hold all the settings passed to the widget.
   * Defaults saved here
   * */
  settings: {
      FontType: {
          family: 'Arial'
      },
      HighlightColor: '#efefef',
      FontColor: '#000000',
      FontStyle:
      {
          bold : false ,
          italic : false ,
          underline : false
      },
      fontSize: "20",
      timeFormat: "12",
      tFormat: "h:mm A",
      dFormat: "MMMM DD, YYYY",
      alignment: "left",
      showTime: true,
      showDate: true
  },

  /**
   * Error holder array. In case there will be any error in the settings, we will store them here.
   * */
  errors: [],

  /**
   * @namespace
   * UI Namespace. Deals with all work related to User interface.
   * */
  ui: {

    /**
     * @private
     * Apply the bg and font colors to the viewport.
     * */
    _applyFontColorAndBgColor: function () {
        $('.customFontStyle').css({backgroundColor: this.settings.HighlightColor,color: this.settings.FontColor,textAlign : this.settings.alignment,fontFamily: this.settings.FontType.family,fontSize:this.settings.fontSize+"px",fontWeight: this.settings.FontStyle.bold && 'bold' || 'none',fontStyle: this.settings.FontStyle.italic && 'italic' || 'none',textDecoration: this.settings.FontStyle.underline && 'underline' || 'none'});
        $('.bckstyle').css({backgroundColor: this.settings.HighlightColor});
    },

    /**
     * @private
     * Hide the context menu in the widget.
     * */
    _hideContextMenu: function () {
      window.oncontextmenu = function () {
        return false;
      };
    },

    _showErrors: function(){
       console.log(this.errors);
    },

    /**
     * @public
     * Initialize the UI namespace.
     * */
    init: function () {
      this.ui._applyFontColorAndBgColor();
      this.ui._hideContextMenu();
      if (this.errors.length) {
        this.ui._showErrors();
      } else {
        this.engine.init();
      }
    }
  },

  /**
   * @namespace
   * Engine: Controls all the workflow.
   * */
  engine: {
    paused: true,
    finished: false,
    resume: function () {
      this.engine.paused = false;
      if (this.engine.finished) {
        this.engine.finished = false;
        this.engine.init();
      }
    },
    pause: function () {
      this.engine.paused = true;
    },
    stop: function () {
      this.engine.classes.Timer.stopAll();
      this.engine.finished = true;
    },
    classes: {
      Timer: (function () {
        var timers = [];

        function Timer(max, interval) {
          var intvlId,
              count = max !== false? max : 0,
              emitter = $('<emitter />'),
              parent = quizWidget._bean;

          this.start = function () {
            emitter.trigger('start');
            intvlId = setInterval((function (fn) {
              fn();
              return fn;
            })(function () {
              if (parent.engine.paused) return;
              if (count !== false && !count) {
                setTimeout(function () {
                  emitter.trigger('finish');
                  clearInterval(intvlId);
                }, 10);
                return;
              }
              emitter.trigger('tick', count);
                if(count !== false){
                    count--;
                } else {
                    count++;
                }
            }), interval);
          };

          this.event = emitter;

          this.stop = function () {
            clearInterval(intvlId);
            emitter.trigger('stopped');
          };
          timers.push(this);
        }

        Timer.stopAll = function () {
          timers.filter(function (timer) {
            timer.stop();
          });
        };

        return Timer;
      })()
    },

    refreshTime: function () {
      var that = this;

        var RefreshTimer = new this.engine.classes.Timer(false, 1000);
          RefreshTimer
            .event
            .on('start', function () {

                  if(that.settings.showTime) {
                      document.getElementById("time").innerHTML = moment(new Date()).format(that.settings.tFormat);
                  }else {
                      $('#time').hide();
                  }
                  if(that.settings.showDate) {
                      document.getElementById("datetime").innerHTML = moment(new Date()).format(that.settings.dFormat);
                  }else {
                      $('#datetime').hide();
                  }
              })
            .on('tick', function (event, data) {
                  document.getElementById("time").innerHTML = moment(new Date()).format(that.settings.tFormat);
            })
            .on('finish', function () {
                  RefreshTimer.start();
            });
          RefreshTimer.start();

    },
    finish: function () {
      this.engine.classes.Timer.stopAll();
      this.engine.finished = true;
      this.finish(); //Tell Risevision that we have finished.
    },

    init: function () {
        this.engine.refreshTime();
    }
  },

  /**
   * @namespace
   * Helper functions.
   * */
  helpers: {

    /**
     * @namespace
     * Helper validators
     * */
    validators: {

      /**
       * @public
       * Validate settings provided.
       * */
      validateSettings: function () {

      }
    },

    //Curry this argument to fixed one.
    curryThis: function (fn, thisOpr) {
      return function () {
        return fn.apply(thisOpr, [].slice.call(arguments));
      }
    },
    //Curry all functions in an object deeply.
    ensureThis: function (obj, thisVar) {
      function visit(node) {
        for (var key in node) {
          if (node.hasOwnProperty(key)) {
            if (node[key] && typeof node[key] === 'object' && key.search(/^((_)|(\$))/) == -1) visit(node[key]);
            else if (typeof node[key] === 'function' && key.search(/^[A-Z]/) == -1) node[key] = thisVar.helpers.curryThis(node[key], thisVar);
          }
        }
      }

      visit(obj);
    }
  },
  classes: {
    BaseWidget: function () {
      jQuery.extend(true, this, quizWidget);
      var prefs, id, _this = this;

      this.init = function (window, gadgets) {
        prefs = new gadgets.Prefs();
        id = prefs.getString("id");
        if (id) {
          gadgets.rpc.register("rsparam_set_" + id, this.helpers.curryThis(this.processRPCResponse, this));
          gadgets.rpc.call("", "rsparam_get", null, id, "displayId");
        }
      };
      this.boot = function () {
        gadgets.rpc.call("", "rsparam_get", null, id, "additionalParams");
        gadgets.rpc.register("rscmd_play_" + id, function () {
          if (typeof _this.onPlayCmd == 'function') {
            _this.onPlayCmd.call(_this);
          }
        });
        gadgets.rpc.register("rscmd_pause_" + id, function () {
          if (typeof _this.onPauseCmd == 'function') {
            _this.onPauseCmd.call(_this);
          }
        });
        gadgets.rpc.register("rscmd_stop_" + id, function () {
          if (typeof _this.onStopCmd == 'function') {
            _this.onStopCmd.call(_this);
          }
        });
      };

      this.processRPCResponse = function (name, value) {
        if (name === 'displayId') {
          this.boot();
        } else if (name === "additionalParams") {
          this.getAdditionalParams(value);
        }
      };

      this.getAdditionalParams = function (value) {
        if (value) {
          //This is where the settings data is parsed, and made ready to use.
          _this.settings = JSON.parse(value);
          _this.main.call(_this, true);
        } else {
          _this.main.call(_this, false);
        }
        _this.ready();
      };

      this.run = function () {
        this.init(window, gadgets);
      };

      this.ready = function () {
        console.log('ready');
        gadgets.rpc.call("", "rsevent_ready", null, prefs.getString("id"), true, true, true, true, true);
      };

      this.finish = function () {
        console.log('finish');
        gadgets.rpc.call("", "rsevent_done", null, prefs.getString("id"));
      };
    },
    QuizWidget: function () {
      //Extend from base widget
      quizWidget.classes.BaseWidget.apply(this, arguments);

      this.onPlayCmd = function () {
        console.log('resume');
        this.engine.resume();
      };

      this.onPauseCmd = function () {
        console.log('pause');
        this.engine.pause();
      };

      this.onStopCmd = function () {
        console.log('stop');
        this.engine.stop();
      };

      //Main function to call
      this.main = function (hasSettings) {
        this.helpers.ensureThis(this, this);
        this.i18n.init(function () {
          this.ui.init();
        });
      };
    }
  },
  i18n: {
    messages: {},
    config: {
      prefix: "locales/translation_",
      postfix: '.json',
      defaultLang: 'en'
    },
    requireFile: function (url, callback) {
      $
          .getJSON(url, function (response) {
            callback(response);
          })
          .fail(function () {
            callback({});
          });
    },
    getI18nFileName: function (code) {
      var name = code;
      if (typeof code == 'undefined' || code == null) name = this.i18n.config.defaultLang;
      return this.i18n.config.prefix + name + this.i18n.config.postfix;
    },
    init: function (callback) {
      var that = this;
      this.i18n.requireFile(this.i18n.getI18nFileName(), function (common) {
        that.i18n.requireFile(that.i18n.getI18nFileName((that.settings && that.settings.lang || '').toLowerCase()), function (wanted) {
          that.i18n.messages = jQuery.extend(true, that.i18n.messages, common, wanted);
          callback.call(that);
        });
      });
    }
  },
  init: new function () {
    setTimeout(function () {
      quizWidget.constructor.call(quizWidget)
    });
  },
  constructor: function () {
    this._bean = new this.classes.QuizWidget();
    this._bean.run();
  }
};
