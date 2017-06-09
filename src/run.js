export default runConfig;

/** @ngInject */
function runConfig($rootScope) {
  $rootScope.$on('$stateChangeSuccess', (event, to, toParams, from) => {
    $rootScope.$state = to.name;
    $rootScope.$previousState = from.name;
  });
}
