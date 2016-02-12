/*jshint expr:true */
"use strict";

describe("Unit Tests - Settings Controller", function () {

  var defaultSettings, scope, rootScope, ctrl, filter;

  beforeEach(module("risevision.widget.timedate.settings"));

  beforeEach(inject(function($injector, $rootScope, $controller, $filter) {
    defaultSettings = $injector.get("defaultSettings");
    scope = $rootScope.$new();
    rootScope = $rootScope;
    filter = $filter;

    ctrl = $controller("timedateSettingsController", {
      $scope: scope,
      $filter: filter
    });

    scope.settingsForm = {
      $setValidity: function () {
        return;
      }
    };

    scope.settings = {
      additionalParams: defaultSettings.additionalParams
    };

  }));

  it("should define defaultSettings", function (){
    expect(defaultSettings).to.be.truely;
    expect(defaultSettings).to.be.an("object");
  });

  it("should set value of preview text to include time and date with correct formats", function() {
    var time, date;

    scope.currentDate = moment();
    scope.$digest();

    time = scope.currentDate.format(scope.settings.additionalParams.timeFormat);
    date = scope.currentDate.format(scope.settings.additionalParams.dateFormat);

    expect(scope.previewText).to.equal(time + " " + date);

    scope.settings.additionalParams.timeFormat = "HH:mm A";
    scope.settings.additionalParams.dateFormat = "DD/MM/YYYY";
    scope.$digest();

    time = scope.currentDate.format(scope.settings.additionalParams.timeFormat);
    date = scope.currentDate.format(scope.settings.additionalParams.dateFormat);

    expect(scope.previewText).to.equal(time + " " + date);
  });

  it("should set value of preview text to only include time", function() {
    var time;

    scope.currentDate = moment();
    scope.settings.additionalParams.showTime = true;
    scope.settings.additionalParams.showDate = false;
    scope.$digest();

    time = scope.currentDate.format(scope.settings.additionalParams.timeFormat);

    expect(scope.previewText).to.equal(time);
  });

  it("should set value of preview text to only include date", function() {
    var date;

    scope.currentDate = moment();
    scope.settings.additionalParams.showTime = false;
    scope.settings.additionalParams.showDate = true;
    scope.$digest();

    date = scope.currentDate.format(scope.settings.additionalParams.dateFormat);

    expect(scope.previewText).to.equal(date);
  });


  it("should set value of preview text to include time and date with correct formats", function() {
    var time, date;

    scope.currentDate = moment();
    scope.settings.additionalParams.showTime = true;
    scope.settings.additionalParams.useTimezone = true;
    scope.settings.additionalParams.timezone = "US/Central";
    scope.$digest();

    time = scope.currentDate.tz(scope.settings.additionalParams.timezone).format(scope.settings.additionalParams.timeFormat);
    date = scope.currentDate.tz(scope.settings.additionalParams.timezone).format(scope.settings.additionalParams.dateFormat);

    expect(scope.previewText).to.equal(time + " " + date);

  });

});
