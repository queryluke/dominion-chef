class CardController {
  /** @ngInject */
  constructor($localStorage) {
    this.$storage = $localStorage;
  }

  getCardCost() {
    return this.card.cost.coin.replace('plus', '*');
  }

  getCardTypes() {
    const cardTypes = this.card.types.filter(type => type !== 'supply');
    return cardTypes.join(' - ');
  }

  getCardExpansion(set) {
    if (set) {
      const expac = set.toLowerCase().replace(' ', '');
      return `icons.svg#icon-${expac}`;
    }
  }
}

CardController.$inject = ['$localStorage'];

export const Card = {
  templateUrl: 'app/components/Card.html',
  controller: CardController,
  bindings: {
    card: '<'
  }
};
