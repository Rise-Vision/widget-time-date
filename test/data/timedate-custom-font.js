(function(window) {
  "use strict";

  window.gadget = window.gadget || {};
  window.gadget.settings = {
    "params": {},
    "additionalParams": {
      "showTime": true,
      "timeFormat": "h:mm A",
      "showDate": true,
      "dateFormat": "MMMM DD, YYYY",
      "useTimezone": false,
      "timezone": "",
      "fontStyle":{
        "font": {
          "family": "FontAwesome",
          "type": "custom",
          "url": "http://widgets.risevision.com/test/fontawesome-webfont.woff",
        },
        "size": "24px",
        "customSize": "",
        "align": "left",
        "bold": false,
        "italic": false,
        "underline": false,
        "forecolor": "black",
        "backcolor": "transparent"
      }
    }
  };
})(window);
