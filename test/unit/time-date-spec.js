"use strict";

describe("getTableName", function() {
  it("should return the correct table name", function() {
    expect(RiseVision.TimeDate.getTableName(), "time_date_events");
  });
});

describe("logEvent", function() {
  var logSpy;

  beforeEach(function () {
    logSpy = sinon.spy(RiseVision.Common.LoggerUtils, "logEvent");
  });

  afterEach(function() {
    RiseVision.Common.LoggerUtils.logEvent.restore();
  });

  it("should call spy with correct parameters when all optional parameters are set", function() {
    var params = {
      "event": "test",
      "event_details": "test details",
      "company_id": "",
      "display_id": ""
    };

    RiseVision.TimeDate.logEvent({
      "event": "test",
      "event_details": "test details"
    });

    expect(logSpy).to.have.been.calledWith("time_date_events", params);
  });

  it("should call spy with correct parameters when only the event is set", function() {
    var params = {
      "event": "test",
      "company_id": "",
      "display_id": ""
    };

    RiseVision.TimeDate.logEvent({ "event": "test" });

    expect(logSpy).to.have.been.calledWith("time_date_events", params);
  });

  it("should call spy with correct parameters when endpoint logging is included", function() {
    var params = {
      "event": "test",
      "event_details": "test details",
      "company_id": "",
      "display_id": ""
    },
      event = {
        "event": "test",
        "event_details": "test details"
      },
      endpointParams = {
        eventApp: "widget-time-date",
        severity: "info",
        debugInfo: JSON.stringify( event )
      };

    RiseVision.TimeDate.logEvent(event, {
      severity: "info",
      debugInfo: JSON.stringify( event )
    });

    expect(logSpy).to.have.been.calledWith("time_date_events", params, endpointParams);
  });

});
