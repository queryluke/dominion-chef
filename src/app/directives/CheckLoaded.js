const CheckLoaded = () => ({
  restrict: 'A',
  link($scope, $element) {
    const hide = function () {
      $element.parent().children().css({display: 'inline-block'});
      $element.css({display: 'none'});
    };

    $element.on('error', () => hide());
  }
});

export default CheckLoaded;
