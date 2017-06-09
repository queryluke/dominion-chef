class ShareController {
  /** @ngInject */
  constructor($state, $localStorage) {
    this.$state = $state;
    this.$storage = $localStorage;
  }

  getShareUrl() {
    return `${this.$state.href('welcome', {}, {absolute: true})}?p=${this.$storage.playset.id}`;
  }
}

export const Share = {
  templateUrl: 'app/components/Share.html',
  controller: ShareController,
  bindings: {
    open: '<',
    toggleShare: '&'
  }
};

