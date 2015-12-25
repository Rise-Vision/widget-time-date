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
            "FontColor": "#000",
            "fontSize": "14",
            "FontType": {font: "Times New Roman", type: 'Standard', family: 'Times New Roman'},
            "timeFormat": "12",
            "tFormat": "H:mm",
            "dFormat": "MMMM DD, YYYY",
            "alignment": "left",
            "HighlightColor": "#fff",
            "FontStyle": {bold : false , italic : false , underline : false },
            "showTime": true,
            "showDate": true
        }
    });
