class AdvancedOptionsController {

  $onInit() {
    this.showHelpText = '';
  }

  toggleHelpText(help) {
    this.showHelpText = this.showHelpText === help ? '' : help;
  }

  handleResetOptions() {
    this.resetOptions();
  }

  handleBuild() {
    this.onBuild();
  }
}

export const AdvancedOptions = {
  templateUrl: 'app/components/AdvancedOptions.html',
  controller: AdvancedOptionsController,
  bindings: {
    config: '<',
    resetOptions: '&',
    onBuild: '&'
  }
};
