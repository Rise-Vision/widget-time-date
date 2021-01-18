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
        "fontStyle": _additionalParams.fontStyle
      }
    ];

    RiseVision.Common.Utilities.loadFonts(fontSettings);

    _format = (_additionalParams.showTime) ? _additionalParams.timeFormat : "";
    _format += (_additionalParams.showTime && _additionalParams.showDate)? " " : "";
    _format += (_additionalParams.showDate) ? _additionalParams.dateFormat : "";


    _timeAndDateContainer = document.createElement("p");
    _timeAndDateContainer.className = "time-and-date";
    _timeAndDateContainer.style.textAlign = _additionalParams.fontStyle.align;

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
      var currentDate = moment();

      if(_additionalParams.useTimezone){
        currentDate = moment().tz(_additionalParams.timezone);
      }

      _timeAndDateContainer.innerHTML = currentDate.format(_format);

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
      var configParams = {
        "event": "configuration",
        "event_details": JSON.stringify(_additionalParams)
      };

      logEvent( configParams, { severity: "info", debugInfo: JSON.stringify( configParams ) } );
      _configurationLogged = true;
    }

    _draw();
  }

  function stop() {
    pause();
  }

  function getTableName() {
    return "time_date_events";
  }

  function logEvent(params, endpointLoggingFields) {
    if ( endpointLoggingFields ) {
      endpointLoggingFields.eventApp = "widget-time-date";
    }

    RiseVision.Common.LoggerUtils.logEvent(getTableName(), params, endpointLoggingFields);
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
