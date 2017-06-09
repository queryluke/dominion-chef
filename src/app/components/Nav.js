class NavController {
  /** @ngInject */
  constructor($state) {
    this.$state = $state;
  }

  $onInit() {
    this.showMenu = false;
  }
}

export const Nav = {
  templateUrl: 'app/components/Nav.html',
  controller: NavController
};
