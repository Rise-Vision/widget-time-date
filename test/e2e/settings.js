/* jshint expr: true */

(function () {
  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  describe("Time and Date Settings - e2e Testing", function() {

    beforeEach(function () {
      browser.get("/src/settings-e2e.html");
    });

    it("Should load all components", function () {
      // Widget Button Toolbar
      expect(element(by.css("button#save")).isPresent()).to.eventually.be.true;
      expect(element(by.css("button#cancel")).isPresent()).to.eventually.be.true;

      // Font Setting
      expect(element(by.css("#time-date-font .mce-tinymce")).isPresent()).to.eventually.be.true;

    });

    it("Should correctly load default settings", function () {
      // Show Time should be true
      expect(element(by.model("settings.additionalParams.showTime")).isSelected()).to.eventually.be.true;

      // Time format should be h:mm A
      expect(element(by.model("settings.additionalParams.timeFormat")).getAttribute("value")).to.eventually.equal("h:mm A");

      // Show Date should be true
      expect(element(by.model("settings.additionalParams.showDate")).isSelected()).to.eventually.be.true;

      // Date format should be MMMM DD, YYYY
      expect(element(by.model("settings.additionalParams.dateFormat")).getAttribute("value")).to.eventually.equal("MMMM DD, YYYY");

      // save button should be enabled
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.false;

      // form should be valid
      expect(element(by.css("form[name='settingsForm'].ng-invalid")).isPresent()).to.eventually.be.false;
    });

    it("Should hide Font Setting if both show time and show date are unchecked", function () {
      element(by.model("settings.additionalParams.showTime")).click();
      element(by.model("settings.additionalParams.showDate")).click();

      expect(element(by.css("#time-date-font font-picker")).isPresent()).to.eventually.be.false;
    });

    // Saving
    it("Should correctly save settings", function () {
      var settings = {
        "params": {},
        "additionalParams": {
          "showTime": true,
          "timeFormat": "h:mm A",
          "showDate": true,
          "dateFormat": "MMMM DD, YYYY",
          "fontStyle":{
            "font": {
              "family": "verdana,geneva,sans-serif",
              "type": "standard"
            },
            "size": "24px",
            "align": "left",
            "bold": false,
            "italic": false,
            "underline": false,
            "forecolor": "black",
            "backcolor": "transparent"
          }
        }
      };

      element(by.id("save")).click();

      expect(browser.executeScript("return window.result")).to.eventually.deep.equal({
        "params": "",
        "additionalParams": JSON.stringify(settings.additionalParams)
      });
    });

    it("Should correctly save 24h hours format", function () {
      var settings = {
        "params": {},
        "additionalParams": {
          "showTime": true,
          "timeFormat": "HH:mm",
          "showDate": true,
          "dateFormat": "MMMM DD, YYYY",
          "fontStyle":{
            "font": {
              "family": "verdana,geneva,sans-serif",
              "type": "standard"
            },
            "size": "24px",
            "align": "left",
            "bold": false,
            "italic": false,
            "underline": false,
            "forecolor": "black",
            "backcolor": "transparent"
          }
        }
      };

      element(by.cssContainingText('option', 'widget-time-date.time.formats.twenty-four')).click();

      element(by.id("save")).click();

      expect(browser.executeScript("return window.result")).to.eventually.deep.equal({
        "params": "",
        "additionalParams": JSON.stringify(settings.additionalParams)
      });
    });
  });
})();
