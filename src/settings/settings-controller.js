angular.module("risevision.clock")
    .controller("clock", ["$scope", 'defaultSettings',
        function ($scope, defaultSettings) {
            //Define default scope params
            $scope.settings = defaultSettings;
            $scope.settings.additionalParams.timeFormat = new Date().fromNow;

            $(window).on('alignmentChanged', function () {
                $scope.settings.additionalParams.alignment=arguments[1];
                    $scope.$apply();
            });
        }
    ])
    .value("defaultSettings", {
        "params": {},
        "additionalParams": {
            "FontColor": "#00000",
            "fontSize": "20",
            "FontType": {font: "Arial", type: 'Standard', family: 'Arial'},
            "timeFormat": "12",
            "tFormat": "h:mm A",
            "dFormat": "MMMM DD, YYYY",
            "alignment": "left",
            "HighlightColor": "#EFEFEF",
            "FontStyle": {bold : false , italic : false , underline : false },
            "showTime": true,
            "showDate": true
        }
    });
