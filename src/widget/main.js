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
    var additionalParams,
        companyId = "",
        displayId = "";

    if (Array.isArray(names) && names.length > 0 && Array.isArray(values) && values.length > 0) {
      // company id
      if (names[0] === "companyId") {
        companyId = values[0];
      }

      // display id
      if (names[1] === "displayId") {
        if (values[1]) {
          displayId = values[1];
        }
        else {
          displayId = "preview";
        }
      }

      // provide LoggerUtils the ids to use
      RiseVision.Common.LoggerUtils.setIds(companyId, displayId);

      // additional params
      if (names[2] === "additionalParams") {
        additionalParams = JSON.parse(values[2]);

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
    gadgets.rpc.call("", "rsparam_get", null, id, ["companyId", "displayId", "additionalParams"]);
  }

})(window, document, gadgets);
