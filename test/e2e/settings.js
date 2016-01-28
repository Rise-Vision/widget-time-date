/* jshint expr: true */

(function () {
  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");
  var expect = chai.expect;

  chai.use(chaiAsPromised);
  browser.driver.manage().window().setSize(1024, 768);

  describe("Time and Date Settings - e2e Testing", function() {

    beforeEach(function () {
      browser.get("/src/settings-e2e.html");
    });

    it("Should load Save button", function () {
      expect(element(by.css("button#save")).isPresent()).to.eventually.be.true;
    });

    it("Should load Cancel button", function () {
      expect(element(by.css("button#cancel")).isPresent()).to.eventually.be.true;
    });

    it("Should load Font Setting component", function () {
      expect(element(by.css("#time-date-font .mce-tinymce")).isPresent()).to.eventually.be.true;
    });

    it("Should select Show Time", function () {
      expect(element(by.model("settings.additionalParams.showTime")).isSelected()).to.eventually.be.true;
    });

    it("Should set time format", function () {
      expect(element(by.model("settings.additionalParams.timeFormat")).getAttribute("value")).to.eventually.equal("h:mm A");
    });

    it("Should select Show Date", function () {
      expect(element(by.model("settings.additionalParams.showDate")).isSelected()).to.eventually.be.true;
    });

    it("Should set date format", function () {
      expect(element(by.model("settings.additionalParams.dateFormat")).getAttribute("value")).to.eventually.equal("MMMM DD, YYYY");
    });

    it("Should enable Save button", function () {
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.false;
    });

    it("Should set form to valid", function () {
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
              "type": "standard",
              "url": ""
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
  });
})();
