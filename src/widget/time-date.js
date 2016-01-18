/* global gadgets, moment */

var RiseVision = RiseVision || {};
RiseVision.TimeDate = {};

RiseVision.TimeDate = (function (gadgets) {
  "use strict";

  var _prefs = new gadgets.Prefs(),
    _additionalParams = null;

  var _message = null;
  var _timeoutId;
  var _timeAndDateContainer;
  var _format;
  var _configurationLogged = false;

  /*
   *  Private Methods
   */
  function _init() {

    // Load fonts.
    var fontSettings = [
      {
        "class": "time-and-date",
        "fontSetting": _additionalParams.fontStyle
      }
    ];

    RiseVision.Common.Utilities.loadFonts(fontSettings);

    _format = (_additionalParams.showTime) ? _additionalParams.timeFormat : "";
    _format += (_additionalParams.showTime && _additionalParams.showDate)? " " : "";
    _format += (_additionalParams.showDate) ? _additionalParams.dateFormat : "";


    _timeAndDateContainer = document.createElement("div");
    _timeAndDateContainer.className = "time-and-date";

    document.getElementById("container").appendChild(_timeAndDateContainer);

    _ready();
  }

  /*
   *  Private Methods
   */
  function _ready() {
    gadgets.rpc.call("", "rsevent_ready", null, _prefs.getString("id"),
      true, true, true, true, false);
  }

  /*
   *  Public Methods
   */

  function setAdditionalParams(additionalParams) {
    _additionalParams = JSON.parse(JSON.stringify(additionalParams));

    _additionalParams.width = _prefs.getInt("rsW");
    _additionalParams.height = _prefs.getInt("rsH");

    document.getElementById("container").style.width = _additionalParams.width + "px";
    document.getElementById("container").style.height = _additionalParams.height + "px";

    _message = new RiseVision.Common.Message(document.getElementById("container"),
      document.getElementById("messageContainer"));

    _init();
  }

  function _draw() {

    if (_format) {
      var now = new Date();

      _timeAndDateContainer.innerHTML = moment(now).format(_format);

      _timeoutId = setTimeout(function() {
        _draw();
      }, 1000);
    }
  }

  function pause() {
    clearTimeout(_timeoutId);
  }

  function play() {

    if (!_configurationLogged) {
      logEvent({ "event": "configuration", "event_details": JSON.stringify(_additionalParams)});
      _configurationLogged = true;
    }

    _draw();

    logEvent({ "event": "play", "event_details": _format });
  }

  function stop() {
    pause();
  }

  function getTableName() {
    return "time-date_events";
  }

  function logEvent(params) {
    RiseVision.Common.LoggerUtils.logEvent(getTableName(), params);
  }

  return {
    "pause": pause,
    "play": play,
    "setAdditionalParams": setAdditionalParams,
    "stop": stop,
    "logEvent": logEvent,
    "getTableName": getTableName
  };
})(gadgets);
