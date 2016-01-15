/* global RiseVision, gadgets */
(function (window, document, gadgets) {
  "use strict";

  var id = new gadgets.Prefs().getString("id");

  window.oncontextmenu = function () {
    return false;
  };

  document.body.onmousedown = function() {
    return false;
  };

  function configure(names, values) {
    var additionalParams;

    if (Array.isArray(names) && names.length > 0 && names[0] === "additionalParams") {
      if (Array.isArray(values) && values.length > 0 && values[0] !== "") {
        additionalParams = JSON.parse(values[0]);

        RiseVision.TimeDate.setAdditionalParams(additionalParams);
      }
    }
  }

  function pause() {
    RiseVision.TimeDate.pause();
  }

  function play() {
    RiseVision.TimeDate.play();
  }

  function stop() {
    RiseVision.TimeDate.stop();
  }

  if (id && id !== "") {
    gadgets.rpc.register("rscmd_play_" + id, play);
    gadgets.rpc.register("rscmd_pause_" + id, pause);
    gadgets.rpc.register("rscmd_stop_" + id, stop);
    gadgets.rpc.register("rsparam_set_" + id, configure);
    gadgets.rpc.call("", "rsparam_get", null, id, ["additionalParams"]);
  }

})(window, document, gadgets);
