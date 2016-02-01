angular.module("risevision.widget.timedate.settings")
  .controller("timedateSettingsController", ["$scope", "$filter", "$log",
    function ($scope, $filter/*, $log*/) {

      $scope.currentDate = new Date();
      $scope.previewText = "";

      $scope.mapAngularTimeFormat = function (momentFormat) {
        var timeToAngular = {
          "h:mm A": "h:mm a",
          "HH:mm": "HH:mm"
        };

        return timeToAngular[momentFormat];
      };

      $scope.mapAngularDateFormat = function (momentFormat) {
        var dateToAngular = {
          "MMMM DD, YYYY": "MMMM dd',' yyyy",
          "MMM DD YYYY": "MMM dd yyyy",
          "MM/DD/YYYY": "MM'/'dd'/'yyyy",
          "DD/MM/YYYY": "dd'/'MM'/'yyyy"
        };

        return dateToAngular[momentFormat];
      };

      $scope.updatePreviewText = function() {
        var text = "";

        if ($scope.settings.additionalParams.showTime) {
          text = $filter("date")($scope.currentDate, $scope.mapAngularTimeFormat($scope.settings.additionalParams.timeFormat));
        }

        if ($scope.settings.additionalParams.showDate) {
          text += ($scope.settings.additionalParams.showTime) ? " " : "";
          text += $filter("date")($scope.currentDate, $scope.mapAngularDateFormat($scope.settings.additionalParams.dateFormat));
        }

        $scope.previewText = text;

      };

      $scope.$watch("settings.additionalParams.showTime", function (value) {
        if (typeof value !== "undefined") {
          $scope.updatePreviewText();
        }
      });

      $scope.$watch("settings.additionalParams.timeFormat", function (value) {
        if (typeof value !== "undefined") {
          $scope.updatePreviewText();
        }
      });

      $scope.$watch("settings.additionalParams.showDate", function (value) {
        if (typeof value !== "undefined") {
          $scope.updatePreviewText();
        }
      });

      $scope.$watch("settings.additionalParams.dateFormat", function (value) {
        if (typeof value !== "undefined") {
          $scope.updatePreviewText();
        }
      });

    }])
  .value("defaultSettings", {
    "params": {},
    "additionalParams": {
      "showTime": true,
      "timeFormat": "h:mm A",
      "showDate": true,
      "dateFormat": "MMMM DD, YYYY",
      "fontStyle":{}
    }
  });
