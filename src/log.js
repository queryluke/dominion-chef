export default logConfig;

/** @ngInject */
function logConfig($logProvider) {
  $logProvider.debugEnabled(false);
}
