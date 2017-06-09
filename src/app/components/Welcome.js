class WelcomeController {
  handleBuild() {
    console.log('build');
    this.onBuild();
  }
}

export const Welcome = {
  templateUrl: 'app/components/Welcome.html',
  controller: WelcomeController,
  bindings: {
    onBuild: '&',
    expansions: '<'
  }
};
