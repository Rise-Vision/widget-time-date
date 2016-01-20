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

  it("mapAngularDateFormat() should return a corresponding Angular date format from a moment date format", function () {
    var angularFormat = scope.mapAngularDateFormat("MMMM DD, YYYY");

    expect(angularFormat).to.equal("MMMM dd',' yyyy");
  });

  it("mapAngularTimeFormat() should return a corresponding Angular time format from a moment time format", function () {
    var angularFormat = scope.mapAngularTimeFormat("h:mm A");

    expect(angularFormat).to.equal("h:mm a");
  });

  it("should set value of preview text to include time and date with correct formats", function() {
    var time, date;

    scope.currentDate = new Date();
    scope.$digest();

    time = filter("date")(scope.currentDate, scope.mapAngularTimeFormat(scope.settings.additionalParams.timeFormat));
    date = filter("date")(scope.currentDate, scope.mapAngularDateFormat(scope.settings.additionalParams.dateFormat));

    expect(scope.previewText).to.equal(time + " " + date);

    scope.settings.additionalParams.timeFormat = "HH:mm A";
    scope.settings.additionalParams.dateFormat = "DD/MM/YYYY";
    scope.$digest();

    time = filter("date")(scope.currentDate, scope.mapAngularTimeFormat(scope.settings.additionalParams.timeFormat));
    date = filter("date")(scope.currentDate, scope.mapAngularDateFormat(scope.settings.additionalParams.dateFormat));

    expect(scope.previewText).to.equal(time + " " + date);
  });

  it("should set value of preview text to only include time", function() {
    var time;

    scope.currentDate = new Date();
    scope.settings.additionalParams.showTime = true;
    scope.settings.additionalParams.showDate = false;
    scope.$digest();

    time = filter("date")(scope.currentDate, scope.mapAngularTimeFormat(scope.settings.additionalParams.timeFormat));

    expect(scope.previewText).to.equal(time);
  });

  it("should set value of preview text to only include date", function() {
    var date;

    scope.currentDate = new Date();
    scope.settings.additionalParams.showTime = false;
    scope.settings.additionalParams.showDate = true;
    scope.$digest();

    date = filter("date")(scope.currentDate, scope.mapAngularDateFormat(scope.settings.additionalParams.dateFormat));

    expect(scope.previewText).to.equal(date);
  });

});
