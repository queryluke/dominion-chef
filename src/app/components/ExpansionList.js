class ExpansionListController {
  getIcon(expac) {
    const name = expac.name.toLowerCase().replace(' ', '');
    return `icons.svg#icon-${name}`;
  }
}

export const ExpansionList = {
  templateUrl: 'app/components/ExpansionList.html',
  controller: ExpansionListController,
  bindings: {
    expansions: '<',
    onClickAction: '&'
  }
};
