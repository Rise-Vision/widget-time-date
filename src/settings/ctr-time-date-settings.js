/*global moment */
angular.module("risevision.widget.timedate.settings")
  .controller("timedateSettingsController", ["$scope", "$log",
    function ($scope/*, $log*/) {

      $scope.currentDate = moment();
      $scope.previewText = "";

      $scope.getFormattedDate = function (format) {
        return $scope.currentDate.format(format);
      };

      $scope.updatePreviewText = function() {
        var text = "";

        if ($scope.settings.additionalParams.useTimezone) {
           $scope.currentDate = moment.tz($scope.currentDate, $scope.settings.additionalParams.timezone);
        } else {
          $scope.currentDate = moment();
        }

        if ($scope.settings.additionalParams.showTime) {
          text = $scope.currentDate.format($scope.settings.additionalParams.timeFormat);
        }

        if ($scope.settings.additionalParams.showDate) {
          text += ($scope.settings.additionalParams.showTime) ? " " : "";
          text += $scope.currentDate.format($scope.settings.additionalParams.dateFormat);
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

      $scope.$watch("settings.additionalParams.useTimezone", function (value) {
        if (typeof value !== "undefined" && !value) {
          $scope.settings.additionalParams.timezone = "";
          $scope.updatePreviewText();
        }
      });

      $scope.$watch("settings.additionalParams.timezone", function (value) {
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
      "useTimezone": false,
      "timezone": "",
      "fontStyle":{},
    }
  });
