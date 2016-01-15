/* global gadgets */

var RiseVision = RiseVision || {};
RiseVision.TimeDate = {};

RiseVision.TimeDate = (function (gadgets) {
  "use strict";

  var _prefs = new gadgets.Prefs(),
    _additionalParams = null;

  var _message = null;

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

    document.getElementById("container").style.height = _prefs.getInt("rsH") + "px";

    _message = new RiseVision.Common.Message(document.getElementById("container"),
      document.getElementById("messageContainer"));

    _ready();
  }

  function pause() {}

  function play() {}

  function stop() {
    pause();
  }

  return {
    "pause": pause,
    "play": play,
    "setAdditionalParams": setAdditionalParams,
    "stop": stop
  };
})(gadgets);
