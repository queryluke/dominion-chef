export default routesConfig;

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('welcome', {
      url: '/?p',
      template: '<welcome on-build="$ctrl.onBuild()" expansions="$ctrl.$storage.config.expansions"></welcome>'
    })
    .state('inventory', {
      url: '/inventory',
      template: '<inventory expansions="$ctrl.expansions" inventory="$ctrl.inventory" card-types="$ctrl.cardTypes"></inventory>'
    })
    .state('advancedOptions', {
      url: '/advanced-options',
      template: '<advanced-options config="$ctrl.$storage.config" on-build="$ctrl.onBuild()" reset-options="$ctrl.resetOptions()"></advanced-options>'
    })
    .state('playset', {
      url: '/playset',
      template: '<playmat playset="$ctrl.$storage.playset" on-build="$ctrl.onBuild()" errors="$ctrl.errors" ' +
                          'warning="$ctrl.warning" toggle-share="$ctrl.toggleShare()" share-open="$ctrl.shareOpen"></playmat>'
    })
    .state('about', {
      url: '/about',
      template: '<about></about>'
    });
}
