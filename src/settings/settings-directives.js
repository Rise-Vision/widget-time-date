angular.module("risevision.clock")
  .directive('colorPicker', function () {
    return {
      restrict: 'A',
      transclude: false,
      link: function (scope, element, attrs) {
        var color = eval('scope.' + attrs.colorPicker).toString().toLowerCase();
        $(element)
          .colorpicker({color: color})
          .find('i').css({backgroundColor: color})
          .end()
          .find('input').focus(function () {
            $(element).colorpicker('show');
          })
          .end()
          .on('changeColor.colorpicker', function (event) {
            if (event.color && event.color.origFormat == 'hex') {
              eval('scope.' + attrs.colorPicker + ' = "' + event.color.toHex() + '"');
            } else {
              eval('scope.' + attrs.colorPicker + ' = "' + event.color.toString() + '"');
            }
            scope.$apply();
          });

      }

    };
  })
  .filter('moment', [
      function () {
        return function (date, method) {
          var momented = moment(date);
          return momented[method].apply(momented, Array.prototype.slice.call(arguments, 2));
        };
      }
  ]);
